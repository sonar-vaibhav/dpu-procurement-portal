import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type QuotationItem = {
  itemName: string;
  make: string;
  model: string;
  specifications: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  gstPercentage: string;
};

const VendorRespond: React.FC = () => {
  const { enquiryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    { itemName: '', make: '', model: '', specifications: '', quantity: '', unitPrice: '', totalPrice: '0', gstPercentage: '18' }
  ]);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [transportationCharges, setTransportationCharges] = useState('');
  const [installationCharges, setInstallationCharges] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  // Mock enquiry data (same as officer enquiry page)
  const enquiry = {
    id: enquiryId,
    title: 'Laboratory Equipment - Microscopes',
    category: 'Lab Equipment',
    quantity: '5 units',
    department: 'Computer Science',
    description: 'High-quality microscopes for laboratory use with minimum 1000x magnification capability.',
    delivery: '15 days',
    payment: '50% advance, 50% on delivery',
    warranty: '1 Year',
    packing: 'Standard packing'
  };

  // Calculate totals
  const calculateItemTotal = (quantity: string, unitPrice: string) => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return (qty * price).toFixed(2);
  };

  const calculateSubtotal = () => {
    return quotationItems.reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice) || 0);
    }, 0);
  };

  const calculateGSTAmount = () => {
    return quotationItems.reduce((sum, item) => {
      const gstRate = parseFloat(item.gstPercentage) || 0;
      const itemTotal = parseFloat(item.totalPrice) || 0;
      return sum + (itemTotal * gstRate / 100);
    }, 0).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const gstAmount = parseFloat(calculateGSTAmount());
    const transport = parseFloat(transportationCharges) || 0;
    const installation = parseFloat(installationCharges) || 0;
    return (subtotal + gstAmount + transport + installation).toFixed(2);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: string) => {
    const updatedItems = [...quotationItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-calculate total price for this item
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = calculateItemTotal(
        updatedItems[index].quantity,
        updatedItems[index].unitPrice
      );
    }

    setQuotationItems(updatedItems);
  };

  const addItem = () => {
    setQuotationItems([
      { itemName: '', make: '', model: '', specifications: '', quantity: '', unitPrice: '', totalPrice: '0', gstPercentage: '18' },
      ...quotationItems
    ]);
  };

  const removeItem = (index: number) => {
    if (quotationItems.length > 1) {
      setQuotationItems(quotationItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const grandTotal = calculateGrandTotal();
    
    toast({
      title: "Quotation Submitted",
      description: `Your quotation for ${enquiry.title} has been submitted successfully. Total (incl. GST): ₹${grandTotal}`,
    });

    navigate('/vendor/quotes');
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label className="font-medium text-sm">Enquiry ID</Label>
                  <p className="text-sm text-gray-600">{enquiry.id}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Title</Label>
                  <p className="text-sm text-gray-600">{enquiry.title}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Category</Label>
                  <p className="text-sm text-gray-600">{enquiry.category}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Quantity</Label>
                  <p className="text-sm text-gray-600">{enquiry.quantity}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Department</Label>
                  <p className="text-sm text-gray-600">{enquiry.department}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Description</Label>
                  <p className="text-sm text-gray-600">{enquiry.description}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Delivery Terms</Label>
                  <p className="text-sm text-gray-600">{enquiry.delivery}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Payment Terms</Label>
                  <p className="text-sm text-gray-600">{enquiry.payment}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Warranty</Label>
                  <p className="text-sm text-gray-600">{enquiry.warranty}</p>
                </div>
                <div>
                  <Label className="font-medium text-sm">Packing</Label>
                  <p className="text-sm text-gray-600">{enquiry.packing}</p>
                </div>
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
                {/* Item Details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">Item Details</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                      + Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {quotationItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Item {index + 1}</h4>
                          {quotationItems.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`itemName-${index}`}>Item Name *</Label>
                            <Input
                              id={`itemName-${index}`}
                              value={item.itemName}
                              onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                              placeholder="Enter item name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`make-${index}`}>Make *</Label>
                            <Input
                              id={`make-${index}`}
                              value={item.make}
                              onChange={(e) => handleItemChange(index, 'make', e.target.value)}
                              placeholder="Enter make"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`model-${index}`}>Model *</Label>
                            <Input
                              id={`model-${index}`}
                              value={item.model}
                              onChange={(e) => handleItemChange(index, 'model', e.target.value)}
                              placeholder="Enter model"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                            <Input
                              id={`quantity-${index}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              placeholder="Qty"
                              required
                              min="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`unitPrice-${index}`}>Unit Price (₹) *</Label>
                            <Input
                              id={`unitPrice-${index}`}
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                              placeholder="Price per unit"
                              required
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`gstPercentage-${index}`}>GST (%)</Label>
                            <Input
                              id={`gstPercentage-${index}`}
                              type="number"
                              min="0"
                              max="100"
                              value={item.gstPercentage}
                              onChange={e => handleItemChange(index, 'gstPercentage', e.target.value)}
                              placeholder="GST %"
                              required
                            />
                          </div>
                          <div>
                            <Label>Total Price (₹)</Label>
                            <div className="p-2 bg-gray-50 border rounded text-sm">
                              ₹{item.totalPrice}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor={`specifications-${index}`}>Specifications *</Label>
                          <Textarea
                            id={`specifications-${index}`}
                            value={item.specifications}
                            onChange={(e) => handleItemChange(index, 'specifications', e.target.value)}
                            placeholder="Enter detailed specifications"
                            required
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                

                {/* Additional Charges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transportationCharges">Transportation Charges (₹)</Label>
                    <Input
                      id="transportationCharges"
                      type="number"
                      placeholder="Enter transportation charges"
                      value={transportationCharges}
                      onChange={(e) => setTransportationCharges(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="installationCharges">Installation Charges (₹)</Label>
                    <Input
                      id="installationCharges"
                      type="number"
                      placeholder="Enter installation charges"
                      value={installationCharges}
                      onChange={(e) => setInstallationCharges(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Pricing Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Subtotal (₹)</Label>
                      <div className="p-2 bg-gray-50 border rounded text-sm">
                        ₹{calculateSubtotal().toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <Label>GST Amount (₹)</Label>
                      <div className="p-2 bg-gray-50 border rounded text-sm">
                        ₹{calculateGSTAmount()}
                      </div>
                    </div>
                    <div>
                      <Label>Grand Total (₹)</Label>
                      <div className="p-2 bg-gray-50 border rounded text-sm">
                        ₹{calculateGrandTotal()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryTime">Delivery Time *</Label>
                    <Input
                      id="deliveryTime"
                      placeholder="e.g., 15 days"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                    <Input
                      id="warrantyPeriod"
                      placeholder="e.g., 2 years"
                      value={warrantyPeriod}
                      onChange={(e) => setWarrantyPeriod(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="termsAndConditions">Terms and Conditions</Label>
                  <Textarea
                    id="termsAndConditions"
                    placeholder="Enter terms and conditions"
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="additionalRemarks">Additional Remarks</Label>
                  <Textarea
                    id="additionalRemarks"
                    placeholder="Any additional information or terms"
                    value={additionalRemarks}
                    onChange={(e) => setAdditionalRemarks(e.target.value)}
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
