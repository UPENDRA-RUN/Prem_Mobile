import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

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

// React-PDF Vector Styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    backgroundColor: '#ffffff'
  },
  borderBox: {
    borderWidth: 1.5,
    borderColor: '#0f172a',
    borderStyle: 'solid',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 12
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
    textTransform: 'uppercase'
  },
  storeTagline: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginTop: 1
  },
  storeMeta: {
    fontSize: 8,
    color: '#475569',
    marginTop: 3,
    lineHeight: 1.3
  },
  gstin: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 3
  },
  invoiceBadge: {
    backgroundColor: '#FFD400',
    color: '#050505',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  invoiceNo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#050505',
    textAlign: 'right'
  },
  invoiceMetaRight: {
    fontSize: 8,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 2
  },
  gridTwo: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    padding: 8,
    borderRadius: 4
  },
  cardHeading: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 3
  },
  cardTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2
  },
  cardText: {
    fontSize: 8,
    color: '#334155',
    lineHeight: 1.3
  },
  table: {
    width: '100%',
    marginBottom: 12
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 4
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingVertical: 5,
    paddingHorizontal: 4
  },
  colSno: { width: '6%', textAlign: 'center' },
  colDesc: { width: '38%' },
  colHsn: { width: '10%', textAlign: 'center' },
  colQty: { width: '8%', textAlign: 'center' },
  colTaxable: { width: '13%', textAlign: 'right' },
  colCgst: { width: '12.5%', textAlign: 'right' },
  colSgst: { width: '12.5%', textAlign: 'right' },
  colTotal: { width: '14%', textAlign: 'right', fontWeight: 'bold' },

  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  leftNotes: {
    flex: 1,
    paddingRight: 12
  },
  wordsBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    padding: 6,
    borderRadius: 4,
    marginBottom: 6
  },
  wordsLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase'
  },
  wordsText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 1
  },
  termsText: {
    fontSize: 7,
    color: '#64748b',
    lineHeight: 1.3
  },
  totalsBox: {
    width: 190,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'solid',
    padding: 8,
    borderRadius: 4
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 8,
    color: '#475569'
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: '#0f172a',
    borderTopStyle: 'solid',
    paddingTop: 4,
    marginTop: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#050505'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1.5,
    borderTopColor: '#e2e8f0',
    borderTopStyle: 'solid',
    paddingTop: 8
  },
  signBox: {
    width: 130,
    textAlign: 'center'
  },
  signLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'dashed',
    marginBottom: 3,
    height: 20
  }
});

