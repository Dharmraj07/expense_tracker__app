const puppeteer = require("puppeteer");
const Transaction = require("../models/transactionModel");


// Generate HTML document with transactions
async function generateHTML(transactions) {
  return `
    <html>
      <head>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Transaction Report</h1>
        <p>User ID: ${transactions[0].userId}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map((t) => `
              <tr>
                <td>${t.date}</td>
                <td>${t.amount}</td>
                <td>${t.type}</td>
                <td>${t.description}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

// Download transactions report for the authenticated user
const downloadTransactions = async (req, res) => {
  try {
     const userId = req.params.id;
    // const userId=req.authData.id;


    // Fetch all transactions for the user
    const transactions = await Transaction.find({
      
        userId
      
    });
   console.log(transactions)
    // Generate HTML document with transactions
    const html = await generateHTML(transactions);

    // Generate a PDF from the HTML document
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "2cm",
        bottom: "2cm",
        left: "2cm",
        right: "2cm"
      }
    });
    await browser.close();

    // Set headers to send the PDF file as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transaction-report.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.write(pdfBuffer);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { downloadTransactions };