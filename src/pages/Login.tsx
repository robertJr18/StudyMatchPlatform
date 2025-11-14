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
      toast.error("Error al iniciar sesión: " + error.message);
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
              />
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

            <div className="text-xs text-muted-foreground text-center space-y-1 pt-4">
              <p className="font-semibold">Usuarios de prueba:</p>
              <p>robert.gonzalez@universidad.edu.co</p>
              <p>jussi.torres@universidad.edu.co</p>
              <p>admin@universidad.edu.co</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
