import React, { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import ComparisonChartReport from '@/components/ComparisonChartReport';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import IndentReport from '@/components/IndentReport';

interface AssignedIndent {
  id: string;
  title: string;
  quantity: string;
  department: string;
  college: string;
  category: string;
  status: string;
  assignedDate: string;
  deadline: string;
}

const vendorsList = ['ABC Traders', 'XYZ Supplies', 'Global Tech', 'EquipMart'];

const vendorQuotes: { [key: string]: { name: string; price: string; delivery: string }[] } = {
  IND001: [
    { name: 'ABC Traders', price: '₹23,500', delivery: '10 days' },
    { name: 'XYZ Supplies', price: '₹22,800', delivery: '12 days' },
  ],
  IND002: [
    { name: 'Global Tech', price: '₹45,000', delivery: '15 days' },
    { name: 'EquipMart', price: '₹43,500', delivery: '14 days' },
  ],
  IND_DEMO: [
    { name: 'ABC Traders', price: '₹23,500', delivery: '10 days' },
    { name: 'XYZ Supplies', price: '₹22,800', delivery: '12 days' },
    { name: 'Global Tech', price: '₹24,000', delivery: '9 days' },
  ],
};

const OfficerIndents: React.FC = () => {
  const { toast } = useToast();

  const [selectedIndent, setSelectedIndent] = useState<AssignedIndent | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showComparisonChart, setShowComparisonChart] = useState(false);
  const [finalizedVendor, setFinalizedVendor] = useState<{ [indentId: string]: string | null }>({});
  const [showFinalizeModal, setShowFinalizeModal] = useState<string | null>(null);
  const [showPOModal, setShowPOModal] = useState<string | null>(null);
  const [showIndentPreview, setShowIndentPreview] = useState<string | null>(null);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPDFPreviewModal, setShowPDFPreviewModal] = useState(false);
  const [sentEnquiries, setSentEnquiries] = useState<{ [indentId: string]: { form: typeof enquiryForm, pdfUrl: string } }>({});
  const [viewEnquiryIndentId, setViewEnquiryIndentId] = useState<string | null>(null);

  const [enquiryForm, setEnquiryForm] = useState({
    enquiryNumber: '',
    serial: '',
    name: '',
    description: '',
    delivery: '',
    payment: '',
    warranty: '',
    packing: '',
    vendors: [] as string[],
  });

  const [collegeFilter, setCollegeFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const indents: AssignedIndent[] = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      quantity: '2 Units',
      department: 'Biology',
      college: 'Dr. D.Y. Patil Arts, Commerce & Science College',
      category: 'Lab Equipment',
      status: 'pending_inquiry',
      assignedDate: '2024-01-15',
      deadline: '2024-01-20',
    },
    {
      id: 'IND002',
      title: 'Computer Systems',
      quantity: '5 Units',
      department: 'IT',
      college: 'Dr. DY Patil Institute of Technology',
      category: 'Electronics',
      status: 'inquiry_sent',
      assignedDate: '2024-01-14',
      deadline: '2024-01-22',
    },
    {
      id: 'IND_DEMO',
      title: 'Demo Indent - Projector System',
      quantity: '3 Units',
      department: 'AV Services',
      college: 'Dr. D. Y. Patil Medical College, Hospital & Research',
      category: 'Electronics',
      status: 'quotation_received',
      assignedDate: '2024-01-10',
      deadline: '2024-01-30',
    },
    {
      id: 'IND004',
      title: 'Laboratory Equipment',
      quantity: '2 Units',
      department: 'Biology',
      college: 'Dr. DY Patil Institute of Technology',
      category: 'Lab Equipment',
      status: 'pending_inquiry',
      assignedDate: '2024-02-15',
      deadline: '2024-09-20',
    },
  ];

  const filteredIndents = useMemo(() => {
    return indents.filter(i =>
      (collegeFilter === 'All' || i.college === collegeFilter) &&
      (departmentFilter === 'All' || i.department === departmentFilter)
    );
  }, [collegeFilter, departmentFilter, indents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_inquiry': return 'bg-yellow-100 text-yellow-800';
      case 'inquiry_sent': return 'bg-blue-100 text-blue-800';
      case 'quotation_received': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEnquiry = (indent: AssignedIndent) => {
    setSelectedIndent(indent);
    setEnquiryForm({
      enquiryNumber: '',
      serial: '',
      name: indent.title,
      description: `Indent for ${indent.quantity} in ${indent.department}`,
      delivery: '',
      payment: '',
      warranty: '',
      packing: '',
      vendors: [],
    });
    setShowEnquiryModal(true);
  };

  const handlePreviewPDF = () => {
    if (!selectedIndent) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-GB');
    const centerX = doc.internal.pageSize.getWidth() / 2;

    doc.setFontSize(14).setFont('helvetica', 'bold').setTextColor(255, 0, 0);
    doc.text('DR. D. Y. PATIL UNIVERSITY', centerX, 15, { align: 'center' });

    doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(0, 0, 0);
    doc.text(`Reference No: ${enquiryForm.enquiryNumber || 'N/A'}`, 10, 30);
    doc.text(`Date: ${date}`, 150, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Value']],
      body: [
        ['Indent ID', selectedIndent.id],
        ['Item Name', enquiryForm.name],
        ['Description', enquiryForm.description],
        ['Quantity', selectedIndent.quantity],
        ['Delivery', enquiryForm.delivery],
        ['Payment', enquiryForm.payment],
        ['Warranty', enquiryForm.warranty],
        ['Packing', enquiryForm.packing],
        ['Vendors', enquiryForm.vendors.join(', ') || 'N/A'],
      ],
      theme: 'grid',
      headStyles: { fillColor: [200, 0, 0], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { fontSize: 11 },
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShowPDFPreviewModal(true);
  };

  const handleConfirmSendEnquiry = () => {
    if (!selectedIndent || !pdfUrl) return;
    toast({ title: 'Enquiry Sent', description: `Sent to: ${enquiryForm.vendors.join(', ') || 'No vendors'}` });
    setSentEnquiries(prev => ({ ...prev, [selectedIndent.id]: { form: { ...enquiryForm }, pdfUrl } }));
    setShowPDFPreviewModal(false);
    setShowEnquiryModal(false);
    setSelectedIndent(null);
    setPdfUrl(null);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Assigned Indents" subtitle="Manage your assigned procurement tasks" />
      <div className="p-6 space-y-4">

        {/* College Filter */}
        <div className="flex items-center space-x-2">
          <Label className="font-semibold">Search College:</Label>
          <select
            className="border-b-2 border-gray-400 focus:border-blue-500 outline-none p-1"
            value={collegeFilter}
            onChange={e => {
              setCollegeFilter(e.target.value);
              setDepartmentFilter('All'); // Reset dept when college changes
            }}
          >
            {['All', ...Array.from(new Set(indents.map(i => i.college)))].map(col => (
              <option key={col}>{col}</option>
            ))}
          </select>
        </div>

        <Card>
          <CardHeader><CardTitle>Your Assigned Indents</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indent ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIndents.map(indent => (
                  <TableRow key={indent.id}>
                    <TableCell>{indent.id}</TableCell>
                    <TableCell>{indent.title}</TableCell>
                    <TableCell>{indent.quantity}</TableCell>
                    <TableCell>{indent.department}</TableCell>
                    <TableCell>{indent.category}</TableCell>
                    <TableCell><Badge className={getStatusColor(indent.status)}>{indent.status}</Badge></TableCell>
                    <TableCell>{indent.deadline}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" onClick={() => setShowIndentPreview(indent.id)}>
                                <Eye className="w-5 h-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>See Indent</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {indent.status === 'pending_inquiry' && !sentEnquiries[indent.id] && (
                          <Button size="sm" onClick={() => handleSendEnquiry(indent)}>Send Enquiry</Button>
                        )}
                        {indent.status === 'quotation_received' && !finalizedVendor[indent.id] && (
                          <Button size="sm" variant="outline" onClick={() => setShowFinalizeModal(indent.id)}>Finalize Vendor</Button>
                        )}
                        {indent.status === 'quotation_received' && finalizedVendor[indent.id] && (
                          <>
                            <span className="text-green-700 font-semibold text-xs">
                              Finalized: {finalizedVendor[indent.id]}
                            </span>
                            <Button size="sm" variant="outline" onClick={() => setShowPOModal(indent.id)}>Generate PO</Button>
                          </>
                        )}
                        {indent.status === 'quotation_received' && (
                          <Button size="sm" variant="ghost" onClick={() => setShowComparisonChart(true)}>Compare Quotes</Button>
                        )}
                        {sentEnquiries[indent.id] && (
                          <Button size="sm" variant="secondary" onClick={() => setViewEnquiryIndentId(indent.id)}>View Enquiry</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* === Modals === */}
      <Dialog open={showComparisonChart} onOpenChange={setShowComparisonChart}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">

            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Vendor Comparison Chart
                </h2>
                <p className="text-sm text-gray-500">
                  Detailed vendor comparison for this Purchase Order
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowComparisonChart(false)}
              >
                ✕
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg shadow p-5">
                <ComparisonChartReport />
              </div>
            </div>


            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowComparisonChart(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">

            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Generate Enquiry
                </h2>
                <p className="text-sm text-gray-500">
                  Enquiry for Indent ID:{" "}
                  <span className="font-medium">{selectedIndent?.id}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowEnquiryModal(false)}
              >
                ✕
              </Button>
            </div>


            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 🔹 Enquiry Details */}
              <div className="bg-white rounded-lg shadow p-5 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  Enquiry Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Enquiry ID</Label>
                    <Input
                      value={enquiryForm.enquiryNumber}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          enquiryNumber: e.target.value,
                        })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                  <div>
                    <Label>Serial</Label>
                    <Input
                      value={enquiryForm.serial}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, serial: e.target.value })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={enquiryForm.description}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 🔹 Terms & Conditions */}
              <div className="bg-white rounded-lg shadow p-5 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  Terms & Conditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery</Label>
                    <Input
                      value={enquiryForm.delivery}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, delivery: e.target.value })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                  <div>
                    <Label>Payment</Label>
                    <Input
                      value={enquiryForm.payment}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, payment: e.target.value })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                  <div>
                    <Label>Warranty</Label>
                    <Input
                      value={enquiryForm.warranty}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, warranty: e.target.value })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                  <div>
                    <Label>Packing</Label>
                    <Input
                      value={enquiryForm.packing}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, packing: e.target.value })
                      }
                      className="h-10 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* 🔹 Vendor Selection */}
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                  Select Vendors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {vendorsList.map((vendor) => (
                    <label
                      key={vendor}
                      className={`flex items-center space-x-3 p-2 rounded-md border transition-all cursor-pointer ${enquiryForm.vendors.includes(vendor)
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={enquiryForm.vendors.includes(vendor)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...enquiryForm.vendors, vendor]
                            : enquiryForm.vendors.filter((v) => v !== vendor);
                          setEnquiryForm({ ...enquiryForm, vendors: updated });
                        }}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">{vendor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEnquiryModal(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePreviewPDF}
              >
                Preview PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog
        open={showPDFPreviewModal}
        onOpenChange={(v) => !v && setShowPDFPreviewModal(false)}
      >
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">

            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Preview Enquiry PDF
                </h2>
                <p className="text-sm text-gray-500">
                  Review the generated enquiry PDF before sending
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowPDFPreviewModal(false)}
              >
                ✕
              </Button>
            </div>


            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-lg shadow p-4 h-[75vh]">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full border rounded"
                    title="PDF Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No PDF available to preview
                  </div>
                )}
              </div>
            </div>


            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPDFPreviewModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleConfirmSendEnquiry}
              >
                Send Enquiry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      <Dialog
        open={!!showFinalizeModal}
        onOpenChange={(v) => !v && setShowFinalizeModal(null)}
      >
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">

            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Finalize Vendor</h2>
                <p className="text-sm text-gray-500">
                  Select the best vendor from the list below
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowFinalizeModal(null)}
              >
                ✕
              </Button>
            </div>


            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(showFinalizeModal && vendorQuotes[showFinalizeModal])?.map((vendor: any) => (
                <div
                  key={vendor.name}
                  className="flex items-center justify-between bg-white shadow rounded-lg p-4 border hover:shadow-md transition"
                >
                  <div>
                    <div className="font-semibold text-gray-800">{vendor.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      💰 <span className="font-medium">Price:</span> {vendor.price} | 🚚{' '}
                      <span className="font-medium">Delivery:</span> {vendor.delivery}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 text-white hover:bg-green-700"
                    onClick={() => {
                      setFinalizedVendor((prev) => ({
                        ...prev,
                        [showFinalizeModal]: vendor.name,
                      }));
                      setShowFinalizeModal(null);
                      toast({
                        title: 'Vendor Finalized',
                        description: `Finalized ${vendor.name}`,
                      });
                    }}
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowFinalizeModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* ✅ Generate Purchase Order Modal */}
      <Dialog open={!!showPOModal} onOpenChange={(v) => !v && setShowPOModal(null)}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Generate Purchase Order</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowPOModal(null)}
              >
                ✕
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {showPOModal && finalizedVendor[showPOModal] && (
                <PurchaseOrderPage />
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowPOModal(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Indent Preview Modal */}
      <Dialog open={!!showIndentPreview} onOpenChange={(v) => !v && setShowIndentPreview(null)}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Indent Preview</h2>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowIndentPreview(null)}
              >
                ✕
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {showIndentPreview && <IndentReport />}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowIndentPreview(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ View Enquiry Modal */}
      <Dialog open={!!viewEnquiryIndentId} onOpenChange={(v) => !v && setViewEnquiryIndentId(null)}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <div className="h-full flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                View Enquiry - {viewEnquiryIndentId}
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setViewEnquiryIndentId(null)}
              >
                ✕
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {viewEnquiryIndentId && sentEnquiries[viewEnquiryIndentId] && (
                <iframe
                  src={sentEnquiries[viewEnquiryIndentId].pdfUrl}
                  className="w-full h-[80vh] border rounded"
                />
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewEnquiryIndentId(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default OfficerIndents;
