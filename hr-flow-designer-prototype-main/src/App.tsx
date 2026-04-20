import React from 'react';
import { Canvas } from './components/workflow/Canvas';
import { LayoutDashboard, Users, Workflow, HelpCircle } from 'lucide-react';
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  MobileSidebarTrigger,
  SidebarItem,
  Button,
  Avatar,
  AvatarFallback,
  cn
} from '@blinkdotnew/ui';

export default function App() {
  return (
    <AppShell>
      <AppShellSidebar className="shrink-0">
        <div className="flex flex-col h-full w-64 bg-background border-r border-border overflow-hidden">
          <div className="shrink-0 border-b border-border px-6 h-16 flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-md">
              <Workflow size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">HRFlow <span className="text-primary font-black">Pro</span></span>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-1">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="#" />
            <SidebarItem icon={<Workflow size={18} />} label="Flow Designer" href="#" active />
            <SidebarItem icon={<Users size={18} />} label="HR Members" href="#" />
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
               <Button variant="outline" size="sm" className="w-full text-[10px] h-8">
                 Documentation
               </Button>
             </div>
          </div>
        </div>
      </AppShellSidebar>
      
      <AppShellMain className="h-screen flex flex-col overflow-hidden">
        <header className="h-16 shrink-0 border-b bg-white flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <MobileSidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-xl font-bold">New Employee Onboarding</h1>
              <p className="text-xs text-muted-foreground font-medium">Draft Workflow • Last saved 2m ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center -space-x-2 mr-4">
               <Avatar className="w-8 h-8 border-2 border-white ring-0">
                 <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px] font-bold">JD</AvatarFallback>
               </Avatar>
               <Avatar className="w-8 h-8 border-2 border-white ring-0">
                 <AvatarFallback className="bg-green-100 text-green-700 text-[10px] font-bold">AS</AvatarFallback>
               </Avatar>
               <Avatar className="w-8 h-8 border-2 border-white ring-0">
                 <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">+3</AvatarFallback>
               </Avatar>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">Save as Draft</Button>
            <Button size="sm">Publish Flow</Button>
          </div>
        </header>
        
        <main className="flex-1 min-h-0 relative">
          <Canvas />
        </main>
      </AppShellMain>
    </AppShell>
  );
}
