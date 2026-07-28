import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type Severity = "Critical" | "High" | "Medium" | "Low";

interface BadgeProps {
  severity?: Severity;
  label?: string;
  className?: string;
}

export function Badge({ severity, label, className }: BadgeProps) {
  let colorClass = "bg-muted/20 text-muted";
  
  if (severity === "Critical") colorClass = "bg-critical/20 text-critical";
  else if (severity === "High") colorClass = "bg-warning/20 text-warning";
  else if (severity === "Medium") colorClass = "bg-info/20 text-info";
  else if (severity === "Low") colorClass = "bg-success/20 text-success";

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded text-xs font-medium border border-transparent whitespace-nowrap",
        colorClass,
        severity === "Critical" && "border-critical/30 animate-pulse",
        className
      )}
    >
      {label || severity}
    </span>
  );
}
