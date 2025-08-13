import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  Mail, 
  User, 
  BookOpen, 
  CreditCard, 
  Phone, 
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

interface FormData {
  // Step 1: Email
  email: string;
  
  // Step 2: OTP Verification
  otp: string;
  
  // Step 3: Basic Info
  name: string;
  password: string;
  confirmPassword: string;
  instituteName: string;
  
  // Step 4: Professional Details
  examFocus: string[];
  subjects: string[];
  bio: string;
  experience: number;
  qualifications: string;
  
  // Step 5: Contact Info
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Step 6: Plan Selection
  planType: 'starter' | 'pro';
}

const TutorSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: '',
    instituteName: '',
    examFocus: [],
    subjects: [],
    bio: '',
    experience: 0,
    qualifications: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    planType: 'starter',
  });

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/tutor/send-otp', { email: formData.email });
      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `We've sent a verification code to ${formData.email}`,
      });
      setStep(2); // Move to OTP verification step
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/tutor/verify-email', {
        email: formData.email,
        otp: formData.otp
      });
      setEmailVerified(true);
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully",
      });
      setStep(3); // Move to basic info step
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Invalid or expired OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await apiClient.post('/tutor/send-otp', { email: formData.email });
      toast({
        title: "OTP Resent!",
        description: `We've sent a new verification code to ${formData.email}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to resend OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegistration = async () => {
    // Validate required fields
    if (!formData.name || !formData.password || !formData.instituteName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        instituteName: formData.instituteName,
        examFocus: formData.examFocus,
        subjects: formData.subjects,
        bio: formData.bio,
        experience: formData.experience,
        qualifications: formData.qualifications,
        phone: formData.phone,
        address: formData.address,
        planType: formData.planType,
      };

      const { data } = await apiClient.post('/tutor/register', registrationData);
      const { tokens, user } = data.data;
      
      login(user, tokens.accessToken, tokens.refreshToken);
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to TestBit! Your account is under review.",
      });
      
      navigate('/tutor/dashboard');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const examOptions = [
    { id: "JEE", name: "JEE Main & Advanced" },
    { id: "BITSAT", name: "BITSAT" },
  ];

  const subjectOptions = [
    { id: "Physics", name: "Physics" },
    { id: "Chemistry", name: "Chemistry" },
    { id: "Mathematics", name: "Mathematics" },
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white dark:from-muted dark:to-muted to-green-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Join as a Tutor
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Empower the next generation of JEE & BITSAT achievers</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-blue-500 text-white' : 'bg-gray-200 text-muted-foreground'
                }`}>
                  {step > stepNum ? <CheckCircle className="h-5 w-5" /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Step 1: Email Verification */}
          {step === 1 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Mail className="h-6 w-6 mr-2" />
                  Email Verification
                </CardTitle>
                <CardDescription>We'll send you a verification code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="text-lg py-3"
                  />
                </div>
                
                <Button 
                  onClick={handleSendOTP}
                  disabled={loading || !formData.email}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Send Verification Code
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code (6 digits)</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={(e) => updateFormData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-lg py-3 text-center tracking-widest"
                    maxLength={6}
                  />
                </div>
                
                <Button 
                  onClick={handleVerifyEmail}
                  disabled={loading || !formData.otp || formData.otp.length !== 6}
                  className="w-full"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify & Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <User className="h-6 w-6 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute/Organization Name *</Label>
                  <Input 
                    id="instituteName" 
                    placeholder="ABC Coaching Institute"
                    value={formData.instituteName}
                    onChange={(e) => updateFormData('instituteName', e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Professional Details */}
          {step === 3 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 mr-2" />
                  Professional Details
                </CardTitle>
                <CardDescription>Tell us about your teaching expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Exam Focus *</Label>
                  <div className="flex flex-wrap gap-2">
                    {examOptions.map((exam) => (
                      <div key={exam.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={exam.id}
                          checked={formData.examFocus.includes(exam.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('examFocus', [...formData.examFocus, exam.id]);
                            } else {
                              updateFormData('examFocus', formData.examFocus.filter(e => e !== exam.id));
                            }
                          }}
                        />
                        <Label htmlFor={exam.id}>{exam.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subjects You Teach *</Label>
                  <div className="flex flex-wrap gap-2">
                    {subjectOptions.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject.id}
                          checked={formData.subjects.includes(subject.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('subjects', [...formData.subjects, subject.id]);
                            } else {
                              updateFormData('subjects', formData.subjects.filter(s => s !== subject.id));
                            }
                          }}
                        />
                        <Label htmlFor={subject.id}>{subject.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input 
                      id="experience" 
                      type="number"
                      min="0"
                      max="50"
                      placeholder="5"
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications *</Label>
                    <Input 
                      id="qualifications" 
                      placeholder="B.Tech, M.Tech, PhD"
                      value={formData.qualifications}
                      onChange={(e) => updateFormData('qualifications', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You *</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about your teaching experience, achievements, and what makes you unique..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Contact Information */}
          {step === 4 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <Phone className="h-6 w-6 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>How can we reach you?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address *
                  </Label>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Street Address"
                      value={formData.address.street}
                      onChange={(e) => updateFormData('address.street', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input 
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => updateFormData('address.city', e.target.value)}
                    />
                    <Select 
                      value={formData.address.state} 
                      onValueChange={(value) => updateFormData('address.state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Input 
                      placeholder="Pincode"
                      value={formData.address.pincode}
                      onChange={(e) => updateFormData('address.pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Plan Selection */}
          {step === 5 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 mr-2" />
                  Choose Your Plan
                </CardTitle>
                <CardDescription>Select the plan that best fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card 
                    className={`border-2 cursor-pointer transition-all ${
                      formData.planType === 'starter' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => updateFormData('planType', 'starter')}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">Starter Plan</CardTitle>
                      <CardDescription>Perfect for individual tutors</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600 mb-2">₹999/month</div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Up to 50 students</li>
                        <li>• Basic analytics</li>
                        <li>• Test creation tools</li>
                        <li>• Email support</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`border-2 cursor-pointer transition-all ${
                      formData.planType === 'pro' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => updateFormData('planType', 'pro')}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">Pro Plan</CardTitle>
                      <CardDescription>For coaching institutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600 mb-2">₹2999/month</div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Unlimited students</li>
                        <li>• Advanced analytics</li>
                        <li>• Bulk test uploads</li>
                        <li>• Priority support</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleSubmitRegistration}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Complete Registration
                    <GraduationCap className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  After registration, you'll be redirected to your dashboard. 
                  Your account will be reviewed by our admin team.
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
