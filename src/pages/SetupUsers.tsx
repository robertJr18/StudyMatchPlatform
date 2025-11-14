import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";

export default function SetupUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const createUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-test-users");

      if (error) throw error;

      setResults(data.results);
      toast.success("Usuarios creados exitosamente!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al crear usuarios: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <UserPlus className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Configuración de Usuarios</CardTitle>
          <CardDescription>
            Crea los usuarios de prueba para StudyMatch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Se crearán los siguientes usuarios:</p>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• <strong>Robert González</strong> (Estudiante) - robert.gonzalez@universidad.edu.co</li>
              <li>• <strong>Jussi Torres</strong> (Monitor) - jussi.torres@universidad.edu.co</li>
              <li>• <strong>Admin</strong> (Administrador) - admin@universidad.edu.co</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2">
              Todos con sus contraseñas respectivas ya configuradas
            </p>
          </div>

          <Button
            onClick={createUsers}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando usuarios...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Crear Usuarios de Prueba
              </>
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium">Resultados:</p>
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-success/10 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.status === "created" ? "✅ Usuario creado" : "⚠️ Usuario ya existía"}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <Button
                  onClick={() => window.location.href = "/login"}
                  className="w-full"
                >
                  Ir a Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
