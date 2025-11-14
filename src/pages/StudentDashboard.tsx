import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { SubjectCardSkeleton } from "@/components/Skeleton";

interface SubjectWithMonitor {
  id: string;
  name: string;
  code: string;
  career: string | null;
  has_monitors: boolean | null;
  monitor_count: number;
}

export default function StudentDashboard() {
  const { appUser } = useAuth();
  const [subjects, setSubjects] = useState<SubjectWithMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (appUser) {
      fetchEnrolledSubjects();
    }
  }, [appUser]);

  const fetchEnrolledSubjects = async () => {
    try {
      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(`
          subject_id,
          subjects (
            id,
            name,
            code,
            career,
            has_monitors
          )
        `)
        .eq("student_id", appUser?.id);

      if (error) throw error;

      // Get monitor counts for each subject
      const subjectsWithCounts = await Promise.all(
        enrollments.map(async (enrollment: any) => {
          const { count } = await supabase
            .from("monitors")
            .select("*", { count: "exact", head: true })
            .eq("subject_id", enrollment.subjects.id);

          return {
            ...enrollment.subjects,
            monitor_count: count || 0,
          };
        })
      );

      setSubjects(subjectsWithCounts);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 space-y-2">
            <div className="h-9 bg-muted rounded w-96 animate-pulse" />
            <div className="h-5 bg-muted rounded w-48 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <SubjectCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hola {appUser?.full_name}
          </h1>
          {appUser?.career && (
            <p className="text-muted-foreground">{appUser.career}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className={`transition-all duration-200 ${
                subject.monitor_count > 0
                  ? "cursor-pointer hover:shadow-md hover:scale-[1.02]"
                  : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => {
                if (subject.monitor_count > 0) {
                  navigate(`/estudiante/materia/${subject.id}`);
                }
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {subject.monitor_count > 0 ? (
                  <Badge className="bg-success text-success-foreground">
                    🟢 {subject.monitor_count} {subject.monitor_count === 1 ? "Monitor" : "Monitores"}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    🔴 Sin monitores disponibles
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No estás inscrito en ninguna materia</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
