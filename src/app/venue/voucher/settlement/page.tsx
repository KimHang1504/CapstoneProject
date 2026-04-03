import SettlementListSection from "@/app/venue/voucher/settlement/components/SettlementListSection";
import SettlementSummary from "@/app/venue/voucher/settlement/components/SettlementSummary";


type PageProps = {
  searchParams: Promise<{
    page?: string;
    size?: string;
    status?: "PENDING" | "PAID" | "CANCELLED";
    fromDate?: string;
    toDate?: string;
    sortBy?: "createdAt" | "updatedAt";
    orderBy?: "asc" | "desc";
  }>;
};

export default async function SettlementPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  return (
    <div className="p-6">
      <SettlementSummary />
      <SettlementListSection searchParams={sp} />
    </div>
  );
}