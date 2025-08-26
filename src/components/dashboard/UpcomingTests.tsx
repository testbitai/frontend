import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  BookOpen, 
  Star, 
  Calendar,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useUpcomingTests } from '@/hooks/useDashboard';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const UpcomingTests: React.FC = () => {
  const { data: tests, isLoading, error } = useUpcomingTests(6);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExamTypeColor = (examType: string) => {
    switch (examType.toLowerCase()) {
      case 'jee':
        return 'bg-blue-100 text-blue-800';
      case 'neet':
        return 'bg-purple-100 text-purple-800';
      case 'practice':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-indigo-100 text-indigo-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !tests) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load recommended tests</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recommended Tests</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tests">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recommended tests available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete more tests to get personalized recommendations
              </p>
            </div>
          ) : (
            tests.map((test) => (
              <div 
                key={test._id} 
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-sm line-clamp-1">
                        {test.title}
                      </h3>
                      {test.isRecommended && (
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        </div>
                      )}
                    </div>
                    {test.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {test.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getExamTypeColor(test.examType)}`}
                    >
                      {test.examType}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getDifficultyColor(test.difficulty)}`}
                    >
                      {test.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{test.questionsCount} questions</span>
                    </div>
                  </div>
                  {test.scheduledFor && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(test.scheduledFor), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {test.isRecommended && (
                      <div className="flex items-center space-x-1 text-xs text-yellow-600">
                        <Zap className="h-3 w-3" />
                        <span>Recommended for you</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/tests/${test._id}`}>
                      Start Test
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {tests.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Recommendations based on your performance and study goals
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingTests;
