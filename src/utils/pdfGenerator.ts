
import jsPDF from 'jspdf';

interface IndentDetails {
  id: string;
  title: string;
  department: string;
  quantity: string;
  specifications: string;
  requestedBy: string;
  requestDate: string;
  requiredBy: string;
}

interface VendorQuote {
  vendorId: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specifications: string;
  originalPrice: number;
  discountedPrice: number;
  deliveryTime: string;
  warranty: string;
  termsAndConditions: string;
  paymentTerms: string;
  rating: number;
  submittedDate: string;
  validUntil: string;
}

const addDPUHeader = (doc: jsPDF) => {
  // DPU Logo with red color
  doc.setFillColor(204, 0, 0); // DPU red color
  doc.circle(30, 25, 8, 'F');
  
  // DPU text in logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DPU', 30, 28, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // University name and details
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DR. D. Y. PATIL UNIVERSITY', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('(Deemed to be University)', 105, 28, { align: 'center' });
  doc.text('Sector 7, Nerul, Navi Mumbai - 400706', 105, 36, { align: 'center' });
  doc.text('Phone: +91-22-27821234 | Email: procurement@dpu.edu.in', 105, 44, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(204, 0, 0);
  doc.setLineWidth(1);
  doc.line(20, 52, 190, 52);
  
  return 60; // Return Y position for next content
};

const addSignatureSection = (doc: jsPDF, startY: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const signatureY = Math.max(startY + 40, pageHeight - 60);
  
  // Add page break if needed
  if (signatureY > pageHeight - 60) {
    doc.addPage();
    return addSignatureSection(doc, 40);
  }
  
  // Signature section
  doc.setDrawColor(204, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, signatureY - 5, 190, signatureY - 5);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('AUTHORIZED SIGNATURES', 105, signatureY + 5, { align: 'center' });
  
  const signY = signatureY + 20;
  
  // Three signature boxes
  const boxWidth = 50;
  const boxHeight = 25;
  const spacing = 15;
  const startX = 30;
  
  // Purchase Officer
  doc.rect(startX, signY, boxWidth, boxHeight);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Purchase Officer', startX + boxWidth/2, signY + boxHeight + 8, { align: 'center' });
  doc.text('Name: _______________', startX + boxWidth/2, signY + boxHeight + 16, { align: 'center' });
  doc.text('Date: _______________', startX + boxWidth/2, signY + boxHeight + 24, { align: 'center' });
  
  // HOD Approval
  const secondX = startX + boxWidth + spacing;
  doc.rect(secondX, signY, boxWidth, boxHeight);
  doc.text('HOD Approval', secondX + boxWidth/2, signY + boxHeight + 8, { align: 'center' });
  doc.text('Name: _______________', secondX + boxWidth/2, signY + boxHeight + 16, { align: 'center' });
  doc.text('Date: _______________', secondX + boxWidth/2, signY + boxHeight + 24, { align: 'center' });
  
  // Registrar Approval
  const thirdX = secondX + boxWidth + spacing;
  doc.rect(thirdX, signY, boxWidth, boxHeight);
  doc.text('Registrar Approval', thirdX + boxWidth/2, signY + boxHeight + 8, { align: 'center' });
  doc.text('Name: _______________', thirdX + boxWidth/2, signY + boxHeight + 16, { align: 'center' });
  doc.text('Date: _______________', thirdX + boxWidth/2, signY + boxHeight + 24, { align: 'center' });
  
  return signY + boxHeight + 32;
};

export const generateEnquiryPDF = (indentDetails: IndentDetails, selectedVendors: string[]) => {
  const doc = new jsPDF();
  
  // Add DPU header
  let yPos = addDPUHeader(doc);
  
  // Document title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(204, 0, 0);
  doc.text('VENDOR ENQUIRY FOR QUOTATION', 105, yPos + 10, { align: 'center' });
  
  // Reset color and add reference and date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-IN');
  const refNumber = `DPU/ENQ/${indentDetails.id}/${new Date().getFullYear()}`;
  
  yPos += 25;
  doc.text(`Reference No: ${refNumber}`, 20, yPos);
  doc.text(`Date: ${currentDate}`, 150, yPos);
  
  // Indent details section
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('INDENT DETAILS', 20, yPos);
  
  // Details table
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const details = [
    ['Indent ID:', indentDetails.id],
    ['Title:', indentDetails.title],
    ['Department:', indentDetails.department],
    ['Quantity Required:', indentDetails.quantity],
    ['Requested By:', indentDetails.requestedBy],
    ['Request Date:', indentDetails.requestDate],
    ['Required By:', indentDetails.requiredBy]
  ];
  
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPos);
    yPos += 8;
  });
  
  // Specifications section
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('TECHNICAL SPECIFICATIONS', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const specLines = doc.splitTextToSize(indentDetails.specifications, 170);
  specLines.forEach((line: string) => {
    doc.text(line, 25, yPos);
    yPos += 6;
  });
  
  // Quotation requirements
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('QUOTATION REQUIREMENTS', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const requirements = [
    '• Please provide detailed technical specifications matching our requirements',
    '• Include comprehensive warranty terms and after-sales service details',
    '• Mention complete delivery timeline including installation period',
    '• Provide your best competitive price including all taxes and duties',
    '• Clearly state payment terms and conditions',
    '• Quote validity period (minimum 30 days)',
    '• Installation, training, and commissioning charges (if applicable)',
    '• Compliance certificates and quality assurance documents'
  ];
  
  requirements.forEach(req => {
    doc.text(req, 25, yPos);
    yPos += 7;
  });
  
  // Important notes
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(204, 0, 0);
  doc.text('IMPORTANT NOTES:', 20, yPos);
  
  yPos += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• All quotations must be submitted within 7 working days from the date of this enquiry', 25, yPos);
  yPos += 6;
  doc.text('• The University reserves the right to accept or reject any quotation without assigning reasons', 25, yPos);
  yPos += 6;
  doc.text('• Please ensure compliance with all university procurement policies and procedures', 25, yPos);
  
  // Add signature section
  addSignatureSection(doc, yPos + 20);
  
  // Save the PDF
  doc.save(`DPU_Enquiry_${indentDetails.id}_${currentDate.replace(/\//g, '-')}.pdf`);
};

export const generatePurchaseOrderPDF = (indentDetails: IndentDetails, selectedVendor: VendorQuote) => {
  const doc = new jsPDF();
  
  // Add DPU header
  let yPos = addDPUHeader(doc);
  
  // Document title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(204, 0, 0);
  doc.text('PURCHASE ORDER', 105, yPos + 10, { align: 'center' });
  
  // PO details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-IN');
  const poNumber = `DPU/PO/${indentDetails.id}/${Date.now().toString().slice(-6)}`;
  
  yPos += 25;
  doc.setFont('helvetica', 'bold');
  doc.text(`PO Number: ${poNumber}`, 20, yPos);
  doc.text(`Date: ${currentDate}`, 150, yPos);
  
  // Vendor details section
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('VENDOR DETAILS', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Vendor info box
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, yPos, 80, 35);
  doc.setFont('helvetica', 'bold');
  doc.text('TO:', 25, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(selectedVendor.vendorName, 25, yPos + 16);
  doc.text(`Contact: ${selectedVendor.contactPerson}`, 25, yPos + 24);
  doc.text(`Email: ${selectedVendor.email}`, 25, yPos + 32);
  
  // Delivery address box
  doc.rect(110, yPos, 80, 35);
  doc.setFont('helvetica', 'bold');
  doc.text('DELIVER TO:', 115, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text('Dr. D. Y. Patil University', 115, yPos + 16);
  doc.text('Sector 7, Nerul', 115, yPos + 24);
  doc.text('Navi Mumbai - 400706', 115, yPos + 32);
  
  yPos += 50;
  
  // Order details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('ORDER DETAILS', 20, yPos);
  
  yPos += 15;
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, 170, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Description', 25, yPos + 7);
  doc.text('Qty', 100, yPos + 7);
  doc.text('Unit Price (₹)', 125, yPos + 7);
  doc.text('Total (₹)', 160, yPos + 7);
  
  // Table content
  yPos += 10;
  doc.rect(20, yPos, 170, 20);
  doc.setFont('helvetica', 'normal');
  const titleLines = doc.splitTextToSize(indentDetails.title, 70);
  doc.text(titleLines, 25, yPos + 8);
  doc.text(indentDetails.quantity, 100, yPos + 10);
  doc.text(selectedVendor.discountedPrice.toLocaleString(), 130, yPos + 10);
  doc.text(selectedVendor.discountedPrice.toLocaleString(), 165, yPos + 10);
  
  // Total section
  yPos += 25;
  doc.setFillColor(250, 250, 250);
  doc.rect(130, yPos, 60, 15, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text('Grand Total: ₹', 135, yPos + 10);
  doc.text(selectedVendor.discountedPrice.toLocaleString(), 175, yPos + 10);
  
  yPos += 25;
  
  // Terms and conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('TERMS & CONDITIONS', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const terms = [
    `Payment Terms: ${selectedVendor.paymentTerms}`,
    `Delivery Timeline: ${selectedVendor.deliveryTime}`,
    `Warranty Period: ${selectedVendor.warranty}`,
    'Delivery must be made during working hours (9:00 AM to 5:00 PM)',
    'All goods must be delivered in perfect condition as per specifications',
    'Installation and commissioning to be completed within delivery timeline',
    'Original invoice and delivery challan must accompany the goods',
    'Any damage during transit will be the responsibility of the vendor',
    'Payment will be processed only after satisfactory delivery and installation'
  ];
  
  terms.forEach(term => {
    const termLines = doc.splitTextToSize(`• ${term}`, 170);
    termLines.forEach((line: string) => {
      doc.text(line, 25, yPos);
      yPos += 6;
    });
  });
  
  // Technical specifications
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(204, 0, 0);
  doc.text('TECHNICAL SPECIFICATIONS', 20, yPos);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const specLines = doc.splitTextToSize(selectedVendor.specifications, 170);
  specLines.forEach((line: string) => {
    doc.text(line, 25, yPos);
    yPos += 6;
  });
  
  // Add signature section
  addSignatureSection(doc, yPos + 20);
  
  // Save the PDF
  doc.save(`DPU_PurchaseOrder_${poNumber}_${currentDate.replace(/\//g, '-')}.pdf`);
};
