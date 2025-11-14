import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAttendance from "./pages/StudentAttendance";
import SubjectDetail from "./pages/SubjectDetail";
import MonitorDashboard from "./pages/MonitorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSubjects from "./pages/AdminSubjects";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import DiagnosticPage from "./pages/DiagnosticPage";
import ForceSetupPage from "./pages/ForceSetupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/diagnostico" element={<DiagnosticPage />} />
            <Route path="/force-setup" element={<ForceSetupPage />} />

            <Route
              path="/estudiante/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/estudiante/materia/:id"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <SubjectDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/estudiante/asistencia"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentAttendance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/estudiante/perfil"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["monitor"]}>
                  <MonitorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitor/perfil"
              element={
                <ProtectedRoute allowedRoles={["monitor"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["coordinator", "admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={["coordinator", "admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/materias"
              element={
                <ProtectedRoute allowedRoles={["coordinator", "admin"]}>
                  <AdminSubjects />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perfil"
              element={
                <ProtectedRoute allowedRoles={["coordinator", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
