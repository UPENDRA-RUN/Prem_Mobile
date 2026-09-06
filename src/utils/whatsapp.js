import { storeConfig } from '../config/store';

/**
 * Generate a WhatsApp chat URL with encoded message
 * @param {string} text 
 * @returns {string} WhatsApp URL
 */
export function getWhatsAppUrl(text) {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${storeConfig.whatsapp}?text=${encodedText}`;
}

/**
 * Open WhatsApp with single product direct order / enquiry
 * @param {object} product 
 * @param {string} customNote 
 */
export function openProductWhatsApp(product, customNote = '') {
  const price = product.price ?? product.currentPrice ?? product.regularPrice ?? 0;
  const origPrice = product.originalPrice ?? product.regularPrice ?? 0;
  const discountStr = product.discount ? ` (${product.discount}% OFF)` : '';
  const productUrl = `${window.location.origin}/product/${product.id}`;

  const message = 
`🛍️ *PREM MOBILE — DIRECT STORE ORDER / ENQUIRY*
━━━━━━━━━━━━━━━━━━━━
Namaste Prem Mobile Gwalior! Mujhe ye product order karna hai:

📱 *Product:* ${product.name}
🏷️ *Brand:* ${product.brand || 'Prem Mobile'}
💰 *Deal Price:* ₹${price.toLocaleString('en-IN')}${discountStr}${origPrice > price ? ` (MRP: ₹${origPrice.toLocaleString('en-IN')})` : ''}
🔗 *Link:* ${productUrl}

📍 *Store Location:* Pinto Park, Jaderua Gate Ke Samne, Gwalior
🔥 *Tagline:* “${storeConfig.tagline}”
${customNote ? `\n📝 *Note:* ${customNote}` : ''}
━━━━━━━━━━━━━━━━━━━━
Please confirm stock availability & in-store pickup / delivery details.`;

  window.open(getWhatsAppUrl(message), '_blank');
}

/**
 * Open WhatsApp with cart items enquiry
 * @param {Array} cartItems 
 * @param {number} subtotal 
 * @param {object} appliedPromo 
 * @param {number} promoDiscount 
 * @param {number} finalTotal 
 */
export function openCartWhatsApp(cartItems, subtotal, appliedPromo = null, promoDiscount = 0, finalTotal = null) {
  if (!cartItems || cartItems.length === 0) return;

  const totalPayable = finalTotal !== null && finalTotal !== undefined ? finalTotal : subtotal;

  const itemList = cartItems
    .map((item, idx) => {
      const variantStr = item.selectedVariants
        ? ` [${Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}]`
        : '';
      return `${idx + 1}. *${item.name}*${variantStr}\n   └ Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
    })
    .join('\n\n');

  const promoLine = appliedPromo && promoDiscount > 0
    ? `\n🎟️ *Applied Coupon (${appliedPromo.code}):* -₹${promoDiscount.toLocaleString('en-IN')}`
    : '';

  const message = 
`🛒 *PREM MOBILE — CART ORDER CHECKOUT*
━━━━━━━━━━━━━━━━━━━━
Namaste Prem Mobile Gwalior! Mai apni cart ke items ka order confirm karna chahta hu:

${itemList}

━━━━━━━━━━━━━━━━━━━━
💵 *Cart Subtotal:* ₹${subtotal.toLocaleString('en-IN')}${promoLine}
🔥 *Total Payable:* ₹${totalPayable.toLocaleString('en-IN')}
📍 *Store Pickup:* Pinto Park, Gwalior (M.P.)
━━━━━━━━━━━━━━━━━━━━
Please confirm order preparation and pickup timing.`;

  window.open(getWhatsAppUrl(message), '_blank');
}

/**
 * Open WhatsApp for general questions or promotional inquiries
 */
export function openGeneralWhatsApp(topic = 'Store Enquiry & Deals') {
  const message = 
`👋 *Namaste Prem Mobile Gwalior!*

I would like to enquire about: *${topic}*.

📍 *Store:* Pinto Park, Jaderua Gate Ke Samne, Gwalior
🔥 “${storeConfig.tagline}”

Please share latest deals, Sunday Sale offers, or product availability.`;

  window.open(getWhatsAppUrl(message), '_blank');
}
