
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
import { Eye, FileText, ListChecks } from 'lucide-react';

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
      <div className="p-6 min-h-screen bg-gray-50 space-y-10 rounded-xl shadow-inner">
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card className="flex flex-col items-center justify-center bg-green-50 border-green-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><ListChecks className="w-5 h-5 text-green-600 mb-1" /><CardTitle className="text-xs">Total Approved Indents</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-green-700">{indentSummary.approved}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><ListChecks className="w-5 h-5 text-yellow-600 mb-1" /><CardTitle className="text-xs">Total Pending Indents</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-yellow-700">{indentSummary.pending}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-green-50 border-green-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-green-600 mb-1" /><CardTitle className="text-xs">Total Approved Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-green-700">₹{indentSummary.approvedAmt.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-yellow-600 mb-1" /><CardTitle className="text-xs">Total Pending Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-yellow-700">₹{indentSummary.pendingAmt.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-blue-600 mb-1" /><CardTitle className="text-xs">Total Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-blue-700">₹{(indentSummary.approvedAmt+indentSummary.pendingAmt).toLocaleString()}</div></CardContent>
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
                            <td><input type="checkbox" checked={selectedIndents.includes(item.id)} onChange={() => handleIndentSelect(item.id)} /></td>
                            <td>{item.title} <span className="text-xs text-gray-400">({item.id})</span></td>
                            <td>₹{item.amount.toLocaleString()}</td>
                            <td><Badge variant={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'outline' : 'secondary'} className={item.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{item.status}</Badge></td>
                            <td><Button size="icon" variant="ghost" onClick={() => setOpenIndent(item)} title="Preview"><Eye className="w-5 h-5" /></Button></td>
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <Card className="flex flex-col items-center justify-center bg-green-50 border-green-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-green-600 mb-1" /><CardTitle className="text-xs">Total Approved POs</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-green-700">{poSummary.approved}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-yellow-600 mb-1" /><CardTitle className="text-xs">Total Pending POs</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-yellow-700">{poSummary.pending}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-green-50 border-green-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-green-600 mb-1" /><CardTitle className="text-xs">Total Approved Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-green-700">₹{poSummary.approvedAmt.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-yellow-50 border-yellow-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-yellow-600 mb-1" /><CardTitle className="text-xs">Total Pending Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-yellow-700">₹{poSummary.pendingAmt.toLocaleString()}</div></CardContent>
                </Card>
                <Card className="flex flex-col items-center justify-center bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2 flex flex-col items-center"><FileText className="w-5 h-5 text-blue-600 mb-1" /><CardTitle className="text-xs">Total Amount</CardTitle></CardHeader><CardContent><div className="text-lg font-bold text-blue-700">₹{(poSummary.approvedAmt+poSummary.pendingAmt).toLocaleString()}</div></CardContent>
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
                            <td><input type="checkbox" checked={selectedPOs.includes(item.id)} onChange={() => handlePOSelect(item.id)} /></td>
                            <td>{item.title} <span className="text-xs text-gray-400">({item.id})</span></td>
                            <td>₹{item.amount.toLocaleString()}</td>
                            <td><Badge variant={item.status === 'Approved' ? 'success' : item.status === 'Pending' ? 'outline' : 'secondary'} className={item.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{item.status}</Badge></td>
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
        <Dialog open={!!openIndent} onOpenChange={v => !v && setOpenIndent(null)}>
          <DialogContent className="max-w-xl">
            {openIndent && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Indent Details</CardTitle>
                  <CardDescription>ID: {openIndent.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2"><span className="font-medium">Title:</span> {openIndent.title}</div>
                  <div className="mb-2"><span className="font-medium">College:</span> {openIndent.college}</div>
                  <div className="mb-2"><span className="font-medium">Requested Amount:</span> <span className="text-blue-700 font-semibold">₹{openIndent.amount.toLocaleString()}</span></div>
                  <div className="mb-2"><span className="font-medium">Status:</span> <Badge variant={openIndent.status === 'Approved' ? 'success' : openIndent.status === 'Pending' ? 'outline' : 'secondary'} className={openIndent.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{openIndent.status}</Badge></div>
                  {/* Approval Trail Example */}
                  <div className="mt-4">
                    <div className="font-medium mb-1 text-gray-700">Approval Trail:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gray-200 text-gray-700">User ✓</Badge>
                      <Badge className="bg-gray-200 text-gray-700">HOD ✓</Badge>
                      <Badge className="bg-gray-200 text-gray-700">Store ✓</Badge>
                      <Badge className="bg-gray-200 text-gray-700">Registrar ✓</Badge>
                      <Badge className="bg-gray-200 text-gray-700">Principal ✓</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="outline" onClick={() => setOpenIndent(null)}>Close</Button>
                </CardFooter>
              </Card>
            )}
          </DialogContent>
        </Dialog>

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
                  <div className="mb-2"><span className="font-medium">Status:</span> <Badge variant={openPO.status === 'Approved' ? 'success' : openPO.status === 'Pending' ? 'outline' : 'secondary'} className={openPO.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}>{openPO.status}</Badge></div>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vendor Comparison Chart</DialogTitle>
              <DialogDescription>Preview of the vendor comparison chart for this PO.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-gray-500">[Vendor Comparison Chart Preview Here]</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenVendorChart(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final PO Document Modal */}
        <Dialog open={openPODoc} onOpenChange={setOpenPODoc}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Final Purchase Order Document</DialogTitle>
              <DialogDescription>Preview of the final PO document for this order.</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-gray-500">[Final PO Document Preview Here]</div>
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
