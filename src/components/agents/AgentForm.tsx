import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent } from '@/types';
import { useState, useEffect } from 'react';
import { useDataStore } from '@/store/dataStore';
import { toast } from 'sonner';

interface AgentFormProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
}

export const AgentForm = ({ agent, open, onClose }: AgentFormProps) => {
  const { addAgent, updateAgent } = useDataStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        status: agent.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'active'
      });
    }
  }, [agent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (agent) {
      updateAgent(agent.id, formData);
      toast.success('Agent updated successfully');
    } else {
      addAgent({
        ...formData,
        assignedCases: 0,
        recoveryRate: 0,
        totalRecovered: 0,
        joinedDate: new Date().toISOString()
      });
      toast.success('Agent added successfully');
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{agent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {agent ? 'Update' : 'Add'} Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
