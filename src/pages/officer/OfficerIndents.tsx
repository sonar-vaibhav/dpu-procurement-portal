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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import ComparisonChartReport from '@/components/ComparisonChartReport';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import IndentReport from '@/components/IndentReport';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { getCollegeNames } from '@/constants/colleges';

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

const vendorContactDetails = {
  'ABC Traders': {
    name: 'ABC Traders',
    contact: '+91 98765 43210',
    email: 'info@abctraders.com',
    address: '123 Business Park, Mumbai, Maharashtra'
  },
  'XYZ Supplies': {
    name: 'XYZ Supplies',
    contact: '+91 87654 32109',
    email: 'contact@xyzsupplies.com',
    address: '456 Industrial Area, Pune, Maharashtra'
  },
  'Global Tech': {
    name: 'Global Tech',
    contact: '+91 76543 21098',
    email: 'sales@globaltech.com',
    address: '789 Tech Hub, Bangalore, Karnataka'
  },
  'EquipMart': {
    name: 'EquipMart',
    contact: '+91 65432 10987',
    email: 'info@equipmart.com',
    address: '321 Equipment Street, Delhi, NCR'
  }
};

const vendorQuotes: {
  [key: string]: {
    name: string;
    price: string;
    delivery: string;
    quote: {
      total: string;
      gst: string;
      loadingCharges: string;
      packingForwarding: string;
      grossTotal: string;
      warranty: string;
      delivery: string;
      payment: string;
      products: Array<{
        itemName: string;
        description: string;
        quantity: string;
        unitPrice: string;
        totalPrice: string;
      }>;
    };
  }[]
} = {
  IND001: [
    {
      name: 'ABC Traders',
      price: '₹23,500',
      delivery: '10 days',
      quote: {
        total: '₹19,915',
        gst: '₹3,585',
        loadingCharges: '₹500',
        packingForwarding: '₹300',
        grossTotal: '₹24,300',
        warranty: '1 Year',
        delivery: '10 days',
        payment: '50% advance, 50% on delivery',
        products: [
          {
            itemName: 'Digital Microscope',
            description: 'High-resolution digital microscope for research',
            quantity: '2',
            unitPrice: '₹9,957',
            totalPrice: '₹19,915'
          }
        ]
      }
    },
    {
      name: 'XYZ Supplies',
      price: '₹22,800',
      delivery: '12 days',
      quote: {
        total: '₹19,322',
        gst: '₹3,478',
        loadingCharges: '₹400',
        packingForwarding: '₹200',
        grossTotal: '₹23,400',
        warranty: '1 Year',
        delivery: '12 days',
        payment: '30% advance, 70% on delivery',
        products: [
          {
            itemName: 'Digital Microscope',
            description: 'High-resolution digital microscope for research',
            quantity: '2',
            unitPrice: '₹9,661',
            totalPrice: '₹19,322'
          }
        ]
      }
    },
  ],
  IND002: [
    {
      name: 'Global Tech',
      price: '₹45,000',
      delivery: '15 days',
      quote: {
        total: '₹38,136',
        gst: '₹6,864',
        loadingCharges: '₹800',
        packingForwarding: '₹500',
        grossTotal: '₹46,300',
        warranty: '2 Years',
        delivery: '15 days',
        payment: '40% advance, 60% on delivery',
        products: [
          {
            itemName: 'Desktop Computers',
            description: 'High-performance desktop computers',
            quantity: '5',
            unitPrice: '₹7,627',
            totalPrice: '₹38,136'
          }
        ]
      }
    },
    {
      name: 'EquipMart',
      price: '₹43,500',
      delivery: '14 days',
      quote: {
        total: '₹36,864',
        gst: '₹6,636',
        loadingCharges: '₹700',
        packingForwarding: '₹400',
        grossTotal: '₹44,600',
        warranty: '1 Year',
        delivery: '14 days',
        payment: '50% advance, 50% on delivery',
        products: [
          {
            itemName: 'Desktop Computers',
            description: 'High-performance desktop computers',
            quantity: '5',
            unitPrice: '₹7,373',
            totalPrice: '₹36,864'
          }
        ]
      }
    },
  ],
  IND_DEMO: [
    {
      name: 'ABC Traders',
      price: '₹23,500',
      delivery: '10 days',
      quote: {
        total: '₹19,915',
        gst: '₹3,585',
        loadingCharges: '₹500',
        packingForwarding: '₹300',
        grossTotal: '₹24,300',
        warranty: '1 Year',
        delivery: '10 days',
        payment: '50% advance, 50% on delivery',
        products: [
          {
            itemName: 'Projector System',
            description: 'Full HD projector for large hall',
            quantity: '3',
            unitPrice: '₹6,638',
            totalPrice: '₹19,915'
          }
        ]
      }
    },
    {
      name: 'XYZ Supplies',
      price: '₹22,800',
      delivery: '12 days',
      quote: {
        total: '₹19,322',
        gst: '₹3,478',
        loadingCharges: '₹400',
        packingForwarding: '₹200',
        grossTotal: '₹23,400',
        warranty: '1 Year',
        delivery: '12 days',
        payment: '30% advance, 70% on delivery',
        products: [
          {
            itemName: 'Projector System',
            description: 'Full HD projector for large hall',
            quantity: '3',
            unitPrice: '₹6,441',
            totalPrice: '₹19,322'
          }
        ]
      }
    },
    {
      name: 'Global Tech',
      price: '₹24,000',
      delivery: '9 days',
      quote: {
        total: '₹20,339',
        gst: '₹3,661',
        loadingCharges: '₹600',
        packingForwarding: '₹400',
        grossTotal: '₹25,000',
        warranty: '2 Years',
        delivery: '9 days',
        payment: '40% advance, 60% on delivery',
        products: [
          {
            itemName: 'Projector System',
            description: 'Full HD projector for large hall',
            quantity: '3',
            unitPrice: '₹6,780',
            totalPrice: '₹20,339'
          }
        ]
      }
    },
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

  // Quote viewing and editing states
  const [showQuoteModal, setShowQuoteModal] = useState<{ indentId: string; vendorName: string } | null>(null);
  const [editingQuote, setEditingQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<any>(null);

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
    items: [] as any[],
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
      items: [
        {
          sr: 1,
          itemName: indent.title,
          description: `${indent.category} - ${indent.quantity}`,
          make: 'To be specified',
          modelNo: 'To be specified',
          qty: indent.quantity,
          uom: 'Units',
          stock: 0,
          similar: '-',
          value: 'To be quoted',
        }
      ],
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

    // Basic enquiry details
    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Value']],
      body: [
        ['Department', selectedIndent.department],
        ['Category', selectedIndent.category],
        ['Delivery', enquiryForm.delivery],
        ['Payment', enquiryForm.payment],
        ['Warranty', enquiryForm.warranty],
        ['Packing', enquiryForm.packing],
      ],
      theme: 'grid',
      headStyles: { fillColor: [200, 0, 0], textColor: 255, fontStyle: 'bold' },
      bodyStyles: { fontSize: 11 },
    });

    // Product details table
    if (enquiryForm.items.length > 0) {
      autoTable(doc, {
        startY: 120, // Fixed position after the first table
        head: [['Sr. No.', 'Item Name', 'Description', 'Make', 'Model No.', 'Quantity', 'UOM', 'Approx. Value']],
        body: enquiryForm.items.map((item, index) => [
          index + 1,
          item.itemName,
          item.description,
          item.make,
          item.modelNo,
          item.qty,
          item.uom,
          item.value
        ]),
        theme: 'grid',
        headStyles: { fillColor: [200, 0, 0], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10 },
        styles: { cellPadding: 2 },
      });
    }

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

  const handleViewQuote = (indentId: string, vendorName: string) => {
    const vendorQuote = vendorQuotes[indentId]?.find(v => v.name === vendorName);
    if (vendorQuote) {
      setCurrentQuote(vendorQuote.quote);
      setShowQuoteModal({ indentId, vendorName });
      setEditingQuote(false);
    }
  };

  const handleEditQuote = (indentId: string, vendorName: string) => {
    const vendorQuote = vendorQuotes[indentId]?.find(v => v.name === vendorName);
    if (vendorQuote) {
      setCurrentQuote({ ...vendorQuote.quote });
      setShowQuoteModal({ indentId, vendorName });
      setEditingQuote(true);
    }
  };

  const handleSaveQuote = () => {
    if (!showQuoteModal || !currentQuote) return;

    // Update the quote in vendorQuotes (in a real app, this would be an API call)
    toast({
      title: 'Quote Updated',
      description: `Quote for ${showQuoteModal.vendorName} has been updated successfully.`
    });

    setEditingQuote(false);
    setShowQuoteModal(null);
    setCurrentQuote(null);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Assigned Indents" subtitle="Manage your assigned procurement tasks" />
      <div className="p-6 space-y-4">

        {/* College Filter */}
        <div className="flex items-center space-x-2">
          <Label className="font-semibold">Search College:</Label>
          <div className="w-64">
            <SearchableSelect
              placeholder="Search and select college..."
              value={collegeFilter}
              onValueChange={(value) => {
                setCollegeFilter(value);
                setDepartmentFilter('All'); // Reset dept when college changes
              }}
              options={['All', ...getCollegeNames()]}
            />
          </div>
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
          <DialogHeader className="sr-only">
            <DialogTitle>Vendor Comparison Chart</DialogTitle>
            <DialogDescription>Detailed vendor comparison for this Purchase Order</DialogDescription>
          </DialogHeader>
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
          <DialogHeader className="sr-only">
            <DialogTitle>Generate Enquiry</DialogTitle>
            <DialogDescription>Enquiry for Indent ID: {selectedIndent?.id}</DialogDescription>
          </DialogHeader>
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


            <div className="flex-1 overflow-y-auto p-6 space-y-6 ">
              {/* 🔹 Product Details */}
              <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                  Product Details
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left">Sr. No.</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Item Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Make</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Model No.</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Quantity</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">UOM</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Approx. Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiryForm.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2">{item.sr}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.itemName}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].itemName = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].description = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.make}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].make = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.modelNo}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].modelNo = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.qty}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].qty = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.uom}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].uom = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                const updatedItems = [...enquiryForm.items];
                                updatedItems[index].value = e.target.value;
                                setEnquiryForm({ ...enquiryForm, items: updatedItems });
                              }}
                              className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItem = {
                        sr: enquiryForm.items.length + 1,
                        itemName: '',
                        description: '',
                        make: '',
                        modelNo: '',
                        qty: '',
                        uom: '',
                        stock: 0,
                        similar: '-',
                        value: '',
                      };
                      setEnquiryForm({
                        ...enquiryForm,
                        items: [...enquiryForm.items, newItem],
                      });
                    }}
                  >
                    + Add Item
                  </Button>
                  {enquiryForm.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedItems = enquiryForm.items.slice(0, -1);
                        setEnquiryForm({ ...enquiryForm, items: updatedItems });
                      }}
                    >
                      - Remove Last Item
                    </Button>
                  )}
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
          <DialogHeader className="sr-only">
            <DialogTitle>Preview Enquiry PDF</DialogTitle>
            <DialogDescription>Review the generated enquiry PDF before sending</DialogDescription>
          </DialogHeader>
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
          <DialogHeader className="sr-only">
            <DialogTitle>Finalize Vendor</DialogTitle>
            <DialogDescription>Select the best vendor from the list below</DialogDescription>
          </DialogHeader>
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
                  className="bg-white shadow rounded-lg p-3 sm:p-4 border hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">{vendor.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        💰 <span className="font-medium">Price:</span> {vendor.price} | 🚚{' '}
                        <span className="font-medium">Delivery:</span> {vendor.delivery}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="whitespace-nowrap text-xs sm:text-sm"
                        onClick={() => handleViewQuote(showFinalizeModal, vendor.name)}
                      >
                        See and Edit Quote
                      </Button>


                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700 whitespace-nowrap text-xs sm:text-sm"
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
                        Select Vendor
                      </Button>

                    </div>
                  </div>
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
          <DialogHeader className="sr-only">
            <DialogTitle>Generate Purchase Order</DialogTitle>
            <DialogDescription>Generate purchase order for the finalized vendor</DialogDescription>
          </DialogHeader>
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
          <DialogHeader className="sr-only">
            <DialogTitle>Indent Preview</DialogTitle>
            <DialogDescription>Preview the indent details and specifications</DialogDescription>
          </DialogHeader>
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
          <DialogHeader className="sr-only">
            <DialogTitle>View Enquiry - {viewEnquiryIndentId}</DialogTitle>
            <DialogDescription>View the sent enquiry details and PDF</DialogDescription>
          </DialogHeader>
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
                <>
                  {/* Vendor Details Section */}
                  <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                      Vendors Sent To
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sentEnquiries[viewEnquiryIndentId].form.vendors.map((vendorName: string) => {
                        const vendorDetails = vendorContactDetails[vendorName as keyof typeof vendorContactDetails];
                        return (
                          <div key={vendorName} className="bg-gray-50 rounded-lg p-3 border">
                            <div className="font-semibold text-gray-800 text-sm">{vendorDetails?.name || vendorName}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              <div>📞 {vendorDetails?.contact || 'Contact: N/A'}</div>
                              <div>📧 {vendorDetails?.email || 'Email: N/A'}</div>
                              <div>📍 {vendorDetails?.address || 'Address: N/A'}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="p-3 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-700">Enquiry PDF</h4>
                    </div>
                    <iframe
                      src={sentEnquiries[viewEnquiryIndentId].pdfUrl}
                      className="w-full h-[70vh] border-0"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setViewEnquiryIndentId(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Quote View/Edit Modal */}
      <Dialog open={!!showQuoteModal} onOpenChange={(v) => !v && setShowQuoteModal(null)}>
        <DialogContent
          className="w-screen h-screen max-w-none max-h-none rounded-none 
               shadow-none p-0 overflow-y-auto bg-gray-100"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Quote Details - {showQuoteModal?.vendorName}</DialogTitle>
            <DialogDescription>View and edit quote details</DialogDescription>
          </DialogHeader>
          <div className="h-full flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Quote Details - {showQuoteModal?.vendorName}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingQuote ? 'Edit Quote' : 'View Quote'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-full border-gray-300 text-gray-600 
                     hover:bg-gray-100 hover:text-red-600 hover:border-red-300"
                onClick={() => setShowQuoteModal(null)}
              >
                ✕
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentQuote && (
                <div className="space-y-6">
                  {/* Products Section */}
                  <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                      Products
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-3 py-2 text-left">Item Name</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Quantity</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Unit Price</th>
                            <th className="border border-gray-300 px-3 py-2 text-left">Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentQuote.products.map((product: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2">
                                {editingQuote ? (
                                  <Input
                                    value={product.itemName}
                                    onChange={(e) => {
                                      const updatedProducts = [...currentQuote.products];
                                      updatedProducts[index].itemName = e.target.value;
                                      setCurrentQuote({ ...currentQuote, products: updatedProducts });
                                    }}
                                    className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                                  />
                                ) : (
                                  product.itemName
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {editingQuote ? (
                                  <Input
                                    value={product.description}
                                    onChange={(e) => {
                                      const updatedProducts = [...currentQuote.products];
                                      updatedProducts[index].description = e.target.value;
                                      setCurrentQuote({ ...currentQuote, products: updatedProducts });
                                    }}
                                    className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                                  />
                                ) : (
                                  product.description
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {editingQuote ? (
                                  <Input
                                    value={product.quantity}
                                    onChange={(e) => {
                                      const updatedProducts = [...currentQuote.products];
                                      updatedProducts[index].quantity = e.target.value;
                                      setCurrentQuote({ ...currentQuote, products: updatedProducts });
                                    }}
                                    className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                                  />
                                ) : (
                                  product.quantity
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {editingQuote ? (
                                  <Input
                                    value={product.unitPrice}
                                    onChange={(e) => {
                                      const updatedProducts = [...currentQuote.products];
                                      updatedProducts[index].unitPrice = e.target.value;
                                      setCurrentQuote({ ...currentQuote, products: updatedProducts });
                                    }}
                                    className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                                  />
                                ) : (
                                  product.unitPrice
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {editingQuote ? (
                                  <Input
                                    value={product.totalPrice}
                                    onChange={(e) => {
                                      const updatedProducts = [...currentQuote.products];
                                      updatedProducts[index].totalPrice = e.target.value;
                                      setCurrentQuote({ ...currentQuote, products: updatedProducts });
                                    }}
                                    className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                                  />
                                ) : (
                                  product.totalPrice
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                      Financial Breakdown
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Total</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.total}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, total: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-lg font-semibold">{currentQuote.total}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">GST [ Extra @18% ]</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.gst}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, gst: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-lg font-semibold">{currentQuote.gst}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Loading & Unloading charges</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.loadingCharges}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, loadingCharges: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-lg font-semibold">{currentQuote.loadingCharges}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">P & F</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.packingForwarding}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, packingForwarding: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-lg font-semibold">{currentQuote.packingForwarding}</div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium">Gross Total</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.grossTotal}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, grossTotal: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-2xl font-bold text-green-600">{currentQuote.grossTotal}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms Section */}
                  <div className="bg-white rounded-lg shadow p-5">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                      Terms & Conditions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Warranty</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.warranty}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, warranty: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-sm">{currentQuote.warranty}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Delivery</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.delivery}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, delivery: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-sm">{currentQuote.delivery}</div>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Payment</Label>
                        {editingQuote ? (
                          <Input
                            value={currentQuote.payment}
                            onChange={(e) => setCurrentQuote({ ...currentQuote, payment: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 text-sm">{currentQuote.payment}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white border-t shadow-inner px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowQuoteModal(null)}>
                Close
              </Button>
              {editingQuote ? (
                <Button onClick={handleSaveQuote} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              ) : (
                <Button
                  onClick={() => handleEditQuote(showQuoteModal!.indentId, showQuoteModal!.vendorName)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Edit Quote
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
};

export default OfficerIndents;
