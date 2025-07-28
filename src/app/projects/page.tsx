'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
type Status = 'Completed' | 'In Progress' | 'Planning' | 'At Risk' | 'Not Started';

interface Project {
  id: string;
  name: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline: string;
  completion: number;
  team: string[];
  tags: string[];
}

// Mock project data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    status: 'In Progress',
    priority: 'High',
    deadline: '2023-12-15',
    completion: 65,
    team: ['John Doe', 'Jane Smith'],
    tags: ['Design', 'Frontend'],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Creating a new mobile application for iOS and Android',
    status: 'Planning',
    priority: 'Medium',
    deadline: '2024-02-28',
    completion: 20,
    team: ['Mike Johnson', 'Sarah Williams'],
    tags: ['Mobile', 'Development'],
  },
  {
    id: '3',
    name: 'Database Migration',
    description: 'Migrating from legacy database to new cloud infrastructure',
    status: 'At Risk',
    priority: 'Critical',
    deadline: '2023-11-30',
    completion: 45,
    team: ['Robert Brown', 'Emily Davis'],
    tags: ['Backend', 'Database'],
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    description: 'Q4 marketing campaign for new product launch',
    status: 'Completed',
    priority: 'Medium',
    deadline: '2023-10-01',
    completion: 100,
    team: ['Lisa Anderson', 'David Wilson'],
    tags: ['Marketing', 'Content'],
  },
  {
    id: '5',
    name: 'Security Audit',
    description: 'Annual security audit and compliance check',
    status: 'Not Started',
    priority: 'High',
    deadline: '2024-01-15',
    completion: 0,
    team: ['Mark Thompson', 'Jennifer Garcia'],
    tags: ['Security', 'Compliance'],
  },
];

export default function Projects() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  // Filter and sort projects
  const filteredProjects = mockProjects
    .filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { 'Critical': 1, 'High': 2, 'Medium': 3, 'Low': 4 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'completion') {
        return b.completion - a.completion;
      }
      return 0;
    });

  const getStatusColor = (status: Status): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-purple-100 text-purple-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title="Projects" 
          actions={
            <Button href="/projects/create">Add New Project</Button>
          }
        />

        {/* Filters and Search */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Projects
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                id="status"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="At Risk">At Risk</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                id="sortBy"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="deadline">Deadline (Earliest First)</option>
                <option value="priority">Priority (Highest First)</option>
                <option value="completion">Completion (Highest First)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Projects List */}
        <Card>
          <div className="overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <Link href={`/projects/${project.id}`} className="font-medium text-blue-600 hover:text-blue-800">
                          {project.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {project.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">
                        {new Date(project.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {new Date(project.deadline) < new Date() && project.status !== 'Completed' && (
                        <span className="ml-2 text-xs font-medium text-red-600">Overdue</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-full rounded-full bg-gray-200">
                          <div
                            className={`h-2 rounded-full ${
                              project.completion === 100
                                ? 'bg-green-500'
                                : project.completion >= 60
                                ? 'bg-blue-500'
                                : project.completion >= 30
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{project.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.team.map((member, index) => (
                          <div
                            key={index}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700 ring-2 ring-white"
                            title={member}
                          >
                            {member.charAt(0)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button href={`/projects/${project.id}`} variant="outline" className="px-2 py-1 text-xs">
                          View
                        </Button>
                        <Button href={`/projects/${project.id}/edit`} variant="outline" className="px-2 py-1 text-xs">
                          Edit
                        </Button>
                        <Button variant="danger" className="px-2 py-1 text-xs">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredProjects.length === 0 && (
          <Card className="mt-6 p-6 text-center">
            <p className="text-gray-500">No projects found matching your criteria.</p>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
} 