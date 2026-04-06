import { Suspense } from "react";
import ConfirmClient from "./ConfirmClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải...</div>}>
      <ConfirmClient />
    </Suspense>
  );
}
