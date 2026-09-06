/**
 * Smart Bundle Recommendation Engine
 * Pairs products with category-matched complementary accessories.
 */

export function generateBundleAddons(mainProduct, catalogProducts = []) {
  if (!mainProduct) return { addons: [], bundleSavings: 0 };

  const category = (mainProduct.category || '').toLowerCase();
  const name = (mainProduct.name || '').toLowerCase();

  let defaultAddons = [];

  if (category.includes('earbud') || category.includes('headphone') || name.includes('airdope') || name.includes('buds') || name.includes('neckband')) {
    defaultAddons = [
      {
        id: `addon_case_${mainProduct.id}`,
        name: 'Silicone Protective Case & Carabiner Hook',
        category: 'Accessories',
        price: 249,
        regularPrice: 499,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop',
        isAddon: true
      },
      {
        id: `addon_charger_${mainProduct.id}`,
        name: '33W SuperFast Type-C Fast Charger Pack',
        category: 'Chargers',
        price: 499,
        regularPrice: 999,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop',
        isAddon: true
      }
    ];
  } else if (category.includes('watch') || name.includes('watch') || name.includes('ninja') || name.includes('colorfit')) {
    defaultAddons = [
      {
        id: `addon_strap_${mainProduct.id}`,
        name: 'Breathable Nylon Loop Sport Strap',
        category: 'Accessories',
        price: 349,
        regularPrice: 699,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop',
        isAddon: true
      },
      {
        id: `addon_guard_${mainProduct.id}`,
        name: '3D Curved Flexible Screen Guard (2-Pack)',
        category: 'Accessories',
        price: 149,
        regularPrice: 399,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
        isAddon: true
      }
    ];
  } else if (category.includes('smartphone') || category.includes('phone')) {
    defaultAddons = [
      {
        id: `addon_glass_${mainProduct.id}`,
        name: '9H Full Coverage Tempered Glass Guard',
        category: 'Accessories',
        price: 199,
        regularPrice: 499,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop',
        isAddon: true
      },
      {
        id: `addon_cover_${mainProduct.id}`,
        name: 'Clear Airbag Anti-Drop Armor Case',
        category: 'Accessories',
        price: 299,
        regularPrice: 699,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop',
        isAddon: true
      }
    ];
  } else {
    // General Power Banks & Chargers
    defaultAddons = [
      {
        id: `addon_cable_${mainProduct.id}`,
        name: 'Braided 3-in-1 Fast Charging Cable (Type-C / Lightning / Micro)',
        category: 'Accessories',
        price: 299,
        regularPrice: 599,
        image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop',
        isAddon: true
      },
      {
        id: `addon_pouch_${mainProduct.id}`,
        name: 'Hard Shell Shockproof Zipper Carrying Pouch',
        category: 'Accessories',
        price: 199,
        regularPrice: 449,
        image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&auto=format&fit=crop',
        isAddon: true
      }
    ];
  }

  // Calculate prices
  const mainPrice = Number(mainProduct.price || mainProduct.currentPrice || mainProduct.regularPrice || 0);
  const addonSum = defaultAddons.reduce((sum, item) => sum + item.price, 0);
  const rawTotal = mainPrice + addonSum;

  // Extra bundle discount ₹300 OFF when buying all 3 together
  const bundleDiscount = 300;
  const bundlePrice = Math.max(mainPrice, rawTotal - bundleDiscount);

  return {
    addons: defaultAddons,
    rawTotal,
    bundleDiscount,
    bundlePrice
  };
}
