import {
  BellRing,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  Radar,
  Route
} from "lucide-react";
import { cx } from "../utils/format";

const OUTCOME_STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export function WorkflowGraph({
  className = "",
  profile,
  internships = [],
  applications = [],
  notifications = [],
  resumeVersions = []
}) {
  // Each node reflects a real, distinct stage of the per-user pipeline so the
  // graph advances as the user makes progress instead of lighting up all at once.
  // TODO: Derive each stage flag from the real pipeline state: a parsed resume, discovered
  // TODO: internships, generated matches, computed skill gaps, a tailored resume version,
  // TODO: a tracked application, a recorded outcome, and any raised notification.
  const hasResume = false;
  const hasInternships = false;
  const hasMatches = false;
  const hasSkillGaps = false;
  const hasResumeVersion = false;
  const hasApplication = false;
  const hasOutcome = false;
  const hasAlert = false;

  const nodes = [
    { label: "Profile Agent", icon: FileText, active: hasResume },
    { label: "Discovery Agent", icon: Radar, active: hasInternships },
    { label: "Matching Agent", icon: BrainCircuit, active: hasMatches },
    { label: "Skill Gap Agent", icon: Route, active: hasSkillGaps },
    { label: "Preparation Agent", icon: Bot, active: hasResumeVersion },
    { label: "Tracker Agent", icon: BriefcaseBusiness, active: hasApplication },
    { label: "Feedback Agent", icon: ClipboardCheck, active: hasOutcome },
    { label: "Notification Agent", icon: BellRing, active: hasAlert }
  ];

  const activeCount = nodes.filter((node) => node.active).length;

  return (
    <section className={cx("rounded-lg border border-ink/10 bg-white p-5 shadow-soft", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-ink">Workflow Automation Graph</h2>
          <p className="text-sm font-semibold text-ink/55">Agent progress across the internship pipeline</p>
        </div>
        <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-black text-moss">
          {activeCount}/{nodes.length} stages active
        </span>
      </div>
      <div className="mt-5 overflow-x-auto pb-2 scrollbar-thin">
        <div className="grid min-w-[760px] grid-cols-4 gap-4">
          {nodes.map((node, index) => (
            <div key={node.label} className="relative">
              {index < nodes.length - 1 ? (
                <span
                  className={cx(
                    "absolute left-[calc(50%+28px)] top-7 hidden h-0.5 w-[calc(100%-24px)] md:block",
                    nodes[index + 1].active ? "bg-moss" : "bg-ink/10"
                  )}
                />
              ) : null}
              <div
                className={cx(
                  "relative grid min-h-28 place-items-center rounded-md border p-3 text-center transition",
                  node.active ? "border-moss/30 bg-moss/5" : "border-ink/10 bg-paper"
                )}
              >
                <div
                  className={cx(
                    "grid h-12 w-12 place-items-center rounded-md",
                    node.active ? "bg-moss text-white" : "bg-white text-ink/45"
                  )}
                >
                  <node.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-black text-ink">{node.label}</p>
                <span className={cx("mt-1 text-xs font-black", node.active ? "text-moss" : "text-ink/40")}>
                  {node.active ? "Active" : "Waiting"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
