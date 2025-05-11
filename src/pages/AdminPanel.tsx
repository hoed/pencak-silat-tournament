
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

const AdminPanel = () => {
  const { participants, matches, updateMatch, currentMatchId, setCurrentMatchId } = useTournament();
  
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [timerActive, setTimerActive] = useState(false);
  const [time, setTime] = useState(60); // 60 seconds per round
  const [currentRound, setCurrentRound] = useState(1);
  const [roundBreak, setRoundBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30); // 30 seconds break between rounds
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load selected match if currentMatchId is set
    if (currentMatchId && !selectedMatch) {
      setSelectedMatch(currentMatchId);
    }
  }, [currentMatchId, selectedMatch]);

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
          toast.info(`Round ${currentRound} finished! Starting break`);
          setRoundBreak(true);
          setBreakTime(30);
        } else {
          toast.info("Match finished!");
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
        toast.info(`Round ${currentRound + 1} started!`);
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
      toast.error("Please select a match first");
      return;
    }
    
    setTimerActive(true);
    setCurrentMatchId(selectedMatch);
    toast.success(`Round ${currentRound} started!`);
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
      toast.info("This is the final round!");
      completeMatch();
    }
  };

  const completeMatch = () => {
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
      toast.info("Match ended in a draw!");
    }
    
    // Update match with winner and completed status
    const updatedMatch = {
      ...match,
      winnerId,
      completed: true
    };
    
    updateMatch(updatedMatch);
    setTimerActive(false);
    setSelectedMatch("");
    setCurrentMatchId(null);
    setCurrentRound(1);
    setTime(60);
    
    toast.success("Match completed and winner determined!");
  };

  const currentMatchObj = matches.find(match => match.id === selectedMatch);
  
  const participant1 = currentMatchObj?.participant1Id
    ? participants.find(p => p.id === currentMatchObj.participant1Id)
    : null;
  
  const participant2 = currentMatchObj?.participant2Id
    ? participants.find(p => p.id === currentMatchObj.participant2Id)
    : null;

  // Create a demo match if needed
  const createDemoMatch = () => {
    if (participants.length < 2) {
      toast.error("Need at least 2 participants to create a demo match");
      return;
    }

    const participant1 = participants[0];
    const participant2 = participants[1];
    
    const newMatch = {
      id: uuidv4(),
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      rounds: [],
      winnerId: null,
      matchNumber: matches.length + 1,
      roundNumber: 1, // first round of tournament
      completed: false
    };
    
    updateMatch(newMatch);
    setSelectedMatch(newMatch.id);
    toast.success("Demo match created!");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="match-control">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="match-control" className="flex-1">Match Control</TabsTrigger>
            <TabsTrigger value="tournament-management" className="flex-1">Tournament Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="match-control">
            <Card className="border-t-4 border-t-red-600 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Match Control Panel</CardTitle>
                <p className="text-gray-500">
                  Control tournament matches and timing
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Match Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Match</label>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedMatch} 
                        onValueChange={setSelectedMatch}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a match" />
                        </SelectTrigger>
                        <SelectContent>
                          {matches.filter(m => !m.completed).map((match) => (
                            <SelectItem key={match.id} value={match.id}>
                              Match #{match.matchNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" onClick={createDemoMatch}>
                        Create Demo Match
                      </Button>
                    </div>
                  </div>
                  
                  {/* Match Info */}
                  {currentMatchObj && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Match #{currentMatchObj.matchNumber}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="border p-3 rounded-lg bg-white">
                          <span className="text-xs text-gray-500 block mb-1">RED CORNER</span>
                          <h3 className="font-bold">{participant1?.fullName || "TBD"}</h3>
                        </div>
                        
                        <div className="border p-3 rounded-lg bg-white">
                          <span className="text-xs text-gray-500 block mb-1">BLUE CORNER</span>
                          <h3 className="font-bold">{participant2?.fullName || "TBD"}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Timer Display */}
                  <div className="text-center py-6 px-4 bg-gray-900 rounded-xl">
                    <div className="mb-4">
                      {roundBreak ? (
                        <Badge variant="outline" className="text-amber-400 border-amber-400 text-sm px-3 py-1">
                          BREAK TIME
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-400 border-green-400 text-sm px-3 py-1">
                          ROUND {currentRound} of 3
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
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                        Start
                      </Button>
                    )}
                    
                    <Button onClick={resetTimer} variant="outline">
                      Reset
                    </Button>
                    
                    <Button onClick={nextRound} variant="outline">
                      Next Round
                    </Button>
                    
                    <Button onClick={completeMatch} variant="destructive">
                      End Match
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Match Status */}
            <Card>
              <CardHeader>
                <CardTitle>Match Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {matches.length === 0 ? (
                    <p className="text-gray-500">No matches scheduled yet</p>
                  ) : (
                    matches.map((match) => {
                      const p1 = participants.find(p => p.id === match.participant1Id);
                      const p2 = participants.find(p => p.id === match.participant2Id);
                      
                      return (
                        <div key={match.id} className="flex justify-between items-center border p-3 rounded-md">
                          <div>
                            <span className="font-medium">Match #{match.matchNumber}</span>
                            <div className="text-sm text-gray-600">
                              {p1?.fullName || "TBD"} vs {p2?.fullName || "TBD"}
                            </div>
                          </div>
                          
                          <div>
                            {match.completed ? (
                              <Badge className="bg-green-600">Completed</Badge>
                            ) : match.id === currentMatchId ? (
                              <Badge className="bg-blue-600">In Progress</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
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
                <CardTitle>Tournament Management</CardTitle>
                <p className="text-gray-500">
                  Manage brackets and tournament structure
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-3">
                    Connect to Supabase for Full Tournament Management
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-xl mx-auto">
                    To enable full tournament management features including bracket generation, 
                    data persistence, and user authentication, please connect this project to Supabase.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Connect to Supabase
                  </Button>
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
