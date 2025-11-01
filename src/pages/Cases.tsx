import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CaseFilters } from '@/components/cases/CaseFilters';
import { CaseDetailModal } from '@/components/cases/CaseDetailModal';
import { useDataStore } from '@/store/dataStore';
import { Case, CaseStatus, CasePriority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

export default function Cases() {
  const { cases } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<CasePriority | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Case>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredCases = useMemo(() => {
    let filtered = cases;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.customerName.toLowerCase().includes(query) ||
          c.loanId.toLowerCase().includes(query) ||
          c.customerEmail.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue > bValue ? direction : -direction;
    });

    return filtered;
  }, [cases, searchQuery, statusFilter, priorityFilter, sortField, sortDirection]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, currentPage]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  const handleSort = (field: keyof Case) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    const colors = {
      assigned: 'default',
      'follow-up': 'secondary',
      resolved: 'default',
      closed: 'secondary',
      overdue: 'destructive'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: CasePriority) => {
    const colors = {
      low: 'secondary',
      medium: 'default',
      high: 'secondary',
      critical: 'destructive'
    };
    return colors[priority];
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Case Management</h1>
          <p className="text-muted-foreground">View and manage debt collection cases</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <CaseFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cases ({filteredCases.length})</CardTitle>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('loanId')} className="p-0 h-auto font-semibold">
                        Loan ID <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('customerName')} className="p-0 h-auto font-semibold">
                        Customer <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('outstandingAmount')} className="p-0 h-auto font-semibold">
                        Outstanding <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('dueDate')} className="p-0 h-auto font-semibold">
                        Due Date <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCases.map((caseItem) => (
                    <TableRow
                      key={caseItem.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      <TableCell className="font-medium">{caseItem.loanId}</TableCell>
                      <TableCell>{caseItem.customerName}</TableCell>
                      <TableCell>${caseItem.outstandingAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(caseItem.status) as any}>
                          {caseItem.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(caseItem.priority) as any}>
                          {caseItem.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(caseItem.dueDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {caseItem.assignedAgent}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CaseDetailModal
        case={selectedCase}
        open={!!selectedCase}
        onClose={() => setSelectedCase(null)}
      />
    </MainLayout>
  );
}
