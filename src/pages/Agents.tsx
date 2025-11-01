import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AgentForm } from '@/components/agents/AgentForm';
import { useDataStore } from '@/store/dataStore';
import { Agent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, TrendingUp, Briefcase, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Agents() {
  const { agents, deleteAgent } = useDataStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedAgent(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (agentToDelete) {
      deleteAgent(agentToDelete.id);
      toast.success('Agent deleted successfully');
      setAgentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Management</h1>
            <p className="text-muted-foreground">Manage your collection agents</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agents.length}</div>
              <p className="text-xs text-muted-foreground">
                {agents.filter(a => a.status === 'active').length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Recovery Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(agents.reduce((sum, a) => sum + a.recoveryRate, 0) / agents.length || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Across all agents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(agents.reduce((sum, a) => sum + a.totalRecovered, 0) / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">Lifetime recovery</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Cases</TableHead>
                    <TableHead>Recovery Rate</TableHead>
                    <TableHead>Total Recovered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.email}</TableCell>
                      <TableCell>{agent.phone}</TableCell>
                      <TableCell>{agent.assignedCases}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-success"
                              style={{ width: `${agent.recoveryRate}%` }}
                            />
                          </div>
                          <span className="text-sm">{agent.recoveryRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>${agent.totalRecovered.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(agent.joinedDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(agent)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(agent)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AgentForm
        agent={selectedAgent}
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAgent(null);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent "{agentToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
