'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

// Define interfaces for project data
interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Activity {
  id: string;
  description: string;
  date: string;
  user: string;
  type: 'update' | 'comment' | 'status_change' | 'member_added' | 'file_upload';
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  createdAt: string;
  dueDate?: string;
}

interface DailyCheck {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'missed';
  notes?: string;
  completedBy?: string;
}

interface Remark {
  id: string;
  content: string;
  author: string;
  date: string;
  type: 'general' | 'warning' | 'important';
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'Planning' | 'In Progress' | 'At Risk' | 'Completed';
  startDate: string;
  deadline: string;
  completion: number;
  owner: string;
  members: ProjectMember[];
  activities: Activity[];
  issues: Issue[];
  dailyChecks: DailyCheck[];
  remarks: Remark[];
  weeklyThroughput: number[];
  lastUpdated: string;
}

// Mock project data
const mockProjects: Record<string, Project> = {
  '1': {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding and improved user experience. The project aims to modernize our online presence and increase user engagement.',
    status: 'In Progress',
    startDate: '2023-11-15',
    deadline: '2024-01-30',
    completion: 65,
    owner: 'John Doe',
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Project Manager' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
      { id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'Developer' }
    ],
    activities: [
      { id: '1', description: 'Homepage design approved', date: '2023-12-01', user: 'Jane Smith', type: 'update' },
      { id: '2', description: 'Started backend integration', date: '2023-11-28', user: 'Robert Johnson', type: 'status_change' },
      { id: '3', description: 'Added new team member', date: '2023-11-20', user: 'John Doe', type: 'member_added' }
    ],
    issues: [
      { id: '1', title: 'Mobile navigation not working', description: 'The hamburger menu is not functioning on iOS devices', status: 'in_progress', priority: 'high', assignee: 'Robert Johnson', createdAt: '2023-11-25', dueDate: '2023-12-10' },
      { id: '2', title: 'Color contrast issues', description: 'Some text has insufficient contrast with background', status: 'open', priority: 'medium', assignee: 'Jane Smith', createdAt: '2023-11-30', dueDate: '2023-12-15' }
    ],
    dailyChecks: [
      { id: '1', date: '2023-12-01', status: 'completed', notes: 'All systems operational', completedBy: 'John Doe' },
      { id: '2', date: '2023-11-30', status: 'completed', notes: 'Minor issues with staging server', completedBy: 'Robert Johnson' },
      { id: '3', date: '2023-11-29', status: 'missed' }
    ],
    remarks: [
      { id: '1', content: 'Client meeting scheduled for Dec 15', author: 'John Doe', date: '2023-11-28', type: 'important' },
      { id: '2', content: 'Remember to update documentation', author: 'Robert Johnson', date: '2023-11-30', type: 'general' }
    ],
    weeklyThroughput: [45, 52, 48, 60, 65, 70],
    lastUpdated: '2023-12-01'
  },
  '3': {
    id: '3',
    name: 'Database Migration',
    description: 'Migrating from legacy database to new cloud infrastructure with improved performance and scalability.',
    status: 'At Risk',
    startDate: '2023-11-01',
    deadline: '2023-12-31',
    completion: 45,
    owner: 'Sarah Williams',
    members: [
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Project Manager' },
      { id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'Database Administrator' },
      { id: '6', name: 'Emily Davis', email: 'emily@example.com', role: 'Developer' }
    ],
    activities: [
      { id: '4', description: 'Schema migration completed', date: '2023-11-20', user: 'Michael Brown', type: 'update' },
      { id: '5', description: 'Data transfer issues identified', date: '2023-11-25', user: 'Emily Davis', type: 'status_change' },
      { id: '6', description: 'Emergency meeting called', date: '2023-11-28', user: 'Sarah Williams', type: 'comment' }
    ],
    issues: [
      { id: '3', title: 'Data integrity issues', description: 'Some records are not transferring correctly', status: 'in_progress', priority: 'critical', assignee: 'Michael Brown', createdAt: '2023-11-25', dueDate: '2023-12-05' },
      { id: '4', title: 'Performance degradation', description: 'New system is running slower than expected', status: 'open', priority: 'high', assignee: 'Emily Davis', createdAt: '2023-11-27', dueDate: '2023-12-10' }
    ],
    dailyChecks: [
      { id: '4', date: '2023-12-01', status: 'completed', notes: 'Monitoring data transfer rates', completedBy: 'Michael Brown' },
      { id: '5', date: '2023-11-30', status: 'completed', notes: 'Backup verification completed', completedBy: 'Emily Davis' },
      { id: '6', date: '2023-11-29', status: 'completed', notes: 'Performance testing in progress', completedBy: 'Sarah Williams' }
    ],
    remarks: [
      { id: '3', content: 'May need to extend deadline due to data integrity issues', author: 'Sarah Williams', date: '2023-11-28', type: 'warning' },
      { id: '4', content: 'Additional resources requested from IT department', author: 'Michael Brown', date: '2023-11-30', type: 'important' }
    ],
    weeklyThroughput: [30, 35, 40, 38, 42, 45],
    lastUpdated: '2023-11-28'
  }
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // In a real app, fetch project data from API
    // For now, use mock data
    setIsLoading(true);
    setTimeout(() => {
      const projectId = Array.isArray(id) ? id[0] : id;
      const foundProject = mockProjects[projectId as keyof typeof mockProjects];
      setProject(foundProject || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

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

  // Get priority badge color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get issue status color
  const getIssueStatusColor = (status: string): string => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get remark type color
  const getRemarkTypeColor = (type: string): string => {
    switch (type) {
      case 'important': return 'border-l-4 border-red-500';
      case 'warning': return 'border-l-4 border-yellow-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        ) : project ? (
          <>
            <PageHeader 
              title={project.name}
              actions={
                <>
                  <Button href={`/projects/${project.id}/edit`} variant="outline">Edit Project</Button>
                  <Button href="/projects">Back to Projects</Button>
                </>
              }
            />

            {/* Project Overview */}
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <div className="mb-4">
                  <p className="text-gray-700">{project.description}</p>
                </div>
                
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Status</span>
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(project.status, getDaysRemaining(project.deadline))}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Owner</span>
                    <span className="mt-1 text-sm">{project.owner}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Start Date</span>
                    <span className="mt-1 text-sm">{formatDate(project.startDate)}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Deadline</span>
                    <span className="mt-1 text-sm">{formatDate(project.deadline)}</span>
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Last Updated</span>
                    <span className="mt-1 text-sm">{formatDate(project.lastUpdated)}</span>
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="block text-sm font-medium text-gray-500">Completion</span>
                  <div className="mt-2 flex items-center">
                    <div className="mr-4 h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className={`h-2 rounded-full ${
                          project.completion === 100 ? 'bg-green-500' : 
                          project.completion >= 60 ? 'bg-blue-500' : 
                          project.completion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{project.completion}%</span>
                  </div>
                </div>
                
                <div>
                  {getDaysRemaining(project.deadline) > 0 ? (
                    <p className="text-sm font-medium text-blue-600">
                      {getDaysRemaining(project.deadline)} days remaining until deadline
                    </p>
                  ) : getDaysRemaining(project.deadline) === 0 ? (
                    <p className="text-sm font-medium text-red-600">
                      Deadline is today!
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-600">
                      Overdue by {Math.abs(getDaysRemaining(project.deadline))} days
                    </p>
                  )}
                </div>
              </Card>
              
              <Card title="Team Members">
                <div className="space-y-3">
                  {project.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                          {member.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="px-2 py-1 text-xs">
                        Contact
                      </Button>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Member
                  </Button>
                </div>
              </Card>
            </div>
            
            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'overview'
                        ? 'text-blue-600 border-blue-600 active'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'issues'
                        ? 'text-blue-600 border-blue-600 active'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('issues')}
                  >
                    Issues
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'activities'
                        ? 'text-blue-600 border-blue-600 active'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('activities')}
                  >
                    Activities
                  </button>
                </li>
                <li className="mr-2">
                  <button
                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                      activeTab === 'checks'
                        ? 'text-blue-600 border-blue-600 active'
                        : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('checks')}
                  >
                    Daily Checks
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Tab Content */}
            <div className="mb-6">
              {activeTab === 'overview' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card title="Weekly Throughput">
                    <div className="h-64 p-4">
                      <div className="flex h-full items-end justify-between">
                        {project.weeklyThroughput.map((value, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="w-10 bg-blue-500" 
                              style={{ height: `${value}%` }}
                            ></div>
                            <span className="mt-2 text-xs">Week {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  
                  <Card title="Remarks">
                    <div className="space-y-3 p-2">
                      {project.remarks.map(remark => (
                        <div key={remark.id} className={`rounded-lg bg-white p-3 ${getRemarkTypeColor(remark.type)}`}>
                          <p className="text-sm">{remark.content}</p>
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                            <span>{remark.author}</span>
                            <span>{formatDate(remark.date)}</span>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-2">
                        <Button variant="outline" className="w-full text-sm">
                          Add Remark
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              
              {activeTab === 'issues' && (
                <Card>
                  <div className="mb-4 flex justify-between">
                    <h3 className="text-lg font-semibold">Critical Issues</h3>
                    <Button variant="outline" className="text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Issue
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Issue
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Priority
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Assignee
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Due Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {project.issues.map(issue => (
                          <tr key={issue.id}>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium">{issue.title}</p>
                                <p className="text-sm text-gray-500">{issue.description}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getIssueStatusColor(issue.status)}`}>
                                {issue.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                                {issue.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm">{issue.assignee}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm">
                                {issue.dueDate ? formatDate(issue.dueDate) : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button variant="outline" className="px-2 py-1 text-xs">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
              
              {activeTab === 'activities' && (
                <Card title="Recent Activities">
                  <div className="space-y-4 p-2">
                    {project.activities.map(activity => (
                      <div key={activity.id} className="border-l-2 border-blue-500 pl-4">
                        <p className="text-sm">{activity.description}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                          <span>{activity.user}</span>
                          <span>{formatDate(activity.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {activeTab === 'checks' && (
                <Card title="Daily Checks">
                  <div className="space-y-3 p-2">
                    {project.dailyChecks.map(check => (
                      <div key={check.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <div>
                          <div className="flex items-center">
                            <span className="mr-2 text-sm font-medium">{formatDate(check.date)}</span>
                            {check.status === 'completed' ? (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Completed</span>
                            ) : check.status === 'pending' ? (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">Pending</span>
                            ) : (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">Missed</span>
                            )}
                          </div>
                          {check.notes && (
                            <p className="mt-1 text-sm text-gray-600">{check.notes}</p>
                          )}
                        </div>
                        {check.completedBy && (
                          <span className="text-xs text-gray-500">By {check.completedBy}</span>
                        )}
                      </div>
                    ))}
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full text-sm">
                        Add Daily Check
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Project Not Found</h2>
            <p className="mb-6 text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button href="/projects">Back to Projects</Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
