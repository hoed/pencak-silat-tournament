import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Pencil } from "lucide-react";
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

  const [participant1Scores, setParticipant1Scores] = useState({
    punches: 0,
    kicks: 0,
    throws: 0,
    locks: 0,
    fouls: 0,
    technique: 0,
    compactness: 0,
    expression: 0,
    timing: 0,
    total: 0
  });

  const [participant2Scores, setParticipant2Scores] = useState({
    punches: 0,
    kicks: 0,
    throws: 0,
    locks: 0,
    fouls: 0,
    technique: 0,
    compactness: 0,
    expression: 0,
    timing: 0,
    total: 0
  });

  useEffect(() => {
    if (!currentUser && !currentJudge) {
      navigate("/login");
      return;
    }

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
  const isBout = selectedMatch?.category === 'bout';
  const isArts = selectedMatch?.category === 'arts';

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
      const newScores = { ...prev, [type]: value };
      let total = 0;
      if (isBout) {
        total = (newScores.punches * 1) + (newScores.kicks * 2) + (newScores.throws * 3) + (newScores.locks * 4);
      } else if (isArts) {
        // Example weights: technique (40%), compactness (30%), expression (20%), timing (10%)
        total = (newScores.technique * 0.4) + (newScores.compactness * 0.3) + (newScores.expression * 0.2) + (newScores.timing * 0.1);
      }
      return { ...newScores, total };
    });
  };

  const updateParticipant2Score = (type: string, value: number) => {
    setParticipant2Scores(prev => {
      const newScores = { ...prev, [type]: value };
      let total = 0;
      if (isBout) {
        total = (newScores.punches * 1) + (newScores.kicks * 2) + (newScores.throws * 3) + (newScores.locks * 4);
      } else if (isArts) {
        total = (newScores.technique * 0.4) + (newScores.compactness * 0.3) + (newScores.expression * 0.2) + (newScores.timing * 0.1);
      }
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
      const existingScore = previousScores.find(score => score.round_number === currentRound);

      const scoreData = {
        participant1_score: participant1Scores.total,
        participant2_score: participant2Scores.total,
        participant1_punches: isBout ? participant1Scores.punches : null,
        participant1_kicks: isBout ? participant1Scores.kicks : null,
        participant1_throws: isBout ? participant1Scores.throws : null,
        participant1_locks: isBout ? participant1Scores.locks : null,
        participant2_punches: isBout ? participant2Scores.punches : null,
        participant2_kicks: isBout ? participant2Scores.kicks : null,
        participant2_throws: isBout ? participant2Scores.throws : null,
        participant2_locks: isBout ? participant2Scores.locks : null,
        participant1_fouls: isBout ? participant1Scores.fouls : null,
        participant2_fouls: isBout ? participant2Scores.fouls : null,
        participant1_technique: isArts ? participant1Scores.technique : null,
        participant1_compactness: isArts ? participant1Scores.compactness : null,
        participant1_expression: isArts ? participant1Scores.expression : null,
        participant1_timing: isArts ? participant1Scores.timing : null,
        participant2_technique: isArts ? participant2Scores.technique : null,
        participant2_compactness: isArts ? participant2Scores.compactness : null,
        participant2_expression: isArts ? participant2Scores.expression : null,
        participant2_timing: isArts ? participant2Scores.timing : null,
        category: selectedMatch.category
      };

      if (existingScore) {
        const { error } = await supabase
          .from('round_scores')
          .update(scoreData)
          .eq('id', existingScore.id);

        if (error) throw error;
      } else {
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

      const { data } = await supabase
        .from('round_scores')
        .select('*')
        .eq('match_id', selectedMatchId)
        .eq('judge_id', currentJudge?.id);

      if (data) {
        setPreviousScores(data);
      }

      setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
      setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
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
    setParticipant1Scores({
      punches: score.participant1_punches || 0,
      kicks: score.participant1_kicks || 0,
      throws: score.participant1_throws || 0,
      locks: score.participant1_locks || 0,
      fouls: score.participant1_fouls || 0,
      technique: score.participant1_technique || 0,
      compactness: score.participant1_compactness || 0,
      expression: score.participant1_expression || 0,
      timing: score.participant1_timing || 0,
      total: score.participant1_score || 0
    });
    setParticipant2Scores({
      punches: score.participant2_punches || 0,
      kicks: score.participant2_kicks || 0,
      throws: score.participant2_throws || 0,
      locks: score.participant2_locks || 0,
      fouls: score.participant2_fouls || 0,
      technique: score.participant2_technique || 0,
      compactness: score.participant2_compactness || 0,
      expression: score.participant2_expression || 0,
      timing: score.participant2_timing || 0,
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
                <div>
                  <label className="block text-sm font-medium mb-2">Pilih Pertandingan</label>
                  <Select 
                    value={selectedMatchId} 
                    onValueChange={(value) => {
                      setSelectedMatchId(value);
                      setEditingScoreId(null);
                      setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
                      setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih pertandingan" />
                    </SelectTrigger>
                    <SelectContent>
                      {matches.map((match) => (
                        <SelectItem key={match.id} value={match.id}>
                          Pertandingan #{match.match_number} ({match.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMatch && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Pertandingan #{selectedMatch.match_number} ({selectedMatch.category})</h3>
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
                    {isBout && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Ronde</label>
                        <Select 
                          value={currentRound.toString()} 
                          onValueChange={(val) => {
                            setCurrentRound(parseInt(val));
                            setEditingScoreId(null);
                            const existingScore = previousScores.find(score => score.round_number === parseInt(val));
                            if (existingScore) {
                              setParticipant1Scores({
                                punches: existingScore.participant1_punches || 0,
                                kicks: existingScore.participant1_kicks || 0,
                                throws: existingScore.participant1_throws || 0,
                                locks: existingScore.participant1_locks || 0,
                                fouls: existingScore.participant1_fouls || 0,
                                technique: 0,
                                compactness: 0,
                                expression: 0,
                                timing: 0,
                                total: existingScore.participant1_score || 0
                              });
                              setParticipant2Scores({
                                punches: existingScore.participant2_punches || 0,
                                kicks: existingScore.participant2_kicks || 0,
                                throws: existingScore.participant2_throws || 0,
                                locks: existingScore.participant2_locks || 0,
                                fouls: existingScore.participant2_fouls || 0,
                                technique: 0,
                                compactness: 0,
                                expression: 0,
                                timing: 0,
                                total: existingScore.participant2_score || 0
                              });
                              setEditingScoreId(existingScore.id);
                            } else {
                              setParticipant1Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
                              setParticipant2Scores({ punches: 0, kicks: 0, throws: 0, locks: 0, fouls: 0, technique: 0, compactness: 0, expression: 0, timing: 0, total: 0 });
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
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Nilai Sudut Merah</h3>
                        <div className="space-y-3">
                          {isBout && (
                            <>
                              <div>
                                <label className="text-sm">Pukulan (x1)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant1Scores.punches}
                                  onChange={(e) => updateParticipant1Score('punches', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Tendangan (x2)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant1Scores.kicks}
                                  onChange={(e) => updateParticipant1Score('kicks', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Jatuhan (x3)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant1Scores.throws}
                                  onChange={(e) => updateParticipant1Score('throws', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Kuncian (x4)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant1Scores.locks}
                                  onChange={(e) => updateParticipant1Score('locks', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Pelanggaran</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant1Scores.fouls}
                                  onChange={(e) => updateParticipant1Score('fouls', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                            </>
                          )}
                          {isArts && (
                            <>
                              <div>
                                <label className="text-sm">Teknik (40%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant1Scores.technique}
                                  onChange={(e) => updateParticipant1Score('technique', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Kompak (30%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant1Scores.compactness}
                                  onChange={(e) => updateParticipant1Score('compactness', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Ekspresi (20%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant1Scores.expression}
                                  onChange={(e) => updateParticipant1Score('expression', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Waktu (10%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant1Scores.timing}
                                  onChange={(e) => updateParticipant1Score('timing', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                            </>
                          )}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold">{participant1Scores.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Nilai Sudut Biru</h3>
                        <div className="space-y-3">
                          {isBout && (
                            <>
                              <div>
                                <label className="text-sm">Pukulan (x1)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant2Scores.punches}
                                  onChange={(e) => updateParticipant2Score('punches', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Tendangan (x2)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant2Scores.kicks}
                                  onChange={(e) => updateParticipant2Score('kicks', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Jatuhan (x3)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant2Scores.throws}
                                  onChange={(e) => updateParticipant2Score('throws', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Kuncian (x4)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant2Scores.locks}
                                  onChange={(e) => updateParticipant2Score('locks', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Pelanggaran</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="1"
                                  value={participant2Scores.fouls}
                                  onChange={(e) => updateParticipant2Score('fouls', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                            </>
                          )}
                          {isArts && (
                            <>
                              <div>
                                <label className="text-sm">Teknik (40%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant2Scores.technique}
                                  onChange={(e) => updateParticipant2Score('technique', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Kompak (30%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant2Scores.compactness}
                                  onChange={(e) => updateParticipant2Score('compactness', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Ekspresi (20%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant2Scores.expression}
                                  onChange={(e) => updateParticipant2Score('expression', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label className="text-sm">Waktu (10%)</label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={participant2Scores.timing}
                                  onChange={(e) => updateParticipant2Score('timing', parseInt(e.target.value) || 0)}
                                  className="mt-1"
                                />
                              </div>
                            </>
                          )}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total:</span>
                              <span className="text-xl font-bold">{participant2Scores.total.toFixed(2)}</span>
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
                                  <div className="font-semibold">{score.participant1_score.toFixed(2)}</div>
                                  {score.category === 'bout' && (
                                    <div className="text-xs text-gray-500">
                                      P: {score.participant1_punches} | K: {score.participant1_kicks} | J: {score.participant1_throws} | L: {score.participant1_locks} | F: {score.participant1_fouls}
                                    </div>
                                  )}
                                  {score.category === 'arts' && (
                                    <div className="text-xs text-gray-500">
                                      T: {score.participant1_technique} | C: {score.participant1_compactness} | E: {score.participant1_expression} | W: {score.participant1_timing}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-semibold">{score.participant2_score.toFixed(2)}</div>
                                  {score.category === 'bout' && (
                                    <div className="text-xs text-gray-500">
                                      P: {score.participant2_punches} | K: {score.participant2_kicks} | J: {score.participant2_throws} | L: {score.participant2_locks} | F: {score.participant2_fouls}
                                    </div>
                                  )}
                                  {score.category === 'arts' && (
                                    <div className="text-xs text-gray-500">
                                      T: {score.participant2_technique} | C: {score.participant2_compactness} | E: {score.participant2_expression} | W: {score.participant2_timing}
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