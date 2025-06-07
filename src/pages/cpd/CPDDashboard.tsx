
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CPDDashboard: React.FC = () => {
  const { toast } = useToast();

  const pendingQuotes = [
    {
      id: 'RFQ001',
      title: 'Laboratory Equipment - Microscopes',
      vendors: ['Vendor A', 'Vendor B', 'Vendor C'],
      quotesReceived: 2,
      totalVendors: 3,
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: 'RFQ002',
      title: 'Computer Lab Hardware',
      vendors: ['Tech Corp', 'Digital Solutions'],
      quotesReceived: 2,
      totalVendors: 2,
      dueDate: '2024-01-18',
      status: 'ready_for_comparison'
    }
  ];

  const vendors = [
    { id: 'V001', name: 'Scientific Equipment Ltd', category: 'Laboratory', rating: 4.5, totalOrders: 25 },
    { id: 'V002', name: 'Tech Solutions Corp', category: 'IT Hardware', rating: 4.2, totalOrders: 18 },
    { id: 'V003', name: 'Office Supplies Pro', category: 'Stationery', rating: 4.0, totalOrders: 12 }
  ];

  const handleCompareQuotes = (rfqId: string) => {
    toast({
      title: "Opening Quote Comparison",
      description: `Comparing quotes for ${rfqId}`,
    });
  };

  const handleSendRFQ = (rfqId: string) => {
    toast({
      title: "RFQ Sent",
      description: `Request for quotation ${rfqId} has been sent to vendors`,
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="CPD Dashboard"
        subtitle="Manage vendors, quotes, and procurement processes"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active RFQs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <p className="text-xs text-gray-500 mt-1">2 due this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Registered Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">48</div>
              <p className="text-xs text-gray-500 mt-1">3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Quotes Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting comparison</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Orders Finalized</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending RFQs and Quote Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Active RFQs & Quote Management</CardTitle>
            <CardDescription>Manage requests for quotations and compare vendor responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingQuotes.map((rfq) => (
                <div key={rfq.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{rfq.title}</h4>
                        <Badge className={rfq.status === 'ready_for_comparison' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {rfq.status === 'ready_for_comparison' ? 'Ready for Comparison' : 'Pending Quotes'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <span className="font-medium">RFQ ID:</span> {rfq.id}
                        </div>
                        <div>
                          <span className="font-medium">Quotes:</span> {rfq.quotesReceived}/{rfq.totalVendors}
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span> {rfq.dueDate}
                        </div>
                        <div>
                          <span className="font-medium">Vendors:</span> {rfq.vendors.join(', ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {rfq.status === 'ready_for_comparison' ? (
                        <Button
                          size="sm"
                          className="dpu-button-primary"
                          onClick={() => handleCompareQuotes(rfq.id)}
                        >
                          Compare Quotes
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendRFQ(rfq.id)}
                        >
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendor Management */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Manage and review vendor performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>ID: {vendor.id}</span>
                      <span>Rating: ⭐ {vendor.rating}</span>
                      <span>Orders: {vendor.totalOrders}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button size="sm" className="dpu-button-primary">
                      Send RFQ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common CPD tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 justify-start">
                <div className="text-left">
                  <div className="font-medium">🏢 Register Vendor</div>
                  <div className="text-sm text-gray-500">Add new vendor to system</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-16 justify-start">
                <div className="text-left">
                  <div className="font-medium">📊 Generate Report</div>
                  <div className="text-sm text-gray-500">Vendor performance analysis</div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-16 justify-start">
                <div className="text-left">
                  <div className="font-medium">📄 Bulk RFQ</div>
                  <div className="text-sm text-gray-500">Send multiple RFQs</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDDashboard;
