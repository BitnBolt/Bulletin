'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  category: string;
  project: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
}

// Mock file data
const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Requirements.pdf',
    type: 'pdf',
    size: 2500000, // in bytes
    category: 'Documents',
    project: 'Website Redesign',
    uploadedBy: 'John Doe',
    uploadDate: '2023-10-15T10:30:00Z',
    tags: ['Requirements', 'Planning'],
  },
  {
    id: '2',
    name: 'Logo Design.png',
    type: 'png',
    size: 1200000,
    category: 'Design',
    project: 'Website Redesign',
    uploadedBy: 'Jane Smith',
    uploadDate: '2023-10-16T14:45:00Z',
    tags: ['Logo', 'Branding'],
  },
  {
    id: '3',
    name: 'Database Schema.sql',
    type: 'sql',
    size: 45000,
    category: 'Development',
    project: 'Database Migration',
    uploadedBy: 'Robert Brown',
    uploadDate: '2023-10-20T09:15:00Z',
    tags: ['Database', 'Schema'],
  },
  {
    id: '4',
    name: 'Marketing Strategy.pptx',
    type: 'pptx',
    size: 5800000,
    category: 'Marketing',
    project: 'Marketing Campaign',
    uploadedBy: 'Lisa Anderson',
    uploadDate: '2023-10-05T16:20:00Z',
    tags: ['Strategy', 'Presentation'],
  },
  {
    id: '5',
    name: 'Budget Forecast.xlsx',
    type: 'xlsx',
    size: 950000,
    category: 'Finance',
    project: 'Marketing Campaign',
    uploadedBy: 'David Wilson',
    uploadDate: '2023-10-12T11:10:00Z',
    tags: ['Budget', 'Finance'],
  },
  {
    id: '6',
    name: 'Security Report.pdf',
    type: 'pdf',
    size: 3200000,
    category: 'Security',
    project: 'Security Audit',
    uploadedBy: 'Mark Thompson',
    uploadDate: '2023-10-25T13:40:00Z',
    tags: ['Security', 'Compliance'],
  },
  {
    id: '7',
    name: 'User Interface Mockup.fig',
    type: 'fig',
    size: 4100000,
    category: 'Design',
    project: 'Mobile App Development',
    uploadedBy: 'Sarah Williams',
    uploadDate: '2023-10-18T15:30:00Z',
    tags: ['UI', 'Design'],
  },
];

// File categories with icons
const fileCategories = [
  { name: 'All', icon: '📁' },
  { name: 'Documents', icon: '📄' },
  { name: 'Design', icon: '🎨' },
  { name: 'Development', icon: '💻' },
  { name: 'Marketing', icon: '📊' },
  { name: 'Finance', icon: '💰' },
  { name: 'Security', icon: '🔒' },
];

export default function Files() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter and sort files
  const filteredFiles = mockFiles
    .filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.project.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || file.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'size') {
        return b.size - a.size;
      }
      return 0;
    });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type: string): string => {
    switch (type) {
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📘';
      case 'xls':
      case 'xlsx':
        return '📗';
      case 'ppt':
      case 'pptx':
        return '📙';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'zip':
      case 'rar':
        return '🗜️';
      case 'sql':
        return '🗃️';
      case 'fig':
        return '🎨';
      default:
        return '📄';
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="Files"
          actions={
            <Button onClick={() => setShowUploadModal(true)}>Upload Files</Button>
          }
        />

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Files
              </label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Search by name or project"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                <option value="date">Date (Newest First)</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">Size (Largest First)</option>
              </select>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex space-x-2">
                <button
                  className={`rounded-md border p-2 ${
                    viewMode === 'grid' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'
                  }`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`rounded-md border p-2 ${
                    viewMode === 'list' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'
                  }`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          {fileCategories.map((category) => (
            <button
              key={category.name}
              className={`flex items-center rounded-full px-4 py-2 ${
                categoryFilter === category.name
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setCategoryFilter(category.name)}
            >
              <span className="mr-2">{category.icon}</span>
              <span>{category.name}</span>
              {categoryFilter === category.name && (
                <span className="ml-2 text-xs">({filteredFiles.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Files Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="group relative overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-gray-50 p-4">
                  <span className="text-4xl">{getFileIcon(file.type)}</span>
                </div>
                <div className="p-4">
                  <h3 className="mb-1 truncate text-sm font-medium" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="mb-2 text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="truncate">{file.project}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {file.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <Button variant="outline" className="rounded-full bg-white p-2 text-blue-600 hover:bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                    <Button variant="outline" className="rounded-full bg-white p-2 text-yellow-600 hover:bg-yellow-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button variant="outline" className="rounded-full bg-white p-2 text-red-600 hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      File
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Uploaded
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-xl">{getFileIcon(file.type)}</span>
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {file.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{file.project}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{file.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{new Date(file.uploadDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">by {file.uploadedBy}</div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" className="px-2 py-1 text-xs">
                            Download
                          </Button>
                          <Button variant="outline" className="px-2 py-1 text-xs">
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
        )}

        {filteredFiles.length === 0 && (
          <Card className="mt-6 p-6 text-center">
            <p className="text-gray-500">No files found matching your criteria.</p>
          </Card>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Upload Files</h3>
                      <div className="mt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">Files</label>
                          <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5">
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                                >
                                  <span>Upload files</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, PDF, DOCX up to 10MB</p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                            Project
                          </label>
                          <select
                            id="project"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="">Select a project</option>
                            <option value="Website Redesign">Website Redesign</option>
                            <option value="Mobile App Development">Mobile App Development</option>
                            <option value="Database Migration">Database Migration</option>
                            <option value="Marketing Campaign">Marketing Campaign</option>
                            <option value="Security Audit">Security Audit</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="">Select a category</option>
                            <option value="Documents">Documents</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Security">Security</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            id="tags"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="e.g. design, logo, draft"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Button className="sm:ml-3 sm:w-auto">
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-3 sm:mt-0 sm:w-auto"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 