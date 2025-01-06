import PDFDocument from 'pdfkit';

const generatePayslipPDF = (payroll) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            const downloadDate = new Date().toLocaleString();
            
            // Collect PDF data
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Add company header
            doc.fontSize(18)
               .text('Hospital Nurse Management System', { align: 'center' });
            doc.fontSize(12)
               .text('123 Hospital Street, City, Country', { align: 'center' });
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

            // Add bank details
            doc.fontSize(12)
               .text(`Bank Name: BRAC BANK`);
            doc.text(`Bank Account: 03838483839}`);
            doc.text(`Bank Branch: Gulshan, Dhaka`);
            doc.moveDown();
          
            // Add signature
            doc.fontSize(12)
               .text('Signature:', { underline: true });
            doc.image('C:/Users/Surzo/Desktop/Hospital Nurse Management/backend/utils/signature.png', { width: 100 });
            doc.moveDown(10);

            // Add download date and time
            doc.fontSize(10)
               .text(`Generated on: ${downloadDate}`, { align: 'center' });
            doc.moveDown();

            // Add footer
            doc.moveDown(4);
            doc.fontSize(10)
               .text('This is an automatically generated payslip. Please contact HR (hr@hospital.g.ac.bd) for any discrepancies.', { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export { generatePayslipPDF };
