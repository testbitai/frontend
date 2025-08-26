import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Users,
  BookOpen,
  Zap
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';

const DashboardStats: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Tests Completed",
      value: stats.testsCompleted,
      total: stats.totalTests,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: `${stats.totalTests - stats.testsCompleted} remaining`
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `Best: ${stats.bestScore}%`,
      trend: stats.averageScore >= 75 ? "up" : stats.averageScore >= 50 ? "stable" : "down"
    },
    {
      title: "Study Streak",
      value: stats.streak,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: `${stats.streak} days in a row`,
      badge: stats.streak >= 7 ? "🔥 Hot Streak!" : undefined
    },
    {
      title: "Rank",
      value: `#${stats.rank}`,
      icon: Trophy,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: `of ${stats.totalStudents} students`,
      trend: "up" // Assuming rank improvement is good
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    {stat.total && (
                      <span className="text-sm text-muted-foreground ml-1">
                        /{stat.total}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </div>
                {stat.trend && (
                  <div className="flex items-center">
                    <TrendingUp 
                      className={`h-4 w-4 ${
                        stat.trend === 'up' ? 'text-green-500' : 
                        stat.trend === 'down' ? 'text-red-500 rotate-180' : 
                        'text-gray-400'
                      }`} 
                    />
                  </div>
                )}
              </div>
              {stat.badge && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {stat.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
