import React, { useRef } from "react";
import { MdPrint, MdClose, MdCheckCircle } from "react-icons/md";
import Button from "../ui/Button";
import Card from "../ui/Card";
import PrintableInvoice from "./PrintableInvoice";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt - ${orderInfo.customerDetails.name}</title>
          <meta charset="UTF-8">
          <style>
            /* Print-optimized styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 10px; /* Reduced font size */
              line-height: 1.4;
              color: #000;
              background: #fff;
              padding: 10px; /* Reduced padding */
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .printable-invoice {
              max-width: 100%; /* Ensure it takes full width of print area */
              margin: 0 auto; /* Center content */
              background: #fff;
              color: #000;
            }
            
            /* Header Styles */
            .invoice-header {
              text-align: center;
              margin-bottom: 20px; /* Reduced margin */
              border-bottom: 1px solid #000; /* Thinner border */
              padding-bottom: 15px; /* Reduced padding */
            }
            
            .restaurant-name {
              font-size: 24px; /* Adjusted font size */
              font-weight: bold;
              color: #000;
              margin-bottom: 3px;
              letter-spacing: 0.5px;
            }
            
            .restaurant-subtitle {
              font-size: 14px; /* Adjusted font size */
              color: #333;
              margin-bottom: 8px;
              font-weight: 600;
            }
            
            .restaurant-address,
            .restaurant-contact {
              font-size: 10px; /* Adjusted font size */
              color: #555;
              margin-bottom: 2px;
            }
            
            /* Invoice Title */
            .invoice-title {
              text-align: center;
              margin-bottom: 20px; /* Reduced margin */
            }
            
            .invoice-title h2 {
              font-size: 20px; /* Adjusted font size */
              font-weight: bold;
              color: #000;
              margin-bottom: 5px;
              letter-spacing: 1px;
            }
            
            .thank-you {
              font-size: 12px; /* Adjusted font size */
              color: #666;
              font-style: italic;
            }
            
            /* Information Sections */
            .order-info,
            .customer-info,
            .payment-info {
              margin-bottom: 20px; /* Reduced margin */
              border: 1px solid #ddd;
              padding: 10px; /* Reduced padding */
              background: #f9f9f9;
              page-break-inside: avoid; /* Avoid breaking these sections */
            }
            
            .order-info h3,
            .customer-info h3,
            .payment-info h3 {
              font-size: 14px; /* Adjusted font size */
              font-weight: bold;
              color: #000;
              margin-bottom: 8px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 3px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px; /* Reduced margin */
              font-size: 11px; /* Adjusted font size */
            }
            
            .info-row .label {
              font-weight: 600;
              color: #333;
              min-width: 100px; /* Adjusted min-width */
            }
            
            .info-row .value {
              color: #000;
              font-weight: 500;
            }
            
            .info-row .value.paid {
              color: #22c55e;
              font-weight: bold;
            }
            
            /* Items Table */
            .items-section {
              margin-bottom: 20px; /* Reduced margin */
              page-break-inside: avoid; /* Avoid breaking this section */
            }
            
            .items-section h3 {
              font-size: 14px; /* Adjusted font size */
              font-weight: bold;
              color: #000;
              margin-bottom: 8px;
              border-bottom: 1px solid #000;
              padding-bottom: 3px;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px; /* Reduced margin */
              font-size: 11px; /* Adjusted font size */
            }
            
            .items-table th {
              background: #f0f0f0;
              border: 1px solid #000;
              padding: 8px 6px; /* Reduced padding */
              text-align: left;
              font-weight: bold;
              color: #000;
            }
            
            .items-table td {
              border: 1px solid #ccc;
              padding: 6px; /* Reduced padding */
              color: #000;
            }
            
            .items-table .item-name {
              font-weight: 500;
            }
            
            .items-table .item-qty,
            .items-table .item-price,
            .items-table .item-total {
              text-align: right;
              font-weight: 500;
            }
            
            /* Bill Summary */
            .bill-summary {
              margin-bottom: 20px; /* Reduced margin */
              border: 1px solid #000; /* Thinner border */
              padding: 10px; /* Reduced padding */
              background: #f9f9f9;
              page-break-inside: avoid; /* Avoid breaking this section */
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px; /* Reduced margin */
              font-size: 12px; /* Adjusted font size */
            }
            
            .summary-row.discount {
              color: #dc2626;
            }
            
            .summary-row.total {
              border-top: 1px solid #000; /* Thinner border */
              padding-top: 8px; /* Reduced padding */
              margin-top: 8px; /* Reduced margin */
              font-size: 16px; /* Adjusted font size */
              font-weight: bold;
            }
            
            .summary-row .label {
              font-weight: 600;
            }
            
            .summary-row .value {
              font-weight: bold;
              min-width: 100px;
              text-align: right;
            }
            
            /* Footer */
            .invoice-footer {
              text-align: center;
              margin-top: 20px; /* Reduced margin */
              border-top: 1px solid #ccc; /* Thinner border */
              padding-top: 15px; /* Reduced padding */
              page-break-before: auto; /* Allow page break before footer if needed */
            }
            
            .footer-text {
              font-size: 12px; /* Adjusted font size */
              color: #333;
              margin-bottom: 5px;
              font-weight: 500;
            }
            
            .footer-contact {
              margin-top: 10px;
              font-size: 10px;
              color: #666;
            }
            
            /* Print-specific overrides */
            @media print {
              body {
                margin: 0; /* No default body margin */
                padding: 0; /* No default body padding */
              }
              .printable-invoice {
                box-shadow: none !important; /* Remove shadows in print */
                border: none !important; /* Remove borders in print */
                width: 100% !important;
              }
              /* Ensure all colors print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MdCheckCircle className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Order Receipt</h2>
              <p className="text-sm text-slate-600">Order #{Math.floor(new Date(orderInfo.orderDate).getTime())}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              disabled={!orderInfo.isPaid}
              icon={<MdPrint />}
            >
              Print Receipt
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInvoice(false)}
              icon={<MdClose />}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="p-6">
            <div ref={invoiceRef}>
              <PrintableInvoice orderInfo={orderInfo} />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {orderInfo.isPaid ? (
                <span className="flex items-center gap-2 text-green-600">
                  <MdCheckCircle />
                  Payment completed - Ready to print
                </span>
              ) : (
                <span className="text-orange-600">Payment pending - Print will be available after payment</span>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Invoice;