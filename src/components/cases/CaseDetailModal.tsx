import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Case } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useState } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Calendar, DollarSign, Phone, Mail, User, Clock } from 'lucide-react';

interface CaseDetailModalProps {
  case: Case | null;
  open: boolean;
  onClose: () => void;
}

export const CaseDetailModal = ({ case: caseData, open, onClose }: CaseDetailModalProps) => {
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<Case['status']>(caseData?.status || 'assigned');
  const { addCaseNote, updateCaseStatus } = useDataStore();
  const { user } = useAuthStore();

  if (!caseData) return null;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addCaseNote(caseData.id, newNote, user?.name || 'User');
    setNewNote('');
    toast.success('Note added successfully');
  };

  const handleStatusUpdate = () => {
    if (newStatus === caseData.status) return;
    updateCaseStatus(caseData.id, newStatus, user?.name || 'User');
    toast.success('Status updated successfully');
  };

  const getStatusColor = (status: Case['status']) => {
    const colors = {
      assigned: 'bg-primary',
      'follow-up': 'bg-warning',
      resolved: 'bg-success',
      closed: 'bg-muted',
      overdue: 'bg-destructive'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Case['priority']) => {
    const colors = {
      low: 'bg-muted',
      medium: 'bg-primary',
      high: 'bg-warning',
      critical: 'bg-destructive'
    };
    return colors[priority];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{caseData.loanId}</DialogTitle>
              <p className="text-muted-foreground">{caseData.customerName}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(caseData.status)}>
                {caseData.status}
              </Badge>
              <Badge className={getPriorityColor(caseData.priority)}>
                {caseData.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Borrower Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{caseData.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{caseData.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{caseData.customerEmail}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Principal Amount</p>
                  <p className="text-2xl font-bold">
                    ${caseData.principalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Amount</p>
                  <p className="text-2xl font-bold text-warning">
                    ${caseData.outstandingAmount.toLocaleString()}
                  </p>
                </div>
                {caseData.overdueAmount > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue Amount</p>
                    <p className="text-2xl font-bold text-destructive">
                      ${caseData.overdueAmount.toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(caseData.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Case['status'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleStatusUpdate} disabled={newStatus === caseData.status}>
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {caseData.paymentHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No payment history</p>
                ) : (
                  <div className="space-y-3">
                    {caseData.paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">${payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={payment.status === 'success' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.timeline.map((event, index) => (
                    <div key={event.id}>
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          {index < caseData.timeline.length - 1 && (
                            <div className="w-px h-full bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Type your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote}>Add Note</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Previous Notes</CardTitle>
              </CardHeader>
              <CardContent>
                {caseData.notes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No notes yet</p>
                ) : (
                  <div className="space-y-4">
                    {caseData.notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-3">
                        <p className="text-sm">{note.content}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>{note.createdBy}</span>
                          <span>{format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
