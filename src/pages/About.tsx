import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Award, BookOpen, Users, Heart, Code, ArrowRight, ArrowLeft } from 'lucide-react';

const teamMembers = [
  {
    name: 'Aryan Kumar',
    role: 'Test Wizard',
    image: '/placeholder.svg',
    bio: 'Former JEE topper who creates tests that challenge students to achieve their best.'
  },
  {
    name: 'Priya Sharma',
    role: 'Content Strategist',
    image: '/placeholder.svg',
    bio: 'Curriculum expert with 8 years of experience in educational content development.'
  },
  {
    name: 'Dr. Rajesh Verma',
    role: 'Academic Director',
    image: '/placeholder.svg',
    bio: 'PhD in Physics with a passion for making complex concepts accessible to students.'
  },
  {
    name: 'Meera Patel',
    role: 'Student Success Coach',
    image: '/placeholder.svg',
    bio: 'Helps students optimize their study strategies and overcome academic challenges.'
  }
];

const successStories = [
  {
    student: 'Chinmaya S.',
    achievement: 'Improved from 65% to 92% in Physics',
    quote: 'The targeted test series and analytics helped me identify my weak areas and focus my preparation where it mattered most.',
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    college: 'IIT Bombay'
  },
  {
    student: 'Priya M.',
    achievement: 'Ranked in top 1% in JEE Mains',
    quote: 'The daily quizzes kept me consistent, and the comprehensive mock tests prepared me perfectly for the real exam.',
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    college: 'IIT Delhi'
  },
  {
    student: 'Zara M.',
    achievement: 'Secured BITSAT Scholarship',
    quote: 'The adaptive test series identified patterns in my mistakes that even my teachers missed. Game-changer!',
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300&q=80",
    college: 'BITS Pilani'
  }
];

const About = () => {
  const [activeStory, setActiveStory] = useState(0);
  const [visible, setVisible] = useState<string[]>([]);
  
  // Animation for text reveals
  useEffect(() => {
    const sections = ['mission', 'approach', 'team', 'stories'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !visible.includes(entry.target.id)) {
          setVisible(prev => [...prev, entry.target.id]);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    
    return () => sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.unobserve(element);
    });
  }, [visible]);
  
  const nextStory = () => {
    setActiveStory(prev => (prev + 1) % successStories.length);
  };
  
  const prevStory = () => {
    setActiveStory(prev => (prev - 1 + successStories.length) % successStories.length);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 md:py-24">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/30"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About TestBit</h1>
              <p className="text-xl md:text-2xl opacity-90">Empowering students to excel with confidence and joy</p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section id="mission" className={`py-16 bg-background ${visible.includes('mission') ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
             
              <p className="text-muted-foreground text-lg mb-6">
                TestBit is dedicated to helping students excel in competitive exams like JEE, BITSAT, NEET and more. Our expertly crafted test series simulate real exam conditions, providing you with the practice and insights needed to succeed.


              </p>
              <p className="text-muted-foreground text-lg">
                Founded by a team of educators and tech enthusiasts, we combine cutting-edge analytics with high-quality content to empower students across India.
              </p>
            </div>
          </div>
        </section>
        
        {/* Approach Section with Cards */}
        <section id="approach" className={`py-16 bg-muted ${visible.includes('approach') ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Approach</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-t-brandPurple">
                <div className="p-6">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-brandPurple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Comprehensive Testing</h3>
                  <p className="text-muted-forgroud">
                    Our tests are meticulously crafted by top educators to cover the entire syllabus with the right mix of conceptual and application-based questions.
                  </p>
                </div>
              </Card>
              
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-t-brandIndigo">
                <div className="p-6">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-brandIndigo" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Rewarding Progress</h3>
                  <p className="text-muted-forgroud">
                    We transform study habits through gamification, rewarding consistency and achievement with badges, coins, and recognition.
                  </p>
                </div>
              </Card>
              
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-t-brandGreen">
                <div className="p-6">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-brandGreen" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
                  <p className="text-muted-forgroud">
                    Our adaptive technology identifies each student's strengths and areas for improvement, creating a customized learning path.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Success Stories Carousel */}
        <section id="stories" className={`py-16 bg-gradient-to-br from-purple-50 dark:from-muted to-indigo-50 dark:to-background ${visible.includes('stories') ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Student Success Stories</h2>
            
            <div className="max-w-4xl mx-auto relative">
              <div className="bg-background rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    <AspectRatio ratio={1/1} className="md:h-full">
                      <img 
                        src={successStories[activeStory].image} 
                        alt={successStories[activeStory].student}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white md:hidden">
                        <h3 className="font-bold text-lg">{successStories[activeStory].student}</h3>
                        <p>{successStories[activeStory].college}</p>
                      </div>
                    </AspectRatio>
                  </div>
                  
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="hidden md:block mb-4">
                      <h3 className="font-bold text-xl text-foreground">{successStories[activeStory].student}</h3>
                      <p className="text-brandPurple font-medium">{successStories[activeStory].college}</p>
                    </div>
                    
                    <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-900">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mb-3">
                        {successStories[activeStory].achievement}
                      </Badge>
                      <blockquote className="text-muted-foreground italic">
                        "{successStories[activeStory].quote}"
                      </blockquote>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {activeStory + 1} of {successStories.length}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={prevStory}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextStory}>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section id="team" className={`py-16 bg-background ${visible.includes('team') ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
                  <div className="relative h-56">
                    <AspectRatio ratio={3/4}>
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-purple-200">{member.role}</p>
                      </div>
                    </AspectRatio>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-muted-forgroud text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 bg-gradient-to-r from-brandIndigo to-brandPurple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Excel in Your Exams?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are achieving their academic dreams with our test series.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-background text-brandPurple hover:bg-background/90">
                Sign Up Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-background/20">
                Explore Tests
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
