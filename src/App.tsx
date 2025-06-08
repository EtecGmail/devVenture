
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Professor from "./pages/Professor";
import Aluno from "./pages/Aluno";
import AlunoLogin from "./pages/AlunoLogin";
import ProfessorLogin from "./pages/ProfessorLogin";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import OverviewPage from "./pages/admin/Overview";
import ProfessoresPage from "./pages/admin/Professores";
import AlunosPage from "./pages/admin/Alunos";
import AnalyticsPage from "./pages/admin/Analytics";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/professor"
              element={
                <ProtectedRoute requiredType="professor">
                  <Professor />
                </ProtectedRoute>
              }
            />
            <Route path="/professor/login" element={<ProfessorLogin />} />
            <Route
              path="/aluno"
              element={
                <ProtectedRoute requiredType="aluno">
                  <Aluno />
                </ProtectedRoute>
              }
            />
            <Route path="/aluno/login" element={<AlunoLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredType="admin">
                  <Admin />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="professores" element={<ProfessoresPage />} />
              <Route path="alunos" element={<AlunosPage />} />
              <Route path="analises" element={<AnalyticsPage />} />
            </Route>
            <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
