
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="py-4 px-6">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <SidebarTrigger className="text-[#030227]" />
            </div>
          </header>
          <main>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
