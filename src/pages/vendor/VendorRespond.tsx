import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const VendorRespond: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    itemSpecs: '',
    initialPrice: '',
    deliveryTime: '',
    warranty: '',
    remarks: ''
  });


  const [gstRate] = useState(18); // default GST 18%
  const [calculatedTotal, setCalculatedTotal] = useState('0');

  // Mock enquiry data (unchanged)
  const enquiry = {
    id: enquiryId,
    title: 'Laboratory Equipment - Microscopes',
    category: 'Lab Equipment',
    quantity: '5 units',
    department: 'Computer Science',
    description: 'High-quality microscopes for laboratory use with minimum 1000x magnification capability.'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // shows total price incl. GST
    toast({
      title: "Quotation Submitted",
      description: `Your quotation for ${enquiry.title} has been submitted successfully. Total (incl. GST): ₹${calculatedTotal}`,
    });

    navigate('/vendor/quotes');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Auto-calculate total when price changes
    if (field === 'initialPrice') {
      const price = parseFloat(value) || 0;
      const total = price + (price * gstRate) / 100;
      setCalculatedTotal(total.toFixed(2));
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Submit Quotation"
        subtitle={`Respond to enquiry: ${enquiry.title}`}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enquiry Details */}
          <Card>
            <CardHeader>
              <CardTitle>Enquiry Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="font-medium">Enquiry ID</Label>
                <p className="text-sm text-gray-600">{enquiry.id}</p>
              </div>
              <div>
                <Label className="font-medium">Title</Label>
                <p className="text-sm text-gray-600">{enquiry.title}</p>
              </div>
              <div>
                <Label className="font-medium">Category</Label>
                <p className="text-sm text-gray-600">{enquiry.category}</p>
              </div>
              <div>
                <Label className="font-medium">Quantity</Label>
                <p className="text-sm text-gray-600">{enquiry.quantity}</p>
              </div>
              <div>
                <Label className="font-medium">Department</Label>
                <p className="text-sm text-gray-600">{enquiry.department}</p>
              </div>
              <div>
                <Label className="font-medium">Description</Label>
                <p className="text-sm text-gray-600">{enquiry.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Submit Your Quotation</CardTitle>
              <CardDescription>Provide detailed specifications and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="itemSpecs">Item Specifications *</Label>
                  <Textarea
                    id="itemSpecs"
                    placeholder="Detailed specifications of the items you're quoting"
                    value={formData.itemSpecs}
                    onChange={(e) => handleInputChange('itemSpecs', e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="initialPrice">Initial Price (₹) *</Label>
                    <Input
                      id="initialPrice"
                      type="number"
                      placeholder="Enter total price"
                      value={formData.initialPrice}
                      onChange={(e) => handleInputChange('initialPrice', e.target.value)}
                      required
                      min="1" // Prevent negative/zero values
                    />
                    {/* Added GST & Total price preview */}
                    <p className="text-xs text-gray-500 mt-1">
                      GST ({gstRate}%): ₹{((parseFloat(formData.initialPrice) || 0) * gstRate / 100).toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Total with GST: ₹{calculatedTotal}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="deliveryTime">Delivery Time *</Label>
                    <Input
                      id="deliveryTime"
                      placeholder="e.g., 15 days"
                      value={formData.deliveryTime}
                      onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                      required
                      pattern="^\d+\s?(days|day|weeks|week)$"
                      title="Use format like '15 days' or '2 weeks'"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="warranty">Warranty Period</Label>
                  <Input
                    id="warranty"
                    placeholder="e.g., 2 years"
                    value={formData.warranty}
                    onChange={(e) => handleInputChange('warranty', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="remarks">Additional Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Any additional information or terms"
                    value={formData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="dpu-button-primary">
                    Submit Quotation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/vendor/enquiries')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorRespond;
