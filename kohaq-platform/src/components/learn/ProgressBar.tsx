export function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>Course progress</span>
        <span>{safeValue}%</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${safeValue}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeValue}
          role="progressbar"
        />
      </div>
    </div>
  );
}

