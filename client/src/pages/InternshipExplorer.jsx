import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, ExternalLink, Filter, Loader2, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { applicationApi, internshipApi, matchApi } from "../api/queries";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/ErrorBanner";
import { inputClass } from "../components/Field";
import { LoadingState } from "../components/LoadingState";
import { formatDate } from "../utils/format";

export function InternshipExplorer() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [externallyAppliedId, setExternallyAppliedId] = useState("");
  const internshipsQuery = useQuery({ queryKey: ["internships"], queryFn: internshipApi.list });
  const syncMutation = useMutation({
    mutationFn: internshipApi.sync,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["internships"] })
  });
  const matchMutation = useMutation({
    mutationFn: matchApi.generate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["internships"] })
  });
  const externalApplyMutation = useMutation({
    mutationFn: (internship) => applicationApi.create({ internshipId: internship._id, status: "APPLIED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const internships = internshipsQuery.data?.internships || [];
  const sources = [...new Set(internships.map((item) => item.source).filter(Boolean))];
  const filtered = useMemo(() => {
    const value = search.toLowerCase();
    return internships
      .filter((item) => (source ? item.source === source : true))
      .filter((item) => `${item.title} ${item.company} ${item.description}`.toLowerCase().includes(value))
      .sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));
  }, [internships, search, source]);

  if (internshipsQuery.isLoading) return <LoadingState label="Loading internships" />;

  const handleExternalApply = async (event, internship) => {
    event.preventDefault();
    const externalWindow = window.open("about:blank", "_blank");
    try {
      await externalApplyMutation.mutateAsync(internship);
      setExternallyAppliedId(internship._id);
      if (externalWindow) {
        externalWindow.opener = null;
        externalWindow.location.href = internship.applyLink;
      } else {
        window.open(internship.applyLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      if (externalWindow) externalWindow.close();
    }
  };

  return (
    <div className="grid gap-5">
      <ErrorBanner error={syncMutation.error || matchMutation.error || externalApplyMutation.error} />
      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-ink">Internship Explorer</h2>
            <p className="text-sm font-semibold text-ink/55">{filtered.length} opportunities</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" icon={RefreshCw} loading={syncMutation.isPending} onClick={() => syncMutation.mutate()}>
              Sync
            </Button>
            <Button icon={BarChart3} loading={matchMutation.isPending} onClick={() => matchMutation.mutate()}>
              Generate Matches
            </Button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input className={`${inputClass} pl-10`} value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <select className={`${inputClass} pl-10`} value={source} onChange={(event) => setSource(event.target.value)}>
              <option value="">All sources</option>
              {sources.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((internship) => (
          <article key={internship._id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-ink">{internship.title}</h3>
                <p className="text-sm font-semibold text-ink/55">{internship.company}</p>
              </div>
              <div className="grid h-14 w-16 place-items-center rounded-md bg-moss/10 text-xl font-black text-moss">
                {internship.match?.score || 0}%
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-ink/65">{internship.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {internship.skillsRequired?.slice(0, 5).map((skill) => (
                <span key={skill} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-black text-ink/65">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-ink/50">
              <span>{internship.location}</span>
              <span>Due {formatDate(internship.deadline)}</span>
            </div>
            <div className="mt-5 flex gap-2">
              <Link
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-moss/50"
                to={`/internships/${internship._id}`}
              >
                Details
              </Link>
              <a
                className={`grid h-10 w-10 place-items-center rounded-md border border-ink/10 text-ink transition hover:text-moss ${
                  externalApplyMutation.isPending ? "cursor-not-allowed opacity-60" : ""
                }`}
                href={internship.applyLink}
                onClick={(event) => {
                  if (externalApplyMutation.isPending) {
                    event.preventDefault();
                    return;
                  }
                  handleExternalApply(event, internship);
                }}
                target="_blank"
                rel="noreferrer"
                aria-disabled={externalApplyMutation.isPending}
                aria-label={
                  externallyAppliedId === internship._id
                    ? "Application recorded and page opened"
                    : "Open application page"
                }
              >
                {externalApplyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : externallyAppliedId === internship._id ? (
                  <CheckCircle2 className="h-4 w-4 text-moss" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
              </a>
            </div>
            {externallyAppliedId === internship._id ? (
              <p className="mt-3 text-xs font-black text-moss">Applied externally and saved to Tracker.</p>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
