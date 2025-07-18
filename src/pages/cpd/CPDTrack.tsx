import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import IndentTrackerModal from '@/components/modals/IndentTrackerModal';
import { CheckCircle, Truck, Loader, AlertTriangle, Package } from 'lucide-react';

const CPDTrack: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  const finalizedIndents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      assignedVendor: 'Scientific Equipment Ltd',
      vendorContact: '+91 9876543210',
      amount: '₹2,50,000',
      deliveryStatus: 'delivered',
      finalizedBy: 'Management',
      dateFinalized: '2024-01-10',
      expectedDelivery: '2024-01-20',
      actualDelivery: '2024-01-18',
      purchaseOfficer: 'Priya Sharma',
      trackingId: 'TRK001',
      managementApproved: true
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      assignedVendor: 'Tech Solutions Corp',
      vendorContact: '+91 9876543211',
      amount: '₹1,80,000',
      deliveryStatus: 'in_transit',
      finalizedBy: 'Management',
      dateFinalized: '2024-01-12',
      expectedDelivery: '2024-01-22',
      actualDelivery: null,
      purchaseOfficer: 'Rajesh Kumar',
      trackingId: 'TRK002',
      managementApproved: true
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      assignedVendor: 'Office Supplies Pro',
      vendorContact: '+91 9876543212',
      amount: '₹25,000',
      deliveryStatus: 'processing',
      finalizedBy: 'Management',
      dateFinalized: '2024-01-14',
      expectedDelivery: '2024-01-24',
      actualDelivery: null,
      purchaseOfficer: 'Amit Patel',
      trackingId: 'TRK003',
      managementApproved: true
    },
    {
      id: 'IND004',
      title: 'Chemical Reagents for Research',
      assignedVendor: 'Lab Instruments Inc',
      vendorContact: '+91 9876543213',
      amount: '₹75,000',
      deliveryStatus: 'delayed',
      finalizedBy: 'Management',
      dateFinalized: '2024-01-08',
      expectedDelivery: '2024-01-18',
      actualDelivery: null,
      purchaseOfficer: 'Priya Sharma',
      trackingId: 'TRK004',
      managementApproved: true,
      revisedDeliveryDate: '2024-01-25'
    },
    {
      id: 'IND005',
      title: 'Furniture for New Office',
      assignedVendor: 'Furniture Craftsmen',
      vendorContact: '+91 9876543215',
      amount: '₹1,20,000',
      deliveryStatus: 'partially_delivered',
      finalizedBy: 'Management',
      dateFinalized: '2024-01-05',
      expectedDelivery: '2024-01-15',
      actualDelivery: '2024-01-14',
      purchaseOfficer: 'Sunita Verma',
      trackingId: 'TRK005',
      managementApproved: true
    }
  ];

  const handleSeeDetails = (indent: any) => {
    setSelectedIndent(indent);
    setIsTrackerModalOpen(true);
  };

  const filteredIndents = finalizedIndents.filter(indent => {
    const matchesStatus = filterStatus === 'all' || indent.deliveryStatus === filterStatus;
    const matchesSearch = searchTerm === '' || 
      indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.assignedVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.trackingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'delivered': 'bg-green-100 text-green-800',
      'in_transit': 'bg-blue-100 text-blue-800',
      'processing': 'bg-yellow-100 text-yellow-800',
      'delayed': 'bg-red-100 text-red-800',
      'partially_delivered': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getDeliveryInfo = (indent: any) => {
    if (indent.actualDelivery) {
      const expected = new Date(indent.expectedDelivery);
      const actual = new Date(indent.actualDelivery);
      const isOnTime = actual <= expected;
      
      return (
        <div className="text-sm">
          <div className={isOnTime ? 'text-green-600' : 'text-red-600'}>
            {indent.actualDelivery}
          </div>
          <div className="text-xs text-gray-500">
            {isOnTime ? 'On Time' : 'Delayed'}
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-sm">
          <div className="text-gray-600">{indent.expectedDelivery}</div>
          <div className="text-xs text-gray-500">Expected</div>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Indent Status Tracker"
        subtitle="Track delivery status of all finalized indents"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Finalized Indents Tracking</CardTitle>
            <CardDescription>Monitor delivery status and performance of finalized indents</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-green-50 p-4 rounded-lg flex items-center gap-2 max-w-xs w-full">
                <CheckCircle className="w-7 h-7 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {finalizedIndents.filter(i => i.deliveryStatus === 'delivered').length}
                  </div>
                  <div className="text-sm text-green-700">Delivered</div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-2 max-w-xs w-full">
                <Truck className="w-7 h-7 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {finalizedIndents.filter(i => i.deliveryStatus === 'in_transit').length}
                  </div>
                  <div className="text-sm text-blue-700">In Transit</div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-2 max-w-xs w-full">
                <Loader className="w-7 h-7 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {finalizedIndents.filter(i => i.deliveryStatus === 'processing').length}
                  </div>
                  <div className="text-sm text-yellow-700">Processing</div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 max-w-xs w-full">
                <AlertTriangle className="w-7 h-7 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {finalizedIndents.filter(i => i.deliveryStatus === 'delayed').length}
                  </div>
                  <div className="text-sm text-red-700">Delayed</div>
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-2 max-w-xs w-full">
                <Package className="w-7 h-7 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {finalizedIndents.filter(i => i.deliveryStatus === 'partially_delivered').length}
                  </div>
                  <div className="text-sm text-orange-700">Partial</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search by title, indent ID, vendor, or tracking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:max-w-sm"
              />
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="partially_delivered">Partially Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tracking Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Assigned Vendor</TableHead>
                    <TableHead>Purchase Officer</TableHead>
                    <TableHead>Delivery Status</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Finalized By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndents.map((indent) => (
                    <TableRow key={indent.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{indent.title}</div>
                          <div className="text-sm text-gray-500 space-x-2">
                            <span>{indent.id}</span>
                            <span>•</span>
                            <span>{indent.trackingId}</span>
                            <span>•</span>
                            <span className="font-medium">{indent.amount}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{indent.assignedVendor}</div>
                          <div className="text-xs text-gray-500">{indent.vendorContact}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{indent.purchaseOfficer}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(indent.deliveryStatus)}</TableCell>
                      <TableCell>{getDeliveryInfo(indent)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{indent.finalizedBy}</div>
                          <div className="text-xs text-gray-500">{indent.dateFinalized}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSeeDetails(indent)}
                          >
                            Tracking Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredIndents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No indents found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Indent Tracker Modal */}
      <IndentTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        indent={selectedIndent}
      />
    </DashboardLayout>
  );
};

export default CPDTrack;
