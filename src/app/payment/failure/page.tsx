// page.tsx
import PaymentFailureContent from '@/app/payment/failure/PaymentFailureContent';
import { Suspense } from 'react';

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}