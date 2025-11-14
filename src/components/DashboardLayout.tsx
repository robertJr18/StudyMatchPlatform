import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserRole } from "@/types/auth";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
