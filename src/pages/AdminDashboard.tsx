import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, GraduationCap, AlertCircle } from "lucide-react";

interface Stats {
  totalStudents: number;
  totalMonitors: number;
  totalSubjects: number;
  subjectsWithoutMonitors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalMonitors: 0,
    totalSubjects: 0,
    subjectsWithoutMonitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total students
      const { count: studentsCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Get total monitors
      const { count: monitorsCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "monitor");

      // Get total subjects
      const { count: subjectsCount } = await supabase
        .from("subjects")
        .select("*", { count: "exact", head: true });

      // Get subjects without monitors
      const { data: allSubjects } = await supabase
        .from("subjects")
        .select("id");

      let withoutMonitorsCount = 0;
      if (allSubjects) {
        for (const subject of allSubjects) {
          const { count } = await supabase
            .from("monitors")
            .select("*", { count: "exact", head: true })
            .eq("subject_id", subject.id);
          
          if (count === 0) withoutMonitorsCount++;
        }
      }

      setStats({
        totalStudents: studentsCount || 0,
        totalMonitors: monitorsCount || 0,
        totalSubjects: subjectsCount || 0,
        subjectsWithoutMonitors: withoutMonitorsCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">Vista general del sistema StudyMatch</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Monitores</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMonitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Monitores</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {stats.subjectsWithoutMonitors}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Warning Card */}
        {stats.subjectsWithoutMonitors > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Atención Requerida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                ⚠️ {stats.subjectsWithoutMonitors} materias no tienen monitores asignados.
                Es necesario asignar monitores para mejorar el servicio.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ROI Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información del Programa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Inversión Semestral</p>
              <p className="text-2xl font-bold text-primary">$35M COP</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Cobertura</p>
                <p className="text-lg font-semibold">
                  {stats.totalSubjects} materias
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monitores Activos</p>
                <p className="text-lg font-semibold">
                  {stats.totalMonitors} monitores
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes Beneficiados</p>
                <p className="text-lg font-semibold">
                  {stats.totalStudents} estudiantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