function GSTInvoiceDocument({ order }) {
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

  return (
    <Document title={`GST_Invoice_${orderNo}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderBox}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.storeTitle}>PREM MOBILE</Text>
              <Text style={styles.storeTagline}>Gwalior's #1 Electronic Accessories Store</Text>
              <Text style={styles.storeMeta}>
                Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) - 474005{'\n'}
                Phone: +91 8269704727 | Email: premmobilegwalior@gmail.com
              </Text>
              <Text style={styles.gstin}>GSTIN: 23AAAFP1234A1Z5 (Madhya Pradesh - 23)</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={styles.invoiceBadge}>
                <Text>TAX INVOICE</Text>
              </View>
              <Text style={styles.invoiceNo}>Invoice #: {invoiceNo}</Text>
              <Text style={styles.invoiceMetaRight}>Date: {orderDate}</Text>
              <Text style={styles.invoiceMetaRight}>Status: DELIVERED / PAID</Text>
            </View>
          </View>

          {/* CUSTOMER & ORDER DETAILS */}
          <View style={styles.gridTwo}>
            <View style={styles.infoCard}>
              <Text style={styles.cardHeading}>BILLED TO (CUSTOMER DETAILS):</Text>
              <Text style={styles.cardTitle}>{customerName}</Text>
              <Text style={styles.cardText}>Phone: {customerMobile}</Text>
              {customerEmail !== 'N/A' && <Text style={styles.cardText}>Email: {customerEmail}</Text>}
              <Text style={styles.cardText}>Address: {customerAddress}, {customerCity}, {customerState} - {customerPincode}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardHeading}>FULFILLMENT & PAYMENT SUMMARY:</Text>
              <Text style={styles.cardText}>Order Reference: #{orderNo}</Text>
              <Text style={styles.cardText}>Payment Mode: {order.notes || 'COD / Razorpay Online'}</Text>
              <Text style={styles.cardText}>Place of Supply: Madhya Pradesh (23)</Text>
              <Text style={[styles.cardText, { color: '#15803d', fontWeight: 'bold', marginTop: 3 }]}>
                ✓ Store Verified & Delivered Order
              </Text>
            </View>
          </View>

          {/* ITEMS TABLE */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colSno}>#</Text>
              <Text style={styles.colDesc}>Description of Goods</Text>
              <Text style={styles.colHsn}>HSN</Text>
              <Text style={styles.colQty}>Qty</Text>
              <Text style={styles.colTaxable}>Taxable (₹)</Text>
              <Text style={styles.colCgst}>CGST (9%)</Text>
              <Text style={styles.colSgst}>SGST (9%)</Text>
              <Text style={styles.colTotal}>Total (₹)</Text>
            </View>

            {normalizedItems.map((item) => (
              <View key={item.sno} style={styles.tableRow}>
                <Text style={styles.colSno}>{item.sno}</Text>
                <Text style={styles.colDesc}>{item.title}</Text>
                <Text style={styles.colHsn}>{item.hsn}</Text>
                <Text style={styles.colQty}>{item.qty}</Text>
                <Text style={styles.colTaxable}>₹{item.taxableValue.toFixed(2)}</Text>
                <Text style={styles.colCgst}>₹{item.cgst.toFixed(2)}</Text>
                <Text style={styles.colSgst}>₹{item.sgst.toFixed(2)}</Text>
                <Text style={styles.colTotal}>₹{item.lineTotal.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* TOTALS & TERMS */}
          <View style={styles.totalsSection}>
            <View style={styles.leftNotes}>
              <View style={styles.wordsBox}>
                <Text style={styles.wordsLabel}>Amount in Words:</Text>
                <Text style={styles.wordsText}>{amountInWords}</Text>
              </View>
              <Text style={styles.termsText}>
                Declaration & Terms:{'\n'}
                1. All items include official manufacturer GST warranty valid across authorized brand service centers.{'\n'}
                2. Goods once sold are covered under brand warranty policy.{'\n'}
                3. This is a computer-generated GST tax invoice requiring no physical signature.
              </Text>
            </View>

            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text>Taxable Subtotal:</Text>
                <Text>₹{totalTaxable.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>CGST (9%):</Text>
                <Text>₹{totalCGST.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>SGST (9%):</Text>
                <Text>₹{totalSGST.toFixed(2)}</Text>
              </View>
              {order.discount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={{ color: '#047857', fontWeight: 'bold' }}>Coupon Discount:</Text>
                  <Text style={{ color: '#047857', fontWeight: 'bold' }}>-₹{parseFloat(order.discount).toLocaleString('en-IN')}</Text>
                </View>
              )}
              <View style={styles.grandTotalRow}>
                <Text>NET AMOUNT PAID:</Text>
                <Text style={{ color: '#047857' }}>₹{grandTotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <View>
              <Text style={{ fontSize: 7.5, fontWeight: 'bold', color: '#64748b' }}>PREM MOBILE STORE • PINTO PARK, GWALIOR</Text>
              <Text style={{ fontSize: 6.5, color: '#94a3b8', marginTop: 1 }}>Thank you for shopping at Gwalior's #1 Electronic Accessories Store!</Text>
            </View>
            <View style={styles.signBox}>
              <View style={styles.signLine} />
              <Text style={{ fontSize: 7.5, fontWeight: 'bold', color: '#0f172a' }}>For PREM MOBILE</Text>
              <Text style={{ fontSize: 6.5, color: '#64748b' }}>(Authorized Signatory)</Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}

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
    const blob = await pdf(<GSTInvoiceDocument order={order} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Invoice_${orderNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('@react-pdf/renderer vector PDF error:', err);
    alert('Failed to generate vector PDF invoice. Please try again.');
  }
}

