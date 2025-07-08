import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';

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
}

const AccountIndents: React.FC = () => {
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [indents, setIndents] = useState<IndentDetails[]>([
    {
      id: 'IND004',
      title: 'Annual Budget Verification',
      requestedBy: 'Finance Dept',
      department: 'Accounts',
      amount: '₹1,20,000',
      date: '2024-01-16',
      status: 'pending_account',
      priority: 'high',
      budgetHead: 'Budget Verification',
      justification: 'Annual verification of departmental budgets',
      items: [
        {
          itemName: 'Budget Forms',
          description: 'Pre-printed budget verification forms',
          quantity: '500',
          make: 'GovPrint',
          uom: 'Units',
          stockInHand: '50',
          approxValue: '120000',
          purpose: 'Accounts audit'
        }
      ]
    },
    {
      id: 'IND005',
      title: 'Tax Filing Software',
      requestedBy: 'Account Officer',
      department: 'Accounts',
      amount: '₹35,000',
      date: '2024-01-12',
      status: 'approved',
      priority: 'medium',
      budgetHead: 'IT Tools',
      justification: 'Software for GST and income tax filings',
      items: [
        {
          itemName: 'TaxPro Suite',
          description: 'Complete taxation suite',
          quantity: '1',
          make: 'TaxSoft',
          uom: 'License',
          stockInHand: '0',
          approxValue: '35000',
          purpose: 'Compliance'
        }
      ]
    }
  ]);

  const handleApprove = (id: string) => {
    setIndents(prev =>
      prev.map(indent =>
        indent.id === id ? { ...indent, status: 'approved' } : indent
      )
    );
    setSelectedIndent(null);
  };

  const handleReject = (id: string, remarks: string) => {
    setIndents(prev =>
      prev.map(indent =>
        indent.id === id ? { ...indent, status: 'rejected' } : indent
      )
    );
    setSelectedIndent(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_account': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_account': return 'Pending Account';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const filteredIndents = indents.filter(indent => {
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
        title="Account Indents"
        subtitle="Review, approve or reject departmental indents"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Indents for Verification</CardTitle>
            <CardDescription>Filter and manage budget-related indents</CardDescription>
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
                  <SelectItem value="pending_account">Pending Account</SelectItem>
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
                        <div><span className="font-medium">ID:</span> {indent.id}</div>
                        <div><span className="font-medium">Requested by:</span> {indent.requestedBy}</div>
                        <div><span className="font-medium">Amount:</span> {indent.amount}</div>
                        <div><span className="font-medium">Date:</span> {indent.date}</div>
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
        userRole="account"
      />
    </DashboardLayout>
  );
};

export default AccountIndents;
