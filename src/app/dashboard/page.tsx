'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const projectsData = {
    total: 7,
    inProgress: 3,
    atRisk: 1,
    completed: 2,
    upcoming: 1
  };

  const todaysTasks = [
    { id: 1, name: 'Finalize homepage design', project: 'Website Redesign', priority: 'High', status: 'In Progress' },
    { id: 2, name: 'Review API documentation', project: 'Mobile App Development', priority: 'Medium', status: 'Not Started' },
    { id: 3, name: 'Fix authentication bug', project: 'Database Migration', priority: 'Critical', status: 'In Progress' },
  ];

  const upcomingDeadlines = [
    { id: 1, project: 'Website Redesign', task: 'Finalize homepage design', deadline: '2023-12-20' },
    { id: 2, project: 'Mobile App Development', task: 'Complete user authentication', deadline: '2023-12-25' },
    { id: 3, project: 'Database Migration', task: 'Test data integrity', deadline: '2023-12-18' },
  ];

  const criticalIssues = [
    { id: 1, title: 'Server downtime', project: 'Website Redesign', status: 'Open', priority: 'Critical', reported: '2023-12-15' },
    { id: 2, title: 'Payment gateway error', project: 'Mobile App Development', status: 'Open', priority: 'High', reported: '2023-12-14' },
    { id: 3, title: 'Data migration failure', project: 'Database Migration', status: 'In Progress', priority: 'Critical', reported: '2023-12-13' },
  ];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title="Project Management Dashboard" 
          subtitle="Overview of your projects, tasks, and issues"
          actions={
            <>
              <Button href="/projects/create">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Project
              </Button>
              <Button href="/files" variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                Files
              </Button>
            </>
          }
        />

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
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
                  activeTab === 'projects'
                    ? 'text-blue-600 border-blue-600 active'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'tasks'
                    ? 'text-blue-600 border-blue-600 active'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tasks')}
              >
                Tasks
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'reports'
                    ? 'text-blue-600 border-blue-600 active'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </button>
            </li>
          </ul>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Project Stats */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-blue-50 border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-blue-600">{projectsData.inProgress}</p>
                </div>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-600">{criticalIssues.length}</p>
                </div>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Today's Tasks</p>
                  <p className="text-3xl font-bold text-yellow-600">{todaysTasks.length}</p>
                </div>
              </Card>
              <Card className="bg-purple-50 border-purple-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Upcoming Deadlines</p>
                  <p className="text-3xl font-bold text-purple-600">{upcomingDeadlines.length}</p>
                </div>
              </Card>
            </div>

            {/* Main Dashboard Grid Layout */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Critical Issues */}
              <Card title="Critical Issues" bodyClassName="h-64 overflow-y-auto">
                {criticalIssues.length > 0 ? (
                  <div className="space-y-3">
                    {criticalIssues.map(issue => (
                      <div key={issue.id} className="rounded-md border-l-4 border-red-500 bg-red-50 p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{issue.title}</h3>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            issue.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {issue.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.project}</p>
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span>Reported: {issue.reported}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-800">{issue.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No critical issues</p>
                )}
              </Card>

              {/* Today's Tasks */}
              <Card title="Today's Tasks" bodyClassName="h-64 overflow-y-auto">
                {todaysTasks.length > 0 ? (
                  <div className="space-y-3">
                    {todaysTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{task.name}</h3>
                            <p className="text-sm text-gray-600">{task.project}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            task.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tasks for today</p>
                )}
              </Card>

              {/* Upcoming Deadlines */}
              <Card title="Upcoming Deadlines" bodyClassName="h-64 overflow-y-auto">
                {upcomingDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingDeadlines.map(deadline => (
                      <div key={deadline.id} className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                        <p className="font-medium">{deadline.task}</p>
                        <p className="text-sm text-gray-600">{deadline.project}</p>
                        <p className="mt-1 text-xs text-red-600">Due: {deadline.deadline}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming deadlines</p>
                )}
              </Card>

              {/* Active Projects */}
              <Card title="Active Projects" bodyClassName="h-64 overflow-y-auto">
                <div className="space-y-3">
                  <div className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Website Redesign</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">In Progress</span>
                    </div>
                    <p className="text-sm text-gray-600">Complete overhaul of the company website</p>
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500">65% Complete</span>
                        <span className="text-xs text-gray-500">Due: Jan 30, 2024</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Mobile App Development</h3>
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">Planning</span>
                    </div>
                    <p className="text-sm text-gray-600">Creating a new mobile application</p>
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500">20% Complete</span>
                        <span className="text-xs text-gray-500">Due: Mar 15, 2024</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Database Migration</h3>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">At Risk</span>
                    </div>
                    <p className="text-sm text-gray-600">Migrating from legacy database to new cloud infrastructure</p>
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500">45% Complete</span>
                        <span className="text-xs text-gray-500">Due: Dec 31, 2023</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-200">
                        <div className="h-1.5 rounded-full bg-red-500" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="rounded-md border border-gray-300 px-3 py-2"
                />
                <select className="rounded-md border border-gray-300 px-3 py-2">
                  <option>All Status</option>
                  <option>In Progress</option>
                  <option>At Risk</option>
                  <option>Completed</option>
                </select>
              </div>
              <Button href="/projects/create">New Project</Button>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Project</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Progress</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Deadline</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Members</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Website Redesign</div>
                        <div className="text-sm text-gray-500">Complete overhaul of the company website</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">In Progress</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">65%</div>
                        <div className="h-1.5 w-24 rounded-full bg-gray-200">
                          <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '65%' }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 30, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href="/projects/1" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                        <Link href="/projects/1/edit" className="text-yellow-600 hover:text-yellow-900">Edit</Link>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">Mobile App Development</div>
                        <div className="text-sm text-gray-500">Creating a new mobile application</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">Planning</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">20%</div>
                        <div className="h-1.5 w-24 rounded-full bg-gray-200">
                          <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: '20%' }}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 15, 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href="/projects/2" className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                        <Link href="/projects/2/edit" className="text-yellow-600 hover:text-yellow-900">Edit</Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Tasks Tab Content */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="rounded-md border border-gray-300 px-3 py-2"
                />
                <select className="rounded-md border border-gray-300 px-3 py-2">
                  <option>All Projects</option>
                  <option>Website Redesign</option>
                  <option>Mobile App Development</option>
                </select>
              </div>
              <Button>Add Task</Button>
            </div>

            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Finalize homepage design</h3>
                      <p className="text-sm text-gray-600">Website Redesign</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm text-red-600">Due: Dec 20, 2023</span>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Medium</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Complete user authentication</h3>
                      <p className="text-sm text-gray-600">Mobile App Development</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm text-red-600">Due: Dec 25, 2023</span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">High</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Test data integrity</h3>
                      <p className="text-sm text-gray-600">Database Migration</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm text-red-600">Due: Dec 18, 2023</span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">High</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Reports Tab Content */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card title="Project Status Distribution" bodyClassName="h-64">
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </Card>
              <Card title="Task Completion Rate" bodyClassName="h-64">
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Chart will be displayed here</p>
                </div>
              </Card>
            </div>

            <Card title="Project Timeline" bodyClassName="h-64">
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Gantt chart will be displayed here</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 