
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
import ScoringCriteria from "@/components/ScoringCriteria";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const JudgeDashboard = () => {
  const { currentUser, currentJudge, logoutUser, logoutJudge, currentMatchId, participants } = useTournament();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [currentRound, setCurrentRound] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousScores, setPreviousScores] = useState<any[]>([]);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  
  // New state for detailed scoring
  const [participant1Scores, setParticipant1Scores] = useState({
    punches: 0,
    kicks: 0,
    throws: 0,
    total: 0
  });
  
  const [participant2Scores, setParticipant2Scores] = useState({
    punches: 0,
    kicks: 0,
    throws: 0,
    total: 0
  });
  
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

  const updateParticipant1Score = (type: string, value: number) => {
    setParticipant1Scores(prev => {
      const newScores = { 
        ...prev, 
        [type]: value 
      };
      
      // Calculate total
      const total = Number(newScores.punches) + Number(newScores.kicks) + Number(newScores.throws);
      return { ...newScores, total };
    });
  };

  const updateParticipant2Score = (type: string, value: number) => {
    setParticipant2Scores(prev => {
      const newScores = { 
        ...prev, 
        [type]: value 
      };
      
      // Calculate total
      const total = Number(newScores.punches) + Number(newScores.kicks) + Number(newScores.throws);
      return { ...newScores, total };
    });
  };

  const submitScore = async () => {
    if (!selectedMatchId) {
      toast.error("Mohon pilih pertandingan terlebih dahulu");
      return;
    }
    
    if (participant1Scores.total === 0 || participant2Scores.total === 0) {
      toast.error("Mohon masukkan nilai untuk kedua peserta");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if score for this round already exists
      const existingScore = previousScores.find(
        score => score.round_number === currentRound
      );
      
      const scoreData = {
        participant1_score: participant1Scores.total,
        participant2_score: participant2Scores.total,
        participant1_punches: participant1Scores.punches,
        participant1_kicks: participant1Scores.kicks,
        participant1_throws: participant1Scores.throws,
        participant2_punches: participant2Scores.punches,
        participant2_kicks: participant2Scores.kicks,
        participant2_throws: participant2Scores.throws,
      };
      
      if (existingScore) {
        // Update existing score
        const { error } = await supabase
          .from('round_scores')
          .update(scoreData)
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
            ...scoreData
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
      setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
      setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
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
    
    // Set detailed scores if available, otherwise use legacy format
    setParticipant1Scores({
      punches: score.participant1_punches || 0,
      kicks: score.participant1_kicks || 0,
      throws: score.participant1_throws || 0,
      total: score.participant1_score || 0
    });
    
    setParticipant2Scores({
      punches: score.participant2_punches || 0,
      kicks: score.participant2_kicks || 0,
      throws: score.participant2_throws || 0,
      total: score.participant2_score || 0
    });
    
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
                      setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
                      setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
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
                            setParticipant1Scores({
                              punches: existingScore.participant1_punches || 0,
                              kicks: existingScore.participant1_kicks || 0,
                              throws: existingScore.participant1_throws || 0,
                              total: existingScore.participant1_score || 0
                            });
                            
                            setParticipant2Scores({
                              punches: existingScore.participant2_punches || 0,
                              kicks: existingScore.participant2_kicks || 0,
                              throws: existingScore.participant2_throws || 0,
                              total: existingScore.participant2_score || 0
                            });
                            
                            setEditingScoreId(existingScore.id);
                          } else {
                            setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
                            setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, total: 0 });
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
                    
                    {/* Detailed Scoring */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Participant 1 Scoring */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Nilai Sudut Merah</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm">Pukulan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant1Scores.punches}
                              onChange={(e) => updateParticipant1Score('punches', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm">Tendangan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant1Scores.kicks}
                              onChange={(e) => updateParticipant1Score('kicks', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm">Jatuhan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant1Scores.throws}
                              onChange={(e) => updateParticipant1Score('throws', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold">{participant1Scores.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Participant 2 Scoring */}
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Nilai Sudut Biru</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm">Pukulan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant2Scores.punches}
                              onChange={(e) => updateParticipant2Score('punches', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm">Tendangan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant2Scores.kicks}
                              onChange={(e) => updateParticipant2Score('kicks', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm">Jatuhan (0-10)</label>
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={participant2Scores.throws}
                              onChange={(e) => updateParticipant2Score('throws', parseFloat(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold">{participant2Scores.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={submitScore} 
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
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
                      <div className="mt-8">
                        <h3 className="font-semibold mb-4">Nilai Sebelumnya</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ronde</TableHead>
                              <TableHead>Sudut Merah</TableHead>
                              <TableHead>Sudut Biru</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previousScores.map((score) => (
                              <TableRow key={score.id}>
                                <TableCell>
                                  <Badge variant="outline">Ronde {score.round_number}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-semibold">{score.participant1_score}</div>
                                  {(score.participant1_punches !== undefined) && (
                                    <div className="text-xs text-gray-500">
                                      P: {score.participant1_punches} | K: {score.participant1_kicks} | J: {score.participant1_throws}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-semibold">{score.participant2_score}</div>
                                  {(score.participant2_punches !== undefined) && (
                                    <div className="text-xs text-gray-500">
                                      P: {score.participant2_punches} | K: {score.participant2_kicks} | J: {score.participant2_throws}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditScore(score)}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
