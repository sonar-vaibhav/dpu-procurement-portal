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
import IndentReportModal from '@/components/modals/IndentReportModal';
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
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [rejectionData, setRejectionData] = useState<{ id: string; type: 'indent' | 'po'; remarks: string } | null>(null);

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

  // PO summary for the PO tab
  const poSummary = purchaseOrders
    .flatMap(group => group.items)
    .reduce(
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

  const handleStatusUpdate = (id: string, type: 'indent' | 'po', status: 'Approved' | 'Rejected', remarks?: string) => {
    const updater = type === 'indent' ? setIndents : setPurchaseOrders;
    updater(prev =>
      prev.map(group => ({
        ...group,
        items: group.items.map(item =>
          item.id === id ? { ...item, status, rejectionRemarks: remarks } : item
        )
      }))
    );
    toast({
      title: `${type === 'indent' ? 'Indent' : 'PO'} ${status}`,
      description: `${type === 'indent' ? 'Indent' : 'PO'} ${id} has been ${status.toLowerCase()}.`
    });
  };

  const handleRejectClick = (id: string, type: 'indent' | 'po') => {
    setRejectionData({ id, type, remarks: '' });
    setOpenRejectionModal(true);
  };

  const handleRejectionSubmit = () => {
    if (rejectionData) {
      handleStatusUpdate(rejectionData.id, rejectionData.type, 'Rejected', rejectionData.remarks);
      setOpenRejectionModal(false);
      setRejectionData(null);
    }
  };

  const handleRejectionCancel = () => {
    setOpenRejectionModal(false);
    setRejectionData(null);
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
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Not Approved</CardTitle>
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
                                  <Button size="icon" variant="ghost" onClick={() => handleRejectClick(item.id, 'indent')} title="Reject">
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
              {/* PO Summary Cards */}
              <div className="grid grid-cols-1 gap-2 mb-3 md:grid-cols-3 md:gap-4 md:mb-6">
                <Card className="bg-green-50 border border-green-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Approved</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{poSummary.approved.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{poSummary.approved.amount.toLocaleString()}</div>
                    </div>
                    <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-green-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-red-50 border border-red-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Not Approved</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{poSummary.rejected.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{poSummary.rejected.amount.toLocaleString()}</div>
                    </div>
                    <XCircle className="w-5 h-5 md:w-8 md:h-8 text-red-500 mt-1" />
                  </CardHeader>
                </Card>
                <Card className="bg-yellow-50 border border-yellow-200 shadow-none p-0">
                  <CardHeader className="flex flex-row items-start justify-between p-2 md:p-4 pb-1 md:pb-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-medium text-gray-800">Total Pending</CardTitle>
                      <div className="text-lg md:text-2xl font-bold mt-1 md:mt-2 mb-1">{poSummary.pending.count}</div>
                      <div className="text-xs md:text-sm text-gray-500">Amount: ₹{poSummary.pending.amount.toLocaleString()}</div>
                    </div>
                    <Hourglass className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 mt-1" />
                  </CardHeader>
                </Card>
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
                                  <Button size="icon" variant="ghost" onClick={() => handleRejectClick(item.id, 'po')} title="Reject">
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

        {/* Indent Report Modal */}
        <Dialog open={!!openIndent} onOpenChange={v => !v && setOpenIndent(null)}>
          <DialogContent
            className="p-0 overflow-hidden flex flex-col bg-white"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              margin: 0,
              transform: 'none'
            }}
          >
            <IndentReportModal
              isOpen={!!openIndent}
              onClose={() => setOpenIndent(null)}
              indent={openIndent}
            />
          </DialogContent>
        </Dialog>

        {/* PO Detail Modal */}
        <Dialog open={!!openPO} onOpenChange={(v) => !v && setOpenPO(null)}>
          <DialogContent
            className="w-fit h-fit max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
          >
            {openPO && (
              <div className="h-full flex flex-col">
                {/* HEADER - Sticky */}
                <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Purchase Order Details
                    </h2>
                    <p className="text-sm text-gray-500">ID: {openPO.id}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setOpenPO(null)}
                    className="h-8 w-8 p-0 rounded-full border-gray-300 text-gray-600 
             hover:bg-gray-100 hover:text-red-600 hover:border-red-300 
             transition-all duration-200 flex items-center justify-center"
                    title="Close"
                  >
                    ✕
                  </Button>

                </div>

                {/* BODY - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">


                  {/* Actions */}
                  <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                      Actions
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3 pt-3">


                      <Button
                        variant="outline"
                        onClick={() => setOpenPODoc(true)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Final PO Document
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setOpenVendorChart(true)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Vendor Comparison Chart
                      </Button>
                    </div>
                  </div>

                  {/* Ordered Items */}
                  {openPO.items?.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-5">
                      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                        Ordered Items
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border mt-3 text-sm">
                          <thead className="bg-gray-50 text-gray-600 text-left">
                            <tr>
                              <th className="px-3 py-2 border">Item</th>
                              <th className="px-3 py-2 border">Quantity</th>
                              <th className="px-3 py-2 border">Make</th>
                              <th className="px-3 py-2 border">Approx. Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {openPO.items.map((item: any, i: number) => (
                              <tr
                                key={i}
                                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                              >
                                <td className="px-3 py-2 border">{item.itemName}</td>
                                <td className="px-3 py-2 border">{item.quantity}</td>
                                <td className="px-3 py-2 border">{item.make}</td>
                                <td className="px-3 py-2 border">
                                  ₹{item.approxValue.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* FOOTER - Sticky */}
                <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setOpenPO(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Vendor Comparison Chart Modal */}
        <Dialog open={openVendorChart} onOpenChange={setOpenVendorChart}>
          <DialogContent
            className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 bg-gray-100 overflow-y-auto"
          >
            {/* Header (scrolls with content) */}
            <div className="bg-white border-b shadow-sm px-4 py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Vendor Comparison Chart
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Preview of the vendor comparison chart for this PO.
              </p>
            </div>

            {/* Chart Content */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="w-full max-w-6xl mx-auto bg-white shadow rounded-lg p-4 sm:p-6">
                <ComparisonChartReport />
              </div>
            </div>

            {/* Footer (scrolls with content) */}
            <div className="bg-white border-t shadow-inner px-4 py-3 flex justify-end">
              <Button variant="outline" onClick={() => setOpenVendorChart(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>


        {/* Final PO Document Modal */}
        <Dialog open={openPODoc} onOpenChange={setOpenPODoc}>
          <DialogContent
            className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 bg-gray-100 overflow-y-auto"
          >
            {/* Header (scrolls with content) */}
            <div className="bg-white border-b shadow-sm px-4 py-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Final Purchase Order Document
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Preview of the final PO document for this order.
              </p>
            </div>

            {/* Document Section */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="w-full max-w-5xl mx-auto bg-white shadow rounded-lg p-4 sm:p-6">
                <PurchaseOrderPage />
              </div>
            </div>

            {/* Footer (scrolls with content) */}
            <div className="bg-white border-t shadow-inner px-4 py-3 flex justify-end">
              <Button variant="outline" onClick={() => setOpenPODoc(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rejection Remarks Modal */}
        <Dialog open={openRejectionModal} onOpenChange={setOpenRejectionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rejection Remarks</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this {rejectionData?.type === 'indent' ? 'indent' : 'purchase order'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="remarks" className="text-sm font-medium">
                  Remarks *
                </label>
                <textarea
                  id="remarks"
                  value={rejectionData?.remarks || ''}
                  onChange={(e) => setRejectionData(prev => prev ? { ...prev, remarks: e.target.value } : null)}
                  placeholder="Enter rejection reason..."
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleRejectionCancel}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRejectionSubmit}
                disabled={!rejectionData?.remarks?.trim()}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default ManagementDashboard;
