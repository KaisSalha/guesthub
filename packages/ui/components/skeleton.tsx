import { cn } from "../lib";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-background-inverted/10",
        className
      )}
      {...props}
    />
  );
};

export { Skeleton };
