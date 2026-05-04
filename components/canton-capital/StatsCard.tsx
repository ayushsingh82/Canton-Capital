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
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {title}
      </p>
      <p className="mt-2 bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-2xl font-semibold tabular-nums text-transparent">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      ) : null}
    </CcBox>
  );
}
