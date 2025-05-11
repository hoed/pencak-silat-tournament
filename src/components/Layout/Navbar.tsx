
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, UserPlus, Users, Shield, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTournament } from '@/contexts/TournamentContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { currentUser, logoutUser } = useTournament();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const renderUserLinks = () => {
    if (!currentUser) {
      return (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">Masuk</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-white text-gray-900 hover:bg-white/90">Daftar</Button>
          </Link>
        </div>
      );
    }

    switch (currentUser.role) {
      case 'admin':
        return (
          <div className="flex items-center gap-2">
            <Link to="/admin-panel">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                Panel Admin
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="gap-1 text-white hover:bg-white/20">
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        );

      case 'judge':
        return (
          <div className="flex items-center gap-2">
            <Link to="/judge-dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Panel Hakim</Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="gap-1 text-white hover:bg-white/20">
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        );

      case 'participant':
        return (
          <div className="flex items-center gap-2">
            <Link to="/participant-dashboard">
              <Button className="bg-green-600 hover:bg-green-700">Dashboard Peserta</Button>
            </Link>
            <Button onClick={handleLogout} variant="ghost" className="gap-1 text-white hover:bg-white/20">
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        );

      default:
        return (
          <Button onClick={handleLogout} variant="ghost" className="gap-1 text-white hover:bg-white/20">
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
          </Button>
        );
    }
  };

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
                  <Link to="/">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-white hover:bg-white/10")}>
                      <Home className="mr-1 h-4 w-4" />
                      Beranda
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-white hover:bg-white/10")}>
                      <Trophy className="mr-1 h-4 w-4" />
                      Dashboard
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/brackets">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-white hover:text-white hover:bg-white/10")}>
                      <Calendar className="mr-1 h-4 w-4" />
                      Brackets
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-white hover:bg-white/10">
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

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-white">
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
