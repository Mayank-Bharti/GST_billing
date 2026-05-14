import Invoice from "../models/Invoice.js";
import Product from "../models/Product.js";

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .populate("customer", "name email phone gstin")
      .populate("createdBy", "name")
      .sort("-createdAt");
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer", "name email phone address gstin pan")
      .populate("createdBy", "name");
      
    if (invoice) {
      res.json(invoice);
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create an invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const {
      customer,
      items,
      subTotal,
      totalTax,
      discount,
      grandTotal,
      paymentStatus,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No invoice items" });
    }

    // Clean up empty product IDs to prevent CastError
    const cleanedItems = items.map(item => {
      const cleanItem = { ...item };
      if (cleanItem.product === "") {
        delete cleanItem.product;
      }
      return cleanItem;
    });

    // Generate unique invoice number
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, "0")}`;

    const invoice = new Invoice({
      invoiceNumber,
      customer,
      items: cleanedItems,
      subTotal,
      totalTax,
      discount,
      grandTotal,
      paymentStatus,
      paymentMethod,
      createdBy: req.user._id,
    });

    const createdInvoice = await invoice.save();

    // Deduct stock for each item
    for (const item of items) {
      if (item.product) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock -= 1; // Assuming each item line represents 1 piece of jewellery
          await product.save();
        }
      }
    }

    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(400).json({ message: "Invalid invoice data", error: error.message });
  }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id/status
// @access  Private
export const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      invoice.paymentStatus = req.body.paymentStatus || invoice.paymentStatus;
      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      await invoice.deleteOne();
      res.json({ message: "Invoice removed" });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

import puppeteer from "puppeteer";

// @desc    Generate PDF for invoice
// @route   GET /api/invoices/:id/pdf
// @access  Private
export const generatePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customer")
      .populate("createdBy", "name");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // HTML Template for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 30px; }
          .brand-name { font-size: 28px; font-weight: bold; color: #c9a84c; margin: 0; }
          .brand-sub { font-size: 12px; letter-spacing: 2px; color: #777; text-transform: uppercase; }
          .invoice-details { text-align: right; }
          .invoice-details h2 { margin: 0; color: #555; }
          .details-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .box { background: #f9f9f9; padding: 15px; border-radius: 5px; width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #c9a84c; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .totals { width: 300px; margin-left: auto; }
          .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .grand-total { font-size: 18px; font-weight: bold; color: #c9a84c; border-top: 2px solid #eee; padding-top: 10px; margin-top: 5px; }
          .footer { margin-top: 50px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="brand-name">MAYANK MADHURI</h1>
            <div class="brand-sub">Jewellers</div>
            <p style="font-size: 12px; margin-top: 10px;">123 Gold Market, Jewellers Street<br/>Mumbai, India - 400001<br/>GSTIN: 27AABCM1234D1Z5</p>
          </div>
          <div class="invoice-details">
            <h2>TAX INVOICE</h2>
            <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}<br/>
            <strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            <div style="margin-top: 10px; padding: 5px 10px; background: ${invoice.paymentStatus === 'paid' ? '#e6f4ea' : '#fce8e6'}; color: ${invoice.paymentStatus === 'paid' ? '#1e8e3e' : '#d93025'}; display: inline-block; border-radius: 3px; font-weight: bold; text-transform: uppercase; font-size: 12px;">
              ${invoice.paymentStatus}
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="box">
            <h3 style="margin-top: 0; color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; font-size: 14px;">Billed To:</h3>
            <strong>${invoice.customer.name}</strong><br/>
            ${invoice.customer.phone}<br/>
            ${invoice.customer.address || 'N/A'}<br/>
            GSTIN: ${invoice.customer.gstin || 'Unregistered'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item / HSN</th>
              <th style="text-align: right;">Wt (g)</th>
              <th style="text-align: right;">Rate/g</th>
              <th style="text-align: right;">Making</th>
              <th style="text-align: right;">Amount</th>
              <th style="text-align: right;">GST</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td><strong>${item.name}</strong><br/><span style="font-size: 10px; color: #888;">HSN: ${item.hsnCode}</span></td>
                <td style="text-align: right;">${item.weight.toFixed(3)}</td>
                <td style="text-align: right;">₹${item.rate}</td>
                <td style="text-align: right;">₹${item.makingCharge}</td>
                <td style="text-align: right;">₹${item.amount.toFixed(2)}</td>
                <td style="text-align: right;">${item.gstRate}%</td>
                <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Sub Total:</span>
            <span>₹${invoice.subTotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Total GST:</span>
            <span>₹${invoice.totalTax.toFixed(2)}</span>
          </div>
          ${invoice.discount > 0 ? `
          <div class="totals-row" style="color: #d93025;">
            <span>Discount:</span>
            <span>-₹${invoice.discount.toFixed(2)}</span>
          </div>` : ''}
          <div class="totals-row grand-total">
            <span>Grand Total:</span>
            <span>₹${invoice.grandTotal.toFixed(2)}</span>
          </div>
          <p style="text-align: right; font-size: 12px; margin-top: 5px; color: #777;">Amount in words: Rupees ${Math.round(invoice.grandTotal)} only</p>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Mayank Madhuri Jewellers!</p>
          <p>Goods once sold will not be taken back or exchanged. Subject to local jurisdiction.</p>
          <p>Generated by: ${invoice.createdBy?.name || 'Admin'}</p>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.pdf"`
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Gen Error:", error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};
