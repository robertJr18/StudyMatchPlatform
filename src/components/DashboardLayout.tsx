import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { appUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const getProfilePath = () => {
    switch (role) {
      case 'student':
        return '/estudiante/perfil';
      case 'monitor':
        return '/monitor/perfil';
      case 'admin':
      case 'coordinator':
        return '/admin/perfil';
      default:
        return '/';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Bar */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="h-full px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
              </div>

              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="rounded-full"
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </Button>

                {/* User Profile Dropdown */}
                {appUser && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium">{appUser.full_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{appUser.role}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(getProfilePath())}>
                        <User className="mr-2 h-4 w-4" />
                        Ver Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="text-destructive">
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
