import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { usePerformanceAnalytics } from '@/hooks/useDashboard';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const PerformanceChart: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: analytics, isLoading, error } = usePerformanceAnalytics(period);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              {['7d', '30d', '90d'].map((p) => (
                <Skeleton key={p} className="h-8 w-16" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load analytics data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const periodLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Performance Analytics</span>
        </CardTitle>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scores" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scores">Score Trends</TabsTrigger>
            <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [`${value}%`, 'Score']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.averageScore}%
                </div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.bestScore}%
                </div>
                <p className="text-sm text-muted-foreground">Best Score</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.improvement > 0 ? '+' : ''}{analytics.improvement}%
                </div>
                <p className="text-sm text-muted-foreground">Improvement</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Accuracy']}
                  />
                  <Bar 
                    dataKey="accuracy" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">
                  {analytics.strongestSubject}
                </div>
                <p className="text-sm text-muted-foreground">Strongest Subject</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">
                  {analytics.weakestSubject}
                </div>
                <p className="text-sm text-muted-foreground">Needs Improvement</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.timeSpent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}h`}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [`${value} hours`, 'Study Time']}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.totalHours}h
                </div>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.averageSessionTime}m
                </div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.consistency}%
                </div>
                <p className="text-sm text-muted-foreground">Consistency</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
