import React, { useState, useEffect } from 'react';
import { WorkflowNode, WorkflowEdge, SimulationStep } from '../../lib/workflow/types';
import { simulateWorkflow } from '../../lib/workflow/mockApi';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  cn,
  Progress
} from '@blinkdotnew/ui';
import { X, CheckCircle2, AlertCircle, Loader2, Play, RefreshCcw } from 'lucide-react';

interface SimulationPanelProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onClose: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  nodes,
  edges,
  onClose,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ steps: SimulationStep[], success: boolean, error?: string } | null>(null);
  const [progress, setProgress] = useState(0);

  const runSimulation = async () => {
    setIsRunning(true);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 150);

    const simulationResult = await simulateWorkflow(nodes, edges);
    
    clearInterval(interval);
    setProgress(100);
    setResult(simulationResult);
    setIsRunning(false);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <Card className="w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Play size={20} className="text-primary" fill="currentColor" />
            </div>
            <div>
              <CardTitle>Workflow Simulator</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Test your logic and node connections</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {isRunning && (
            <div className="space-y-4 py-8 text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto" />
              <div className="max-w-xs mx-auto space-y-2">
                <p className="font-medium">Analyzing Workflow Graph...</p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className={cn(
                "p-4 rounded-xl border-2 flex items-center gap-4 shadow-sm",
                result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                {result.success ? (
                  <div className="bg-green-500 p-2 rounded-full text-white">
                    <CheckCircle2 size={24} />
                  </div>
                ) : (
                  <div className="bg-red-500 p-2 rounded-full text-white">
                    <AlertCircle size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-lg",
                    result.success ? "text-green-800" : "text-red-800"
                  )}>
                    {result.success ? "Simulation Complete" : "Validation Failed"}
                  </h4>
                  <p className={cn(
                    "text-sm",
                    result.success ? "text-green-600" : "text-red-600"
                  )}>
                    {result.success ? "All steps reached successfully." : result.error}
                  </p>
                </div>
                {!result.success && (
                  <Button size="sm" onClick={runSimulation} variant="outline" className="border-red-200 hover:bg-red-100">
                    <RefreshCcw size={14} className="mr-2" /> Retry
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Execution Timeline</h5>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Success
                  </div>
                </div>
                
                <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {result.steps.length > 0 ? result.steps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="relative animate-in slide-in-from-left-2"
                      style={{ animationDelay: `${idx * 150}ms` }}
                    >
                      <div className={cn(
                        "absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center",
                        step.status === 'success' ? "bg-green-500" : "bg-red-500"
                      )}>
                        {step.status === 'success' ? <CheckCircle2 size={10} className="text-white" /> : <X size={10} className="text-white" />}
                      </div>
                      
                      <div className="bg-white border rounded-lg p-3 shadow-sm hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-muted-foreground tracking-tight">
                            {step.nodeId === 'validation' ? 'Validator' : step.nodeId.split('-')[0]}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{step.message}</p>
                      </div>
                    </div>
                  )) : (
                     <div className="py-8 text-center text-muted-foreground italic border-2 border-dashed rounded-lg -ml-6">
                       No execution steps recorded.
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!isRunning && (
            <Button onClick={runSimulation} className="gap-2">
              <RefreshCcw size={16} /> Re-run Simulation
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
