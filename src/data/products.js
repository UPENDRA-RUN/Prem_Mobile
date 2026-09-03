export const products = [
  // --- FIRST 6 FEATURED PRODUCTS ---
  {
    id: 1,
    name: "boAt Airdopes 161",
    brand: "boAt",
    category: "Earbuds",
    categorySlug: "earbuds",
    price: 999,
    originalPrice: 1249,
    discount: 20,
    rating: 4.8,
    reviewsCount: 128,
    image: "/images/products/boat-airdopes-161.jpg",
    images: [
      "/images/products/boat-airdopes-161.jpg"
    ],
    description: "boAt Airdopes 161 TWS Earbuds with 40H Playtime, ASAP Charge (10 mins = 180 mins), 10mm Drivers for Deep Bass, Type-C Interface and IPX5 Water Resistance.",
    features: [
      "Up to 40 Hours total playback time",
      "ASAP Charge: 10 mins charge gives 180 mins playtime",
      "10mm Dynamic Audio Drivers with boAt Signature Bass",
      "IPX5 Sweat and Water Resistance",
      "Type-C Quick Charging Port"
    ],
    variants: {
      color: ["Pebble Black", "Denim Blue", "Almond Cream"],
      style: ["Standard Fit", "Sport Wingtips"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: false,
    tag: "Hot Deal"
  },
  {
    id: 2,
    name: "boAt Rockerz 255 Pro+",
    brand: "boAt",
    category: "Headphones",
    categorySlug: "headphones",
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    rating: 4.7,
    reviewsCount: 96,
    image: "/images/products/boat-rockerz-255.jpg",
    images: [
      "/images/products/boat-rockerz-255.jpg"
    ],
    description: "boAt Rockerz 255 Pro+ Wireless Bluetooth Neckband with up to 60 Hours Playtime, ASAP Charge, IPX7 Water & Sweat Resistance, and 10mm Drivers.",
    features: [
      "Massive 60 Hours battery playback",
      "10 mins charge = 10 Hours playback with ASAP Charge",
      "Qualcomm aptX Audio Technology",
      "IPX7 Water and Sweat Resistance rating",
      "Magnetic smart earbuds with ergonomic fit"
    ],
    variants: {
      color: ["Active Black", "Navy Blue", "Teal Green"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: false,
    tag: "Best Seller"
  },
  {
    id: 3,
    name: "boAt Wave Ultima Call",
    brand: "boAt",
    category: "Smartwatches",
    categorySlug: "smartwatches",
    price: 1399,
    originalPrice: 1799,
    discount: 22,
    rating: 4.6,
    reviewsCount: 76,
    image: "/images/products/boat-wave-call.jpg",
    images: [
      "/images/products/boat-wave-call.jpg"
    ],
    description: "boAt Wave Ultima Call Smartwatch with 1.83-inch HD Display, Advanced Bluetooth Calling, Ultra-seamless dialpad, 100+ Sports modes and 24x7 Heart Rate & SpO2 tracker.",
    features: [
      "1.83-inch HD Bright Touch Display",
      "Clear Bluetooth Calling with Built-in Speaker & Mic",
      "100+ Active Sports Modes",
      "Heart Rate, SpO2 & Sleep Health Tracking",
      "IP68 Dust, Sweat and Splash Resistance"
    ],
    variants: {
      color: ["Charcoal Black", "Deep Blue", "Rose Gold"],
      strap: ["Silicone Band", "Metal Mesh Strap"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: true,
    tag: "Trending"
  },
  {
    id: 4,
    name: "Noise Buds VS104",
    brand: "Noise",
    category: "Earbuds",
    categorySlug: "earbuds",
    price: 899,
    originalPrice: 1099,
    discount: 22,
    rating: 4.5,
    reviewsCount: 76,
    image: "/images/products/noise-buds-vs104.jpg",
    images: [
      "/images/products/noise-buds-vs104.jpg"
    ],
    description: "Noise Buds VS104 Truly Wireless Earbuds with 45-Hour Playtime, Quad Mic with Environmental Noise Cancellation (ENC), Instacharge and 13mm Driver.",
    features: [
      "45 Hours Total Playtime with charging case",
      "Quad Mic with ENC for ultra-clear calling",
      "13mm Driver for powerful bass acoustics",
      "Instacharge: 10 min charge = 200 min playtime",
      "Ultra-low latency gaming mode"
    ],
    variants: {
      color: ["Charcoal Black", "Snow White", "Mint Green"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: false,
    tag: "Budget King"
  },
  {
    id: 5,
    name: "Mi Power Bank 3i 20000mAh",
    brand: "Xiaomi",
    category: "Power Banks",
    categorySlug: "power-banks",
    price: 1399,
    originalPrice: 1899,
    discount: 26,
    rating: 4.8,
    reviewsCount: 88,
    image: "/images/products/mi-powerbank-20k.jpg",
    images: [
      "/images/products/mi-powerbank-20k.jpg"
    ],
    description: "Mi Power Bank 3i 20000mAh with 18W Fast Charging, Triple Output Ports (2x USB-A + 1x Type-C), Dual Input (Micro-USB + Type-C) and 12-layer Circuit Protection.",
    features: [
      "20000mAh High-Density Lithium Polymer Battery",
      "18W Fast Two-Way Quick Charge",
      "Triple Output Ports: Charge 3 devices simultaneously",
      "Dual Input: Type-C and Micro-USB ports",
      "12-Layer Advanced Circuit Protection"
    ],
    variants: {
      color: ["Matte Black", "Sandstone White"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: false,
    tag: "Top Rated"
  },
  {
    id: 6,
    name: "Fire-Boltt Ninja Calling Pro",
    brand: "Fire-Boltt",
    category: "Smartwatches",
    categorySlug: "smartwatches",
    price: 1599,
    originalPrice: 1999,
    discount: 26,
    rating: 4.6,
    reviewsCount: 112,
    image: "/images/products/fireboltt-ninja.jpg",
    images: [
      "/images/products/fireboltt-ninja.jpg"
    ],
    description: "Fire-Boltt Ninja Calling Pro Smartwatch with 1.69-inch Display, Bluetooth Calling, AI Voice Assistant, 120 Sports Modes, SpO2 & Heart Rate Monitoring.",
    features: [
      "1.69-inch HD Full Touch Colour Display",
      "Bluetooth Calling with Inbuilt Mic & Speaker",
      "AI Voice Assistant (Google Assistant & Siri compatible)",
      "120 Sports Modes & Health Suite",
      "IP67 Water Resistant metal casing"
    ],
    variants: {
      color: ["Black Metal", "Gold Pink", "Dark Green"]
    },
    availability: "In Stock at Store",
    isFeatured: true,
    isNew: true,
    tag: "Hot Deal"
  },

  // --- SMARTPHONES & OTHER PRODUCTS ---
  {
    id: 7,
    name: "Realme 12 Pro 5G",
    brand: "Realme",
    category: "Smartphones",
    categorySlug: "smartphones",
    price: 23999,
    originalPrice: 28999,
    discount: 17,
    rating: 4.6,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Luxury watch design with Sony IMX882 OIS portrait camera, Snapdragon 6 Gen 1 5G processor, 120Hz Curved AMOLED display, and 67W SUPERVOOC charging.",
    features: [
      "6.7-inch 120Hz Curved AMOLED Display",
      "Sony IMX882 OIS Camera + 32MP Telephoto",
      "Snapdragon 6 Gen 1 High Speed 5G",
      "5000mAh Battery with 67W SuperVOOC Charger"
    ],
    variants: {
      color: ["Submarine Blue", "Navigator Beige"],
      storage: ["8GB / 128GB", "8GB / 256GB", "12GB / 256GB"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: false,
    tag: "Best Seller"
  },
  {
    id: 8,
    name: "Redmi Note 13 5G",
    brand: "Xiaomi",
    category: "Smartphones",
    categorySlug: "smartphones",
    price: 16999,
    originalPrice: 19999,
    discount: 15,
    rating: 4.5,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Super-slim 5G powerhouse featuring a 108MP 3X in-sensor zoom triple camera, MediaTek Dimensity 6080 chipset, and 120Hz AMOLED with ultra-slim bezels.",
    features: [
      "108MP Pro-grade Triple Rear Camera",
      "MediaTek Dimensity 6080 5G Processor",
      "6.67-inch FHD+ 120Hz AMOLED Screen",
      "33W Fast Turbo Charger with 5000mAh Battery"
    ],
    variants: {
      color: ["Arctic White", "Stealth Black", "Prism Gold"],
      storage: ["6GB / 128GB", "8GB / 256GB"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "Hot Deal"
  },
  {
    id: 9,
    name: "Samsung Galaxy A15 5G",
    brand: "Samsung",
    category: "Smartphones",
    categorySlug: "smartphones",
    price: 19499,
    originalPrice: 22499,
    discount: 13,
    rating: 4.7,
    reviewsCount: 165,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Signature Samsung reliability with Super AMOLED 90Hz display, 50MP triple camera system, Knox Security, and 4 OS upgrades guarantee.",
    features: [
      "6.5-inch Super AMOLED 90Hz Display",
      "50MP Triple Camera Setup",
      "Octa-Core 5G Processor",
      "5000mAh Long-lasting Battery"
    ],
    variants: {
      color: ["Blue Black", "Light Blue", "Personality Yellow"],
      storage: ["8GB / 128GB", "8GB / 256GB"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "New Arrival"
  },
  {
    id: 10,
    name: "Nokia 105 Dual SIM Keypad Phone",
    brand: "Nokia",
    category: "Feature Phones",
    categorySlug: "feature-phones",
    price: 1349,
    originalPrice: 1599,
    discount: 16,
    rating: 4.4,
    reviewsCount: 230,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ],
    description: "All-new compact keypad phone with wireless FM radio, long battery standby up to 12 days, torchlight and ergonomic keypad.",
    features: [
      "Wireless FM Radio with Built-in Antenna",
      "Up to 12 Hours Talk Time & 22 Days Standby",
      "Storage for up to 2000 contacts and 500 SMS",
      "Built-in Bright LED Flashlight"
    ],
    variants: {
      color: ["Cyan", "Black", "Red"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: false,
    tag: "Essential"
  },
  {
    id: 11,
    name: "boAt Bassheads 90C Wired Earphones",
    brand: "boAt",
    category: "Earbuds",
    categorySlug: "earbuds",
    price: 350,
    originalPrice: 999,
    discount: 65,
    rating: 4.9,
    reviewsCount: 310,
    image: "/images/boat-basshead.jpg",
    images: [
      "/images/boat-basshead.jpg"
    ],
    description: "Official Prem Mobile Deal! boAt Bassheads 90C Wired Earphones with Super Extra Bass, HD in-line mic, and tangle-free cable.",
    features: [
      "Type-C & 3.5mm Universal Compatibility",
      "Super Extra Punchy Bass Sound Output",
      "HD Microphone with one-button call control",
      "Comfort fit ergonomic ear tips"
    ],
    variants: {
      style: ["Type-C Jack", "3.5mm Audio Jack"],
      color: ["Raging Red", "Furious Black"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "Store Special Deal"
  },
  {
    id: 12,
    name: "Automatic Electric Egg Boiler 7-Egg",
    brand: "Tri-Star",
    category: "Gadgets",
    categorySlug: "gadgets",
    price: 380,
    originalPrice: 799,
    discount: 52,
    rating: 4.8,
    reviewsCount: 195,
    image: "/images/egg-boiler.jpg",
    images: [
      "/images/egg-boiler.jpg"
    ],
    description: "Official Prem Mobile Store Promotion! Compact automatic electric egg boiler with 7-egg capacity, fast boiling in 6 mins, and auto cut-off safety.",
    features: [
      "7 Eggs Capacity with egg piercing pin",
      "Fast 6-Minute Boiling Technology",
      "Automatic Cut-Off for over-temperature protection",
      "Stainless Steel heating plate"
    ],
    variants: {
      color: ["Canary Yellow", "Soft Pink", "Mint Blue"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "Store Special Deal"
  },
  {
    id: 13,
    name: "Moto Vlogging Chest Mount Harness",
    brand: "ActionPro",
    category: "Gadgets",
    categorySlug: "gadgets",
    price: 499,
    originalPrice: 999,
    discount: 50,
    rating: 4.7,
    reviewsCount: 140,
    image: "/images/moto-vlogging.jpg",
    images: [
      "/images/moto-vlogging.jpg"
    ],
    description: "Universal Moto Vlogging Chest Harness Mount for Action Cameras & Smartphones. Ultra-secure adjustable straps with dual J-hook.",
    features: [
      "Dual Mount for GoPro, Action Cams & All Smartphones",
      "360-degree rotation bracket with angle lock",
      "Heavy-duty elastic breathable harness",
      "Perfect for motorcycle riding and outdoor POV recording"
    ],
    variants: {
      style: ["Standard Harness", "Pro Padded Harness"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "Rider Gear"
  },
  {
    id: 14,
    name: "AGARO Grooming & Lifestyle Collection",
    brand: "AGARO",
    category: "Gadgets",
    categorySlug: "gadgets",
    price: 1299,
    originalPrice: 2199,
    discount: 40,
    rating: 4.8,
    reviewsCount: 180,
    image: "/images/agaro-products.jpg",
    images: [
      "/images/agaro-products.jpg"
    ],
    description: "AGARO Lifestyle & Grooming Tech collection available at Prem Mobile Gwalior. High-torque copper motor blenders, choppers, and beard trimmers with 1-Year Brand Warranty.",
    features: [
      "100% Copper Motor with Stainless Steel Blades",
      "1-Year Official Brand Warranty",
      "Multipurpose personal blender & chopper combo",
      "Food-grade BPA free jars"
    ],
    variants: {
      type: ["Cordless Trimmer Set", "Nutri Blender 400W"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: true,
    tag: "Store Special Deal"
  },
  {
    id: 15,
    name: "boAt Rockerz 450 Bluetooth On-Ear Headphones",
    brand: "boAt",
    category: "Headphones",
    categorySlug: "headphones",
    price: 1499,
    originalPrice: 3990,
    discount: 62,
    rating: 4.6,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    description: "40mm drivers for punchy HD sound, up to 15 hours battery playtime, lightweight padded ear cushions and dual modes (Bluetooth + AUX).",
    features: [
      "40mm Dynamic HD Audio Drivers",
      "Up to 15 Hours Playback Time",
      "Plush Padded Earcups & Foldable Design"
    ],
    variants: {
      color: ["Lush Black", "Hazel Beige", "Aqua Blue"]
    },
    availability: "In Stock at Store",
    isFeatured: false,
    isNew: false,
    tag: "Best Seller"
  },

  // --- SUGGESTED COMPLEMENTARY ADD-ONS ---
  {
    id: 101,
    name: "9H UV Curved Tempered Screen Protector",
    brand: "Prem Care",
    category: "Accessories",
    categorySlug: "accessories",
    price: 199,
    originalPrice: 499,
    discount: 60,
    rating: 4.9,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-clear scratch-resistant 9H hardness tempered glass with oleophobic coating. Free professional fitting at Pinto Park store!",
    features: ["Free In-Store Fitting", "9H Scratch Proof", "Oleophobic Anti-Fingerprint"],
    isAddon: true,
    availability: "In Stock at Store",
    tag: "Recommended Add-on"
  },
  {
    id: 102,
    name: "25W Type-C Super Fast Power Adapter",
    brand: "Prem Care",
    category: "Accessories",
    categorySlug: "accessories",
    price: 499,
    originalPrice: 1299,
    discount: 61,
    rating: 4.8,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    description: "Power Delivery (PD 3.0) fast charger for Samsung, iPhone, Xiaomi, and Realme. Overheat & surge protection.",
    features: ["25W Fast Charge", "PD 3.0 Standard", "Multi-layer Safety"],
    variants: {
      color: ["Pure White", "Jet Black"]
    },
    isAddon: true,
    availability: "In Stock at Store",
    tag: "Recommended Add-on"
  },
  {
    id: 103,
    name: "Shockproof Anti-Drop Armor Case",
    brand: "Prem Care",
    category: "Accessories",
    categorySlug: "accessories",
    price: 249,
    originalPrice: 599,
    discount: 58,
    rating: 4.7,
    reviewsCount: 280,
    image: "https://images.unsplash.com/photo-1541877944-ac82a091518a?auto=format&fit=crop&w=800&q=80",
    description: "Military-grade drop test certified protective case with air-cushioned corners and tactile buttons.",
    features: ["Air Cushion Protection", "Raised Camera Lip", "Non-slip Grip"],
    variants: {
      color: ["Smokey Black", "Clear Transparent", "Navy Matte"]
    },
    isAddon: true,
    availability: "In Stock at Store",
    tag: "Recommended Add-on"
  },
  {
    id: 104,
    name: "Braided 65W Fast Charging Type-C Cable (1.5m)",
    brand: "Prem Care",
    category: "Accessories",
    categorySlug: "accessories",
    price: 179,
    originalPrice: 399,
    discount: 55,
    rating: 4.9,
    reviewsCount: 190,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "Heavy-duty nylon braided fast charging cable supporting up to 65W power output and 480Mbps high-speed data sync.",
    features: ["Nylon Braided Tough Cable", "65W High Power Output", "480Mbps Data Sync"],
    variants: {
      color: ["Black Braided", "Red Braided"]
    },
    isAddon: true,
    availability: "In Stock at Store",
    tag: "Recommended Add-on"
  }
];
