import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Bell, BriefcaseBusiness, Compass, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { applicationApi, internshipApi, matchApi, materialApi, notificationApi, profileApi } from "../api/queries";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/ErrorBanner";
import { LoadingState } from "../components/LoadingState";
import { MetricCard } from "../components/MetricCard";
import { StatusPill } from "../components/StatusPill";
import { WorkflowGraph } from "../components/WorkflowGraph";
import { formatDate } from "../utils/format";

export function Dashboard() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const profile = profileQuery.data?.profile;
  const hasResume = Boolean(profile?.resumeText);
  const internshipsQuery = useQuery({
    queryKey: ["internships"],
    queryFn: internshipApi.list,
    enabled: hasResume
  });
  const applicationsQuery = useQuery({ queryKey: ["applications"], queryFn: applicationApi.list });
  const notificationsQuery = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });
  const resumeVersionsQuery = useQuery({ queryKey: ["resume-versions"], queryFn: materialApi.list });

  const syncMutation = useMutation({
    mutationFn: internshipApi.sync,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["internships"] })
  });
  const matchMutation = useMutation({
    mutationFn: matchApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internships"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    }
  });

  if (profileQuery.isLoading || (hasResume && internshipsQuery.isLoading) || applicationsQuery.isLoading) {
    return <LoadingState label="Preparing workspace" />;
  }

  const internships = internshipsQuery.data?.internships || [];
  const applications = applicationsQuery.data?.applications || [];
  const notifications = notificationsQuery.data?.notifications || [];
  const resumeVersions = resumeVersionsQuery.data?.resumeVersions || [];
  const highMatches = internships.filter((item) => item.match?.score >= 70);
  const nextApplications = applications.slice(0, 4);

  return (
    <div className="grid gap-6">
      <ErrorBanner error={syncMutation.error || matchMutation.error} />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Internships" value={internships.length} icon={Compass} tone="moss" />
        <MetricCard label="High matches" value={highMatches.length} icon={Sparkles} tone="gold" />
        <MetricCard label="Applications" value={applications.length} icon={BriefcaseBusiness} tone="ink" />
        <MetricCard label="Unread alerts" value={notifications.filter((item) => !item.read).length} icon={Bell} tone="coral" />
      </section>

      <WorkflowGraph
        className="min-h-[270px]"
        profile={profile}
        internships={internships}
        applications={applications}
        notifications={notifications}
        resumeVersions={resumeVersions}
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-ink">Ranked Opportunities</h2>
              <p className="text-sm font-semibold text-ink/55">Current recommendation queue</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                icon={RefreshCw}
                loading={syncMutation.isPending}
                disabled={!hasResume}
                onClick={() => syncMutation.mutate()}
              >
                Sync
              </Button>
              <Button
                icon={BarChart3}
                loading={matchMutation.isPending}
                disabled={!hasResume || internships.length === 0}
                onClick={() => matchMutation.mutate()}
              >
                Match
              </Button>
            </div>
          </div>
          {hasResume ? (
            <div className="grid gap-3">
              {internships.length ? (
                internships
                  .slice()
                  .sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0))
                  .slice(0, 5)
                  .map((internship) => (
                    <Link
                      key={internship._id}
                      to={`/internships/${internship._id}`}
                      className="grid gap-3 rounded-md border border-ink/10 p-4 transition hover:border-moss/50 md:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <h3 className="font-black text-ink">{internship.title}</h3>
                        <p className="text-sm font-semibold text-ink/55">
                          {internship.company} - {internship.location}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-2xl font-black text-moss">{internship.match?.score || 0}%</p>
                        <p className="text-xs font-bold text-ink/50">Due {formatDate(internship.deadline)}</p>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="rounded-md border border-dashed border-ink/15 bg-paper p-5 text-sm font-semibold text-ink/60">
                  No opportunities loaded yet. Use Sync after uploading your resume.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-ink/15 bg-paper p-5 text-sm font-semibold text-ink/60">
              Upload your resume first. Discovery and ranking will appear after the Profile Agent has data to match.
            </div>
          )}
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-ink">Profile Snapshot</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(profileQuery.data?.profile?.skills || []).slice(0, 12).map((skill) => (
                <span key={skill} className="rounded-full bg-moss/10 px-3 py-1 text-xs font-black text-moss">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-ink">Tracker</h2>
            <div className="mt-4 grid gap-3">
              {nextApplications.length ? (
                nextApplications.map((application) => (
                  <div key={application._id} className="flex items-center justify-between gap-3 rounded-md bg-paper p-3">
                    <div>
                      <p className="text-sm font-black text-ink">{application.internship?.title}</p>
                      <p className="text-xs font-bold text-ink/50">{application.internship?.company}</p>
                    </div>
                    <StatusPill status={application.status} />
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-ink/55">No saved applications yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
