import { supabase } from "@/integrations/supabase/client";

export const insertSampleData = async () => {
  try {
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

    // Sample participants data
    const participants = [
      {
        id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
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
        id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef12',
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
        id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef123',
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
        id: 'd4e5f6a7-b8c9-0123-4567-890abcdef1234',
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
      return { success: false, message: 'Gagal menambahkan data peserta: ' + participantsError.message };
    }

    // Sample judges data
    const judges = [
      { id: 'j1a2b3c4-d5e6-7890-1234-567890abcdef', full_name: 'Hakim Satu', judge_number: 1, username: 'hakim1', password: 'password1' },
      { id: 'j2b3c4d5-e6f7-8901-2345-67890abcdef12', full_name: 'Hakim Dua', judge_number: 2, username: 'hakim2', password: 'password2' },
      { id: 'j3c4d5e6-f7a8-9012-3456-7890abcdef123', full_name: 'Hakim Tiga', judge_number: 3, username: 'hakim3', password: 'password3' },
    ];

    // Insert judges
    const { error: judgesError } = await supabase
      .from('judges')
      .insert(judges);

    if (judgesError) {
      console.error('Error inserting judges:', judgesError);
      return { success: false, message: 'Gagal menambahkan data hakim: ' + judgesError.message };
    }

    // Sample matches data
    const matches = [
      { id: 'm1n2o3p4-q5r6-7890-1234-567890abcdef', match_number: 1, participant1_id: participants[0].id, participant2_id: participants[1].id, round_number: 1, completed: false },
      { id: 'm2o3p4q5-r6s7-8901-2345-67890abcdef12', match_number: 2, participant1_id: participants[2].id, participant2_id: participants[3].id, round_number: 1, completed: false },
      { id: 'm3p4q5r6-s7t8-9012-3456-7890abcdef123', match_number: 3, participant1_id: participants[0].id, participant2_id: participants[3].id, round_number: 2, completed: false },
    ];

    // Insert matches
    const { error: matchesError } = await supabase
      .from('matches')
      .insert(matches);

    if (matchesError) {
      console.error('Error inserting matches:', matchesError);
      return { success: false, message: 'Gagal menambahkan data pertandingan: ' + matchesError.message };
    }

    // Create sample scores with detailed criteria
    const roundScores = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      
      // Only create scores for matches with participants
      if (match.participant1_id && match.participant2_id) {
        for (let judgeIndex = 0; judgeIndex < judges.length; judgeIndex++) {
          const judge = judges[judgeIndex];
          
          // Create scores for rounds 1-3
          for (let round = 1; round <= 3; round++) {
            // Generate random scores for each criteria
            const p1_punches = Math.floor(Math.random() * 8) + 3; // 3-10
            const p1_kicks = Math.floor(Math.random() * 8) + 3;   // 3-10
            const p1_throws = Math.floor(Math.random() * 8) + 3;  // 3-10
            
            const p2_punches = Math.floor(Math.random() * 8) + 3; // 3-10
            const p2_kicks = Math.floor(Math.random() * 8) + 3;   // 3-10
            const p2_throws = Math.floor(Math.random() * 8) + 3;  // 3-10
            
            // Calculate totals
            const p1_total = p1_punches + p1_kicks + p1_throws;
            const p2_total = p2_punches + p2_kicks + p2_throws;
            
            roundScores.push({
              match_id: match.id,
              judge_id: judge.id,
              round_number: round,
              participant1_score: p1_total,
              participant2_score: p2_total,
              participant1_punches: p1_punches,
              participant1_kicks: p1_kicks,
              participant1_throws: p1_throws,
              participant2_punches: p2_punches,
              participant2_kicks: p2_kicks,
              participant2_throws: p2_throws
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
        return { success: false, message: 'Gagal menambahkan data nilai: ' + scoresError.message };
      }
    }

    return { success: true, message: 'Data sampel berhasil ditambahkan' };
  } catch (error) {
    console.error('Error inserting sample data:', error);
    return { success: false, message: 'Terjadi kesalahan: ' + (error as Error).message };
  }
};

export const clearAllData = async () => {
  try {
    // Delete data from round_scores table
    const { error: scoresError } = await supabase
      .from('round_scores')
      .delete()
      .neq('id', null); // Delete all rows

    if (scoresError) {
      console.error('Error deleting round scores:', scoresError);
      return { success: false, message: 'Gagal menghapus data nilai: ' + scoresError.message };
    }

    // Delete data from matches table
    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .neq('id', null); // Delete all rows

    if (matchesError) {
      console.error('Error deleting matches:', matchesError);
      return { success: false, message: 'Gagal menghapus data pertandingan: ' + matchesError.message };
    }

    // Delete data from judges table
    const { error: judgesError } = await supabase
      .from('judges')
      .delete()
      .neq('id', null); // Delete all rows

    if (judgesError) {
      console.error('Error deleting judges:', judgesError);
      return { success: false, message: 'Gagal menghapus data hakim: ' + judgesError.message };
    }

    // Delete data from participants table
    const { error: participantsError } = await supabase
      .from('participants')
      .delete()
      .neq('id', null); // Delete all rows

    if (participantsError) {
      console.error('Error deleting participants:', participantsError);
      return { success: false, message: 'Gagal menghapus data peserta: ' + participantsError.message };
    }

    return { success: true, message: 'Semua data berhasil dihapus' };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, message: 'Terjadi kesalahan: ' + (error as Error).message };
  }
};
