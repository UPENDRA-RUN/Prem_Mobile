/**
 * Specification Extraction & Normalization Engine
 * Standardizes product specs for side-by-side comparison tables.
 */

export function extractSpecifications(product) {
  if (!product) return {};

  const name = (product.name || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  const brand = product.brand || (name.includes('boat') ? 'boAt' : name.includes('noise') ? 'Noise' : name.includes('realme') ? 'realme' : name.includes('fire-boltt') ? 'Fire-Boltt' : name.includes('boult') ? 'Boult' : name.includes('samsung') ? 'Samsung' : name.includes('apple') ? 'Apple' : 'Prem Mobile');

  // Default values based on category & name matching
  let driverSize = '10mm Dynamic Drivers';
  let batteryLife = '30 Hours Total Playtime';
  let chargingTime = '10 Mins Charge = 100 Mins Play';
  let bluetoothVersion = 'v5.3 Wireless';
  let ipRating = 'IPX4 Water Resistant';
  let warranty = '1 Year Official Brand Warranty';

  if (category.includes('earbud') || category.includes('headphone') || name.includes('airdope') || name.includes('buds') || name.includes('tws')) {
    if (name.includes('141') || name.includes('boat 141')) {
      driverSize = '8mm Pro Dynamic Drivers';
      batteryLife = '42 Hours Total Playtime';
      chargingTime = '5 Mins Charge = 75 Mins Play (ASAP Charge)';
      bluetoothVersion = 'v5.1 Fast Pair';
      ipRating = 'IPX4 Sweat & Water Resistance';
    } else if (name.includes('vs102') || name.includes('noise vs102')) {
      driverSize = '11mm Sound Drivers';
      batteryLife = '50 Hours Total Playtime';
      chargingTime = '10 Mins Charge = 120 Mins Play (Instacharge)';
      bluetoothVersion = 'v5.3 HyperSync';
      ipRating = 'IPX5 Water Resistant';
    } else if (name.includes('pro') || name.includes('anc')) {
      driverSize = '13mm Bass Boost Drivers';
      batteryLife = '40 Hours Playtime + ANC';
      chargingTime = '10 Mins Charge = 150 Mins Play';
      bluetoothVersion = 'v5.3 Dual Pairing';
      ipRating = 'IPX5 Water Resistant';
    } else {
      driverSize = '10mm Bass Drivers';
      batteryLife = '35 Hours Playtime';
      chargingTime = '10 Mins Charge = 90 Mins Play';
      bluetoothVersion = 'v5.3 Wireless';
      ipRating = 'IPX4 Sweat Resistant';
    }
  } else if (category.includes('watch') || name.includes('watch') || name.includes('fit') || name.includes('ninja')) {
    if (name.includes('ninja') || name.includes('fire-boltt')) {
      driverSize = '1.83" HD Touch Display (500 Nits)';
      batteryLife = '7 Days Active Battery Life';
      chargingTime = '2 Hours Full Charge';
      bluetoothVersion = 'v5.2 Bluetooth Calling';
      ipRating = 'IP68 Dust & Waterproof';
    } else {
      driverSize = '1.78" AMOLED Always-On Display';
      batteryLife = '7-10 Days Battery Backup';
      chargingTime = '90 Mins Fast Charge';
      bluetoothVersion = 'v5.3 Single-chip BT Calling';
      ipRating = 'IP68 Water Resistant';
    }
  } else if (category.includes('smartphones') || category.includes('phone') || name.includes('phone') || name.includes('galaxy') || name.includes('iphone') || name.includes('redmi')) {
    driverSize = '6.67" FHD+ 120Hz Display';
    batteryLife = '5000 mAh All-Day Battery';
    chargingTime = '67W Turbo Fast Charging (0-100% in 42 mins)';
    bluetoothVersion = 'v5.3 / 5G Dual SIM';
    ipRating = 'IP53 Splash Proof';
  } else if (category.includes('power') || category.includes('bank') || name.includes('power')) {
    driverSize = 'Lithium Polymer Core / Dual Ports';
    batteryLife = '10,000 mAh Capacity (3 Full Smartphone Charges)';
    chargingTime = '22.5W Fast Recharging (3.5 Hours)';
    bluetoothVersion = 'Type-C & Micro USB Input/Output';
    ipRating = 'Flame Retardant ABS Body';
  } else if (category.includes('charger') || name.includes('charger') || name.includes('adapter')) {
    driverSize = 'GaN Fast Charging IC Architecture';
    batteryLife = '33W SuperVOOC / PD Fast Charging';
    chargingTime = '0-50% in 25 Minutes';
    bluetoothVersion = 'Type-C to Type-C Braided Cable Included';
    ipRating = 'Multi-Layer Surge Protection';
  }

  return {
    id: product.id,
    name: product.name,
    brand,
    category: product.category || 'Electronics',
    price: product.price || product.currentPrice || product.regularPrice,
    originalPrice: product.originalPrice || product.regularPrice,
    discount: product.discount || 0,
    rating: product.rating || 4.8,
    reviewsCount: product.reviewsCount || 12,
    stock: product.stock > 0 ? 'In Stock at Sarafa Bazaar Store' : 'Out of Stock',
    driverSize,
    batteryLife,
    chargingTime,
    bluetoothVersion,
    ipRating,
    warranty,
    storePickup: 'Same-Day Pickup Available at Gwalior Store'
  };
}
