import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CreateTimeSlotModal } from "@/components/CreateTimeSlotModal";
import { UploadMaterialModal } from "@/components/UploadMaterialModal";

interface MonitorSubject {
  id: string;
  subjects: {
    id: string;
    name: string;
    code: string;
  };
}

interface TimeSlotWithVotes {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string | null;
  vote_count: number;
  voters: Array<{
    full_name: string;
  }>;
}

export default function MonitorDashboard() {
  const { appUser } = useAuth();
  const [monitorSubject, setMonitorSubject] = useState<MonitorSubject | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlotWithVotes[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [monitorId, setMonitorId] = useState<string>("");

  useEffect(() => {
    if (appUser) {
      fetchMonitorData();
    }
  }, [appUser]);

  const fetchMonitorData = async () => {
    try {
      // Get monitor subject
      const { data: monitorData, error: monitorError } = await supabase
        .from("monitors")
        .select(`
          id,
          subject_id,
          subjects (
            id,
            name,
            code
          )
        `)
        .eq("user_id", appUser?.id)
        .single();

      if (monitorError) throw monitorError;
      setMonitorSubject(monitorData as any);
      setMonitorId(monitorData.id);

      if (monitorData) {
        // Get total enrolled students
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("subject_id", monitorData.subject_id);

        setTotalStudents(count || 0);

        // Get time slots with votes
        const { data: slotsData, error: slotsError } = await supabase
          .from("time_slots")
          .select("*")
          .eq("subject_id", monitorData.subject_id);

        if (slotsError) throw slotsError;

        // Get votes for each slot
        const slotsWithVotes = await Promise.all(
          slotsData.map(async (slot: any) => {
            const { data: votesData } = await supabase
              .from("votes")
              .select(`
                id,
                users (
                  full_name
                )
              `)
              .eq("time_slot_id", slot.id);

            return {
              ...slot,
              vote_count: votesData?.length || 0,
              voters: votesData?.map((v: any) => v.users) || [],
            };
          })
        );

        setTimeSlots(slotsWithVotes);
      }
    } catch (error) {
      console.error("Error fetching monitor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="monitor">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!monitorSubject) {
    return (
      <DashboardLayout role="monitor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No estás asignado como monitor de ninguna materia</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Monitor: {appUser?.full_name}
          </h1>
          <p className="text-muted-foreground">
            {monitorSubject.subjects.name} ({monitorSubject.subjects.code})
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <CreateTimeSlotModal
            subjectId={monitorSubject.subjects.id}
            monitorId={monitorId}
            onSuccess={fetchMonitorData}
          />
          <UploadMaterialModal
            subjectId={monitorSubject.subjects.id}
            monitorId={monitorId}
            onSuccess={fetchMonitorData}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes Inscritos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horarios Propuestos</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeSlots.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Voting Results */}
        <Card>
          <CardHeader>
            <CardTitle>Votaciones en Tiempo Real</CardTitle>
            <CardDescription>
              {totalStudents > 0
                ? `${timeSlots.reduce((acc, slot) => acc + slot.vote_count, 0)}/${totalStudents} estudiantes han votado`
                : "Sin estudiantes inscritos"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {timeSlots.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay horarios propuestos
              </p>
            ) : (
              timeSlots.map((slot) => (
                <div key={slot.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {slot.day_of_week} • {slot.start_time} - {slot.end_time}
                      </p>
                      {slot.location && (
                        <p className="text-sm text-muted-foreground">{slot.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {slot.vote_count} votos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {totalStudents > 0
                          ? `${Math.round((slot.vote_count / totalStudents) * 100)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={totalStudents > 0 ? (slot.vote_count / totalStudents) * 100 : 0} 
                    className="h-2"
                  />

                  {slot.voters.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {slot.voters.map((voter, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          <span>{voter.full_name} votó por este horario</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
