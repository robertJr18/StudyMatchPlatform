import { BookOpen, BarChart3, Users, FolderOpen, CheckSquare, LogOut, User, Settings, Bell, Calendar, MessageSquare, HelpCircle } from "lucide-react";
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
    { title: "Mis Materias", icon: BookOpen, path: "/estudiante/dashboard", enabled: true },
    { title: "Mi Asistencia", icon: CheckSquare, path: "/estudiante/asistencia", enabled: true },
    { title: "Horarios", icon: Calendar, path: "/estudiante/horarios", enabled: false },
    { title: "Mensajes", icon: MessageSquare, path: "/estudiante/mensajes", enabled: false },
    { title: "Notificaciones", icon: Bell, path: "/estudiante/notificaciones", enabled: false },
    { title: "Mi Perfil", icon: User, path: "/estudiante/perfil", enabled: true },
    { title: "Ayuda", icon: HelpCircle, path: "/estudiante/ayuda", enabled: false },
  ];

  const monitorItems = [
    { title: "Mis Monitorías", icon: BookOpen, path: "/monitor/dashboard", enabled: true },
    { title: "Estudiantes", icon: Users, path: "/monitor/estudiantes", enabled: false },
    { title: "Materiales", icon: FolderOpen, path: "/monitor/materiales", enabled: false },
    { title: "Asistencia", icon: CheckSquare, path: "/monitor/asistencia", enabled: false },
    { title: "Horarios", icon: Calendar, path: "/monitor/horarios", enabled: false },
    { title: "Mensajes", icon: MessageSquare, path: "/monitor/mensajes", enabled: false },
    { title: "Estadísticas", icon: BarChart3, path: "/monitor/estadisticas", enabled: false },
    { title: "Mi Perfil", icon: User, path: "/monitor/perfil", enabled: true },
    { title: "Configuración", icon: Settings, path: "/monitor/configuracion", enabled: false },
  ];

  const adminItems = [
    { title: "Dashboard", icon: BarChart3, path: "/admin/dashboard", enabled: true },
    { title: "Usuarios", icon: Users, path: "/admin/usuarios", enabled: true },
    { title: "Materias", icon: BookOpen, path: "/admin/materias", enabled: true },
    { title: "Reportes", icon: BarChart3, path: "/admin/reportes", enabled: false },
    { title: "Notificaciones", icon: Bell, path: "/admin/notificaciones", enabled: false },
    { title: "Mi Perfil", icon: User, path: "/admin/perfil", enabled: true },
    { title: "Configuración", icon: Settings, path: "/admin/configuracion", enabled: false },
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
                    onClick={() => item.enabled && navigate(item.path)}
                    isActive={location.pathname === item.path}
                    tooltip={item.enabled ? item.title : `${item.title} (Próximamente)`}
                    disabled={!item.enabled}
                    className={!item.enabled ? "opacity-50 cursor-not-allowed" : ""}
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
