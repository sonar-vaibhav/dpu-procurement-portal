import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const StoreDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnRemarks, setReturnRemarks] = useState('');
  const [poFiles, setPoFiles] = useState<{ [key: string]: File | null }>({});

  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      requestedBy: 'Dr. John Smith',
      department: 'Biology',
      amount: '₹25,000',
      hodApprovedDate: '2024-01-16',
      stockStatus: 'to_verify',
      items: [
        { itemName: 'Microscope', quantity: 2, stockInHand: 5 }
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
        { itemName: 'Desktop Computers', quantity: 5, stockInHand: 2 }
      ]
    }
  ]);

  const calculateExtra = (quantity: number, stock: number) => {
    return Math.max(0, quantity - stock);
  };

  const handlePOUpload = (e: React.ChangeEvent<HTMLInputElement>, indentId: string) => {
    const file = e.target.files?.[0] || null;
    setPoFiles(prev => ({ ...prev, [indentId]: file }));
  };

  const handleReturnForInfo = () => {
    if (!returnReason) {
      toast({ title: 'Error', description: 'Please select a reason for return', variant: 'destructive' });
      return;
    }
    if (!returnRemarks.trim()) {
      toast({ title: 'Error', description: 'Please provide remarks for return', variant: 'destructive' });
      return;
    }
    toast({
      title: 'Returned for Information',
      description: `Indent ${selectedIndent.id} has been returned with reason: ${returnReason}`,
      variant: 'destructive'
    });
    setShowReturnModal(false);
    setReturnReason('');
    setReturnRemarks('');
    setSelectedIndent(null);
  };

  const handleVerifyStock = (indentId: string) => {
    toast({
      title: 'Stock Verified',
      description: `Indent ${indentId} has been verified and forwarded to Registrar`,
    });
    setPendingVerifications(prev => prev.filter(indent => indent.id !== indentId));
  };

  const updateItemField = (indentId: string, index: number, field: 'quantity' | 'stockInHand', value: number) => {
    setPendingVerifications(prev =>
      prev.map(indent => {
        if (indent.id === indentId) {
          const updatedItems = [...indent.items];
          updatedItems[index][field] = value;
          return { ...indent, items: updatedItems };
        }
        return indent;
      })
    );
  };

  return (
    <DashboardLayout>
      <PageHeader title="Store Department Dashboard" subtitle="Manage inventory and process indents" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Indents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{pendingVerifications.length}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Stock Verification</CardTitle>
            <CardDescription>Indents approved by HOD awaiting stock verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map(indent => {
                const insufficient = indent.items.some(item => item.stockInHand < item.quantity);

                return (
                  <div key={indent.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{indent.title}</h4>
                          <Badge className="bg-blue-100 text-blue-800">STOCK VERIFICATION</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div><span className="font-medium">ID:</span> {indent.id}</div>
                          <div><span className="font-medium">Requested by:</span> {indent.requestedBy}</div>
                          <div><span className="font-medium">Department:</span> {indent.department}</div>
                          <div><span className="font-medium">Amount:</span> {indent.amount}</div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-medium text-sm">Stock Status</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {indent.items.map((item, index) => {
                              const extra = calculateExtra(item.quantity, item.stockInHand);

                              return (
                                <div key={index} className={`p-3 rounded-md ${item.stockInHand < item.quantity ? 'bg-red-50 border border-red-300' : 'bg-gray-50'}`}>
                                  <p className="font-medium mb-2">{item.itemName}</p>
                                  <div className="grid grid-cols-3 gap-2 text-sm items-center">
                                    <div>
                                      <Label>Requested</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={e => updateItemField(indent.id, index, 'quantity', parseInt(e.target.value) || 0)}
                                      />
                                    </div>
                                    <div>
                                      <Label>In Stock</Label>
                                      <Input
                                        type="number"
                                        min="0"
                                        value={item.stockInHand}
                                        onChange={e => updateItemField(indent.id, index, 'stockInHand', parseInt(e.target.value) || 0)}
                                      />
                                    </div>
                                    <div>
                                      <Label>Extra</Label>
                                      <Input type="number" value={extra} readOnly />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">HOD Approved: {indent.hodApprovedDate}</p>

                        <div className="mt-4">
                          <Label htmlFor={`po-${indent.id}`}>Upload Earlier PO (if available)</Label>
                          <Input type="file" id={`po-${indent.id}`} onChange={(e) => handlePOUpload(e, indent.id)} />
                          {poFiles[indent.id] && (
                            <p className="text-sm text-green-600 mt-1">Selected: {poFiles[indent.id]?.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
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
                        {insufficient && (
                          <div className="text-xs text-red-700 bg-yellow-100 border border-yellow-300 px-2 py-1 rounded">
                            ⚠ insufficient stock.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Indent for Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="returnReason">Reason for Return</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
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
            <Button variant="outline" onClick={() => setShowReturnModal(false)}>Cancel</Button>
            <Button className="bg-dpu-red hover:bg-dpu-red-dark text-white" onClick={handleReturnForInfo}>
              Return Indent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StoreDashboard;
