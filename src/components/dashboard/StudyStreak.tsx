import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';
import { useStudyStreak } from '@/hooks/useDashboard';
import { format, subDays, isToday, parseISO } from 'date-fns';

const StudyStreak: React.FC = () => {
  const { data: streak, isLoading, error } = useStudyStreak();

  const generateStreakCalendar = () => {
    if (!streak) return [];
    
    const today = new Date();
    const days = [];
    
    // Generate last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Check if this date has activity
      const hasActivity = streak.streakHistory.some(
        history => format(parseISO(history.date), 'yyyy-MM-dd') === dateStr
      );
      
      days.push({
        date,
        dateStr,
        hasActivity,
        isToday: isToday(date),
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd')
      });
    }
    
    return days;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5" />
            <span>Study Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <Skeleton className="h-12 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(14)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !streak) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5" />
            <span>Study Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load streak data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const streakDays = generateStreakCalendar();
  const streakEmoji = streak.currentStreak >= 30 ? '🔥' : 
                     streak.currentStreak >= 14 ? '⚡' : 
                     streak.currentStreak >= 7 ? '🌟' : '💪';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Study Streak</span>
          </div>
          {streak.currentStreak > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {streakEmoji} Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {streak.currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">
              {streak.currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
            {streak.currentStreak > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Keep it up! 🎯
              </p>
            )}
          </div>

          {/* Streak Calendar */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Last 14 Days</span>
            </h4>
            
            <div className="grid grid-cols-7 gap-2">
              {streakDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.dayName}
                  </div>
                  <div 
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                      ${day.hasActivity 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-400'
                      }
                      ${day.isToday ? 'ring-2 ring-orange-300' : ''}
                    `}
                  >
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Best Streak</span>
              </div>
              <div className="text-lg font-bold text-yellow-600">
                {streak.longestStreak}
              </div>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">This Week</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {streak.streakHistory
                  .filter(h => {
                    const historyDate = parseISO(h.date);
                    const weekAgo = subDays(new Date(), 7);
                    return historyDate >= weekAgo;
                  })
                  .length
                }
              </div>
              <p className="text-xs text-muted-foreground">days active</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="text-center pt-4 border-t">
            {streak.currentStreak === 0 ? (
              <p className="text-sm text-muted-foreground">
                Start your streak today! Complete a test to begin. 🚀
              </p>
            ) : streak.currentStreak < 7 ? (
              <p className="text-sm text-muted-foreground">
                {7 - streak.currentStreak} more days to reach a week streak! 💪
              </p>
            ) : streak.currentStreak < 30 ? (
              <p className="text-sm text-muted-foreground">
                Amazing! {30 - streak.currentStreak} more days for a month streak! 🔥
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Incredible dedication! You're on fire! 🔥🔥🔥
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyStreak;
