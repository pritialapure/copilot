import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileCheck2, Upload } from "lucide-react";
import { useState } from "react";
import { profileApi } from "../api/queries";
import { Button } from "./Button";
import { ErrorBanner } from "./ErrorBanner";
import { inputClass } from "./Field";

export function ResumeUploadCard({ profile }) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [notice, setNotice] = useState("");
  const uploadMutation = useMutation({
    mutationFn: profileApi.uploadResume,
    onSuccess: () => {
      setFile(null);
      setNotice("Resume replaced successfully. Your matching pipeline has been reset.");
      ["profile", "profile-history", "internships", "matches", "resume-versions", "applications", "notifications", "analytics"].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    }
  });
  const hasResume = Boolean(profile?.resumeText);

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-ink">Resume Upload</h2>
          <p className="text-sm font-semibold text-ink/55">
            {hasResume ? "Profile agent has parsed a resume." : "Upload a PDF resume to start matching."}
          </p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-moss/10 text-moss">
          <FileCheck2 className="h-5 w-5" />
        </div>
      </div>

      <ErrorBanner error={uploadMutation.error} />
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className={inputClass}
          type="file"
          accept="application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <Button
          icon={Upload}
          loading={uploadMutation.isPending}
          disabled={!file}
          onClick={() => {
            setNotice("");
            if (file) uploadMutation.mutate(file);
          }}
        >
          Upload
        </Button>
      </div>

      {notice ? (
        <p className="mt-3 rounded-md bg-moss/10 px-3 py-2 text-sm font-bold text-moss">{notice}</p>
      ) : null}

      <div className="mt-5">
        <h3 className="text-sm font-black uppercase tracking-[0.16em] text-ink/45">Extracted Skills</h3>
        <div className="mt-3 flex min-h-10 flex-wrap gap-2">
          {(profile?.skills || []).length ? (
            profile.skills.slice(0, 12).map((skill) => (
              <span key={skill} className="rounded-full bg-moss/10 px-3 py-1 text-xs font-black text-moss">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm font-semibold text-ink/55">No resume skills extracted yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
