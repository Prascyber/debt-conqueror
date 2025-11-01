export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedCases: number;
  recoveryRate: number;
  totalRecovered: number;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export type CaseStatus = 'assigned' | 'follow-up' | 'resolved' | 'closed' | 'overdue';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';

export interface Case {
  id: string;
  loanId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  principalAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  dueDate: string;
  status: CaseStatus;
  priority: CasePriority;
  assignedAgent: string;
  assignedAgentId: string;
  lastContactDate: string;
  nextFollowUpDate: string;
  createdAt: string;
  notes: CaseNote[];
  paymentHistory: Payment[];
  timeline: TimelineEvent[];
}

export interface CaseNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: 'success' | 'pending' | 'failed';
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'assignment' | 'contact' | 'payment' | 'status_change' | 'note';
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'case_update' | 'agent_update' | 'login' | 'logout' | 'system';
}

export interface DashboardKPI {
  totalCases: number;
  resolvedCases: number;
  pendingAmount: number;
  agentEfficiency: number;
  overduePayments: number;
  recoveryRate: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}
