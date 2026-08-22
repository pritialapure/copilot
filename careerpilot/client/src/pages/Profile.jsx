import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { History, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { profileApi } from "../api/queries";
import { Button } from "../components/Button";
import { ErrorBanner } from "../components/ErrorBanner";
import { Field, inputClass } from "../components/Field";
import { LoadingState } from "../components/LoadingState";
import { ResumeUploadCard } from "../components/ResumeUploadCard";
import { formatDate } from "../utils/format";

export function Profile() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const historyQuery = useQuery({ queryKey: ["profile-history"], queryFn: profileApi.history });
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const preferences = profileQuery.data?.profile?.preferences;
    if (preferences) {
      reset({
        roles: preferences.roles?.join(", ") || "",
        location: preferences.location || "",
        workMode: preferences.workMode || "",
        stipendRange: preferences.stipendRange || ""
      });
    }
  }, [profileQuery.data, reset]);

  const preferencesMutation = useMutation({
    mutationFn: profileApi.updatePreferences,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] })
  });

  if (profileQuery.isLoading) return <LoadingState label="Loading profile" />;

  const profile = profileQuery.data?.profile;
  const history = historyQuery.data?.history || [];

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ResumeUploadCard profile={profile} />

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-black text-ink">Preferences</h2>
        <ErrorBanner error={preferencesMutation.error} />
        <form className="mt-4 grid gap-4" onSubmit={handleSubmit((values) => preferencesMutation.mutate(values))}>
          <Field label="Roles">
            <input className={inputClass} placeholder="frontend, mern, ai product" {...register("roles")} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Location">
              <input className={inputClass} placeholder="Remote" {...register("location")} />
            </Field>
            <Field label="Work mode">
              <select className={inputClass} {...register("workMode")}>
                <option value="">Any</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </Field>
            <Field label="Stipend">
              <input className={inputClass} placeholder="Any" {...register("stipendRange")} />
            </Field>
          </div>
          <Button className="justify-self-start" icon={Save} loading={preferencesMutation.isPending}>
            Save Preferences
          </Button>
        </form>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <ProfileBlock label="Projects" items={profile?.projects} />
          <ProfileBlock label="Experience" items={profile?.experience} />
          <ProfileBlock label="Education" items={profile?.education} />
        </div>
      </section>
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-ink/50" />
          <div>
            <h2 className="text-xl font-black text-ink">Resume History</h2>
            <p className="text-sm font-semibold text-ink/55">
              Previous resumes and the results they produced. The dashboard always reflects your latest resume only.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          {history.length ? (
            history.map((entry) => (
              <div key={entry._id} className="rounded-md border border-ink/10 bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-black text-ink">{entry.label || "Previous resume"}</p>
                  <p className="text-xs font-bold text-ink/50">Replaced {formatDate(entry.supersededAt || entry.createdAt)}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(entry.skills || []).slice(0, 12).map((skill) => (
                    <span key={skill} className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-black text-ink/65">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs font-bold text-ink/55">
                  {entry.matchCount || 0} matches ({entry.highMatchCount || 0} high) · {entry.resumeVersionCount || 0} resume versions
                </p>
                {entry.topMatches?.length ? (
                  <ul className="mt-2 grid gap-1 text-sm font-semibold text-ink/65">
                    {entry.topMatches.map((match, index) => (
                      <li key={`${entry._id}-${index}`} className="flex justify-between gap-3">
                        <span>
                          {match.title}
                          {match.company ? ` · ${match.company}` : ""}
                        </span>
                        <span className="font-black text-moss">{match.score}%</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm font-semibold text-ink/55">
              No previous resumes yet. When you upload a new resume, the current one is archived here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileBlock({ label, items = [] }) {
  return (
    <div className="rounded-md bg-paper p-4">
      <h3 className="text-sm font-black text-ink">{label}</h3>
      <ul className="mt-2 grid gap-2 text-sm font-semibold text-ink/60">
        {items.length ? items.slice(0, 4).map((item) => <li key={item}>{item}</li>) : <li>No entries</li>}
      </ul>
    </div>
  );
}
