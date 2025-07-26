import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Package, Plus, History, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';

interface DeliveryLog {
  date: string;
  quantity: number;
  remarks: string;
}

interface IndentDelivery {
  id: string;
  title: string;
  department: string;
  itemName: string;
  quantityRequested: number;
  quantityDelivered: number;
  status: 'not_received' | 'partially_received' | 'fully_received';
  deliveryLogs: DeliveryLog[];
  items: any[];
  date: string;
  amount: string;
  budgetHead: string;
  priority: string;
  justification: string;
  requestedBy: string;
  approvalTrail?: string[];
}

const StoreTrack: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<IndentDelivery | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    quantity: 0,
    remarks: ''
  });

  const indents: IndentDelivery[] = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      department: 'Biology',
      itemName: 'Microscope',
      quantityRequested: 5,
      quantityDelivered: 3,
      status: 'partially_received',
      date: '2024-01-16',
      amount: '₹25,000',
      budgetHead: 'Lab Equipment Fund',
      priority: 'high',
      justification: 'Required for advanced research in cell biology',
      requestedBy: 'Dr. John Smith',
      approvalTrail: ['User', 'HOD', 'Store'],
      items: [
        {
          itemName: 'Microscope',
          description: 'High-resolution microscope for cell research',
          quantity: '5',
          make: 'Olympus',
          uom: 'Nos',
          stockInHand: '5',
          approxValue: '25000',
          purpose: 'Research'
        }
      ],
      deliveryLogs: [
        {
          date: '2024-01-20',
          quantity: 2,
          remarks: 'Initial delivery'
        },
        {
          date: '2024-01-25',
          quantity: 1,
          remarks: 'Second batch'
        }
      ]
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      department: 'Computer Science',
      itemName: 'Desktop Computers',
      quantityRequested: 10,
      quantityDelivered: 10,
      status: 'fully_received',
      date: '2024-01-15',
      amount: '₹45,000',
      budgetHead: 'Infrastructure Fund',
      priority: 'high',
      justification: 'Upgrading computer lab equipment for new courses',
      requestedBy: 'Prof. Sarah Wilson',
      approvalTrail: ['User', 'HOD', 'Store'],
      items: [
        {
          itemName: 'Desktop Computers',
          description: 'High-performance workstations',
          quantity: '10',
          make: 'Dell',
          uom: 'Nos',
          stockInHand: '2',
          approxValue: '45000',
          purpose: 'Teaching'
        }
      ],
      deliveryLogs: [
        {
          date: '2024-01-15',
          quantity: 10,
          remarks: 'Complete delivery'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_received':
        return 'bg-green-100 text-green-800';
      case 'partially_received':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_received':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fully_received':
        return 'Fully Received';
      case 'partially_received':
        return 'Partially Received';
      case 'not_received':
        return 'Not Received';
      default:
        return status;
    }
  };

  const handleLogDelivery = () => {
    if (!formData.quantity || formData.quantity <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid quantity',
        variant: 'destructive'
      });
      return;
    }

    if (selectedIndent) {
      const newQuantity = selectedIndent.quantityDelivered + formData.quantity;
      const newStatus =
        newQuantity >= selectedIndent.quantityRequested
          ? 'fully_received'
          : 'partially_received';

      toast({
        title: 'Delivery Logged',
        description: `Delivery successfully logged. Status updated to ${getStatusText(
          newStatus
        )}`
      });

      setIsModalOpen(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        quantity: 0,
        remarks: ''
      });
    }
  };

  const handleStatusChange = (indent: IndentDelivery, newStatus: string) => {
    setSelectedIndent({ ...indent, status: newStatus as IndentDelivery['status'] });
    toast({
      title: 'Status Updated',
      description: `Status updated to ${getStatusText(newStatus)}`
    });
  };

  const filteredIndents = indents.filter((indent) => {
    const matchesSearch =
      indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Delivery Tracking"
        subtitle="Track delivery status of approved indents"
      />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Delivery Status</CardTitle>
            <CardDescription>
              Track and manage deliveries for approved indents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search indents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_received">Not Received</SelectItem>
                  <SelectItem value="partially_received">Partially Received</SelectItem>
                  <SelectItem value="fully_received">Fully Received</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndents.map((indent) => (
                    <TableRow key={indent.id}>
                      <TableCell className="font-medium">{indent.id}</TableCell>
                      <TableCell>{indent.title}</TableCell>
                      <TableCell>{indent.department}</TableCell>
                      <TableCell>{indent.itemName}</TableCell>
                      <TableCell>{indent.quantityRequested}</TableCell>
                      <TableCell>{indent.quantityDelivered}</TableCell>
                      <TableCell>
                        <Select
                          value={indent.status}
                          onValueChange={(value) =>
                            handleStatusChange(indent, value)
                          }
                          disabled={indent.status === 'fully_received'}
                        >
                          <SelectTrigger
                            className={`${getStatusColor(indent.status)} rounded-md`}
                          >
                            <SelectValue>
                              {getStatusText(indent.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_received">Not Received</SelectItem>
                            <SelectItem value="partially_received">
                              Partially Received
                            </SelectItem>
                            <SelectItem value="fully_received">Fully Received</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIndent(indent);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>

                          {/* Full Screen Log Delivery */}
                          {indent.status !== 'fully_received' && (
                            <Dialog
                              open={isModalOpen && selectedIndent?.id === indent.id}
                              onOpenChange={(open) => {
                                setIsModalOpen(open);
                                if (!open) setSelectedIndent(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedIndent(indent);
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Log Delivery
                                </Button>
                              </DialogTrigger>

                              {/* FULL-SCREEN MODAL */}
                              <DialogContent className="w-full h-screen max-w-none p-0 bg-gray-50 flex flex-col">
                                {/* HEADER */}
                                <div className="flex items-center justify-between px-10 py-5 bg-white border-b shadow-sm">
                                  <DialogTitle className="text-2xl font-semibold text-gray-800">
                                    Log Delivery – {indent.title}
                                  </DialogTitle>
                                </div>

                                {/* BODY */}
                                <div className="flex-1 overflow-y-auto px-10 py-8 flex justify-center">
                                  <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-sm border space-y-6">
                                    <div className="space-y-2">
                                      <Label className="font-medium text-gray-700">Delivery Date</Label>
                                      <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                          setFormData({ ...formData, date: e.target.value })
                                        }
                                        className="h-12 rounded-lg"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="font-medium text-gray-700">Quantity Delivered</Label>
                                      <Input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            quantity: parseInt(e.target.value)
                                          })
                                        }
                                        placeholder="Enter quantity"
                                        className="h-12 rounded-lg"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="font-medium text-gray-700">Remarks</Label>
                                      <Textarea
                                        value={formData.remarks}
                                        onChange={(e) =>
                                          setFormData({ ...formData, remarks: e.target.value })
                                        }
                                        rows={5}
                                        placeholder="Enter any remarks about the delivery"
                                        className="rounded-lg"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* FOOTER */}
                                <div className="flex justify-end gap-4 px-10 py-5 bg-white border-t shadow-inner">
                                  <Button
                                    variant="outline"
                                    className="h-11 px-6 rounded-lg"
                                    onClick={() => setIsModalOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="h-11 px-8 rounded-lg bg-dpu-red text-white hover:bg-dpu-red-dark shadow-md hover:shadow-lg transition-all duration-200"
                                    onClick={handleLogDelivery}
                                  >
                                    Log Delivery
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                          )}

                          {/* Full Screen View History */}
                          <Dialog
                            open={showHistoryModal && selectedIndent?.id === indent.id}
                            onOpenChange={(open) => {
                              setShowHistoryModal(open);
                              if (!open) setSelectedIndent(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedIndent(indent);
                                }}
                              >
                                <History className="h-4 w-4 mr-2" />
                                View History
                              </Button>
                            </DialogTrigger>

                            {/* FULL-SCREEN MODAL */}
                            <DialogContent className="w-full h-screen max-w-none p-0 bg-gray-50 flex flex-col">
                              {/* HEADER */}
                              <div className="flex items-center justify-between px-10 py-5 bg-white border-b shadow-sm">
                                <DialogTitle className="text-2xl font-semibold text-gray-800">
                                  Delivery History – {indent.title}
                                </DialogTitle>
                              </div>

                              {/* BODY */}
                              <div className="flex-1 overflow-y-auto px-10 py-8 flex justify-center">
                                <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-sm border space-y-6">
                                  <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                      <h3 className="font-semibold text-lg">{indent.title}</h3>
                                      <p className="text-sm text-gray-500">{indent.department}</p>
                                    </div>
                                    <Badge className={getStatusColor(indent.status)}>
                                      {getStatusText(indent.status)}
                                    </Badge>
                                  </div>

                                  <div className="space-y-4">
                                    {indent.deliveryLogs.map((log, index) => (
                                      <div
                                        key={index}
                                        className="border rounded-lg p-4 bg-gray-50"
                                      >
                                        <div className="flex justify-between mb-2">
                                          <span className="font-medium">{log.date}</span>
                                          <span className="text-sm text-gray-500">
                                            Quantity: {log.quantity}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{log.remarks}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* FOOTER */}
                              <div className="flex justify-end px-10 py-5 bg-white border-t shadow-inner">
                                <Button
                                  variant="outline"
                                  className="h-11 px-6 rounded-lg"
                                  onClick={() => setShowHistoryModal(false)}
                                >
                                  Close
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Indent Details Modal */}
            <IndentDetailsModal
              isOpen={showDetailsModal}
              onClose={() => setShowDetailsModal(false)}
              indent={selectedIndent}
              userRole="store"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreTrack;
