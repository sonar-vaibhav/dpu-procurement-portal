import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  totalOrders: number;
  onTimeDelivery: number;
}

const OfficerVendors: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const vendors: Vendor[] = [
    {
      id: 'V001',
      name: 'TechCorp Solutions',
      category: 'Electronics',
      email: 'contact@techcorp.com',
      phone: '+91 98765 43210',
      location: 'Mumbai',
      rating: 4.5,
      totalOrders: 25,
      onTimeDelivery: 92
    },
    {
      id: 'V002',
      name: 'Lab Equipment Pro',
      category: 'Lab Equipment',
      email: 'sales@labequip.com',
      phone: '+91 87654 32109',
      location: 'Delhi',
      rating: 4.8,
      totalOrders: 18,
      onTimeDelivery: 95
    },
    {
      id: 'V003',
      name: 'Office Furniture Hub',
      category: 'Furniture',
      email: 'info@furniturehub.com',
      phone: '+91 76543 21098',
      location: 'Bangalore',
      rating: 4.2,
      totalOrders: 30,
      onTimeDelivery: 88
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = filterCategory === 'all' || vendor.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSendEmail = (vendor: Vendor) => {
    toast({
      title: "Email Initiated",
      description: `Opening email client to contact ${vendor.name}`,
    });
    window.location.href = `mailto:${vendor.email}?subject=Procurement Inquiry`;
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '⭐' : '');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Vendor Directory"
        subtitle="Manage vendor relationships for your category"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Category-Based Vendors</CardTitle>
                <CardDescription>Vendors assigned to your procurement category</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search vendors by name or ID..."
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
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
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
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {vendor.category}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        📍 {vendor.location}
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

export default OfficerVendors;
