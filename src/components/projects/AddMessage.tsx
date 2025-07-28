'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { ProjectMember } from '@/app/projects/types';

interface AddMessageProps {
  members: ProjectMember[];
  currentUser: string;
  onSubmit: (message: {
    content: string;
    type: 'general' | 'warning' | 'important';
    visibility: 'all' | 'team' | 'owner' | string[];
  }) => void;
  isRemark?: boolean;
}

export default function AddMessage({ members, currentUser, onSubmit, isRemark = false }: AddMessageProps) {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<'general' | 'warning' | 'important'>('general');
  const [visibility, setVisibility] = useState<'all' | 'team' | 'owner'>('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    onSubmit({
      content,
      type: messageType,
      visibility: visibility === 'specific' ? selectedMembers : visibility,
    });
    
    // Reset form
    setContent('');
    setMessageType('general');
    setVisibility('all');
    setSelectedMembers([]);
    setIsExpanded(false);
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add {isRemark ? 'Remark' : 'Message'}
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your ${isRemark ? 'remark' : 'message'} here...`}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="warning">Warning</option>
                <option value="important">Important</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="all">All Members</option>
                <option value="team">Team Only</option>
                <option value="owner">Owner Only</option>
                <option value="specific">Specific Members</option>
              </select>
            </div>
          </div>
          
          {visibility === 'specific' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Members</label>
              <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-300 p-2">
                {members.map(member => (
                  <div key={member.id} className="flex items-center p-1">
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`member-${member.id}`} className="ml-2 text-sm text-gray-700">
                      {member.name} {member.id === currentUser && '(You)'}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
} 