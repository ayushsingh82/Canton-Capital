import { CcBox } from "./CcBox";

export function StatsCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <CcBox>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/50">
        {title}
      </p>
      <p className="cc-gradient mt-2 text-2xl font-semibold tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-white/40">{hint}</p>
      ) : null}
    </CcBox>
  );
}
