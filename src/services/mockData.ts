import { Case, Agent, CaseStatus, CasePriority } from '@/types';

const customerNames = [
  'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 
  'Robert Wilson', 'Jessica Martinez', 'David Anderson', 'Jennifer Taylor',
  'William Thomas', 'Lisa Garcia', 'James Rodriguez', 'Mary Lee',
  'Christopher White', 'Patricia Harris', 'Daniel Clark', 'Nancy Lewis'
];

const statuses: CaseStatus[] = ['assigned', 'follow-up', 'resolved', 'closed', 'overdue'];
const priorities: CasePriority[] = ['low', 'medium', 'high', 'critical'];

const agentNames = [
  { name: 'Alex Thompson', email: 'alex.thompson@esolve.com' },
  { name: 'Maria Rodriguez', email: 'maria.rodriguez@esolve.com' },
  { name: 'James Wilson', email: 'james.wilson@esolve.com' },
  { name: 'Sarah Chen', email: 'sarah.chen@esolve.com' },
  { name: 'Michael Brown', email: 'michael.brown@esolve.com' }
];

export const generateMockAgents = (): Agent[] => {
  return agentNames.map((agent, index) => ({
    id: `agent-${index + 1}`,
    name: agent.name,
    email: agent.email,
    phone: `+1 555-${(index + 1).toString().padStart(4, '0')}`,
    assignedCases: Math.floor(Math.random() * 50) + 10,
    recoveryRate: Math.floor(Math.random() * 40) + 60,
    totalRecovered: Math.floor(Math.random() * 500000) + 100000,
    status: Math.random() > 0.2 ? 'active' : 'inactive',
    joinedDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
  }));
};

export const generateMockCases = (agents: Agent[]): Case[] => {
  const cases: Case[] = [];
  
  for (let i = 0; i < 150; i++) {
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const principalAmount = Math.floor(Math.random() * 50000) + 5000;
    const outstandingAmount = principalAmount * (Math.random() * 0.8 + 0.2);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30);
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));
    
    cases.push({
      id: `case-${i + 1}`,
      loanId: `LN${(1000 + i).toString()}`,
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      customerPhone: `+1 555-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerEmail: `customer${i}@example.com`,
      principalAmount,
      outstandingAmount,
      overdueAmount: status === 'overdue' ? outstandingAmount * 0.3 : 0,
      dueDate: dueDate.toISOString(),
      status,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignedAgent: agent.name,
      assignedAgentId: agent.id,
      lastContactDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextFollowUpDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: createdDate.toISOString(),
      notes: [],
      paymentHistory: [
        {
          id: `payment-${i}-1`,
          amount: principalAmount * 0.2,
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          method: 'Bank Transfer',
          status: 'success'
        }
      ],
      timeline: [
        {
          id: `timeline-${i}-1`,
          title: 'Case Assigned',
          description: `Case assigned to ${agent.name}`,
          timestamp: createdDate.toISOString(),
          type: 'assignment'
        }
      ]
    });
  }
  
  return cases;
};
