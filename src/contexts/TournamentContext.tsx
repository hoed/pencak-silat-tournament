
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Types
export type UserRole = 'admin' | 'judge' | 'participant';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
};

export type ParticipantCategory = {
  gender: "Laki-laki" | "Perempuan";
  age: string;
  weight: string;
};

export type Participant = {
  id: string;
  fullName: string;
  gender: "Laki-laki" | "Perempuan";
  dateOfBirth: string;
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

export type Judge = {
  id: string;
  fullName: string;
  judgeNumber: number;
  username: string;
};

type TournamentContextType = {
  currentUser: User | null;
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  matches: Match[];
  updateMatch: (match: Match) => void;
  currentMatchId: string | null;
  setCurrentMatchId: (id: string | null) => void;
  organizations: { name: string; branches: { name: string; subBranches: string[] }[] }[];
  addOrganization: (org: { name: string; branches: { name: string; subBranches: string[] }[] }) => void;
  judges: Judge[];
  currentJudge: Judge | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
  loginJudge: (username: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  logoutJudge: () => void;
};

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [currentJudge, setCurrentJudge] = useState<Judge | null>(null);
  const [organizations, setOrganizations] = useState<
    { name: string; branches: { name: string; subBranches: string[] }[] }[]
  >([
    {
      name: "Federasi Pencak Silat",
      branches: [
        {
          name: "Cabang Utara",
          subBranches: ["Divisi Kota A", "Divisi Kota B"]
        },
        {
          name: "Cabang Selatan",
          subBranches: ["Divisi Kota C", "Divisi Kota D"]
        }
      ]
    },
    {
      name: "Asosiasi Silat Nasional",
      branches: [
        {
          name: "Cabang Timur",
          subBranches: ["Distrik 1", "Distrik 2"]
        },
        {
          name: "Cabang Barat",
          subBranches: ["Distrik 3", "Distrik 4"]
        }
      ]
    }
  ]);

  useEffect(() => {
    // Check for current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        
        // Determine user role based on email
        let role: UserRole = 'participant';
        if (user.email === 'admin@admin.com') {
          role = 'admin';
        } else if (user.email === 'juri@juri.com') {
          role = 'judge';
        } else if (user.email === 'peserta@peserta.com') {
          role = 'participant';
        }

        setCurrentUser({
          id: user.id,
          email: user.email!,
          role
        });
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          // Determine user role based on email
          let role: UserRole = 'participant';
          if (session.user.email === 'admin@admin.com') {
            role = 'admin';
          } else if (session.user.email === 'juri@juri.com') {
            role = 'judge';
          } else if (session.user.email === 'peserta@peserta.com') {
            role = 'participant';
          }

          setCurrentUser({
            id: session.user.id,
            email: session.user.email!,
            role
          });
        } else {
          setCurrentUser(null);
        }
      }
    );

    checkSession();
    
    // Fetch participants from Supabase
    const fetchParticipants = async () => {
      const { data, error } = await supabase.from('participants').select('*');
      if (error) {
        console.error('Error fetching participants:', error);
        return;
      }
      
      if (data) {
        const formattedData: Participant[] = data.map(p => ({
          id: p.id,
          fullName: p.full_name,
          gender: p.gender as "Laki-laki" | "Perempuan", // Fixed type casting here
          dateOfBirth: p.date_of_birth,
          ageCategory: p.age_category,
          weightCategory: p.weight_category,
          organization: p.organization,
          branch: p.branch,
          subBranch: p.sub_branch,
          region: p.region
        }));
        setParticipants(formattedData);
      }
    };

    // Fetch judges from Supabase
    const fetchJudges = async () => {
      const { data, error } = await supabase.from('judges').select('id, full_name, judge_number, username');
      if (error) {
        console.error('Error fetching judges:', error);
        return;
      }
      
      if (data) {
        const formattedData: Judge[] = data.map(j => ({
          id: j.id,
          fullName: j.full_name,
          judgeNumber: j.judge_number,
          username: j.username
        }));
        setJudges(formattedData);
      }
    };

    // Fetch matches
    const fetchMatches = async () => {
      const { data, error } = await supabase.from('matches').select('*');
      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }
      
      if (data) {
        const formattedMatches: Match[] = data.map(m => ({
          id: m.id,
          participant1Id: m.participant1_id,
          participant2Id: m.participant2_id,
          rounds: [],
          winnerId: m.winner_id,
          matchNumber: m.match_number,
          roundNumber: m.round_number,
          completed: m.completed || false,
        }));
        setMatches(formattedMatches);
      }
    };

    fetchParticipants();
    fetchJudges();
    fetchMatches();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Gagal login: ' + error.message);
        return false;
      }

      if (data.user) {
        // Determine user role based on email
        let role: UserRole = 'participant';
        if (email === 'admin@admin.com') {
          role = 'admin';
        } else if (email === 'juri@juri.com') {
          role = 'judge';
        } else if (email === 'peserta@peserta.com') {
          role = 'participant';
        }

        setCurrentUser({
          id: data.user.id,
          email: data.user.email!,
          role
        });
        
        toast.success('Login berhasil');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('Terjadi kesalahan saat login');
      return false;
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setCurrentJudge(null);
      toast.success('Berhasil keluar');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Gagal logout');
    }
  };

  const addParticipant = async (participant: Participant) => {
    // Add to local state
    setParticipants(prev => [...prev, participant]);
    
    // Add to Supabase
    const { error } = await supabase.from('participants').insert({
      id: participant.id,
      full_name: participant.fullName,
      gender: participant.gender,
      date_of_birth: participant.dateOfBirth,
      age_category: participant.ageCategory,
      weight_category: participant.weightCategory,
      organization: participant.organization,
      branch: participant.branch,
      sub_branch: participant.subBranch,
      region: participant.region
    });
    
    if (error) {
      console.error('Error adding participant to database:', error);
    }
  };

  const updateMatch = (updatedMatch: Match) => {
    setMatches(matches.map(match => match.id === updatedMatch.id ? updatedMatch : match));
  };

  const addOrganization = (org: { name: string; branches: { name: string; subBranches: string[] }[] }) => {
    setOrganizations([...organizations, org]);
  };

  const loginJudge = async (username: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('judges')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
    
    if (error || !data) {
      console.error('Login error:', error);
      return false;
    }
    
    setCurrentJudge({
      id: data.id,
      fullName: data.full_name,
      judgeNumber: data.judge_number,
      username: data.username
    });
    
    // Store judge info in local storage for persistence
    localStorage.setItem('currentJudge', JSON.stringify({
      id: data.id,
      fullName: data.full_name,
      judgeNumber: data.judge_number,
      username: data.username
    }));
    
    return true;
  };
  
  const logoutJudge = () => {
    setCurrentJudge(null);
    localStorage.removeItem('currentJudge');
  };
  
  // Check if judge is already logged in from local storage
  useEffect(() => {
    const storedJudge = localStorage.getItem('currentJudge');
    if (storedJudge) {
      setCurrentJudge(JSON.parse(storedJudge));
    }
  }, []);

  return (
    <TournamentContext.Provider 
      value={{ 
        currentUser,
        participants, 
        addParticipant, 
        matches, 
        updateMatch, 
        currentMatchId, 
        setCurrentMatchId, 
        organizations,
        addOrganization,
        judges,
        currentJudge,
        loginUser,
        loginJudge,
        logoutUser,
        logoutJudge
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
