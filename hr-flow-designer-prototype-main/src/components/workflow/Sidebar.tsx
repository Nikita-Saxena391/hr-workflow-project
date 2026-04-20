import React from 'react';
import { Play, ClipboardList, CheckCircle2, Zap, Flag } from 'lucide-react';

const nodeTypes = [
  { type: 'start', label: 'Start Node', icon: <Play size={18} />, color: 'text-green-600 bg-green-50' },
  { type: 'task', label: 'Task Node', icon: <ClipboardList size={18} />, color: 'text-blue-600 bg-blue-50' },
  { type: 'approval', label: 'Approval Node', icon: <CheckCircle2 size={18} />, color: 'text-amber-600 bg-amber-50' },
  { type: 'automation', label: 'Automated Step', icon: <Zap size={18} />, color: 'text-purple-600 bg-purple-50' },
  { type: 'end', label: 'End Node', icon: <Flag size={18} />, color: 'text-red-600 bg-red-50' },
];

export const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-r bg-white p-4 flex flex-col gap-4 overflow-y-auto">
      <div>
        <h2 className="font-bold text-lg mb-1">Workflow Nodes</h2>
        <p className="text-xs text-muted-foreground">Drag and drop nodes onto the canvas</p>
      </div>
      
      <div className="space-y-3 mt-4">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className={`
              flex items-center gap-3 p-3 rounded-lg border cursor-grab hover:shadow-md transition-all active:cursor-grabbing
              ${node.color}
            `}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            {node.icon}
            <span className="font-medium text-sm">{node.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t pt-4">
        <h3 className="font-semibold text-sm mb-2">Instructions</h3>
        <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
          <li>Select a node to configure it.</li>
          <li>Connect nodes using the handles.</li>
          <li>Press Backspace/Delete to remove.</li>
        </ul>
      </div>
    </div>
  );
};

