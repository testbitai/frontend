
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Mail, User, BookOpen, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const TutorSignup = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white dark:from-muted dark:to-muted to-green-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join as a Tutor
            </h1>
          </div>
          <p className="text-muted-forground text-lg">Empower the next generation of JEE & BITSAT achievers</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-muted-forground'}`}>
              <Mail className="h-5 w-5" />
            </div>
            <div className={`w-16 h-1 ${step > 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-muted-forground'}`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <div className={`w-16 h-1 ${step > 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-muted-forground'}`}>
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {step === 1 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Email Verification</CardTitle>
                <CardDescription>We'll send you a verification code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    className="text-lg py-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code (6 digits)</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="Enter OTP"
                    className="text-lg py-3 text-center tracking-widest"
                    maxLength={6}
                  />
                </div>
                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full"
                >
                  Verify & Continue
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Payment & Subscription</CardTitle>
                <CardDescription>Choose your tutoring plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200 hover:border-blue-400 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Starter Plan</CardTitle>
                      <CardDescription>Perfect for individual tutors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">₹999/month</div>
                      <ul className="text-sm space-y-1 text-muted-forground">
                        <li>• Up to 50 students</li>
                        <li>• Basic analytics</li>
                        <li>• Test creation tools</li>
                        <li>• Email support</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 hover:border-green-400 cursor-pointer bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Pro Plan</CardTitle>
                      <CardDescription>For coaching institutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">₹2999/month</div>
                      <ul className="text-sm space-y-1 text-muted-forground">
                        <li>• Unlimited students</li>
                        <li>• Advanced analytics</li>
                        <li>• Bulk test uploads</li>
                        <li>• Priority support</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <Button 
                  onClick={() => setStep(3)} 
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-lg py-3"
                >
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                <CardDescription>Tell us about your teaching expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institute">Institute/Organization Name</Label>
                  <Input id="institute" placeholder="ABC Coaching Institute" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examFocus">Primary Exam Focus</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exam type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jee">JEE Main & Advanced</SelectItem>
                      <SelectItem value="bitsat">BITSAT</SelectItem>
                      <SelectItem value="both">Both JEE & BITSAT</SelectItem>
                      <SelectItem value="other">Other Engineering Exams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects You Teach</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Physics', 'Chemistry', 'Mathematics'].map((subject) => (
                      <Button
                        key={subject}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about your teaching experience, qualifications, and what makes you unique..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-lg py-3">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Complete Registration
                </Button>

                <div className="text-center text-sm text-muted-forground">
                  After registration, you'll be redirected to Admin Login to access your dashboard
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSignup;
