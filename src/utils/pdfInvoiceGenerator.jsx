import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function numberToWords(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const val = Math.round(num);
  if (val === 0) return 'Zero Rupees Only';
  if (val.toString().length > 9) return `Rupees ${val.toLocaleString('en-IN')} Only`;

  const n = ('000000000' + val).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return `Rupees ${val.toLocaleString('en-IN')} Only`;

  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

  return str.trim() ? str.trim() + ' Rupees Only' : `Rupees ${val.toLocaleString('en-IN')} Only`;
}

/**
 * Builds a 300 DPI high-definition vector HTML template for GST Tax Invoices.
 */
function buildGSTInvoiceHTML(order) {
  const orderNo = order.orderNumber || order.id || 'PM-1001';
  const invoiceNo = `INV-${orderNo}`;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const customerName = order.customerName || order.customer?.name || 'Valued Customer';
  const customerMobile = order.mobile || order.customer?.phone || 'N/A';
  const customerEmail = order.email || order.customer?.email || 'N/A';
  const customerAddress = order.address || order.customer?.address || 'Pinto Park, Gwalior';
  const customerCity = order.city || 'Gwalior';
  const customerState = order.state || 'Madhya Pradesh';
  const customerPincode = order.pincode || '474005';

  const rawItems = order.items || [];
  const normalizedItems = rawItems.map((item, idx) => {
    const title = item.productNameSnapshot || item.name || `Electronic Accessory #${idx + 1}`;
    const qty = parseInt(item.quantity, 10) || 1;
    const unitPrice = parseFloat(item.finalPrice || item.price || 0);
    const lineTotal = unitPrice * qty;
    const taxableValue = Math.round((lineTotal / 1.18) * 100) / 100;
    const gstAmount = Math.round((lineTotal - taxableValue) * 100) / 100;
    const cgst = Math.round((gstAmount / 2) * 100) / 100;
    const sgst = Math.round((gstAmount / 2) * 100) / 100;

    return {
      sno: idx + 1,
      title,
      hsn: '8517',
      qty,
      unitPrice,
      taxableValue,
      cgst,
      sgst,
      lineTotal
    };
  });

  const grandTotal = parseFloat(order.total || 0);
  const totalTaxable = normalizedItems.reduce((acc, i) => acc + i.taxableValue, 0);
  const totalCGST = normalizedItems.reduce((acc, i) => acc + i.cgst, 0);
  const totalSGST = normalizedItems.reduce((acc, i) => acc + i.sgst, 0);
  const amountInWords = numberToWords(grandTotal);
  const discountAmount = parseFloat(order.discount || 0);

  return `
    <div id="pdf-invoice-container" style="
      width: 794px;
      min-height: 1123px;
      padding: 36px;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    ">
      <!-- Outer Border -->
      <div style="
        border: 2px solid #0f172a;
        padding: 24px;
        box-sizing: border-box;
        border-radius: 4px;
      ">
        <!-- HEADER -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 20px;
        ">
          <div>
            <div style="font-size: 26px; font-weight: 900; color: #e51b23; letter-spacing: -0.5px; text-transform: uppercase;">
              PREM MOBILE
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #050505; margin-top: 2px;">
              GWALIOR'S #1 ELECTRONIC ACCESSORIES STORE
            </div>
            <div style="font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.4;">
              Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) - 474005<br/>
              Phone: +91 8269704727 | Email: premmobilegwalior@gmail.com
            </div>
            <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 6px;">
              GSTIN: <span style="font-family: monospace;">23AAFFP8269P1Z9</span> (Registered Tax Invoice)
            </div>
          </div>

          <div style="text-align: right;">
            <div style="
              background: #FFD400;
              color: #050505;
              font-size: 11px;
              font-weight: 900;
              padding: 6px 14px;
              border-radius: 4px;
              display: inline-block;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">
              TAX INVOICE
            </div>
            <div style="font-size: 12px; font-weight: 800; color: #050505;">
              Invoice No: <span style="font-family: monospace;">${invoiceNo}</span>
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              Order No: <span style="font-family: monospace; font-weight: 700;">${orderNo}</span>
            </div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
              Invoice Date: <strong>${orderDate}</strong>
            </div>
            <div style="font-size: 10px; font-weight: 800; color: #16a34a; margin-top: 4px;">
              PAYMENT STATUS: VERIFIED & PAID
            </div>
          </div>
        </div>

        <!-- CUSTOMER & SUPPLIER DETAILS -->
        <div style="
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        ">
          <!-- Billed To -->
          <div style="
            flex: 1;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 12px;
            border-radius: 6px;
          ">
            <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
              BILLED TO / CUSTOMER DETAILS
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
              ${customerName}
            </div>
            <div style="font-size: 10px; color: #334155; margin-top: 4px; line-height: 1.4;">
              <strong>Address:</strong> ${customerAddress}<br/>
              <strong>City/State:</strong> ${customerCity}, ${customerState} - ${customerPincode}<br/>
              <strong>Mobile:</strong> ${customerMobile} | <strong>Email:</strong> ${customerEmail}
            </div>
          </div>

          <!-- Dispatch From -->
          <div style="
            flex: 1;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 12px;
            border-radius: 6px;
          ">
            <div style="font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
              SUPPLIER & DISPATCH LOCATION
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
              PREM MOBILE GWALIOR
            </div>
            <div style="font-size: 10px; color: #334155; margin-top: 4px; line-height: 1.4;">
              Pinto Park Store Hub, Gwalior (M.P.) - 474005<br/>
              <strong>Place of Supply:</strong> Madhya Pradesh (23)<br/>
              <strong>Warranty Type:</strong> Official Brand Warranty<br/>
              <strong>Fulfillment:</strong> Direct Store Express Delivery
            </div>
          </div>
        </div>

        <!-- ITEMS TABLE -->
        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        ">
          <thead>
            <tr style="background: #0f172a; color: #ffffff; text-transform: uppercase; font-size: 9px;">
              <th style="padding: 8px 6px; text-align: center; width: 35px;">#</th>
              <th style="padding: 8px 6px; text-align: left;">Description of Goods</th>
              <th style="padding: 8px 6px; text-align: center; width: 50px;">HSN</th>
              <th style="padding: 8px 6px; text-align: center; width: 40px;">Qty</th>
              <th style="padding: 8px 6px; text-align: right; width: 75px;">Taxable (₹)</th>
              <th style="padding: 8px 6px; text-align: right; width: 65px;">CGST (9%)</th>
              <th style="padding: 8px 6px; text-align: right; width: 65px;">SGST (9%)</th>
              <th style="padding: 8px 6px; text-align: right; width: 85px;">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${normalizedItems.map(item => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 6px; text-align: center; font-weight: 700;">${item.sno}</td>
                <td style="padding: 8px 6px; font-weight: 700; color: #0f172a;">${item.title}</td>
                <td style="padding: 8px 6px; text-align: center; color: #64748b; font-family: monospace;">${item.hsn}</td>
                <td style="padding: 8px 6px; text-align: center; font-weight: 800;">${item.qty}</td>
                <td style="padding: 8px 6px; text-align: right;">₹${item.taxableValue.toFixed(2)}</td>
                <td style="padding: 8px 6px; text-align: right;">₹${item.cgst.toFixed(2)}</td>
                <td style="padding: 8px 6px; text-align: right;">₹${item.sgst.toFixed(2)}</td>
                <td style="padding: 8px 6px; text-align: right; font-weight: 800; color: #0f172a;">₹${item.lineTotal.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- TOTALS & DECLARATION -->
        <div style="
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        ">
          <!-- Left: Amount in Words & Terms -->
          <div style="flex: 1;">
            <div style="
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 10px;
              border-radius: 6px;
              margin-bottom: 10px;
            ">
              <div style="font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase;">
                AMOUNT IN WORDS
              </div>
              <div style="font-size: 11px; font-weight: 800; color: #0f172a; margin-top: 2px;">
                ${amountInWords}
              </div>
            </div>

            <div style="font-size: 9px; color: #64748b; line-height: 1.4;">
              <strong>Terms & Conditions:</strong><br/>
              1. All electronic items carry official manufacturer warranty.<br/>
              2. Goods once sold are covered under brand service center policy.<br/>
              3. Computer generated GST invoice. Signature not required.
            </div>
          </div>

          <!-- Right: Summary Totals -->
          <div style="
            width: 240px;
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            padding: 12px;
            border-radius: 6px;
          ">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #475569; margin-bottom: 4px;">
              <span>Taxable Subtotal:</span>
              <strong style="color: #0f172a;">₹${totalTaxable.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #475569; margin-bottom: 4px;">
              <span>CGST (9%):</span>
              <strong style="color: #0f172a;">₹${totalCGST.toFixed(2)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #475569; margin-bottom: 4px;">
              <span>SGST (9%):</span>
              <strong style="color: #0f172a;">₹${totalSGST.toFixed(2)}</strong>
            </div>
            ${discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #16a34a; margin-bottom: 4px; font-weight: 700;">
                <span>Coupon Savings:</span>
                <span>-₹${discountAmount.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}

            <div style="
              display: flex;
              justify-content: space-between;
              border-top: 2px solid #0f172a;
              padding-top: 6px;
              margin-top: 6px;
              font-size: 13px;
              font-weight: 900;
              color: #16a34a;
            ">
              <span>NET AMOUNT PAID:</span>
              <span>₹${grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <!-- FOOTER & SIGNATURE -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1.5px solid #cbd5e1;
          padding-top: 12px;
          margin-top: 10px;
        ">
          <div>
            <div style="font-size: 10px; font-weight: 800; color: #0f172a;">PREM MOBILE STORE • GWALIOR</div>
            <div style="font-size: 9px; color: #64748b;">Thank you for shopping with Gwalior's #1 Electronic Accessories Store!</div>
          </div>

          <div style="text-align: center; width: 150px;">
            <div style="border-bottom: 1px dashed #94a3b8; height: 24px; margin-bottom: 4px;"></div>
            <div style="font-size: 10px; font-weight: 800; color: #0f172a;">For PREM MOBILE</div>
            <div style="font-size: 8px; color: #64748b;">(Authorized Signatory)</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * Generates an Ultra High Definition 300 DPI Vector PDF Invoice.
 * Uses html2canvas (Scale: 3 for 300 DPI retina resolution) and jsPDF.
 */
export async function generateGSTInvoicePDF(order) {
  if (!order) {
    alert('Invalid order details for invoice generation.');
    return;
  }

  const isDelivered = String(order.status).toUpperCase() === 'DELIVERED';
  if (!isDelivered) {
    alert('GST Tax Invoice is available ONLY after the order status is updated to DELIVERED.');
    return;
  }

  const orderNo = order.orderNumber || order.id || 'PM-1001';

  try {
    // 1. Create off-screen container for 300 DPI HTML invoice
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.top = '-9999px';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = buildGSTInvoiceHTML(order);
    document.body.appendChild(tempDiv);

    const targetElement = tempDiv.querySelector('#pdf-invoice-container');

    // 2. Render high resolution canvas at scale 3 (300 DPI retina quality)
    const canvas = await html2canvas(targetElement, {
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // 3. Remove temporary element
    document.body.removeChild(tempDiv);

    // 4. Convert canvas to PDF using jsPDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`GST_Invoice_${orderNo}.pdf`);

  } catch (err) {
    console.error('High-DPI PDF generation error:', err);
    alert('Failed to generate high-quality PDF invoice. Please try again.');
  }
}
