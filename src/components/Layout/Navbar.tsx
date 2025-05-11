
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, UserPlus, Users, Shield, Home, LogOut, Menu, X } from 'lucide-react';
import { useTournament } from '@/contexts/TournamentContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { currentUser, logoutUser } = useTournament();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    setIsSheetOpen(false);
    navigate('/');
  };

  const renderUserLinks = () => {
    if (!currentUser) {
      return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Link 
            to="/login" 
            className="text-white hover:text-red-300 transition-colors py-2"
            onClick={() => setIsSheetOpen(false)}
          >
            Masuk
          </Link>
          <Link 
            to="/register" 
            className="text-white hover:text-red-300 transition-colors py-2"
            onClick={() => setIsSheetOpen(false)}
          >
            Daftar
          </Link>
        </div>
      );
    }

    switch (currentUser.role) {
      case 'admin':
        return (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Link 
              to="/admin-panel" 
              className="text-red-400 hover:text-red-300 transition-colors font-medium py-2"
              onClick={() => setIsSheetOpen(false)}
            >
              Panel Admin
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-red-300 transition-colors flex items-center gap-1 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        );

      case 'judge':
        return (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Link 
              to="/judge-dashboard" 
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium py-2"
              onClick={() => setIsSheetOpen(false)}
            >
              Panel Hakim
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-red-300 transition-colors flex items-center gap-1 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        );

      case 'participant':
        return (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Link 
              to="/participant-dashboard" 
              className="text-green-400 hover:text-green-300 transition-colors font-medium py-2"
              onClick={() => setIsSheetOpen(false)}
            >
              Dashboard Peserta
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-white hover:text-red-300 transition-colors flex items-center gap-1 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        );

      default:
        return (
          <button 
            onClick={handleLogout} 
            className="text-white hover:text-red-300 transition-colors flex items-center gap-1 py-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </button>
        );
    }
  };

  const mobileMenuItems = (
    <div className="flex flex-col space-y-4 pt-4 pb-8 px-4">
      <Link 
        to="/" 
        className="text-white hover:text-red-300 flex items-center gap-2 py-2"
        onClick={() => setIsSheetOpen(false)}
      >
        <Home className="h-5 w-5" />
        <span>Beranda</span>
      </Link>
      <Link 
        to="/dashboard" 
        className="text-white hover:text-red-300 flex items-center gap-2 py-2"
        onClick={() => setIsSheetOpen(false)}
      >
        <Trophy className="h-5 w-5" />
        <span>Dashboard</span>
      </Link>
      <Link 
        to="/brackets" 
        className="text-white hover:text-red-300 flex items-center gap-2 py-2"
        onClick={() => setIsSheetOpen(false)}
      >
        <Calendar className="h-5 w-5" />
        <span>Brackets</span>
      </Link>
      <Link 
        to="/registration" 
        className="text-white hover:text-red-300 flex items-center gap-2 py-2"
        onClick={() => setIsSheetOpen(false)}
      >
        <UserPlus className="h-5 w-5" />
        <span>Pendaftaran</span>
      </Link>
      <Link 
        to="/organizations" 
        className="text-white hover:text-red-300 flex items-center gap-2 py-2"
        onClick={() => setIsSheetOpen(false)}
      >
        <Shield className="h-5 w-5" />
        <span>Organisasi</span>
      </Link>
      {currentUser?.role === 'judge' && (
        <Link 
          to="/judge-dashboard" 
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 py-2"
          onClick={() => setIsSheetOpen(false)}
        >
          <Users className="h-5 w-5" />
          <span>Panel Hakim</span>
        </Link>
      )}
      <div className="border-t border-gray-700 pt-4 mt-4">
        {renderUserLinks()}
      </div>
    </div>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="font-bold text-xl text-white">Turnamen Pencak Silat</span>
          </Link>
          
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className="text-white hover:text-red-300 px-3 py-2 flex items-center">
                    <Home className="mr-1 h-4 w-4" />
                    Beranda
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard" className="text-white hover:text-red-300 px-3 py-2 flex items-center">
                    <Trophy className="mr-1 h-4 w-4" />
                    Dashboard
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/brackets" className="text-white hover:text-red-300 px-3 py-2 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Brackets
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white bg-transparent hover:bg-white/10">
                    <Users className="mr-1 h-4 w-4" />
                    Informasi
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-gray-800">
                      <li>
                        <Link to="/registration">
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 focus:bg-gray-700 text-white">
                            <div className="text-sm font-medium leading-none">
                              <UserPlus className="mr-1 h-4 w-4 inline" />
                              Pendaftaran
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-300">
                              Daftarkan peserta baru untuk turnamen
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/organizations">
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 focus:bg-gray-700 text-white">
                            <div className="text-sm font-medium leading-none">
                              <Shield className="mr-1 h-4 w-4 inline" />
                              Organisasi
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-300">
                              Informasi perguruan dan cabang
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      {currentUser?.role === 'judge' && (
                        <li>
                          <Link to="/judge-dashboard">
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-700 focus:bg-gray-700 text-white">
                              <div className="text-sm font-medium leading-none text-blue-300">Panel Hakim</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-300">
                                Penilaian pertandingan untuk hakim
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex gap-2">
            {renderUserLinks()}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button className="text-white p-2">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gray-900 border-gray-800 text-white p-0">
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-red-500" />
                    <span className="font-bold text-lg">Pencak Silat</span>
                  </div>
                </div>
                {mobileMenuItems}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
