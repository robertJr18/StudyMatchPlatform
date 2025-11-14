import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { setupTestData } from "@/utils/setupTestData";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Setup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);
  const navigate = useNavigate();

  const handleSetup = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await setupTestData();
      setResult({
        success: response.success,
        message: response.success
          ? "¡Datos de prueba configurados exitosamente!"
          : "Error al configurar datos. Revisa la consola.",
      });
    } catch (error) {
      console.error("Setup error:", error);
      setResult({
        success: false,
        message: "Error al configurar datos. Revisa la consola.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-3xl">Configuración Inicial</CardTitle>
          <CardDescription className="text-base">
            Configura los datos de prueba para StudyMatch
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-lg mb-3">Este script creará:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>3 usuarios:</strong> Robert (estudiante), Jussi (monitor), Admin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>5 materias:</strong> Compiladores, Gestión de Proyectos, Calor y Ondas, English V, Programación para Web</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>5 enrollments</strong> para Robert en todas las materias</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span><strong>1 monitor:</strong> Jussi como monitor de Gestión de Proyectos</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Nota:</strong> Este script sobrescribirá los enrollments existentes de Robert.
              Todos los usuarios usarán la contraseña: <code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded">123</code>
            </p>
          </div>

          <Button
            onClick={handleSetup}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Configurando..." : "Ejecutar Setup"}
          </Button>

          {result && (
            <div
              className={`rounded-lg p-4 flex items-start gap-3 ${
                result.success
                  ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={
                    result.success
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }
                >
                  {result.message}
                </p>
                {result.success && (
                  <Button
                    onClick={() => navigate("/")}
                    variant="link"
                    className="mt-2 p-0 h-auto text-green-700 dark:text-green-300"
                  >
                    Ir a la página principal →
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="w-full"
            >
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
