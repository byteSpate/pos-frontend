import React, { useRef } from "react";
import { MdPrint, MdClose, MdCheckCircle } from "react-icons/md";
import Button from "../ui/Button";
import Card from "../ui/Card";
import PrintableInvoice from "./PrintableInvoice";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  
  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (printContent) {
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.top = '-10000px';
      iframe.style.left = '-10000px';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Get the invoice HTML content
      const invoiceHTML = printContent.innerHTML;
      
      // Create the complete HTML document for printing
      const printDocument = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - Order Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Arial', sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #000;
              background: #fff;
              padding: 20px;
            }
            
            .printable-invoice {
              background: white;
              color: #333;
              font-family: Arial, sans-serif;
              padding: 0;
            }
            
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            
            .border-b-2 { border-bottom: 2px solid #333; }
            .border-t { border-top: 1px solid #333; }
            .border-t-2 { border-top: 2px solid #333; }
            .border-gray-300 { border-color: #ccc; }
            
            .pb-4 { padding-bottom: 16px; }
            .pt-4 { padding-top: 16px; }
            .pt-6 { padding-top: 24px; }
            .mt-2 { margin-top: 8px; }
            .mt-6 { margin-top: 24px; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-6 { margin-bottom: 24px; }
            .my-6 { margin-top: 24px; margin-bottom: 24px; }
            
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            
            .text-3xl { font-size: 24pt; }
            .text-2xl { font-size: 18pt; }
            .text-lg { font-size: 14pt; }
            .text-md { font-size: 12pt; }
            .text-sm { font-size: 10pt; }
            .text-xs { font-size: 9pt; }
            
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: 1fr 1fr; }
            .gap-4 { gap: 16px; }
            
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            
            .mx-auto { margin-left: auto; margin-right: auto; }
            .max-w-12 { max-width: 48px; }
            .h-12 { height: 48px; }
            
            .text-gray-600 { color: #666; }
            .text-gray-500 { color: #888; }
            .text-red-600 { color: #dc2626; }
            .text-green-600 { color: #16a34a; }
            
            .tracking-wider { letter-spacing: 0.05em; }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
            }
            
            th, td {
              border: 1px solid #333;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            
            .border-b { border-bottom: 1px solid #ccc; }
            .border-b-2 { border-bottom: 2px solid #333; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            
            @media print {
              body { margin: 0; padding: 10px; }
              @page { 
                margin: 0.5in;
                size: A4;
              }
            }
          </style>
        </head>
        <body onload="window.print(); window.parent.postMessage('print-complete', '*');">
          ${invoiceHTML}
        </body>
        </html>
      `;
      
      // Write content to iframe and print
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(printDocument);
      iframeDoc.close();
      
      // Listen for print completion
      const handleMessage = (event) => {
        if (event.data === 'print-complete') {
          document.body.removeChild(iframe);
          window.removeEventListener('message', handleMessage);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Fallback cleanup after 5 seconds
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
          window.removeEventListener('message', handleMessage);
        }
      }, 5000);
    }
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