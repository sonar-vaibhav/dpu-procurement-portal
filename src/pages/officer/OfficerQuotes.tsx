
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
  initialPrice: number;
  discountedPrice: number;
  deliveryTime: string;
  specifications: string;
  warranty: string;
  rating: number;
}

const OfficerQuotes: React.FC = () => {
  const { indentId } = useParams<{ indentId: string }>();
  const { toast } = useToast();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const indentDetails = {
    id: indentId,
    title: 'Laboratory Equipment - Microscopes',
    department: 'Biology',
    quantity: '2 Units',
    specifications: 'High-resolution microscope for cell research'
  };

  const quotes: VendorQuote[] = [
    {
      vendorId: 'V001',
      vendorName: 'Lab Equipment Pro',
      initialPrice: 28000,
      discountedPrice: 25000,
      deliveryTime: '15 days',
      specifications: 'Olympus CX23, 1000x magnification, LED illumination',
      warranty: '2 years',
      rating: 4.8
    },
    {
      vendorId: 'V002',
      vendorName: 'Scientific Instruments Ltd',
      initialPrice: 30000,
      discountedPrice: 27000,
      deliveryTime: '20 days',
      specifications: 'Nikon Eclipse E100, 1000x magnification, Halogen lamp',
      warranty: '1 year',
      rating: 4.5
    },
    {
      vendorId: 'V003',
      vendorName: 'BioTech Solutions',
      initialPrice: 26000,
      discountedPrice: 24000,
      deliveryTime: '12 days',
      specifications: 'Leica DM300, 1000x magnification, LED illumination',
      warranty: '18 months',
      rating: 4.3
    }
  ];

  const handleFinalizeVendor = (vendorId: string, vendorName: string) => {
    setSelectedVendor(vendorId);
    toast({
      title: "Vendor Finalized",
      description: `${vendorName} has been selected for indent ${indentId}. Confirmation PDF will be generated.`,
    });
    // In a real app, this would generate a PDF and update the system
  };

  const getBestPrice = () => {
    return Math.min(...quotes.map(q => q.discountedPrice));
  };

  const getBestDelivery = () => {
    const deliveryDays = quotes.map(q => parseInt(q.deliveryTime));
    return Math.min(...deliveryDays);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={`Quotation Comparison - ${indentDetails.title}`}
        subtitle={`Compare vendor quotes for ${indentDetails.department} department`}
      />
      
      <div className="p-6 space-y-6">
        {/* Indent Details */}
        <Card>
          <CardHeader>
            <CardTitle>Indent Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-medium">Indent ID:</span> {indentDetails.id}
              </div>
              <div>
                <span className="font-medium">Department:</span> {indentDetails.department}
              </div>
              <div>
                <span className="font-medium">Quantity:</span> {indentDetails.quantity}
              </div>
              <div>
                <span className="font-medium">Specifications:</span> {indentDetails.specifications}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotation Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Quotations</CardTitle>
            <CardDescription>
              Compare quotes and select the best vendor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Initial Price</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.vendorId} className={selectedVendor === quote.vendorId ? 'bg-green-50' : ''}>
                    <TableCell className="font-medium">{quote.vendorName}</TableCell>
                    <TableCell>
                      <span className="line-through text-gray-500">₹{quote.initialPrice.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${quote.discountedPrice === getBestPrice() ? 'text-green-600' : ''}`}>
                        ₹{quote.discountedPrice.toLocaleString()}
                        {quote.discountedPrice === getBestPrice() && (
                          <Badge className="ml-2 bg-green-100 text-green-800">Best Price</Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={parseInt(quote.deliveryTime) === getBestDelivery() ? 'text-green-600 font-medium' : ''}>
                        {quote.deliveryTime}
                        {parseInt(quote.deliveryTime) === getBestDelivery() && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">Fastest</Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={quote.specifications}>
                      {quote.specifications}
                    </TableCell>
                    <TableCell>{quote.warranty}</TableCell>
                    <TableCell>
                      <span className="text-yellow-600">⭐ {quote.rating}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={selectedVendor !== null}
                        onClick={() => handleFinalizeVendor(quote.vendorId, quote.vendorName)}
                        className={selectedVendor === quote.vendorId ? 'bg-green-600' : ''}
                      >
                        {selectedVendor === quote.vendorId ? 'Selected' : 'Finalize'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedVendor && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-lg">✅</span>
                <span className="font-medium text-green-800">
                  Vendor has been finalized. Confirmation PDF will be generated and sent to all stakeholders.
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OfficerQuotes;
