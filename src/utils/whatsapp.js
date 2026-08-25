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

${customNote ? `My Note: ${customNote}\n` : ''}Please share availability and store pickup details at Pinto Park, Gwalior.`;

  window.open(getWhatsAppUrl(message), '_blank');
}

/**
 * Open WhatsApp with cart items enquiry
 * @param {Array} cartItems 
 * @param {number} totalAmount 
 */
export function openCartWhatsApp(cartItems, totalAmount) {
  if (!cartItems || cartItems.length === 0) return;

  const itemList = cartItems
    .map((item, idx) => `${idx + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  const message = 
`Hello Prem Mobile (Gwalior),
I would like to enquire about the following items from my cart:

${itemList}

-------------------------
*Total Estimated Amount:* ₹${totalAmount.toLocaleString('en-IN')}
*Tagline:* “${storeConfig.tagline}”
-------------------------

Please let me know availability for store pickup or delivery at Pinto Park, Gwalior.`;

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
