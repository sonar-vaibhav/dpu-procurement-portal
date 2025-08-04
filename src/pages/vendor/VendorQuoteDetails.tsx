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
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VendorQuoteDetails: React.FC = () => {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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
      enquiryId: 'ENQ001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Lab Equipment',
      quantity: '5 units',
      department: 'Computer Science',
      description: 'High-quality microscopes for laboratory use with minimum 1000x magnification capability.',
      deliveryTerms: '15 days',
      paymentTerms: '50% advance, 50% on delivery',
      warranty: '1 Year',
      packing: 'Standard packing',
      requestedBy: 'Dr. Sarah Johnson',
      requestDate: '2024-01-10',
      requiredBy: '2024-01-25'
    },
    quotation: {
      items: [
        {
          itemName: 'Olympus CX23 Binocular Microscope',
          make: 'Olympus',
          model: 'CX23',
          specifications: '1000x magnification, LED illumination, coarse and fine focusing, mechanical stage, trinocular head',
          quantity: '2',
          unitPrice: '12500',
          totalPrice: '25000'
        }
      ],
      subtotal: 25000,
      gstPercentage: '18',
      gstAmount: 4500,
      grandTotal: 29500,
      transportationCharges: '500',
      installationCharges: '1000',
      deliveryTime: '15 working days',
      warrantyPeriod: '2 years comprehensive warranty with free servicing',
      termsAndConditions: 'Payment: 50% advance, 50% on delivery. Installation included. Training provided. Warranty covers parts and labor.',
      additionalRemarks: 'Please ensure the product is stored in dry conditions and installed by certified personnel.',
      originalPrice: 28000,
      discountedPrice: 25000,
      paymentTerms: '50% advance, 50% on delivery',
      validUntil: '2024-01-30',
      vendorRemarks: 'Please ensure the product is stored in dry conditions and installed by certified personnel.',
      officerChanges: {
        hasChanges: true,
        changesDate: '2024-01-22',
        changesBy: 'Officer John Smith',
        originalItems: [
          {
            itemName: 'Olympus CX23 Binocular Microscope',
            make: 'Olympus',
            model: 'CX23',
            specifications: '1000x magnification, LED illumination, coarse and fine focusing, mechanical stage, trinocular head',
            quantity: '2',
            unitPrice: '12500',
            totalPrice: '25000'
          }
        ],
        modifiedItems: [
          {
            itemName: 'Olympus CX23 Binocular Microscope',
            make: 'Olympus',
            model: 'CX23',
            specifications: '1000x magnification, LED illumination, coarse and fine focusing, mechanical stage, trinocular head, with digital camera attachment',
            quantity: '2',
            unitPrice: '12000',
            totalPrice: '24000'
          }
        ],
        originalSubtotal: 25000,
        modifiedSubtotal: 24000,
        originalGrandTotal: 29500,
        modifiedGrandTotal: 28320,
        changesNotes: 'Reduced unit price by ₹500 and added digital camera attachment to specifications. Updated delivery time to 10 days.'
      }
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
  const [enquiryDetailsExpanded, setEnquiryDetailsExpanded] = useState(false);

  const handleAcceptChanges = () => {
    // Here you would typically make an API call to accept the officer's changes
    console.log('Accepting officer changes for quote:', quoteDetails.id);
    
    // Display toast for officer changes accepted
    toast({
      title: 'Officer Changes Accepted',
      description: 'The officer changes have been accepted successfully.',
    });
    
    // Navigate back to quotes list
    navigate('/vendor/quotes');
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
          {/* Enquiry Details */}
          <Card className="lg:col-span-2">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEnquiryDetailsExpanded(!enquiryDetailsExpanded)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enquiry Details</CardTitle>
                  <CardDescription>Original requirements from the department</CardDescription>
                </div>
                {enquiryDetailsExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
            {enquiryDetailsExpanded && (
              <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Enquiry ID</span>
                  <p className="font-medium">{quoteDetails.indent?.enquiryId}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Title</span>
                  <p className="font-medium">{quoteDetails.indent?.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="font-medium">{quoteDetails.indent?.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Quantity</span>
                  <p className="font-medium">{quoteDetails.indent?.quantity}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Department</span>
                  <p className="font-medium">{quoteDetails.indent?.department}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Delivery Terms</span>
                  <p className="font-medium">{quoteDetails.indent?.deliveryTerms}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Payment Terms</span>
                  <p className="font-medium">{quoteDetails.indent?.paymentTerms}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Warranty</span>
                  <p className="font-medium">{quoteDetails.indent?.warranty}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Packing</span>
                  <p className="font-medium">{quoteDetails.indent?.packing}</p>
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
                <span className="text-sm text-gray-500">Description</span>
                <p className="mt-1">{quoteDetails.indent?.description}</p>
              </div>
            </CardContent>
            )}
          </Card>

          {/* Quotation Details */}
          {quoteDetails.quotation && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quotation Details</CardTitle>
                <CardDescription>Your submitted quotation information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Item Details */}
                

                {/* Officer Changes Section - Side by Side Comparison */}
                {quoteDetails.quotation?.officerChanges?.hasChanges && (
                  <>
                    <Separator />
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-medium text-yellow-800">Officer Changes - Side by Side Comparison</h4>
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                          Pending Approval
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Original Vendor Quote */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium text-gray-700">Original Quote</h5>
                            <Badge variant="outline" className="text-gray-600">Original</Badge>
                          </div>
                          
                                                     {/* Original Item Details */}
                           <div className="space-y-4">
                             <h6 className="font-medium text-sm text-gray-600">Item Details</h6>
                             {quoteDetails.quotation.officerChanges.originalItems?.map((item, index) => (
                               <div key={index} className="bg-gray-50 p-3 rounded border">
                                 <div className="grid grid-cols-1 gap-2 text-sm">
                                   <div>
                                     <span className="text-gray-500">Item Name:</span>
                                     <p className="font-medium">{item.itemName}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Make/Model:</span>
                                     <p className="font-medium">{item.make} {item.model}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Quantity:</span>
                                     <p className="font-medium">{item.quantity}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Unit Price:</span>
                                     <p className="font-medium">₹{parseFloat(item.unitPrice).toLocaleString()}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Total Price:</span>
                                     <p className="font-medium">₹{parseFloat(item.totalPrice).toLocaleString()}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Specifications:</span>
                                     <p className="text-sm mt-1">{item.specifications}</p>
                                   </div>
                                 </div>
                               </div>
                             ))}
                             
                             {/* Original Pricing Summary */}
                             <div className="bg-gray-50 p-3 rounded border">
                               <h6 className="font-medium text-sm text-gray-600 mb-2">Pricing Summary</h6>
                               <div className="space-y-1 text-sm">
                                 <div className="flex justify-between">
                                   <span>Subtotal:</span>
                                   <span>₹{quoteDetails.quotation.officerChanges.originalSubtotal?.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>GST Amount:</span>
                                   <span>₹{((quoteDetails.quotation.officerChanges.originalSubtotal || 0) * 0.18).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between font-medium">
                                   <span>Grand Total:</span>
                                   <span>₹{quoteDetails.quotation.officerChanges.originalGrandTotal?.toLocaleString()}</span>
                                 </div>
                               </div>
                             </div>

                             {/* Original Additional Charges */}
                             <div className="bg-gray-50 p-3 rounded border">
                               <h6 className="font-medium text-sm text-gray-600 mb-2">Additional Charges</h6>
                               <div className="space-y-1 text-sm">
                                 <div className="flex justify-between">
                                   <span>Transportation Charges:</span>
                                   <span>₹{parseFloat(quoteDetails.quotation?.transportationCharges || '0').toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>Installation Charges:</span>
                                   <span>₹{parseFloat(quoteDetails.quotation?.installationCharges || '0').toLocaleString()}</span>
                                 </div>
                               </div>
                             </div>

                             {/* Original Additional Details */}
                             <div className="bg-gray-50 p-3 rounded border">
                               <h6 className="font-medium text-sm text-gray-600 mb-2">Additional Details</h6>
                               <div className="space-y-2 text-sm">
                                 <div>
                                   <span className="text-gray-500">Delivery Time:</span>
                                   <p className="font-medium">{quoteDetails.quotation?.deliveryTime}</p>
                                 </div>
                                 <div>
                                   <span className="text-gray-500">Warranty Period:</span>
                                   <p className="font-medium">{quoteDetails.quotation?.warrantyPeriod}</p>
                                 </div>
                               </div>
                             </div>

                             {/* Original Terms and Conditions */}
                             <div className="bg-gray-50 p-3 rounded border">
                               <h6 className="font-medium text-sm text-gray-600 mb-2">Terms and Conditions</h6>
                               <p className="text-sm">{quoteDetails.quotation?.termsAndConditions}</p>
                             </div>

                             {/* Original Additional Remarks */}
                             <div className="bg-gray-50 p-3 rounded border">
                               <h6 className="font-medium text-sm text-gray-600 mb-2">Additional Remarks</h6>
                               <p className="text-sm">{quoteDetails.quotation?.additionalRemarks}</p>
                             </div>
                           </div>
                        </div>

                        {/* Modified Officer Quote */}
                        <div className="bg-green-50 rounded-lg border-2 border-green-200 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium text-green-700">Modified Quote by Officer </h5>
                            <Badge variant="outline" className="text-green-600 border-green-300">Modified</Badge>
                          </div>
                          
                                                     {/* Modified Item Details */}
                           <div className="space-y-4">
                             <h6 className="font-medium text-sm text-green-600">Item Details</h6>
                             {quoteDetails.quotation.officerChanges.modifiedItems?.map((item, index) => (
                               <div key={index} className="bg-white p-3 rounded border border-green-200">
                                 <div className="grid grid-cols-1 gap-2 text-sm">
                                   <div>
                                     <span className="text-gray-500">Item Name:</span>
                                     <p className="font-medium">{item.itemName}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Make/Model:</span>
                                     <p className="font-medium">{item.make} {item.model}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Quantity:</span>
                                     <p className="font-medium">{item.quantity}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Unit Price:</span>
                                     <p className="font-medium text-green-600">₹{parseFloat(item.unitPrice).toLocaleString()}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Total Price:</span>
                                     <p className="font-medium text-green-600">₹{parseFloat(item.totalPrice).toLocaleString()}</p>
                                   </div>
                                   <div>
                                     <span className="text-gray-500">Specifications:</span>
                                     <p className="text-sm mt-1">{item.specifications}</p>
                                   </div>
                                 </div>
                               </div>
                             ))}
                             
                             {/* Modified Pricing Summary */}
                             <div className="bg-white p-3 rounded border border-green-200">
                               <h6 className="font-medium text-sm text-green-600 mb-2">Pricing Summary</h6>
                               <div className="space-y-1 text-sm">
                                 <div className="flex justify-between">
                                   <span>Subtotal:</span>
                                   <span>₹{quoteDetails.quotation.officerChanges.modifiedSubtotal?.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>GST Amount:</span>
                                   <span>₹{((quoteDetails.quotation.officerChanges.modifiedSubtotal || 0) * 0.18).toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between font-medium">
                                   <span>Grand Total:</span>
                                   <span className="text-green-600">₹{quoteDetails.quotation.officerChanges.modifiedGrandTotal?.toLocaleString()}</span>
                                 </div>
                               </div>
                             </div>

                             {/* Modified Additional Charges */}
                             <div className="bg-white p-3 rounded border border-green-200">
                               <h6 className="font-medium text-sm text-green-600 mb-2">Additional Charges</h6>
                               <div className="space-y-1 text-sm">
                                 <div className="flex justify-between">
                                   <span>Transportation Charges:</span>
                                   <span>₹{parseFloat(quoteDetails.quotation?.transportationCharges || '0').toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between">
                                   <span>Installation Charges:</span>
                                   <span>₹{parseFloat(quoteDetails.quotation?.installationCharges || '0').toLocaleString()}</span>
                                 </div>
                               </div>
                             </div>

                             {/* Modified Additional Details */}
                             <div className="bg-white p-3 rounded border border-green-200">
                               <h6 className="font-medium text-sm text-green-600 mb-2">Additional Details</h6>
                               <div className="space-y-2 text-sm">
                                 <div>
                                   <span className="text-gray-500">Delivery Time:</span>
                                   <p className="font-medium">{quoteDetails.quotation?.deliveryTime}</p>
                                 </div>
                                 <div>
                                   <span className="text-gray-500">Warranty Period:</span>
                                   <p className="font-medium">{quoteDetails.quotation?.warrantyPeriod}</p>
                                 </div>
                               </div>
                             </div>

                             {/* Modified Terms and Conditions */}
                             <div className="bg-white p-3 rounded border border-green-200">
                               <h6 className="font-medium text-sm text-green-600 mb-2">Terms and Conditions</h6>
                               <p className="text-sm">{quoteDetails.quotation?.termsAndConditions}</p>
                             </div>

                             {/* Modified Additional Remarks */}
                             <div className="bg-white p-3 rounded border border-green-200">
                               <h6 className="font-medium text-sm text-green-600 mb-2">Additional Remarks</h6>
                               <p className="text-sm">{quoteDetails.quotation?.additionalRemarks}</p>
                             </div>
                           </div>
                        </div>
                      </div>

                      {/* Changes Summary */}
                      <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
                        <h6 className="font-medium text-blue-700 mb-3">Changes Summary</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Changes Date:</span>
                            <p className="font-medium">{quoteDetails.quotation.officerChanges.changesDate}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Changed By:</span>
                            <p className="font-medium">{quoteDetails.quotation.officerChanges.changesBy}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Status:</span>
                            <p className="font-medium text-yellow-600">Awaiting Vendor Approval</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Changes Notes:</span>
                          <p className="mt-1 text-sm">{quoteDetails.quotation.officerChanges.changesNotes}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                
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
          {quoteDetails.status === 'pending' && quoteDetails.quotation?.officerChanges && (
            <Button onClick={() => handleAcceptChanges()}>
              Accept Changes
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorQuoteDetails;
