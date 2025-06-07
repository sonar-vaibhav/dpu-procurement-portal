
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const HODDashboard: React.FC = () => {
  const { toast } = useToast();

  const pendingApprovals = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      date: '2024-01-15',
      priority: 'high'
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      date: '2024-01-14',
      priority: 'medium'
    },
    {
      id: 'IND003',
      title: 'Office Supplies',
      requestedBy: 'Admin Staff',
      department: 'Administration',
      amount: '₹5,000',
      date: '2024-01-13',
      priority: 'low'
    }
  ];

  const handleApprove = (indentId: string) => {
    toast({
      title: "Indent Approved",
      description: `Indent ${indentId} has been approved and forwarded to Store Department`,
    });
  };

  const handleReject = (indentId: string) => {
    toast({
      title: "Indent Rejected",
      description: `Indent ${indentId} has been rejected`,
      variant: "destructive",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="HOD Dashboard"
        subtitle="Review and approve department procurement requests"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-gray-500 mt-1">Require your action</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">15</div>
              <p className="text-xs text-gray-500 mt-1">₹2,45,000 value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">68%</div>
              <p className="text-xs text-gray-500 mt-1">₹6,80,000 of ₹10,00,000</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Procurement requests waiting for your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={getPriorityColor(indent.priority)}>
                          {indent.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> {indent.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {indent.amount}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500">Date: {indent.date}</p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(indent.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="dpu-button-primary"
                        onClick={() => handleApprove(indent.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Approved indent IND004 for ₹12,000</span>
                <span className="text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Rejected indent IND005 - insufficient justification</span>
                <span className="text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">New indent IND006 received from Dr. Brown</span>
                <span className="text-gray-400">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;
