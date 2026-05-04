import type { ReactNode } from "react";

export function CcBox({
  children,
  className = "",
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  const base =
    "rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition duration-300";
  const hover =
    strong ? " hover:border-white/[0.1] hover:bg-white/[0.05]" : "";
  return (
    <div className={`${base}${hover} ${className}`.trim()}>{children}</div>
  );
}
