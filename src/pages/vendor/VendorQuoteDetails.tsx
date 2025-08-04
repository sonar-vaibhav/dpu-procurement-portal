import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea'; // �� For remarks input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VendorQuoteDetails: React.FC = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get quote from location.state if available
  const passedQuote = location.state?.quote;

  // Fallback dummy data if not passed
  const dummyQuote = {
    id: quoteId,
    enquiryId: 'ENQ001',
    title: 'Laboratory Equipment - Microscopes',
    status: 'rejected',
    submittedDate: '2024-01-15',
    lastUpdated: '2024-01-20',
    indent: {
      department: 'Biology',
      quantity: '2 Units',
      specifications: 'High-resolution microscope for cell research with 1000x magnification',
      requestedBy: 'Dr. Sarah Johnson',
      requestDate: '2024-01-10',
      requiredBy: '2024-01-25'
    },
    quotation: {
      originalPrice: 28000,
      discountedPrice: 25000,
      deliveryTime: '15 working days',
      warranty: '2 years comprehensive warranty with free servicing',
      termsAndConditions: 'Payment: 50% advance, 50% on delivery. Installation included. Training provided.',
      paymentTerms: '50% advance, 50% on delivery',
      specifications: 'Olympus CX23 Binocular Microscope - 1000x magnification, LED illumination, coarse and fine focusing, mechanical stage',
      validUntil: '2024-01-30',
      vendorRemarks: 'Please ensure the product is stored in dry conditions and installed by certified personnel.'
    },
    statusInfo: {
      rejectionReason: 'Competitor offered better terms and faster delivery time',
      acceptanceNotes: 'Congratulations! Your quote has been accepted.',
      revisionHistory: [
        {
          date: '2024-01-15',
          type: 'initial',
          price: 28000,
          deliveryTime: '15 working days'
        },
        {
          date: '2024-01-18',
          type: 'revised',
          price: 25000,
          deliveryTime: '12 working days'
        }
      ]
    }
  };
  // Merge passedQuote with dummyQuote for missing fields
  const quoteDetails = { ...dummyQuote, ...passedQuote, indent: { ...dummyQuote.indent, ...(passedQuote?.indent || {}) }, quotation: { ...dummyQuote.quotation, ...(passedQuote?.quotation || {}) }, statusInfo: { ...dummyQuote.statusInfo, ...(passedQuote?.statusInfo || {}) } };

  // If quoteDetails is missing required fields, show fallback UI
  if (!quoteDetails || !quoteDetails.id || !quoteDetails.title) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No quote details found.</h2>
          <Button variant="outline" onClick={() => navigate('/vendor/quotes')}>Back to Quotes</Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Optional: Local state to allow editing (simulated)
  const [remarks, setRemarks] = useState(quoteDetails.quotation?.vendorRemarks || '');

  return (
    <DashboardLayout>
      <PageHeader
        title="Quotation Details"
        subtitle={`View complete details for quotation ${quoteDetails.id}`}
      />

      <div className="p-6 space-y-6">
        {/* Status Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{quoteDetails.title}</h2>
                <p className="text-sm text-gray-500">Enquiry ID: {quoteDetails.enquiryId}</p>
              </div>
              <Badge className={getStatusColor(quoteDetails.status)}>
                {quoteDetails.status.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Submitted:</span>
                <p className="font-medium">{quoteDetails.submittedDate}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated:</span>
                <p className="font-medium">{quoteDetails.lastUpdated}</p>
              </div>
              <div>
                <span className="text-gray-500">Valid Until:</span>
                <p className="font-medium">{quoteDetails.quotation?.validUntil || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Delivery Time:</span>
                <p className="font-medium">{quoteDetails.quotation?.deliveryTime || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Indent Details */}
          <Card>
            <CardHeader>
              <CardTitle>Indent Details</CardTitle>
              <CardDescription>Original requirements from the department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Department</span>
                  <p className="font-medium">{quoteDetails.indent?.department}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Quantity</span>
                  <p className="font-medium">{quoteDetails.indent?.quantity}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Requested By</span>
                  <p className="font-medium">{quoteDetails.indent?.requestedBy}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Required By</span>
                  <p className="font-medium">{quoteDetails.indent?.requiredBy}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Specifications</span>
                <p className="mt-1">{quoteDetails.indent?.specifications}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Details */}
          {quoteDetails.quotation && (
            <Card>
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
                <CardDescription>Your submitted quotation information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Original Price</span>
                    <p className="font-medium line-through text-gray-500">₹{quoteDetails.quotation?.originalPrice?.toLocaleString?.()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Discounted Price</span>
                    <p className="font-medium text-green-600">₹{quoteDetails.quotation?.discountedPrice?.toLocaleString?.()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Warranty</span>
                    <p className="font-medium">{quoteDetails.quotation?.warranty}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Payment Terms</span>
                    <p className="font-medium">{quoteDetails.quotation?.paymentTerms}</p>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Terms & Conditions</span>
                  <p className="mt-1">{quoteDetails.quotation?.termsAndConditions}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Your Specifications</span>
                  <p className="mt-1">{quoteDetails.quotation?.specifications}</p>
                </div>
                {/* ✅ Vendor Remarks Section */}
                <div>
                  <span className="text-sm text-gray-500">Vendor Remarks</span>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any notes about product handling, delivery, etc."
                    className="mt-1"
                    disabled // remove this if you want to allow editing
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Info */}
          {quoteDetails.status === 'rejected' && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Status Information</CardTitle>
                <CardDescription>Details about the quotation status and history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                  <p className="text-red-700">{quoteDetails.statusInfo?.rejectionReason}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Revision History</h4>
                  <div className="space-y-4">
                    {quoteDetails.statusInfo?.revisionHistory.map((revision, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-24 flex-shrink-0">
                          <p className="text-sm text-gray-500">{revision.date}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {revision.type === 'initial' ? 'Initial Quote' : 'Revised Quote'}
                            </Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium">₹{revision.price.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Delivery:</span>
                              <p className="font-medium">{revision.deliveryTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate('/vendor/quotes')}>
            Back to Quotes
          </Button>
          {quoteDetails.status === 'pending' && (
            <Button onClick={() => navigate(`/vendor/revise/${quoteDetails.enquiryId}`)}>
              Revise Quote
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorQuoteDetails;
