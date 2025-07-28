'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { MemberHours } from '@/app/projects/types';

interface WeeklyThroughputProps {
  weeklyThroughput: number[];
  memberHours?: MemberHours[];
}

export default function WeeklyThroughput({ weeklyThroughput, memberHours = [] }: WeeklyThroughputProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate total hours for each week
  const totalHoursByWeek = memberHours.length > 0 
    ? Array(5).fill(0).map((_, weekIndex) => 
        memberHours.reduce((sum, member) => 
          sum + (member.hours[weekIndex] || 0), 0)
      )
    : [];

  // Calculate efficiency (throughput per hour) for each week
  const efficiency = totalHoursByWeek.map((hours, index) => 
    hours > 0 ? (weeklyThroughput[index] / hours).toFixed(2) : '0'
  );

  return (
    <Card title="Weekly Throughput">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Project Progress Over Time</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 p-4">
        <div className="flex h-full items-end justify-between">
          {weeklyThroughput.map((value, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="w-12 bg-blue-500" 
                style={{ height: `${value}%` }}
              ></div>
              <span className="mt-2 text-xs">Week {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details Table */}
      {showDetails && memberHours.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Member
                </th>
                {[1, 2, 3, 4, 5].map(week => (
                  <th key={week} className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                    Week {week}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {memberHours.map(member => (
                <tr key={member.memberId}>
                  <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  {member.hours.map((hours, index) => (
                    <td key={index} className="px-3 py-2 text-center text-sm text-gray-500">
                      {hours}h
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-gray-900">
                  Total Hours
                </td>
                {totalHoursByWeek.map((hours, index) => (
                  <td key={index} className="px-3 py-2 text-center text-sm font-medium text-gray-700">
                    {hours}h
                  </td>
                ))}
              </tr>
              <tr className="bg-blue-50">
                <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-blue-700">
                  Throughput
                </td>
                {weeklyThroughput.map((value, index) => (
                  <td key={index} className="px-3 py-2 text-center text-sm font-medium text-blue-700">
                    {value}%
                  </td>
                ))}
              </tr>
              <tr className="bg-green-50">
                <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-green-700">
                  Efficiency
                </td>
                {efficiency.map((value, index) => (
                  <td key={index} className="px-3 py-2 text-center text-sm font-medium text-green-700">
                    {value}%/h
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
} 