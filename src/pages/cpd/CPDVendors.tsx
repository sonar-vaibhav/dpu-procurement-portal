import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import RegisterVendorModal from '@/components/modals/RegisterVendorModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PurchaseOrderPage from '@/components/PurchaseOrder';

const CPDVendors: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [vendors, setVendors] = useState([
    {
      id: 'V001',
      name: 'Scientific Equipment Ltd',
      category: 'Laboratory',
      contactPerson: 'Dr. Rakesh Kumar',
      phone: '+91 9876543210',
      email: 'contact@sciequip.com',
      totalOrders: 25,
      completedOrders: 22,
      onTimeDelivery: 88,
      rating: 4.5,
      status: 'active'
    },
    {
      id: 'V002',
      name: 'Tech Solutions Corp',
      category: 'IT Equipment',
      contactPerson: 'Ms. Priya Sharma',
      phone: '+91 9876543211',
      email: 'sales@techsolutions.com',
      totalOrders: 18,
      completedOrders: 17,
      onTimeDelivery: 94,
      rating: 4.2,
      status: 'active'
    },
    {
      id: 'V003',
      name: 'Office Supplies Pro',
      category: 'Stationery',
      contactPerson: 'Mr. Amit Patel',
      phone: '+91 9876543212',
      email: 'info@officesuppliespro.com',
      totalOrders: 12,
      completedOrders: 12,
      onTimeDelivery: 100,
      rating: 4.0,
      status: 'active'
    },
    {
      id: 'V004',
      name: 'Lab Instruments Inc',
      category: 'Laboratory',
      contactPerson: 'Dr. Sunita Verma',
      phone: '+91 9876543213',
      email: 'support@labinstruments.com',
      totalOrders: 8,
      completedOrders: 6,
      onTimeDelivery: 75,
      rating: 3.8,
      status: 'review'
    },
    {
      id: 'V005',
      name: 'Digital World Electronics',
      category: 'IT Equipment',
      contactPerson: 'Mr. Karan Singh',
      phone: '+91 9876543214',
      email: 'orders@digitalworld.com',
      totalOrders: 15,
      completedOrders: 14,
      onTimeDelivery: 93,
      rating: 4.3,
      status: 'active'
    },
    {
      id: 'V006',
      name: 'Furniture Craftsmen',
      category: 'Furniture',
      contactPerson: 'Ms. Anjali Gupta',
      phone: '+91 9876543215',
      email: 'sales@furniturecraftsmen.com',
      totalOrders: 6,
      completedOrders: 5,
      onTimeDelivery: 83,
      rating: 4.1,
      status: 'active'
    }
  ]);

  const [openVendorHistory, setOpenVendorHistory] = useState<null | any>(null);
  const [selectedYear, setSelectedYear] = useState('2023-2024');
  const [openPOIndent, setOpenPOIndent] = useState<null | any>(null);

  // Mock vendor history data
  const vendorHistories = {
    V001: {
      years: ['2023-2024', '2022-2023'],
      indents: [
        { id: 'IND001', title: 'Lab Equipment', price: 25000, year: '2023-2024' },
        { id: 'IND002', title: 'Library Books', price: 12000, year: '2023-2024' },
        { id: 'IND010', title: 'Old Order', price: 8000, year: '2022-2023' }
      ]
    },
    V002: {
      years: ['2023-2024'],
      indents: [
        { id: 'IND003', title: 'Projectors', price: 18000, year: '2023-2024' }
      ]
    }
    // ... add more as needed
  };

  const handleVendorRegistered = (newVendor: any) => {
    setVendors(prev => [...prev, newVendor]);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleViewPerformance = (vendorId: string) => {
    toast({
      title: "Vendor Performance",
      description: `Opening performance details for vendor ${vendorId}`,
    });
  };

  const handleSendRFQ = (vendorId: string) => {
    toast({
      title: "RFQ Sent",
      description: `Request for quotation sent to vendor ${vendorId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '⭐' : '');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendor Directory"
        subtitle="Manage registered vendors and their performance"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registered Vendors</CardTitle>
                <CardDescription>View and manage all registered vendors</CardDescription>
              </div>
              <Button 
                className="dpu-button-primary"
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register New Vendor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search vendors by name, ID, or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:max-w-sm"
              />
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <p className="text-sm text-gray-500">ID: {vendor.id}</p>
                      </div>
                      {getStatusBadge(vendor.status)}
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {vendor.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Contact:</span> {vendor.contactPerson}
                      </div>
                      <div className="text-sm text-gray-600">
                        📞 {vendor.phone}
                      </div>
                      <div className="text-sm text-gray-600">
                        ✉️ {vendor.email}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{vendor.totalOrders}</div>
                        <div className="text-xs text-gray-500">Total Orders</div>
                      </div>
                    </div>

                    {/* <div className="flex justify-between items-center pt-2">
                      <div className="text-sm">
                        <span className="font-medium">Rating:</span> {getRatingStars(vendor.rating)} {vendor.rating}
                      </div>
                      <div className="text-sm text-gray-600">
                        {vendor.completedOrders}/{vendor.totalOrders} completed
                      </div>
                    </div> */}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setOpenVendorHistory(vendor)}
                      >
                        Past History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No vendors found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Register Vendor Modal */}
      <RegisterVendorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onVendorRegistered={handleVendorRegistered}
      />

      {/* Vendor History Modal */}
      {openVendorHistory && (
        <Dialog open={!!openVendorHistory} onOpenChange={v => !v && setOpenVendorHistory(null)}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-white border-l-4 border-dpu-red">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-dpu-red font-bold text-xl border-2 border-gray-200">
                {openVendorHistory.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-semibold text-gray-900">{openVendorHistory.name}</div>
                <div className="text-xs text-gray-500">ID: {openVendorHistory.id} • {openVendorHistory.category}</div>
              </div>
            </div>
            <div className="px-6 pt-4 pb-2 bg-white">
              {/* Summary Row */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <svg className="w-5 h-5 text-dpu-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                    <span className="font-medium text-gray-700">Total Indents:</span>
                    <span className="font-bold text-dpu-red">{(vendorHistories[openVendorHistory.id]?.indents.filter(i => i.year === selectedYear).length) || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" /></svg>
                    <span className="font-medium text-gray-700">Total Price:</span>
                    <span className="font-bold text-green-600">₹{(vendorHistories[openVendorHistory.id]?.indents.filter(i => i.year === selectedYear).reduce((sum, i) => sum + i.price, 0) || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Financial Year:</span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-dpu-red bg-white text-gray-900"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                  >
                    {(vendorHistories[openVendorHistory.id]?.years || ['2023-2024']).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Indents List */}
              <div className="border rounded-lg bg-white p-0 max-h-64 overflow-y-auto shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 bg-gray-100">
                      <th className="px-4 py-2">Indent ID</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(vendorHistories[openVendorHistory.id]?.indents.filter(i => i.year === selectedYear) || []).map(indent => (
                      <tr key={indent.id} className="even:bg-gray-50 odd:bg-white">
                        <td className="px-4 py-2 font-mono text-dpu-gray">{indent.id}</td>
                        <td className="px-4 py-2">{indent.title}</td>
                        <td className="px-4 py-2 font-semibold text-gray-800">₹{indent.price.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <Button size="sm" variant="outline" className="border-gray-300 hover:text-dpu-red hover:bg-red-50" onClick={() => setOpenPOIndent(indent)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {(vendorHistories[openVendorHistory.id]?.indents.filter(i => i.year === selectedYear).length === 0) && (
                      <tr><td colSpan={4} className="text-center text-gray-400 py-4">No indents found for this year.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Purchase Order Modal */}
      {openPOIndent && (
        <Dialog open={!!openPOIndent} onOpenChange={v => !v && setOpenPOIndent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="mb-2 font-semibold text-lg text-dpu-red">Purchase Order for Indent: {openPOIndent.id}</div>
            <div className="bg-white rounded shadow">
              <PurchaseOrderPage />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default CPDVendors;
