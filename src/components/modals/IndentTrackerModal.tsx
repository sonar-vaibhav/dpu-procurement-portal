import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IndentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  indent: any;
}

const IndentTrackerModal: React.FC<IndentTrackerModalProps> = ({
  isOpen,
  onClose,
  indent
}) => {
  if (!indent) return null;

  const getStatusBadge = (status: string) => {
    const statusColors = {
      delivered: 'bg-green-100 text-green-800',
      in_transit: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      delayed: 'bg-red-100 text-red-800',
      partially_delivered: 'bg-orange-100 text-orange-800'
    };
    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800'
        }
      >
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getApprovalBadge = (approved: boolean) => {
    return (
      <Badge
        className={
          approved
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }
      >
        {approved ? 'APPROVED' : 'PENDING'}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-screen h-screen max-w-none max-h-none rounded-none 
        shadow-none px-3 py-3 md:px-10 md:py-8 overflow-y-auto bg-gray-50"
      >
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-gray-50 z-10 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Indent Tracking - {indent.id}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Detailed tracking information for your procurement indent
          </DialogDescription>
        </DialogHeader>

        {/* Tracking Details */}
        <div className="space-y-6 pt-4 pb-24 md:pb-10">
          {/* Basic Info */}
          <Card className="shadow rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Title:</p>
                  <p className="text-lg">{indent.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Amount:</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {indent.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tracking ID:
                  </p>
                  <p className="font-mono">{indent.trackingId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Date Finalized:
                  </p>
                  <p>{indent.dateFinalized}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Status */}
          <Card className="shadow rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Assignment & Approval Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-600">
                    Purchase Officer Assignment:
                  </p>
                  {indent.purchaseOfficer ? (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">
                        ASSIGNED
                      </Badge>
                      <span>{indent.purchaseOfficer}</span>
                    </div>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      NOT ASSIGNED
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-2 text-gray-600">
                    Management Approval:
                  </p>
                  {getApprovalBadge(indent.managementApproved !== false)}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Finalized By:
                </p>
                <p>{indent.finalizedBy}</p>
              </div>
            </CardContent>
          </Card>

          {/* Vendor & Delivery */}
          <Card className="shadow rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Vendor & Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Assigned Vendor:
                  </p>
                  <p className="text-lg">{indent.assignedVendor}</p>
                  <p className="text-sm text-gray-500">
                    {indent.vendorContact}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Delivery Status:
                  </p>
                  <div className="mt-1">{getStatusBadge(indent.deliveryStatus)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Expected Delivery:
                  </p>
                  <p>{indent.expectedDelivery}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Actual Delivery:
                  </p>
                  <p>{indent.actualDelivery || 'Pending'}</p>
                  {indent.actualDelivery && (
                    <p className="text-xs text-gray-500">
                      {new Date(indent.actualDelivery) <=
                      new Date(indent.expectedDelivery)
                        ? '✅ On Time'
                        : '⚠️ Delayed'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Department Status */}
          <Card className="shadow rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Store Department Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Received at Store:</span>
                {['delivered', 'partially_delivered'].includes(
                  indent.deliveryStatus
                ) ? (
                  <Badge className="bg-green-100 text-green-800">RECEIVED</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Quality Check:</span>
                {indent.deliveryStatus === 'delivered' ? (
                  <Badge className="bg-green-100 text-green-800">PASSED</Badge>
                ) : indent.deliveryStatus === 'partially_delivered' ? (
                  <Badge className="bg-orange-100 text-orange-800">PARTIAL</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">PENDING</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Stock Updated:</span>
                {indent.deliveryStatus === 'delivered' ? (
                  <Badge className="bg-green-100 text-green-800">UPDATED</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>
                )}
              </div>
              {indent.deliveryStatus === 'partially_delivered' && (
                <div className="mt-2 p-2 bg-orange-50 rounded border">
                  <p className="text-sm text-orange-800">
                    <strong>Note:</strong> Partially delivered; some items are
                    still pending or rejected.
                  </p>
                </div>
              )}
              {indent.deliveryStatus === 'delayed' && (
                <div className="mt-2 p-2 bg-red-50 rounded border">
                  <p className="text-sm text-red-800">
                    <strong>Delay Reason:</strong> {indent.revisedDeliveryDate
                      ? `New expected delivery: ${indent.revisedDeliveryDate}`
                      : 'Vendor delay reported'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="shadow rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Indent Finalized</p>
                  <p className="text-sm text-gray-600">
                    {indent.dateFinalized} - {indent.finalizedBy}
                  </p>
                </div>
              </div>
              {indent.purchaseOfficer && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">
                      Assigned to Purchase Officer
                    </p>
                    <p className="text-sm text-gray-600">
                      Assigned to {indent.purchaseOfficer}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ['delivered', 'in_transit', 'processing'].includes(
                      indent.deliveryStatus
                    )
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
                <div>
                  <p className="font-medium">Vendor Processing</p>
                  <p className="text-sm text-gray-600">
                    {indent.deliveryStatus === 'processing'
                      ? 'Currently processing order'
                      : ['delivered', 'in_transit'].includes(
                          indent.deliveryStatus
                        )
                      ? 'Order processed'
                      : 'Pending'}
                  </p>
                </div>
              </div>
              {indent.actualDelivery && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-gray-600">
                      {indent.actualDelivery}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-gray-50 pt-4 pb-2 flex justify-end gap-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IndentTrackerModal;
