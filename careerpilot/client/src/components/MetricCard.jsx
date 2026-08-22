export function MetricCard({ label, value, tone = "moss", icon: Icon }) {
  const tones = {
    moss: "bg-moss/10 text-moss",
    coral: "bg-coral/10 text-coral",
    gold: "bg-gold/10 text-gold",
    ink: "bg-ink/10 text-ink"
  };

  return (
    <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink/55">{label}</p>
          <p className="mt-2 text-3xl font-black text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className={`grid h-10 w-10 place-items-center rounded-md ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
