import React, { useState } from 'react';
import { MdAssessment, MdPrint, MdRefresh } from 'react-icons/md';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../../ui/Button';
import Card from '../../ui/Card';

const ReportActions = ({
    financialData,
    chartData,
    expenseBreakdown,
    selectedPeriod,
    selectedMonth,
    monthOptions,
    dateRange,
    formatCurrency,
    refreshData
}) => {
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Generate PDF report functionality
    const generateReport = async () => {
        setIsGeneratingReport(true);
        try {
            // Debug logging
            console.log('Generating report with data:', {
                overview: financialData?.data?.overview,
                chartData: chartData,
                expenseBreakdown: expenseBreakdown
            });

            // Create PDF
            const pdf = new jsPDF();
            const overview = financialData?.data?.overview || {};

            // Validate data consistency
            if (overview.totalSales && overview.totalExpenses) {
                const calculatedRevenue = overview.totalSales - overview.totalExpenses;
                if (Math.abs(calculatedRevenue - (overview.netRevenue || 0)) > 0.01) {
                    console.warn('Revenue calculation mismatch:', {
                        calculated: calculatedRevenue,
                        stored: overview.netRevenue
                    });
                    // Use calculated value for consistency
                    overview.netRevenue = calculatedRevenue;
                }
            }

            let currentY = 30;

            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Financial Report', 20, currentY);
            currentY += 15;

            // Add period info
            pdf.setFontSize(12);
            pdf.setTextColor(100, 100, 100);
            const periodText = dateRange.startDate && dateRange.endDate
                ? `Custom Period: ${dateRange.startDate} to ${dateRange.endDate}`
                : `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Report`;
            pdf.text(periodText, 20, currentY);
            currentY += 10;
            pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, currentY);
            currentY += 20;

            // Add financial overview
            pdf.setFontSize(16);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Financial Overview', 20, currentY);
            currentY += 10;

            pdf.setFontSize(12);
            const overviewData = [
                ['Metric', 'Value'],
                ['Total Sales', formatCurrency(overview.totalSales || 0)],
                ['Total Expenses', formatCurrency(overview.totalExpenses || 0)],
                ['Net Revenue', formatCurrency(overview.netRevenue || 0)],
                ['Total Orders', (overview.totalOrders || 0).toLocaleString()],
                ['Average Order Value', formatCurrency(overview.avgOrderValue || 0)]
            ];

            autoTable(pdf, {
                head: [overviewData[0]],
                body: overviewData.slice(1),
                startY: currentY,
                theme: 'grid',
                headStyles: { fillColor: [66, 133, 244] },
                margin: { left: 20, right: 20 },
                didDrawPage: function (data) {
                    currentY = data.cursor.y;
                }
            });

            // Get the final Y position after the table
            currentY = pdf.lastAutoTable?.finalY || currentY + 60;

            // Add expense breakdown if available
            if (expenseBreakdown.length > 0) {
                pdf.setFontSize(16);
                pdf.text('Expense Breakdown', 20, currentY + 20);

                const expenseTableData = [
                    ['Category', 'Amount', 'Count', 'Average']
                ];

                expenseBreakdown.forEach(category => {
                    expenseTableData.push([
                        category.name,
                        formatCurrency(category.value),
                        category.count.toString(),
                        formatCurrency(category.value / category.count)
                    ]);
                });

                autoTable(pdf, {
                    head: [expenseTableData[0]],
                    body: expenseTableData.slice(1),
                    startY: currentY + 30,
                    theme: 'grid',
                    headStyles: { fillColor: [66, 133, 244] },
                    margin: { left: 20, right: 20 }
                });
            }

            // Save PDF
            const filename = `financial-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // Print report functionality
    const printReport = async () => {
        setIsGeneratingReport(true);
        try {
            const overview = { ...(financialData?.data?.overview || {}) };

            // Validate data consistency for printing
            if (overview.totalSales && overview.totalExpenses) {
                const calculatedRevenue = overview.totalSales - overview.totalExpenses;
                if (Math.abs(calculatedRevenue - (overview.netRevenue || 0)) > 0.01) {
                    console.warn('Revenue calculation mismatch in print:', {
                        calculated: calculatedRevenue,
                        stored: overview.netRevenue
                    });
                    // Use calculated value for consistency
                    overview.netRevenue = calculatedRevenue;
                }
            }

            // Create HTML content for printing
            const periodText = dateRange.startDate && dateRange.endDate
                ? `Custom Period: ${dateRange.startDate} to ${dateRange.endDate}`
                : `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Report`;

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Financial ${periodText}</title>
                    <style>
                        @media print {
                            @page {
                                size: 80mm auto; /* Adjust width as needed */
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                padding: 10px;
                                font-family: 'Courier New', Courier, monospace;
                                font-size: 10px;
                            }
                            .no-print { display: none !important; }
                        }
                        body { font-family: 'Courier New', Courier, monospace; padding: 10px; font-size:10px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .logo { max-width: 100px; margin-bottom: 10px; }
                        .title { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
                        .subtitle { color: #666; margin-bottom: 5px; font-size:10px; }
                        .section { margin-bottom: 20px; }
                        .section-title { font-size: 12px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #4285F4; padding-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                        th { background-color: #f2f2f2; font-weight: bold; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .amount { text-align: right; font-weight: bold; }
                        .positive { color: #10B981; }
                        .negative { color: #EF4444; }
                        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img src="/src/assets/images/logo.jpg" alt="Logo" class="logo" />
                        <div class="title">Financial Report</div>
                        <div class="subtitle">${periodText}</div>
                        <div class="subtitle">Generated on: ${new Date().toLocaleDateString()}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">Financial Overview</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Total Sales</td>
                                    <td class="amount">${formatCurrency(overview.totalSales || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Total Expenses</td>
                                    <td class="amount">${formatCurrency(overview.totalExpenses || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Net Revenue</td>
                                    <td class="amount ${((overview.netRevenue || 0) >= 0) ? 'positive' : 'negative'}">${formatCurrency(overview.netRevenue || 0)}</td>
                                </tr>
                                <tr>
                                    <td>Total Orders</td>
                                    <td class="amount">${(overview.totalOrders || 0).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td>Average Order Value</td>
                                    <td class="amount">${formatCurrency(overview.avgOrderValue || 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    ${expenseBreakdown.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Expense Breakdown</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Count</th>
                                    <th>Average</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${expenseBreakdown.map(category => `
                                    <tr>
                                        <td>${category.name}</td>
                                        <td class="amount">${formatCurrency(category.value)}</td>
                                        <td class="amount">${category.count}</td>
                                        <td class="amount">${formatCurrency(category.value / category.count)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}
                    <div class="footer">
                        <p>Powered by : Bytespate Limited</p>
                    </div>
                </body>
                </html>
            `;

            // Open print dialog
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Wait for content to load then print
            printWindow.onload = function () {
                printWindow.print();
                printWindow.close();
            };

        } catch (error) {
            console.error('Error printing report:', error);
            alert('Failed to print report. Please try again.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="primary"
                    icon={<MdAssessment />}
                    onClick={generateReport}
                    loading={isGeneratingReport}
                    disabled={isGeneratingReport}
                >
                    {isGeneratingReport ? 'Generating PDF...' : 'Generate Report'}
                </Button>
                <Button
                    variant="outline"
                    icon={<MdPrint />}
                    onClick={printReport}
                    loading={isGeneratingReport}
                    disabled={isGeneratingReport}
                >
                    {isGeneratingReport ? 'Preparing Print...' : 'Print Report'}
                </Button>
                <Button
                    variant="outline"
                    icon={<MdRefresh />}
                    onClick={refreshData}
                >
                    Refresh Data
                </Button>
            </div>
        </Card>
    );
};

export default ReportActions;