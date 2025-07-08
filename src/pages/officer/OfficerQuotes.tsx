import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generatePurchaseOrderPDF } from '@/utils/pdfGenerator';

interface VendorQuote {
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specifications: string;
  originalPrice: number;
  discountedPrice: number;
  deliveryTime: string;
  warranty: string;
  termsAndConditions: string;
  paymentTerms: string;
  rating: number;
  submittedDate: string;
  validUntil: string;
}

const OfficerQuotes: React.FC = () => {
  const { indentId } = useParams<{ indentId: string }>();
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [activeDetails, setActiveDetails] = useState<string | null>(null);

  const indentDetails = {
    id: indentId,
    title: 'Laboratory Equipment - Microscopes',
    department: 'Biology',
    quantity: '2 Units',
    specifications: 'High-resolution microscope for cell research with 1000x magnification',
    requestedBy: 'Dr. Sarah Johnson',
    requestDate: '2024-01-10',
    requiredBy: '2024-01-25',
  };

  const quotes: VendorQuote[] = [
    {
      vendorId: 'V001',
      vendorName: 'Lab Equipment Pro',
      contactPerson: 'John Smith',
      email: 'john@labequipmentpro.com',
      phone: '+91-9876543210',
      specifications: 'Olympus CX23 Binocular Microscope',
      originalPrice: 28000,
      discountedPrice: 25000,
      deliveryTime: '15',
      warranty: '2 years warranty',
      termsAndConditions: '50% advance, 50% on delivery. Installation included.',
      paymentTerms: '50% advance, 50% on delivery',
      rating: 4.8,
      submittedDate: '2024-01-16',
      validUntil: '2024-01-30'
    },
    {
      vendorId: 'V002',
      vendorName: 'Scientific Instruments Ltd',
      contactPerson: 'Dr. Priya Sharma',
      email: 'priya@sciinstruments.com',
      phone: '+91-9876543211',
      specifications: 'Nikon Eclipse E100 Binocular Microscope',
      originalPrice: 30000,
      discountedPrice: 27000,
      deliveryTime: '20',
      warranty: '1.5 years warranty',
      termsAndConditions: '30% advance, 70% on delivery.',
      paymentTerms: '30% advance, 70% on delivery',
      rating: 4.5,
      submittedDate: '2024-01-17',
      validUntil: '2024-02-01'
    },
    {
      vendorId: 'V003',
      vendorName: 'BioTech Solutions',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@biotechsol.com',
      phone: '+91-9876543212',
      specifications: 'Leica DM300 Binocular Microscope',
      originalPrice: 26000,
      discountedPrice: 24000,
      deliveryTime: '12',
      warranty: '18 months warranty',
      termsAndConditions: '40% advance, 60% on delivery.',
      paymentTerms: '40% advance, 60% on delivery',
      rating: 4.3,
      submittedDate: '2024-01-15',
      validUntil: '2024-01-28'
    }
  ];

  const handleFinalizeVendor = (vendorId: string, vendorName: string) => {
    const selectedQuote = quotes.find(q => q.vendorId === vendorId);
    if (selectedQuote) {
      setSelectedVendor(vendorId);
      try {
        generatePurchaseOrderPDF(indentDetails, selectedQuote);
        toast({
          title: 'Vendor Finalized & Purchase Order Generated',
          description: `${vendorName} has been selected. Purchase order PDF downloaded.`,
        });
      } catch {
        toast({
          title: 'Vendor Selected',
          description: `${vendorName} selected, but PDF generation failed.`,
          variant: 'destructive',
        });
      }
    }
  };

  const getBestPrice = () => Math.min(...quotes.map(q => q.discountedPrice));
  const getBestDelivery = () => Math.min(...quotes.map(q => parseInt(q.deliveryTime)));

  return (
    <DashboardLayout>
      <PageHeader
        title={`Vendor Quotation Comparison - ${indentDetails.title}`}
        subtitle={`Compare and select the best vendor for ${indentDetails.department} department`}
      />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader><CardTitle>Indent Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(indentDetails).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <p className="text-sm">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Vendor Quotations (Vertical View)</CardTitle>
            <CardDescription>Scroll horizontally if more than 3 vendors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[600px]">
              <div
                className={`overflow-x-auto ${quotes.length > 3 ? 'scrollbar-thin' : ''}`}
                style={{ minWidth: `${quotes.length * 280 + 180}px` }}
              >
                <Table className="table-fixed border-spacing-x-6 w-full">
                  <TableBody>
                    <TableRow className="sticky top-0 bg-background z-10 shadow">
                      <TableHead className="sticky left-0 z-20 bg-background">Field</TableHead>
                      {quotes.map(q => (
                        <TableHead key={q.vendorId} className="bg-white shadow-md">{q.vendorName}</TableHead>
                      ))}
                    </TableRow>

                    {([
                      ['Contact Person', (q: VendorQuote) => q.contactPerson],
                      ['Email', q => q.email],
                      ['Phone', q => q.phone],
                      ['Original Price', q => <span className="line-through text-muted-foreground">₹{q.originalPrice.toLocaleString()}</span>],
                      ['Discounted Price', q => (
                        <span className={q.discountedPrice === getBestPrice() ? 'text-green-600 font-semibold' : ''}>
                          ₹{q.discountedPrice.toLocaleString()}
                          {q.discountedPrice === getBestPrice() && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Best</Badge>
                          )}
                        </span>
                      )],
                      ['Delivery Time', q => (
                        <span>
                          {q.deliveryTime} days
                          {parseInt(q.deliveryTime) === getBestDelivery() && (
                            <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Fastest</Badge>
                          )}
                        </span>
                      )],
                      ['Warranty', q => q.warranty],
                      ['Rating', q => `⭐ ${q.rating}`],
                      ['Specifications', q => <span className="text-sm text-muted-foreground">{q.specifications}</span>],
                      ['Payment Terms', q => q.paymentTerms],
                      ['Terms & Conditions', q => <span className="text-sm text-muted-foreground">{q.termsAndConditions}</span>],
                      ['Submitted Date', q => q.submittedDate],
                      ['Valid Until', q => q.validUntil],
                      ['Actions', q => (
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            disabled={selectedVendor !== null}
                            onClick={() => handleFinalizeVendor(q.vendorId, q.vendorName)}
                            className={selectedVendor === q.vendorId ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                          >
                            {selectedVendor === q.vendorId ? 'Selected' : 'Select'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveDetails(prev => prev === q.vendorId ? null : q.vendorId)}
                          >
                            {activeDetails === q.vendorId ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      )]
                    ] as [string, (q: VendorQuote) => React.ReactNode][]).map(([label, renderer]) => (
                      <TableRow key={label}>
                        <TableCell className="sticky left-0 z-10 bg-background font-medium text-sm">{label}</TableCell>
                        {quotes.map(q => (
                          <TableCell key={q.vendorId} className="bg-white shadow-sm">{renderer(q)}</TableCell>
                        ))}
                      </TableRow>
                    ))}

                    {activeDetails && (
                      <TableRow key="vendor-detail-row">
                        <TableCell colSpan={quotes.length + 1} className="bg-muted/40">
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium mb-1">Contact Info</h4>
                              <p><strong>Phone:</strong> {quotes.find(q => q.vendorId === activeDetails)?.phone}</p>
                              <p><strong>Email:</strong> {quotes.find(q => q.vendorId === activeDetails)?.email}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-1">Other Info</h4>
                              <p><strong>Submitted:</strong> {quotes.find(q => q.vendorId === activeDetails)?.submittedDate}</p>
                              <p><strong>Valid Until:</strong> {quotes.find(q => q.vendorId === activeDetails)?.validUntil}</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OfficerQuotes;
