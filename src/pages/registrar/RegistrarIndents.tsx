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
  approvalTrail: string[];
}

const RegistrarIndents: React.FC = () => {
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const indents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Biology',
      amount: '₹25,000',
      date: '2024-01-16',
      status: 'approved',
      priority: 'high',
      budgetHead: 'Lab Equipment Fund',
      justification: 'Required for advanced research in cell biology',
      requestedBy: 'Dr. John Smith',
      approvalTrail: ['User', 'HOD', 'Store', 'Registrar'],
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
      department: 'Computer Science',
      amount: '₹45,000',
      date: '2024-01-15',
      status: 'pending_registrar',
      priority: 'high',
      budgetHead: 'Infrastructure Fund',
      justification: 'Upgrading computer lab equipment for new courses',
      requestedBy: 'Prof. Sarah Wilson',
      approvalTrail: ['User', 'HOD', 'Store'],
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
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_registrar': return 'bg-yellow-100 text-yellow-800';
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_registrar': return 'Pending Registrar';
      case 'pending_store': return 'Pending Store';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const filteredIndents = indents.filter(indent => {
    const matchesSearch = indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || indent.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Registrar Indents"
        subtitle="Track all institute-level approvals and decisions"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Institute Approval Records</CardTitle>
            <CardDescription>All indents processed at registrar level</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Search by title, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_registrar">Pending Registrar</SelectItem>
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {indent.amount}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {indent.date}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Budget Head:</span> {indent.budgetHead}
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
      />
    </DashboardLayout>
  );
};

export default RegistrarIndents;
