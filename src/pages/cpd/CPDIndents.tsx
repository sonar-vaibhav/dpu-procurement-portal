import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import IndentReportModal from '@/components/modals/IndentReportModal';

const CPDIndents: React.FC = () => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [isIndentModalOpen, setIsIndentModalOpen] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedPOIndent, setSelectedPOIndent] = useState(null);
  const [isIndentReportOpen, setIsIndentReportOpen] = useState(false);
  const [selectedIndentForReport, setSelectedIndentForReport] = useState(null);

  const indents = [
    {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      category: 'Laboratory',
      requester: 'Dr. John Smith - Computer Science',
      department: 'Computer Science',
      status: 'not_forwarded',
      priority: 'high',
      amount: '₹2,50,000',
      dateReceived: '2024-01-15',
      assignedTo: null,
      budgetHead: 'Equipment Purchase',
      justification: 'Required for advanced research in computer vision and image processing.',
      requestedBy: 'Dr. John Smith',
      items: [
        {
          itemName: 'Digital Microscope',
          description: 'High-resolution digital microscope for research',
          quantity: '2',
          make: 'Olympus',
          uom: 'Pieces',
          stockInHand: '0',
          approxValue: '125000',
          purpose: 'Research'
        }
      ]
    },
    {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      category: 'IT Equipment',
      requester: 'Prof. Sarah Johnson - Electronics',
      department: 'Electronics',
      status: 'assigned',
      priority: 'medium',
      amount: '₹1,80,000',
      dateReceived: '2024-01-14',
      assignedTo: 'Rajesh Kumar',
      budgetHead: 'Lab Infrastructure',
      justification: 'Upgrading computer lab with latest hardware for student projects.',
      requestedBy: 'Prof. Sarah Johnson',
      items: [
        {
          itemName: 'Desktop Computers',
          description: 'High-performance desktop computers',
          quantity: '10',
          make: 'Dell',
          uom: 'Pieces',
          stockInHand: '2',
          approxValue: '180000',
          purpose: 'Teaching'
        }
      ]
    },
    {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      category: 'Stationery',
      requester: 'Admin Office',
      department: 'Administration',
      status: 'in_progress',
      priority: 'low',
      amount: '₹25,000',
      dateReceived: '2024-01-13',
      assignedTo: 'Amit Patel',
      budgetHead: 'Office Supplies',
      justification: 'Monthly office stationery requirements for all departments.',
      requestedBy: 'Admin Office',
      items: [
        {
          itemName: 'Office Supplies',
          description: 'Various office stationery items',
          quantity: '1',
          make: 'Multiple',
          uom: 'Lot',
          stockInHand: '0',
          approxValue: '25000',
          purpose: 'Administrative'
        }
      ]
    },
    {
      id: 'IND004',
      title: 'Chemical Reagents for Research',
      category: 'Laboratory',
      requester: 'Dr. Priya Patel - Chemistry',
      department: 'Chemistry',
      status: 'completed',
      priority: 'medium',
      amount: '₹75,000',
      dateReceived: '2024-01-10',
      assignedTo: 'Priya Sharma',
      budgetHead: 'Research Materials',
      justification: 'Essential chemicals for ongoing research projects.',
      requestedBy: 'Dr. Priya Patel',
      items: [
        {
          itemName: 'Chemical Reagents',
          description: 'Various research grade chemicals',
          quantity: '1',
          make: 'Multiple',
          uom: 'Lot',
          stockInHand: '0',
          approxValue: '75000',
          purpose: 'Research'
        }
      ]
    },
    {
      id: 'IND005',
      title: 'Projector for Seminar Hall',
      category: 'IT Equipment',
      requester: 'Prof. Anil Mehra - Electronics',
      department: 'Electronics',
      status: 'pending_indent_assignment',
      priority: 'medium',
      amount: '₹90,000',
      dateReceived: '2024-01-16',
      assignedTo: null,
      budgetHead: 'Seminar Equipment',
      justification: 'Required for guest lectures and seminars.',
      requestedBy: 'Prof. Anil Mehra',
      items: [
        {
          itemName: 'Projector',
          description: 'Full HD projector for large hall',
          quantity: '1',
          make: 'Epson',
          uom: 'Piece',
          stockInHand: '0',
          approxValue: '90000',
          purpose: 'Seminars'
        }
      ]
    }
  ];

  const purchaseOfficers = [
    'Rajesh Kumar',
    'Priya Sharma', 
    'Amit Patel',
    'Sunita Verma',
    'Karan Singh'
  ];

  const handleAssignOfficer = (indentId: string, officerName: string) => {
    toast({
      title: "Indent Assigned",
      description: `Indent ${indentId} has been assigned to ${officerName}`,
    });
  };

  const handleViewDetails = (indent: any) => {
    setSelectedIndent(indent);
    setIsIndentModalOpen(true);
  };

  const handleAcceptIndent = (indentId: string) => {
    toast({
      title: "Indent Forwarded",
      description: `Indent ${indentId} has been forwarded to management.`,
    });
  };

  const handleViewPO = (indent: any) => {
    setSelectedPOIndent(indent);
    setShowPOModal(true);
  };

  const handleForwardIndent = (indentId: string) => {
    toast({
      title: "Indent Forwarded for Final Approval",
      description: `Indent ${indentId} has been forwarded for final approval.`,
    });
  };

  const filteredIndents = indents.filter(indent => {
    const matchesCategory = filterCategory === 'all' || indent.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || indent.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      indent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.requester.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending_indent_assignment': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'high': 'border-red-200 text-red-600',
      'medium': 'border-yellow-200 text-yellow-600',
      'low': 'border-green-200 text-green-600'
    };
    
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="All Indents"
        subtitle="Manage and assign indents to purchase officers"
      />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Indent Management</CardTitle>
            <CardDescription>View, filter, and assign indents to purchase officers</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search indents by title, ID, or requester..."
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
                  <SelectItem value="pending_indent_assignment">Pending Indent Assignment</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Indents Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Requester</TableHead>
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
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{indent.requester.split(' - ')[0]}</div>
                          <div className="text-xs text-gray-500">{indent.department}</div>
                        </div>
                      </TableCell>
                      <TableCell className='text-xs'>
                        {indent.status === 'pending_indent_assignment' ? (
                          <span className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-[10px] font-semibold uppercase tracking-wide">Pending Indent Assignment</span>
                        ) : (
                          <span className="text-[11px]">{getStatusBadge(indent.status)}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{indent.amount}</TableCell>
                      <TableCell>
                        {indent.assignedTo ? (
                          <div className="text-sm font-medium">{indent.assignedTo}</div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {/* Workflow: Assign to officer, View, Forward to management */}
                          {indent.status === 'pending_indent_assignment' && (
                            <Select onValueChange={(value) => handleAssignOfficer(indent.id, value)}>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {purchaseOfficers.map((officer) => (
                                  <SelectItem key={officer} value={officer}>
                                    {officer}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <button
                            title="View Indent Report"
                            className="p-2 rounded hover:bg-gray-100"
                            onClick={() => {
                              setSelectedIndentForReport(indent);
                              setIsIndentReportOpen(true);
                            }}
                          >
                            {/* Simple document SVG icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-6.75A2.25 2.25 0 0 0 17.25 5.25h-10.5A2.25 2.25 0 0 0 4.5 7.5v9A2.25 2.25 0 0 0 6.75 18.75h10.5A2.25 2.25 0 0 0 19.5 16.5v-2.25M9 9.75h6m-6 3h6" />
                            </svg>
                          </button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(indent)}
                          >
                            View
                          </Button>
                          {indent.status === 'in_progress' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewPO(indent)}
                              >
                                View PO
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleForwardIndent(indent.id)}
                              >
                                Forward
                              </Button>
                            </>
                          )}
                          {indent.status === 'not_forwarded' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleAcceptIndent(indent.id)}
                            >
                              Accept
                            </Button>
                          )}
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

      {/* Indent Details Modal */}
      <IndentDetailsModal
        isOpen={isIndentModalOpen}
        onClose={() => setIsIndentModalOpen(false)}
        indent={selectedIndent}
      />

      {/* Purchase Order Modal */}
      <Dialog open={showPOModal} onOpenChange={setShowPOModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-y-auto">
            <PurchaseOrderPage />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPOModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Indent Report Modal */}
      <IndentReportModal
        isOpen={isIndentReportOpen}
        onClose={() => setIsIndentReportOpen(false)}
        indent={selectedIndentForReport}
      />
    </DashboardLayout>
  );
};

export default CPDIndents;
