import PDFDocument from 'pdfkit';

const generatePayslipPDF = (payroll) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            
            // Collect PDF data
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Add header
            doc.fontSize(18)
               .text('Hospital Nurse Management System', { align: 'center' });
            doc.moveDown();
            
            // Add payslip title
            doc.fontSize(14)
               .text('Payslip', { align: 'center' });
            doc.moveDown();

            // Add employee details
            doc.fontSize(12)
               .text(`Employee Name: ${payroll.nurseId.firstName} ${payroll.nurseId.lastName}`);
            doc.text(`Pay Period: ${payroll.month} ${payroll.year}`);
            doc.moveDown();

            // Add salary details
            doc.fontSize(12)
               .text('Salary Details:', { underline: true });
            doc.moveDown(0.5);
            
            doc.text(`Base Salary: $${payroll.salary.toFixed(2)}`);
            doc.text(`Overtime: $${payroll.overtime.toFixed(2)}`);
            doc.text(`Deductions: $${payroll.deductions.toFixed(2)}`);
            doc.moveDown();
            
            // Add net pay
            doc.fontSize(12)
               .text(`Net Pay: $${(payroll.salary + payroll.overtime - payroll.deductions).toFixed(2)}`, { bold: true });
            doc.moveDown();

            // Add footer
            doc.fontSize(10)
               .text('This is an automatically generated payslip. Please contact HR for any discrepancies.', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export { generatePayslipPDF };
