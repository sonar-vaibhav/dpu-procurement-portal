
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface IndentItem {
  category: string;
  itemName: string;
  specs: string;
  description: string;
  make: string;
  quantity: string;
  uom: string;
  stockInHand: string;
  similarItem: string;
  approxValue: string;
}

interface CreateIndentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateIndentModal: React.FC<CreateIndentModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [items, setItems] = useState<IndentItem[]>([
    {
      category: '',
      itemName: '',
      specs: '',
      description: '',
      make: '',
      quantity: '',
      uom: '',
      stockInHand: '',
      similarItem: '',
      approxValue: ''
    }
  ]);

  const [formData, setFormData] = useState({
    instituteName: '',
    department: '',
    materialType: '',
    contactNo: '',
    categoryCode: '',
    timeline: '',
    urgentReason: '',
    budgetProvision: '',
    budgetHead: ''
  });

  const addItem = () => {
    setItems([...items, {
      category: '',
      itemName: '',
      specs: '',
      description: '',
      make: '',
      quantity: '',
      uom: '',
      stockInHand: '',
      similarItem: '',
      approxValue: ''
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof IndentItem, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasValidItems = items.some(item => 
      item.itemName && item.quantity && item.approxValue
    );
    
    if (!hasValidItems || !formData.instituteName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSubmit({ ...formData, items });
    toast({
      title: "Indent Created Successfully",
      description: "Your procurement request has been submitted",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Purchase Indent</DialogTitle>
          <DialogDescription>
            Fill in the details for your procurement request
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instituteName">Institute Name *</Label>
              <Input
                id="instituteName"
                value={formData.instituteName}
                onChange={(e) => setFormData({...formData, instituteName: e.target.value})}
                placeholder="Enter institute name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department/Lab *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="Enter department/lab"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="materialType">Material Type</Label>
              <Select value={formData.materialType} onValueChange={(value) => setFormData({...formData, materialType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="consumables">Consumables</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact No.</Label>
              <Input
                id="contactNo"
                value={formData.contactNo}
                onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                placeholder="Enter contact number"
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Items Required</h3>
              <Button type="button" onClick={addItem} variant="outline">
                Add Item
              </Button>
            </div>
            
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`category-${index}`}>Category</Label>
                    <Select value={item.category} onValueChange={(value) => updateItem(index, 'category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="mechanical">Mechanical</SelectItem>
                        <SelectItem value="chemical">Chemical</SelectItem>
                        <SelectItem value="stationery">Stationery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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
                    <Label htmlFor={`specs-${index}`}>Specifications</Label>
                    <Input
                      id={`specs-${index}`}
                      value={item.specs}
                      onChange={(e) => updateItem(index, 'specs', e.target.value)}
                      placeholder="Enter specifications"
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
                    <Label htmlFor={`uom-${index}`}>UOM</Label>
                    <Select value={item.uom} onValueChange={(value) => updateItem(index, 'uom', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nos">Nos</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="ltr">Ltr</SelectItem>
                        <SelectItem value="mtr">Mtr</SelectItem>
                        <SelectItem value="pcs">Pcs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`approxValue-${index}`}>Approx Value *</Label>
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
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline for Delivery</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                placeholder="e.g., 2 weeks"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budgetProvision">Budget Provision</Label>
              <Select value={formData.budgetProvision} onValueChange={(value) => setFormData({...formData, budgetProvision: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgentReason">Urgent Reason (if any)</Label>
            <Textarea
              id="urgentReason"
              value={formData.urgentReason}
              onChange={(e) => setFormData({...formData, urgentReason: e.target.value})}
              placeholder="Explain if this is urgent"
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-dpu-red hover:bg-dpu-red-dark text-white">
              Submit Indent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIndentModal;
