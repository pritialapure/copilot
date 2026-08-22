import { useQuery } from "@tanstack/react-query";
import { Award, BarChart3, BriefcaseBusiness, Percent, TrendingUp } from "lucide-react";
import { analyticsApi } from "../api/queries";
import { LoadingState } from "../components/LoadingState";
import { MetricCard } from "../components/MetricCard";

export function Analytics() {
  const analyticsQuery = useQuery({ queryKey: ["analytics"], queryFn: analyticsApi.get });

  if (analyticsQuery.isLoading) return <LoadingState label="Loading analytics" />;

  const analytics = analyticsQuery.data?.analytics || {};

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total applications" value={analytics.totalApplications || 0} icon={BriefcaseBusiness} tone="ink" />
        <MetricCard label="Interview rate" value={`${analytics.interviewRate || 0}%`} icon={Percent} tone="moss" />
        <MetricCard label="Offer rate" value={`${analytics.offerRate || 0}%`} icon={Award} tone="gold" />
        <MetricCard label="Match effectiveness" value={`${analytics.matchScoreEffectiveness || 0}%`} icon={BarChart3} tone="coral" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">Top-Performing Skills</h2>
          <div className="mt-4 grid gap-3">
            {(analytics.topPerformingSkills || []).length ? (
              analytics.topPerformingSkills.map((item) => (
                <div key={item.skill} className="flex items-center justify-between rounded-md bg-paper p-3">
                  <span className="font-black text-ink">{item.skill}</span>
                  <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-black text-moss">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm font-semibold text-ink/55">No skill performance data yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-gold/15 text-gold">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink">Recommendation Feedback</h2>
              <p className="text-sm font-semibold text-ink/55">Outcome-aware ranking signal</p>
            </div>
          </div>
          <p className="mt-5 rounded-md bg-paper p-4 text-sm font-semibold leading-6 text-ink/65">
            {analytics.recommendationNote}
          </p>
        </div>
      </section>
    </div>
  );
}
