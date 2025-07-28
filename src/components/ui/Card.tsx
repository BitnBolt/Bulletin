'use client';

import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export default function Card({ 
  title, 
  children, 
  className = '', 
  headerClassName = '',
  bodyClassName = ''
}: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className={`border-b border-gray-200 bg-gray-50 px-4 py-3 ${headerClassName}`}>
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
} 