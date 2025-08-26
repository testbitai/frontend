import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Award, 
  BookOpen, 
  Flame, 
  BarChart, 
  Star, 
  Calendar,
  TrendingUp,
  Coins,
  Target,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useCurrentUser } from '@/hooks/useUser';
import { usePrefetchDashboardData } from '@/hooks/useDashboard';

// Import dynamic components
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivities from '@/components/dashboard/RecentActivities';
import SubjectProgress from '@/components/dashboard/SubjectProgress';
import UpcomingTests from '@/components/dashboard/UpcomingTests';
import StudyStreak from '@/components/dashboard/StudyStreak';

const Dashboard = () => {
  const { user: authUser } = useAuthStore();
  const { data: user, isLoading: userLoading, refetch: refetchUser } = useCurrentUser();
  const prefetchDashboardData = usePrefetchDashboardData();

  // Prefetch dashboard data on component mount
  useEffect(() => {
    prefetchDashboardData();
  }, [prefetchDashboardData]);

  const handleRefresh = () => {
    refetchUser();
    // This will trigger a refetch of all dashboard data due to cache invalidation
    window.location.reload();
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8 bg-muted">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayUser = user || authUser;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 bg-muted">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Hey {displayUser?.name || 'Student'}! 👋
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Ready to continue your learning journey?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {displayUser?.coins !== undefined && (
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-lg">
                  <Coins className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    {displayUser.coins} coins
                  </span>
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Button asChild>
                <Link to="/tests">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Tests
                </Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Activities and Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activities */}
              <RecentActivities />
              
              {/* Subject Progress */}
              <SubjectProgress />
            </div>

            {/* Right Column - Streak and Tests */}
            <div className="space-y-6">
              {/* Study Streak */}
              <StudyStreak />
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/test-history">
                        <BarChart className="h-4 w-4 mr-2" />
                        View Test History
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/rewards">
                        <Award className="h-4 w-4 mr-2" />
                        Redeem Rewards
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/support">
                        <Target className="h-4 w-4 mr-2" />
                        Get Help
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recommended Tests */}
          <div className="mb-8">
            <UpcomingTests />
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Performance Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900">Study Time</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Track your daily study hours and maintain consistency
                  </p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link to="/analytics">View Analytics</Link>
                  </Button>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900">Goals</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Set and track your learning goals to stay motivated
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Set Goals
                  </Button>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-purple-900">Achievements</h3>
                  <p className="text-sm text-purple-700 mt-1">
                    Unlock badges and celebrate your learning milestones
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Badges
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
