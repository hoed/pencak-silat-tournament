
import React, { useState, useEffect } from "react";
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
  const { participants, matches, updateMatch, currentMatchId } = useTournament();
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

  const submitScore = () => {
    if (!currentMatch) {
      toast.error("No active match selected");
      return;
    }
    
    if (!participant1Score || !participant2Score) {
      toast.error("Please enter scores for both participants");
      return;
    }
    
    const p1Score = parseFloat(participant1Score);
    const p2Score = parseFloat(participant2Score);
    
    if (isNaN(p1Score) || isNaN(p2Score) || p1Score < 0 || p1Score > 10 || p2Score < 0 || p2Score > 10) {
      toast.error("Scores must be between 0 and 10");
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
    toast.success(`Scores submitted for Round ${currentRound}`);
    
    // Clear score inputs
    setParticipant1Score("");
    setParticipant2Score("");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-t-4 border-t-blue-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Judge Scoring Panel</CardTitle>
            <p className="text-gray-500">
              Submit your scores for the current match and round
            </p>
          </CardHeader>
          
          <CardContent>
            {!currentMatchId ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">No Active Match</h3>
                <p className="text-gray-500 mb-4">
                  Please wait for the tournament administrator to start a match
                </p>
              </div>
            ) : !currentMatch ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Match Not Found</h3>
                <p className="text-gray-500">
                  The selected match cannot be found
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Match Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Match</span>
                      <h3 className="font-bold">{`Match #${currentMatch.matchNumber}`}</h3>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Round {currentRound} of 3
                    </Badge>
                  </div>
                </div>
                
                {/* Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">RED CORNER</span>
                    <h3 className="font-bold text-lg">{participant1?.fullName || "TBD"}</h3>
                    {participant1 && (
                      <div className="text-sm text-gray-600">
                        <p>{participant1.organization}</p>
                        <p>{participant1.branch}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <span className="text-xs text-gray-500 block mb-1">BLUE CORNER</span>
                    <h3 className="font-bold text-lg">{participant2?.fullName || "TBD"}</h3>
                    {participant2 && (
                      <div className="text-sm text-gray-600">
                        <p>{participant2.organization}</p>
                        <p>{participant2.branch}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Judge Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Judge ID</label>
                  <Select value={judgeId} onValueChange={setJudgeId}>
                    <SelectTrigger className="w-full md:w-1/3">
                      <SelectValue placeholder="Select your judge ID" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Judge 1</SelectItem>
                      <SelectItem value="2">Judge 2</SelectItem>
                      <SelectItem value="3">Judge 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Round Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Round</label>
                  <Select value={currentRound.toString()} onValueChange={(val) => setCurrentRound(parseInt(val))}>
                    <SelectTrigger className="w-full md:w-1/3">
                      <SelectValue placeholder="Select round" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Round 1</SelectItem>
                      <SelectItem value="2">Round 2</SelectItem>
                      <SelectItem value="3">Round 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Scoring */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Red Corner Score (0-10)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="Enter score"
                      value={participant1Score}
                      onChange={(e) => setParticipant1Score(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Blue Corner Score (0-10)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      placeholder="Enter score"
                      value={participant2Score}
                      onChange={(e) => setParticipant2Score(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={submitScore} className="w-full">
                  Submit Scores
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Previous Scores (if any) */}
        {currentMatch && currentMatch.rounds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previous Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMatch.rounds.map((round) => {
                  const judge1P1Score = round.scores["1-participant1"];
                  const judge1P2Score = round.scores["1-participant2"];
                  const judge2P1Score = round.scores["2-participant1"];
                  const judge2P2Score = round.scores["2-participant2"];
                  const judge3P1Score = round.scores["3-participant1"];
                  const judge3P2Score = round.scores["3-participant2"];
                  
                  return (
                    <div key={round.id} className="border p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Round {round.number}</h4>
                      
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div className="font-medium">Judge</div>
                        <div className="font-medium">Judge ID</div>
                        <div className="font-medium">Red Corner</div>
                        <div className="font-medium">Blue Corner</div>
                        
                        {judge1P1Score !== undefined && (
                          <>
                            <div>Judge 1</div>
                            <div>1</div>
                            <div>{judge1P1Score}</div>
                            <div>{judge1P2Score}</div>
                          </>
                        )}
                        
                        {judge2P1Score !== undefined && (
                          <>
                            <div>Judge 2</div>
                            <div>2</div>
                            <div>{judge2P1Score}</div>
                            <div>{judge2P2Score}</div>
                          </>
                        )}
                        
                        {judge3P1Score !== undefined && (
                          <>
                            <div>Judge 3</div>
                            <div>3</div>
                            <div>{judge3P1Score}</div>
                            <div>{judge3P2Score}</div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default JudgePanel;
