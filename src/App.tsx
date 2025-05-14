import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Brackets from "./pages/Brackets";
import Registration from "./pages/Registration";
import JudgePanel from "./pages/JudgePanel";
import AdminPanel from "./pages/AdminPanel";
import Organizations from "./pages/Organizations";
import JudgeLogin from "./pages/JudgeLogin";
import JudgeDashboard from "./pages/JudgeDashboard";
import { TournamentProvider } from "./contexts/TournamentContext";
import Login from "./pages/Login";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import { useEffect } from "react";
import { insertSampleData, clearAllData } from "./services/SampleDataService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  // Insert sample data on app load only for development and if admin is authenticated
  useEffect(() => {
    const loadSampleData = async () => {
      // Skip in production
      if (process.env.NODE_ENV === "production") {
        return;
      }

      try {
        // Check for authenticated admin user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== "admin@admin.com") {
          console.log("Skipping sample data insertion: Admin not authenticated");
          toast.info("Data sampel tidak dimuat: Harap login sebagai admin");
          return;
        }

        // First clear all existing data
        const clearResult = await clearAllData();
        
        if (!clearResult.success) {
          console.error("Error clearing data:", clearResult.message);
          toast.error("Gagal menghapus data lama: " + clearResult.message);
          return;
        }
        
        // Then insert fresh sample data
        const result = await insertSampleData();
        console.log("Sample data initialization result:", result);
        
        if (result.success) {
          toast.success("Data sampel berhasil dimuat");
        } else {
          console.error("Error inserting sample data:", result.message);
          toast.error("Gagal memuat data sampel: " + result.message);
        }
      } catch (error: any) {
        console.error("Error initializing sample data:", error.message);
        toast.error("Terjadi kesalahan saat memuat data sampel: " + error.message);
      }
    };
    
    loadSampleData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TournamentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/brackets" element={<Brackets />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/judge-panel" element={<JudgePanel />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/judge-login" element={<JudgeLogin />} />
              <Route path="/judge-dashboard" element={<JudgeDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/participant-dashboard" element={<ParticipantDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TournamentProvider>
    </QueryClientProvider>
  );
};

export default App;