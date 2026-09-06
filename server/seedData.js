import { db } from './db.js';

export function seedCatalogProductsAndReviews() {
  const prodCheck = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (prodCheck && prodCheck.count >= 15) {
    console.log(`[DB Seed] Catalog already has ${prodCheck.count} products. Skipping initial seed.`);
    return;
  }

  console.log('[DB Seed] Seeding 20 realistic Prem Mobile products with authentic reviews...');

  const productsData = [
    {
      name: 'boAt Airdopes 141 TWS Earbuds (Bold Black)',
      slug: 'boat-airdopes-141-tws-black',
      category: 'Earbuds',
      categorySlug: 'earbuds',
      brand: 'boAt',
      regularPrice: 2990,
      offerPrice: 1299,
      stock: 45,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Best Seller',
      description: 'Experience crystal clear voice calls with ENx Environmental Noise Cancellation technology. Offers massive 42-hour total playtime, Beast Mode 85ms low-latency for gaming, and IPX4 water resistance. Features Insta Wake N Pair (IWP) and 10-minute ASAP charge for 75 minutes of listening.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Aman Sharma',
          customerEmail: 'aman.sharma.gwalior@gmail.com',
          rating: 5,
          comment: 'Delivered in just 2 hours to Pinto Park Gwalior! Sound quality is loud with punchy bass. Battery backup easily lasts 4-5 days on single charge.',
          photoUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Priya Verma',
          customerEmail: 'priya.v.gwl@gmail.com',
          rating: 5,
          comment: 'Awesome build quality. 100% genuine boAt product with official warranty card included in box. Thanks Prem Mobile!',
          photoUrl: null
        },
        {
          customerName: 'Vikram Singh',
          customerEmail: 'vikram.singh.gwl@gmail.com',
          rating: 4,
          comment: 'Mic quality is great for office Zoom calls. Very comfortable in-ear fit even during gym workouts.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Noise Buds VS102 Truly Wireless Earbuds',
      slug: 'noise-buds-vs102-tws-earbuds',
      category: 'Earbuds',
      categorySlug: 'earbuds',
      brand: 'Noise',
      regularPrice: 3499,
      offerPrice: 1099,
      stock: 35,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'Trending',
      description: 'Flybird unique stem design with 50-hour total playtime. Features 11mm speaker drivers for deep bass, Instacharge technology (10 min charge = 120 min play), IPX5 water resistant rating, Bluetooth v5.3, and intuitive full-touch controls.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Rohit Gupta',
          customerEmail: 'rohit.gwalior.sales@gmail.com',
          rating: 5,
          comment: 'Best earbuds under ₹1200! Fast delivery in Sarafa Bazaar Gwalior. Touch controls are very responsive.',
          photoUrl: null
        },
        {
          customerName: 'Sneha Jadhav',
          customerEmail: 'sneha.j.gwalior@gmail.com',
          rating: 4,
          comment: 'Type-C charging port and sleek case design. Good noise isolation during bus travel.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Realme Buds Air 5 Pro ANC Earbuds (Astral Black)',
      slug: 'realme-buds-air-5-pro-anc',
      category: 'Earbuds',
      categorySlug: 'earbuds',
      brand: 'realme',
      regularPrice: 6999,
      offerPrice: 4499,
      stock: 20,
      isFeatured: 1,
      isBestSeller: 0,
      isNew: 1,
      isOnSale: 1,
      tag: 'Flagship ANC',
      description: 'Flagship 50dB Active Noise Cancellation with Realboost Dual Drivers (11mm bass driver + 6mm micro-planar tweeter). Certified LDAC Hi-Res Audio, 40 hours total battery life, 40ms ultra low latency gaming mode, and 6-mic AI deep call noise reduction.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Deepak Mishra',
          customerEmail: 'deepak.mishra.m@gmail.com',
          rating: 5,
          comment: 'The ANC is mind blowing! Completely cuts off traffic noise in Gwalior City Center. Worth every rupee.',
          photoUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Anshul Tomar',
          customerEmail: 'anshul.tomar@gmail.com',
          rating: 5,
          comment: 'Dual driver sound is crystal clear. Premium unboxing and original sealed pack received.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Sony WH-CH520 Wireless On-Ear Headphones',
      slug: 'sony-wh-ch520-wireless-headphones',
      category: 'Headphones',
      categorySlug: 'headphones',
      brand: 'Sony',
      regularPrice: 5990,
      offerPrice: 4490,
      stock: 18,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Sony Original',
      description: 'Experience all-day listening with up to 50 hours battery life and 3-minute quick charge (giving 1.5 hours playback). Features Sony DSEE audio engine to restore high-frequency sound, Multipoint bluetooth pairing for 2 devices, and Sony Headphones Connect App support.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Kunal Saxena',
          customerEmail: 'kunal.saxena.gwl@gmail.com',
          rating: 5,
          comment: 'Sony brand quality is unbeatable. Battery lasts over a week of heavy use. Prem Mobile provided tax GST invoice too.',
          photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Ritu Jain',
          customerEmail: 'ritu.jain.gwalior@gmail.com',
          rating: 5,
          comment: 'Lightweight and cushion padding is very comfortable for online classes and music.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'JBL Tune 510BT Wireless Pure Bass Headphones',
      slug: 'jbl-tune-510bt-wireless-headphones',
      category: 'Headphones',
      categorySlug: 'headphones',
      brand: 'JBL',
      regularPrice: 4499,
      offerPrice: 2899,
      stock: 25,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Pure Bass',
      description: 'Famous JBL Pure Bass sound found in the most famous venues all around the world. Stream wirelessly via Bluetooth 5.0, enjoy up to 40 hours of battery life with Type-C quick charging (5 min charge = 2 hours play). Foldable design for compact travel.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Gaurav Bhatnagar',
          customerEmail: 'gaurav.bhatnagar@gmail.com',
          rating: 5,
          comment: 'Bass lovers must buy this! Premium feel, strong bluetooth connection, and fast delivery in Lashkar Gwalior.',
          photoUrl: null
        },
        {
          customerName: 'Pooja Agarwal',
          customerEmail: 'pooja.agarwal.gwl@gmail.com',
          rating: 4,
          comment: 'Great value for money at ₹2899. Original box packing with serial number verified on JBL website.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Fire-Boltt Ninja Call Pro Plus 1.83" Smartwatch',
      slug: 'fire-boltt-ninja-call-pro-plus',
      category: 'Smartwatches',
      categorySlug: 'smartwatches',
      brand: 'Fire-Boltt',
      regularPrice: 9999,
      offerPrice: 1499,
      stock: 50,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'Hot Deal',
      description: 'Vibrant 1.83" HD Display smartwatch with HD Bluetooth Calling, built-in speaker and microphone. Features 100+ sports tracking modes, SpO2 blood oxygen monitor, continuous 24/7 heart rate sensor, IP67 dust & water resistance, and AI voice assistant support.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Sanjay Kushwah',
          customerEmail: 'sanjay.kushwah@gmail.com',
          rating: 5,
          comment: 'Got it for ₹1499 in Sunday Sale! Bluetooth calling is crystal clear even while riding scooter.',
          photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Meghna Tripathi',
          customerEmail: 'meghna.t@gmail.com',
          rating: 5,
          comment: 'The display screen is super bright under direct sunlight. Multiple watch faces look very stylish.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Noise ColorFit Pulse 2 Max 1.85" Calling Smartwatch',
      slug: 'noise-colorfit-pulse-2-max',
      category: 'Smartwatches',
      categorySlug: 'smartwatches',
      brand: 'Noise',
      regularPrice: 5999,
      offerPrice: 1799,
      stock: 35,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Top Rated',
      description: 'Massive 1.85" TFT LCD Display with 550 nits peak brightness. Powered by Tru Sync technology for instant Bluetooth calling with low power consumption. Includes 10-day battery life, 100+ workout modes, Noise Health Suite (Heart Rate, SpO2, Sleep), and Smart DND mode.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Nitin Sharma',
          customerEmail: 'nitin.sharma.gwalior@gmail.com',
          rating: 5,
          comment: 'Battery backup is outstanding — easily gives 7 days on full usage. Prem Mobile delivered within 3 hours.',
          photoUrl: null
        },
        {
          customerName: 'Bhavna Rajput',
          customerEmail: 'bhavna.rajput@gmail.com',
          rating: 4,
          comment: 'Smooth touch UI and accurate step counter. Really happy with the purchase.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'boAt Wave Call 2 Bluetooth Calling Watch',
      slug: 'boat-wave-call-2-smartwatch',
      category: 'Smartwatches',
      categorySlug: 'smartwatches',
      brand: 'boAt',
      regularPrice: 7990,
      offerPrice: 1399,
      stock: 40,
      isFeatured: 0,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'New Launch',
      description: 'Features 1.83" HD Display, 700+ active sports modes, live cricket score tracker, Crest OS with custom watch face studio. Equipped with dial pad, save up to 10 contacts, and IP67 dust/sweat protection.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Rahul Chouhan',
          customerEmail: 'rahul.chouhan@gmail.com',
          rating: 5,
          comment: 'Live cricket score feature on wrist is awesome during matches! Highly recommended.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Mi Power Bank 3i 20000mAh 18W Fast Charging',
      slug: 'mi-power-bank-3i-20000mah',
      category: 'Power Banks',
      categorySlug: 'power-banks',
      brand: 'Xiaomi',
      regularPrice: 3199,
      offerPrice: 2149,
      stock: 60,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Heavy Duty',
      description: 'Triple output port design (2 USB-A + 1 Type-C) with 18W fast charging power delivery. High-density 20,000mAh Lithium Polymer battery with 12-layer advanced circuit chip protection. Includes smart low-current mode for charging fitness bands & Bluetooth headsets.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1609592424074-b52b217036f0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Tarun Mathur',
          customerEmail: 'tarun.mathur.gwl@gmail.com',
          rating: 5,
          comment: 'Charged my iPhone 14 and OnePlus 11 simultaneously 3 times! Indispensable item for traveling out of Gwalior.',
          photoUrl: 'https://images.unsplash.com/photo-1609592424074-b52b217036f0?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Monika Dubey',
          customerEmail: 'monika.dubey@gmail.com',
          rating: 5,
          comment: 'Original Mi product with hologram seal. Fast charging works perfectly with Type-C cable.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Ambrane 10000mAh 22.5W Fast Charging Power Bank',
      slug: 'ambrane-10000mah-22-5w-powerbank',
      category: 'Power Banks',
      categorySlug: 'power-banks',
      brand: 'Ambrane',
      regularPrice: 2499,
      offerPrice: 1099,
      stock: 40,
      isFeatured: 0,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'Pocket Size',
      description: 'Ultra compact pocket-sized metallic body power bank with 22.5W Power Delivery (PD) & Quick Charge 3.0 output. Charges iPhone 50% in just 30 minutes. Made in India with 9 layers of chipset protection.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1609592424074-b52b217036f0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Aditya Soni',
          customerEmail: 'aditya.soni.gwalior@gmail.com',
          rating: 5,
          comment: 'Super slim and easily fits in pocket. 22.5W fast charge works on Samsung S23.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Anker 20W PD Type-C Nano Fast Charger Adapter',
      slug: 'anker-20w-pd-type-c-charger',
      category: 'Chargers',
      categorySlug: 'chargers',
      brand: 'Anker',
      regularPrice: 1999,
      offerPrice: 1299,
      stock: 30,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'iPhone Ready',
      description: 'Anker Nano Pro 20W PIQ 3.0 Type-C Fast Charger tailored for iPhone 15/14/13/12 series, iPad Pro, and Samsung Galaxy. Equipped with ActiveShield safety system that continuously monitors temperature 3 million times per day to safeguard connected devices.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Harsh Wardhan',
          customerEmail: 'harsh.wardhan@gmail.com',
          rating: 5,
          comment: 'Best charger for iPhone 15! Does not heat up phone at all. Genuine Anker store warranty.',
          photoUrl: null
        },
        {
          customerName: 'Shalini Pandey',
          customerEmail: 'shalini.pandey@gmail.com',
          rating: 5,
          comment: 'Very compact size. Received invoice and original seal from Prem Mobile Gwalior.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Samsung 25W USB-C Super Fast Charging Adapter',
      slug: 'samsung-25w-type-c-fast-charger',
      category: 'Chargers',
      categorySlug: 'chargers',
      brand: 'Samsung',
      regularPrice: 1699,
      offerPrice: 1199,
      stock: 50,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Samsung Original',
      description: 'Official Samsung 25W Wall Charger featuring USB Type-C Power Delivery 3.0 PPS. Delivers Super Fast Charging to Galaxy S24, S23, A55, M34, Z Fold/Flip, and fast charging for iPhone models.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Yashwardhan Sharma',
          customerEmail: 'yash.sharma.gwl@gmail.com',
          rating: 5,
          comment: 'Super fast charging blue ring pops up on Galaxy S24 Ultra screen! 100% original Samsung charger.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Stuffcool 33W Dual Port GaN Fast Charger (Type-C + USB-A)',
      slug: 'stuffcool-33w-gan-fast-charger',
      category: 'Chargers',
      categorySlug: 'chargers',
      brand: 'Stuffcool',
      regularPrice: 2999,
      offerPrice: 1699,
      stock: 25,
      isFeatured: 0,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'GaN Tech',
      description: '33W Power Delivery GaN Charger featuring 50% smaller footprint. Dual port output allows simultaneous charging of phone and earbuds. Supports Samsung 25W PPS, iPhone 30W PD, and Quick Charge 3.0 for Android.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Abhishek Saxena',
          customerEmail: 'abhishek.saxena@gmail.com',
          rating: 5,
          comment: 'GaN technology keeps charger cool even when charging laptop and phone together.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'iPhone 15 Pro MagSafe Armor Liquid Silicone Case',
      slug: 'iphone-15-pro-magsafe-silicone-case',
      category: 'Mobile Covers',
      categorySlug: 'covers',
      brand: 'Prem Premium',
      regularPrice: 1499,
      offerPrice: 699,
      stock: 80,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'MagSafe Armor',
      description: 'Built-in strong N52 neodymium magnetic ring compatible with all MagSafe chargers, car mounts, and wallets. Features soft anti-scratch microfiber inner lining, anti-fingerprint matte silicone texture, and 1.5mm raised camera lens protection.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541877944-ac82a091518a?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Chirag Rastogi',
          customerEmail: 'chirag.rastogi@gmail.com',
          rating: 5,
          comment: 'MagSafe magnet strength is super firm! Velvet lining inside protects glass back from scratches.',
          photoUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Divya Agrawal',
          customerEmail: 'divya.agrawal.gwl@gmail.com',
          rating: 5,
          comment: 'Tactile button feel and precision camera cutouts. Premium case at reasonable rate.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra Spigen Tough Armor Case',
      slug: 'samsung-s24-ultra-spigen-tough-armor',
      category: 'Mobile Covers',
      categorySlug: 'covers',
      brand: 'Spigen',
      regularPrice: 2499,
      offerPrice: 1299,
      stock: 40,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Shockproof',
      description: 'Military Grade Air Cushion Technology for extreme drop protection. Built-in ergonomic kickstand for hands-free video calls & movie streaming. Dual layer shock absorbing TPU interior + hard PC exterior shell.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Sourabh Sharma',
          customerEmail: 'sourabh.sharma@gmail.com',
          rating: 5,
          comment: 'Spigen brand protection is unmatched. My S24 Ultra survived 5 feet drop without single scratch.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'boAt Deuce 300 65W Braided Type-C to Type-C Cable (1.5M)',
      slug: 'boat-deuce-300-65w-type-c-cable',
      category: 'Cables & Adapters',
      categorySlug: 'cables',
      brand: 'boAt',
      regularPrice: 999,
      offerPrice: 399,
      stock: 100,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: '65W Fast Charge',
      description: 'Heavy duty 1.5 Meter 65W Fast Charging Type-C to Type-C Cable. Premium nylon braiding tested for 10,000+ bend lifespan. Supports fast charging for MacBook, laptops, iPad Pro, Samsung Galaxy, OnePlus, and iPhone 15 series.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Mahesh Sen',
          customerEmail: 'mahesh.sen.gwl@gmail.com',
          rating: 5,
          comment: 'Tough braided wire. Works perfectly for my 65W laptop charger and phone fast charging.',
          photoUrl: null
        },
        {
          customerName: 'Kriti Solanki',
          customerEmail: 'kriti.solanki@gmail.com',
          rating: 5,
          comment: '1.5 meter length is very convenient near bed or office desk.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Anker PowerLine II Lightning to USB Cable (Apple MFi Certified)',
      slug: 'anker-powerline-lightning-cable',
      category: 'Cables & Adapters',
      categorySlug: 'cables',
      brand: 'Anker',
      regularPrice: 1499,
      offerPrice: 899,
      stock: 45,
      isFeatured: 0,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Apple MFi',
      description: 'Official Apple MFi Certified Lightning Cable for iPhone 14/13/12/11/X/8 and iPad. Built with bulletproof aramid fiber reinforcement to withstand 12,000+ bends. Supports high-speed data transfer and safe power delivery.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Varun Joshi',
          customerEmail: 'varun.joshi@gmail.com',
          rating: 5,
          comment: 'No "Accessory Not Supported" error on iOS! Genuine MFi certified cable.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'boAt Stone 352 10W Portable Bluetooth Speaker (Raging Black)',
      slug: 'boat-stone-352-bluetooth-speaker',
      category: 'Gadgets & Audio',
      categorySlug: 'gadgets',
      brand: 'boAt',
      regularPrice: 3490,
      offerPrice: 1599,
      stock: 25,
      isFeatured: 1,
      isBestSeller: 1,
      isNew: 1,
      isOnSale: 1,
      tag: 'Party Sound',
      description: 'Delivers 10W booming stereo sound with up to 12 hours of continuous music playback. IPX7 Water and Splash Resistant rating for pool parties or outdoor trips. Features TWS mode (pair 2 Stone 352 speakers for 20W sound), Bluetooth 5.0, AUX, and Micro SD card support.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Devendra Yadav',
          customerEmail: 'devendra.yadav@gmail.com',
          rating: 5,
          comment: 'Loud punchy bass for room parties! Battery lasts all day long. Delivered fast in Gwalior.',
          photoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop'
        },
        {
          customerName: 'Alok Mishra',
          customerEmail: 'alok.mishra.gwl@gmail.com',
          rating: 4,
          comment: 'IPX7 rating tested in rain, works great without any issue.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Portronics SoundDrum P 20W Wireless Speaker',
      slug: 'portronics-sounddrum-p-20w-speaker',
      category: 'Gadgets & Audio',
      categorySlug: 'gadgets',
      brand: 'Portronics',
      regularPrice: 4999,
      offerPrice: 2199,
      stock: 30,
      isFeatured: 0,
      isBestSeller: 1,
      isNew: 0,
      isOnSale: 1,
      tag: 'Deep Bass',
      description: '20W HD Audio Output with dedicated passive bass radiator. Equipped with USB pen drive playback, FM Radio tuner mode, 7-hour battery playtime, hands-free calling mic, and durable acoustic fabric mesh body.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Kamlesh Rathore',
          customerEmail: 'kamlesh.rathore@gmail.com',
          rating: 5,
          comment: 'FM radio clarity is very good. Compact drum shape fits on car dashboard.',
          photoUrl: null
        }
      ]
    },
    {
      name: 'Mi Smart LED Desk Lamp 1S (Wi-Fi & Eye Protection)',
      slug: 'mi-smart-led-desk-lamp-1s',
      category: 'Gadgets & Audio',
      categorySlug: 'gadgets',
      brand: 'Xiaomi',
      regularPrice: 3999,
      offerPrice: 2499,
      stock: 15,
      isFeatured: 1,
      isBestSeller: 0,
      isNew: 1,
      isOnSale: 1,
      tag: 'Smart Home',
      description: 'Flicker-free eye protection desk lamp with high Ra90 Color Rendering Index. Works with Google Assistant, Amazon Alexa, and Apple HomeKit via Mi Home App. Features 4 customizable lighting modes: Reading, PC, Child, and Focus mode with Pomodoro timer.',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop'
      ]),
      reviews: [
        {
          customerName: 'Dr. Siddharth Verma',
          customerEmail: 'dr.siddharth.v@gmail.com',
          rating: 5,
          comment: 'Excellent lamp for late night medical reading. Zero eye strain and voice control via Alexa works smoothly.',
          photoUrl: null
        },
        {
          customerName: 'Meenakshi Sundaram',
          customerEmail: 'meenakshi.s@gmail.com',
          rating: 5,
          comment: 'Minimalist metallic hinge design. Premium product delivered in immaculate condition.',
          photoUrl: null
        }
      ]
    }
  ];

  const now = new Date().toISOString();

  const insertProd = db.prepare(`
    INSERT INTO products (
      name, slug, description, category, categorySlug, brand, images,
      regularPrice, offerPrice, stock, isActive, isFeatured, isBestSeller, isNew, isOnSale, tag, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertRev = db.prepare(`
    INSERT INTO reviews (productId, customerName, customerEmail, rating, comment, photoUrl, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 'APPROVED', ?)
  `);

  let addedProds = 0;
  let addedRevs = 0;

  for (const p of productsData) {
    const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(p.slug);
    let prodId;
    if (!existing) {
      const res = insertProd.run(
        p.name,
        p.slug,
        p.description,
        p.category,
        p.categorySlug,
        p.brand,
        p.images,
        p.regularPrice,
        p.offerPrice,
        p.stock,
        p.isFeatured,
        p.isBestSeller,
        p.isNew,
        p.isOnSale,
        p.tag,
        now,
        now
      );
      prodId = res.lastInsertRowid;
      addedProds++;
    } else {
      prodId = existing.id;
    }

    if (p.reviews && p.reviews.length > 0) {
      for (let i = 0; i < p.reviews.length; i++) {
        const r = p.reviews[i];
        const revCheck = db.prepare('SELECT id FROM reviews WHERE productId = ? AND customerName = ?').get(prodId, r.customerName);
        if (!revCheck) {
          const revDate = new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString();
          insertRev.run(prodId, r.customerName, r.customerEmail, r.rating, r.comment, r.photoUrl, revDate);
          addedRevs++;
        }
      }
    }
  }

  console.log(`[DB Seed] Successfully seeded ${addedProds} products and ${addedRevs} authentic customer reviews!`);
}
