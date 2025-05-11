
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
    full_name: "Dewi Putri",
    gender: "Perempuan",
    date_of_birth: "2001-11-29",
    weight_category: "55-60kg",
    age_category: "Remaja",
    organization: "Perguruan Silat Nusantara",
    branch: "Surabaya",
    sub_branch: "Rungkut",
    region: "Jawa Timur"
  },
  {
    id: uuidv4(),
    full_name: "Eko Prasetyo",
    gender: "Laki-laki",
    date_of_birth: "1997-04-15",
    weight_category: "70-75kg",
    age_category: "Dewasa",
    organization: "Perguruan Silat Satria",
    branch: "Yogyakarta",
    sub_branch: "Malioboro",
    region: "DIY Yogyakarta"
  },
  {
    id: uuidv4(),
    full_name: "Fitri Handayani",
    gender: "Perempuan",
    date_of_birth: "1999-12-03",
    weight_category: "55-60kg",
    age_category: "Dewasa",
    organization: "Persatuan Pencak Silat Indonesia",
    branch: "Semarang",
    sub_branch: "Simpang Lima",
    region: "Jawa Tengah"
  },
  {
    id: uuidv4(),
    full_name: "Galih Prakoso",
    gender: "Laki-laki",
    date_of_birth: "2002-06-22",
    weight_category: "60-65kg",
    age_category: "Remaja",
    organization: "Pencak Silat Merpati Putih",
    branch: "Surakarta",
    sub_branch: "Pasar Kliwon",
    region: "Jawa Tengah"
  },
  {
    id: uuidv4(),
    full_name: "Hana Permata",
    gender: "Perempuan",
    date_of_birth: "2001-01-17",
    weight_category: "50-55kg",
    age_category: "Remaja",
    organization: "Perguruan Silat Satria",
    branch: "Malang",
    sub_branch: "Klojen",
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
    if (participantsData && participantsData.length >= 8) {
      // Male matches - Quarterfinals
      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[0].id,
        participant2_id: participantsData[1].id,
        match_number: 1,
        round_number: 1,
        completed: false
      });

      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[4].id,
        participant2_id: participantsData[6].id,
        match_number: 2,
        round_number: 1,
        completed: false
      });

      // Female matches - Quarterfinals
      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[2].id,
        participant2_id: participantsData[3].id,
        match_number: 3,
        round_number: 1,
        completed: false
      });

      matches.push({
        id: uuidv4(),
        participant1_id: participantsData[5].id,
        participant2_id: participantsData[7].id,
        match_number: 4,
        round_number: 1,
        completed: false
      });

      // Semi-final matches
      matches.push({
        id: uuidv4(),
        participant1_id: null, // Will be filled with winners
        participant2_id: null, // Will be filled with winners
        match_number: 5,
        round_number: 2,
        completed: false
      });

      matches.push({
        id: uuidv4(),
        participant1_id: null, // Will be filled with winners
        participant2_id: null, // Will be filled with winners
        match_number: 6,
        round_number: 2,
        completed: false
      });

      // Final match
      matches.push({
        id: uuidv4(),
        participant1_id: null, // Will be filled with winners
        participant2_id: null, // Will be filled with winners
        match_number: 7,
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

      // Create sample scores for the first 4 matches
      const sampleScores = [];
      if (judgesData && judgesData.length >= 3 && matchesData && matchesData.length >= 4) {
        // Add scores for match 1, round 1 from all 3 judges
        for (let j = 0; j < 3; j++) {
          sampleScores.push({
            id: uuidv4(),
            match_id: matchesData[0].id,
            judge_id: judgesData[j].id,
            round_number: 1,
            participant1_score: 7 + Math.random() * 2, // Between 7-9
            participant2_score: 6 + Math.random() * 3  // Between 6-9
          });
        }

        // Add scores for match 1, round 2 from all 3 judges
        for (let j = 0; j < 3; j++) {
          sampleScores.push({
            id: uuidv4(),
            match_id: matchesData[0].id,
            judge_id: judgesData[j].id,
            round_number: 2,
            participant1_score: 7 + Math.random() * 2,
            participant2_score: 6 + Math.random() * 3
          });
        }

        // Add scores for match 2, round 1 from all 3 judges
        for (let j = 0; j < 3; j++) {
          sampleScores.push({
            id: uuidv4(),
            match_id: matchesData[1].id,
            judge_id: judgesData[j].id,
            round_number: 1,
            participant1_score: 6 + Math.random() * 3,
            participant2_score: 7 + Math.random() * 2
          });
        }

        // Insert scores
        const { error: scoresError } = await supabase
          .from('round_scores')
          .upsert(sampleScores);

        if (scoresError) {
          throw scoresError;
        }
      }

      return {
        success: true,
        message: "Data sampel berhasil dimasukkan",
        data: {
          participants: participantsData,
          judges: judgesData,
          matches: matchesData,
          scores: sampleScores.length
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
