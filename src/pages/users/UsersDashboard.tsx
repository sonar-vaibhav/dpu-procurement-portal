import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import CreateIndentModal from '@/components/modals/CreateIndentModal';
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

const UsersDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<IndentDetails | null>(null);

  const stats = {
    totalIndents: 12,
    approvedIndents: 8,
    pendingIndents: 3,
    rejectedIndents: 1
  };

  const recentIndents: IndentDetails[] = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment',
      status: 'pending_hod',
      date: '2024-01-15',
      amount: '₹25,000',
      department: 'Biology',
      budgetHead: 'Research Equipment',
      priority: 'high',
      justification: 'Required for advanced research in cell biology',
      requestedBy: 'Dr. John Smith',
      items: []
    },
    {
      id: 'IND002',
      title: 'Office Supplies',
      status: 'approved',
      date: '2024-01-10',
      amount: '₹5,000',
      department: 'Administration',
      budgetHead: 'Office Supplies',
      priority: 'low',
      justification: 'Regular office supplies replenishment',
      requestedBy: 'Admin Staff',
      items: []
    },
    {
      id: 'IND003',
      title: 'Computer Hardware',
      status: 'pending_principal',
      date: '2024-01-08',
      amount: '₹45,000',
      department: 'Computer Science',
      budgetHead: 'IT Infrastructure',
      priority: 'medium',
      justification: 'Upgrading computer lab equipment for new courses',
      requestedBy: 'Prof. Sarah Wilson',
      items: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'bg-yellow-100 text-yellow-800';
      case 'pending_principal': return 'bg-orange-100 text-orange-800';
      case 'pending_store': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected_hod':
      case 'rejected_principal':
      case 'rejected_store':
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_hod': return 'Pending HOD';
      case 'pending_principal': return 'Pending Principal';
      case 'pending_store': return 'Pending Store';
      case 'approved': return 'Approved';
      case 'rejected_hod': return 'Rejected by HOD';
      case 'rejected_principal': return 'Rejected by Principal';
      case 'rejected_store': return 'Rejected by Store';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const handleCreateIndent = (data: any) => {
    console.log('Creating indent:', data);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your procurement dashboard"
        action={
          <Button
            className="bg-dpu-red hover:bg-dpu-red-dark text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Indent
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalIndents}</div>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approvedIndents}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingIndents}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejectedIndents}</div>
              <p className="text-xs text-gray-500 mt-1">Need revision</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Indents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Indents</CardTitle>
                <CardDescription>Your latest procurement requests</CardDescription>
              </div>
              <Button variant="outline" onClick={() => navigate('/users/indents')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndents.map((indent) => (
                <div
                  key={indent.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{indent.title}</h4>
                      <Badge className={getStatusColor(indent.status)}>
                        {getStatusText(indent.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>ID: {indent.id}</span>
                      <span>Date: {indent.date}</span>
                      <span>Amount: {indent.amount}</span>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateIndentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateIndent}
      />

      <IndentDetailsModal
        isOpen={!!selectedIndent}
        onClose={() => setSelectedIndent(null)}
        indent={selectedIndent}
      />
    </DashboardLayout>
  );
};

export default UsersDashboard;
