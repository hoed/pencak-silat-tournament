
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";

const JudgeDashboard = () => {
  const { currentUser, currentJudge, logoutUser, logoutJudge, currentMatchId, participants } = useTournament();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [currentRound, setCurrentRound] = useState(1);
  const [participant1Score, setParticipant1Score] = useState("");
  const [participant2Score, setParticipant2Score] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousScores, setPreviousScores] = useState<any[]>([]);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if no user or judge is logged in
    if (!currentUser && !currentJudge) {
      navigate("/login");
      return;
    }
    
    // Fetch matches
    const fetchMatches = async () => {
      const { data, error } = await supabase.from('matches').select('*').eq('completed', false);
      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }
      
      if (data) {
        setMatches(data);
        if (currentMatchId && data.find(m => m.id === currentMatchId)) {
          setSelectedMatchId(currentMatchId);
        }
      }
    };
    
    fetchMatches();
  }, [currentUser, currentJudge, currentMatchId, navigate]);
  
  useEffect(() => {
    // Fetch previous scores for this judge and match
    if (selectedMatchId && currentJudge) {
      const fetchScores = async () => {
        const { data, error } = await supabase
          .from('round_scores')
          .select('*')
          .eq('match_id', selectedMatchId)
          .eq('judge_id', currentJudge.id);
        
        if (error) {
          console.error('Error fetching scores:', error);
          return;
        }
        
        if (data) {
          setPreviousScores(data);
        }
      };
      
      fetchScores();
    }
  }, [selectedMatchId, currentJudge]);

  const selectedMatch = matches.find(match => match.id === selectedMatchId);
  
  const participant1 = selectedMatch?.participant1_id
    ? participants.find(p => p.id === selectedMatch.participant1_id)
    : null;
  
  const participant2 = selectedMatch?.participant2_id
    ? participants.find(p => p.id === selectedMatch.participant2_id)
    : null;
  
  const handleLogout = async () => {
    if (currentUser) {
      await logoutUser();
    } else {
      logoutJudge();
    }
    navigate("/login");
  };

  const submitScore = async () => {
    if (!selectedMatchId) {
      toast.error("Mohon pilih pertandingan terlebih dahulu");
      return;
    }
    
    if (!participant1Score || !participant2Score) {
      toast.error("Mohon masukkan nilai untuk kedua peserta");
      return;
    }
    
    const p1Score = parseFloat(participant1Score);
    const p2Score = parseFloat(participant2Score);
    
    if (isNaN(p1Score) || isNaN(p2Score) || p1Score < 0 || p1Score > 10 || p2Score < 0 || p2Score > 10) {
      toast.error("Nilai harus antara 0 dan 10");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if score for this round already exists
      const existingScore = previousScores.find(
        score => score.round_number === currentRound
      );
      
      if (existingScore) {
        // Update existing score
        const { error } = await supabase
          .from('round_scores')
          .update({
            participant1_score: p1Score,
            participant2_score: p2Score
          })
          .eq('id', existingScore.id);
        
        if (error) throw error;
      } else {
        // Insert new score
        const { error } = await supabase
          .from('round_scores')
          .insert({
            match_id: selectedMatchId,
            round_number: currentRound,
            judge_id: currentJudge?.id,
            participant1_score: p1Score,
            participant2_score: p2Score
          });
        
        if (error) throw error;
      }
      
      toast.success(`Nilai untuk Ronde ${currentRound} berhasil disimpan`);
      
      // Refresh scores
      const { data } = await supabase
        .from('round_scores')
        .select('*')
        .eq('match_id', selectedMatchId)
        .eq('judge_id', currentJudge?.id);
      
      if (data) {
        setPreviousScores(data);
      }
      
      // Reset form
      setParticipant1Score("");
      setParticipant2Score("");
      setEditingScoreId(null);
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error("Terjadi kesalahan saat menyimpan nilai");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditScore = (score: any) => {
    setCurrentRound(score.round_number);
    setParticipant1Score(score.participant1_score.toString());
    setParticipant2Score(score.participant2_score.toString());
    setEditingScoreId(score.id);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="mb-6 border-t-4 border-t-blue-600">
          <CardHeader className="pb-2 flex flex-wrap justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Dashboard Hakim</CardTitle>
              {currentJudge && (
                <p className="text-gray-500">
                  Selamat datang, {currentJudge.fullName} (Hakim #{currentJudge.judgeNumber})
                </p>
              )}
              {currentUser && currentUser.role === 'judge' && (
                <p className="text-gray-500">
                  Selamat datang, Hakim ({currentUser.email})
                </p>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Keluar
            </Button>
          </CardHeader>
          
          <CardContent>
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Tidak Ada Pertandingan Aktif</h3>
                <p className="text-gray-500 mb-4">
                  Silakan tunggu administrator turnamen untuk memulai pertandingan
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Match Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Pilih Pertandingan</label>
                  <Select 
                    value={selectedMatchId} 
                    onValueChange={(value) => {
                      setSelectedMatchId(value);
                      setEditingScoreId(null); // Reset editing state when changing match
                      setParticipant1Score("");
                      setParticipant2Score("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih pertandingan" />
                    </SelectTrigger>
                    <SelectContent>
                      {matches.map((match) => (
                        <SelectItem key={match.id} value={match.id}>
                          Pertandingan #{match.match_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Match Info */}
                {selectedMatch && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Pertandingan #{selectedMatch.match_number}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="border p-3 rounded-lg bg-white">
                        <span className="text-xs text-gray-500 block mb-1">SUDUT MERAH</span>
                        <h3 className="font-bold">{participant1?.fullName || "Belum ditentukan"}</h3>
                      </div>
                      
                      <div className="border p-3 rounded-lg bg-white">
                        <span className="text-xs text-gray-500 block mb-1">SUDUT BIRU</span>
                        <h3 className="font-bold">{participant2?.fullName || "Belum ditentukan"}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedMatch && (
                  <>
                    {/* Round Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Ronde</label>
                      <Select 
                        value={currentRound.toString()} 
                        onValueChange={(val) => {
                          setCurrentRound(parseInt(val));
                          setEditingScoreId(null); // Reset editing state when changing round
                          
                          // Pre-fill with existing score if available
                          const existingScore = previousScores.find(
                            score => score.round_number === parseInt(val)
                          );
                          
                          if (existingScore) {
                            setParticipant1Score(existingScore.participant1_score.toString());
                            setParticipant2Score(existingScore.participant2_score.toString());
                            setEditingScoreId(existingScore.id);
                          } else {
                            setParticipant1Score("");
                            setParticipant2Score("");
                          }
                        }}
                      >
                        <SelectTrigger className="w-full md:w-1/3">
                          <SelectValue placeholder="Pilih ronde" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Ronde 1</SelectItem>
                          <SelectItem value="2">Ronde 2</SelectItem>
                          <SelectItem value="3">Ronde 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Scoring */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nilai Sudut Merah (0-10)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="Masukkan nilai"
                          value={participant1Score}
                          onChange={(e) => setParticipant1Score(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nilai Sudut Biru (0-10)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="Masukkan nilai"
                          value={participant2Score}
                          onChange={(e) => setParticipant2Score(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={submitScore} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? "Menyimpan..." 
                        : editingScoreId 
                          ? "Perbarui Nilai" 
                          : "Simpan Nilai"
                      }
                    </Button>
                    
                    {/* Previous Scores */}
                    {previousScores.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2">Nilai Sebelumnya</h3>
                        <div className="space-y-3">
                          {previousScores.map((score) => (
                            <div key={score.id} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <Badge variant="outline">Ronde {score.round_number}</Badge>
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditScore(score)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-xs text-gray-500">Sudut Merah</span>
                                  <p className="font-semibold">{score.participant1_score}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-500">Sudut Biru</span>
                                  <p className="font-semibold">{score.participant2_score}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default JudgeDashboard;
