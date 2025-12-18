'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Send,
  Filter,
  Search
} from 'lucide-react';

// Mock data - in production this would come from API
const mockKPIs = {
  dau: 1247,
  mau: 8934,
  enrollments: 156,
  completionRate: 0.73,
  quizPassRate: 0.89,
  assignmentBacklog: 23,
  avgTimeToFirstLesson: 2.4,
  churn: 0.12,
  refundRate: 0.03,
  affiliateConversions: 45,
  revenue: 89450,
  errorRate: 0.001,
  webhookQueueDepth: 3,
  discordBotStatus: 'connected',
  sloCompliance: 0.99
};

const mockCohorts = [
  {
    id: '1',
    name: 'AI Mastery Cohort 1',
    students: 45,
    attendance: 0.87,
    avgScore: 4.2,
    upcomingSessions: 2,
    status: 'active'
  },
  {
    id: '2',
    name: 'AI Mastery Cohort 2',
    students: 38,
    attendance: 0.92,
    avgScore: 4.5,
    upcomingSessions: 1,
    status: 'active'
  }
];

const mockStudents = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    discordStatus: 'linked',
    role: 'STUDENT',
    cohort: 'AI Mastery Cohort 1',
    progress: 0.73,
    streak: 12,
    lastActivity: '2 hours ago',
    flags: []
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    discordStatus: 'pending',
    role: 'STUDENT',
    cohort: 'AI Mastery Cohort 1',
    progress: 0.45,
    streak: 5,
    lastActivity: '1 day ago',
    flags: ['inactive']
  }
];

const mockAssignments = [
  {
    id: '1',
    title: 'AI Agent Development',
    student: 'John Doe',
    status: 'waiting_review',
    submittedAt: '2024-01-15T10:30:00Z',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Prompt Engineering Project',
    student: 'Jane Smith',
    status: 'in_revision',
    submittedAt: '2024-01-14T15:45:00Z',
    priority: 'medium'
  }
];

export default function OpsConsole() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive': return <Badge variant="destructive">Inactive</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-brand-gold mb-2">Student Ops Console</h1>
            <p className="text-brand-muted-text">Monitor, manage, and optimize the learning platform</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Last Refresh */}
        <div className="text-sm text-brand-muted-text mb-6">
          Last updated: {lastRefresh.toLocaleString()}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-brand-dark-surface">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-brand-dark-surface border-brand-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                  <Users className="h-4 w-4 text-brand-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-gold">{mockKPIs.dau.toLocaleString()}</div>
                  <p className="text-xs text-brand-muted-text">+12% from last week</p>
                </CardContent>
              </Card>

              <Card className="bg-brand-dark-surface border-brand-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <BookOpen className="h-4 w-4 text-brand-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-gold">{(mockKPIs.completionRate * 100).toFixed(1)}%</div>
                  <Progress value={mockKPIs.completionRate * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-brand-dark-surface border-brand-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-brand-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-gold">${mockKPIs.revenue.toLocaleString()}</div>
                  <p className="text-xs text-brand-muted-text">+8% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-brand-dark-surface border-brand-gold/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">99.9%</div>
                  <p className="text-xs text-brand-muted-text">Uptime</p>
                </CardContent>
              </Card>
            </div>

            {/* Cohort Health */}
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Cohort Health</CardTitle>
                <CardDescription>Real-time status of active cohorts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCohorts.map((cohort) => (
                    <div key={cohort.id} className="flex items-center justify-between p-4 bg-brand-black/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(cohort.status)}`} />
                        <div>
                          <h3 className="font-semibold">{cohort.name}</h3>
                          <p className="text-sm text-brand-muted-text">{cohort.students} students</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Attendance</p>
                          <p className="font-semibold">{(cohort.attendance * 100).toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Avg Score</p>
                          <p className="font-semibold">{cohort.avgScore}/5</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Sessions</p>
                          <p className="font-semibold">{cohort.upcomingSessions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">System Health</CardTitle>
                <CardDescription>Infrastructure and service status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">0.1%</div>
                    <p className="text-sm text-brand-muted-text">Error Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">3</div>
                    <p className="text-sm text-brand-muted-text">Webhook Queue</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">Connected</div>
                    <p className="text-sm text-brand-muted-text">Discord Bot</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">99%</div>
                    <p className="text-sm text-brand-muted-text">SLO Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-brand-gold">Student Management</CardTitle>
                    <CardDescription>Monitor and manage student accounts</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-brand-black/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                          <span className="text-brand-black font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-brand-muted-text">{student.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(student.discordStatus)}
                            {student.flags.length > 0 && (
                              <Badge variant="destructive">Flagged</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Progress</p>
                          <p className="font-semibold">{(student.progress * 100).toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Streak</p>
                          <p className="font-semibold">{student.streak} days</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-brand-muted-text">Last Activity</p>
                          <p className="font-semibold">{student.lastActivity}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Assignment Queue</CardTitle>
                <CardDescription>Review and grade student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-brand-black/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-brand-muted-text">Submitted by {assignment.student}</p>
                          <p className="text-xs text-brand-muted-text">
                            {new Date(assignment.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={assignment.priority === 'high' ? 'destructive' : 'secondary'}>
                          {assignment.priority}
                        </Badge>
                        <Button size="sm" className="bg-brand-gold text-brand-black hover:bg-brand-gold/90">
                          Grade
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="quizzes">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Quiz Analytics</CardTitle>
                <CardDescription>Question analysis and integrity monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted-text">Quiz analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cohorts">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Cohort Management</CardTitle>
                <CardDescription>Manage live sessions and cohort activities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted-text">Cohort management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Revenue Analytics</CardTitle>
                <CardDescription>Track affiliate performance and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted-text">Revenue analytics coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Webhook Monitoring</CardTitle>
                <CardDescription>Monitor webhook delivery and retry failed events</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted-text">Webhook monitoring coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="bg-brand-dark-surface border-brand-gold/20">
              <CardHeader>
                <CardTitle className="text-brand-gold">Moderation Dashboard</CardTitle>
                <CardDescription>Review reports and apply moderation actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-brand-muted-text">Moderation dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


