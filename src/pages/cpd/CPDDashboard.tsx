
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CPDDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const recentIndents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Laboratory',
      requester: 'Dr. John Smith - Computer Science',
      status: 'pending_assignment',
      priority: 'high'
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      category: 'IT Equipment',
      requester: 'Prof. Sarah Johnson - Electronics',
      status: 'assigned',
      priority: 'medium'
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      category: 'Stationery',
      requester: 'Admin Office',
      status: 'in_progress',
      priority: 'low'
    }
  ];

  const purchaseOfficers = [
    { id: 'PO001', name: 'Rajesh Kumar', activeIndents: 8, category: 'IT Equipment' },
    { id: 'PO002', name: 'Priya Sharma', activeIndents: 5, category: 'Laboratory' },
    { id: 'PO003', name: 'Amit Patel', activeIndents: 3, category: 'Stationery' }
  ];

  const handleAssignIndent = (indentId: string) => {
    toast({
      title: "Indent Assignment",
      description: `Opening assignment dialog for ${indentId}`,
    });
  };

  const handleQuickAssign = () => {
    navigate('/cpd/indents');
  };

  const handleViewVendors = () => {
    navigate('/cpd/vendors');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="CPD Admin Dashboard"
        subtitle="Central Purchase Department - Manage indents, vendors, and purchase officers"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Indents Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-xs text-gray-500 mt-1">+3 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Indents Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">16</div>
              <p className="text-xs text-gray-500 mt-1">8 pending assignment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Vendors Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">48</div>
              <p className="text-xs text-gray-500 mt-1">12 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Delivered Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">32</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Fast access to common CPD admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleQuickAssign}
                className="h-16 justify-start dpu-button-primary"
              >
                <div className="text-left">
                  <div className="font-medium">📋 Assign Indents</div>
                  <div className="text-sm opacity-80">Assign indents to purchase officers</div>
                </div>
              </Button>
              
              <Button 
                onClick={handleViewVendors}
                variant="outline" 
                className="h-16 justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">🏢 View Vendor Summary</div>
                  <div className="text-sm text-gray-500">Manage vendor directory and performance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Indents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Indents</CardTitle>
            <CardDescription>Latest indents received from Registrar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndents.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={
                          indent.status === 'pending_assignment' ? 'bg-yellow-100 text-yellow-800' :
                          indent.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {indent.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={
                          indent.priority === 'high' ? 'border-red-200 text-red-600' :
                          indent.priority === 'medium' ? 'border-yellow-200 text-yellow-600' :
                          'border-green-200 text-green-600'
                        }>
                          {indent.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {indent.category}
                        </div>
                        <div>
                          <span className="font-medium">Requester:</span> {indent.requester}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {indent.status === 'pending_assignment' && (
                        <Button
                          size="sm"
                          className="dpu-button-primary"
                          onClick={() => handleAssignIndent(indent.id)}
                        >
                          Assign
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Officers Status */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Officers Workload</CardTitle>
            <CardDescription>Current assignment status of purchase officers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseOfficers.map((officer) => (
                <div key={officer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{officer.name}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>ID: {officer.id}</span>
                      <span>Specialization: {officer.category}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{officer.activeIndents}</div>
                    <div className="text-xs text-gray-500">Active Indents</div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDDashboard;
