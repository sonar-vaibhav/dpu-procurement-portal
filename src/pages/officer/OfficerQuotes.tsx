
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const indentDetails = {
    id: indentId,
    title: 'Laboratory Equipment - Microscopes',
    department: 'Biology',
    quantity: '2 Units',
    specifications: 'High-resolution microscope for cell research with 1000x magnification',
    requestedBy: 'Dr. Sarah Johnson',
    requestDate: '2024-01-10',
    requiredBy: '2024-01-25'
  };

  const quotes: VendorQuote[] = [
    {
      vendorId: 'V001',
      vendorName: 'Lab Equipment Pro',
      contactPerson: 'John Smith',
      email: 'john@labequipmentpro.com',
      phone: '+91-9876543210',
      specifications: 'Olympus CX23 Binocular Microscope - 1000x magnification, LED illumination, coarse and fine focusing, mechanical stage',
      originalPrice: 28000,
      discountedPrice: 25000,
      deliveryTime: '15 working days',
      warranty: '2 years comprehensive warranty with free servicing',
      termsAndConditions: 'Payment: 50% advance, 50% on delivery. Installation included. Training provided.',
      paymentTerms: '50% advance, balance on delivery',
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
      specifications: 'Nikon Eclipse E100 Binocular Microscope - 1000x magnification, Halogen lamp, fine focusing, fixed stage',
      originalPrice: 30000,
      discountedPrice: 27000,
      deliveryTime: '20 working days',
      warranty: '1 year warranty + 6 months extended service',
      termsAndConditions: 'Payment: 30% advance, 70% on delivery. Installation charges extra ₹2000.',
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
      specifications: 'Leica DM300 Binocular Microscope - 1000x magnification, LED illumination, ergonomic design, premium optics',
      originalPrice: 26000,
      discountedPrice: 24000,
      deliveryTime: '12 working days',
      warranty: '18 months warranty with on-site support',
      termsAndConditions: 'Payment: 40% advance, 60% on delivery. Free installation and 2 days training.',
      paymentTerms: '40% advance, 60% on delivery',
      rating: 4.3,
      submittedDate: '2024-01-15',
      validUntil: '2024-01-28'
    }
  ];

  const handleFinalizeVendor = (vendorId: string, vendorName: string) => {
    setSelectedVendor(vendorId);
    toast({
      title: "Vendor Finalized",
      description: `${vendorName} has been selected for indent ${indentId}. Purchase order will be generated.`,
    });
  };

  const getBestPrice = () => {
    return Math.min(...quotes.map(q => q.discountedPrice));
  };

  const getBestDelivery = () => {
    const deliveryDays = quotes.map(q => parseInt(q.deliveryTime));
    return Math.min(...deliveryDays);
  };

  const getMaxDiscount = () => {
    const discounts = quotes.map(q => ((q.originalPrice - q.discountedPrice) / q.originalPrice) * 100);
    return Math.max(...discounts);
  };

  const toggleRowExpansion = (vendorId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(vendorId)) {
      newExpanded.delete(vendorId);
    } else {
      newExpanded.add(vendorId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={`Vendor Quotation Comparison - ${indentDetails.title}`}
        subtitle={`Compare and select the best vendor for ${indentDetails.department} department`}
      />
      
      <div className="p-6 space-y-6">
        {/* Indent Details */}
        <Card>
          <CardHeader>
            <CardTitle>Indent Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <span className="font-medium text-muted-foreground">Indent ID:</span>
                <p className="text-sm">{indentDetails.id}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Department:</span>
                <p className="text-sm">{indentDetails.department}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Quantity:</span>
                <p className="text-sm">{indentDetails.quantity}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Requested By:</span>
                <p className="text-sm">{indentDetails.requestedBy}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Request Date:</span>
                <p className="text-sm">{indentDetails.requestDate}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Required By:</span>
                <p className="text-sm">{indentDetails.requiredBy}</p>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-muted-foreground">Specifications:</span>
                <p className="text-sm">{indentDetails.specifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-600">Best Price</h3>
                <p className="text-2xl font-bold">₹{getBestPrice().toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-600">Fastest Delivery</h3>
                <p className="text-2xl font-bold">{getBestDelivery()} days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-600">Max Discount</h3>
                <p className="text-2xl font-bold">{getMaxDiscount().toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Quotations Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Quotations Comparison</CardTitle>
            <CardDescription>
              Compare all vendor quotations and select the best option ({quotes.length} quotations received)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor Details</TableHead>
                    <TableHead>Original Price</TableHead>
                    <TableHead>Discounted Price</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <React.Fragment key={quote.vendorId}>
                      <TableRow 
                        className={`${selectedVendor === quote.vendorId ? 'bg-green-50 border-green-200' : ''} cursor-pointer hover:bg-muted/50`}
                        onClick={() => toggleRowExpansion(quote.vendorId)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{quote.vendorName}</p>
                            <p className="text-sm text-muted-foreground">{quote.contactPerson}</p>
                            <p className="text-xs text-muted-foreground">{quote.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="line-through text-muted-foreground">
                            ₹{quote.originalPrice.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${quote.discountedPrice === getBestPrice() ? 'text-green-600' : ''}`}>
                              ₹{quote.discountedPrice.toLocaleString()}
                            </span>
                            {quote.discountedPrice === getBestPrice() && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Best Price</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-orange-600">
                            {(((quote.originalPrice - quote.discountedPrice) / quote.originalPrice) * 100).toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={parseInt(quote.deliveryTime) === getBestDelivery() ? 'text-blue-600 font-medium' : ''}>
                              {quote.deliveryTime}
                            </span>
                            {parseInt(quote.deliveryTime) === getBestDelivery() && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">Fastest</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{quote.warranty}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium">{quote.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(quote.vendorId);
                              }}
                            >
                              {expandedRows.has(quote.vendorId) ? 'Hide' : 'View'} Details
                            </Button>
                            <Button
                              size="sm"
                              disabled={selectedVendor !== null}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFinalizeVendor(quote.vendorId, quote.vendorName);
                              }}
                              className={selectedVendor === quote.vendorId ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              {selectedVendor === quote.vendorId ? 'Selected' : 'Select'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Row Details */}
                      {expandedRows.has(quote.vendorId) && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={8}>
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2 text-primary">Contact Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Phone:</span> {quote.phone}</p>
                                    <p><span className="font-medium">Submitted:</span> {quote.submittedDate}</p>
                                    <p><span className="font-medium">Valid Until:</span> {quote.validUntil}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2 text-primary">Payment Terms</h4>
                                  <p className="text-sm">{quote.paymentTerms}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2 text-primary">Detailed Specifications</h4>
                                <p className="text-sm text-muted-foreground">{quote.specifications}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2 text-primary">Terms and Conditions</h4>
                                <p className="text-sm text-muted-foreground">{quote.termsAndConditions}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Selection Confirmation */}
        {selectedVendor && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-green-600 text-xl">✅</span>
                  <div>
                    <p className="font-medium text-green-800">
                      Vendor Selected Successfully!
                    </p>
                    <p className="text-sm text-green-700">
                      Purchase order will be generated and sent to {quotes.find(q => q.vendorId === selectedVendor)?.vendorName}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedVendor(null)}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Change Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OfficerQuotes;
