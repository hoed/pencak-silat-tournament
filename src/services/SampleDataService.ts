
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Sample participants data
const sampleParticipants = [
  {
    id: uuidv4(),
    full_name: "Ahmad Sutoyo",
    gender: "Laki-laki",
    date_of_birth: "1998-05-12",
    weight_category: "60-65kg",
    age_category: "Dewasa",
    organization: "Perguruan Silat Nusantara",
    branch: "Jakarta Selatan",
    sub_branch: "Kebayoran Baru",
    region: "DKI Jakarta"
  },
  {
    id: uuidv4(),
    full_name: "Budi Santoso",
    gender: "Laki-laki",
    date_of_birth: "1999-08-24",
    weight_category: "65-70kg",
    age_category: "Dewasa",
    organization: "Persatuan Pencak Silat Indonesia",
    branch: "Jakarta Timur",
    sub_branch: "Cakung",
    region: "DKI Jakarta"
  },
  {
    id: uuidv4(),
    full_name: "Citra Dewi",
    gender: "Perempuan",
    date_of_birth: "2000-03-18",
    weight_category: "50-55kg",
    age_category: "Remaja",
    organization: "Pencak Silat Merpati Putih",
    branch: "Bandung",
    sub_branch: "Ujung Berung",
    region: "Jawa Barat"
  },
  {
    id: uuidv4(),
    full_name: "Dwi Putri",
    gender: "Perempuan",
    date_of_birth: "2001-11-29",
    weight_category: "55-60kg",
    age_category: "Remaja",
    organization: "Perguruan Silat Nusantara",
    branch: "Surabaya",
    sub_branch: "Rungkut",
    region: "Jawa Timur"
  }
];

// Sample judges data
const sampleJudges = [
  {
    id: uuidv4(),
    username: "hakim1",
    password: "password123",
    full_name: "Joko Widodo",
    judge_number: 1
  },
  {
    id: uuidv4(),
    username: "hakim2",
    password: "password123",
    full_name: "Susilo Bambang",
    judge_number: 2
  },
  {
    id: uuidv4(),
    username: "hakim3",
    password: "password123",
    full_name: "Megawati",
    judge_number: 3
  }
];

export const insertSampleData = async () => {
  try {
    // Insert participants
    const { data: participantsData, error: participantsError } = await supabase
      .from('participants')
      .upsert(sampleParticipants)
      .select();

    if (participantsError) {
      throw participantsError;
    }

    // Insert judges
    const { data: judgesData, error: judgesError } = await supabase
      .from('judges')
      .upsert(sampleJudges)
      .select();

    if (judgesError) {
      throw judgesError;
    }

    // Create matches between participants
    const matches = [];
    if (participantsData && participantsData.length >= 4) {
      // Create match 1: participant 1 vs participant 2
      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[0].id,
        participant2_id: participantsData[1].id,
        match_number: 1,
        round_number: 1,
        completed: false
      });

      // Create match 2: participant 3 vs participant 4
      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[2].id,
        participant2_id: participantsData[3].id,
        match_number: 2,
        round_number: 1,
        completed: false
      });

      // Create semi-final match
      matches.push({
        id: uuidv4(),
        participant1_id: null, // Will be filled with winners
        participant2_id: null, // Will be filled with winners
        match_number: 3,
        round_number: 2,
        completed: false
      });

      // Create final match
      matches.push({
        id: uuidv4(),
        participant1_id: null, // Will be filled with winners
        participant2_id: null, // Will be filled with winners
        match_number: 4,
        round_number: 3,
        completed: false
      });

      // Insert matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .upsert(matches)
        .select();

      if (matchesError) {
        throw matchesError;
      }

      return {
        success: true,
        message: "Data sampel berhasil dimasukkan",
        data: {
          participants: participantsData,
          judges: judgesData,
          matches: matchesData
        }
      };
    }

    return {
      success: true,
      message: "Data sampel berhasil dimasukkan",
      data: {
        participants: participantsData,
        judges: judgesData
      }
    };
  } catch (error) {
    console.error("Error inserting sample data:", error);
    return {
      success: false,
      message: "Gagal memasukkan data sampel",
      error
    };
  }
};

export const clearAllData = async () => {
  try {
    // Clear all data from tables
    await supabase.from('round_scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('judges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('participants').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    return {
      success: true,
      message: "Semua data berhasil dihapus"
    };
  } catch (error) {
    console.error("Error clearing data:", error);
    return {
      success: false,
      message: "Gagal menghapus data",
      error
    };
  }
};
