import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { WorkflowNode, WorkflowNodeData } from '../../lib/workflow/types';
import { 
  Input, 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  cn
} from '@blinkdotnew/ui';
import { Settings2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAutomations } from '../../lib/workflow/mockApi';

interface PropertiesPanelProps {
  selectedNode: WorkflowNode | null;
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdate,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-white p-6 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <Settings2 size={32} className="text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm">No node selected</h3>
        <p className="text-xs text-muted-foreground mt-2 px-4">
          Select a node on the canvas to configure its properties and logic.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-white overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b p-4 flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Settings2 size={18} />
          Properties
        </h3>
        <Badge variant="secondary" className="text-[10px] uppercase">
          {selectedNode.data.type}
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        <NodeForm 
          node={selectedNode} 
          onUpdate={(data) => onUpdate(selectedNode.id, data)} 
        />
      </div>
    </div>
  );
};

interface NodeFormProps {
  node: WorkflowNode;
  onUpdate: (data: Partial<WorkflowNodeData>) => void;
}

const NodeForm: React.FC<NodeFormProps> = ({ node, onUpdate }) => {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      label: node.data.label,
      ...node.data.config,
    },
  });

  // Reset form when node changes
  useEffect(() => {
    reset({
      label: node.data.label,
      ...node.data.config,
    });
  }, [node.id, reset]);

  const onSubmit = (values: any) => {
    const { label, ...config } = values;
    onUpdate({ label, config });
  };

  const nodeType = node.data.type;
  const { data: automations } = useQuery({
    queryKey: ['automations'],
    queryFn: getAutomations,
  });

  const selectedActionId = watch('actionId');
  const selectedAction = automations?.find(a => a.id === selectedActionId);

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground uppercase">Label</label>
        <Input {...register('label')} placeholder="Node label" size="sm" />
      </div>

      {nodeType === 'start' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Metadata Key</label>
            <Input {...register('metadataKey')} placeholder="e.g. source_id" size="sm" />
          </div>
        </div>
      )}

      {nodeType === 'task' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Assignee</label>
            <Input {...register('assignee')} placeholder="Email or Role" size="sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Description</label>
            <Textarea {...register('description')} placeholder="Task instructions" rows={3} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Due Date</label>
            <Input {...register('dueDate')} type="date" size="sm" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Custom Fields (K-V)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input {...register('customFields.key1')} placeholder="Key" className="h-7 text-[10px]" />
              <Input {...register('customFields.val1')} placeholder="Value" className="h-7 text-[10px]" />
            </div>
          </div>
        </div>
      )}

      {nodeType === 'approval' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Approver Role</label>
            <Input {...register('approverRole')} placeholder="e.g. Manager" size="sm" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Threshold (%)</label>
            <Input {...register('threshold', { valueAsNumber: true })} type="number" min={0} max={100} size="sm" />
          </div>
        </div>
      )}

      {nodeType === 'automation' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Action</label>
            <Select 
              value={watch('actionId')} 
              onValueChange={(val) => {
                setValue('actionId', val);
                handleSubmit(onSubmit)();
              }}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                {automations?.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAction && (
            <div className="space-y-3 bg-muted/50 p-2 rounded-md">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Parameters</p>
              {selectedAction.params.map(param => (
                <div key={param} className="space-y-1">
                  <label className="text-[10px] text-muted-foreground">{param}</label>
                  <Input 
                    {...register(`params.${param}`)} 
                    placeholder={param} 
                    className="bg-white h-7 text-xs"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {nodeType === 'end' && (
        <div className="space-y-4 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Message</label>
            <Input {...register('endMessage')} placeholder="Completion message" size="sm" />
          </div>
          <div className="flex items-center gap-2 py-2">
             <input type="checkbox" {...register('summaryFlag')} id="summaryFlag" className="w-4 h-4" />
             <label htmlFor="summaryFlag" className="text-xs font-medium">Show summary on completion</label>
          </div>
        </div>
      )}
    </form>
  );
};

const Badge = ({ children, className, variant = 'default' }: any) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full font-bold",
    variant === 'default' && "bg-primary text-primary-foreground",
    variant === 'secondary' && "bg-secondary text-secondary-foreground",
    className
  )}>
    {children}
  </span>
);
