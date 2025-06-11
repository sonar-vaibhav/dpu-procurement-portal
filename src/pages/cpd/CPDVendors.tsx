
import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const CPDVendors: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const vendors = [
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
  ];

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
              <Button className="dpu-button-primary">
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
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{vendor.totalOrders}</div>
                        <div className="text-xs text-gray-500">Total Orders</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getPerformanceColor(vendor.onTimeDelivery)}`}>
                          {vendor.onTimeDelivery}%
                        </div>
                        <div className="text-xs text-gray-500">On-Time Delivery</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-sm">
                        <span className="font-medium">Rating:</span> {getRatingStars(vendor.rating)} {vendor.rating}
                      </div>
                      <div className="text-sm text-gray-600">
                        {vendor.completedOrders}/{vendor.totalOrders} completed
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewPerformance(vendor.id)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 dpu-button-primary"
                        onClick={() => handleSendRFQ(vendor.id)}
                      >
                        Send RFQ
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
    </DashboardLayout>
  );
};

export default CPDVendors;
