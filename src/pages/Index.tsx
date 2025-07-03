import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Award,
  BarChart,
  BookOpen,
  Check,
  Star,
  Sparkles,
  Rocket,
  ZapIcon,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuthStore((state) => state);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-brandPurple" />,
      title: "Comprehensive Test Series",
      description:
        "Practice with our extensive collection of mock tests, chapter-wise quizzes, and topic-focused assessments.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-brandIndigo" />,
      title: "Detailed Analytics",
      description:
        "Track your progress with in-depth performance analysis and personalized improvement suggestions.",
    },
    {
      icon: <Award className="h-8 w-8 text-brandOrange" />,
      title: "Rewards & Gamification",
      description:
        "Earn coins, unlock badges, and compete on leaderboards as you master JEE and BITSAT concepts.",
    },
  ];

  const topPerformers = [
    {
      name: "Chinmaya S",
      score: "JEE 99.8 percentile",
      badge: "Top Performer",
      image:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    },
    {
      name: "Priya M.",
      score: "BITSAT 390/400",
      badge: "Most Improved",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    },
    {
      name: "Rahul K.",
      score: "JEE 99.5 percentile",
      badge: "Consistent Achiever",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    },
  ];

  useEffect(() => {
    // Set loaded state after a small delay to ensure DOM is ready
    setTimeout(() => setIsLoaded(true), 100);

    // Animation on scroll
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-entrance");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.85;
        if (isVisible) {
          el.classList.add("animate-visible");
        }
      });
    };

    // Run once to check initial elements in viewport
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-hero-pattern"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-1/2 bg-purple-100/30 blur-[120px] rounded-full"></div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-purple-gradient mb-6 transition-all duration-700 ${
                  isLoaded ? "opacity-100" : "opacity-0 translate-y-6"
                }`}
              >
                Conquer JEE & BITSAT with Confidence!
              </h1>
              <p
                className={`text-xl text-muted-foreground mb-8 transition-all duration-700 delay-200 ${
                  isLoaded ? "opacity-100" : "opacity-0 translate-y-6"
                }`}
              >
                Join thousands of students who are acing competitive exams with
                our interactive test series, analytics, and personalized
                feedback.
              </p>
              <div
                className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-700 delay-400 ${
                  isLoaded ? "opacity-100" : "opacity-0 translate-y-6"
                }`}
              >
                <Link to="/tests">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brandPurple hover:bg-purple-700 shadow-button btn-glow"
                  >
                    <Rocket className="mr-1 h-4 w-4" />
                    Start Test
                  </Button>
                </Link>
                {loading ? (
                  <Button></Button>
                ) : user ? (
                  <Link
                    to={
                      user.role === "tutor" ? "/tutor/dashboard": user.role === 'admin'? "/admin/dashboard" : "/dashboard"
                    }
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-brandPurple text-brandPurple hover:bg-purple-50 dark:hover:bg-muted shadow-sm"
                    >
                      <Sparkles className="mr-1 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-brandPurple text-brandPurple hover:bg-purple-50 dark:hover:bg-muted shadow-sm"
                    >
                      <Sparkles className="mr-1 h-4 w-4" />
                      Sign Up
                    </Button>
                  </Link>
                )}
              </div>

              {!user && (
                <div className="mt-8">
                  <Link to="/tutor/signup" className="group">
                    <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 px-8 py-4 rounded-2xl shadow-md transform hover:scale-105 transition-all duration-300 border border-green-200">
                      <GraduationCap className="h-8 w-8 text-blue-500 group-hover:text-blue-700 mr-3 transform group-hover:rotate-12 transition-transform duration-300" />
                      <div className="text-left">
                        <p className="text-lg font-semibold text-gray-800">
                          Join as a Tutor
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Empower students to achieve their dreams
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Why Students Love TestBit
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our platform is designed with students in mind, making exam
              preparation effective and engaging
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="animate-entrance">
                  <Card className="h-full hover-lift bg-card-gradient overflow-hidden border-0 shadow-card">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="rounded-full bg-primary/10 w-14 h-14 flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Student Spotlight */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Student Spotlight
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Meet our top performers who achieved their dream scores with
              TestBit
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topPerformers.map((student, index) => (
                <div key={index} className="animate-entrance">
                  <Card className="p-6 text-center hover-lift transition-all duration-300 group border-0 shadow-card overflow-hidden">
                    <div className="relative w-24 mx-auto mb-4">
                      <div className="absolute inset-0 bg-purple-gradient opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-500"></div>
                      <div className="w-24 h-24 mx-auto overflow-hidden rounded-full border-2 border-primary/20">
                        <img
                          src={student.image}
                          alt={student.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">
                      {student.name}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {student.score}
                    </p>
                    <span className="badge badge-purple group-hover:animate-pulse-scale">
                      <Star className="w-3 h-3 mr-1" />
                      {student.badge}
                    </span>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-purple-gradient opacity-95"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to start your success journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Join thousands of students who are improving every day with our
              personalized test series.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-background text-brandPurple hover:bg-gray-100 shadow-button"
                >
                  <Sparkles className="mr-1 h-4 w-4" />
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full bg-transparent sm:w-auto border-white text-white hover:bg-background/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials/Benefits */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Why TestBit Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 animate-entrance p-6 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <TrendingUp className="h-6 w-6 text-brandGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Targeted Practice
                  </h3>
                  <p className="text-muted-foreground">
                    Focus on your weak areas with our smart algorithms that
                    generate personalized test patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-entrance p-6 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <ZapIcon className="h-6 w-6 text-brandGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Real-Time Feedback
                  </h3>
                  <p className="text-muted-foreground">
                    Get instant analysis and detailed solutions after every test
                    to improve faster.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-entrance p-6 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <Check className="h-6 w-6 text-brandGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Progress Tracking
                  </h3>
                  <p className="text-muted-foreground">
                    Monitor your improvement over time with detailed analytics
                    and performance insights.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 animate-entrance p-6 rounded-xl hover:bg-muted transition-colors duration-300">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <Sparkles className="h-6 w-6 text-brandGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Engaging Learning
                  </h3>
                  <p className="text-muted-foreground">
                    Stay motivated with gamification elements like badges,
                    coins, and leaderboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
