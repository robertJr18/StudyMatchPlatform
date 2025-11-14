import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface UploadMaterialModalProps {
  subjectId: string;
  monitorId: string;
  onSuccess: () => void;
}

export function UploadMaterialModal({ subjectId, monitorId, onSuccess }: UploadMaterialModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("materials").insert({
        ...formData,
        subject_id: subjectId,
        monitor_id: monitorId,
      });

      if (error) throw error;

      toast.success("Material subido exitosamente");
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        file_url: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error uploading material:", error);
      toast.error("Error al subir el material");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Subir Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subir Material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Ej: Guía de Scrum y Agile"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Breve descripción del material"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_url">URL del archivo</Label>
            <Input
              id="file_url"
              type="url"
              placeholder="https://drive.google.com/..."
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Sube el archivo a Google Drive, Dropbox o similar y pega el enlace aquí
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Subiendo..." : "Subir Material"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
