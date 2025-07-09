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
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }, // landscape
      pagebreak: { mode: ['css', 'legacy'] },
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 print:hidden"
        onClick={handleDownloadPDF}
      >
        Download Indent as PDF
      </button>
      <div ref={printRef} className="w-[280mm] bg-white text-black text-[14px] font-sans print:w-full p-8  border border-gray-400">
        {/* Header */}
        <div className="flex items-center mb-2">
          <img src="/dpu_logo.png" alt="DYP DPU Logo" className="h-11" style={{ objectFit: 'contain' }} />
          <div className="flex-1 flex flex-col items-center">
            <div className="font-bold text-xl leading-tight text-black text-center">Dr. D. Y. Patil Unitech Society, Pune</div>
            <div className="font-semibold text-lg leading-tight text-black text-center">Central Purchase Department</div>
            <div className="text-xs text-gray-700 text-center">Pimpri, Pune - 411 018.</div>
            <div className="font-bold text-lg leading-tight text-black text-center mt-1">Purchase Indent</div>
            <div className="text-xs text-gray-700 text-center">(Internal office use only - not a valid order)</div>
          </div>
        </div>

        <hr />
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-[14px] mb-2">
          <div>
            <div>Name of the Institute : <span className="font-semibold">{data.institute}</span></div>
            <div>Dept. / Lab.: <span className="font-semibold">{data.department}</span></div>
            <div>Material Type : <span className="font-semibold">{data.materialType}</span></div>
          </div>
          <div>
            <div>Contact No. : <span className="font-semibold">{data.contactNo}</span></div>
            <div>Category Code : <span className="font-semibold">{data.categoryCode}</span></div>
            <div>Institute Indent No. : <span className="font-semibold">{data.indentNo}</span> &nbsp; Date : <span className="font-semibold">{data.date}</span></div>
          </div>
        </div>
        <hr />
        
        {/* Items Table */}
        <table className="w-full border border-black text-[13px] mb-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-2">Sr. No.</th>
              <th className="border border-black px-2 py-2">Item Name</th>
              <th className="border border-black px-2 py-2">Description/Specification of Item</th>
              <th className="border border-black px-2 py-2">Make</th>
              <th className="border border-black px-2 py-2">Quantity</th>
              <th className="border border-black px-2 py-2">UOM</th>
              <th className="border border-black px-2 py-2">Stock in Hand <br /> if any</th>
              <th className="border border-black px-2 py-2">Similar Item <br /> purchased if any</th>
              <th className="border border-black px-2 py-2">Appx. Value</th>
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
            {/* Add empty rows to match the form layout */}
            {Array.from({ length: 5 - data.items.length }).map((_, idx) => (
              <tr key={idx + 'empty'}>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
                <td className="border border-black px-2 py-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Timeline, Budget, Notes */}
        <div className="grid grid-cols-2 gap-2 text-[14px] mb-2">
          <div>Timeline for delivery of material : <span className="font-semibold">{data.timeline}</span></div>
          <div>Reason for item : <span className="font-semibold">{data.urgentReason}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[14px] mb-2">
          <div>Budget Provision : <span className="font-semibold">{data.budgetProvision}</span></div>
          <div>Budget Head : <span className="font-semibold">{data.budgetHead}</span></div>
        </div>

        <br />
        {/* Footer - Signatures and Notes */}
        <div className="grid grid-cols-6 gap-2 text-[12px] mt-4 mb-2">
          <div className="text-center">Prepared By</div>
          <div className="text-center">Head of Dept</div>
          <div className="text-center">Store Dept</div>
          <div className="text-center">Accounts Dept</div>
          <div className="text-center">OS/Registrar</div>
          <div className="text-center">Director / Principal</div>
        </div>

        <div className="flex justify-between items-end text-[14px] mb-2">
          <div></div>
          <div className="flex flex-col items-end">
            <div className="font-bold">APPROVED / NOT APPROVED</div>
            <br /><br />
            <div className="font-bold">TRUSTEE / SECRETARY / VICE CHAIRMAN / CHAIRMAN</div>
          </div>
        </div>
        {/* <div className="text-xs text-gray-700 mt-2">
          <div>Note :</div>
          <ol className="list-decimal ml-6">
            <li>Indent must be filled category wise separately.</li>
            <li>Submit approved Indent to Central Purchase D department.</li>
            <li>Indent which is not approved or incomplete will be returned to requisitioner.</li>
            <li>Sources of availability if known may be mentioned.</li>
            <li>Attach at least one quotation in support of value and specification.</li>
          </ol>
        </div> */}
      </div>
    </div>
  );
};

export default IndentReport; 