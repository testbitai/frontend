import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Target, Clock, BarChart, PieChart } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';

// Mock detailed analysis data
const analysisData = {
  accuracyTrend: [
    { question: 1, accuracy: 100 },
    { question: 5, accuracy: 80 },
    { question: 10, accuracy: 90 },
    { question: 15, accuracy: 70 },
    { question: 20, accuracy: 85 },
    { question: 25, accuracy: 75 },
    { question: 30, accuracy: 80 }
  ],
  timeSpentTrend: [
    { question: 1, time: 30 },
    { question: 5, time: 45 },
    { question: 10, time: 60 },
    { question: 15, time: 120 },
    { question: 20, time: 90 },
    { question: 25, time: 75 },
    { question: 30, time: 40 }
  ],
  subjectComparison: [
    {
      subject: 'Physics',
      attempted: 28,
      correct: 22,
      avgTime: 78,
      difficulty: 'Hard',
      improvement: '+5%'
    },
    {
      subject: 'Chemistry',
      attempted: 30,
      correct: 24,
      avgTime: 65,
      difficulty: 'Medium',
      improvement: '+8%'
    },
    {
      subject: 'Mathematics',
      attempted: 27,
      correct: 24,
      avgTime: 85,
      difficulty: 'Hard',
      improvement: '-2%'
    }
  ],
  conceptAnalysis: [
    { concept: 'Mechanics', strength: 85, questions: 12, avgTime: 65 },
    { concept: 'Thermodynamics', strength: 70, questions: 8, avgTime: 90 },
    { concept: 'Electromagnetism', strength: 60, questions: 10, avgTime: 105 },
    { concept: 'Organic Chemistry', strength: 75, questions: 15, avgTime: 70 },
    { concept: 'Inorganic Chemistry', strength: 80, questions: 10, avgTime: 60 },
    { concept: 'Calculus', strength: 90, questions: 18, avgTime: 55 },
    { concept: 'Algebra', strength: 85, questions: 12, avgTime: 50 }
  ]
};

const DetailedAnalysis = () => {
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrengthBg = (strength: number) => {
    if (strength >= 80) return 'bg-green-100';
    if (strength >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Accuracy Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData.accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your accuracy remained consistent throughout the test with minor fluctuations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-purple-500" />
              Time Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysisData.timeSpentTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="time" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You spent more time on questions 10-20, indicating challenging concepts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-green-500" />
            Subject-wise Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Attempted</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Avg. Time</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Improvement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisData.subjectComparison.map((subject, index) => {
                const accuracy = Math.round((subject.correct / subject.attempted) * 100);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.attempted}</TableCell>
                    <TableCell>{subject.correct}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={getStrengthColor(accuracy)}>{accuracy}%</span>
                        <Progress value={accuracy} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{subject.avgTime}s</TableCell>
                    <TableCell>
                      <Badge 
                        variant={subject.difficulty === 'Hard' ? 'destructive' : 
                                subject.difficulty === 'Medium' ? 'default' : 'secondary'}
                      >
                        {subject.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={subject.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {subject.improvement}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Concept-wise Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-500" />
            Concept-wise Strength Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisData.conceptAnalysis.map((concept, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getStrengthBg(concept.strength)}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{concept.concept}</h4>
                  <span className={`text-lg font-bold ${getStrengthColor(concept.strength)}`}>
                    {concept.strength}%
                  </span>
                </div>
                <Progress value={concept.strength} className="mb-2" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{concept.questions} questions</span>
                  <span>{concept.avgTime}s avg</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-red-600 mb-3 flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
                Areas to Focus On
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Electromagnetism:</strong> Practice more numerical problems on electromagnetic induction and waves.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Time Management:</strong> Work on solving complex problems faster, especially in Mathematics.
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-green-600 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Strengths to Maintain
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Calculus:</strong> Excellent performance! Continue practicing to maintain this strength.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <strong>Mechanics:</strong> Strong foundation in physics mechanics problems.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedAnalysis;
