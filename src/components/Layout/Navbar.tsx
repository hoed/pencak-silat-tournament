
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, UserPlus, Users, Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="font-bold text-xl">Pencak Silat Tournament</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <Link to="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Home className="mr-1 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Trophy className="mr-1 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/brackets">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Calendar className="mr-1 h-4 w-4" />
                Brackets
              </Button>
            </Link>
            <Link to="/registration">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <UserPlus className="mr-1 h-4 w-4" />
                Registration
              </Button>
            </Link>
            <Link to="/organizations">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <Users className="mr-1 h-4 w-4" />
                Organizations
              </Button>
            </Link>
          </div>

          <div className="hidden md:block">
            <Link to="/admin-panel">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                Admin Panel
              </Button>
            </Link>
            <Link to="/judge-panel" className="ml-2">
              <Button className="bg-blue-600 hover:bg-blue-700">Judge Panel</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
