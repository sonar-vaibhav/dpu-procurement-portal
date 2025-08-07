import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useToast } from '@/hooks/use-toast';
import { getCollegeNames } from '@/constants/colleges';

interface IndentItem {
  category: string;
  itemName: string;
  specs: string;
  make: string;
  customMake: string;
  quantity: string;
  uom: string;
  stockInHand: string;
  similarItem: string;
  approxValue: string;
  description: string;
  vendorQuotationFile?: File | null;
  imageFile?: File | null;
  catalogFile?: File | null;
}

interface CreateIndentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const popularMakes = ['Dell', 'Microsoft', 'HP', 'Asus'];

const CreateIndentModal: React.FC<CreateIndentModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { toast } = useToast();
  const [items, setItems] = useState<IndentItem[]>([
    {
      category: '',
      itemName: '',
      specs: '',
      make: '',
      customMake: '',
      quantity: '',
      uom: '',
      stockInHand: '',
      similarItem: '',
      approxValue: '',
      description: '',
      vendorQuotationFile: null,
      imageFile: null,
      catalogFile: null
    }
  ]);

  const [formData, setFormData] = useState({
    instituteName: '',
    department: '',
    materialType: '',
    contactNo: '',
    intercomNo: '',
    categoryCode: '',
    timeline: '',
    urgentReason: '',
    budgetProvision: '',
    budgetHead: ''
  });

  const addItem = () => {
    setItems([
      {
        category: '',
        itemName: '',
        specs: '',
        make: '',
        customMake: '',
        quantity: '',
        uom: '',
        stockInHand: '',
        similarItem: '',
        approxValue: '',
        description: '',
        vendorQuotationFile: null,
        imageFile: null,
        catalogFile: null
      },
      ...items
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (
    index: number,
    field: keyof IndentItem | 'vendorQuotationFile',
    value: any
  ) => {
    const updatedItems = [...items];
    if (field === 'vendorQuotationFile') {
      updatedItems[index].vendorQuotationFile = value;
    } else {
      updatedItems[index][field] = value;
    }
    if (field === 'make' && value !== 'Other') {
      updatedItems[index].customMake = '';
    }
    setItems(updatedItems);
  };

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'imageFile' | 'catalogFile' | 'vendorQuotationFile'
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = file;
    setItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidItems = items.some(
      item => item.itemName && item.quantity && item.approxValue
    );

    if (!hasValidItems || !formData.instituteName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const preparedItems = items.map(item => ({
      ...item,
      make: item.make === 'Other' ? item.customMake : item.make
    }));

    onSubmit({ ...formData, items: preparedItems });
    toast({
      title: 'Indent Created Successfully',
      description: 'Your procurement request has been submitted'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-screen h-screen max-w-none max-h-none rounded-none 
        shadow-none px-3 py-3 md:px-10 md:py-8 overflow-y-auto bg-gray-50"
      >
        <DialogHeader
          className="bg-gray-50 pb-4 border-b shadow-sm flex flex-col gap-1"
        >
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Create New Purchase Indent
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fill in the details for your procurement request
          </DialogDescription>
        </DialogHeader>


        <form
          onSubmit={handleSubmit}
          className="space-y-6 pt-4 pb-24 md:pb-10"
        >
          {/* Institute Details */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Institute Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <SearchableSelect
                  label="Institute Name"
                  placeholder="Search and select institute..."
                  value={formData.instituteName}
                  onValueChange={value =>
                    setFormData({ ...formData, instituteName: value })
                  }
                  options={getCollegeNames()}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Department/Lab *</Label>
                <Input
                  value={formData.department}
                  onChange={e =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Material Type</Label>
                <Select
                  value={formData.materialType}
                  onValueChange={value =>
                    setFormData({ ...formData, materialType: value })
                  }
                >
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
                <Label>Contact No.</Label>
                <Input
                  value={formData.contactNo}
                  onChange={e =>
                    setFormData({ ...formData, contactNo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Intercom No.</Label>
                <Input
                  value={formData.intercomNo}
                  onChange={e =>
                    setFormData({ ...formData, intercomNo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Budget Head</Label>
                <Input
                  value={formData.budgetHead}
                  onChange={e =>
                    setFormData({ ...formData, budgetHead: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white shadow rounded-lg p-4 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Items Required
              </h3>
              <Button type="button" onClick={addItem} variant="outline">
                + Add Item
              </Button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    Item {index + 1}
                  </h4>
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
                    <Label>Item Name *</Label>
                    <Input
                      value={item.itemName}
                      onChange={e => updateItem(index, 'itemName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description / Specification</Label>
                    <Textarea
                      value={item.specs}
                      onChange={e => updateItem(index, 'specs', e.target.value)}
                      placeholder="Enter specification"
                      required
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Make / Manufacturer</Label>
                    <Select
                      value={item.make}
                      onValueChange={value => updateItem(index, 'make', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Make" />
                      </SelectTrigger>
                      <SelectContent>
                        {popularMakes.map(make => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {item.make === 'Other' && (
                      <Input
                        placeholder="Add new Make"
                        value={item.customMake}
                        onChange={e => updateItem(index, 'customMake', e.target.value)}
                      />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={e => updateItem(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>UOM</Label>
                    <Select
                      value={item.uom}
                      onValueChange={value => updateItem(index, 'uom', value)}
                    >
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
                    <Label>Stock in Hand</Label>
                    <Input
                      value={item.stockInHand}
                      onChange={e => updateItem(index, 'stockInHand', e.target.value)}
                      placeholder="Available stock"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Approximate Value *</Label>
                    <Input
                      type="number"
                      value={item.approxValue}
                      onChange={e => updateItem(index, 'approxValue', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label>Similar Item Purchased?</Label>
                    <div className="flex gap-4">
                      {['yes', 'no'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateItem(index, 'similarItem', opt)}
                          className={`px-4 py-1 rounded-full border ${item.similarItem === opt ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
                        >
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor Quotation</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                      onChange={e => handleFileChange(index, e, 'vendorQuotationFile')}
                    />
                    {item.vendorQuotationFile && (
                      <p className="text-sm text-gray-600 mt-1 truncate">{item.vendorQuotationFile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(index, e, 'imageFile')}
                    />
                    {item.imageFile && (
                      <p className="text-sm text-gray-600 mt-1 truncate">{item.imageFile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Catalog</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => handleFileChange(index, e, 'catalogFile')}
                    />
                    {item.catalogFile && (
                      <p className="text-sm text-gray-600 mt-1 truncate">{item.catalogFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline & Budget */}
          <div className="bg-white shadow rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Timeline & Budget
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timeline for Delivery</Label>
                <Input
                  value={formData.timeline}
                  onChange={e =>
                    setFormData({ ...formData, timeline: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Budget Provision</Label>
                <Select
                  value={formData.budgetProvision}
                  onValueChange={value =>
                    setFormData({ ...formData, budgetProvision: value })
                  }
                >
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
              <Label>Urgent Reason (if any)</Label>
              <Textarea
                value={formData.urgentReason}
                onChange={e =>
                  setFormData({ ...formData, urgentReason: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2 flex justify-end gap-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-dpu-red text-white hover:bg-dpu-red-dark"
            >
              Submit Indent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIndentModal;
