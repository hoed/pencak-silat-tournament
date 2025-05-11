
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTournament } from "@/contexts/TournamentContext";

const JudgePanel = () => {
  const navigate = useNavigate();
  const { participants, matches, updateMatch, currentMatchId, judges } = useTournament();
  const [judgeId, setJudgeId] = useState("1");
  const [participant1Score, setParticipant1Score] = useState("");
  const [participant2Score, setParticipant2Score] = useState("");
  const [currentRound, setCurrentRound] = useState(1);
  
  const currentMatch = matches.find(match => match.id === currentMatchId);
  
  const participant1 = currentMatch?.participant1Id
    ? participants.find(p => p.id === currentMatch.participant1Id)
    : null;
  
  const participant2 = currentMatch?.participant2Id
    ? participants.find(p => p.id === currentMatch.participant2Id)
    : null;

  useEffect(() => {
    // Redirect judges to their dashboard
    const judgeInStorage = localStorage.getItem('currentJudge');
    if (judgeInStorage) {
      navigate('/judge-dashboard');
    }
  }, [navigate]);

  const submitScore = () => {
    if (!currentMatch) {
      toast.error("Tidak ada pertandingan aktif yang dipilih");
      return;
    }
    
    if (!participant1Score || !participant2Score) {
      toast.error("Silakan masukkan nilai untuk kedua peserta");
      return;
    }
    
    const p1Score = parseFloat(participant1Score);
    const p2Score = parseFloat(participant2Score);
    
    if (isNaN(p1Score) || isNaN(p2Score) || p1Score < 0 || p1Score > 10 || p2Score < 0 || p2Score > 10) {
      toast.error("Nilai harus antara 0 dan 10");
      return;
    }
    
    // Find existing round or create a new one
    let matchRounds = [...currentMatch.rounds];
    let currentRoundObj = matchRounds.find(r => r.number === currentRound);
    
    if (!currentRoundObj) {
      currentRoundObj = {
        id: `round-${currentMatch.id}-${currentRound}`,
        number: currentRound,
        scores: {}
      };
      matchRounds.push(currentRoundObj);
    }
    
    // Update the scores for this judge
    const updatedRounds = matchRounds.map(round => {
      if (round.number === currentRound) {
        return {
          ...round,
          scores: {
            ...round.scores,
            [`${judgeId}-participant1`]: p1Score,
            [`${judgeId}-participant2`]: p2Score
          }
        };
      }
      return round;
    });
    
    // Update the match with new rounds data
    const updatedMatch = {
      ...currentMatch,
      rounds: updatedRounds
    };
    
    updateMatch(updatedMatch);
    toast.success(`Nilai untuk Ronde ${currentRound} berhasil disimpan`);
    
    // Clear score inputs
    setParticipant1Score("");
    setParticipant2Score("");
  };

  const handleJudgeLogin = () => {
    navigate("/judge-login");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
