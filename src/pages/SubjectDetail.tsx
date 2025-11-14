import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, MapPin, Users, CheckCircle2, FileDown, ArrowLeft, Calendar } from "lucide-react";
import { DetailSkeleton } from "@/components/Skeleton";

interface TimeSlot {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  location: string | null;
  max_capacity: number | null;
  vote_count: number;
}

interface Monitor {
  id: string;
  user: {
    full_name: string;
    email: string;
  };
}

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  created_at: string;
}

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appUser } = useAuth();
  const [subject, setSubject] = useState<any>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState<{ total: number; attended: number }>({
    total: 0,
    attended: 0,
  });

  useEffect(() => {
    if (id && appUser) {
      fetchSubjectData();
    }
  }, [id, appUser]);

  const fetchSubjectData = async () => {
    try {
      // Fetch subject
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", id)
        .single();

      if (subjectError) throw subjectError;
      setSubject(subjectData);

      // Fetch monitors
      const { data: monitorsData, error: monitorsError } = await supabase
        .from("monitors")
        .select(`
          id,
          users (
            full_name,
            email
          )
        `)
        .eq("subject_id", id);

      if (monitorsError) throw monitorsError;
      setMonitors(monitorsData as any);

      // Fetch time slots with vote counts
      const { data: slotsData, error: slotsError } = await supabase
        .from("time_slots")
        .select("*")
        .eq("subject_id", id);

      if (slotsError) throw slotsError;

      // Get vote counts for each slot
      const slotsWithVotes = await Promise.all(
        slotsData.map(async (slot: any) => {
          const { count } = await supabase
            .from("votes")
            .select("*", { count: "exact", head: true })
            .eq("time_slot_id", slot.id);

          return { ...slot, vote_count: count || 0 };
        })
      );

      setTimeSlots(slotsWithVotes);

      // Check current user vote
      const { data: voteData } = await supabase
        .from("votes")
        .select("time_slot_id")
        .eq("student_id", appUser?.id)
        .eq("subject_id", id)
        .maybeSingle();

      if (voteData) {
        setCurrentVote(voteData.time_slot_id);
        setSelectedSlot(voteData.time_slot_id);
      }

      // Fetch materials
      const { data: materialsData, error: materialsError } = await supabase
        .from("materials")
        .select("*")
        .eq("subject_id", id)
        .order("created_at", { ascending: false });

      if (materialsError) throw materialsError;
      setMaterials(materialsData);

      // Fetch attendance data
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("attended")
        .eq("student_id", appUser?.id)
        .in(
          "session_id",
          (
            await supabase
              .from("sessions")
              .select("id")
              .eq("subject_id", id)
          ).data?.map((s) => s.id) || []
        );

      if (attendanceData) {
        setAttendance({
          total: attendanceData.length,
          attended: attendanceData.filter((a) => a.attended).length,
        });
      }
    } catch (error) {
      console.error("Error fetching subject data:", error);
      toast.error("Error al cargar la información");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedSlot) {
      toast.error("Selecciona un horario");
      return;
    }

    try {
      // Delete previous vote if exists
      if (currentVote) {
        await supabase
          .from("votes")
          .delete()
          .eq("student_id", appUser?.id)
          .eq("subject_id", id);
      }

      // Insert new vote
      const { error } = await supabase.from("votes").insert({
        student_id: appUser?.id,
        subject_id: id,
        time_slot_id: selectedSlot,
      });

      if (error) throw error;

      setCurrentVote(selectedSlot);
      toast.success("✅ Voto registrado exitosamente");
      fetchSubjectData(); // Refresh vote counts
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Error al registrar el voto");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DetailSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/estudiante/dashboard")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Materias
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{subject?.name}</h1>
          <p className="text-muted-foreground">{subject?.code}</p>
        </div>

        {/* Monitors */}
        {monitors.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Monitores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {monitors.map((monitor: any) => (
                <div key={monitor.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{monitor.users.full_name}</p>
                    <p className="text-sm text-muted-foreground">{monitor.users.email}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Time Slots Voting */}
        {timeSlots.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Votación de Horarios</CardTitle>
              <CardDescription>
                Vota por el horario de tu preferencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot}>
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      selectedSlot === slot.id
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value={slot.id} id={slot.id} />
                    <Label
                      htmlFor={slot.id}
                      className="flex-1 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{slot.day_of_week}</span>
                          <span className="text-muted-foreground">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          {currentVote === slot.id && (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          )}
                        </div>
                        {slot.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {slot.location}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {slot.vote_count} votos
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button 
                onClick={handleVote} 
                className="w-full"
                disabled={!selectedSlot || selectedSlot === currentVote}
              >
                {currentVote && selectedSlot === currentVote ? "Ya votaste" : currentVote ? "Cambiar voto" : "Votar"}
              </Button>

              {currentVote && (
                <p className="text-sm text-center text-muted-foreground">
                  ✅ Tu voto actual: {timeSlots.find(s => s.id === currentVote)?.day_of_week}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attendance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mi Asistencia</CardTitle>
            <CardDescription>
              Tu registro de asistencia a las sesiones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {attendance.attended} de {attendance.total} sesiones
                  </span>
                  <span className="text-sm font-semibold">
                    {attendance.total > 0
                      ? `${Math.round((attendance.attended / attendance.total) * 100)}%`
                      : "Sin datos"}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success transition-all"
                    style={{
                      width: `${
                        attendance.total > 0
                          ? (attendance.attended / attendance.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle>Materiales</CardTitle>
            <CardDescription>
              Recursos compartidos por el monitor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {materials.length > 0 ? (
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{material.title}</p>
                      {material.description && (
                        <p className="text-sm text-muted-foreground">{material.description}</p>
                      )}
                    </div>
                    {material.file_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                          <FileDown className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No hay materiales disponibles aún
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
