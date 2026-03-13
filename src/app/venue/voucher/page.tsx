import Link from "next/link";

export default function VoucherPage() {
  return (
    <div>
        <h1 className="text-2xl font-semibold mb-6">
            Quản lý Voucher
        </h1>
        <Link href="/venue/voucher/create" className="text-blue-600 mb-4 inline-block cursor-pointer">
            Tạo Voucher Mới
        </Link>

    </div>
  )
}
