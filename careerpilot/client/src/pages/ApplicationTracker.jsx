import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { applicationApi } from "../api/queries";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/ErrorBanner";
import { inputClass } from "../components/Field";
import { LoadingState } from "../components/LoadingState";
import { StatusPill } from "../components/StatusPill";
import { formatDate } from "../utils/format";

const statuses = ["SAVED", "PREPARING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function ApplicationTracker() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const applicationsQuery = useQuery({ queryKey: ["applications"], queryFn: applicationApi.list });
  const invalidatePipeline = () => {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => applicationApi.update(id, payload),
    onSuccess: invalidatePipeline
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => applicationApi.remove(id),
    onMutate: (id) => setDeletingId(id),
    onSettled: () => setDeletingId(""),
    onSuccess: invalidatePipeline
  });
  const handleDelete = (application) => {
    const label = application.internship?.title || "this application";
    if (window.confirm(`Remove "${label}" from your tracker? This cannot be undone.`)) {
      deleteMutation.mutate(application._id);
    }
  };

  const applications = applicationsQuery.data?.applications || [];
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return applications.filter((application) =>
      `${application.internship?.title} ${application.internship?.company} ${application.notes}`.toLowerCase().includes(term)
    );
  }, [applications, search]);

  if (applicationsQuery.isLoading) return <LoadingState label="Loading tracker" />;

  return (
    <div className="grid gap-5">
      <ErrorBanner error={updateMutation.error || deleteMutation.error} />
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-ink">Application Tracker</h2>
            <p className="text-sm font-semibold text-ink/55">{filtered.length} tracked applications</p>
          </div>
          <label className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input className={`${inputClass} pl-10`} value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-6">
        {statuses.map((status) => (
          <div key={status} className="min-h-96 rounded-lg border border-ink/10 bg-white p-3 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-2">
              <StatusPill status={status} />
              <span className="text-xs font-black text-ink/40">
                {filtered.filter((application) => application.status === status).length}
              </span>
            </div>
            <div className="grid gap-3">
              {filtered
                .filter((application) => application.status === status)
                .map((application) => (
                  <ApplicationCard
                    key={application._id}
                    application={application}
                    onUpdate={(payload) => updateMutation.mutate({ id: application._id, payload })}
                    onDelete={() => handleDelete(application)}
                    isUpdating={updateMutation.isPending && !deletingId}
                    isDeleting={deletingId === application._id}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ApplicationCard({ application, onUpdate, onDelete, isUpdating, isDeleting }) {
  const [notes, setNotes] = useState(application.notes || "");
  const disabled = isUpdating || isDeleting;

  useEffect(() => {
    setNotes(application.notes || "");
  }, [application.notes]);

  return (
    <article className={`rounded-md border border-ink/10 bg-paper p-3 ${isDeleting ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-black leading-5 text-ink">{application.internship?.title}</h3>
          <p className="text-xs font-bold text-ink/50">{application.internship?.company}</p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label="Remove application from tracker"
          title="Remove from tracker"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-ink/10 bg-white text-ink/45 transition hover:border-coral/40 hover:text-coral disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="mt-3 grid gap-2">
        <select
          className="min-h-10 rounded-md border border-ink/10 bg-white px-2 text-xs font-bold outline-none focus:border-moss"
          value={application.status}
          onChange={(event) => onUpdate({ status: event.target.value })}
          disabled={disabled}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          className="min-h-10 rounded-md border border-ink/10 bg-white px-2 text-xs font-bold outline-none focus:border-moss"
          type="date"
          value={application.nextActionDate ? String(application.nextActionDate).slice(0, 10) : ""}
          onChange={(event) => onUpdate({ nextActionDate: event.target.value })}
          disabled={disabled}
        />
        <textarea
          className="min-h-24 rounded-md border border-ink/10 bg-white px-2 py-2 text-xs font-semibold outline-none focus:border-moss"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={disabled}
        />
        <Button className="min-h-9 px-3 text-xs" variant="secondary" icon={Save} loading={isUpdating} disabled={disabled} onClick={() => onUpdate({ notes })}>
          Save
        </Button>
      </div>
      <p className="mt-3 text-[11px] font-bold text-ink/45">Next: {formatDate(application.nextActionDate)}</p>
    </article>
  );
}
