import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Carteira from "./pages/Carteira";
import Financas from "./pages/Financas";
import Servicos from "./pages/Servicos";
import Perfil from "./pages/Perfil";
import Indicacao from "./pages/Indicacao";
import CentralAjuda from "./pages/CentralAjuda";
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
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/carteira"
              element={
                <ProtectedRoute>
                  <Layout><Carteira /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/financas"
              element={
                <ProtectedRoute>
                  <Layout><Financas /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/servicos"
              element={
                <ProtectedRoute>
                  <Layout><Servicos /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Layout><Perfil /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/indicacao"
              element={
                <ProtectedRoute>
                  <Layout><Indicacao /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/central-ajuda"
              element={
                <ProtectedRoute>
                  <Layout><CentralAjuda /></Layout>
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
