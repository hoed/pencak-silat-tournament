
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTournament } from "@/contexts/TournamentContext";
import { insertSampleData, clearAllData } from "@/services/SampleDataService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const JudgePanel = () => {
  const navigate = useNavigate();
  const { judges, currentUser, logoutUser, fetchJudges, fetchParticipants, fetchMatches } = useTournament();
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in or not an admin
    if (!currentUser || currentUser.role !== 'admin') {
      navigate("/login");
      return;
    }
    
    // Redirect judges to their dashboard
    const judgeInStorage = localStorage.getItem('currentJudge');
    if (judgeInStorage) {
      navigate('/judge-dashboard');
    }
  }, [currentUser, navigate]);

  const handleJudgeLogin = () => {
    navigate("/judge-login");
  };
  
  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleInsertSampleData = async () => {
    setLoading(true);
    try {
      const result = await insertSampleData();
      
      if (result.success) {
        toast.success("Data sampel berhasil dimasukkan");
        
        // Refresh data in the context
        await fetchJudges();
        await fetchParticipants();
        await fetchMatches();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memasukkan data sampel");
      console.error("Error inserting sample data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      const result = await clearAllData();
      
      if (result.success) {
        toast.success("Data berhasil dihapus");
        
        // Refresh data in the context
        await fetchJudges();
        await fetchParticipants();
        await fetchMatches();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data");
      console.error("Error clearing data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel Hakim</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Keluar
          </Button>
        </div>
        
        <Card className="mb-6 border-t-4 border-t-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Panel Penilaian Hakim</CardTitle>
            <p className="text-gray-500">
              Setiap hakim sekarang memiliki dashboard sendiri
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">Dashboard Hakim Baru</h3>
              <p className="text-gray-500 mb-6">
                Kami telah memperbarui sistem dan setiap hakim sekarang memiliki dashboard terpisah 
                untuk memberikan penilaian. Hakim sekarang dapat mengedit nilai yang telah dimasukkan.
                Silakan login untuk mengakses dashboard Anda.
              </p>
              <Button onClick={handleJudgeLogin} className="bg-blue-600 hover:bg-blue-700">
                Login Hakim
              </Button>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Data & Pengujian
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuItem onClick={handleInsertSampleData} disabled={loading}>
                    Masukkan Data Sampel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClearData} disabled={loading}>
                    Hapus Semua Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daftar Hakim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {judges.length === 0 ? (
                <p className="text-gray-500">Tidak ada hakim yang terdaftar</p>
              ) : (
                judges.map((judge) => (
                  <div key={judge.id} className="flex justify-between items-center border p-3 rounded-md">
                    <div>
                      <span className="font-medium">{judge.fullName}</span>
                      <div className="text-sm text-gray-600">
                        Hakim #{judge.judgeNumber}
                      </div>
                    </div>
                    <Badge>Aktif</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default JudgePanel;
