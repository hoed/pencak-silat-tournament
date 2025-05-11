
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/Layout/MainLayout';
import { Shield, Calendar, Trophy, Users, Clock } from 'lucide-react';

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <div className="inline-block p-3 rounded-full bg-red-100 mb-4">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">Pencak Silat Tournament Manager</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for organizing and managing Pencak Silat tournaments with bracket visualization, scoring system, and participant management.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/registration">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">Register Participants</Button>
            </Link>
            <Link to="/brackets">
              <Button size="lg" variant="outline">View Tournament Brackets</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-center mb-8">Tournament Management Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Tournament Brackets</CardTitle>
                <CardDescription>Visualize elimination-style tournament progression</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Interactive bracket system that automatically updates based on match results. Track the progress of all competitors throughout the tournament.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/brackets" className="w-full">
                  <Button variant="outline" className="w-full">View Brackets</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Judge Scoring System</CardTitle>
                <CardDescription>Efficient scoring for 3 judges across multiple rounds</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Each match consists of 3 rounds of 1 minute each. Scores from 3 judges are recorded per round and averaged to determine winners.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/judge-panel" className="w-full">
                  <Button variant="outline" className="w-full">Judge Panel</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Match Control</CardTitle>
                <CardDescription>Timer control and match administration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Control match timers, rounds, and tournament flow. Auto-transitions between rounds with configurable break times.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/admin-panel" className="w-full">
                  <Button variant="outline" className="w-full">Admin Panel</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="py-8 bg-gray-50 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Tournament Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-4xl font-bold text-red-600">0</p>
              <p className="text-gray-500">Participants</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-blue-600">0</p>
              <p className="text-gray-500">Matches</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-green-600">0</p>
              <p className="text-gray-500">Completed</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-purple-600">0</p>
              <p className="text-gray-500">Organizations</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Ready to organize your tournament?</h2>
          <p className="text-gray-600 mb-6">Start by registering participants and creating your brackets</p>
          <Link to="/registration">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">Get Started</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
