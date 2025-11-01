import { KPICard } from '@/components/dashboard/KPICard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDataStore } from '@/store/dataStore';
import { Briefcase, CheckCircle, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { cases, agents } = useDataStore();

  const kpis = useMemo(() => {
    const totalCases = cases.length;
    const resolvedCases = cases.filter(c => c.status === 'resolved' || c.status === 'closed').length;
    const pendingAmount = cases.reduce((sum, c) => sum + c.outstandingAmount, 0);
    const overduePayments = cases.filter(c => c.status === 'overdue').length;
    const totalRecovered = cases
      .filter(c => c.status === 'resolved' || c.status === 'closed')
      .reduce((sum, c) => sum + (c.principalAmount - c.outstandingAmount), 0);
    const totalPrincipal = cases.reduce((sum, c) => sum + c.principalAmount, 0);
    const recoveryRate = totalPrincipal > 0 ? (totalRecovered / totalPrincipal) * 100 : 0;

    return {
      totalCases,
      resolvedCases,
      pendingAmount,
      overduePayments,
      recoveryRate
    };
  }, [cases]);

  const casesByStatusData = useMemo(() => {
    const statusCounts = cases.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  }, [cases]);

  const monthlyRecoveryData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      value: Math.floor(Math.random() * 500000) + 100000
    }));
  }, []);

  const agentPerformanceData = useMemo(() => {
    return agents.slice(0, 5).map(agent => ({
      name: agent.name.split(' ')[0],
      value: agent.recoveryRate
    }));
  }, [agents]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your debt collection performance</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Cases"
            value={kpis.totalCases}
            icon={Briefcase}
            variant="default"
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Resolved Cases"
            value={kpis.resolvedCases}
            icon={CheckCircle}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <KPICard
            title="Pending Amount"
            value={`$${(kpis.pendingAmount / 1000).toFixed(0)}K`}
            icon={DollarSign}
            variant="warning"
            trend={{ value: 5, isPositive: false }}
          />
          <KPICard
            title="Recovery Rate"
            value={`${kpis.recoveryRate.toFixed(1)}%`}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {kpis.overduePayments > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium">Attention Required</p>
              <p className="text-sm text-muted-foreground">
                You have {kpis.overduePayments} overdue payments that need immediate attention
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <AnalyticsChart
            title="Cases by Status"
            description="Distribution of cases across different stages"
            data={casesByStatusData}
            type="pie"
          />
          <AnalyticsChart
            title="Monthly Recovery Trend"
            description="Amount recovered over the last 6 months"
            data={monthlyRecoveryData}
            type="line"
          />
        </div>

        <AnalyticsChart
          title="Agent Performance"
          description="Recovery rate by top agents"
          data={agentPerformanceData}
          type="bar"
        />
      </div>
    </MainLayout>
  );
}
