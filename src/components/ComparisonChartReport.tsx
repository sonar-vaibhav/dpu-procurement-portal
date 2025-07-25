import React, { useRef, useState, useEffect } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const comparisonData = {
  society: 'DR. D. Y. PATIL UNITECH SOCIETY, PUNE',
  department: 'College Bldg - St. No. 138, Tathawade',
  indentNo: '104',
  date: '03/12/2024',
  estimates: [
    {
      vendor: 'Innovative Technetec Pvt.Ltd',
      estimateNo: '3346/25-26-1',
      estimateDate: '18/06/2025',
    },
    {
      vendor: 'Qex Solutions Pvt.Ltd.',
      estimateNo: 'QEX00137',
      estimateDate: '18/06/2025',
    },
    {
      vendor: 'Shreya Infocon Solutions',
      estimateNo: 'DPU/13/24-25',
      estimateDate: '18/06/2025',
    },
    {
      vendor: 'Par Computing Solutions Pvt. Ltd.',
      estimateNo: 'PCSLP/005',
      estimateDate: '',
    },
  ],
  items: [
    {
      sr: 1,
      description: 'CCTV DOME 2MP with all accessories',
      unit: 'Nos',
      qty: 163,
      vendors: [
        { model: 'CP-Plus\nCP-UNC-DA21L3C-LQ', rate: 2595, amount: 422985 },
        { model: 'CP-Plus\nCP-UNC-DA21L3C-LQ', rate: 2950, amount: 480850 },
        { model: 'Honeywell\nI-HIDP2PI-MF', rate: 4680, amount: 762840 },
        { model: 'Prama\nPT-NC232P1-N', rate: 3185, amount: 519155 },
      ],
    },
    {
      sr: 2,
      description: 'CCTV Bullet 4MP with all accessories',
      unit: 'Nos',
      qty: 50,
      vendors: [
        { model: 'CP-Plus\nCP-UNC-TC41L5C-VMD-LQ', rate: 6210, amount: 310500 },
        { model: 'CP-Plus\nCP-UNC-TC41L5C-D-Q', rate: 3800, amount: 190000 },
        { model: 'Honeywell\nI-HIPB5PI-MF', rate: 6600, amount: 330000 },
        { model: 'Prama\nPT-NC340P1-WNMS', rate: 4550, amount: 227500 },
      ],
    },
    {
      sr: 3,
      description: '64 Channel NVR',
      unit: 'Nos',
      qty: 4,
      vendors: [
        { model: 'CP-Plus\nCP-UNR-4K564R8-F1', rate: 43795, amount: 175180 },
        { model: 'CP-Plus\nCP-UNR-4K564R8-F1', rate: 63000, amount: 252000 },
        { model: 'Honeywell\nI-HPNVR-864', rate: 59520, amount: 238080 },
        { model: 'Prama\nPT-NR3A64-M8/R', rate: 104650, amount: 418600 },
      ],
    },
  ],
  totals: [
    { label: 'Total', values: ['15,33,165.00', '15,10,610.00', '21,25,220.00', '19,58,395.00'] },
    { label: 'GST [ Extra @18% ]', values: ['2,75,969.70', '2,71,909.80', '3,82,539.60', '3,52,511.10'] },
    { label: 'Loading & Unloading charges', values: ['Inclusive', 'Inclusive', 'Inclusive', 'Inclusive'] },
    { label: 'P & F', values: ['Inclusive', 'Inclusive', 'Inclusive', 'Inclusive'] },
    { label: 'Gross Total', values: ['18,09,134.70', '17,82,519.80', '25,07,759.60', '23,10,906.10'] },
  ],
  warranty: [
    'CP-Plus: 2 Years',
    'CP-Plus: 2 Years',
    'Honeywell: 1 Years',
    'Prama: 1 Years',
  ],
  hdd: ['HDD: 3 Years', 'HDD: 3 Years', 'HDD: 3 Years', 'HDD: 3 Years'],
  delivery: ['1-2 Weeks', '1-2 Weeks', '1-2 Weeks', '1-2 Week'],
  payment: [
    '80 % Advance 20% After Completion of work',
    '50 % Advance 20% After Delivery 30% After Installation',
    '80 % Advance 20% After Completion of work',
    '100% Advance',
  ],
};

