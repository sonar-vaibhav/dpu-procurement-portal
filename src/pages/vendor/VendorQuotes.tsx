import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const VendorQuotes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openPOFor, setOpenPOFor] = useState<string | null>(null);

  const quotes = [
    {
      id: 'Q001',
      enquiryId: 'ENQ001',
      title: 'Laboratory Equipment - Microscopes',
      quotedPrice: '₹23,500',
      revisedPrice: '₹21,000',
      submittedDate: '2024-01-15',
      status: 'accepted',
      deliveryTime: '12 days',
      notes: 'Revised with 10% discount'
    },
    {
      id: 'Q002',
      enquiryId: 'ENQ002',
      title: 'Computer Lab Hardware',
      quotedPrice: '₹42,800',
      revisedPrice: null,
      submittedDate: '2024-01-18',
      status: 'pending',
      deliveryTime: '7 days',
      notes: 'Initial quotation'
    },
    {
      id: 'Q003',
      enquiryId: 'ENQ003',
      title: 'Office Furniture Set',
      quotedPrice: '₹15,600',
      revisedPrice: '₹14,200',
      submittedDate: '2024-01-12',
      status: 'pending',
      deliveryTime: '5 days',
      notes: 'Competitor offered better terms'
    }
  ];

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: quotes.length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    pending: quotes.filter(q => q.status === 'pending').length,
    rejected: quotes.filter(q => q.status === 'rejected').length
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Quote History"
        subtitle="Track all your submitted quotations"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quote History Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>Complete history of your submitted quotes</CardDescription>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.title}</TableCell>
                    <TableCell>{quote.quotedPrice}</TableCell>
                    <TableCell>
                      {quote.revisedPrice ? (
                        <div>
                          <span className="text-green-600 font-medium">{quote.revisedPrice}</span>
                          <p className="text-xs text-gray-500 line-through">{quote.quotedPrice}</p>
                        </div>
                      ) : (
                        quote.quotedPrice
                      )}
                    </TableCell>
                    <TableCell>{quote.deliveryTime}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{quote.submittedDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {quote.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/vendor/revise/${quote.enquiryId}`)}
                          >
                            Revise
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => navigate(`/vendor/quotes/${quote.id}`, { state: { quote } })}
                        >
                          View
                        </Button>
                        {quote.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setOpenPOFor(quote.id)}
                          >
                            View PO
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredQuotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No quotes found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={!!openPOFor} onOpenChange={v => !v && setOpenPOFor(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Purchase Order</DialogTitle>
            <DialogDescription>Preview of the final Purchase Order for this quote.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <PurchaseOrderPage />
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default VendorQuotes;
