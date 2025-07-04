import { cn } from "@/lib/utils";

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "pulse" | "wave" | "shimmer";
}) {
  const baseClasses = "animate-pulse rounded-md bg-muted";

  const variantClasses = {
    default: "animate-pulse",
    pulse: "animate-pulse",
    wave: "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted",
    shimmer:
      "relative overflow-hidden bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

// Composants spécialisés pour différents types de contenu
const SkeletonText = ({
  lines = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { lines?: number }) => (
  <div className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
      />
    ))}
  </div>
);

const SkeletonCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-3", className)} {...props}>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

const SkeletonAvatar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton className={cn("h-10 w-10 rounded-full", className)} {...props} />
);

const SkeletonButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton className={cn("h-10 w-20", className)} {...props} />
);

const SkeletonInput = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Skeleton className={cn("h-10 w-full", className)} {...props} />
);

const SkeletonTable = ({
  rows = 5,
  columns = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  rows?: number;
  columns?: number;
}) => (
  <div className={cn("space-y-3", className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            className={cn("h-4 flex-1", colIndex === 0 ? "w-1/2" : "w-full")}
          />
        ))}
      </div>
    ))}
  </div>
);

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonInput,
  SkeletonTable,
};
