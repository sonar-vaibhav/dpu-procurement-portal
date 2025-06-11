import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Package, Box, AlertTriangle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const StoreDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnRemarks, setReturnRemarks] = useState('');

  const pendingVerifications = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      hodApprovedDate: '2024-01-16',
      stockStatus: 'to_verify',
      items: [
        {
          itemName: 'Microscope',
          quantity: 2,
          stockInHand: 5
        }
      ]
    },
    {
      id: 'IND003',
      title: 'Computer Lab Hardware',
      requestedBy: 'Prof. Sarah Wilson',
      department: 'Computer Science',
      amount: '₹45,000',
      hodApprovedDate: '2024-01-15',
      stockStatus: 'to_verify',
      items: [
        {
          itemName: 'Desktop Computers',
          quantity: 5,
          stockInHand: 2
        }
      ]
    }
  ];

  const handleVerifyStock = (indentId: string) => {
    toast({
      title: "Stock Verified",
      description: `Indent ${indentId} has been verified and forwarded to Registrar`,
    });
  };

  const handleReturnForInfo = () => {
    if (!returnReason) {
      toast({
        title: "Error",
        description: "Please select a reason for return",
        variant: "destructive"
      });
      return;
    }

    if (!returnRemarks.trim()) {
      toast({
        title: "Error",
        description: "Please provide remarks for return",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Returned for Information",
      description: `Indent ${selectedIndent.id} has been returned with reason: ${returnReason}`,
      variant: "destructive",
    });

    setShowReturnModal(false);
    setReturnReason('');
    setReturnRemarks('');
    setSelectedIndent(null);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Store Department Dashboard"
        subtitle="Manage inventory and process indents"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">2</div>
                <FileText className="h-8 w-8 text-green-600/20" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
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

                      {/* Stock Status */}
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Stock Status</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {indent.items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-md">
                              <p className="font-medium">{item.itemName}</p>
                              <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                                <p><span className="font-medium">Requested:</span> {item.quantity}</p>
                                <p><span className="font-medium">In Stock:</span> {item.stockInHand}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-2">HOD Approved: {indent.hodApprovedDate}</p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedIndent(indent);
                          setShowReturnModal(true);
                        }}
                      >
                        Return for Info
                      </Button>
                      <Button
                        size="sm"
                        className="bg-dpu-red hover:bg-dpu-red-dark text-white"
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
      </div>

      {/* Return Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Indent for Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="returnReason">Reason for Return</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock_available">Stock Already Available</SelectItem>
                  <SelectItem value="more_info">Need More Information</SelectItem>
                  <SelectItem value="specifications">Specifications Unclear</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="returnRemarks">Remarks</Label>
              <Textarea
                id="returnRemarks"
                value={returnRemarks}
                onChange={(e) => setReturnRemarks(e.target.value)}
                placeholder="Enter detailed remarks for return..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowReturnModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-dpu-red hover:bg-dpu-red-dark text-white"
              onClick={handleReturnForInfo}
            >
              Return Indent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoreDashboard;
