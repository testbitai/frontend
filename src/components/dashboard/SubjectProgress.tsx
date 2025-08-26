import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { useSubjectProgress } from '@/hooks/useDashboard';

const SubjectProgress: React.FC = () => {
  const { data: subjects, isLoading, error } = useSubjectProgress();

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0) return TrendingUp;
    if (improvement < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-500';
    if (improvement < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !subjects) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load subject progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No subject data available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete some tests to see your progress
              </p>
            </div>
          ) : (
            subjects.map((subject, index) => {
              const TrendIcon = getTrendIcon(subject.improvement);
              const trendColor = getTrendColor(subject.improvement);
              const accuracyColor = getAccuracyColor(subject.accuracy);
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium capitalize">{subject.subject}</h3>
                      <div className="flex items-center space-x-1">
                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                        {subject.improvement !== 0 && (
                          <span className={`text-xs ${trendColor}`}>
                            {subject.improvement > 0 ? '+' : ''}{subject.improvement.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={accuracyColor}>
                      {subject.accuracy.toFixed(1)}% accuracy
                    </Badge>
                  </div>
                  
                  <Progress 
                    value={subject.accuracy} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {subject.correctAnswers}/{subject.totalQuestions} correct
                    </span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Avg: {formatTime(subject.averageTime)}</span>
                    </div>
                  </div>
                  
                  {/* Progress bar for questions attempted */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Questions Attempted</span>
                      <span>{subject.totalQuestions} total</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (subject.totalQuestions / 100) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {subjects.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Keep practicing to improve your accuracy!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectProgress;
