import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Subject {
  id: string;
  name: string;
  code: string;
  career: string | null;
  has_monitors: boolean | null;
  created_at: string;
}

interface SubjectWithStats extends Subject {
  monitor_count: number;
  student_count: number;
}

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState<SubjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    withMonitors: 0,
    withoutMonitors: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      console.log("📚 [AdminSubjects] Fetching all subjects...");

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name", { ascending: true });

      console.log("📚 [AdminSubjects] Subjects response:", { data, error });

      if (error) throw error;

      // Fetch monitor and enrollment counts for each subject
      const subjectsWithStats = await Promise.all(
        (data || []).map(async (subject) => {
          // Count monitors
          const { count: monitorCount } = await supabase
            .from("monitors")
            .select("*", { count: "exact", head: true })
            .eq("subject_id", subject.id);

          // Count enrolled students
          const { count: studentCount } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("subject_id", subject.id);

          return {
            ...subject,
            monitor_count: monitorCount || 0,
            student_count: studentCount || 0,
          };
        })
      );

      setSubjects(subjectsWithStats);

      // Calculate stats
      const stats = {
        total: subjectsWithStats.length,
        withMonitors: subjectsWithStats.filter((s) => s.monitor_count > 0).length,
        withoutMonitors: subjectsWithStats.filter((s) => s.monitor_count === 0).length,
        totalEnrollments: subjectsWithStats.reduce(
          (sum, s) => sum + s.student_count,
          0
        ),
      };
      setStats(stats);
    } catch (error) {
      console.error("❌ [AdminSubjects] Error fetching subjects:", error);
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
            Gestión de Materias
          </h1>
          <p className="text-muted-foreground">
            Listado completo de materias en la plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Con Monitores</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withMonitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sin Monitores</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.withoutMonitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inscritos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Materias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Materia</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Monitores</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">No hay materias registradas</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-accent-foreground" />
                          </div>
                          {subject.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {subject.code}
                      </TableCell>
                      <TableCell>
                        {subject.career || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{subject.monitor_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{subject.student_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {subject.monitor_count > 0 ? (
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Activa
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Sin Monitor
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
