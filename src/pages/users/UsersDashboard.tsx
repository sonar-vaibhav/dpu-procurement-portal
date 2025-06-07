
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const UsersDashboard: React.FC = () => {
  const navigate = useNavigate();

  const recentIndents = [
    { id: 'IND001', title: 'Laboratory Equipment', status: 'pending_hod', date: '2024-01-15', amount: '₹25,000' },
    { id: 'IND002', title: 'Office Supplies', status: 'approved', date: '2024-01-10', amount: '₹5,000' },
    { id: 'IND003', title: 'Computer Hardware', status: 'pending_store', date: '2024-01-08', amount: '₹45,000' }
  ];

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

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your procurement dashboard"
        action={
          <Button 
            className="dpu-button-primary"
            onClick={() => navigate('/users/create-indent')}
          >
            Create New Indent
          </Button>
        }
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-500 mt-1">+2 this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-gray-500 mt-1">₹1,45,000 value</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Indents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Indents</CardTitle>
            <CardDescription>Your latest procurement requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndents.map((indent) => (
                <div key={indent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
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
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 justify-start"
                onClick={() => navigate('/users/create-indent')}
              >
                <div className="text-left">
                  <div className="font-medium">📝 Create Indent</div>
                  <div className="text-sm text-gray-500">Start a new procurement request</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 justify-start"
                onClick={() => navigate('/users/my-indents')}
              >
                <div className="text-left">
                  <div className="font-medium">📋 View All Indents</div>
                  <div className="text-sm text-gray-500">Track your requests</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersDashboard;
