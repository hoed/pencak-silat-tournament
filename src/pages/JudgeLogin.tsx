
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTournament } from "@/contexts/TournamentContext";

const JudgeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginJudge } = useTournament();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Mohon isi username dan password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await loginJudge(username, password);
      
      if (success) {
        toast.success("Login berhasil");
        navigate("/judge-dashboard");
      } else {
        toast.error("Username atau password salah");
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login Hakim</CardTitle>
            <CardDescription className="text-center">
              Masukkan kredensial Anda untuk mengakses panel penilaian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  hakim1 / password123<br />
                  hakim2 / password123<br />
                  hakim3 / password123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default JudgeLogin;
