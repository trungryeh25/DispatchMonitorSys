// src/app/dashboard/layout.tsx

import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-24 bg-[#3399FF] text-white flex-shrink-0">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="container mx-auto px-8">{children}</div>
      </div>
    </div>
  );
}
