const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * PDF Generator Utility
 * 
 * Creates a professional fee receipt in PDF format.
 */

/**
 * Generate Fee Receipt PDF
 * @param {Object} data - Receipt data
 * @returns {Promise<Object>} Object containing filePath and downloadUrl
 */
const generateFeeReceipt = async (data) => {
  const { 
    receiptNumber, 
    date, 
    studentName, 
    class: className, 
    rollNumber, 
    paidAmount, 
    dueAmount, 
    paymentMode = 'Cash/Online' 
  } = data;

  const fileName = `Receipt_${receiptNumber}.pdf`;
  const dirPath = path.join(__dirname, '../uploads/receipts');
  const filePath = path.join(dirPath, fileName);

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream to file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- Header ---
    doc.fillColor('#444444')
       .fontSize(20)
       .text('LBS SCHOOL ERP', 110, 57)
       .fontSize(10)
       .text('123 Education Lane, Academic City', 200, 65, { align: 'right' })
       .text('City, State, 123456', 200, 80, { align: 'right' })
       .moveDown();

    // Line separator
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, 100)
       .lineTo(550, 100)
       .stroke();

    // --- Receipt Info ---
    doc.fillColor('#000000')
       .fontSize(20)
       .text('FEE RECEIPT', 50, 120);

    doc.fontSize(10)
       .text(`Receipt Number: ${receiptNumber}`, 50, 150)
       .text(`Date: ${new Date(date).toLocaleDateString()}`, 50, 165)
       .text(`Payment Mode: ${paymentMode}`, 50, 180);

    // --- Student Info ---
    doc.fontSize(12)
       .text('STUDENT DETAILS', 50, 210, { underline: true });

    doc.fontSize(10)
       .text(`Name: ${studentName}`, 50, 230)
       .text(`Class: ${className}`, 50, 245)
       .text(`Roll Number: ${rollNumber}`, 50, 260);

    // --- Payment Details ---
    const tableTop = 300;
    doc.fontSize(12)
       .text('PAYMENT SUMMARY', 50, tableTop, { underline: true });

    doc.fontSize(10)
       .text('Description', 50, tableTop + 30)
       .text('Amount (INR)', 400, tableTop + 30, { align: 'right' });

    doc.strokeColor('#eeeeee')
       .moveTo(50, tableTop + 45)
       .lineTo(550, tableTop + 45)
       .stroke();

    doc.text('Current Payment', 50, tableTop + 60)
       .text(paidAmount.toFixed(2), 400, tableTop + 60, { align: 'right' });

    doc.fontSize(12)
       .fillColor('#ff0000')
       .text('DUE AMOUNT', 50, tableTop + 90)
       .text(dueAmount.toFixed(2), 400, tableTop + 90, { align: 'right' });

    // --- Footer ---
    doc.fillColor('#444444')
       .fontSize(10)
       .text('This is a computer generated receipt and does not require a physical signature.', 50, 700, { align: 'center', width: 500 });

    doc.end();

    stream.on('finish', () => {
      resolve({
        filePath,
        downloadUrl: `/uploads/receipts/${fileName}`
      });
    });

    stream.on('error', reject);
  });
};

module.exports = { generateFeeReceipt };
