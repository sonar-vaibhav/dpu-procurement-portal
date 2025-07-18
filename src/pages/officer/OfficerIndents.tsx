import React, { useState } from 'react';
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
import ComparisonChartReport from '@/components/ComparisonChartReport';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import IndentReport from '@/components/IndentReport';
import { Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AssignedIndent {
  id: string;
  title: string;
  quantity: string;
  department: string;
  category: string;
  status: string;
  assignedDate: string;
  deadline: string;
}

const vendors = ['ABC Traders', 'XYZ Supplies', 'Global Tech', 'EquipMart'];

const OfficerIndents: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndent, setSelectedIndent] = useState<AssignedIndent | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [showComparisonChart, setShowComparisonChart] = useState(false);
  const [finalizedVendor, setFinalizedVendor] = useState<{ [indentId: string]: string | null }>({});
  const [showFinalizeModal, setShowFinalizeModal] = useState<string | null>(null);
  const [showPOModal, setShowPOModal] = useState<string | null>(null);
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
  const [showIndentPreview, setShowIndentPreview] = useState<string | null>(null);
  const [showPDFPreviewModal, setShowPDFPreviewModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [sentEnquiries, setSentEnquiries] = useState<{ [indentId: string]: { form: typeof enquiryForm, pdfUrl: string } }>({});
  const [viewEnquiryIndentId, setViewEnquiryIndentId] = useState<string | null>(null);

  // Dummy vendor quotes for the demo indent
  const vendorQuotes = {
    'IND_DEMO': [
      { name: 'ABC Traders', price: '₹23,500', delivery: '10 days' },
      { name: 'XYZ Supplies', price: '₹22,800', delivery: '12 days' },
      { name: 'Global Tech', price: '₹24,000', delivery: '9 days' },
    ]
  };

  const indents: AssignedIndent[] = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      quantity: '2 Units',
      department: 'Biology',
      category: 'Lab Equipment',
      status: 'pending_inquiry',
      assignedDate: '2024-01-15',
      deadline: '2024-01-20'
    },
    {
      id: 'IND002',
      title: 'Computer Systems',
      quantity: '5 Units',
      department: 'IT',
      category: 'Electronics',
      status: 'inquiry_sent',
      assignedDate: '2024-01-14',
      deadline: '2024-01-22'
    },
    {
      id: 'IND_DEMO',
      title: 'Demo Indent - Projector System',
      quantity: '3 Units',
      department: 'AV Services',
      category: 'Electronics',
      status: 'quotation_received',
      assignedDate: '2024-01-10',
      deadline: '2024-01-30'
    }
  ];

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

  const handleEnquirySubmit = () => {
    const formCopy = { ...enquiryForm };
    toast({
      title: 'Enquiry Sent',
      description: `Enquiry sent to: ${formCopy.vendors.join(', ') || 'No vendors selected'}`
    });
    handleGeneratePDF(formCopy);
    setShowEnquiryModal(false);
    setSelectedIndent(null);
  };

  const handleGeneratePDF = (data: typeof enquiryForm) => {
    if (!selectedIndent) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-GB');
    const centerX = doc.internal.pageSize.getWidth() / 2;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 0, 0);
    doc.text('DR. D. Y. PATIL UNIVERSITY', centerX, 15, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('(Deemed to be University)', centerX, 22, { align: 'center' });
    doc.text('Sector 7, Nerul, Navi Mumbai - 400706', centerX, 29, { align: 'center' });
    doc.text('Phone: +91-22-27821234 | Email: procurement@dpu.edu.in', centerX, 36, { align: 'center' });

    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(20, 40, doc.internal.pageSize.getWidth() - 20, 40);

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 0, 0);
    doc.text('VENDOR ENQUIRY FOR QUOTATION', centerX, 48, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Reference No: ${data.enquiryNumber || 'N/A'}`, 10, 58);
    doc.text(`Date: ${date}`, 150, 58);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 0, 0);
    doc.text('INDENT DETAILS', 10, 70);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const details = [
      `Enquiry ID: ${selectedIndent.id}`,
      `Item Name: ${selectedIndent.title}`,
      `Quantity Required: ${selectedIndent.quantity}`,
    ];
    details.forEach((line, i) => doc.text(line, 10, 78 + i * 7));

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 0, 0);
    doc.text('QUOTATION REQUIREMENTS', 10, 145);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const points = [
      `1. Name: ${data.name}`,
      `2. Description: ${data.description}`,
      `3. Delivery: ${data.delivery}`,
      `4. Payment: ${data.payment}`,
      `5. Warranty: ${data.warranty}`,
      `6. Packing: ${data.packing}`,
      `7. Vendors: ${data.vendors.length ? data.vendors.join(', ') : 'N/A'}`
    ];
    points.forEach((pt, i) => doc.text(pt, 10, 153 + i * 6));

    doc.setFontSize(11);
    doc.text('IMPORTANT: Submit quotation within 7 working days. The university may accept/reject any quote.', 10, 210);

    doc.setFontSize(12);
    doc.text('AUTHORIZED SIGNATURES', 10, 225);
    doc.text('Purchase Officer      HOD Approval      Registrar Approval', 10, 235);
    doc.text('Name: _________   Name: _________   Name: _________', 10, 243);
    doc.text('Date: _________    Date: _________    Date: _________', 10, 250);

    doc.save(`DPU_Enquiry_${selectedIndent.id}_${date.replace(/\//g, '-')}.pdf`);
  };

  // Dummy API-like indent data
  const dummyIndent = {
    enquiryId: 'ENQ2024-001',
    itemName: 'High-Resolution Microscope',
    quantity: '2 Units',
    description: 'A high-resolution microscope for cell research with 1000x magnification, LED illumination, and digital camera support.',
    delivery: 'Within 15 days from PO',
    warranty: '2 years comprehensive',
    payment: '50% advance, 50% on delivery',
    packing: 'Safe, shock-proof packaging',
  };

  const handlePreviewPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('en-GB');
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const logoImg = new Image();
    logoImg.src = '/dpu_logo.png';
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', 10, 8, 28, 18);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 0, 0);
      doc.text('DR. D. Y. PATIL UNITECH SOCIETY, PUNE', centerX, 16, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text('Central Purchase Department', centerX, 23, { align: 'center' });
      doc.setDrawColor(200, 0, 0);
      doc.setLineWidth(0.8);
      doc.line(10, 32, doc.internal.pageSize.getWidth() - 10, 32);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 0, 0);
      doc.text('VENDOR ENQUIRY FOR QUOTATION', centerX, 40, { align: 'center' });
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${date}`, 150, 48);
      // Indent Details Table using autoTable
      let y = 58;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INDENT DETAILS', 10, y);
      y += 4;
      // @ts-ignore: autoTable attaches lastAutoTable to doc
      autoTable(doc, {
        startY: y + 2,
        head: [['Field', 'Value']],
        body: [
          ['Enquiry ID', dummyIndent.enquiryId],
          ['Item Name', dummyIndent.itemName],
          ['Quantity Required', dummyIndent.quantity],
          ['Description / Specifications', dummyIndent.description],
          ['Delivery Requirement', dummyIndent.delivery],
          ['Warranty Expectation', dummyIndent.warranty],
          ['Payment Terms', dummyIndent.payment],
          ['Packing Instructions', dummyIndent.packing],
        ],
        theme: 'grid',
        headStyles: { fillColor: [200, 0, 0], textColor: 255, fontStyle: 'bold' },
        bodyStyles: { fontSize: 11, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: 'bold' },
          1: { cellWidth: 120 },
        },
        styles: { overflow: 'linebreak', valign: 'top' },
      });
      // @ts-ignore: autoTable attaches lastAutoTable to doc
      y = doc.lastAutoTable.finalY + 6;
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(200, 0, 0);
      doc.text('IMPORTANT:', 10, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const note1 = 'Please submit your quotation within 7 working days from the date of enquiry.';
      const note2 = 'The university reserves the right to accept or reject any quotation without assigning reasons.';
      doc.text(note1, 10, y + 6);
      doc.text(note2, 10, y + 12);
      y += 20;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('For any queries regarding this enquiry, vendors can contact:', 10, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Dr. D. Y. Patil Institute of Technology, Pimpri, Pune – 411018', 10, y + 6);
      doc.text('Phone: +91-20-27420195', 10, y + 12);
      doc.text('Email: purchase@dyp.edu.in', 10, y + 18);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setShowPDFPreviewModal(true);
    };
    if (logoImg.complete) logoImg.onload(new Event('load'));
  };

  // Confirm send after preview
  const handleConfirmSendEnquiry = () => {
    if (!selectedIndent || !pdfUrl) return;
    toast({
      title: 'Enquiry Sent',
      description: `Enquiry sent to: ${enquiryForm.vendors.join(', ') || 'No vendors selected'}`
    });
    setSentEnquiries(prev => ({
      ...prev,
      [selectedIndent.id]: { form: { ...enquiryForm }, pdfUrl }
    }));
    setShowPDFPreviewModal(false);
    setShowEnquiryModal(false);
    setSelectedIndent(null);
    setPdfUrl(null);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Assigned Indents" subtitle="Manage your assigned procurement tasks" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Assigned Indents</CardTitle>
          </CardHeader>
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
                {indents.map((indent) => (
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
                            <span className="text-green-700 font-semibold text-xs">Finalized: {finalizedVendor[indent.id]}</span>
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

      {/* Comparison Chart Modal */}
      <Dialog open={showComparisonChart} onOpenChange={setShowComparisonChart}>
        <DialogContent className="max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Vendor Comparison Chart</DialogTitle>
            <DialogDescription>Preview of the vendor comparison chart for this PO.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto text-center text-gray-500 py-8">
            <ComparisonChartReport />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComparisonChart(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Enquiry - {selectedIndent?.id}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div><Label>Enquiry ID</Label><Input value={enquiryForm.enquiryNumber} onChange={e => setEnquiryForm({ ...enquiryForm, enquiryNumber: e.target.value })} /></div>
            <div><Label>Serial</Label><Input value={enquiryForm.serial} onChange={e => setEnquiryForm({ ...enquiryForm, serial: e.target.value })} /></div>
            <div><Label>Item Name</Label><Input value={enquiryForm.name} onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={enquiryForm.description} onChange={e => setEnquiryForm({ ...enquiryForm, description: e.target.value })} /></div>
            <div><Label>Delivery</Label><Input value={enquiryForm.delivery} onChange={e => setEnquiryForm({ ...enquiryForm, delivery: e.target.value })} /></div>
            <div><Label>Payment</Label><Input value={enquiryForm.payment} onChange={e => setEnquiryForm({ ...enquiryForm, payment: e.target.value })} /></div>
            <div><Label>Warranty</Label><Input value={enquiryForm.warranty} onChange={e => setEnquiryForm({ ...enquiryForm, warranty: e.target.value })} /></div>
            <div><Label>Packing</Label><Input value={enquiryForm.packing} onChange={e => setEnquiryForm({ ...enquiryForm, packing: e.target.value })} /></div>

            <div className="col-span-2">
              <Label>Select Vendors</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {vendors.map((vendor) => (
                  <label
                    key={vendor}
                    className="flex items-center space-x-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-red-600 rounded focus:ring-red-500"
                      checked={enquiryForm.vendors.includes(vendor)}
                      onChange={(e) => {
                        const selected = enquiryForm.vendors;
                        const updated = e.target.checked
                          ? [...selected, vendor]
                          : selected.filter(v => v !== vendor);
                        setEnquiryForm({ ...enquiryForm, vendors: updated });
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">{vendor}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEnquiryModal(false)}>Cancel</Button>
            <Button onClick={handlePreviewPDF}>Preview PDF</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog open={showPDFPreviewModal} onOpenChange={v => { setShowPDFPreviewModal(v); if (!v && pdfUrl) { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); } }}>
        <DialogContent className="max-w-4xl flex flex-col items-center justify-center max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview Enquiry PDF</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh] flex items-center justify-center bg-gray-100">
            {pdfUrl && (
              <iframe src={pdfUrl} title="Enquiry PDF Preview" className="w-full h-full border rounded" />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPDFPreviewModal(false)}>Cancel</Button>
            <Button onClick={handleConfirmSendEnquiry}>Send Enquiry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Vendor Modal */}
      <Dialog open={!!showFinalizeModal} onOpenChange={v => !v && setShowFinalizeModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finalize Vendor</DialogTitle>
            <DialogDescription>Select a vendor to finalize for this indent.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {(showFinalizeModal && vendorQuotes[showFinalizeModal]) ? (
              vendorQuotes[showFinalizeModal].map(vendor => (
                <div key={vendor.name} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-semibold">{vendor.name}</div>
                    <div className="text-xs text-gray-500">Price: {vendor.price} | Delivery: {vendor.delivery}</div>
                  </div>
                  <Button size="sm" onClick={() => {
                    setFinalizedVendor(prev => ({ ...prev, [showFinalizeModal]: vendor.name }));
                    setShowFinalizeModal(null);
                    toast({ title: 'Vendor Finalized', description: `Finalized ${vendor.name} for indent ${showFinalizeModal}` });
                  }}>Select</Button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No vendor quotes available.</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFinalizeModal(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* PO Modal */}
      <Dialog open={!!showPOModal} onOpenChange={v => !v && setShowPOModal(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order</DialogTitle>
            <DialogDescription>Preview and send the Purchase Order to the finalized vendor.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <PurchaseOrderPage />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPOModal(null)}>Close</Button>
            <Button onClick={() => {
              setShowPOModal(null);
              toast({ title: 'PO Sent', description: `Purchase Order sent to ${finalizedVendor[showPOModal || '']}` });
            }}>Send PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Indent Preview Modal */}
      <Dialog open={!!showIndentPreview} onOpenChange={v => !v && setShowIndentPreview(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Indent Preview</DialogTitle>
            <DialogDescription>Preview of the Indent Report Form</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <IndentReport />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIndentPreview(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enquiry Modal */}
      <Dialog open={!!viewEnquiryIndentId} onOpenChange={v => !v && setViewEnquiryIndentId(null)}>
        <DialogContent className="max-w-4xl flex flex-col items-left justify-left max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {viewEnquiryIndentId && sentEnquiries[viewEnquiryIndentId] && (
            <>
              <div className="mb-4">
                <strong>Vendors:</strong>
                <ol className="list-decimal list-inside mt-1">
                  {sentEnquiries[viewEnquiryIndentId].form.vendors.map((vendor, idx) => (
                    <li key={vendor}>{vendor}</li>
                  ))}
                </ol>
              </div>
              <div className="w-full h-[70vh] flex items-center justify-center bg-gray-100 mb-4">
                <iframe src={sentEnquiries[viewEnquiryIndentId].pdfUrl} title="Sent Enquiry PDF" className="w-full h-full border rounded" />
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEnquiryIndentId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OfficerIndents;
