'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Project {
  id: string;
  name: string;
  description: string;
  isOwner: boolean;
  lastUpdated: string;
  members: number;
  startDate: string;
  deadline: string;
  status: 'Not Started' | 'Planning' | 'In Progress' | 'At Risk' | 'Completed';
  completion: number;
}

// Mock project data - in a real app, this would come from your API
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    isOwner: true,
    lastUpdated: '2023-12-01',
    members: 3,
    startDate: '2023-11-15',
    deadline: '2024-01-30',
    status: 'In Progress',
    completion: 65
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Creating a new mobile application for iOS and Android',
    isOwner: false,
    lastUpdated: '2023-12-05',
    members: 5,
    startDate: '2023-10-01',
    deadline: '2024-03-15',
    status: 'Planning',
    completion: 20
  },
  {
    id: '3',
    name: 'Database Migration',
    description: 'Migrating from legacy database to new cloud infrastructure',
    isOwner: true,
    lastUpdated: '2023-11-28',
    members: 2,
    startDate: '2023-11-01',
    deadline: '2023-12-31',
    status: 'At Risk',
    completion: 45
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for new product launch',
    isOwner: false,
    lastUpdated: '2023-12-10',
    members: 4,
    startDate: '2023-09-15',
    deadline: '2023-12-15',
    status: 'Completed',
    completion: 100
  }
];

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);

  // Simulate fetching projects
  useEffect(() => {
    if (isAuthenticated) {
      // Filter for ongoing projects (not completed)
      const ongoing = mockProjects.filter(project => project.status !== 'Completed');
      setOngoingProjects(ongoing);
    }
  }, [isAuthenticated]);

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status color
  const getStatusColor = (status: Project['status'], daysRemaining: number): string => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'At Risk') return 'bg-red-100 text-red-800';
    if (daysRemaining < 0) return 'bg-red-100 text-red-800';
    if (daysRemaining < 7) return 'bg-yellow-100 text-yellow-800';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
    if (status === 'Planning') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col p-4">
      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      ) : isAuthenticated ? (
        <div className="container mx-auto max-w-6xl">
          {/* Welcome message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold">
              Welcome, <span className="text-blue-600">{user?.name || user?.email}</span>!
            </h2>
            <p className="text-gray-600">Here's an overview of your ongoing projects</p>
          </div>

          {/* Project actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Button href="/projects/create">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Project
            </Button>
            <Button href="/dashboard" variant="outline">
              Go to Dashboard
            </Button>
          </div>

          {/* Ongoing Projects section */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold">Ongoing Projects</h3>
            {ongoingProjects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ongoingProjects.map(project => {
                  const daysRemaining = getDaysRemaining(project.deadline);
                  const statusColor = getStatusColor(project.status, daysRemaining);
                  
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block">
                      <Card className="h-full transition-all hover:shadow-md">
                        <div className="flex h-full flex-col">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-bold text-blue-600">{project.name}</h4>
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor}`}>
                              {project.status}
                            </span>
                          </div>
                          <p className="mb-4 text-sm text-gray-600">{project.description}</p>
                          
                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-xs font-medium">{project.completion}% Complete</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-200">
                              <div 
                                className={`h-2 rounded-full ${
                                  project.completion === 100 ? 'bg-green-500' : 
                                  project.completion >= 60 ? 'bg-blue-500' : 
                                  project.completion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${project.completion}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {/* Timeline */}
                          <div className="mb-3 text-xs">
                            <div className="flex justify-between">
                              <span>Started: {formatDate(project.startDate)}</span>
                              <span>Due: {formatDate(project.deadline)}</span>
                            </div>
                            <div className="mt-1 text-center">
                              {daysRemaining > 0 ? (
                                <span className="font-medium text-blue-600">{daysRemaining} days remaining</span>
                              ) : daysRemaining === 0 ? (
                                <span className="font-medium text-red-600">Due today!</span>
                              ) : (
                                <span className="font-medium text-red-600">Overdue by {Math.abs(daysRemaining)} days</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                            <span>Updated {project.lastUpdated}</span>
                            <span>{project.members} members</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
                
                <Link href="/projects/create" className="block">
                  <Card className="flex h-full items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-all hover:border-blue-400 hover:bg-blue-50">
                    <div>
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h4 className="font-medium text-blue-600">Create New Project</h4>
                    </div>
                  </Card>
                </Link>
              </div>
            ) : (
              <Card className="text-center p-6">
                <p className="mb-4 text-gray-600">You don't have any ongoing projects</p>
                <Button href="/projects/create">Create Your First Project</Button>
              </Card>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold">Quick Stats</h3>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-blue-600">{mockProjects.length}</p>
                </div>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {mockProjects.filter(p => p.status === 'In Progress').length}
                  </p>
                </div>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">At Risk</p>
                  <p className="text-3xl font-bold text-red-600">
                    {mockProjects.filter(p => p.status === 'At Risk').length}
                  </p>
                </div>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {mockProjects.filter(p => p.status === 'Completed').length}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Bulletin</h1>
          <p className="text-xl mb-6 text-center max-w-md">Your centralized platform for project management and file sharing</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button href="/auth/signin" variant="outline">Sign In</Button>
            <Button href="/auth/signup">Sign Up</Button>
          </div>
        </div>
      )}
    </div>
  );
}
