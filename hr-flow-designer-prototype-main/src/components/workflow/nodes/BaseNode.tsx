import React from 'react';
import { Handle, Position } from 'reactflow';

interface BaseNodeProps {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  type: string;
  children?: React.ReactNode;
}

const nodeColors: Record<string, string> = {
  start: 'border-green-500 bg-green-50',
  task: 'border-blue-500 bg-blue-50',
  approval: 'border-amber-500 bg-amber-50',
  automation: 'border-purple-500 bg-purple-50',
  end: 'border-red-500 bg-red-50',
};

export const BaseNode: React.FC<BaseNodeProps> = ({
  label,
  icon,
  selected,
  type,
  children,
}) => {
  return (
    <div
      className={`
        min-w-[180px] rounded-lg border-2 bg-white p-3 shadow-md transition-all
        ${nodeColors[type] || 'border-gray-200 bg-gray-50'}
        ${selected ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105' : ''}
      `}
    >
      {type !== 'start' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <div className={`
          p-1.5 rounded-md
          ${type === 'start' ? "bg-green-100 text-green-700" : ''}
          ${type === 'task' ? "bg-blue-100 text-blue-700" : ''}
          ${type === 'approval' ? "bg-amber-100 text-amber-700" : ''}
          ${type === 'automation' ? "bg-purple-100 text-purple-700" : ''}
          ${type === 'end' ? "bg-red-100 text-red-700" : ''}
        `}>
          {icon}
        </div>
        <span className="font-semibold text-sm truncate">{label}</span>
      </div>

      <div className="text-xs text-muted-foreground">
        {children}
      </div>

      {type !== 'end' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
    </div>
  );
};