const ComparisonChartReport: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'ComparisonChartReport.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    html2pdf().set(opt).from(printRef.current).save();
  };

  const handleVendorClick = (index: number) => {
    setSelectedVendor(index === selectedVendor ? null : index);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 print:hidden"
        onClick={handleDownloadPDF}
      >
        Download Comparison Chart as PDF
      </button>
      <div ref={printRef} className="w-[277mm] bg-white text-black text-[13px] font-sans print:w-full p-0 m-0">
        {/* Header Table */}
        <table className="w-full border border-black text-xs mb-2">
          <thead>
            <tr>
              <th colSpan={20} className="border border-black text-center font-bold text-base">
                DR. D. Y. PATIL UNITECH SOCIETY, PUNE
              </th>
            </tr>
            <tr>
              <th colSpan={20} className="border border-black text-center font-semibold px-2 py-1">
                Statement for Comparison of Estimate
              </th>
            </tr>
            <tr>
              <th colSpan={4} className="border border-black font-normal text-left px-2 py-1">
                Name: Dr. D. Y. Patil Unitech Society, Pune
              </th>
              <th colSpan={2} className="border border-black font-normal text-left px-2 py-1">
                Department: College Bldg- Sr. No. 138, Tathawade
              </th>
              <th className="border border-black font-normal text-left px-2 py-1">Indent No: 1046</th>
              <th className="border border-black font-normal text-left px-2 py-1">Date: 03/12/2024</th>
            </tr>
          </thead>
        </table>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full border border-gray-400 text-xs">
            <thead>
              <tr>
                <th rowSpan={2} className="border border-gray-400 px-1 py-1">Sr. No.</th>
                <th rowSpan={2} className="border border-gray-400 px-1 py-1">Material Description</th>
                <th rowSpan={2} className="border border-gray-400 px-1 py-1">Unit</th>
                <th rowSpan={2} className="border border-gray-400 px-1 py-1">Qty</th>
                {comparisonData.estimates.map((est, idx) => (
                  <th
                    className={`border border-gray-400 px-1 py-1 text-center cursor-pointer ${
                      selectedVendor === idx ? 'bg-yellow-200' : ''
                    }`}
                    colSpan={3}
                    key={idx}
                    onClick={() => handleVendorClick(idx)}
                  >
                    Estimate {idx + 1}<br />
                    <span className="font-semibold">{est.vendor}</span><br />
                    <span className="font-normal">Estimate No. {est.estimateNo}</span><br />
                    <span className="font-normal">Estimate Date: {est.estimateDate}</span>
                  </th>
                ))}
              </tr>
              <tr>
                {comparisonData.estimates.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <th className="border border-gray-400 px-1 py-1">Make/Model</th>
                    <th className="border border-gray-400 px-1 py-1">Rate</th>
                    <th className="border border-gray-400 px-1 py-1">Amount</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Section Header Row */}
              <tr>
                <td className="border border-gray-400 px-1 py-1 font-semibold bg-gray-100 text-left" colSpan={4 + comparisonData.estimates.length * 3}>
                  Supply & Installation of Following CCTV Camera System
                </td>
              </tr>
              {comparisonData.items.map((item, idx) => (
                <tr key={item.sr} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-400 px-1 py-1 text-center">{item.sr}</td>
                  <td className="border border-gray-400 px-1 py-1 text-center">
                    {item.description.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                  </td>
                  <td className="border border-gray-400 px-1 py-1 text-center">{item.unit}</td>
                  <td className="border border-gray-400 px-1 py-1 text-center">{item.qty}</td>
                  {item.vendors.map((v, vIdx) => (
                    <React.Fragment key={vIdx}>
                      <td className={`border border-gray-400 px-1 py-1 text-center ${
                        selectedVendor === vIdx ? 'bg-yellow-100 font-semibold' : ''
                      }`}>
                        {v.model.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                      </td>
                      <td className={`border border-gray-400 px-1 py-1 text-right ${
                        selectedVendor === vIdx ? 'bg-yellow-100 font-semibold' : ''
                      }`}>
                        {v.rate.toLocaleString()}
                      </td>
                      <td className={`border border-gray-400 px-1 py-1 text-right ${
                        selectedVendor === vIdx ? 'bg-yellow-100 font-semibold' : ''
                      }`}>
                        {v.amount.toLocaleString()}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}

              {/* Totals and Summary Rows */}
              {comparisonData.totals.map((row) => (
                <tr key={row.label} className="font-bold">
                  <td className="border border-gray-400 px-1 py-1 text-right bg-gray-100" colSpan={4}>{row.label}</td>
                  {row.values.map((val, vIdx) => (
                    <td
                      className={`border border-gray-400 px-1 py-1 text-center bg-gray-100 ${
                        selectedVendor === vIdx ? 'bg-yellow-200 font-bold' : ''
                      }`}
                      colSpan={3}
                      key={vIdx}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Warranty/Delivery/Payment Rows */}
              <tr>
                <td colSpan={4} className="border border-gray-400 px-1 py-1 font-semibold text-right bg-gray-50">Warranty</td>
                {comparisonData.estimates.map((_, idx) => (
                  <td
                    className={`border border-gray-400 px-1 py-1 text-center bg-gray-50 ${
                      selectedVendor === idx ? 'bg-yellow-100 font-semibold' : ''
                    }`}
                    colSpan={3}
                    key={idx}
                  >
                    <div>{comparisonData.warranty[idx]}</div>
                    <div>{comparisonData.hdd[idx]}</div>
                  </td>
                ))}
              </tr>
              <tr>
                <td colSpan={4} className="border border-gray-400 px-1 py-1 font-semibold text-right bg-gray-50">Delivery</td>
                {comparisonData.estimates.map((_, idx) => (
                  <td
                    className={`border border-gray-400 px-1 py-1 text-center bg-gray-50 ${
                      selectedVendor === idx ? 'bg-yellow-100 font-semibold' : ''
                    }`}
                    colSpan={3}
                    key={idx}
                  >
                    {comparisonData.delivery[idx]}
                  </td>
                ))}
              </tr>
              <tr>
                <td colSpan={4} className="border border-gray-400 px-1 py-1 font-semibold text-right bg-gray-50">Payment</td>
                {comparisonData.estimates.map((_, idx) => (
                  <td
                    className={`border border-gray-400 px-1 py-1 text-center bg-gray-50 ${
                      selectedVendor === idx ? 'bg-yellow-100 font-semibold' : ''
                    }`}
                    colSpan={3}
                    key={idx}
                  >
                    {comparisonData.payment[idx]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-6 mb-[6px] text-xs w-full" style={{ pageBreakInside: 'avoid' }}>
          <div>
            <div>Omkar Rokade</div>
            <div>Prepared By</div>
          </div>
          <div>
            <div>Kailas Tupsundar</div>
            <div>Checked By</div>
          </div>
          <div>
            <div>Gaurav Kathale</div>
            <div>IT Incharge</div>
          </div>
          <div className="text-right">
            <div>For DR. D. Y. PATIL UNITECH SOCIETY, PUNE</div>
            <div style={{ height: '12px' }}></div>
            <div className="font-semibold">Secretary/Vice-Chairman/Chairman</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChartReport;
