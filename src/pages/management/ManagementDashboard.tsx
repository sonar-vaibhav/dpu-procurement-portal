
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ManagementDashboard: React.FC = () => {
  const { toast } = useToast();

  const finalApprovals = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      selectedVendor: 'Scientific Instruments Pvt. Ltd.',
      vendorQuote: '₹23,500',
      cpdRecommendation: 'Best price-quality ratio with 2-year warranty',
      approvalTrail: ['User', 'HOD', 'Store', 'Registrar', 'CPD'],
      urgency: 'Medium'
    },
    {
      id: 'IND003',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      selectedVendor: 'Tech Solutions India',
      vendorQuote: '₹42,800',
      cpdRecommendation: 'Competitive pricing with excellent support',
      approvalTrail: ['User', 'HOD', 'Store', 'Registrar', 'CPD'],
      urgency: 'High'
    }
  ];

  const handleFinalApproval = (indentId: string) => {
    toast({
      title: "Procurement Approved",
      description: `Final approval granted for Indent ${indentId}. Purchase order will be generated.`,
    });
  };

  const handleReject = (indentId: string) => {
    toast({
      title: "Procurement Rejected",
      description: `Indent ${indentId} has been rejected at final stage`,
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
        title="Management Dashboard"
        subtitle="Final procurement approvals and institutional oversight"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Final Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting your decision</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Procurement Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹15.2L</div>
              <p className="text-xs text-gray-500 mt-1">This quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Savings Achieved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹45K</div>
              <p className="text-xs text-gray-500 mt-1">Through negotiations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">28</div>
              <p className="text-xs text-gray-500 mt-1">Registered and active</p>
            </CardContent>
          </Card>
        </div>

        {/* Final Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Final Procurement Approvals</CardTitle>
            <CardDescription>Vendor-finalized indents awaiting final management approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {finalApprovals.map((indent) => (
                <div key={indent.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{indent.title}</h4>
                        <Badge className={getUrgencyColor(indent.urgency)}>
                          {indent.urgency} Priority
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">Indent ID:</span> {indent.id}
                        </div>
                        <div>
                          <span className="font-medium">Requested by:</span> {indent.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {indent.department}
                        </div>
                        <div>
                          <span className="font-medium">Original Amount:</span> {indent.amount}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h5 className="font-medium text-blue-900 mb-2">CPD Vendor Selection</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-blue-700">Selected Vendor:</span>
                            <p className="text-blue-900">{indent.selectedVendor}</p>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700">Final Quote:</span>
                            <p className="text-blue-900 font-semibold">{indent.vendorQuote}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-medium text-blue-700">CPD Recommendation:</span>
                          <p className="text-blue-900 mt-1">{indent.cpdRecommendation}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Complete Approval Trail:</span>
                        {indent.approvalTrail.map((step, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {step} ✓
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-6">
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
                        onClick={() => handleFinalApproval(indent.id)}
                      >
                        Final Approval
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Procurement Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Spending</CardTitle>
              <CardDescription>Current quarter procurement breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Computer Science</span>
                  <span className="text-sm font-semibold">₹6.2L (41%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Biology</span>
                  <span className="text-sm font-semibold">₹4.8L (32%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Administration</span>
                  <span className="text-sm font-semibold">₹2.1L (14%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Others</span>
                  <span className="text-sm font-semibold">₹2.1L (13%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest management decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Approved procurement for ₹28,000</span>
                  <span className="text-gray-400">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Reviewed vendor selection by CPD</span>
                  <span className="text-gray-400">3 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Approved infrastructure upgrade</span>
                  <span className="text-gray-400">5 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
