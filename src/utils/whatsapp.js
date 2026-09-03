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
 * Open WhatsApp with single product enquiry
 * @param {object} product 
 * @param {string} customNote 
 */
export function openProductWhatsApp(product, customNote = '') {
  const message = 
`Hello Prem Mobile,
I am interested in:
*${product.name}*
Brand: ${product.brand || 'Prem Mobile'}
Price: ₹${product.price?.toLocaleString('en-IN') || ''}
Store Tagline: “${storeConfig.tagline}”

${customNote ? `${customNote}\n` : ''}Please share availability and store pickup details at Pinto Park, Gwalior.`;

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
      return `${idx + 1}. *${item.name}*${variantStr} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
    })
    .join('\n');

  const promoLine = appliedPromo && promoDiscount > 0
    ? `\n*Applied Coupon (${appliedPromo.code}):* -₹${promoDiscount.toLocaleString('en-IN')}`
    : '';

  const message = 
`Hello Prem Mobile (Gwalior),
I would like to place an order / enquiry for the following items from my cart:

${itemList}

-------------------------
*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}${promoLine}
*Total Estimated Amount:* ₹${totalPayable.toLocaleString('en-IN')}
*Tagline:* “${storeConfig.tagline}”
-------------------------

Please confirm item availability and store pickup or delivery options at Pinto Park, Gwalior.`;

  window.open(getWhatsAppUrl(message), '_blank');
}

/**
 * Open WhatsApp for general questions or promotional inquiries
 */
export function openGeneralWhatsApp(topic = 'Store Enquiry & Deals') {
  const message = 
`Hello Prem Mobile,
I would like to enquire about: *${topic}*.

Please assist me with product availability, Sunday Sale deals, or directions to Pinto Park, Gwalior store.`;

  window.open(getWhatsAppUrl(message), '_blank');
}
