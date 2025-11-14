import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface DiagnosticResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  data?: any;
}

export default function DiagnosticPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Check if we can read users
    try {
      const { data, error } = await supabase.from("users").select("*").limit(1);
      if (error) throw error;
      diagnostics.push({
        name: "Tabla 'users'",
        status: "success",
        message: `✅ Acceso OK (${data?.length || 0} registros encontrados)`,
        data,
      });
    } catch (error: any) {
      diagnostics.push({
        name: "Tabla 'users'",
        status: "error",
        message: `❌ Error: ${error.message}`,
      });
    }

    // Test 2: Check enrollments
    try {
      const { data, error } = await supabase.from("enrollments").select("*").limit(1);
      if (error) throw error;
      diagnostics.push({
        name: "Tabla 'enrollments'",
        status: data && data.length > 0 ? "success" : "warning",
        message: data && data.length > 0 ? `✅ Acceso OK (${data.length} registros)` : "⚠️ Tabla vacía o sin acceso",
        data,
      });
    } catch (error: any) {
      diagnostics.push({
        name: "Tabla 'enrollments'",
        status: "error",
        message: `❌ Error RLS: ${error.message}`,
      });
    }

    // Test 3: Check monitors
    try {
      const { data, error } = await supabase.from("monitors").select("*").limit(1);
      if (error) throw error;
      diagnostics.push({
        name: "Tabla 'monitors'",
        status: data && data.length > 0 ? "success" : "warning",
        message: data && data.length > 0 ? `✅ Acceso OK (${data.length} registros)` : "⚠️ Tabla vacía o sin acceso",
        data,
      });
    } catch (error: any) {
      diagnostics.push({
        name: "Tabla 'monitors'",
        status: "error",
        message: `❌ Error RLS: ${error.message}`,
      });
    }

    // Test 4: Check subjects
    try {
      const { data, error } = await supabase.from("subjects").select("*").limit(1);
      if (error) throw error;
      diagnostics.push({
        name: "Tabla 'subjects'",
        status: "success",
        message: `✅ Acceso OK (${data?.length || 0} registros)`,
        data,
      });
    } catch (error: any) {
      diagnostics.push({
        name: "Tabla 'subjects'",
        status: "error",
        message: `❌ Error: ${error.message}`,
      });
    }

    // Test 5: Try to query Robert's enrollments specifically
    const robertId = "550e8400-e29b-41d4-a716-446655440001";
    try {
      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          subject_id,
          subjects (
            id,
            name,
            code
          )
        `)
        .eq("student_id", robertId);

      if (error) throw error;
      diagnostics.push({
        name: "Enrollments de Robert",
        status: data && data.length > 0 ? "success" : "error",
        message: data && data.length > 0
          ? `✅ ${data.length} materias encontradas`
          : "❌ No se encontraron materias (RLS bloqueando)",
        data,
      });
    } catch (error: any) {
      diagnostics.push({
        name: "Enrollments de Robert",
        status: "error",
        message: `❌ Error RLS: ${error.message}`,
      });
    }

    setResults(diagnostics);
    setLoading(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-600">OK</Badge>;
      case "error":
        return <Badge variant="destructive">ERROR</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600">WARNING</Badge>;
      default:
        return null;
    }
  };

  const hasRLSErrors = results.some(r => r.status === "error" && r.message.includes("RLS"));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Diagnóstico de Base de Datos</h1>
          <p className="text-muted-foreground">
            Verificando acceso a tablas y políticas RLS
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {results.map((result, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon(result.status)}
                        <CardTitle className="text-lg">{result.name}</CardTitle>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer">
                          Ver datos (click para expandir)
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasRLSErrors && (
              <Card className="border-red-600 bg-red-50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="text-red-600">🚨 PROBLEMA DETECTADO: RLS Bloqueando Consultas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold">Solución (2 minutos):</h3>
                    <ol className="space-y-2">
                      <li>
                        <strong>Abre Supabase Dashboard:</strong>{" "}
                        <a
                          href="https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/sql/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          https://supabase.com/dashboard/project/hnomrfjpwcglqihvjuda/sql/new
                        </a>
                      </li>
                      <li>
                        <strong>Copia este SQL y ejecútalo:</strong>
                        <pre className="mt-2 p-4 bg-gray-900 text-white rounded overflow-auto text-xs">
{`-- Deshabilitar RLS para permitir acceso en demo
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots DISABLE ROW LEVEL SECURITY;`}
                        </pre>
                      </li>
                      <li>
                        <strong>Click en "Run"</strong> en el SQL Editor
                      </li>
                      <li>
                        <strong>Recarga esta página</strong> para verificar que funcionó
                      </li>
                    </ol>

                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <p className="text-sm">
                        <strong>¿Por qué pasa esto?</strong> La app usa autenticación con localStorage,
                        pero las políticas RLS de Supabase esperan Supabase Auth. Al deshabilitar RLS,
                        permitimos acceso público para el demo.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!hasRLSErrors && (
              <Card className="border-green-600 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="text-green-600">✅ Todo funcionando correctamente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Todas las tablas son accesibles. Puedes volver a la app.</p>
                  <a href="/" className="text-blue-600 underline mt-2 inline-block">
                    Volver al inicio
                  </a>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
