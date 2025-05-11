
import React, { createContext, useState, useContext, ReactNode } from "react";

// Types
export type ParticipantCategory = {
  gender: "Male" | "Female";
  age: string;
  weight: string;
};

export type Participant = {
  id: string;
  fullName: string;
  gender: "Male" | "Female";
  ageCategory: string;
  weightCategory: string;
  organization: string;
  branch: string;
  subBranch: string;
  region: string;
};

export type Round = {
  id: string;
  number: number;
  scores: {
    [judgeId: string]: number;
  };
};

export type Match = {
  id: string;
  participant1Id: string | null;
  participant2Id: string | null;
  rounds: Round[];
  winnerId: string | null;
  matchNumber: number;
  roundNumber: number; // tournament round (e.g., quarter-finals, semi-finals)
  completed: boolean;
};

export type JudgeScore = {
  judgeId: string;
  matchId: string;
  roundNumber: number;
  participant1Score: number;
  participant2Score: number;
};

type TournamentContextType = {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  matches: Match[];
  updateMatch: (match: Match) => void;
  currentMatchId: string | null;
  setCurrentMatchId: (id: string | null) => void;
  organizations: { name: string; branches: { name: string; subBranches: string[] }[] }[];
  addOrganization: (org: { name: string; branches: { name: string; subBranches: string[] }[] }) => void;
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<
    { name: string; branches: { name: string; subBranches: string[] }[] }[]
  >([
    {
      name: "Pencak Silat Federation",
      branches: [
        {
          name: "Northern Branch",
          subBranches: ["City A Division", "City B Division"]
        },
        {
          name: "Southern Branch",
          subBranches: ["City C Division", "City D Division"]
        }
      ]
    },
    {
      name: "National Silat Association",
      branches: [
        {
          name: "Eastern Branch",
          subBranches: ["District 1", "District 2"]
        },
        {
          name: "Western Branch",
          subBranches: ["District 3", "District 4"]
        }
      ]
    }
  ]);

  const addParticipant = (participant: Participant) => {
    setParticipants([...participants, participant]);
  };

  const updateMatch = (updatedMatch: Match) => {
    setMatches(matches.map(match => match.id === updatedMatch.id ? updatedMatch : match));
  };

  const addOrganization = (org: { name: string; branches: { name: string; subBranches: string[] }[] }) => {
    setOrganizations([...organizations, org]);
  };

  return (
    <TournamentContext.Provider 
      value={{ 
        participants, 
        addParticipant, 
        matches, 
        updateMatch, 
        currentMatchId, 
        setCurrentMatchId, 
        organizations,
        addOrganization
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
