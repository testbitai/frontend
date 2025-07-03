
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, BookOpen, Flame, BarChart, Star, Calendar } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  console.log(user)
  // Mock data
  const userData = {
    name: 'Ashadu',
    streak: 5,
    avatarImage: '/placeholder.svg',
    progress: {
      physics: 65,
      chemistry: 42,
      mathematics: 78
    },
    testsTaken: 23,
    averageScore: 76,
    coins: 450,
    badges: [
      { id: 1, name: 'First Test', icon: BookOpen },
      { id: 2, name: 'High Scorer', icon: Star },
      { id: 3, name: '5-Day Streak', icon: Flame }
    ],
    recentTests: [
      { id: 1, title: 'JEE Full Mock', score: 78, date: '2025-03-12' },
      { id: 2, title: 'Physics: Electrostatics', score: 92, date: '2025-03-08' },
      { id: 3, title: 'Math Blitz', score: 85, date: '2025-03-05' }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-foreground">
                  Hey {user.name}!
                </h1>
                <div className="ml-2 animate-wave origin-bottom-right">
                  <span role="img" aria-label="waving hand" className="text-3xl">👋</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex items-center text-orange-500 mr-3">
                  <Flame className="h-5 w-5 mr-1" />
                  <span className="font-medium">Streak: {user.streak.count} days</span>
                </div>
                <div className="flex items-center text-indigo-500">
                  <Award className="h-5 w-5 mr-1" />
                  <span className="font-medium">{userData.testsTaken} Tests Taken</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-background p-2 rounded-full border border-gray-200 dark:border-gray-800 mr-3">
                <img src={user.avatar} alt="User avatar" className="w-12 h-12 rounded-full" />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="text-amber-500 mr-1">
                    <Star className="h-4 w-4 inline" />
                  </span>
                  <span className="font-medium">{user.coins} Coins</span>
                </div>
                <Link to="/rewards" className="text-sm text-brandPurple hover:underline">
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Progress & Quick Links */}
            <div className="space-y-6">
              <Card className="p-5">
                <h2 className="text-xl font-semibold mb-4">Study Progress</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Physics</span>
                      <span className="text-sm text-gray-500">{userData.progress.physics}%</span>
                    </div>
                    <Progress value={userData.progress.physics} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Chemistry</span>
                      <span className="text-sm text-gray-500">{userData.progress.chemistry}%</span>
                    </div>
                    <Progress value={userData.progress.chemistry} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Mathematics</span>
                      <span className="text-sm text-gray-500">{userData.progress.mathematics}%</span>
                    </div>
                    <Progress value={userData.progress.mathematics} className="h-2" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-5">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/tests">
                    <Button variant="outline" className="w-full h-auto py-3 px-4 justify-start">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>Full Tests</span>
                    </Button>
                  </Link>
                  
                  <Link to="/tests?type=chapter">
                    <Button variant="outline" className="w-full h-auto py-3 px-4 justify-start">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>Chapter Tests</span>
                    </Button>
                  </Link>
                  
                  <Link to="/tests?type=daily">
                    <Button variant="outline" className="w-full h-auto py-3 px-4 justify-start">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Daily Quiz</span>
                    </Button>
                  </Link>
                  
                  <Link to="/events">
                    <Button variant="outline" className="w-full h-auto py-3 px-4 justify-start">
                      <Award className="h-5 w-5 mr-2" />
                      <span>Events</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
            
            {/* Middle column - Recent Tests & Analytics */}
            <div className="space-y-6">
              <Card className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Tests</h2>
                  <Link to="/tests/history" className="text-sm text-brandPurple hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {userData.recentTests.map(test => (
                    <div key={test.id} className="flex items-center p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{test.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(test.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          test.score > 80 ? 'text-green-600' : 
                          test.score > 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {test.score}%
                        </div>
                        <Link to={`/tests/review/${test.id}`} className="text-xs text-brandPurple hover:underline">
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link to="/tests">
                    <Button className="w-full">Take a New Test</Button>
                  </Link>
                </div>
              </Card>
              
              <Card className="p-5">
                <h2 className="text-xl font-semibold mb-4">Daily Tip</h2>
                <div className="p-4 bg-muted border-l-4 border-brandPurple rounded-r-lg">
                  <p className="italic">
                    "Tackle Physics today! Your recent tests show you're making great progress in electrostatics."
                  </p>
                  <div className="mt-3 text-right">
                    <Link to="/tests?subject=physics&topic=electrostatics">
                      <Button variant="outline" size="sm">Practice Now</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right column - Performance & Achievements */}
            <div className="space-y-6">
              <Card className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Performance</h2>
                  <Link to="/analytics" className="text-sm text-brandPurple hover:underline">
                    <BarChart className="h-4 w-4 inline mr-1" />
                    Detailed Analytics
                  </Link>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e6e6e6" 
                        strokeWidth="10" 
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#8B5CF6" 
                        strokeWidth="10" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * userData.averageScore / 100)} 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-2xl font-bold block">{userData.averageScore}%</span>
                        <span className="text-xs text-gray-500">Avg. Score</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-forground text-center">
                    <p>Based on your last {userData.testsTaken} tests</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Your Achievements</h2>
                  <Link to="/profile/badges" className="text-sm text-brandPurple hover:underline">
                    View All
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {userData.badges.map(badge => (
                    <div key={badge.id} className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                        <badge.icon className="h-5 w-5 text-brandPurple" />
                      </div>
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center text-center p-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
                      <Plus className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">More to unlock</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

// Inline Plus icon component since it wasn't imported
const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default Dashboard;
