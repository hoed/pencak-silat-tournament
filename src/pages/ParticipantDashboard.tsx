
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useTournament } from "@/contexts/TournamentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Calendar, Medal } from "lucide-react";

const ParticipantDashboard = () => {
  const { currentUser, participants, matches, logoutUser } = useTournament();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not logged in or not a participant
    if (!currentUser || currentUser.role !== 'participant') {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Find this participant's data (would be linked via auth in a real implementation)
  const currentParticipantEmail = currentUser?.email;
  const participant = participants.find(p => p.id === currentUser?.id) || {
    fullName: "Nama Peserta",
    weightCategory: "Kelas A",
    ageCategory: "Dewasa"
  };

  // Filter matches for this participant
  const participantMatches = matches.filter(
    m => m.participant1Id === currentUser?.id || m.participant2Id === currentUser?.id
  );

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="mb-6 border-t-4 border-t-green-600">
          <CardHeader className="pb-2 flex flex-wrap justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Dashboard Peserta</CardTitle>
              <p className="text-gray-500">
                Selamat datang, {participant.fullName} ({currentParticipantEmail})
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Keluar
            </Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <Medal className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kelas Berat</p>
                  <h3 className="text-xl font-bold">{participant.weightCategory}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kategori Usia</p>
                  <h3 className="text-xl font-bold">{participant.ageCategory}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <Trophy className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pertandingan</p>
                  <h3 className="text-xl font-bold">{participantMatches.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Jadwal Pertandingan Anda</CardTitle>
          </CardHeader>
          <CardContent>
            {participantMatches.length > 0 ? (
              <div className="space-y-3">
                {participantMatches.map((match) => {
                  const opponent = match.participant1Id === currentUser?.id
                    ? participants.find(p => p.id === match.participant2Id)?.fullName || "TBD"
                    : participants.find(p => p.id === match.participant1Id)?.fullName || "TBD";
                  
                  return (
                    <div key={match.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Match #{match.matchNumber}</span>
                        {match.completed ? (
                          <Badge className="bg-green-600">Selesai</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            Belum Dimulai
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700">Lawan: {opponent}</p>
                      <p className="text-gray-500 text-sm">Ronde {match.roundNumber}</p>
                      {match.winnerId && (
                        <div className="mt-2 flex items-center">
                          <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-amber-600 font-medium">
                            {match.winnerId === currentUser?.id ? "Anda menang!" : "Opponent wins"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">
                  Anda belum memiliki pertandingan terjadwal
                </p>
                <Button variant="outline" className="mt-4">
                  Lihat Semua Pertandingan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama Lengkap</p>
                <p className="font-medium">{participant.fullName}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{currentParticipantEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kelas</p>
                  <p className="font-medium">{participant.weightCategory}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Kategori Usia</p>
                  <p className="font-medium">{participant.ageCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className="bg-green-600">Aktif</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ParticipantDashboard;
