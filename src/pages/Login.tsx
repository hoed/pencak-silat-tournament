
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTournament } from "@/contexts/TournamentContext";
import { Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, currentUser } = useTournament();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      redirectBasedOnRole(currentUser.role);
    }
  }, [currentUser]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin-panel');
        break;
      case 'judge':
        navigate('/judge-dashboard');
        break;
      case 'participant':
        navigate('/participant-dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Mohon isi email dan password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await loginUser(email, password);
      
      if (success && currentUser) {
        toast.success("Login berhasil");
        redirectBasedOnRole(currentUser.role);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <Card className="w-full max-w-md border-t-4 border-t-blue-600">
          <CardHeader className="space-y-1 flex items-center flex-col">
            <Shield className="h-12 w-12 text-blue-600 mb-2" />
            <CardTitle className="text-2xl text-center">Login Sistem</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk mengakses sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Sedang Masuk..." : "Masuk"}
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  Akun Demo:<br />
                  Admin: admin@admin.com / password<br />
                  Hakim: juri@juri.com / password<br />
                  Peserta: peserta@peserta.com / password
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
