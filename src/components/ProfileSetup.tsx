import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";
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

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [buddyName, setBuddyName] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setVerifying(true);

      await apiClient.patch("/user/me", {
        avatar: avatars.find((a) => a.id === selectedAvatar)?.image,
        examGoals:
          selectedGoal === "jee"
            ? ["JEE"]
            : selectedGoal === "bitsat"
            ? ["BITSAT"]
            : ["JEE", "BITSAT"],
      });

      await apiClient.patch("/user/me/study-buddy", { name: buddyName });

      useAuthStore.setState({
        user: {
          ...user,
          avatar: avatars.find((a) => a.id === selectedAvatar)?.image,
          examGoals:
            selectedGoal === "jee"
              ? ["JEE"]
              : selectedGoal === "bitsat"
              ? ["BITSAT"]
              : ["JEE", "BITSAT"],
          studyBuddy: { name: buddyName },
        },
      });
      toast({
        title: "Account Created!",
        description:
          "Welcome to TestBit! You've earned a 'New Trailblazer' badge and 50 starter coins.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || `Something went wrong`,
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };
  return (
    <Card className="p-6">
      <form onSubmit={handleProfileSetup}>
        <div className="space-y-6">
          <div>
            <Label className="block mb-2">Choose Your Avatar</Label>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className={`cursor-pointer p-2 rounded-lg border-2 ${
                    selectedAvatar === avatar.id
                      ? "border-brandPurple bg-purple-50"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                >
                  <div className="w-14 h-14 mx-auto rounded-full overflow-hidden">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-center mt-1">{avatar.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="buddyName">Name Your Study Buddy</Label>
            <Input
              id="buddyName"
              type="text"
              value={buddyName}
              onChange={(e) => setBuddyName(e.target.value)}
              placeholder="e.g., Einstein, Newton"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your study buddy will guide you through your exam prep journey
            </p>
          </div>

          <div>
            <Label className="block mb-2">Select Your Exam Goal</Label>
            <div className="space-y-2">
              {examGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`cursor-pointer p-3 rounded-lg border ${
                    selectedGoal === goal.id
                      ? "border-brandPurple bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        selectedGoal === goal.id
                          ? "border-4 border-brandPurple"
                          : "border border-gray-300"
                      }`}
                    ></div>
                    <span className="ml-2">{goal.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifying || !selectedAvatar || !selectedGoal}
          >
            {verifying ? "Creating Account..." : "Complete Profile"}
            {!verifying && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSetup;
