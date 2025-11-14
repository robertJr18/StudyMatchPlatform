import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import SubjectDetail from "./pages/SubjectDetail";
import MonitorDashboard from "./pages/MonitorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
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
              path="/monitor/dashboard"
              element={
                <ProtectedRoute allowedRoles={["monitor"]}>
                  <MonitorDashboard />
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
