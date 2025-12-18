'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/date-utils'
import { 
  Users, 
  Calendar, 
  Video, 
  MessageSquare, 
  Trophy, 
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'

interface Cohort {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  maxStudents: number
  currentStudents: number
  isActive: boolean
  course: {
    title: string
    description: string
  }
  mentors: Array<{
    id: string
    name: string
    role: string
  }>
  sessions: Array<{
    id: string
    title: string
    startTime: string
    duration: number
    meetingUrl: string
  }>
  leaderboard: Array<{
    userId: string
    name: string
    points: number
    rank: number
  }>
}

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCohorts()
  }, [])

  const fetchCohorts = async () => {
    try {
      const response = await fetch('/api/cohorts')
      const data = await response.json()
      setCohorts(data.cohorts)
      if (data.cohorts.length > 0) {
        setSelectedCohort(data.cohorts[0])
      }
    } catch (error) {
      console.error('Error fetching cohorts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-gold mx-auto"></div>
          <p className="text-brand-muted-text mt-4">Loading cohorts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-white mb-2">
            Cohort Learning
          </h1>
          <p className="text-brand-muted-text">
            Join a cohort and learn with your peers in a structured, collaborative environment
          </p>
        </div>

        {/* Cohort Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-semibold text-white mb-4">
            Available Cohorts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohorts.map((cohort) => (
              <Card 
                key={cohort.id} 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedCohort?.id === cohort.id 
                    ? 'ring-2 ring-brand-gold scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setSelectedCohort(cohort)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{cohort.name}</CardTitle>
                    <Badge variant={cohort.isActive ? 'default' : 'secondary'}>
                      {cohort.isActive ? 'Active' : 'Upcoming'}
                    </Badge>
                  </div>
                  <CardDescription>{cohort.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-muted-text">Students</span>
                      <span className="text-sm text-white">
                        {cohort.currentStudents}/{cohort.maxStudents}
                      </span>
                    </div>
                    <Progress 
                      value={(cohort.currentStudents / cohort.maxStudents) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-muted-text">Start Date</span>
                      <span className="text-white">
                        {formatDate(cohort.startDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Cohort Details */}
        {selectedCohort && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cohort Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">{selectedCohort.name}</CardTitle>
                    <CardDescription>{selectedCohort.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted-text">Course</span>
                      <span className="text-white">{selectedCohort.course.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted-text">Start Date</span>
                      <span className="text-white">
                        {formatDate(selectedCohort.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted-text">End Date</span>
                      <span className="text-white">
                        {formatDate(selectedCohort.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted-text">Students</span>
                      <span className="text-white">
                        {selectedCohort.currentStudents}/{selectedCohort.maxStudents}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Mentors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Mentors</CardTitle>
                    <CardDescription>Your learning support team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedCohort.mentors.map((mentor) => (
                        <div key={mentor.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
                            <span className="text-brand-black font-bold">
                              {mentor.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{mentor.name}</p>
                            <p className="text-brand-muted-text text-sm">{mentor.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Join Discussion
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Meet Cohort
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Live Sessions</CardTitle>
                  <CardDescription>Upcoming live sessions for this cohort</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedCohort.sessions.map((session) => (
                      <div key={session.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-brand-muted-text">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(session.startTime)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {new Date(session.startTime).toLocaleTimeString()}
                              </div>
                              <div className="flex items-center">
                                <Video className="h-4 w-4 mr-1" />
                                {session.duration} minutes
                              </div>
                            </div>
                          </div>
                          <Button>
                            <Video className="mr-2 h-4 w-4" />
                            Join Session
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Cohort Leaderboard</CardTitle>
                  <CardDescription>See how you rank among your peers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCohort.leaderboard.map((student, index) => (
                      <div key={student.userId} className="flex items-center justify-between p-3 bg-brand-dark-surface rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-brand-gold rounded-full">
                            <span className="text-brand-black font-bold text-sm">
                              {student.rank}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{student.name}</p>
                            <p className="text-brand-muted-text text-sm">{student.points} points</p>
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="flex items-center">
                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                            {index === 1 && <Award className="h-5 w-5 text-gray-400" />}
                            {index === 2 && <Award className="h-5 w-5 text-amber-600" />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Cohort Resources</CardTitle>
                  <CardDescription>Shared resources and materials for this cohort</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Course Materials</h3>
                      <p className="text-brand-muted-text text-sm mb-4">
                        Access all course materials and resources
                      </p>
                      <Button variant="outline" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Materials
                      </Button>
                    </div>
                    
                    <div className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Discord Community</h3>
                      <p className="text-brand-muted-text text-sm mb-4">
                        Join the cohort Discord channel
                      </p>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Join Discord
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}


