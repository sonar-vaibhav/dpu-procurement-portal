import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, FileText, ListChecks, ClipboardList, Hourglass, Building2, Coins } from 'lucide-react';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import ComparisonChartReport from '@/components/ComparisonChartReport';

// Dummy data for Indents and POs grouped by college
const indentData = [
  {
    college: 'Dr. D. Y. Patil Institute of Technology',
    items: [
      { id: 'IND001', title: 'Lab Equipment', amount: 25000, status: 'Pending', college: 'Dr. D. Y. Patil Institute of Technology' },
      { id: 'IND002', title: 'Library Books', amount: 12000, status: 'Approved', college: 'Dr. D. Y. Patil Institute of Technology' },
    ],
  },
  {
    college: 'DPU School of Management',
    items: [
      { id: 'IND003', title: 'Projectors', amount: 18000, status: 'Pending', college: 'DPU School of Management' },
    ],
  },
];

const poData = [
  {
    college: 'Dr. D. Y. Patil Institute of Technology',
    items: [
      { id: 'PO001', title: 'Microscopes', amount: 23500, status: 'Pending', college: 'Dr. D. Y. Patil Institute of Technology' },
      { id: 'PO002', title: 'Desktops', amount: 42800, status: 'Approved', college: 'Dr. D. Y. Patil Institute of Technology' },
    ],
  },
];

const getSummary = (data) => {
  let approved = 0, pending = 0, approvedAmt = 0, pendingAmt = 0;
  data.forEach(group => {
    group.items.forEach(item => {
      if (item.status === 'Approved') {
        approved++;
        approvedAmt += item.amount;
      } else {
        pending++;
        pendingAmt += item.amount;
      }
    });
  });
  return { approved, pending, approvedAmt, pendingAmt };
};

// Helper to map dashboard indent to IndentDetailsModal shape
const mapToIndentDetails = (item: any) => ({
  id: item.id,
  title: item.title,
  status: (item.status || '').toLowerCase().replace(' ', '_') || 'pending_management',
  date: item.date || '2024-07-08',
  amount: `₹${item.amount?.toLocaleString?.() ?? item.amount}`,
  department: item.college || 'N/A',
  budgetHead: item.budgetHead || 'General',
  priority: item.priority || 'Medium',
  justification: item.justification || 'N/A',
  requestedBy: item.requestedBy || 'N/A',
  items: item.items || [
    {
      itemName: item.title,
      description: 'N/A',
      quantity: '1',
      make: 'N/A',
      uom: 'pcs',
      stockInHand: '0',
      approxValue: `${item.amount}`,
      purpose: 'N/A',
    }
  ],
  approvalTrail: item.approvalTrail || ['User', 'HOD', 'Store', 'Registrar', 'Principal', 'Management'],
});

