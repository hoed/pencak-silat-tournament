
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { supabase } from "./integrations/supabase/client";

// Insert sample data function
const insertSampleData = async () => {
  console.log("Checking if sample data exists...");
  
  // Insert sample participants
  const { data: existingParticipants } = await supabase
    .from('participants')
    .select('count')
    .limit(1);
  
  if (!existingParticipants || existingParticipants.length === 0) {
    console.log("Inserting sample participants...");
    
    // Insert sample participants
    await supabase.from('participants').insert([
      {
        full_name: 'Agus Setiawan',
        gender: 'Laki-laki',
        date_of_birth: '1998-05-12',
        age_category: 'Dewasa',
        weight_category: 'Kelas A (45-50kg)',
        organization: 'Federasi Pencak Silat',
        branch: 'Cabang Utara',
        sub_branch: 'Divisi Kota A',
        region: 'Jakarta'
      },
      {
        full_name: 'Budi Santoso',
        gender: 'Laki-laki',
        date_of_birth: '1997-03-22',
        age_category: 'Dewasa',
        weight_category: 'Kelas A (45-50kg)',
        organization: 'Federasi Pencak Silat',
        branch: 'Cabang Utara',
        sub_branch: 'Divisi Kota B',
        region: 'Jakarta'
      },
      {
        full_name: 'Cindy Permata',
        gender: 'Perempuan',
        date_of_birth: '1999-11-05',
        age_category: 'Dewasa',
        weight_category: 'Kelas B (50-55kg)',
        organization: 'Asosiasi Silat Nasional',
        branch: 'Cabang Timur',
        sub_branch: 'Distrik 1',
        region: 'Bandung'
      },
      {
        full_name: 'Deni Kurniawan',
        gender: 'Laki-laki',
        date_of_birth: '1996-08-17',
        age_category: 'Dewasa',
        weight_category: 'Kelas C (55-60kg)',
        organization: 'Asosiasi Silat Nasional',
        branch: 'Cabang Barat',
        sub_branch: 'Distrik 3',
        region: 'Surabaya'
      },
      {
        full_name: 'Eka Putri',
        gender: 'Perempuan',
        date_of_birth: '2000-01-30',
        age_category: 'Dewasa',
        weight_category: 'Kelas B (50-55kg)',
        organization: 'Federasi Pencak Silat',
        branch: 'Cabang Selatan',
        sub_branch: 'Divisi Kota C',
        region: 'Yogyakarta'
      },
      {
        full_name: 'Fajar Ramadhan',
        gender: 'Laki-laki',
        date_of_birth: '1995-07-20',
        age_category: 'Dewasa',
        weight_category: 'Kelas D (60-65kg)',
        organization: 'Asosiasi Silat Nasional',
        branch: 'Cabang Timur',
        sub_branch: 'Distrik 2',
        region: 'Medan'
      }
    ]);
    
    console.log("Sample participants inserted.");
  }
  
  // Insert sample matches
  const { data: existingMatches } = await supabase
    .from('matches')
    .select('count')
    .limit(1);
  
  if (!existingMatches || existingMatches.length === 0) {
    console.log("Inserting sample matches...");
    
    // Get participant IDs
    const { data: participantsData } = await supabase
      .from('participants')
      .select('id, gender, weight_category');
    
    if (participantsData && participantsData.length >= 6) {
      // Create matches based on weight category and gender
      const maleA = participantsData.filter(p => p.gender === 'Laki-laki' && p.weight_category === 'Kelas A (45-50kg)');
      const femaleB = participantsData.filter(p => p.gender === 'Perempuan' && p.weight_category === 'Kelas B (50-55kg)');
      const maleC = participantsData.filter(p => p.gender === 'Laki-laki' && p.weight_category === 'Kelas C (55-60kg)');
      const maleD = participantsData.filter(p => p.gender === 'Laki-laki' && p.weight_category === 'Kelas D (60-65kg)');
      
      await supabase.from('matches').insert([
        {
          participant1_id: maleA[0]?.id,
          participant2_id: maleA[1]?.id,
          match_number: 1,
          round_number: 1,
          completed: false
        },
        {
          participant1_id: femaleB[0]?.id,
          participant2_id: femaleB[1]?.id,
          match_number: 2,
          round_number: 1,
          completed: false
        },
        {
          participant1_id: maleC[0]?.id,
          participant2_id: maleD[0]?.id,
          match_number: 3,
          round_number: 1,
          completed: false
        }
      ]);
      
      console.log("Sample matches inserted.");
    }
  }
};

const queryClient = new QueryClient();

const App = () => {
  // Insert sample data on app load (this would be removed in a real app)
  useEffect(() => {
    insertSampleData();
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
