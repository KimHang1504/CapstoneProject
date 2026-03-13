import VoucherForm from "@/app/venue/voucher/component/VoucherForm";

export default function CreateVoucherPage() {
  return (
    <div className="p-6 max-w-3xl">

      <h1 className="text-2xl font-semibold mb-6">
        Create Voucher
      </h1>

      <VoucherForm />

    </div>
  );
}