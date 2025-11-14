import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, appUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (appUser) {
      const redirectMap = {
        student: "/estudiante/dashboard",
        monitor: "/monitor/dashboard",
        coordinator: "/admin/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(redirectMap[appUser.role] || "/", { replace: true });
    }
  }, [appUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith("@universidad.edu.co")) {
      toast.error("Email debe ser @universidad.edu.co");
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email o contraseña incorrectos. Verifica tus credenciales.");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Email no confirmado. Contacta al administrador.");
      } else {
        toast.error("Error al iniciar sesión: " + error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">StudyMatch</CardTitle>
            <CardDescription>Plataforma de gestión de monitorías</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email universitario
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu.nombre@universidad.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={
                  email && !email.endsWith("@universidad.edu.co")
                    ? "border-destructive"
                    : ""
                }
              />
              {email && !email.endsWith("@universidad.edu.co") && (
                <p className="text-xs text-destructive">
                  El email debe terminar en @universidad.edu.co
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1 pt-4 border-t">
              <p className="font-semibold mb-2">Usuarios de prueba:</p>
              <div className="space-y-1">
                <p className="font-mono">robert.gonzalez@universidad.edu.co</p>
                <p className="text-[10px]">Password: Robert123!</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono">jussi.torres@universidad.edu.co</p>
                <p className="text-[10px]">Password: Jussi123!</p>
              </div>
              <div className="space-y-1">
                <p className="font-mono">admin@universidad.edu.co</p>
                <p className="text-[10px]">Password: Admin123!</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
