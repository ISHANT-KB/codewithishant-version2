"use client";

import { useIdleTimeout } from "@/hooks/useIdleTimeout";

function IdleGuard() {
  useIdleTimeout();
  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <IdleGuard />
      {children}
    </>
  );
}