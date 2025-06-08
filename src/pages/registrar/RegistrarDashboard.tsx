
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const RegistrarDashboard: React.FC = () => {
  const { toast } = useToast();

  const pendingApprovals = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      budgetHead: 'Lab Equipment Fund',
      approvalTrail: ['User', 'HOD', 'Store'],
      urgency: 'Medium'
    },
    {
      id: 'IND003',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      budgetHead: 'Infrastructure Fund',
      approvalTrail: ['User', 'HOD', 'Store'],
      urgency: 'High'
    }
  ];

  const handleApprove = (indentId: string) => {
    toast({
      title: "Indent Approved",
      description: `Indent ${indentId} has been approved and forwarded to CPD for vendor process`,
    });
  };

  const handleReturnForClarification = (indentId: string) => {
    toast({
      title: "Returned for Clarification",
      description: `Indent ${indentId} has been returned for additional information`,
      variant: "destructive",
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Registrar Dashboard"
        subtitle="Institute-level approval and budget oversight"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-500 mt-1">Require your approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Monthly Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">72%</div>
              <p className="text-xs text-gray-500 mt-1">₹7,20,000 of ₹10,00,000</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">22</div>
              <p className="text-xs text-gray-500 mt-1">₹4,85,000 value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Budget Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <p className="text-xs text-gray-500 mt-1">Approaching limit</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Institute Approvals</CardTitle>
            <CardDescription>Indents verified by Store Department awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={getUrgencyColor(indent.urgency)}>
                          {indent.urgency} Priority
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

                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-500">Budget Head:</span>
                        <span className="ml-2 text-sm text-gray-700">{indent.budgetHead}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Approval Trail:</span>
                        {indent.approvalTrail.map((step, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {step} ✓
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReturnForClarification(indent.id)}
                      >
                        Return for Clarification
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

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Department-wise budget allocation and utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Computer Science</p>
                  <p className="text-sm text-gray-500">₹1,20,000 / ₹2,00,000</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">60%</p>
                  <p className="text-sm text-gray-500">Utilized</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Biology</p>
                  <p className="text-sm text-gray-500">₹85,000 / ₹1,50,000</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">57%</p>
                  <p className="text-sm text-gray-500">Utilized</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Administration</p>
                  <p className="text-sm text-gray-500">₹45,000 / ₹75,000</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-yellow-600">60%</p>
                  <p className="text-sm text-gray-500">Utilized</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegistrarDashboard;
