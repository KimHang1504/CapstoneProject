import { Suspense } from "react";
import SubscriptionClient from "./SubscriptionClient";
export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải...</div>}>
      <SubscriptionClient />
    </Suspense>
  );
}