import React, { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageHeader from '@/components/common/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import PurchaseOrderPage from '@/components/PurchaseOrder';
import IndentDetailsModal from '@/components/modals/IndentDetailsModal';
import { Badge } from '@/components/ui/badge';

const finalizedPOs = [
  {
    poId: 'PO001',
    vendorName: 'Tech Solutions Corp',
    indentTitle: 'Computer Lab Hardware',
    indentDepartment: 'Electronics',
    acceptedDate: '2024-02-10',
    poData: {},
    indent: {
      id: 'IND002',
      title: 'Computer Lab Hardware',
      status: 'approved',
      date: '2024-01-14',
      amount: '₹1,80,000',
      department: 'Electronics',
      budgetHead: 'Lab Infrastructure',
      priority: 'medium',
      justification:
        'Upgrading computer lab with latest hardware for student projects.',
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
    }
  },
  {
    poId: 'PO002',
    vendorName: 'Scientific Equipment Ltd',
    indentTitle: 'Laboratory Equipment - Microscopes',
    indentDepartment: 'Computer Science',
    acceptedDate: '2024-02-08',
    poData: {},
    indent: {
      id: 'IND001',
      title: 'Laboratory Equipment - Microscopes',
      status: 'approved',
      date: '2024-01-15',
      amount: '₹2,50,000',
      department: 'Computer Science',
      budgetHead: 'Equipment Purchase',
      priority: 'high',
      justification:
        'Required for advanced research in computer vision and image processing.',
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
    }
  },
  {
    poId: 'PO003',
    vendorName: 'Office Supplies Pro',
    indentTitle: 'Office Stationery Bulk Order',
    indentDepartment: 'Administration',
    acceptedDate: '2024-02-05',
    poData: {},
    indent: {
      id: 'IND003',
      title: 'Office Stationery Bulk Order',
      status: 'approved',
      date: '2024-01-13',
      amount: '₹25,000',
      department: 'Administration',
      budgetHead: 'Office Supplies',
      priority: 'low',
      justification:
        'Monthly office stationery requirements for all departments.',
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
    }
  }
];

const CPDFinalizedVendors: React.FC = () => {
  const [openPO, setOpenPO] = useState<string | null>(null);
  const [openIndent, setOpenIndent] = useState<string | null>(null);
  const [selectedIndent, setSelectedIndent] = useState<any>(null);

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      high: 'border-red-200 text-red-600',
      medium: 'border-yellow-200 text-yellow-600',
      low: 'border-green-200 text-green-600'
    };
    return (
      <Badge
        variant="outline"
        className={styles[priority] || 'border-gray-200 text-gray-600'}
      >
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Finalized Vendors"
        subtitle="View all vendors who have accepted Purchase Orders and their related indents"
      />
      <div className="p-6">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-dpu-red to-dpu-red-dark rounded-t-lg p-6">
            <CardTitle className="text-white text-lg">
              Accepted Purchase Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent Details</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accepted Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalizedPOs.map((po, idx) => (
                    <TableRow
                      key={po.poId}
                      className={
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{po.indentTitle}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {po.indent.id} • {po.indent.date}
                            {getPriorityBadge(po.indent.priority)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {po.vendorName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{po.indentDepartment}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Accepted by Vendor
                        </Badge>
                      </TableCell>
                      <TableCell>{po.acceptedDate}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {/* View PO Modal */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenPO(po.poId)}
                        >
                          View PO
                        </Button>
                        <Dialog
                          open={openPO === po.poId}
                          onOpenChange={(v) => !v && setOpenPO(null)}
                        >
                          <DialogContent className="w-screen h-screen max-w-none max-h-none rounded-none shadow-none p-6 overflow-y-auto bg-gray-50">
                            <DialogHeader className="mb-4">
                              <DialogTitle className="text-2xl font-bold">
                                Purchase Order - {po.poId}
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Preview of the finalized Purchase Order
                              </DialogDescription>
                            </DialogHeader>

                            <div className="pb-6">
                              <PurchaseOrderPage />
                            </div>

                            <div className="mt-6 flex justify-end">
                              <Button variant="outline" onClick={() => setOpenPO(null)}>
                                Close
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {/* View Indent Modal */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedIndent(po.indent);
                            setOpenIndent(po.poId);
                          }}
                        >
                          View Indent
                        </Button>
                        <IndentDetailsModal
                          isOpen={openIndent === po.poId}
                          onClose={() => setOpenIndent(null)}
                          indent={selectedIndent}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {finalizedPOs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No finalized vendors found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CPDFinalizedVendors;
