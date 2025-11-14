import { useState } from "react";
import { GraduationCap, Calendar, Users, BookOpen, BarChart3, Github, Mail } from "lucide-react";
import { LoginModal } from "@/components/LoginModal";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const [showLogin, setShowLogin] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Votación Inteligente",
      description: "Sistema democrático para elegir horarios de monitorías"
    },
    {
      icon: Users,
      title: "Control de Asistencia",
      description: "Registro digital y automático de asistencia"
    },
    {
      icon: BookOpen,
      title: "Materiales Centralizados",
      description: "Acceso unificado a recursos académicos"
    },
    {
      icon: BarChart3,
      title: "Analytics Institucionales",
      description: "Métricas y reportes en tiempo real"
    }
  ];

  const founders = [
    { name: "Camilo Estrada Ortega", role: "Co-fundador", special: false },
    { name: "Robert González Cabarcas", role: "Desarrollador Web & Co-fundador", special: true },
    { name: "Jose Londoño Páez", role: "Co-fundador", special: false },
    { name: "Jussi Torres González", role: "Co-fundador", special: false },
    { name: "Daniel Otero Núñez", role: "Co-fundador", special: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <Button onClick={() => setShowLogin(true)}>
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <GraduationCap className="h-20 w-20 text-primary mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          StudyMatch
        </h1>
        <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-medium">
          La plataforma premium de gestión académica
        </p>
        <p className="text-xl text-muted-foreground mb-8">
          Automatiza y optimiza las monitorías universitarias
        </p>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              ¿Listo para comenzar?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 hover:scale-105 transition-transform cursor-pointer">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">¿Eres Estudiante?</h3>
                <p className="text-muted-foreground mb-4">
                  Accede a monitorías, vota horarios y consulta materiales
                </p>
                <Button onClick={() => setShowLogin(true)} className="w-full">
                  Ingresar como Estudiante
                </Button>
              </div>

              <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 hover:scale-105 transition-transform cursor-pointer">
                <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">¿Eres Monitor?</h3>
                <p className="text-muted-foreground mb-4">
                  Gestiona horarios, comparte materiales y registra asistencia
                </p>
                <Button onClick={() => setShowLogin(true)} variant="outline" className="w-full">
                  Ingresar como Monitor
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                ¿Tu universidad ya usa StudyMatch?
              </p>
              <Button onClick={() => setShowLogin(true)} variant="ghost" size="lg">
                Inicia sesión aquí
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          ¿Por qué StudyMatch?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover-scale border-border/50 hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Founders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          👥 Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {founders.map((founder, index) => (
            <Card
              key={index}
              className={`text-center group hover:scale-110 hover:shadow-2xl hover:bg-primary/5 transition-all duration-300 cursor-pointer ${
                founder.special ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{founder.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{founder.role}</p>
                {founder.special && (
                  <div className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                    💻 Developer
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Contáctanos</h2>
            <p className="text-muted-foreground mb-6">
              ¿Tienes preguntas o quieres implementar StudyMatch en tu universidad?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => window.open('https://github.com/robertJr18', '_blank')}
              >
                <Github className="h-5 w-5" />
                Ver en GitHub
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => window.open('mailto:robert.gonzalez@universidad.edu.co')}
              >
                <Mail className="h-5 w-5" />
                Enviar Email
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Proyecto desarrollado por Robert González
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2025 StudyMatch. Transformando la educación universitaria.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/robertJr18"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Demo académico - Gestión de Proyectos 2025
          </p>
        </div>
      </footer>

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
}
