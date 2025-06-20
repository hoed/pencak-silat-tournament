import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournament } from "@/contexts/TournamentContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Brackets = () => {
  const { participants, matches, currentUser } = useTournament();
  const navigate = useNavigate();
  const [weightFilter, setWeightFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<string>("");
  
  // Redirect unauthenticated users
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);
  
  const uniqueWeightCategories = Array.from(
    new Set(participants.map((p) => p.weightCategory))
  ).filter(Boolean); // Filter out any empty strings
  
  const uniqueAgeCategories = Array.from(
    new Set(participants.map((p) => p.ageCategory))
  ).filter(Boolean); // Filter out any empty strings

  const filteredMatches = matches.filter((match) => {
    const participant1 = participants.find((p) => p.id === match.participant1Id);
    const participant2 = participants.find((p) => p.id === match.participant2Id);
    
    if (!participant1 || !participant2) return true; // Include TBD matches
    
    const matchesWeight = !weightFilter || 
      participant1.weightCategory === weightFilter || 
      participant2.weightCategory === weightFilter;
      
    const matchesGender = !genderFilter || 
      participant1.gender === genderFilter || 
      participant2.gender === genderFilter;
      
    const matchesAge = !ageFilter || 
      participant1.ageCategory === ageFilter || 
      participant2.ageCategory === ageFilter;
      
    return matchesWeight && matchesGender && matchesAge;
  });

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <Card className="mb-6 border-t-4 border-t-amber-500">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Bracket Turnamen</CardTitle>
            <p className="text-gray-500">
              Lihat dan pantau progres pertandingan dalam seluruh turnamen
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Kategori Berat</label>
                <Select value={weightFilter} onValueChange={setWeightFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kategori berat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kategori berat</SelectItem>
                    {uniqueWeightCategories.map((category) => (
                      category ? (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ) : null
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua jenis kelamin</SelectItem>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Kategori Usia</label>
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kategori usia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kategori usia</SelectItem>
                    {uniqueAgeCategories.map((category) => (
                      category ? (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ) : null
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Belum Ada Pertandingan</h3>
                <p className="text-gray-500">
                  Bracket turnamen akan muncul setelah pertandingan dibuat
                </p>
              </div>
            ) : (
              <Tabs defaultValue="bracket">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="bracket" className="flex-1">Tampilan Bracket</TabsTrigger>
                  <TabsTrigger value="list" className="flex-1">Tampilan Daftar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="bracket">
                  <div className="overflow-x-auto">
                    {filteredMatches.length > 0 ? (
                      <div className="min-w-[800px] p-4">
                        <div className="flex">
                          {/* Tournament Rounds */}
                          {[1, 2, 3].map((round) => (
                            <div key={round} className="flex-1 px-2">
                              <h3 className="text-center font-semibold mb-4">
                                {round === 1 ? "Perempat Final" : round === 2 ? "Semi Final" : "Final"}
                              </h3>
                              
                              {/* Match Brackets for this round */}
                              <div className="space-y-8">
                                {filteredMatches
                                  .filter((match) => match.roundNumber === round)
                                  .map((match) => {
                                    const p1 = participants.find(p => p.id === match.participant1Id);
                                    const p2 = participants.find(p => p.id === match.participant2Id);
                                    
                                    return (
                                      <div key={match.id} className="relative">
                                        <div className="border rounded-md overflow-hidden">
                                          <div className={`p-3 ${match.winnerId === match.participant1Id ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-white'}`}>
                                            <span className="font-medium block truncate">
                                              {p1?.fullName || "Belum ditentukan"}
                                            </span>
                                            {p1 && (
                                              <span className="text-xs text-gray-500 block truncate">
                                                {p1.organization} | {p1.branch}
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="h-px bg-gray-200"></div>
                                          
                                          <div className={`p-3 ${match.winnerId === match.participant2Id ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-white'}`}>
                                            <span className="font-medium block truncate">
                                              {p2?.fullName || "Belum ditentukan"}
                                            </span>
                                            {p2 && (
                                              <span className="text-xs text-gray-500 block truncate">
                                                {p2.organization} | {p2.branch}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {match.completed && (
                                          <Badge className="absolute -right-2 top-1/2 -translate-y-1/2 bg-green-600">
                                            Selesai
                                          </Badge>
                                        )}

                                        {/* Connect to next round with lines (visual only) */}
                                        {round < 3 && (
                                          <div className="absolute top-1/2 right-0 w-8 h-px bg-gray-300"></div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada pertandingan yang sesuai dengan filter</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="list">
                  <div className="space-y-4">
                    {filteredMatches.length > 0 ? (
                      filteredMatches.map((match) => {
                        const p1 = participants.find(p => p.id === match.participant1Id);
                        const p2 = participants.find(p => p.id === match.participant2Id);
                        
                        return (
                          <Card key={match.id} className="overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gray-50">
                              <div>
                                <span className="font-medium">Pertandingan #{match.matchNumber}</span>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="text-sm text-gray-500">
                                  {match.roundNumber === 1 
                                    ? "Perempat Final" 
                                    : match.roundNumber === 2 
                                    ? "Semi Final" 
                                    : "Final"}
                                </span>
                              </div>
                              
                              {match.completed ? (
                                <Badge className="bg-green-600">Selesai</Badge>
                              ) : (
                                <Badge variant="outline">Belum Selesai</Badge>
                              )}
                            </div>
                            
                            <CardContent className="p-0">
                              <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className={`p-4 ${match.winnerId === match.participant1Id ? 'bg-green-50' : ''}`}>
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mr-2">
                                      M
                                    </div>
                                    <div>
                                      <span className="font-medium block">
                                        {p1?.fullName || "Belum ditentukan"}
                                      </span>
                                      {p1 && (
                                        <span className="text-xs text-gray-500 block">
                                          {p1.organization} | {p1.branch}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {match.winnerId === match.participant1Id && (
                                      <Badge className="ml-auto bg-green-600">Pemenang</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className={`p-4 border-t md:border-t-0 md:border-l ${match.winnerId === match.participant2Id ? 'bg-green-50' : ''}`}>
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-2">
                                      B
                                    </div>
                                    <div>
                                      <span className="font-medium block">
                                        {p2?.fullName || "Belum ditentukan"}
                                      </span>
                                      {p2 && (
                                        <span className="text-xs text-gray-500 block">
                                          {p2.organization} | {p2.branch}
                                        </span>
                                      )}
                                    </div>
                                    
                                    {match.winnerId === match.participant2Id && (
                                      <Badge className="ml-auto bg-green-600">Pemenang</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Tidak ada pertandingan yang sesuai dengan filter</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Brackets;
