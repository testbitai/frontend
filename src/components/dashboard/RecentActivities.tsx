import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  Award, 
  Flame, 
  Star, 
  Clock,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { useRecentActivities, useMarkActivityAsRead } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const RecentActivities: React.FC = () => {
  const { data: activities, isLoading, error } = useRecentActivities(8);
  const markAsReadMutation = useMarkActivityAsRead();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_completed':
        return CheckCircle;
      case 'reward_earned':
        return Award;
      case 'badge_unlocked':
        return Star;
      case 'streak_milestone':
        return Flame;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test_completed':
        return 'text-green-600 bg-green-50';
      case 'reward_earned':
        return 'text-blue-600 bg-blue-50';
      case 'badge_unlocked':
        return 'text-yellow-600 bg-yellow-50';
      case 'streak_milestone':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleMarkAsRead = (activityId: string) => {
    markAsReadMutation.mutate(activityId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load recent activities</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activities</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recent activities</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete a test to see your activities here
                </p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colorClasses = getActivityColor(activity.type);
                
                return (
                  <div 
                    key={activity._id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${colorClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium truncate">
                          {activity.title}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {activity.score && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.score}%
                            </Badge>
                          )}
                          {activity.coins && (
                            <Badge variant="outline" className="text-xs">
                              +{activity.coins} coins
                            </Badge>
                          )}
                        </div>
                        
                        {activity.testId && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/tests/${activity.testId}/results`}>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
        
        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/activity-history">
                View All Activities
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
