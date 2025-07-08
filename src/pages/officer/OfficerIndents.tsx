import React, { useState } from 'react';
import jsPDF from 'jspdf';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
      id: 'IND003',
      title: 'Office Furniture',
      quantity: '10 Sets',
      department: 'Administration',
      category: 'Furniture',
      status: 'quotation_received',
      assignedDate: '2024-01-12',
      deadline: '2024-01-25'
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
                        {indent.status === 'pending_inquiry' && (
                          <Button size="sm" onClick={() => handleSendEnquiry(indent)}>Send Enquiry</Button>
                        )}
                        {indent.status === 'quotation_received' && (
                          <Button size="sm" variant="outline" onClick={() => window.location.href = `/officer/quotes/${indent.id}`}>Compare Quotes</Button>
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
            <Button variant="outline" disabled>Generate PDF (Auto)</Button>
            <Button onClick={handleEnquirySubmit}>Send Enquiry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OfficerIndents;
