'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Project } from '../../types';

// Mock project data - in a real app, this would be imported from a shared file
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
    activities: [],
    issues: [],
    dailyChecks: [],
    remarks: [],
    weeklyThroughput: [45, 52, 48, 60, 65, 70],
    memberHours: [
      { memberId: '1', name: 'John Doe', hours: [8, 7, 9, 8, 6] },
      { memberId: '2', name: 'Jane Smith', hours: [6, 8, 7, 9, 8] },
      { memberId: '3', name: 'Robert Johnson', hours: [9, 8, 8, 7, 9] }
    ],
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
    activities: [],
    issues: [],
    dailyChecks: [],
    remarks: [],
    weeklyThroughput: [30, 35, 40, 38, 42, 45],
    memberHours: [
      { memberId: '4', name: 'Sarah Williams', hours: [7, 8, 6, 7, 8] },
      { memberId: '5', name: 'Michael Brown', hours: [9, 10, 8, 9, 7] },
      { memberId: '6', name: 'Emily Davis', hours: [8, 8, 7, 6, 8] }
    ],
    lastUpdated: '2023-11-28'
  }
};

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = Array.isArray(id) ? id[0] : id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const [error, setError] = useState<string | null>(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');

  useEffect(() => {
    // In a real app, fetch project data from API
    setIsLoading(true);
    setTimeout(() => {
      const project = mockProjects[projectId];
      if (project) {
        setFormData(project);
      } else {
        setError('Project not found');
      }
      setIsLoading(false);
    }, 500);
  }, [projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompletionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, completion: value }));
  };

  const handleAddMember = () => {
    if (!memberEmail || !memberRole) return;
    
    const newMember = {
      id: `new-${Date.now()}`,
      name: memberEmail.split('@')[0], // Simple name extraction from email
      email: memberEmail,
      role: memberRole
    };
    
    setFormData(prev => ({
      ...prev,
      members: [...(prev.members || []), newMember]
    }));
    
    setMemberEmail('');
    setMemberRole('');
  };

  const handleRemoveMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: (prev.members || []).filter(member => member.id !== memberId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      // In a real app, send data to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update lastUpdated field
      setFormData(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString().split('T')[0]
      }));
      
      // Redirect back to project page
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-6">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !formData.id) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="mb-2 text-2xl font-bold">Error</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <Button href="/projects">Back to Projects</Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <PageHeader 
          title={`Edit Project: ${formData.name}`}
          actions={
            <Button href={`/projects/${projectId}`} variant="outline">Cancel</Button>
          }
        />

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
              <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="completion" className="block text-sm font-medium text-gray-700">
                  Completion ({formData.completion || 0}%)
                </label>
                <input
                  type="range"
                  id="completion"
                  name="completion"
                  value={formData.completion || 0}
                  onChange={handleCompletionChange}
                  min="0"
                  max="100"
                  step="5"
                  className="mt-1 block w-full"
                />
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div 
                    className={`h-2 rounded-full ${
                      (formData.completion || 0) === 100 ? 'bg-green-500' : 
                      (formData.completion || 0) >= 60 ? 'bg-blue-500' : 
                      (formData.completion || 0) >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${formData.completion || 0}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-semibold">Team Members</h2>
              
              <div className="mb-4 space-y-3">
                {formData.members?.map(member => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="rounded-full p-1 text-red-500 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mb-4 rounded-lg border border-gray-200 p-4">
                <h3 className="mb-3 text-sm font-medium">Add New Member</h3>
                <div className="mb-3">
                  <label htmlFor="memberEmail" className="block text-xs text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="memberEmail"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="memberRole" className="block text-xs text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    id="memberRole"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Developer, Designer, etc."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  Add Member
                </button>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-semibold">Weekly Work Hours</h2>
              <p className="mb-4 text-sm text-gray-600">
                Track weekly work hours for each team member. This data is used to calculate weekly throughput.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Member
                      </th>
                      {[1, 2, 3, 4, 5].map(week => (
                        <th key={week} scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                          Week {week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formData.memberHours?.map((member, index) => (
                      <tr key={member.memberId}>
                        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        {member.hours.map((hours, weekIndex) => (
                          <td key={weekIndex} className="px-4 py-2 text-center text-sm text-gray-500">
                            <input
                              type="number"
                              value={hours}
                              onChange={(e) => {
                                const newHours = [...member.hours];
                                newHours[weekIndex] = parseInt(e.target.value);
                                
                                const newMemberHours = [...(formData.memberHours || [])];
                                newMemberHours[index] = {
                                  ...member,
                                  hours: newHours
                                };
                                
                                setFormData(prev => ({
                                  ...prev,
                                  memberHours: newMemberHours
                                }));
                              }}
                              min="0"
                              max="168"
                              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center text-sm"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              href={`/projects/${projectId}`} 
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              isLoading={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
} 