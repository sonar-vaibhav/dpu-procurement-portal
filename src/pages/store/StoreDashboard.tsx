
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const StoreDashboard: React.FC = () => {
  const { toast } = useToast();

  const pendingVerifications = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      hodApprovedDate: '2024-01-16',
      stockStatus: 'to_verify'
    },
    {
      id: 'IND003',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      hodApprovedDate: '2024-01-15',
      stockStatus: 'to_verify'
    }
  ];

  const handleVerifyStock = (indentId: string) => {
    toast({
      title: "Stock Verified",
      description: `Indent ${indentId} has been verified and forwarded to Registrar`,
    });
  };

  const handleReturnForInfo = (indentId: string) => {
    toast({
      title: "Returned for Information",
      description: `Indent ${indentId} has been returned to department for additional stock information`,
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Store Department Dashboard"
        subtitle="Verify stock information and process approved indents"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-500 mt-1">Require stock verification</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Verified This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-gray-500 mt-1">₹3,45,000 value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-gray-500 mt-1">Need clarification</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Stock Verification</CardTitle>
            <CardDescription>Indents approved by HOD awaiting stock verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          STOCK VERIFICATION
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
                      
                      <p className="text-sm text-gray-500">HOD Approved: {indent.hodApprovedDate}</p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReturnForInfo(indent.id)}
                      >
                        Return for Info
                      </Button>
                      <Button
                        size="sm"
                        className="dpu-button-primary"
                        onClick={() => handleVerifyStock(indent.id)}
                      >
                        Verify & Forward
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Management */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Management Overview</CardTitle>
            <CardDescription>Current stock levels and recent updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Laboratory Equipment</p>
                  <p className="text-sm text-gray-500">Last updated: 2 hours ago</p>
                </div>
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Computer Hardware</p>
                  <p className="text-sm text-gray-500">Last updated: 1 day ago</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Office Supplies</p>
                  <p className="text-sm text-gray-500">Last updated: 3 hours ago</p>
                </div>
                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreDashboard;
