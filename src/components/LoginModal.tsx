import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith("@universidad.edu.co")) {
      toast.error("Email debe ser @universidad.edu.co");
      return;
    }

    if (password !== "123") {
      toast.error("Contraseña incorrecta");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        toast.success(`Bienvenido, ${data.full_name}`);
        onOpenChange(false);
        
        // Redirigir según rol
        const redirectMap: Record<string, string> = {
          student: "/estudiante/dashboard",
          monitor: "/monitor/dashboard",
          coordinator: "/admin/dashboard",
          admin: "/admin/dashboard",
        };
        navigate(redirectMap[data.role] || "/");
      } else {
        toast.error("Usuario no encontrado");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <DialogTitle className="text-2xl">Iniciar Sesión</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email institucional
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

          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <p className="font-semibold text-center mb-3">💡 Usuarios de prueba</p>
            <div className="space-y-2">
              <p className="font-mono text-xs">robert.gonzalez@universidad.edu.co</p>
              <p className="font-mono text-xs">jussi.torres@universidad.edu.co</p>
              <p className="font-mono text-xs">admin@universidad.edu.co</p>
            </div>
            <p className="text-center font-semibold text-primary mt-3">
              Contraseña: 123
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
