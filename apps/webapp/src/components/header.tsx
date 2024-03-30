import { Skeleton } from "@guesthub/ui/skeleton";

export const Header = ({
  title,
  loading,
}: {
  title?: string;
  loading?: boolean;
}) => {
  return (
    <div className="flex flex-row align-middle font-medium text-3xl gap-2">
      <h1>{loading ? <Skeleton className="w-40 h-8" /> : title}</h1>
    </div>
  );
};
