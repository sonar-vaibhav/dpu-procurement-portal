import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf,
} from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/timesnewroman/v1/TimesNewRoman.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/timesnewroman/v1/TimesNewRomanBold.ttf', fontWeight: 'bold' },
  ],
});

// Metropolis font 
// Font.register({
//   family: 'Metropolis',
//   fonts: [
//     { src: '/metropolis.thin.otf', fontWeight: 'normal' },
//     { src: '/metropolis.regular.otf', fontWeight: 'bold' },
//   ],
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 8,
    marginBottom: 2,
    textAlign: 'center',
  },
  qrCode: {
    width: 60,
    height: 60,
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    border: '1px solid #000',
    marginBottom: 20,
  },
  vendorSection: {
    flex: 1,
    borderRight: '1px solid #000',
    padding: 10,
  },
  detailsSection: {
    flex: 1,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#cc0000',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 'auto',
  },
  value: {
    flex: 1,
    wordWrap: 'break-word',
  },
  introText: {
    marginBottom: 5,
    lineHeight: 1,
  },
  table: {
    border: '1px solid #000',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #000',
  },
  tableHeaderCell: {
    padding: 8,
    borderRight: '1px solid #000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 8,
    borderRight: '1px solid #000',
    textAlign: 'center',
  },
  tableCellLeft: {
    padding: 8,
    borderRight: '1px solid #000',
    textAlign: 'left',
  },
  tableCellRight: {
    padding: 8,
    borderRight: '1px solid #000',
    textAlign: 'right',
  },
  tableCellBold: {
    padding: 8,
    borderRight: '1px solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableCellBoldRight: {
    padding: 8,
    borderRight: '1px solid #000',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  amountInWords: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  termsSection: {
    border: '1px solid #000',
    padding: 15,
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#cc0000',
  },
  termsList: {
    marginBottom: 5,
  },
  termsItem: {
    marginBottom: 4,
    lineHeight: 0.8,
  },
  termsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    gap: 5,
  },
  termsGridItem: {
    width: '48%',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 5,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  signatureBox: {
    alignItems: 'center',
    width: '20%',
  },
  signatureLine: {
    borderBottom: '1px solid #000',
    width: '100%',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'center',
  },
  pageHeader: {
    flexDirection: 'column',
    padding: 10,
    borderBottom: '1px solid #ccc',
    marginBottom: 20,
    fontSize: 8,
    backgroundColor: '#f9f9f9',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  headerLabel: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  pageFooter: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 10,
    borderTop: '1px solid #ccc',
    paddingTop: 10,
    backgroundColor: '#ffffff', // Ensure footer is visible
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 48,
    color: '#ff0000',
    opacity: 0.2,
    fontWeight: 'bold',
  },
  pageContent: {
    flex: 1,
    paddingTop: 0,
  },
  secondPageContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 50, // Add bottom padding to prevent footer overlap
  },
});

// Interface for the data structure
interface WorkOrderItem {
  sr: number;
  description: string;
  make: string;
  unit: string;
  qty: number;
  rate: number;
  value: number;
}

interface WorkOrderData {
  society: string;
  institute: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  pan: string;
  gst: string;
  subject: string;
  vendor: {
    name: string;
    address: string;
    contactPerson: string;
    mobile: string;
    email: string;
    pan: string;
    gst: string;
  };
  woNo: string;
  indentNo: string;
  quotationNo: string;
  department: string;
  materialType: string;
  woDate: string;
  quotationDate: string;
  items: WorkOrderItem[];
  gstPercent: number;
  tnc: {
    gst: string;
    warranty: string;
    loading: string;
    pf: string;
    schedule: string;
    at: string;
    payment: string;
  };
}

function numberToWords(num: number) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 ? ' ' + a[num % 10] : '');
  if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return num.toString();
}

