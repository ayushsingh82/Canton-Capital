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
  return (
    <div
      className={`${strong ? "cc-box-strong" : "cc-box"} p-5 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
