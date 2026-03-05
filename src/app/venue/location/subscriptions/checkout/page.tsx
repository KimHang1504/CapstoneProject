import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}