// Create the PDF Document
const PurchaseOrderPDF = ({
  data,
  showWatermark = false
}: {
  data: WorkOrderData;
  showWatermark?: boolean;
}) => {
  // Calculate totals
  const subTotal = data.items.reduce((sum, item) => sum + item.value, 0);
  const gstAmount = Math.round(subTotal * data.gstPercent / 100);
  const grandTotal = subTotal + gstAmount;

  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        {showWatermark && (
          <View style={styles.watermark}>
            <Text>NOT FINAL PO</Text>
          </View>
        )}

        <View style={styles.pageContent}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              src="/dpu_logo.png"
              style={styles.logo}
            />
            <View style={styles.headerText}>
              <Text style={styles.smallText}>{data.subject}</Text>
              <Text style={styles.title}>{data.society}</Text>
              <Text style={styles.subtitle}>{data.institute}</Text>
              <Text style={styles.smallText}>{data.address}</Text>
              <Text style={styles.smallText}>Ph. No. {data.phone} Fax: {data.fax}</Text>
              <Text style={styles.smallText}>Email-ID : {data.email}, PAN No:{data.pan}, GST No:{data.gst}</Text>
            </View>
            <View style={styles.qrCode}>
              <Text style={styles.smallText}>QR</Text>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.vendorSection}>
              <View style={styles.row}>
                <Text style={styles.label}>M/s.</Text>
                <Text style={styles.value}>{data.vendor.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.value}>{data.vendor.address}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Contact Person: </Text>
                <Text style={styles.value}>{data.vendor.contactPerson}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Mob.No.: </Text>
                <Text style={styles.value}>{data.vendor.mobile}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email: </Text>
                <Text style={styles.value}>{data.vendor.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>PAN No.: </Text>
                <Text style={styles.value}>{data.vendor.pan}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>GST No.: </Text>
                <Text style={styles.value}>{data.vendor.gst}</Text>
              </View>
            </View>
            <View style={styles.detailsSection}>
              <View style={styles.row}>
                <Text style={styles.label}>Indent No. : </Text>
                <Text style={styles.value}>{data.indentNo}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>W.O. No. : </Text>
                <Text style={styles.value}>{data.woNo}</Text>
                <Text style={styles.label}>W.O.Date : </Text>
                <Text style={styles.value}>{data.woDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Quotation No. : </Text>
                <Text style={styles.value}>{data.quotationNo}</Text>
                <Text style={styles.label}>Quotation Date : </Text>
                <Text style={styles.value}>{data.quotationDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Department : </Text>
                <Text style={styles.value}>{data.department}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Material Type : </Text>
                <Text style={styles.value}>{data.materialType}</Text>
              </View>
            </View>
          </View>

          {/* Intro Text */}
          <View style={styles.introText}>
            <Text>Sir,</Text>
            <Text>With reference to your above mentioned quotation, we are pleased to give you this order for following supplies / services subject to the terms and conditions mentioned therein.</Text>
          </View>

          {/* Items Table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>Sr. No.</Text>
              <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Description of item with specification</Text>
              <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Unit</Text>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>Qty.</Text>
              <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Rate in INR</Text>
              <Text style={[styles.tableHeaderCell, { width: '19%' }]}>Values in INR</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '8%' }]}></Text>
              <Text style={[styles.tableCellBold, { width: '40%' }]}>Work order for RO Plant Cleaning, Servicing, Supply & Installation of Spares Parts</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}></Text>
              <Text style={[styles.tableCell, { width: '8%' }]}></Text>
              <Text style={[styles.tableCell, { width: '15%' }]}></Text>
              <Text style={[styles.tableCell, { width: '19%' }]}></Text>
            </View>

            {data.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{item.sr}</Text>
                <View style={[styles.tableCellLeft, { width: '40%' }]}>
                  <Text style={{ fontWeight: 'bold' }}>{item.description}</Text>
                  <Text>Make : {item.make}</Text>
                </View>
                <Text style={[styles.tableCell, { width: '10%' }]}>{item.unit}</Text>
                <Text style={[styles.tableCell, { width: '8%' }]}>{item.qty}</Text>
                <Text style={[styles.tableCellRight, { width: '15%' }]}>{item.rate.toLocaleString()}</Text>
                <Text style={[styles.tableCellRight, { width: '19%' }]}>{item.value.toLocaleString()}</Text>
              </View>
            ))}

            <View style={styles.tableRow}>
              <Text style={[styles.tableCellBoldRight, { width: '81%' }]}>Total</Text>
              <Text style={[styles.tableCellBoldRight, { width: '19%' }]}>{subTotal.toLocaleString()}.00</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellRight, { width: '81%' }]}>Add: Gst @ {data.gstPercent}%</Text>
              <Text style={[styles.tableCellRight, { width: '19%' }]}>{gstAmount.toLocaleString()}.00</Text>
            </View>
            <View style={styles.tableRow}>
              {/* Amount in Words */}
              <Text style={[{ paddingLeft: '5px', paddingTop: '5px' }, styles.amountInWords]}>
                (INR in Words : {numberToWords(grandTotal)} only)
              </Text>
              <Text style={[styles.tableCellBoldRight, { width: '81%' }]}>Grand Total</Text>
              <Text style={[styles.tableCellBoldRight, { width: '19%' }]}>{grandTotal.toLocaleString()}.00</Text>
            </View>
          </View>


        </View>

        {/* Page Footer */}
        <Text style={styles.pageFooter} fixed render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />


        {showWatermark && (
          <View style={styles.watermark}>
            <Text>NOT FINAL PO</Text>
          </View>
        )}



        {/* Terms and Conditions */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsItem, { fontWeight: 'bold' }]}>TERMS & CONDITIONS</Text>

          <View style={styles.termsList}>
            <Text style={styles.termsItem}>1. The amount value is rounded at nearest amount.</Text>
            <Text style={styles.termsItem}>2. Please see overleaf for standard Terms and Conditions.</Text>
            <Text style={styles.termsItem}>3. The rates mentioned in the Purchase/Work Order shall be firm for all supplies including the extension of time, any granted and will not be subject to any fluctuation due to increasing in the cost of materials, labour, taxes, octroi, or any other new taxes, levies, etc.</Text>
            <Text style={styles.termsItem}>4. You shall execute the work as per instructions given by the College Authority.</Text>


            {/* Page Header for subsequent pages */}
            <View
              style={styles.pageHeader}>
              <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>M/s. {data.vendor.name}</Text>
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>W.O. No. : {data.woNo}</Text>
                <Text style={styles.headerLabel}>Date : {data.woDate}</Text>
                <Text style={styles.headerLabel}>Grand Total: ₹{grandTotal.toLocaleString()}</Text>
              </View>
              <View style={styles.headerRow}>
                <Text style={styles.headerLabel}>(INR in Words : {numberToWords(grandTotal)} only)</Text>
              </View>
            </View>

            <Text style={styles.termsItem}>5. You will be fully responsible for the safety of the workforce employed by you at the above site and we shall not entertain any claim from you or your workers towards compensation for injury or damages while working at the above site.</Text>
            <Text style={styles.termsItem}>6. You shall be under strict obligation and duty to obey all the Laws of the land, especially pertaining to the minimum wages, gratuity, provident fund, ESIC, labour laws, or any other requirements of the workers and such rules/ regulations, etc., as prohibitory laws e.g. minor child below 18 years restrained or women labour should not be permitted to work at night on the work, etc., licensing authorities rules and regulations, as per the provisions of legislations prevailing and applicable from time to time must be followed strictly and properly, without default.</Text>
            <Text style={styles.termsItem}>7. The actual quantity of work shall be measured by our College Authority in the presence of your representative.</Text>
            <Text style={styles.termsItem}>8. Material supplied by you shall be checked & validated by our Store Dept. Or Site Engg.</Text>
            <Text style={styles.termsItem}>9. You shall coordinate with our Maintenance department Mr. Narendra Wagmale Mobile No. 9552526650 at the time of material delivery & execution of work.</Text>
          </View>

          <View
            style={{
              width:'100%',
              borderBottom: '1px solid #000',
              marginTop:'1px', // optional spacing above and below
              marginBottom:'3px', // optional spacing above and below
            }}
          />

          <View style={styles.termsGrid}>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>GST : </Text>
              <Text style={styles.value}>{data.tnc.gst}</Text>
            </View>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>Warranty : </Text>
              <Text style={styles.value}>{data.tnc.warranty}</Text>
            </View>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>Loading & Unloading : </Text>
              <Text style={styles.value}>{data.tnc.loading}</Text>
            </View>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>P & F /Transportation : </Text>
              <Text style={styles.value}>{data.tnc.pf}</Text>
            </View>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>Work/ Service Schedule : </Text>
              <Text style={styles.value}>{data.tnc.schedule}</Text>
            </View>
            <View style={styles.termsGridItem}>
              <Text style={styles.label}>Work/ Service At : </Text>
              <Text style={styles.value}>{data.tnc.at}</Text>
            </View>
          </View>

          <View
            style={{
              width:'100%',
              borderBottom: '1px solid #000',
              marginTop:'2px', // optional spacing above and below
              marginBottom:'2px', // optional spacing above and below
            }}
          />

          <Text style={[styles.termsItem, {marginBottom:'-2px'}]}>
            <Text style={styles.label}>Payment Terms : </Text>
            <Text style={styles.value}>{data.tnc.payment}</Text>
          </Text>

          <View
            style={{
              width:'100%',
              borderBottom: '1px solid #000',
              marginTop:'2px', // optional spacing above and below
              marginBottom:'2px', // optional spacing above and below
            }}
          />
          {/* Signature Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
            {/* Left - Prepared By */}
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.signatureText}>Suraj Wangane</Text>
              <Text style={styles.signatureText}>Prepared By</Text>
            </View>

            {/* Center - Checked By */}
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.signatureText}>Kailas Tupsundar</Text>
              <Text style={styles.signatureText}>Checked By</Text>
            </View>

            {/* Right - For DPU */}
            <View style={{ alignItems: 'center', marginTop: '-25px' }}>
              <Text style={[styles.signatureText, { fontWeight: 'bold' }]}>
                For DR. D. Y. PATIL UNITECH SOCIETY, PUNE
              </Text>
              <Text style={[styles.signatureText, { marginBottom: '25px' }]}>Dr. D. Y. Patil Institute of Technology</Text>

              <Text style={[styles.signatureText]}>Secretary/ Vice-Chairman/ Chairman</Text>
            </View>
          </View>

        </View>








        {/* Page Footer */}
        <Text style={styles.pageFooter} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>
    </Document>
  );
};

// Utility functions for PDF generation
export const generatePDFBlob = async (data: WorkOrderData, showWatermark: boolean = false): Promise<Blob> => {
  const pdfDoc = <PurchaseOrderPDF data={data} showWatermark={showWatermark} />;
  const blob = await pdf(pdfDoc).toBlob();
  return blob;
};

export const downloadPDF = async (data: WorkOrderData, filename: string = 'WorkOrder.pdf', showWatermark: boolean = false) => {
  const blob = await generatePDFBlob(data, showWatermark);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const openPDFInNewTab = async (data: WorkOrderData, showWatermark: boolean = false) => {
  const blob = await generatePDFBlob(data, showWatermark);
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.focus();
  }
  // Clean up the URL after a delay to ensure it's loaded
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

export default PurchaseOrderPDF; 