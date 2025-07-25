import React, { useRef } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface IndentReportProps {
  indentData?: any;
}

const defaultIndentData = {
  institute: 'Dr. D. Y. Patil Institute of Technology',
  department: 'Computer Science',
  materialType: 'Equipment',
  contactNo: '+91 9876543210',
  categoryCode: 'EQP-2024',
  indentNo: 'IND-001',
  date: '2024-06-20',
  items: [
    { sr: 1, itemName: 'Projector', description: 'Full HD, 4000 lumens', make: 'Epson', qty: 2, uom: 'Nos', stock: 0, similar: '-', value: '₹45,000' },
    { sr: 2, itemName: 'Screen', description: '120 inch motorized', make: 'Elite', qty: 1, uom: 'Nos', stock: 0, similar: '-', value: '₹12,000' },
  ],
  timeline: 'Within 2 weeks',
  urgentReason: '',
  budgetProvision: 'Yes',
  budgetHead: 'AV Equipment',
};

const IndentReport: React.FC<IndentReportProps> = ({ indentData }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const data = indentData || defaultIndentData;

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const opt = {
      margin: [5, 5, 5, 5],
      filename: 'IndentReport.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Download Button */}
      <button
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 print:hidden"
        onClick={handleDownloadPDF}
      >
        Download Indent as PDF
      </button>

      {/* Printable Report */}
      <div
        ref={printRef}
        className="w-[280mm] bg-white text-black text-[14px] font-sans print:w-full p-8 border border-gray-400"
      >
        {/* Header Section */}
        <div className="flex items-center mb-4">
          <img
            src="/dpu_logo.png"
            alt="DPU Logo"
            className="h-12 mr-4"
            style={{ objectFit: 'contain' }}
          />
          <div className="flex-1 text-center">
            <div className="font-bold text-xl">Dr. D. Y. Patil Unitech Society, Pune</div>
            <div className="font-semibold text-lg">Central Purchase Department</div>
            <div className="text-xs text-gray-700">Pimpri, Pune - 411 018.</div>
            <div className="font-bold text-lg mt-1">Purchase Indent</div>
            <div className="text-xs text-gray-700">(Internal office use only - not a valid order)</div>
          </div>
        </div>

        {/* Institute & Department Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div>
              Name of the Institute: <span className="font-semibold">{data.institute}</span>
            </div>
            <div>
              Dept. / Lab.: <span className="font-semibold">{data.department}</span>
            </div>
            <div>
              Material Type: <span className="font-semibold">{data.materialType}</span>
            </div>
          </div>
          <div>
            <div>
              Contact No.: <span className="font-semibold">{data.contactNo}</span>
            </div>
            <div>
              Category Code: <span className="font-semibold">{data.categoryCode}</span>
            </div>
            <div>
              Institute Indent No.: <span className="font-semibold">{data.indentNo}</span> &nbsp; Date:{' '}
              <span className="font-semibold">{data.date}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border border-black text-[13px] mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-2">Sr. No.</th>
              <th className="border border-black px-2 py-2">Item Name</th>
              <th className="border border-black px-2 py-2">Description / Specification</th>
              <th className="border border-black px-2 py-2">Make</th>
              <th className="border border-black px-2 py-2">Quantity</th>
              <th className="border border-black px-2 py-2">UOM</th>
              <th className="border border-black px-2 py-2">Stock in Hand</th>
              <th className="border border-black px-2 py-2">Similar Item Purchased</th>
              <th className="border border-black px-2 py-2">Approx. Value</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={item.sr} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-black px-2 py-2 text-center">{item.sr}</td>
                <td className="border border-black px-2 py-2">{item.itemName}</td>
                <td className="border border-black px-2 py-2">{item.description}</td>
                <td className="border border-black px-2 py-2 text-center">{item.make}</td>
                <td className="border border-black px-2 py-2 text-center">{item.qty}</td>
                <td className="border border-black px-2 py-2 text-center">{item.uom}</td>
                <td className="border border-black px-2 py-2 text-center">{item.stock}</td>
                <td className="border border-black px-2 py-2">{item.similar}</td>
                <td className="border border-black px-2 py-2 text-right">{item.value}</td>
              </tr>
            ))}
            {/* Add empty rows to keep fixed height */}
            {Array.from({ length: 5 - data.items.length }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                {Array.from({ length: 9 }).map((__, i) => (
                  <td key={i} className="border border-black px-2 py-2">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Timeline & Budget Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            Timeline for delivery: <span className="font-semibold">{data.timeline}</span>
          </div>
          <div>
            Reason for item: <span className="font-semibold">{data.urgentReason || '-'}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            Budget Provision: <span className="font-semibold">{data.budgetProvision}</span>
          </div>
          <div>
            Budget Head: <span className="font-semibold">{data.budgetHead}</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-6 gap-2 text-[12px] text-center mt-6 mb-6">
          <div>Prepared By</div>
          <div>Head of Dept</div>
          <div>Store Dept</div>
          <div>Accounts Dept</div>
          <div>OS / Registrar</div>
          <div>Director / Principal</div>
        </div>

        {/* Approval */}
        <div className="flex justify-end text-right text-[14px] mt-8">
          <div>
            <div className="font-bold">APPROVED / NOT APPROVED</div>
            <div style={{ height: '32px' }}></div>
            <div className="font-bold">TRUSTEE / SECRETARY / VICE CHAIRMAN / CHAIRMAN</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndentReport;
