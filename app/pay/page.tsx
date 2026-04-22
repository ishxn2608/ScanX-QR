import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    }>
      <PaymentClient />
    </Suspense>
  );
}
