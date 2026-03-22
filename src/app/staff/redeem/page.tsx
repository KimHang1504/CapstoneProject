"use client";

import { Suspense } from "react";
import StaffRedeemContent, { StaffRedeemLoading } from "./StaffRedeemContent";

export default function StaffRedeemPage() {
  return (
    <Suspense fallback={<StaffRedeemLoading />}>
      <StaffRedeemContent />
    </Suspense>
  );
}