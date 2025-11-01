import { create } from 'zustand';
import { Case, Agent, Activity } from '@/types';
import { generateMockAgents, generateMockCases } from '@/services/mockData';

interface DataState {
  cases: Case[];
  agents: Agent[];
  activities: Activity[];
  isInitialized: boolean;
  initialize: () => void;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  addCaseNote: (caseId: string, note: string, userName: string) => void;
  updateCaseStatus: (caseId: string, status: Case['status'], userName: string) => void;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  cases: [],
  agents: [],
  activities: [],
  isInitialized: false,

  initialize: () => {
    if (get().isInitialized) return;
    
    const agents = generateMockAgents();
    const cases = generateMockCases(agents);
    
    set({ 
      agents, 
      cases,
      isInitialized: true,
      activities: [
        {
          id: 'activity-1',
          userId: '1',
          userName: 'Admin User',
          action: 'System Initialized',
          details: 'Dashboard system initialized successfully',
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ]
    });
  },

  updateCase: (caseId, updates) => {
    set((state) => ({
      cases: state.cases.map((c) => 
        c.id === caseId ? { ...c, ...updates } : c
      )
    }));
  },

  addCaseNote: (caseId, note, userName) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content: note,
      createdBy: userName,
      createdAt: new Date().toISOString()
    };

    const newTimelineEvent = {
      id: `timeline-${Date.now()}`,
      title: 'Note Added',
      description: note,
      timestamp: new Date().toISOString(),
      type: 'note' as const
    };

    set((state) => ({
      cases: state.cases.map((c) => 
        c.id === caseId 
          ? { 
              ...c, 
              notes: [...c.notes, newNote],
              timeline: [...c.timeline, newTimelineEvent]
            } 
          : c
      )
    }));

    get().addActivity({
      userId: '1',
      userName,
      action: 'Added note to case',
      details: `Added note to case ${caseId}`,
      type: 'case_update'
    });
  },

  updateCaseStatus: (caseId, status, userName) => {
    const caseItem = get().cases.find(c => c.id === caseId);
    if (!caseItem) return;

    const newTimelineEvent = {
      id: `timeline-${Date.now()}`,
      title: 'Status Changed',
      description: `Status changed from ${caseItem.status} to ${status}`,
      timestamp: new Date().toISOString(),
      type: 'status_change' as const
    };

    set((state) => ({
      cases: state.cases.map((c) => 
        c.id === caseId 
          ? { 
              ...c, 
              status,
              timeline: [...c.timeline, newTimelineEvent]
            } 
          : c
      )
    }));

    get().addActivity({
      userId: '1',
      userName,
      action: 'Updated case status',
      details: `Updated case ${caseItem.loanId} status to ${status}`,
      type: 'case_update'
    });
  },

  addAgent: (agent) => {
    const newAgent = {
      ...agent,
      id: `agent-${Date.now()}`
    };

    set((state) => ({
      agents: [...state.agents, newAgent]
    }));

    get().addActivity({
      userId: '1',
      userName: 'Admin User',
      action: 'Added new agent',
      details: `Added agent ${agent.name}`,
      type: 'agent_update'
    });
  },

  updateAgent: (agentId, updates) => {
    set((state) => ({
      agents: state.agents.map((a) => 
        a.id === agentId ? { ...a, ...updates } : a
      )
    }));

    get().addActivity({
      userId: '1',
      userName: 'Admin User',
      action: 'Updated agent',
      details: `Updated agent ${agentId}`,
      type: 'agent_update'
    });
  },

  deleteAgent: (agentId) => {
    const agent = get().agents.find(a => a.id === agentId);
    
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== agentId)
    }));

    if (agent) {
      get().addActivity({
        userId: '1',
        userName: 'Admin User',
        action: 'Deleted agent',
        details: `Deleted agent ${agent.name}`,
        type: 'agent_update'
      });
    }
  },

  addActivity: (activity) => {
    const newActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    set((state) => ({
      activities: [newActivity, ...state.activities].slice(0, 100) // Keep last 100 activities
    }));
  }
}));
