# HR Workflow Designer Prototype

A powerful, visual HR Workflow Designer module built with React, React Flow, and TypeScript.

## 🚀 Overview

This prototype allows HR admins to visually build, configure, and test internal workflows such as onboarding, leave approvals, or document verification. It features a drag-and-drop canvas, dynamic configuration forms, and a real-time simulation sandbox.

## 🏗️ Architecture

### 1. Visual Layer (React Flow)
- **Custom Nodes**: Tailored node components for `Start`, `Task`, `Approval`, `Automated Step`, and `End`.
- **Interactions**: Drag-and-drop from sidebar, node selection, edge connections, and deletion.
- **Canvas State**: Managed via a custom `useWorkflow` hook that wraps React Flow's state management.

### 2. Configuration Layer (React Hook Form)
- **Dynamic Forms**: A centralized `PropertiesPanel` that dynamically renders fields based on the selected node's type.
- **State Synchronization**: Changes in the form are instantly synced back to the node's data in the canvas.
- **Mock Actions**: Automated steps fetch available actions from a mock API layer.

### 3. Logic Layer (Mock API & Simulation)
- **Mock API**: Simulates network requests for fetching automations and running simulations.
- **Simulation Engine**: Performs a graph traversal (BFS) to validate structure, check reachability of End nodes, and simulate execution steps.

### 4. Components & UI
- **UI Library**: Leverages a high-quality SaaS UI library for components like Buttons, Inputs, Cards, and Selects.
- **Tailwind CSS**: Used for layout and micro-interactions.
- **Lucide React**: For semantic iconography.

## 📂 Project Structure

```text
src/
├── components/
│   └── workflow/
│       ├── nodes/             # Custom React Flow node components
│       ├── Canvas.tsx         # Main Workflow canvas container
│       ├── Sidebar.tsx        # Draggable node source
│       ├── PropertiesPanel.tsx # Dynamic configuration forms
│       └── SimulationPanel.tsx# Simulation sandbox UI
├── hooks/
│   └── useWorkflow.ts         # Central state management hook
├── lib/
│   └── workflow/
│       ├── mockApi.ts         # Mock backend integration
│       └── types.ts           # TypeScript interfaces & types
├── App.tsx                    # Main layout and shell
└── main.tsx                   # App providers entry point
```

## 🛠️ Key Features

- **Drag & Drop**: Easily add steps to your workflow.
- **Visual Validation**: Connect handles to define the logic flow.
- **Canvas Constraints**: 
    - Only one **Start Node** is allowed.
    - Prevented connections to the Start node (entry only).
    - Prevented connections from the End node (exit only).
- **Export & Import**: Save your progress by exporting to JSON and reload workflows instantly.
- **Smart Configurations**:
    - **Task Nodes**: Assign users, set descriptions, and due dates + custom fields.
    - **Approval Nodes**: Set approver roles and approval thresholds.
    - **Automated Steps**: Choose from system-triggered actions with dynamic parameters.
- **Sandbox Testing**: Click "Simulate Workflow" to run a structural analysis and see a step-by-step execution log in a timeline UI.

## 📝 Design Choices & Assumptions

- **Local Persistence**: State is maintained in-memory for the duration of the session.
- **Validation**: Simulation includes basic graph validation (Start node existence, End node reachability).
- **Extensibility**: The form architecture allows for adding new node types by simply updating the `WorkflowNodeData` interface and adding a case in the `NodeForm`.
