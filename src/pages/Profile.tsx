import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, GraduationCap, Shield, Calendar } from "lucide-react";

export default function Profile() {
  const { appUser } = useAuth();

  if (!appUser) return null;

  const roleColors = {
    student: "bg-blue-500",
    monitor: "bg-green-500",
    admin: "bg-purple-500",
    coordinator: "bg-orange-500"
  };

  const roleLabels = {
    student: "Estudiante",
    monitor: "Monitor",
    admin: "Administrador",
    coordinator: "Coordinador"
  };

  return (
    <DashboardLayout role={appUser.role}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Información de tu cuenta</p>
        </div>

        <div className="grid gap-6">
          {/* Tarjeta principal de perfil */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-full ${roleColors[appUser.role]} flex items-center justify-center`}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{appUser.full_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {roleLabels[appUser.role]}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{appUser.email}</p>
                  </div>
                </div>

                {appUser.career && (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Carrera</p>
                      <p className="font-medium">{appUser.career}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <p className="font-medium capitalize">{roleLabels[appUser.role]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Miembro desde</p>
                    <p className="font-medium">Noviembre 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Tu actividad en StudyMatch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {appUser.role === "student" && (
                  <>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">5</p>
                      <p className="text-sm text-muted-foreground">Materias inscritas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">1</p>
                      <p className="text-sm text-muted-foreground">Monitorías activas</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-muted-foreground">Votos realizados</p>
                    </div>
                  </>
                )}
                {appUser.role === "monitor" && (
                  <>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">1</p>
                      <p className="text-sm text-muted-foreground">Materias monitoreadas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">0</p>
                      <p className="text-sm text-muted-foreground">Sesiones realizadas</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">0</p>
                      <p className="text-sm text-muted-foreground">Materiales subidos</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
