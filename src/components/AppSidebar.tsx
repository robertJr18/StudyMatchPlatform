import { BookOpen, BarChart3, Users, FolderOpen, CheckSquare, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  role: "student" | "monitor" | "admin" | "coordinator";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const studentItems = [
    { title: "Mis Materias", icon: BookOpen, path: "/estudiante/dashboard" },
    { title: "Mi Asistencia", icon: CheckSquare, path: "/estudiante/asistencia" },
    { title: "Mi Perfil", icon: User, path: "/estudiante/perfil" },
  ];

  const monitorItems = [
    { title: "Mis Monitorías", icon: BookOpen, path: "/monitor/dashboard" },
    { title: "Estudiantes", icon: Users, path: "/monitor/estudiantes" },
    { title: "Materiales", icon: FolderOpen, path: "/monitor/materiales" },
    { title: "Asistencia", icon: CheckSquare, path: "/monitor/asistencia" },
    { title: "Mi Perfil", icon: User, path: "/monitor/perfil" },
  ];

  const adminItems = [
    { title: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
    { title: "Usuarios", icon: Users, path: "/admin/usuarios" },
    { title: "Materias", icon: BookOpen, path: "/admin/materias" },
    { title: "Reportes", icon: BarChart3, path: "/admin/reportes" },
    { title: "Mi Perfil", icon: User, path: "/admin/perfil" },
  ];

  const items = role === "student" ? studentItems : role === "monitor" ? monitorItems : adminItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t p-2">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
}
