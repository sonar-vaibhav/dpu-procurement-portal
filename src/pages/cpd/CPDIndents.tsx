import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { useToast } from '@/hooks/use-toast';

const CPDIndents: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndent, setSelectedIndent] = useState<any>(null);
  const [isIndentModalOpen, setIsIndentModalOpen] = useState(false);

  const [rejectingIndent, setRejectingIndent] = useState<any | null>(null);
  const [remark, setRemark] = useState('');
  const [indents, setIndents] = useState<any[]>([
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Laboratory',
      college: 'D Y Patil Institute of Technology',
      status: 'pending_assignment',
      priority: 'high',
      amount: '₹2,50,000',
      dateReceived: '2024-01-15',
      assignedTo: null,
      budgetHead: 'Lab Equipment',
      justification: 'Required for biology lab expansion.',
      items: [
        {
          itemName: 'Microscope',
          description: 'High resolution microscope for lab use',
          quantity: '2',
          make: 'Olympus',
          uom: 'Pieces',
          stockInHand: '0',
          approxValue: '125000',
          purpose: 'Research',
        },
      ],
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      category: 'IT Equipment',
      college: 'Techno Global College',
      status: 'assigned',
      priority: 'medium',
      amount: '₹1,80,000',
      dateReceived: '2024-01-14',
      assignedTo: 'Rajesh Kumar',
      budgetHead: 'Infrastructure',
      justification: 'Upgrade lab for modern projects.',
      items: [
        {
          itemName: 'Desktop PC',
          description: 'High-performance computer',
          quantity: '10',
          make: 'Dell',
          uom: 'Units',
          stockInHand: '1',
          approxValue: '18000',
          purpose: 'Teaching',
        },
      ],
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      category: 'Stationery',
      college: 'National College of Sciences',
      status: 'in_progress',
      priority: 'low',
      amount: '₹25,000',
      dateReceived: '2024-01-13',
      assignedTo: 'Amit Patel',
      budgetHead: 'Administrative Supplies',
      justification: 'Monthly stationery requirements.',
      items: [
        {
          itemName: 'Stationery Pack',
          description: 'Includes pens, pads, markers',
          quantity: '1',
          make: 'Various',
          uom: 'Set',
          stockInHand: '2',
          approxValue: '25000',
          purpose: 'Office Use',
        },
      ],
    },
  ]);

  const handleRejectConfirm = () => {
    if (!rejectingIndent) return;
    setIndents((prev) =>
      prev.map((indent) =>
        indent.id === rejectingIndent.id ? { ...indent, status: 'rejected' } : indent
      )
    );
    toast({ title: 'Indent rejected', description: `Remark: ${remark}` });
    setRejectingIndent(null);
    setRemark('');
  };

  const handleViewDetails = (indent: any) => {
    setSelectedIndent(indent);
    setIsIndentModalOpen(true);
  };

  const filteredIndents = indents.filter((indent) => {
    const matchesCategory = filterCategory === 'all' || indent.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || indent.status === filterStatus;
    const matchesSearch = searchTerm === ''
      || indent.title.toLowerCase().includes(searchTerm.toLowerCase())
      || indent.id.toLowerCase().includes(searchTerm.toLowerCase())
      || indent.college.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending_assignment: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      high: 'border-red-200 text-red-600',
      medium: 'border-yellow-200 text-yellow-600',
      low: 'border-green-200 text-green-600',
    };
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader title="All Indents" subtitle="Manage and assign indents to purchase officers" />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Indent Management</CardTitle>
            <CardDescription>View, filter, and assign indents to purchase officers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search indents by title, ID, or college..."
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending_assignment">Pending Assignment</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>College Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIndents.map((indent) => (
                    <TableRow key={indent.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{indent.title}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {indent.id} • {indent.dateReceived}
                            {getPriorityBadge(indent.priority)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{indent.category}</Badge>
                      </TableCell>
                      <TableCell>{indent.college}</TableCell>
                      <TableCell>{getStatusBadge(indent.status)}</TableCell>
                      <TableCell className="font-medium">{indent.amount}</TableCell>
                      <TableCell>
                        {indent.assignedTo ? indent.assignedTo : <span className="text-gray-400">Not assigned</span>}
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(indent)}>
                          View
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setRejectingIndent(indent)}>
                          Reject
                        </Button>
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

      {/* Reject Modal */}
      <Dialog open={!!rejectingIndent} onOpenChange={() => setRejectingIndent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Indent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to reject <strong>{rejectingIndent?.title}</strong>?
            </p>
            <Label htmlFor="remark">Remark for Rejection</Label>
            <Textarea
              id="remark"
              placeholder="Enter your reason for rejection"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" onClick={() => setRejectingIndent(null)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={remark.trim() === ''}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedIndent && (
        <IndentDetailsModal
          isOpen={isIndentModalOpen}
          onClose={() => setIsIndentModalOpen(false)}
          indent={selectedIndent}
          userRole="management"
        />
      )}
    </DashboardLayout>
  );
};

export default CPDIndents;
