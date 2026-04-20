import React from 'react';
import { NodeProps } from 'reactflow';
import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { WorkflowNodeData } from '../../../lib/workflow/types';

export const StartNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      label={data.label}
      icon={<Play size={16} />}
      selected={selected}
      type="start"
    >
      <p>Workflow Entry Point</p>
    </BaseNode>
  );
};

export const TaskNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      label={data.label}
      icon={<span className="text-xs font-bold">TSK</span>}
      selected={selected}
      type="task"
    >
      <div className="space-y-1">
        <p className="line-clamp-1">{data.config.assignee ? `Assignee: ${data.config.assignee}` : 'Unassigned'}</p>
        <p className="opacity-70">{data.config.dueDate || 'No due date'}</p>
      </div>
    </BaseNode>
  );
};

export const ApprovalNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      label={data.label}
      icon={<span className="text-xs font-bold">APR</span>}
      selected={selected}
      type="approval"
    >
      <p>Role: {data.config.approverRole || 'Unspecified'}</p>
    </BaseNode>
  );
};

export const AutomationNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      label={data.label}
      icon={<span className="text-xs font-bold">AUTO</span>}
      selected={selected}
      type="automation"
    >
      <p>Action: {data.config.actionId || 'None'}</p>
    </BaseNode>
  );
};

export const EndNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  return (
    <BaseNode
      label={data.label}
      icon={<span className="text-xs font-bold">END</span>}
      selected={selected}
      type="end"
    >
      <p>Workflow Completion</p>
    </BaseNode>
  );
};
