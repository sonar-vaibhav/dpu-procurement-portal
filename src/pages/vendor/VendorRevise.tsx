
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

const VendorRevise: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    discountedPrice: '',
    updatedDeliveryTime: '',
    notes: ''
  });

  // Mock original quotation data
  const originalQuote = {
    id: enquiryId,
    title: 'Laboratory Equipment - Microscopes',
    originalPrice: '25000',
    originalDelivery: '15 days',
    itemSpecs: 'High-quality microscopes with 1000x magnification capability, LED illumination, and digital camera attachment.',
    warranty: '2 years'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to backend
    toast({
      title: "Quotation Revised",
      description: `Your revised quotation for ${originalQuote.title} has been submitted.`,
    });
    
    navigate('/vendor/quotes');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Revise Quotation"
        subtitle={`Update your quote for: ${originalQuote.title}`}
      />
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Original Quotation */}
          <Card>
            <CardHeader>
              <CardTitle>Original Quotation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="font-medium">Quote ID</Label>
                <p className="text-sm text-gray-600">{originalQuote.id}</p>
              </div>
              <div>
                <Label className="font-medium">Original Price</Label>
                <p className="text-sm text-gray-600">₹{originalQuote.originalPrice}</p>
              </div>
              <div>
                <Label className="font-medium">Original Delivery</Label>
                <p className="text-sm text-gray-600">{originalQuote.originalDelivery}</p>
              </div>
              <div>
                <Label className="font-medium">Warranty</Label>
                <p className="text-sm text-gray-600">{originalQuote.warranty}</p>
              </div>
              <div>
                <Label className="font-medium">Specifications</Label>
                <p className="text-sm text-gray-600">{originalQuote.itemSpecs}</p>
              </div>
            </CardContent>
          </Card>

          {/* Revision Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Submit Revised Quotation</CardTitle>
              <CardDescription>Update your pricing and delivery terms</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountedPrice">Revised Price (₹) *</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      placeholder="Enter new price"
                      value={formData.discountedPrice}
                      onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Original: ₹{originalQuote.originalPrice}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="updatedDeliveryTime">Updated Delivery Time</Label>
                    <Input
                      id="updatedDeliveryTime"
                      placeholder="e.g., 12 days"
                      value={formData.updatedDeliveryTime}
                      onChange={(e) => handleInputChange('updatedDeliveryTime', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Original: {originalQuote.originalDelivery}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Revision Notes *</Label>
                  <Textarea
                    id="notes"
                    placeholder="Explain the changes made and any additional terms"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Price Comparison</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original:</span>
                      <p className="font-medium">₹{originalQuote.originalPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Revised:</span>
                      <p className="font-medium">₹{formData.discountedPrice || '0'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Difference:</span>
                      <p className={`font-medium ${
                        (parseInt(formData.discountedPrice) || 0) < parseInt(originalQuote.originalPrice) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formData.discountedPrice ? 
                          `₹${parseInt(formData.discountedPrice) - parseInt(originalQuote.originalPrice)}` 
                          : '₹0'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="dpu-button-primary">
                    Submit Revision
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/vendor/quotes')}
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

export default VendorRevise;
