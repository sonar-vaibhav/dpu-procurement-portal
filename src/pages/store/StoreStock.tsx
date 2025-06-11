import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface StockItem {
  id: string;
  category: string;
  name: string;
  totalQuantity: number;
  inUse: number;
  defective: number;
  notes?: string;
}

const StoreStock: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState<Partial<StockItem>>({
    category: '',
    name: '',
    totalQuantity: 0,
    inUse: 0,
    defective: 0,
    notes: ''
  });

  const stockItems: StockItem[] = [
    {
      id: 'STK001',
      category: 'Laboratory Equipment',
      name: 'Microscope',
      totalQuantity: 10,
      inUse: 8,
      defective: 1,
      notes: 'High-precision research microscopes'
    },
    {
      id: 'STK002',
      category: 'Computer Hardware',
      name: 'Desktop Computers',
      totalQuantity: 50,
      inUse: 45,
      defective: 2,
      notes: 'Dell OptiPlex workstations'
    },
    {
      id: 'STK003',
      category: 'Office Supplies',
      name: 'Printers',
      totalQuantity: 15,
      inUse: 12,
      defective: 0,
      notes: 'HP LaserJet printers'
    }
  ];

  const categories = [
    'Laboratory Equipment',
    'Computer Hardware',
    'Office Supplies',
    'Furniture',
    'Electronics',
    'Stationery'
  ];

  const handleAddEdit = () => {
    if (!formData.category || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingItem) {
      // Update existing item
      toast({
        title: "Item Updated",
        description: "Stock item has been successfully updated"
      });
    } else {
      // Add new item
      toast({
        title: "Item Added",
        description: "New stock item has been successfully added"
      });
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      category: '',
      name: '',
      totalQuantity: 0,
      inUse: 0,
      defective: 0,
      notes: ''
    });
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = (itemId: string) => {
    toast({
      title: "Item Deleted",
      description: "Stock item has been successfully deleted",
      variant: "destructive"
    });
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Stock Management"
        subtitle="Manage inventory items and track stock levels"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Manage and track all stock items</CardDescription>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-dpu-red hover:bg-dpu-red-dark text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter item name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="totalQuantity">Total Quantity</Label>
                        <Input
                          id="totalQuantity"
                          type="number"
                          value={formData.totalQuantity}
                          onChange={(e) => setFormData({...formData, totalQuantity: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inUse">In Use</Label>
                        <Input
                          id="inUse"
                          type="number"
                          value={formData.inUse}
                          onChange={(e) => setFormData({...formData, inUse: parseInt(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="defective">Defective</Label>
                        <Input
                          id="defective"
                          type="number"
                          value={formData.defective}
                          onChange={(e) => setFormData({...formData, defective: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Enter any additional notes"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-dpu-red hover:bg-dpu-red-dark text-white"
                      onClick={handleAddEdit}
                    >
                      {editingItem ? 'Update Item' : 'Add Item'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stock Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Total Quantity</TableHead>
                    <TableHead>In Use</TableHead>
                    <TableHead>Defective</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.inUse}</TableCell>
                      <TableCell>{item.defective}</TableCell>
                      <TableCell>{item.totalQuantity - item.inUse - item.defective}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreStock; 