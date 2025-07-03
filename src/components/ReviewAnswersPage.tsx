import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { formatEquation } from '@/lib/utils';


const ReviewAnswers = ({data}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [filter, setFilter] = useState('all');

  const filteredQuestions = data.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const question = filteredQuestions[currentQuestion];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-500';
      case 'incorrect': return 'bg-red-500';
      case 'skipped': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <Check className="h-4 w-4 text-white" />;
      case 'incorrect': return <X className="h-4 w-4 text-white" />;
      case 'skipped': return <span className="text-white text-sm">—</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'correct' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('correct')}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              Correct
            </Button>
            <Button
              variant={filter === 'incorrect' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('incorrect')}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Incorrect
            </Button>
            <Button
              variant={filter === 'skipped' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('skipped')}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Skipped
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
              {filteredQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium
                    ${currentQuestion === index 
                      ? 'ring-2 ring-brandPurple ring-offset-2' 
                      : ''
                    }
                    ${getStatusColor(q.status)}
                  `}
                >
                  {getStatusIcon(q.status)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">
                  Question {question?.id}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline">{question?.subject}</Badge>
                  <Badge variant="outline">{question?.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {question?.timeSpent > 0 ? `${question.timeSpent}s` : 'Not attempted'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500">
                  {currentQuestion + 1} of {filteredQuestions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQuestion(Math.min(filteredQuestions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === filteredQuestions.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4" dangerouslySetInnerHTML={{ 
                  __html: formatEquation(question?.question || '') 
                }} />
                
                <div className="space-y-3">
                  {question?.options.map((option, index) => {
                    const isCorrect = index === question.correctAnswer;
                    const isUserAnswer = index === question.userAnswer;
                    
                    let bgColor = '';
                    let borderColor = '';
                    let textColor = '';
                    
                    if (isCorrect) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-200';
                      textColor = 'text-green-800';
                    } else if (isUserAnswer && !isCorrect) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-200';
                      textColor = 'text-red-800';
                    } else {
                      bgColor = 'bg-gray-50';
                      borderColor = 'border-gray-200';
                      textColor = 'text-gray-700';
                    }
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor} flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: formatEquation(option) }} />
                        </div>
                        <div className="flex items-center gap-2">
                          {isCorrect && (
                            <Badge className="bg-green-500 text-white">
                              <Check className="h-3 w-3 mr-1" />
                              Correct
                            </Badge>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <Badge className="bg-red-500 text-white">
                              <X className="h-3 w-3 mr-1" />
                              Your Answer
                            </Badge>
                          )}
                          {isUserAnswer && isCorrect && (
                            <Badge className="bg-green-500 text-white">
                              <Check className="h-3 w-3 mr-1" />
                              Your Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {question?.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                  <p className="text-blue-700 text-sm" dangerouslySetInnerHTML={{ 
                    __html: formatEquation(question.explanation) 
                  }} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewAnswers;
