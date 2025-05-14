import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Define the correct type for a match
type Match = {
    id?: string;
    match_number: number;
    participant1_id?: string;
    participant2_id?: string;
    round_number: number;
    completed?: boolean;
    category: "bout" | "arts";  // Must be either "bout" or "arts"
    winner_id?: string;
    created_at?: string;
}

export const insertSampleData = async () => {
  try {
    // Check for admin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'admin@admin.com') {
      return {
        success: false,
        message: 'Admin authentication required to insert sample data',
      };
    }

    // Check if data already exists
    const { data: existingParticipants } = await supabase
      .from('participants')
      .select('id')
      .limit(1);

    if (existingParticipants && existingParticipants.length > 0) {
      return {
        success: false,
        message: 'Data sudah ada. Hapus data terlebih dahulu sebelum memasukkan data sampel baru.',
      };
    }

    // Generate valid UUIDs
    const participant1Id = uuidv4();
    const participant2Id = uuidv4();
    const participant3Id = uuidv4();
    const participant4Id = uuidv4();
    
    const judge1Id = uuidv4();
    const judge2Id = uuidv4();
    const judge3Id = uuidv4();
    
    const match1Id = uuidv4(); // Bout match
    const match2Id = uuidv4(); // Bout match
    const match3Id = uuidv4(); // Arts match

    // Sample participants data
    const participants = [
      {
        id: participant1Id,
        full_name: 'John Doe',
        gender: 'Laki-laki',
        date_of_birth: '1990-01-01',
        age_category: 'Dewasa',
        weight_category: '70-80kg',
        organization: 'Federasi Pencak Silat',
        branch: 'Cabang Utara',
        sub_branch: 'Divisi Kota A',
        region: 'DKI Jakarta',
      },
      {
        id: participant2Id,
        full_name: 'Jane Smith',
        gender: 'Perempuan',
        date_of_birth: '1992-02-02',
        age_category: 'Dewasa',
        weight_category: '60-70kg',
        organization: 'Asosiasi Silat Nasional',
        branch: 'Cabang Timur',
        sub_branch: 'Distrik 1',
        region: 'Jawa Timur',
      },
      {
        id: participant3Id,
        full_name: 'Alice Johnson',
        gender: 'Perempuan',
        date_of_birth: '1995-03-03',
        age_category: 'Remaja',
        weight_category: '50-60kg',
        organization: 'Federasi Pencak Silat',
        branch: 'Cabang Selatan',
        sub_branch: 'Divisi Kota C',
        region: 'Jawa Barat',
      },
      {
        id: participant4Id,
        full_name: 'Bob Williams',
        gender: 'Laki-laki',
        date_of_birth: '1998-04-04',
        age_category: 'Remaja',
        weight_category: '60-70kg',
        organization: 'Asosiasi Silat Nasional',
        branch: 'Cabang Barat',
        sub_branch: 'Distrik 3',
        region: 'Jawa Tengah',
      },
    ];

    // Insert participants
    const { error: participantsError } = await supabase
      .from('participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error inserting participants:', participantsError);
      throw new Error('Gagal menambahkan data peserta: ' + participantsError.message);
    }

    // Sample judges data
    const judges = [
      { id: judge1Id, full_name: 'Hakim Satu', judge_number: 1, username: 'hakim1', password: 'password1' },
      { id: judge2Id, full_name: 'Hakim Dua', judge_number: 2, username: 'hakim2', password: 'password2' },
      { id: judge3Id, full_name: 'Hakim Tiga', judge_number: 3, username: 'hakim3', password: 'password3' },
    ];

    // Insert judges
    const { error: judgesError } = await supabase
      .from('judges')
      .insert(judges);

    if (judgesError) {
      console.error('Error inserting judges:', judgesError);
      throw new Error('Gagal menambahkan data hakim: ' + judgesError.message);
    }

    // Sample matches data (including Bout and Arts categories)
    const matches: Match[] = [
      { 
        id: match1Id, 
        match_number: 1, 
        participant1_id: participant1Id, 
        participant2_id: participant2Id, 
        round_number: 1, 
        completed: false,
        category: 'bout'
      },
      { 
        id: match2Id, 
        match_number: 2, 
        participant1_id: participant3Id, 
        participant2_id: participant4Id, 
        round_number: 1, 
        completed: false,
        category: 'bout'
      },
      { 
        id: match3Id, 
        match_number: 3, 
        participant1_id: participant1Id, 
        participant2_id: participant4Id, 
        round_number: 1, 
        completed: false,
        category: 'arts'
      },
    ];

    // Insert matches
    const { error: matchesError } = await supabase
      .from('matches')
      .insert(matches);

    if (matchesError) {
      console.error('Error inserting matches:', matchesError);
      throw new Error('Gagal menambahkan data pertandingan: ' + matchesError.message);
    }

    // Create sample scores with detailed criteria
    const roundScores = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      
      // Only create scores for matches with participants
      if (match.participant1_id && match.participant2_id) {
        for (let judgeIndex = 0; judgeIndex < judges.length; judgeIndex++) {
          const judge = judges[judgeIndex];
          
          if (match.category === 'bout') {
            // Create scores for rounds 1-3 for Bout matches
            for (let round = 1; round <= 3; round++) {
              // Generate random scores for Bout criteria
              const p1_punches = Math.floor(Math.random() * 8) + 3; // 3-10
              const p1_kicks = Math.floor(Math.random() * 8) + 3;   // 3-10
              const p1_throws = Math.floor(Math.random() * 8) + 3;  // 3-10
              const p1_locks = Math.floor(Math.random() * 5);       // 0-4
              const p1_fouls = Math.floor(Math.random() * 3);       // 0-2
              
              const p2_punches = Math.floor(Math.random() * 8) + 3; // 3-10
              const p2_kicks = Math.floor(Math.random() * 8) + 3;   // 3-10
              const p2_throws = Math.floor(Math.random() * 8) + 3;  // 3-10
              const p2_locks = Math.floor(Math.random() * 5);       // 0-4
              const p2_fouls = Math.floor(Math.random() * 3);       // 0-2
              
              // Calculate totals for Bout (1x punches, 2x kicks, 3x throws, 4x locks)
              const p1_total = (p1_punches * 1) + (p1_kicks * 2) + (p1_throws * 3) + (p1_locks * 4);
              const p2_total = (p2_punches * 1) + (p2_kicks * 2) + (p2_throws * 3) + (p2_locks * 4);
              
              roundScores.push({
                id: uuidv4(),
                match_id: match.id,
                judge_id: judge.id,
                round_number: round,
                participant1_score: p1_total,
                participant2_score: p2_total,
                participant1_punches: p1_punches,
                participant1_kicks: p1_kicks,
                participant1_throws: p1_throws,
                participant1_locks: p1_locks,
                participant1_fouls: p1_fouls,
                participant2_punches: p2_punches,
                participant2_kicks: p2_kicks,
                participant2_throws: p2_throws,
                participant2_locks: p2_locks,
                participant2_fouls: p2_fouls,
                category: 'bout'
              });
            }
          } else if (match.category === 'arts') {
            // Create single score for Arts match (no rounds)
            const p1_technique = Math.floor(Math.random() * 41) + 60; // 60-100
            const p1_compactness = Math.floor(Math.random() * 41) + 60; // 60-100
            const p1_expression = Math.floor(Math.random() * 41) + 60; // 60-100
            const p1_timing = Math.floor(Math.random() * 41) + 60;     // 60-100
            
            const p2_technique = Math.floor(Math.random() * 41) + 60; // 60-100
            const p2_compactness = Math.floor(Math.random() * 41) + 60; // 60-100
            const p2_expression = Math.floor(Math.random() * 41) + 60; // 60-100
            const p2Timing = Math.floor(Math.random() * 41) + 60;      // 60-100
            
            // Calculate totals for Arts (weighted: 40% technique, 30% compactness, 20% expression, 10% timing)
            const p1_total = (p1_technique * 0.4) + (p1_compactness * 0.3) + (p1_expression * 0.2) + (p1_timing * 0.1);
            const p2_total = (p2_technique * 0.4) + (p2_compactness * 0.3) + (p2_expression * 0.2) + (p2Timing * 0.1);
            
            roundScores.push({
              id: uuidv4(),
              match_id: match.id,
              judge_id: judge.id,
              round_number: 1, // Arts uses single "round"
              participant1_score: p1_total,
              participant2_score: p2_total,
              participant1_technique: p1_technique,
              participant1_compactness: p1_compactness,
              participant1_expression: p1_expression,
              participant1_timing: p1_timing,
              participant2_technique: p2_technique,
              participant2_compactness: p2_compactness,
              participant2_expression: p2_expression,
              participant2_timing: p2Timing,
              category: 'arts'
            });
          }
        }
      }
    }
    
    if (roundScores.length > 0) {
      const { error: scoresError } = await supabase
        .from('round_scores')
        .insert(roundScores);

      if (scoresError) {
        console.error('Error inserting round scores:', scoresError);
        throw new Error('Gagal menambahkan data nilai: ' + scoresError.message);
      }
    }

    return { success: true, message: 'Data sampel berhasil ditambahkan' };
  } catch (error: any) {
    console.error('Error inserting sample data:', error);
    return { success: false, message: 'Terjadi kesalahan: ' + error.message };
  }
};

