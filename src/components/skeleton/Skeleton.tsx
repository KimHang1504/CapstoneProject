type Props = {
  className?: string;
};

export default function Skeleton({ className = "" }: Props) {
  return <div className={`bg-gray-100 rounded-md ${className}`} />;
}