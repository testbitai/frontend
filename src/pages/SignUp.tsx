import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CreditCard, Eye, EyeOff, Mail, User } from "lucide-react";
import { set } from "date-fns";
import ProfileSetup from "@/components/ProfileSetup";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

const avatars = [
  { id: "robot", name: "Robot", image: "/robot.png" },
  { id: "owl", name: "Owl", image: "/owl.png" },
  { id: "fox", name: "Fox", image: "/fox.png" },
  { id: "cat", name: "Cat", image: "/cat.png" },
];

const examGoals = [
  { id: "jee", name: "JEE Mains & Advanced" },
  { id: "bitsat", name: "BITSAT" },
  { id: "both", name: "Both JEE & BITSAT" },
];

const SignUp = () => {
  const { toast } = useToast();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await apiClient.post("/auth/register", {
        email,
        name,
        password,
      });
      const { tokens, user } = data.data;
      login(user, tokens.accessToken, tokens.refreshToken);
      toast({
        title: "OTP Sent!",
        description: `We've sent a verification code to ${email}`,
      });
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || `Something went wrong`,
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:from-muted dark:to-muted via-white to-green-50 py-12">
      <div>
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
          </div>
          <p className="text-muted-forground text-lg">
            Create your free TestBit account to start your exam journey
          </p>
        </div>
      </div>


      <div className="max-w-md mx-auto">
        {step === 1 && (
          <Card className="p-6">
            <form onSubmit={handleEmailSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-muted-forground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !email || !password || !name}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 2 && <ProfileSetup />}
      </div>
    </div>
  );
};

export default SignUp;