const ManagementDashboard: React.FC = () => {
  const { toast } = useToast();
  // State for selected indents/POs
  const [selectedIndents, setSelectedIndents] = useState<string[]>([]);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);

  // Modal state
  const [openIndent, setOpenIndent] = useState<any | null>(null);
  const [openPO, setOpenPO] = useState<any | null>(null);
  const [openVendorChart, setOpenVendorChart] = useState(false);
  const [openPODoc, setOpenPODoc] = useState(false);

  // Summary
  const indentSummary = getSummary(indentData);
  const poSummary = getSummary(poData);

  // Handlers
  const handleIndentSelect = (id: string) => {
    setSelectedIndents(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handlePOSelect = (id: string) => {
    setSelectedPOs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleBulkIndentApprove = () => {
    toast({ title: 'Indents Approved', description: `Approved ${selectedIndents.length} indents.` });
    setSelectedIndents([]);
  };
  const handleBulkPOApprove = () => {
    toast({ title: 'POs Approved', description: `Approved ${selectedPOs.length} purchase orders.` });
    setSelectedPOs([]);
  };

  const getSelectedAmount = (data, selected) => {
    let total = 0;
    data.forEach(group => {
      group.items.forEach(item => {
        if (selected.includes(item.id)) total += item.amount;
      });
    });
    return total;
  };

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
      <div className="p-6 min-h-screen bg-gray-50 space-y-10 rounded-xl shadow-inner text-base md:text-lg">
        <Tabs defaultValue="indents">
          <TabsList className="mb-6">
            <TabsTrigger value="indents"><ListChecks className="w-4 h-4 mr-2" />Indents</TabsTrigger>
            <TabsTrigger value="pos"><FileText className="w-4 h-4 mr-2" />Purchase Orders (POs)</TabsTrigger>
          </TabsList>
          <TabsContent value="indents">
            {/* Indents Section */}
            <section>
              <div className="flex items-center mb-4">
                <ListChecks className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Indents</h2>
              </div>
              {/* Summary Cards - Minimal UI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-green-50 border border-green-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Approved Indents</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">{indentSummary.approved}</div>
                      <p className="text-xs text-gray-500">+12% from last month</p>
                    </div>
                    <ClipboardList className="w-8 h-8 text-green-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-yellow-50 border border-yellow-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Pending Indents</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">{indentSummary.pending}</div>
                      <p className="text-xs text-gray-500">Requires immediate attention</p>
                    </div>
                    <Hourglass className="w-8 h-8 text-yellow-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-blue-50 border border-blue-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Approved Amount</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">₹{indentSummary.approvedAmt.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">+43% from last month</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-orange-50 border border-orange-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Pending Amount</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">₹{indentSummary.pendingAmt.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">+55% from last month</p>
                    </div>
                    <Coins className="w-8 h-8 text-orange-500 mt-1" />
                  </CardHeader>
                </Card>
              </div>
              {/* Grouped List */}
              <div className="space-y-6">
                {indentData.map(group => (
                  <div key={group.college} className="border rounded-lg p-4 bg-white/90 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-2">{group.college}</h3>
                    <table className="w-full text-sm rounded-lg overflow-hidden">
                      <thead>
                        <tr className="text-left text-gray-600 bg-gray-100">
                          <th></th>
                          <th>Title / ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td>
                              {item.status === 'Pending' ? (
                                <input
                                  type="checkbox"
                                  checked={selectedIndents.includes(item.id)}
                                  onChange={() => handleIndentSelect(item.id)}
                                />
                              ) : null}
                            </td>
                            <td>{item.title} <span className="text-xs text-gray-400">({item.id})</span></td>
                            <td>₹{item.amount.toLocaleString()}</td>
                            <td><Badge variant={item.status === 'Approved' ? 'secondary' : item.status === 'Pending' ? 'outline' : 'secondary'} className={item.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{item.status}</Badge></td>
                            <td><Button size="icon" variant="ghost" onClick={() => setOpenIndent(mapToIndentDetails(item))} title="Preview"><Eye className="w-5 h-5" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              {/* Bulk Approve & Live Total */}
              {selectedIndents.length > 0 && (
                <div className="flex items-center justify-end mt-4 space-x-4">
                  <div className="text-sm font-medium">Selected Amount: <span className="text-blue-700 font-bold">₹{getSelectedAmount(indentData, selectedIndents).toLocaleString()}</span></div>
                  <Button className="dpu-button-primary" onClick={handleBulkIndentApprove}>Approve Selected</Button>
                </div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="pos">
            {/* Purchase Orders Section */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Purchase Orders (POs)</h2>
              </div>
              {/* Summary Cards for POs - Minimal UI */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-green-50 border border-green-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Approved POs</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">{poSummary.approved}</div>
                      <p className="text-xs text-gray-500">+12% from last month</p>
                    </div>
                    <ClipboardList className="w-8 h-8 text-green-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-yellow-50 border border-yellow-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Pending POs</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">{poSummary.pending}</div>
                      <p className="text-xs text-gray-500">Requires immediate attention</p>
                    </div>
                    <Hourglass className="w-8 h-8 text-yellow-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-blue-50 border border-blue-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Approved Amount</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">₹{poSummary.approvedAmt.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">+43% from last month</p>
                    </div>
                    <Building2 className="w-8 h-8 text-blue-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-orange-50 border border-orange-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                    <div>
                      <CardTitle className="text-base font-medium text-gray-800">Total Pending Amount</CardTitle>
                      <div className="text-2xl font-bold mt-2 mb-1">₹{poSummary.pendingAmt.toLocaleString()}</div>
                      <p className="text-xs text-gray-500">+55% from last month</p>
                    </div>
                    <Coins className="w-8 h-8 text-orange-500 mt-1" />
                  </CardHeader>
                </Card>
              </div>
              {/* Grouped List */}
              <div className="space-y-6">
                {poData.map(group => (
                  <div key={group.college} className="border rounded-lg p-4 bg-white/90 shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-2">{group.college}</h3>
                    <table className="w-full text-sm rounded-lg overflow-hidden">
                      <thead>
                        <tr className="text-left text-gray-600 bg-gray-100">
                          <th></th>
                          <th>Title / ID</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td>
                              {item.status === 'Approved' ? (
                                <input
                                  type="checkbox"
                                  checked={selectedPOs.includes(item.id)}
                                  onChange={() => handlePOSelect(item.id)}
                                />
                              ) : null}
                            </td>
                            <td>{item.title} <span className="text-xs text-gray-400">({item.id})</span></td>
                            <td>₹{item.amount.toLocaleString()}</td>
                            <td><Badge variant={item.status === 'Approved' ? 'secondary' : item.status === 'Pending' ? 'outline' : 'secondary'} className={item.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{item.status}</Badge></td>
                            <td><Button size="icon" variant="ghost" onClick={() => setOpenPO(item)} title="Preview"><Eye className="w-5 h-5" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
              {/* Bulk Approve & Live Total */}
              {selectedPOs.length > 0 && (
                <div className="flex items-center justify-end mt-4 space-x-4">
                  <div className="text-sm font-medium">Selected Amount: <span className="text-blue-700 font-bold">₹{getSelectedAmount(poData, selectedPOs).toLocaleString()}</span></div>
                  <Button className="dpu-button-primary" onClick={handleBulkPOApprove}>Approve Selected</Button>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Indent Detail Modal */}
        <IndentDetailsModal
          isOpen={!!openIndent}
          onClose={() => setOpenIndent(null)}
          indent={openIndent}
          userRole="management"
        />

        {/* PO Detail Modal */}
        <Dialog open={!!openPO} onOpenChange={v => !v && setOpenPO(null)}>
          <DialogContent className="max-w-xl">
            {openPO && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Order Details</CardTitle>
                  <CardDescription>ID: {openPO.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2"><span className="font-medium">Title:</span> {openPO.title}</div>
                  <div className="mb-2"><span className="font-medium">College:</span> {openPO.college}</div>
                  <div className="mb-2"><span className="font-medium">Requested Amount:</span> <span className="text-blue-700 font-semibold">₹{openPO.amount.toLocaleString()}</span></div>
                  <div className="mb-2"><span className="font-medium">Status:</span> <Badge variant={openPO.status === 'Approved' ? 'secondary' : openPO.status === 'Pending' ? 'outline' : 'secondary'} className={openPO.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{openPO.status}</Badge></div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpenVendorChart(true)}><FileText className="w-4 h-4 mr-1" />Vendor Comparison Chart</Button>
                    <Button variant="outline" onClick={() => setOpenPODoc(true)}><FileText className="w-4 h-4 mr-1" />Final PO Document</Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" onClick={() => setOpenPO(null)}>Close</Button>
                </CardFooter>
              </Card>
            )}
          </DialogContent>
        </Dialog>

        {/* Vendor Comparison Chart Modal */}
        <Dialog open={openVendorChart} onOpenChange={setOpenVendorChart}>
          <DialogContent className="max-w-[90vw]">
            <DialogHeader>
              <DialogTitle>Vendor Comparison Chart</DialogTitle>
              <DialogDescription>Preview of the vendor comparison chart for this PO.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto text-center text-gray-500 py-8">
              <ComparisonChartReport />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenVendorChart(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final PO Document Modal */}
        <Dialog open={openPODoc} onOpenChange={setOpenPODoc}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>Final Purchase Order Document</DialogTitle>
              <DialogDescription>Preview of the final PO document for this order.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <PurchaseOrderPage />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenPODoc(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
