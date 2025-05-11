
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTournament } from "@/contexts/TournamentContext";

const JudgePanel = () => {
  const navigate = useNavigate();
  const { judges, currentUser, logoutUser } = useTournament();
  
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
                untuk memberikan penilaian. Silakan login untuk mengakses dashboard Anda.
              </p>
              <Button onClick={handleJudgeLogin} className="bg-blue-600 hover:bg-blue-700">
                Login Hakim
              </Button>
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