export const clearAllData = async () => {
  try {
    // Check for admin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== 'admin@admin.com') {
      return {
        success: false,
        message: 'Admin authentication required to clear data',
      };
    }

    // Delete data in reverse dependency order
    const { error: scoresError } = await supabase
      .from('round_scores')
      .delete()
      .not('id', 'is', null);

    if (scoresError) {
      console.error('Error deleting round scores:', scoresError);
      throw new Error('Gagal menghapus data nilai: ' + scoresError.message);
    }

    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .not('id', 'is', null);

    if (matchesError) {
      console.error('Error deleting matches:', matchesError);
      throw new Error('Gagal menghapus data pertandingan: ' + matchesError.message);
    }

    const { error: judgesError } = await supabase
      .from('judges')
      .delete()
      .not('id', 'is', null);

    if (judgesError) {
      console.error('Error deleting judges:', judgesError);
      throw new Error('Gagal menghapus data hakim: ' + judgesError.message);
    }

    const { error: participantsError } = await supabase
      .from('participants')
      .delete()
      .not('id', 'is', null);

    if (participantsError) {
      console.error('Error deleting participants:', participantsError);
      throw new Error('Gagal menghapus data peserta: ' + participantsError.message);
    }

    return { success: true, message: 'Semua data berhasil dihapus' };
  } catch (error: any) {
    console.error('Error clearing data:', error);
    return { success: false, message: 'Terjadi kesalahan: ' + error.message };
  }
};