
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/constants/roles';

interface IndentItem {
  itemName: string;
  description: string;
  quantity: string;
  make: string;
  uom: string;
  stockInHand: string;
  approxValue: string;
  purpose: string;
  isCustom?: boolean;
  vendorQuotation?: string;
  imageFile?: File | null;
  catalogFile?: File | null;
}

const CreateIndent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState<IndentItem[]>([
    {
      itemName: '',
      description: '',
      quantity: '',
      make: '',
      uom: '',
      stockInHand: '',
      approxValue: '',
      purpose: '',
      isCustom: false,
      vendorQuotation: '',
      imageFile: null,
      catalogFile: null
    }
  ]);

  const [formData, setFormData] = useState({
    department: '',
    budgetHead: '',
    priority: 'medium',
    justification: ''
  });

  const addItem = () => {
    setItems([...items, {
      itemName: '',
      description: '',
      quantity: '',
      make: '',
      uom: '',
      stockInHand: '',
      approxValue: '',
      purpose: '',
      isCustom: false,
      vendorQuotation: '',
      imageFile: null,
      catalogFile: null
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof IndentItem, value: any) => {
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = value;
    setItems(updatedItems);
  };

  const handleFileChange = (index: number, field: 'imageFile' | 'catalogFile', file: File | null) => {
    const updatedItems = [...items];
    updatedItems[index][field] = file;
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const hasValidItems = items.some(item => 
      item.itemName && item.quantity && item.approxValue
    );
    
    if (!hasValidItems || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate saving
    toast({
      title: "Indent Created Successfully",
      description: "Your procurement request has been submitted for HOD approval",
    });
    
    navigate('/users');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Create Purchase Indent"
        subtitle="Submit a new procurement request"
      />
      
      <div className="p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>General details about the procurement request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="budgetHead">Budget Head</Label>
                  <Input
                    id="budgetHead"
                    value={formData.budgetHead}
                    onChange={(e) => setFormData({...formData, budgetHead: e.target.value})}
                    placeholder="Enter budget head"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => setFormData({...formData, justification: e.target.value})}
                  placeholder="Explain the need for this procurement"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Items Required</CardTitle>
                  <CardDescription>Add all items needed for this procurement</CardDescription>
                </div>
                <Button type="button" onClick={addItem} variant="outline">
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-2">
                    <input
                      type="checkbox"
                      id={`isCustom-${index}`}
                      checked={!!item.isCustom}
                      onChange={e => updateItem(index, 'isCustom', e.target.checked)}
                    />
                    <Label htmlFor={`isCustom-${index}`}>Custom Item (not in existing list)</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`itemName-${index}`}>Item Name *</Label>
                      <Input
                        id={`itemName-${index}`}
                        value={item.itemName}
                        onChange={(e) => updateItem(index, 'itemName', e.target.value)}
                        placeholder="Enter item name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`make-${index}`}>Make/Brand</Label>
                      <Input
                        id={`make-${index}`}
                        value={item.make}
                        onChange={(e) => updateItem(index, 'make', e.target.value)}
                        placeholder="Enter make or brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity *</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`uom-${index}`}>Unit of Measurement</Label>
                      <Input
                        id={`uom-${index}`}
                        value={item.uom}
                        onChange={(e) => updateItem(index, 'uom', e.target.value)}
                        placeholder="e.g., Nos, Kg, Ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`stockInHand-${index}`}>Stock in Hand</Label>
                      <Input
                        id={`stockInHand-${index}`}
                        value={item.stockInHand}
                        onChange={(e) => updateItem(index, 'stockInHand', e.target.value)}
                        placeholder="Current stock available"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`approxValue-${index}`}>Approximate Value *</Label>
                      <Input
                        id={`approxValue-${index}`}
                        type="number"
                        value={item.approxValue}
                        onChange={(e) => updateItem(index, 'approxValue', e.target.value)}
                        placeholder="Enter approximate value"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Detailed description of the item"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`purpose-${index}`}>Purpose</Label>
                    <Input
                      id={`purpose-${index}`}
                      value={item.purpose}
                      onChange={(e) => updateItem(index, 'purpose', e.target.value)}
                      placeholder="Purpose of this item"
                    />
                  </div>
                  {/* Vendor Quotation Field */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendorQuotation-${index}`}>Vendor Quotation</Label>
                    <Input
                      id={`vendorQuotation-${index}`}
                      value={item.vendorQuotation || ''}
                      onChange={(e) => updateItem(index, 'vendorQuotation', e.target.value)}
                      placeholder="Enter vendor quotation details or reference"
                    />
                  </div>
                  {/* Image and Catalog Uploads (Optional, always visible) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`imageFile-${index}`}>Upload Image (optional)</Label>
                      <Input
                        id={`imageFile-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange(index, 'imageFile', e.target.files ? e.target.files[0] : null)}
                      />
                      {item.imageFile && <span className="text-xs text-gray-500">{item.imageFile.name}</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`catalogFile-${index}`}>Upload Catalog (optional)</Label>
                      <Input
                        id={`catalogFile-${index}`}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={e => handleFileChange(index, 'catalogFile', e.target.files ? e.target.files[0] : null)}
                      />
                      {item.catalogFile && <span className="text-xs text-gray-500">{item.catalogFile.name}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex space-x-4">
            <Button type="submit" className="dpu-button-primary">
              Submit Indent
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateIndent;
