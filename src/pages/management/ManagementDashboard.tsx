import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, FileText, ListChecks, ClipboardList, Hourglass, Building2, Coins, CheckCircle, XCircle } from 'lucide-react';
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
  const [indents, setIndents] = useState(indentData);
  const [purchaseOrders, setPurchaseOrders] = useState(poData);
  // State for selected indents/POs
  const [selectedIndents, setSelectedIndents] = useState<string[]>([]);
  const [selectedPOs, setSelectedPOs] = useState<string[]>([]);

  // Modal state
  const [openIndent, setOpenIndent] = useState<any | null>(null);
  const [openPO, setOpenPO] = useState<any | null>(null);
  const [openVendorChart, setOpenVendorChart] = useState(false);
  const [openPODoc, setOpenPODoc] = useState(false);

  // Summary
  // Combine indents and POs for summary
  const allItems = [
    ...indents.flatMap(group => group.items),
    ...purchaseOrders.flatMap(group => group.items)
  ];
  const summary = allItems.reduce(
    (acc, item) => {
      if (item.status === 'Approved') {
        acc.approved.count++;
        acc.approved.amount += item.amount;
      } else if (item.status === 'Rejected') {
        acc.rejected.count++;
        acc.rejected.amount += item.amount;
      } else {
        acc.pending.count++;
        acc.pending.amount += item.amount;
      }
      return acc;
    },
    {
      approved: { count: 0, amount: 0 },
      rejected: { count: 0, amount: 0 },
      pending: { count: 0, amount: 0 }
    }
  );

  const handleStatusUpdate = (id: string, type: 'indent' | 'po', status: 'Approved' | 'Rejected') => {
    const updater = type === 'indent' ? setIndents : setPurchaseOrders;
    updater(prev => 
      prev.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === id ? { ...item, status } : item
        )
      }))
    );
    toast({
      title: `${type === 'indent' ? 'Indent' : 'PO'} ${status}`,
      description: `${type === 'indent' ? 'Indent' : 'PO'} ${id} has been ${status.toLowerCase()}.`
    });
  };

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

  // Responsive title/subtitle for PageHeader
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title={isMobile ? 'Dashboard' : 'Management Dashboard'}
        subtitle={isMobile ? '' : 'Final procurement approvals and institutional oversight'}
      />
      <div className="px-3 py-4 pr-6 pl-6 sm:px-4 sm:py-4 md:p-6 min-h-screen bg-gray-50 space-y-6 md:space-y-10 rounded-xl shadow-inner text-base md:text-lg">
        <Tabs defaultValue="indents">
          <TabsList className="mb-6">
            <TabsTrigger value="indents"><ListChecks className="w-4 h-4 mr-2" />Indents</TabsTrigger>
            <TabsTrigger value="pos"><FileText className="w-4 h-4 mr-2" />Purchase Orders (POs)</TabsTrigger>
          </TabsList>
          <TabsContent value="indents">
            {/* Indents Section */}
            <section>
              <div className="flex items-center mb-4">
                <ListChecks className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Indents</h2>
              </div>
              {/* Combined Summary Cards */}
              <div className="grid grid-cols-1 gap-2 mb-3 md:grid-cols-3 md:gap-4 md:mb-6">
                <Card className="bg-green-50 border border-green-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Approved</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{summary.approved.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{summary.approved.amount.toLocaleString()}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-green-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-red-50 border border-red-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Rejected</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{summary.rejected.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{summary.rejected.amount.toLocaleString()}</div>
                    </div>
                    <XCircle className="w-5 h-5 md:w-8 md:h-8 text-red-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-yellow-50 border border-yellow-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Pending</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{summary.pending.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{summary.pending.amount.toLocaleString()}</div>
                    </div>
                    <Hourglass className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 mt-1" />
                  </CardHeader>
                </Card>
              </div>
              {/* Grouped List */}
              <div className="space-y-4 md:space-y-6">
                {indents.map(group => (
                  <div key={group.college} className="border rounded-lg p-2 sm:p-4 bg-white/90 shadow-sm overflow-x-auto">
                    <h3 className="font-semibold text-gray-800 mb-2">{group.college}</h3>
                    <table className="w-full min-w-[600px] text-sm rounded-lg overflow-hidden">
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
                            <td className="flex items-center">
                              <Button size="icon" variant="ghost" onClick={() => setOpenIndent(mapToIndentDetails(item))} title="Preview">
                                <Eye className="w-10 h-10" />
                              </Button>
                              {item.status === 'Pending' && (
                                <>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(item.id, 'indent', 'Approved')} title="Approve">
                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(item.id, 'indent', 'Rejected')} title="Reject">
                                    <XCircle className="w-7 h-7 text-red-600" />
                                  </Button>
                                </>
                              )}
                              {item.status === 'Rejected' && (
                                <Button size="sm" variant="outline" className="ml-2 text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleStatusUpdate(item.id, 'indent', 'Approved')} title="Re-Approve">
                                  Re-Approve
                                </Button>
                              )}
                            </td>
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
                  <div className="text-sm font-medium">Selected Amount: <span className="text-blue-700 font-bold">₹{getSelectedAmount(indents, selectedIndents).toLocaleString()}</span></div>
                  <Button className="dpu-button-primary" onClick={handleBulkIndentApprove}>Approve Selected</Button>
                </div>
              )}
            </section>
          </TabsContent>
          <TabsContent value="pos">
            {/* Purchase Orders Section */}
            <section>
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Purchase Orders (POs)</h2>
              </div>
              {/* Grouped List */}
              <div className="space-y-4 md:space-y-6">
                {purchaseOrders.map(group => (
                  <div key={group.college} className="border rounded-lg p-2 sm:p-4 bg-white/90 shadow-sm overflow-x-auto">
                    <h3 className="font-semibold text-gray-800 mb-2">{group.college}</h3>
                    <table className="w-full min-w-[600px] text-sm rounded-lg overflow-hidden">
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
                                  checked={selectedPOs.includes(item.id)}
                                  onChange={() => handlePOSelect(item.id)}
                                />
                              ) : null}
                            </td>
                            <td>{item.title} <span className="text-xs text-gray-400">({item.id})</span></td>
                            <td>₹{item.amount.toLocaleString()}</td>
                            <td><Badge variant={item.status === 'Approved' ? 'secondary' : item.status === 'Pending' ? 'outline' : 'secondary'} className={item.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{item.status}</Badge></td>
                            <td className="flex items-center">
                              <Button size="icon" variant="ghost" onClick={() => setOpenPO(item)} title="Preview">
                                <Eye className="w-7 h-7" />
                              </Button>
                              {item.status === 'Pending' && (
                                <>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(item.id, 'po', 'Approved')} title="Approve">
                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(item.id, 'po', 'Rejected')} title="Reject">
                                    <XCircle className="w-7 h-7 text-red-600" />
                                  </Button>
                                </>
                              )}
                              {item.status === 'Rejected' && (
                                <Button size="sm" variant="outline" className="ml-2 text-green-700 border-green-300 hover:bg-green-50" onClick={() => handleStatusUpdate(item.id, 'po', 'Approved')} title="Re-Approve">
                                  Re-Approve
                                </Button>
                              )}
                            </td>
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
                  <div className="text-sm font-medium">Selected Amount: <span className="text-blue-700 font-bold">₹{getSelectedAmount(purchaseOrders, selectedPOs).toLocaleString()}</span></div>
                  <Button className="dpu-button-primary" onClick={handleBulkPOApprove}>Approve Selected</Button>
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Indent Detail Modal */}
        <Dialog open={!!openIndent} onOpenChange={v => !v && setOpenIndent(null)}>
          <DialogContent className="max-w-full w-[95vw] sm:max-w-xl overflow-y-auto">
            <IndentDetailsModal
              isOpen={!!openIndent}
              onClose={() => setOpenIndent(null)}
              indent={openIndent}
            />
          </DialogContent>
        </Dialog>

        {/* PO Detail Modal */}
        <Dialog open={!!openPO} onOpenChange={v => !v && setOpenPO(null)}>
          <DialogContent className="w-full max-w-[98vw] sm:max-w-xl overflow-y-auto p-2">
            {openPO && (
              <Card className="shadow-lg">
                <CardHeader className="p-2 sm:p-4">
                  <CardTitle className="text-base sm:text-lg">Purchase Order Details</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">ID: {openPO.id}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-4">
                  <div className="mb-2 text-sm sm:text-base"><span className="font-medium">Title:</span> {openPO.title}</div>
                  <div className="mb-2 text-sm sm:text-base"><span className="font-medium">College:</span> {openPO.college}</div>
                  <div className="mb-2 text-sm sm:text-base"><span className="font-medium">Requested Amount:</span> <span className="text-blue-700 font-semibold">₹{openPO.amount.toLocaleString()}</span></div>
                  <div className="mb-2 text-sm sm:text-base"><span className="font-medium">Status:</span> <Badge variant={openPO.status === 'Approved' ? 'secondary' : openPO.status === 'Pending' ? 'outline' : 'secondary'} className={openPO.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{openPO.status}</Badge></div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpenVendorChart(true)}><FileText className="w-4 h-4 mr-1" />Vendor Comparison Chart</Button>
                    <Button variant="outline" onClick={() => setOpenPODoc(true)}><FileText className="w-4 h-4 mr-1" />Final PO Document</Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-end p-2 sm:p-4">
                  <Button variant="outline" onClick={() => setOpenPO(null)}>Close</Button>
                </CardFooter>
              </Card>
            )}
          </DialogContent>
        </Dialog>

        {/* Vendor Comparison Chart Modal */}
        <Dialog open={openVendorChart} onOpenChange={setOpenVendorChart}>
          <DialogContent className="max-w-full w-[98vw] sm:max-w-[90vw] overflow-y-auto p-0">
            {/* Sticky top bar for mobile close button */}
            <div className="sticky top-0 z-10 bg-white flex justify-end sm:hidden border-b p-2">
              <Button size="sm" variant="outline" onClick={() => setOpenVendorChart(false)}>
                Close
              </Button>
            </div>
            <DialogHeader className="hidden sm:block">
              <DialogTitle>Vendor Comparison Chart</DialogTitle>
              <DialogDescription>Preview of the vendor comparison chart for this PO.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-auto px-0 sm:px-0 text-center text-gray-500 py-4 sm:py-8">
              <div className="w-max min-w-full">
                <ComparisonChartReport />
              </div>
            </div>
            <DialogFooter className="hidden sm:flex">
              <Button variant="outline" onClick={() => setOpenVendorChart(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final PO Document Modal */}
        <Dialog open={openPODoc} onOpenChange={setOpenPODoc}>
          <DialogContent className="max-w-full w-[98vw] sm:max-w-5xl overflow-y-auto p-0">
            {/* Sticky top bar for mobile close button */}
            <div className="sticky top-0 z-10 bg-white flex justify-end sm:hidden border-b p-2">
              <Button size="sm" variant="outline" onClick={() => setOpenPODoc(false)}>
                Close
              </Button>
            </div>
            <DialogHeader className="hidden sm:block">
              <DialogTitle>Final Purchase Order Document</DialogTitle>
              <DialogDescription>Preview of the final PO document for this order.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-auto px-0 sm:px-0 py-4 sm:py-8">
              <div className="w-max min-w-full">
                <PurchaseOrderPage />
              </div>
            </div>
            <DialogFooter className="hidden sm:flex">
              <Button variant="outline" onClick={() => setOpenPODoc(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
