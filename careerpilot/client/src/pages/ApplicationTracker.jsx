import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, Calendar, FileText, GripHorizontal } from 'lucide-react';
import { applicationApi } from '../api/queries';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import StatusPill from '../components/StatusPill';
import Modal from '../components/Modal';
import Field from '../components/Field';
import { cx, formatDate } from '../utils/format';
import Breadcrumbs from '../components/Breadcrumbs';

const STATUS_ORDER = ['SAVED', 'PREPARING', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

export function ApplicationTracker() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ nextActionDate: '', notes: '' });

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationApi.list
  });

  const applications = applicationsData?.applications || [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => applicationApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => applicationApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setDeletingId(null);
    }
  });

  const groupedByStatus = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = applications.filter(app => app.status === status);
    return acc;
  }, {});

  if (isLoading) return <LoadingState message="Loading applications..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/' },
        { label: 'Application Tracker' }
      ]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-ink mb-1">📋 Application Tracker</h1>
          <p className="text-ink/60">Track your applications across the pipeline</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-moss">{applications.length}</p>
          <p className="text-xs font-semibold text-ink/60">Total Applications</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATUS_ORDER.map((status) => {
          const apps = groupedByStatus[status];
          const statusLabels = {
            SAVED: '💾 Saved',
            PREPARING: '✏️ Preparing',
            APPLIED: '✅ Applied',
            INTERVIEW: '🎤 Interview',
            OFFER: '🎉 Offer',
            REJECTED: '❌ Rejected'
          };

          return (
            <div key={status} className="flex flex-col">
              {/* Column Header */}
              <div className="mb-4">
                <h3 className="font-black text-ink mb-2 flex items-center justify-between">
                  {statusLabels[status]}
                  <Badge variant="neutral">{apps.length}</Badge>
                </h3>
                <div className="h-1 bg-ink/10 rounded-full"></div>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1">
                {apps.length > 0 ? (
                  apps.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-lg border border-ink/10 p-3 shadow-soft hover:shadow-soft-lg transition space-y-2 group"
                    >
                      <div className="flex gap-2 items-start">
                        <GripHorizontal className="w-3 h-3 text-ink/30 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-ink line-clamp-2">
                            {app.internship?.title}
                          </p>
                          <p className="text-xs text-ink/60">{app.internship?.company}</p>
                        </div>
                      </div>

                      {app.nextActionDate && (
                        <div className="flex items-center gap-1 text-xs text-ink/50 bg-ink/5 rounded px-2 py-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(app.nextActionDate)}</span>
                        </div>
                      )}

                      {app.notes && (
                        <p className="text-xs text-ink/60 line-clamp-2 italic">"{app.notes}"</p>
                      )}

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => setEditingId(app._id)}
                          className="flex-1 px-2 py-1 bg-moss/10 hover:bg-moss/20 text-moss text-xs font-bold rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(app._id)}
                          className="px-2 py-1 bg-coral/10 hover:bg-coral/20 text-coral transition rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-ink/40">
                    <p className="text-xs font-semibold">No applications</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Application"
        size="sm"
        footer={
          <>
            <Button onClick={() => setDeletingId(null)} variant="secondary">Cancel</Button>
            <Button
              onClick={() => deleteMutation.mutate(deletingId)}
              isLoading={deleteMutation.isPending}
              variant="danger"
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-ink/70">Are you sure you want to delete this application? This action cannot be undone.</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title="Update Application"
        size="md"
        footer={
          <>
            <Button onClick={() => setEditingId(null)} variant="secondary">Cancel</Button>
            <Button
              onClick={() => {
                updateMutation.mutate({ id: editingId, data: formData });
              }}
              isLoading={updateMutation.isPending}
              variant="primary"
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Next Action Date"
            type="date"
            value={formData.nextActionDate}
            onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
          />
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this application..."
              className="w-full px-4 py-2 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss bg-white text-ink"
              rows="4"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
