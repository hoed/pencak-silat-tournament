
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
          <h1 className="text-4xl md:text-6xl font-bold">Pengelola Turnamen Pencak Silat</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform komprehensif untuk mengatur dan mengelola turnamen Pencak Silat dengan visualisasi bagan, sistem penilaian, dan manajemen peserta.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/registration">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">Daftar Peserta</Button>
            </Link>
            <Link to="/brackets">
              <Button size="lg" variant="outline">Lihat Bagan Turnamen</Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-center mb-8">Fitur Manajemen Turnamen</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Bagan Turnamen</CardTitle>
                <CardDescription>Visualisasikan kemajuan turnamen eliminasi</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sistem bagan interaktif yang otomatis diperbarui berdasarkan hasil pertandingan. Pantau kemajuan semua peserta sepanjang turnamen.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/brackets" className="w-full">
                  <Button variant="outline" className="w-full">Lihat Bagan</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Sistem Penilaian Juri</CardTitle>
                <CardDescription>Penilaian efisien untuk 3 juri di beberapa babak</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Setiap pertandingan terdiri dari 3 ronde masing-masing 1 menit. Nilai dari 3 juri dicatat per ronde dan dirata-rata untuk menentukan pemenang.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/judge-panel" className="w-full">
                  <Button variant="outline" className="w-full">Panel Juri</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle>Kontrol Pertandingan</CardTitle>
                <CardDescription>Kontrol waktu dan administrasi pertandingan</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Kontrol timer pertandingan, ronde, dan aliran turnamen. Transisi otomatis antar ronde dengan waktu istirahat yang dapat dikonfigurasi.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/admin-panel" className="w-full">
                  <Button variant="outline" className="w-full">Panel Admin</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="py-8 bg-gray-50 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Ringkasan Turnamen</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-4xl font-bold text-red-600">0</p>
              <p className="text-gray-500">Peserta</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-blue-600">0</p>
              <p className="text-gray-500">Pertandingan</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-green-600">0</p>
              <p className="text-gray-500">Selesai</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold text-purple-600">0</p>
              <p className="text-gray-500">Organisasi</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Siap mengatur turnamen Anda?</h2>
          <p className="text-gray-600 mb-6">Mulai dengan mendaftarkan peserta dan membuat bagan Anda</p>
          <Link to="/registration">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">Mulai Sekarang</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
