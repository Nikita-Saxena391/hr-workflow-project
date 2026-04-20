import React from 'react';
import { Canvas } from './components/workflow/Canvas';
import { LayoutDashboard, Users, Workflow, HelpCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="shrink-0 w-64 bg-background border-r border-border overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="shrink-0 border-b border-border px-6 h-16 flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-md">
              <Workflow size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">HRFlow <span className="text-primary font-black">Pro</span></span>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent cursor-pointer active">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer active">
              <Workflow size={18} />
              Flow Designer
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent cursor-pointer active">
              <Users size={18} />
              HR Members
            </a>
          </div>
          
          <div className="shrink-0 border-t border-border p-4 bg-slate-50/50">
             <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
               <div className="flex items-center gap-2 text-primary">
                 <HelpCircle size={16} />
                 <span className="text-xs font-bold uppercase tracking-wider">Quick Help</span>
               </div>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 Use the left sidebar to drag and drop nodes. Select any node to configure its logic.
               </p>
               <button className="w-full h-8 px-3 text-xs border border-input bg-background hover:bg-accent rounded-md text-muted-foreground">
                 Documentation
               </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 shrink-0 border-b bg-white flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-accent rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold">New Employee Onboarding</h1>
              <p className="text-xs text-muted-foreground font-medium">Draft Workflow • Last saved 2m ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center -space-x-2 mr-4">
               <div className="w-8 h-8 border-2 border-white rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">JD</div>
               <div className="w-8 h-8 border-2 border-white rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center">AS</div>
               <div className="w-8 h-8 border-2 border-white rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center">+3</div>
            </div>
            <button className="hidden sm:flex px-4 h-9 text-xs border border-input bg-background hover:bg-accent rounded-md text-muted-foreground">Save as Draft</button>
            <button className="px-4 h-9 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90">Publish Flow</button>
          </div>
        </header>
        
        <main className="flex-1 min-h-0 relative">
          <Canvas />
        </main>
      </div>
    </div>
  );
}

