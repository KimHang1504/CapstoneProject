import Skeleton from "./Skeleton";

type Props = {
  lines?: number;
  className?: string;
};

export default function SkeletonText({ lines = 2, className = "" }: Props) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}