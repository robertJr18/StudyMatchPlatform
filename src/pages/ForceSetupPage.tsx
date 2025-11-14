import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setupTestData } from "@/utils/setupTestData";
import { RefreshCw, Database, Trash2 } from "lucide-react";

export default function ForceSetupPage() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  const checkDatabase = async () => {
    setLog([]);
    addLog("🔍 Verificando base de datos...");

    try {
      // Check users
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) {
        addLog(`❌ Error en users: ${usersError.message}`);
      } else {
        addLog(`✅ Users: ${users?.length || 0} registros`);
        users?.forEach(u => addLog(`   - ${u.full_name} (${u.email}) - ${u.role}`));
      }

      // Check subjects
      const { data: subjects, error: subjectsError } = await supabase
        .from("subjects")
        .select("*");

      if (subjectsError) {
        addLog(`❌ Error en subjects: ${subjectsError.message}`);
      } else {
        addLog(`✅ Subjects: ${subjects?.length || 0} registros`);
        subjects?.forEach(s => addLog(`   - ${s.name} (${s.code})`));
      }

      // Check enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select("*, subjects(name)");

      if (enrollmentsError) {
        addLog(`❌ Error en enrollments: ${enrollmentsError.message}`);
      } else {
        addLog(`✅ Enrollments: ${enrollments?.length || 0} registros`);

        // Group by student
        const byStudent = enrollments?.reduce((acc: any, e: any) => {
          if (!acc[e.student_id]) acc[e.student_id] = [];
          acc[e.student_id].push(e.subjects?.name || 'Unknown');
          return acc;
        }, {});

        Object.entries(byStudent || {}).forEach(([studentId, subjects]: [string, any]) => {
          addLog(`   - Estudiante ${studentId}: ${subjects.length} materias`);
        });
      }

      // Check monitors
      const { data: monitors, error: monitorsError } = await supabase
        .from("monitors")
        .select("*, users(full_name), subjects(name)");

      if (monitorsError) {
        addLog(`❌ Error en monitors: ${monitorsError.message}`);
      } else {
        addLog(`✅ Monitors: ${monitors?.length || 0} registros`);
        monitors?.forEach((m: any) => {
          addLog(`   - ${m.users?.full_name} → ${m.subjects?.name}`);
        });
      }

      addLog("✅ Verificación completada");
    } catch (error: any) {
      addLog(`❌ Error general: ${error.message}`);
    }
  };

  const forceSetup = async () => {
    setLog([]);
    setLoading(true);

    try {
      addLog("🚀 Forzando reinicialización de datos...");
      addLog("⚠️ Esto borrará localStorage y recreará todos los datos");

      // Clear localStorage flag
      localStorage.removeItem('studymatch_initialized');
      localStorage.removeItem('user');
      addLog("✅ localStorage limpiado");

      // Run setup
      addLog("📦 Ejecutando setupTestData...");
      const result = await setupTestData();

      if (result.success) {
        addLog("✅ Setup completado exitosamente");
        localStorage.setItem('studymatch_initialized', 'true');

        // Verify data was created
        addLog("");
        addLog("🔍 Verificando datos creados...");
        await checkDatabase();
      } else {
        addLog(`❌ Setup falló: ${result.error}`);
      }
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllData = async () => {
    if (!window.confirm("⚠️ ¿SEGURO? Esto borrará TODOS los datos de la base de datos.")) {
      return;
    }

    setLog([]);
    setLoading(true);

    try {
      addLog("🗑️ Borrando todos los datos...");

      // Delete in reverse order of dependencies
      await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Votes borrados");

      await supabase.from("attendance").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Attendance borrados");

      await supabase.from("sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Sessions borrados");

      await supabase.from("materials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Materials borrados");

      await supabase.from("time_slots").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Time slots borrados");

      await supabase.from("monitors").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Monitors borrados");

      await supabase.from("enrollments").delete().neq("student_id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Enrollments borrados");

      await supabase.from("subjects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Subjects borrados");

      await supabase.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      addLog("✅ Users borrados");

      addLog("✅ Todos los datos borrados");
      addLog("💡 Ahora ejecuta 'Forzar Reinicialización' para recrear los datos");

      localStorage.removeItem('studymatch_initialized');
    } catch (error: any) {
      addLog(`❌ Error borrando datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔧 Herramienta de Setup Forzado</h1>
          <p className="text-muted-foreground">
            Usa esta página para reinicializar completamente la base de datos
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                onClick={checkDatabase}
                disabled={loading}
                variant="outline"
              >
                <Database className="mr-2 h-4 w-4" />
                Verificar Base de Datos
              </Button>

              <Button
                onClick={forceSetup}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Forzar Reinicialización
              </Button>

              <Button
                onClick={deleteAllData}
                disabled={loading}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Borrar Todos los Datos
              </Button>
            </CardContent>
          </Card>
        </div>

        {log.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Log de Operaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-auto">
                {log.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 border-blue-600 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-600">📝 Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1. Verificar Base de Datos:</strong> Muestra qué datos hay actualmente</p>
            <p><strong>2. Forzar Reinicialización:</strong> Limpia localStorage y recrea TODOS los datos de prueba</p>
            <p><strong>3. Borrar Todos los Datos:</strong> Elimina TODA la información (usa con cuidado)</p>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>IMPORTANTE:</strong> Después de la reinicialización, vuelve a la página principal y haz login.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4">
          <a href="/" className="text-blue-600 underline">← Volver a la app</a>
        </div>
      </div>
    </div>
  );
}
