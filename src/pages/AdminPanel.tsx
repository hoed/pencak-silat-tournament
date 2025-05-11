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

const AdminPanel = () => {
  const { participants, matches, updateMatch, currentMatchId, setCurrentMatchId } = useTournament();
  
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [timerActive, setTimerActive] = useState(false);
  const [time, setTime] = useState(60); // 60 seconds per round
  const [currentRound, setCurrentRound] = useState(1);
  const [roundBreak, setRoundBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30); // 30 seconds break between rounds
  const [showCharts, setShowCharts] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load selected match if currentMatchId is set
    if (currentMatchId && !selectedMatch) {
      setSelectedMatch(currentMatchId);
    }
    
    // Load matches from Supabase
    const fetchMatches = async () => {
      const { data, error } = await supabase.from('matches').select('*');
      if (error) {
        console.error("Error fetching matches:", error);
        return;
      }
      
      if (data) {
        // Convert Supabase data format to our app's format
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
          });
        });
      }
    };
    
    fetchMatches();
  }, [currentMatchId, selectedMatch, updateMatch]);

  useEffect(() => {
    if (timerActive && !roundBreak) {
      if (time > 0) {
        timerRef.current = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else {
        // Time's up for this round
        setTimerActive(false);
        if (currentRound < 3) {
          toast.info(`Ronde ${currentRound} selesai! Memulai istirahat`);
          setRoundBreak(true);
          setBreakTime(30);
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
        // Break time is over, start next round
        setRoundBreak(false);
        setCurrentRound(currentRound + 1);
        setTime(60);
        setTimerActive(true);
        toast.info(`Ronde ${currentRound + 1} dimulai!`);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerActive, time, roundBreak, breakTime, currentRound]);

  const startTimer = () => {
    if (!selectedMatch) {
      toast.error("Silakan pilih pertandingan terlebih dahulu");
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
    setTime(60);
    setRoundBreak(false);
    setBreakTime(30);
  };

  const nextRound = () => {
    if (currentRound < 3) {
      setTimerActive(false);
      setRoundBreak(true);
      setBreakTime(30);
    } else {
      toast.info("Ini adalah ronde terakhir!");
      completeMatch();
    }
  };

  const completeMatch = async () => {
    if (!selectedMatch) return;
    
    const match = matches.find(m => m.id === selectedMatch);
    if (!match) return;

    // Calculate average scores
    let p1TotalScore = 0;
    let p2TotalScore = 0;
    let totalJudgeScores = 0;
    
    match.rounds.forEach(round => {
      // Get all judge scores for this round
      const keys = Object.keys(round.scores);
      keys.forEach(key => {
        if (key.includes('participant1')) {
          p1TotalScore += round.scores[key];
          totalJudgeScores++;
        } else if (key.includes('participant2')) {
          p2TotalScore += round.scores[key];
        }
      });
    });

    const p1AvgScore = totalJudgeScores > 0 ? p1TotalScore / (totalJudgeScores / 2) : 0;
    const p2AvgScore = totalJudgeScores > 0 ? p2TotalScore / (totalJudgeScores / 2) : 0;
    
    // Determine winner
    let winnerId = null;
    if (p1AvgScore > p2AvgScore) {
      winnerId = match.participant1Id;
    } else if (p2AvgScore > p1AvgScore) {
      winnerId = match.participant2Id;
    } else {
      // It's a draw - in real tournament you'd need tie-breaking rules
      toast.info("Pertandingan berakhir seri!");
    }
    
    // Update match with winner and completed status
    const updatedMatch = {
      ...match,
      winnerId,
      completed: true
    };
    
    updateMatch(updatedMatch);
    
    // Update in Supabase
    const { error } = await supabase
      .from('matches')
      .update({
        winner_id: winnerId,
        completed: true
      })
      .eq('id', match.id);
      
    if (error) {
      console.error('Error updating match in database:', error);
      toast.error("Gagal menyimpan hasil pertandingan ke database");
    }
    
    setTimerActive(false);
    setSelectedMatch("");
    setCurrentMatchId(null);
    setCurrentRound(1);
    setTime(60);
    
    toast.success("Pertandingan selesai dan pemenang ditentukan!");
  };

  const currentMatchObj = matches.find(match => match.id === selectedMatch);
  
  const participant1 = currentMatchObj?.participant1Id
    ? participants.find(p => p.id === currentMatchObj.participant1Id)
    : null;
  
  const participant2 = currentMatchObj?.participant2Id
    ? participants.find(p => p.id === currentMatchObj.participant2Id)
    : null;

  // Create a demo match if needed
  const createDemoMatch = async () => {
    if (participants.length < 2) {
      toast.error("Butuh minimal 2 peserta untuk membuat pertandingan demo");
      return;
    }

    const participant1 = participants[0];
    const participant2 = participants[1];
    
    const matchNumber = matches.length + 1;
    
    // Create in Supabase first
    const { data, error } = await supabase
      .from('matches')
      .insert({
        participant1_id: participant1.id,
        participant2_id: participant2.id,
        match_number: matchNumber,
        round_number: 1,
        completed: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating match in database:', error);
      toast.error("Gagal membuat pertandingan demo di database");
      return;
    }
    
    // Add to local state
    const newMatch = {
      id: data.id,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      rounds: [],
      winnerId: null,
      matchNumber: matchNumber,
      roundNumber: 1, // first round of tournament
      completed: false
    };
    
    updateMatch(newMatch);
    setSelectedMatch(newMatch.id);
    toast.success("Pertandingan demo dibuat!");
  };

  // Charts data
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
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
                  {/* Match Selection */}
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
                              Pertandingan #{match.matchNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" onClick={createDemoMatch} className="md:w-auto w-full">
                        Buat Pertandingan Demo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Match Info */}
                  {currentMatchObj && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Pertandingan #{currentMatchObj.matchNumber}</h3>
                      
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
                  
                  {/* Timer Display */}
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
                        ? `00:${breakTime < 10 ? `0${breakTime}` : breakTime}`
                        : `00:${time < 10 ? `0${time}` : time}`}
                    </div>
                  </div>
                  
                  {/* Timer Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                    
                    <Button onClick={completeMatch} variant="destructive">
                      Akhiri Pertandingan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Match Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status Pertandingan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {matches.length === 0 ? (
                    <p className="text-gray-500">Belum ada pertandingan yang dijadwalkan</p>
                  ) : (
                    matches.map((match) => {
                      const p1 = participants.find(p => p.id === match.participant1Id);
                      const p2 = participants.find(p => p.id === match.participant2Id);
                      
                      return (
                        <div key={match.id} className="flex justify-between items-center border p-3 rounded-md">
                          <div>
                            <span className="font-medium">Pertandingan #{match.matchNumber}</span>
                            <div className="text-sm text-gray-600">
                              {p1?.fullName || "Belum ditentukan"} vs {p2?.fullName || "Belum ditentukan"}
                            </div>
                          </div>
                          
                          <div>
                            {match.completed ? (
                              <Badge className="bg-green-600">Selesai</Badge>
                            ) : match.id === currentMatchId ? (
                              <Badge className="bg-blue-600">Berlangsung</Badge>
                            ) : (
                              <Badge variant="outline">Tertunda</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tournament-management">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Turnamen</CardTitle>
                <p className="text-gray-500">
                  Kelola jadwal dan struktur turnamen
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-3">
                    Fitur lengkap manajemen turnamen
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-xl mx-auto">
                    Data peserta dan pertandingan sudah otomatis tersimpan ke database Supabase.
                    Anda dapat mengelola seluruh turnamen melalui panel ini.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Buat Bagan Pertandingan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Peserta dan Pertandingan</CardTitle>
                  <p className="text-gray-500">
                    Visualisasi data turnamen
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gender Distribution Chart */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4 text-center">Distribusi Jenis Kelamin Peserta</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={participantsByGender}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {participantsByGender.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} peserta`, 'Jumlah']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Match Status Chart */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4 text-center">Status Pertandingan</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={matchesByStatus}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {matchesByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} pertandingan`, 'Jumlah']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Weight Categories Chart */}
                    <div className="border rounded-lg p-4 md:col-span-2">
                      <h3 className="font-medium mb-4 text-center">Peserta per Kategori Berat</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={participantsByCategory}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} peserta`, 'Jumlah']} />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Jumlah Peserta" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPanel;
