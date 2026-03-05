import { Suspense } from "react";
import QRContent from "./qr-content";

export default function QRPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QRContent />
    </Suspense>
  );
}