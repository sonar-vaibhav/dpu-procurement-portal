
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CPDQuotes: React.FC = () => {
  const quotes = [
    {
      id: 'RFQ001',
      title: 'Laboratory Equipment - Microscopes',
      vendor: 'Scientific Instruments Ltd',
      amount: '₹23,500',
      deliveryTime: '15 days',
      warranty: '2 years',
      status: 'received'
    },
    {
      id: 'RFQ001',
      title: 'Laboratory Equipment - Microscopes',
      vendor: 'Lab Equipment Pro',
      amount: '₹25,200',
      deliveryTime: '10 days',
      warranty: '1 year',
      status: 'received'
    },
    {
      id: 'RFQ002',
      title: 'Computer Lab Hardware',
      vendor: 'Tech Solutions Corp',
      amount: '₹42,800',
      deliveryTime: '7 days',
      warranty: '3 years',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Quote Management"
        subtitle="Compare and manage vendor quotations"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Quotations</CardTitle>
            <CardDescription>Review and compare quotes from registered vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quotes.map((quote, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{quote.title}</h4>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">RFQ ID:</span> {quote.id}
                        </div>
                        <div>
                          <span className="font-medium">Vendor:</span> {quote.vendor}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> {quote.amount}
                        </div>
                        <div>
                          <span className="font-medium">Delivery:</span> {quote.deliveryTime}
                        </div>
                        <div>
                          <span className="font-medium">Warranty:</span> {quote.warranty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Compare
                      </Button>
                      <Button size="sm" className="dpu-button-primary">
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDQuotes;
