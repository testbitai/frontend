import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  BarChart, 
  PieChart, 
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
  Award,
  RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';

interface TopicAnalysis {
  topic: string;
  subject: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

interface AIRecommendation {
  type: 'strength' | 'weakness' | 'time_management' | 'strategy';
  subject?: string;
  topic?: string;
  title: string;
  description: string;
  actionItems: string[];
  priority: 'High' | 'Medium' | 'Low';
}

interface DetailedAIAnalysis {
  overallPerformance: {
    grade: string;
    percentile: number;
    strengths: string[];
    weaknesses: string[];
  };
  topicAnalysis: TopicAnalysis[];
  recommendations: AIRecommendation[];
  studyPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  conceptualInsights: {
    masteredConcepts: string[];
    strugglingConcepts: string[];
    conceptConnections: string[];
  };
  timeManagementAnalysis: {
    efficiency: number;
    pacing: 'Too Fast' | 'Optimal' | 'Too Slow';
    recommendations: string[];
  };
}

interface AIDetailedAnalysisProps {
  testAttemptId: string;
}

const AIDetailedAnalysis: React.FC<AIDetailedAnalysisProps> = ({ testAttemptId }) => {
  const [analysis, setAnalysis] = useState<DetailedAIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAIAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/test/ai-analysis/${testAttemptId}`);
      setAnalysis(response.data.data);
      
      toast({
        title: "AI Analysis Generated",
        description: "Your personalized analysis is ready!",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to generate AI analysis';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testAttemptId) {
      fetchAIAnalysis();
    }
  }, [testAttemptId]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Average': return 'text-yellow-600 bg-yellow-100';
      case 'Needs Improvement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'strength': return <TrendingUp className="h-4 w-4" />;
      case 'weakness': return <TrendingDown className="h-4 w-4" />;
      case 'time_management': return <Clock className="h-4 w-4" />;
      case 'strategy': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
              <CardTitle>Generating AI Analysis...</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={fetchAIAnalysis} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  // Prepare radar chart data for subject performance
  const radarData = analysis.topicAnalysis.reduce((acc, topic) => {
    const existing = acc.find(item => item.subject === topic.subject);
    if (existing) {
      existing.accuracy = (existing.accuracy + topic.accuracy) / 2;
    } else {
      acc.push({
        subject: topic.subject,
        accuracy: topic.accuracy,
      });
    }
    return acc;
  }, [] as { subject: string; accuracy: number }[]);

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-purple-900">AI-Powered Analysis</CardTitle>
                <p className="text-sm text-purple-700 mt-1">
                  Personalized insights generated by advanced AI
                </p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              Grade: {analysis.overallPerformance.grade}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analysis.overallPerformance.percentile}th
              </div>
              <div className="text-sm text-gray-600">Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analysis.overallPerformance.strengths.length}
              </div>
              <div className="text-sm text-gray-600">Strong Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analysis.overallPerformance.weaknesses.length}
              </div>
              <div className="text-sm text-gray-600">Focus Areas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="time-management">Time Analysis</TabsTrigger>
        </TabsList>

        {/* Topic Analysis Tab */}
        <TabsContent value="topics" className="space-y-6">
          {/* Subject Performance Radar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-blue-500" />
                Subject Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Accuracy"
                      dataKey="accuracy"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Topic-wise Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-500" />
                Topic-wise Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.topicAnalysis.map((topic, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{topic.topic}</h4>
                        <p className="text-sm text-gray-600">{topic.subject}</p>
                      </div>
                      <Badge className={getPerformanceColor(topic.performance)}>
                        {topic.performance}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="font-medium">{topic.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={topic.accuracy} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Questions: {topic.questionsAttempted}</div>
                      <div>Avg Time: {topic.averageTime.toFixed(0)}s</div>
                      <div>Correct: {topic.correctAnswers}</div>
                      <div>Level: {topic.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysis.recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRecommendationIcon(rec.type)}
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </div>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority}
                    </Badge>
                  </div>
                  {rec.subject && (
                    <Badge variant="outline" className="w-fit">
                      {rec.subject}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{rec.description}</p>
                  <div>
                    <h5 className="font-medium mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Action Items:
                    </h5>
                    <ul className="space-y-1">
                      {rec.actionItems.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Study Plan Tab */}
        <TabsContent value="study-plan" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Zap className="h-5 w-5 mr-2" />
                  Immediate (1-2 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.studyPlan.immediate.map((task, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {task}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  Short-term (1-2 weeks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.studyPlan.shortTerm.map((task, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {task}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Award className="h-5 w-5 mr-2" />
                  Long-term (1-2 months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.studyPlan.longTerm.map((task, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {task}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conceptual Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mastered Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.conceptualInsights.masteredConcepts.map((concept, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Struggling Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.conceptualInsights.strugglingConcepts.map((concept, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                Concept Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.conceptualInsights.conceptConnections.map((connection, index) => (
                  <li key={index} className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm">{connection}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Management Tab */}
        <TabsContent value="time-management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Efficiency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analysis.timeManagementAnalysis.efficiency.toFixed(0)}%
                  </div>
                  <Progress value={analysis.timeManagementAnalysis.efficiency} className="mb-2" />
                  <p className="text-sm text-gray-600">Time Efficiency</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Pacing Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge 
                    className={`text-lg px-4 py-2 ${
                      analysis.timeManagementAnalysis.pacing === 'Optimal' 
                        ? 'bg-green-100 text-green-800'
                        : analysis.timeManagementAnalysis.pacing === 'Too Fast'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {analysis.timeManagementAnalysis.pacing}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">Current Pacing</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.timeManagementAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <Clock className="h-3 w-3 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDetailedAnalysis;
