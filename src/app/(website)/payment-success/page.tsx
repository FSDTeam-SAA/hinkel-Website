import PaymentSuccessPage from "@/components/website/payment-success";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <PaymentSuccessPage />;
    </Suspense>
  );
}
