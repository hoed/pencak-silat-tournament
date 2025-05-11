
import React from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournament } from "@/contexts/TournamentContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, Trophy, Users, Timer } from "lucide-react";

const Dashboard = () => {
  const { participants, matches, organizations } = useTournament();
  
  // Calculate statistics
  const completedMatches = matches.filter(match => match.completed);
  const pendingMatches = matches.filter(match => !match.completed);
  
  // Weight category distribution
  const weightCategoriesData = participants.reduce((acc: any[], participant) => {
    const existingCategory = acc.find(item => item.name === participant.weightCategory);
    
    if (existingCategory) {
      existingCategory.value++;
    } else if (participant.weightCategory) {
      acc.push({
        name: participant.weightCategory,
        value: 1
      });
    }
    
    return acc;
  }, []);
  
  // Gender distribution
  const genderData = [
    {
      name: "Male",
      value: participants.filter(p => p.gender === "Male").length
    },
    {
      name: "Female",
      value: participants.filter(p => p.gender === "Female").length
    }
  ];
  
  // Organization distribution
  const orgData = organizations.map(org => {
    return {
      name: org.name,
      participants: participants.filter(p => p.organization === org.name).length
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6BCB77', '#4D96FF'];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Participants</p>
                <h3 className="text-2xl font-bold">{participants.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <Trophy className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Matches</p>
                <h3 className="text-2xl font-bold">{matches.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <Timer className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-2xl font-bold">{completedMatches.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Organizations</p>
                <h3 className="text-2xl font-bold">{organizations.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {participants.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 w-full gap-3 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Male</p>
                      <p className="text-xl font-bold">{participants.filter(p => p.gender === "Male").length}</p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                      <p className="text-gray-500 text-sm">Female</p>
                      <p className="text-xl font-bold">{participants.filter(p => p.gender === "Female").length}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No participant data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Organization Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={orgData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participants" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No organization data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.slice(0, 5).map((match) => {
                  const participant1 = participants.find(p => p.id === match.participant1Id);
                  const participant2 = participants.find(p => p.id === match.participant2Id);
                  
                  return (
                    <div key={match.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">#{match.matchNumber}</span>
                        <span>
                          {participant1?.fullName || "TBD"} vs {participant2?.fullName || "TBD"}
                        </span>
                      </div>
                      
                      {match.completed ? (
                        <Badge className="bg-green-600">Completed</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No matches created yet</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Link to="/brackets">
                <Button variant="outline">View All Matches</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Connect Supabase CTA */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="text-center py-6">
              <h3 className="text-2xl font-bold mb-3">Connect to Supabase</h3>
              <p className="mb-6 max-w-xl mx-auto opacity-90">
                For full functionality including data persistence, user authentication, and realtime updates, please connect this application to Supabase.
              </p>
              <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                Connect to Supabase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
