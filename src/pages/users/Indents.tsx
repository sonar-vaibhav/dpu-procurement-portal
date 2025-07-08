import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreateIndentModal from '@/components/modals/CreateIndentModal';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';

interface IndentItem {
  itemName: string;
  specification?: string;
  description: string;
  quantity: string;
  make: string;
  uom: string;
  stockInHand: string;
  approxValue: string;
  purpose: string;
  similarItemPurchased?: string;
  vendorQuotationUrl?: string;
}

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
  items: IndentItem[];
}

const Indents: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const indents: IndentDetails[] = [
    {
      id: 'IND001',
      title: 'Microscope Purchase',
      status: 'pending_hod',
      date: '2024-06-01',
      amount: '₹25,000',
      department: 'Biology',
      budgetHead: 'Lab Equipment',
      priority: 'high',
      justification: 'For advanced cell studies',
      requestedBy: 'Dr. John Smith',
      items: [
        {
          itemName: 'Microscope',
          specification: '40x Optical Zoom',
          description: 'High-resolution microscope',
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
      title: 'Projector for Seminar Hall',
      status: 'pending_principal',
      date: '2024-06-05',
      amount: '₹40,000',
      department: 'IT',
      budgetHead: 'Teaching Aids',
      priority: 'medium',
      justification: 'Need projector for seminar',
      requestedBy: 'Prof. Sharma',
      items: [
        {
          itemName: 'Epson Projector',
          specification: 'Full HD, HDMI, 4000 Lumens',
          description: 'For presentations',
          quantity: '1',
          make: 'Epson',
          uom: 'Nos',
          stockInHand: '0',
          approxValue: '40000',
          purpose: 'Seminar'
        }
      ]
    },
    {
      id: 'IND003',
      title: 'Computer Hardware',
      status: 'rejected_principal',
      date: '2024-06-10',
      amount: '₹45,000',
      department: 'Computer Science',
      budgetHead: 'IT Infrastructure',
      priority: 'medium',
      justification: 'Upgrade lab',
      requestedBy: 'Prof. Sarah Wilson',
      items: [
        {
          itemName: 'Desktop PC',
          description: 'High-performance workstation',
          quantity: '3',
          make: 'Dell',
          uom: 'Nos',
          stockInHand: '1',
          approxValue: '45000',
          purpose: 'Teaching'
        }
      ]
    },
    {
      id: 'IND004',
      title: 'Whiteboard Markers',
      status: 'approved',
      date: '2024-06-02',
      amount: '₹2,000',
      department: 'Admin',
      budgetHead: 'Office Supplies',
      priority: 'low',
      justification: 'Monthly stationery',
      requestedBy: 'Admin Dept',
      items: [
        {
          itemName: 'Markers',
          description: 'Pack of 12',
          quantity: '10',
          make: 'Camlin',
          uom: 'Box',
          stockInHand: '2',
          approxValue: '2000',
          purpose: 'Office use'
        }
      ]
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'Pending HOD';
      case 'pending_principal': return 'Pending Principal';
      case 'pending_store': return 'Pending Store';
      case 'rejected_hod': return 'Rejected by HOD';
      case 'rejected_principal': return 'Rejected by Principal';
      case 'rejected_store': return 'Rejected by Store';
      case 'approved': return 'Approved';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'bg-yellow-100 text-yellow-800';
      case 'pending_principal': return 'bg-orange-100 text-orange-800';
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'rejected_hod':
      case 'rejected_principal':
      case 'rejected_store':
        return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIndents = indents.filter(indent => {
    const matchesSearch = indent.title.toLowerCase().includes(searchTerm.toLowerCase()) || indent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || indent.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="My Indents"
        subtitle="Track and manage your procurement requests"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-dpu-red text-white hover:bg-dpu-red-dark">
            Create New Indent
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Indents</CardTitle>
            <CardDescription>View and manage your procurement requests</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Search by title or ID..."
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
                  <SelectItem value="pending_principal">Pending Principal</SelectItem>
                  <SelectItem value="pending_store">Pending Store</SelectItem>
                  <SelectItem value="rejected_hod">Rejected by HOD</SelectItem>
                  <SelectItem value="rejected_principal">Rejected by Principal</SelectItem>
                  <SelectItem value="rejected_store">Rejected by Store</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
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

            {/* Indent Cards */}
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
                        <div><strong>ID:</strong> {indent.id}</div>
                        <div><strong>Amount:</strong> {indent.amount}</div>
                        <div><strong>Date:</strong> {indent.date}</div>
                        <div><strong>Priority:</strong> {indent.priority}</div>
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

      <CreateIndentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => console.log('Indent Created:', data)}
      />

      <IndentDetailsModal
        isOpen={!!selectedIndent}
        onClose={() => setSelectedIndent(null)}
        indent={selectedIndent}
      />
    </DashboardLayout>
  );
};

export default Indents;
