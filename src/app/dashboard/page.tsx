"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import LeadsTable from "@/components/LeadsTable";

export default function Dashboard() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Leads</h1>
        <LeadsTable />
      </main>
    </SidebarProvider>
  );
}
