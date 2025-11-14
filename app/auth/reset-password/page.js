"use client";

import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

// This file ONLY wraps the client component in <Suspense>
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </main>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}