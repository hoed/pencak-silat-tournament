import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTournament } from "@/contexts/TournamentContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminPanel = () => {
  const { participants, matches, updateMatch, currentMatchId, setCurrentMatchId } = useTournament();
  
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [timerActive, setTimerActive] = useState(false);
  const [time, setTime] = useState(120); // 2 minutes per round for Bout
  const [currentRound, setCurrentRound] = useState(1);
  const [roundBreak, setRoundBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(60); // 1 minute break
  const [showCharts, setShowCharts] = useState(false);
  const [matchScores, setMatchScores] = useState<any[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentMatchId && !selectedMatch) {
      setSelectedMatch(currentMatchId);
    }
    
    const fetchMatches = async () => {
      const { data, error } = await supabase.from('matches').select('*');
      if (error) {
        console.error("Error fetching matches:", error);
        toast.error("Gagal mengambil data pertandingan");
        return;
      }
      
      if (data) {
        data.forEach(match => {
          updateMatch({
            id: match.id,
            participant1Id: match.participant1_id,
            participant2Id: match.participant2_id,
            rounds: [],
            winnerId: match.winner_id,
            matchNumber: match.match_number,
            roundNumber: match.round_number,
            completed: match.completed,
            category: match.category || 'bout'
          });
        });
      }
    };
    
    fetchMatches();
  }, [currentMatchId, selectedMatch, updateMatch]);

  useEffect(() => {
    if (selectedMatch) {
      const fetchScores = async () => {
        const { data, error } = await supabase
          .from('round_scores')
          .select('*, judges(full_name)')
          .eq('match_id', selectedMatch);
        
        if (error) {
          console.error('Error fetching scores:', error);
          toast.error("Gagal mengambil skor");
          return;
        }
        
        setMatchScores(data || []);
      };
      
      fetchScores();
    }
  }, [selectedMatch]);

  useEffect(() => {
    const currentMatch = matches.find(m => m.id === selectedMatch);
    if (!currentMatch || currentMatch.category === 'arts') {
      setTimerActive(false);
      setTime(0);
      setRoundBreak(false);
      setCurrentRound(1);
      return;
    }

    if (timerActive && !roundBreak) {
      if (time > 0) {
        timerRef.current = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else {
        setTimerActive(false);
        if (currentRound < 3) {
          toast.info(`Ronde ${currentRound} selesai! Memulai istirahat`);
          setRoundBreak(true);
          setBreakTime(60);
        } else {
          toast.info("Pertandingan selesai!");
          completeMatch();
        }
      }
    } else if (roundBreak) {
      if (breakTime > 0) {
        timerRef.current = setTimeout(() => {
          setBreakTime(breakTime - 1);
        }, 1000);
      } else {
        setRoundBreak(false);
        setCurrentRound(currentRound + 1);
        setTime(120);
        setTimerActive(true);
        toast.info(`Ronde ${currentRound + 1} dimulai!`);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, time, roundBreak, breakTime, currentRound, selectedMatch]);

  const startTimer = () => {
    const match = matches.find(m => m.id === selectedMatch);
    if (!selectedMatch || !match) {
      toast.error("Silakan pilih pertandingan terlebih dahulu");
      return;
    }
    
    if (match.category === 'arts') {
      toast.info("Kategori Seni tidak menggunakan timer");
      return;
    }
    
    setTimerActive(true);
    setCurrentMatchId(selectedMatch);
    toast.success(`Ronde ${currentRound} dimulai!`);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTime(120);
    setRoundBreak(false);
    setBreakTime(60);
    setCurrentRound(1);
  };

  const nextRound = () => {
    const match = matches.find(m => m.id === selectedMatch);
    if (!match || match.category === 'arts') return;
    
    if (currentRound < 3) {
      setTimerActive(false);
      setRoundBreak(true);
      setBreakTime(60);
    } else {
      toast.info("Ini adalah ronde terakhir!");
      completeMatch();
    }
  };

  const completeMatch = async () => {
    if (!selectedMatch) return;
    
    const match = matches.find(m => m.id === selectedMatch);
    if (!match) {
      toast.error("Pertandingan tidak ditemukan");
      return;
    }

    const { data: scores, error } = await supabase
      .from('round_scores')
      .select('*')
      .eq('match_id', match.id);

    if (error) {
      console.error('Error fetching scores:', error);
      toast.error("Gagal mengambil skor");
      return;
    }

    let p1TotalScore = 0;
    let p2TotalScore = 0;
    let p1Fouls = 0;
    let p2Fouls = 0;
    let p1TechnicalScore = 0;
    let p2TechnicalScore = 0;

    if (match.category === 'bout') {
      scores.forEach(score => {
        p1TotalScore += score.participant1_score;
        p2TotalScore += score.participant2_score;
        p1Fouls += score.participant1_fouls || 0;
        p2Fouls += score.participant2_fouls || 0;
        p1TechnicalScore += (score.participant1_punches || 0) + (score.participant1_kicks || 0);
        p2TechnicalScore += (score.participant2_punches || 0) + (score.participant2_kicks || 0);
      });
    } else {
      scores.forEach(score => {
        p1TotalScore += score.participant1_score;
        p2TotalScore += score.participant2_score;
      });
    }

    let winnerId = null;
    let isDraw = false;
    if (p1TotalScore > p2TotalScore) {
      winnerId = match.participant1Id;
    } else if (p2TotalScore > p1TotalScore) {
      winnerId = match.participant2Id;
    } else if (match.category === 'bout') {
      if (p1Fouls < p2Fouls) {
        winnerId = match.participant1Id;
      } else if (p2Fouls < p1Fouls) {
        winnerId = match.participant2Id;
      } else if (p1TechnicalScore > p2TechnicalScore) {
        winnerId = match.participant1Id;
      } else if (p2TechnicalScore > p1TechnicalScore) {
        winnerId = match.participant2Id;
      } else {
        isDraw = true;
        toast.info("Pertandingan berakhir seri! Memerlukan ronde tambahan.");
      }
    } else {
      isDraw = true;
      toast.info("Pertandingan berakhir seri!");
    }

    const updatedMatch = {
      ...match,
      winnerId,
      completed: !isDraw
    };
    
    updateMatch(updatedMatch);
    
    const { error: updateError } = await supabase
      .from('matches')
      .update({
        winner_id: winnerId,
        completed: !isDraw
      })
      .eq('id', match.id);
      
    if (updateError) {
      console.error('Error updating match in database:', updateError);
      toast.error("Gagal menyimpan hasil pertandingan ke database");
      return;
    }
    
    if (!isDraw) {
      setTimerActive(false);
      setSelectedMatch("");
      setCurrentMatchId(null);
      setCurrentRound(1);
      setTime(120);
      setRoundBreak(false);
      setBreakTime(60);
      
      const winner = participants.find(p => p.id === winnerId);
      toast.success(`Pertandingan selesai! Pemenang: ${winner?.fullName || "Tidak ditentukan"}`);
    }
  };

  const createDemoMatch = async () => {
    if (participants.length < 2) {
      toast.error("Butuh minimal 2 peserta untuk membuat pertandingan demo");
      return;
    }

    const participant1 = participants[0];
    const participant2 = participants[1];
    
    const matchNumber = matches.length + 1;
    
    const { data, error } = await supabase
      .from('matches')
      .insert({
        id: uuidv4(),
        participant1_id: participant1.id,
        participant2_id: participant2.id,
        match_number: matchNumber,
        round_number: 1,
        completed: false,
        category: 'bout'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating match in database:', error);
      toast.error("Gagal membuat pertandingan demo di database");
      return;
    }
    
    const newMatch = {
      id: data.id,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      rounds: [],
      winnerId: null,
      matchNumber: matchNumber,
      roundNumber: 1,
      completed: false,
      category: 'bout' as 'bout'
    };
    
    updateMatch(newMatch);
    setSelectedMatch(newMatch.id);
    toast.success("Pertandingan demo dibuat!");
  };

  const currentMatchObj = matches.find(match => match.id === selectedMatch);
  
  const participant1 = currentMatchObj?.participant1Id
    ? participants.find(p => p.id === currentMatchObj.participant1Id)
    : null;
  
  const participant2 = currentMatchObj?.participant2Id
    ? participants.find(p => p.id === currentMatchObj.participant2Id)
    : null;

  const participantsByGender = [
    { name: 'Laki-laki', value: participants.filter(p => p.gender === 'Laki-laki').length },
    { name: 'Perempuan', value: participants.filter(p => p.gender === 'Perempuan').length }
  ];

  const matchesByStatus = [
    { name: 'Selesai', value: matches.filter(m => m.completed).length },
    { name: 'Belum Selesai', value: matches.filter(m => !m.completed).length }
  ];

  const participantsByCategory = Array.from(
    new Set(participants.map(p => p.weightCategory))
  ).map(category => ({
    name: category || 'Tidak ada kategori',
    value: participants.filter(p => p.weightCategory === category).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Tabs defaultValue="match-control">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="match-control" className="flex-1">Pengaturan Pertandingan</TabsTrigger>
            <TabsTrigger value="tournament-management" className="flex-1">Manajemen Turnamen</TabsTrigger>
            <TabsTrigger value="charts" className="flex-1">Statistik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="match-control">
            <Card className="border-t-4 border-t-red-600 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Panel Pengaturan Pertandingan</CardTitle>
                <p className="text-gray-500">
                  Kontrol pertandingan turnamen dan pengaturan waktu
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pilih Pertandingan</label>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Select 
                        value={selectedMatch} 
                        onValueChange={setSelectedMatch}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih pertandingan" />
                        </SelectTrigger>
                        <SelectContent>
                          {matches.filter(m => !m.completed).map((match) => (
                            <SelectItem key={match.id} value={match.id}>
                              Pertandingan #{match.matchNumber} ({match.category.toUpperCase()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" onClick={createDemoMatch} className="md:w-auto w-full">
                        Buat Pertandingan Demo
                      </Button>
                    </div>
                  </div>
                  
                  {currentMatchObj && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Pertandingan #{currentMatchObj.matchNumber} ({currentMatchObj.category.toUpperCase()})</h3>
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
                  
                  {currentMatchObj && currentMatchObj.category === 'bout' && (
                    <div className="text-center py-6 px-4 bg-gray-900 rounded-xl">
                      <div className="mb-4">
                        {roundBreak ? (
                          <Badge variant="outline" className="text-amber-400 border-amber-400 text-sm px-3 py-1">
                            WAKTU ISTIRAHAT
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-400 border-green-400 text-sm px-3 py-1">
                            RONDE {currentRound} dari 3
                          </Badge>
                        )}
                      </div>
                      <div className="text-6xl font-bold font-mono text-white">
                        {roundBreak
                          ? `${Math.floor(breakTime / 60)}:${(breakTime % 60).toString().padStart(2, '0')}`
                          : `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`}
                      </div>
                    </div>
                  )}
                  
                  {currentMatchObj && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {currentMatchObj.category === 'bout' && (
                        <>
                          {timerActive ? (
                            <Button onClick={pauseTimer} variant="outline" className="border-amber-500 text-amber-500">
                              Jeda
                            </Button>
                          ) : (
                            <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                              Mulai
                            </Button>
                          )}
                          <Button onClick={resetTimer} variant="outline">
                            Reset
                          </Button>
                          <Button onClick={nextRound} variant="outline">
                            Ronde Berikutnya
                          </Button>
                        </>
                      )}
                      <Button onClick={completeMatch} variant="destructive">
                        Akhiri Pertandingan
                      </Button>
                    </div>
                  )}
                  
                  {currentMatchObj && matchScores.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Skor Pertandingan</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Hakim</TableHead>
                            <TableHead>Ronde</TableHead>
                            <TableHead>Sudut Merah</TableHead>
                            <TableHead>Sudut Biru</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {matchScores.map((score) => (
                            <TableRow key={score.id}>
                              <TableCell>{score.judges.full_name}</TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {currentMatchObj.category === 'bout' ? `Ronde ${score.round_number}` : 'Seni'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold">{score.participant1_score.toFixed(2)}</div>
                                {score.category === 'bout' && (
                                  <div className="text-xs text-gray-500">
                                    P: {score.participant1_punches || 0} | K: {score.participant1_kicks || 0} | 
                                    J: {score.participant1_throws || 0} | L: {score.participant1_locks || 0} | 
                                    F: {score.participant1_fouls || 0}
                                  </div>
                                )}
                                {score.category === 'arts' && (
                                  <div className="text-xs text-gray-500">
                                    T: {score.participant1_technique || 0} | C: {score.participant1_compactness || 0} | 
                                    E: {score.participant1_expression || 0} | W: {score.participant1_timing || 0}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="font-semibold">{score.participant2_score.toFixed(2)}</div>
                                {score.category === 'bout' && (
                                  <div className="text-xs text-gray-500">
                                    P: {score.participant2_punches || 0} | K: {score.participant2_kicks || 0} | 
                                    J: {score.participant2_throws || 0} | L: {score.participant2_locks || 0} | 
                                    F: {score.participant2_fouls || 0}
                                  </div>
                                )}
                                {score.category === 'arts' && (
                                  <div className="text-xs text-gray-500">
                                    T: {score.participant2_technique || 0} | C: {score.participant2_compactness || 0} | 
                                    E: {score.participant2_expression || 0} | W: {score.participant2_timing || 0}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tournament-management">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Turnamen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Daftar Peserta</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Jenis Kelamin</TableHead>
                          <TableHead>Kategori</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map(participant => (
                          <TableRow key={participant.id}>
                            <TableCell>{participant.fullName}</TableCell>
                            <TableCell>{participant.gender}</TableCell>
                            <TableCell>{participant.weightCategory}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts">
            <Card>
              <CardHeader>
                <CardTitle>Statistik Turnamen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4">Peserta Berdasarkan Jenis Kelamin</h3>
                    <ChartContainer
                      config={{
                        value: { label: "Jumlah", color: "hsl(var(--chart-1))" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={participantsByGender}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                          >
                            {participantsByGender.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Status Pertandingan</h3>
                    <ChartContainer
                      config={{
                        value: { label: "Jumlah", color: "hsl(var(--chart-2))" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={matchesByStatus}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="value" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Peserta Berdasarkan Kategori Berat</h3>
                    <ChartContainer
                      config={{
                        value: { label: "Jumlah", color: "hsl(var(--chart-3))" },
                      }}
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={participantsByCategory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="value" fill="#FFBB28" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;