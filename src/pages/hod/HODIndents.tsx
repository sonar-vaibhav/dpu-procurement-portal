import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { useToast } from '@/hooks/use-toast';

interface IndentDetails {
  id: string;
  title: string;
  status: string;
  date: string;
  amount: string;
  department: string;
  budgetHead: string;
  priority: string;
  justification: string;
  requestedBy: string;
  items: any[];
  rejectionRemarks?: string;
}

const initialIndents = [
  {
    id: 'IND001',
    title: 'Laboratory Equipment - Microscopes',
    requestedBy: 'Dr. John Smith',
    department: 'Biology',
    amount: '₹25,000',
    date: '2024-01-15',
    status: 'approved',
    priority: 'high',
    budgetHead: 'Research Equipment',
    justification: 'Required for advanced research in cell biology',
    items: [
      {
        itemName: 'Microscope',
        description: 'High-resolution microscope for cell research',
        quantity: '2',
        make: 'Olympus',
        uom: 'Nos',
        stockInHand: '0',
        approxValue: '25000',
        purpose: 'Research'
      }
    ]
  },
  {
    id: 'IND002',
    title: 'Computer Lab Hardware',
    requestedBy: 'Prof. Sarah Wilson',
    department: 'Computer Science',
    amount: '₹45,000',
    date: '2024-01-14',
    status: 'pending_hod',
    priority: 'medium',
    budgetHead: 'IT Infrastructure',
    justification: 'Upgrading computer lab equipment for new courses',
    items: [
      {
        itemName: 'Desktop Computers',
        description: 'High-performance workstations',
        quantity: '5',
        make: 'Dell',
        uom: 'Nos',
        stockInHand: '2',
        approxValue: '45000',
        purpose: 'Teaching'
      }
    ]
  },
  {
    id: 'IND003',
    title: 'Office Supplies',
    requestedBy: 'Admin Staff',
    department: 'Administration',
    amount: '₹5,000',
    date: '2024-01-13',
    status: 'rejected',
    priority: 'low',
    budgetHead: 'Office Supplies',
    justification: 'Regular office supplies replenishment',
    items: [
      {
        itemName: 'Stationery',
        description: 'Office stationery items',
        quantity: '1',
        make: 'Local',
        uom: 'Lot',
        stockInHand: '0',
        approxValue: '5000',
        purpose: 'Office Use'
      }
    ]
  }
];

const HODIndents: React.FC = () => {
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [indentsList, setIndentsList] = useState(initialIndents);
  const { toast } = useToast();

  // Approve handler
  const handleApprove = (indentId: string) => {
    setIndentsList(prev => prev.map(indent =>
      indent.id === indentId ? { ...indent, status: 'approved' } : indent
    ));
    setSelectedIndent(null);
    toast({
      title: 'Indent Approved',
      description: `Indent ${indentId} has been approved.`,
    });
  };

  // Reject handler
  const handleReject = (indentId: string, remarks: string) => {
    setIndentsList(prev => prev.map(indent =>
      indent.id === indentId ? { ...indent, status: 'rejected', rejectionRemarks: remarks } : indent
    ));
    setSelectedIndent(null);
    toast({
      title: 'Indent Rejected',
      description: `Indent ${indentId} has been rejected.`,
      variant: 'destructive',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'bg-yellow-100 text-yellow-800';
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'Pending HOD';
      case 'pending_store': return 'Pending Store';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const filteredIndents = indentsList.filter(indent => {
    const matchesSearch = indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indent.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || indent.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="All Indents"
        subtitle="View and manage all department indents"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Indents</CardTitle>
            <CardDescription>Complete list of indents under your supervision</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Search by title, ID, or requester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_hod">Pending HOD</SelectItem>
                  <SelectItem value="pending_store">Pending Store</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indents List */}
            <div className="space-y-4">
              {filteredIndents.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={getStatusColor(indent.status)}>
                          {getStatusText(indent.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> {indent.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {indent.amount}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {indent.date}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedIndent(indent)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <IndentDetailsModal
        isOpen={!!selectedIndent}
        onClose={() => setSelectedIndent(null)}
        indent={selectedIndent}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </DashboardLayout>
  );
};

export default HODIndents;
