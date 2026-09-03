export const faqCategories = [
  {
    id: "pickup-services",
    title: "Store Pickup & Free Services",
    icon: "MapPin",
    description: "Questions about visiting our Pinto Park store, free screen guard fitting, and live product testing."
  },
  {
    id: "products-warranty",
    title: "Products, Warranty & Authenticity",
    icon: "ShieldCheck",
    description: "Information about official brand warranties, product authenticity, and custom orders."
  },
  {
    id: "payments-promos",
    title: "Payments, Coupons & Pricing",
    icon: "CreditCard",
    description: "Details on accepted payment methods, promo code application, and store offer rates."
  },
  {
    id: "orders-delivery",
    title: "Orders, Delivery & Returns",
    icon: "Truck",
    description: "How store pickup works, local Gwalior delivery options, and return/exchange policies."
  },
  {
    id: "sunday-deals",
    title: "Sunday Sale & Special Offers",
    icon: "Flame",
    description: "Information about our famous Gwalior Sunday Sale deals and product reservations."
  }
];

export const faqQuestions = [
  // --- Category: Store Pickup & Free Services ---
  {
    id: 1,
    categoryId: "pickup-services",
    question: "Where is Prem Mobile store located in Gwalior and what are the timings?",
    answer: "Prem Mobile is located at Jaderua Gate Ke Samne, Pinto Park, Gwalior (M.P.). Our store is open every day from 9:30 AM to 9:30 PM. You can easily find us on Google Maps by clicking the location link on our site.",
    keywords: ["location", "address", "pinto park", "timing", "hours", "open", "store", "gwalior"],
    isPopular: true
  },
  {
    id: 2,
    categoryId: "pickup-services",
    question: "Do you offer free screen guard fitting and live product testing in store?",
    answer: "Yes! Every tempered glass, UV screen protector, or phone purchased or picked up at our Pinto Park store includes 100% free bubble-free professional application. Additionally, we provide live audio testing for all earbuds, neckbands, and Bluetooth speakers before you take them home.",
    keywords: ["screen guard", "tempered glass", "fitting", "testing", "free service", "bubble free", "audio test"],
    isPopular: true
  },
  {
    id: 3,
    categoryId: "pickup-services",
    question: "Can I reserve a product online and pick it up at the Pinto Park store?",
    answer: "Absolutely! You can add products to your cart and select 'Store Pickup' during checkout or place your reservation via WhatsApp. We will hold your item at our Pinto Park store for up to 24 hours.",
    keywords: ["reserve", "pickup", "hold", "store pickup", "online order"],
    isPopular: false
  },

  // --- Category: Products, Warranty & Authenticity ---
  {
    id: 4,
    categoryId: "products-warranty",
    question: "Are all smartphones and accessories 100% original with brand warranty?",
    answer: "Yes, 100%! All smartphones (Samsung, Realme, Xiaomi, Nokia) and electronic accessories (boAt, Noise, Fire-Boltt, AGARO, Mi) sold at Prem Mobile are 100% authentic original products backed by official manufacturer warranties across authorized service centers nationwide.",
    keywords: ["original", "genuine", "authentic", "warranty", "brand warranty", "service center"],
    isPopular: true
  },
  {
    id: 5,
    categoryId: "products-warranty",
    question: "What if a product I want is out of stock or requires a custom configuration?",
    answer: "If a specific color, storage variant, or accessory model is not listed in stock, contact us via WhatsApp or phone. We receive fresh inventory daily and can arrange custom store orders within 24 to 48 hours.",
    keywords: ["out of stock", "custom order", "special request", "inventory", "color variant"],
    isPopular: false
  },
  {
    id: 6,
    categoryId: "products-warranty",
    question: "How do I claim brand warranty if my product has an issue?",
    answer: "All items come with an official GST store invoice. If you experience any technical fault during the warranty period, simply show your GST invoice at any authorized brand service center in Gwalior or bring it to our Pinto Park store for assistance.",
    keywords: ["warranty claim", "invoice", "bill", "service center", "repair", "replacement"],
    isPopular: false
  },

  // --- Category: Payments, Coupons & Pricing ---
  {
    id: 7,
    categoryId: "payments-promos",
    question: "What payment methods are accepted at Prem Mobile?",
    answer: "We accept all major payment options: Credit & Debit Cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm, BHIM), Apple Pay, PayPal, Net Banking, and Cash on Delivery / Store Cash Payment.",
    keywords: ["payment", "upi", "gpay", "phonepe", "credit card", "debit card", "cash", "paypal", "apple pay"],
    isPopular: true
  },
  {
    id: 8,
    categoryId: "payments-promos",
    question: "How do I use a promo code or discount coupon during purchase?",
    answer: "On your Cart Page or Checkout drawer, enter your coupon code (e.g., PREM10 for 10% off or GWALIOR100 for ₹100 flat discount) into the Promo Code field and click 'APPLY'. Your discount will immediately reflect in your final total.",
    keywords: ["promo code", "coupon", "discount", "prem10", "gwalior100", "offer code"],
    isPopular: true
  },
  {
    id: 9,
    categoryId: "payments-promos",
    question: "Are online prices the same as store prices?",
    answer: "Yes! Our website rates reflect our direct store offer prices in Gwalior ('Deal Aise Jo Deewana Bana De'). Special Sunday Sale discounts apply both in-store and for online enquiries.",
    keywords: ["prices", "store price", "deal", "cheap", "offer rate", "best price"],
    isPopular: false
  },

  // --- Category: Orders, Delivery & Returns ---
  {
    id: 10,
    categoryId: "orders-delivery",
    question: "Do you deliver products home in Gwalior?",
    answer: "Yes, we offer Gwalior Local Express Delivery for orders placed online or via WhatsApp. Orders placed before 4 PM are typically delivered same-day directly to your doorstep.",
    keywords: ["delivery", "home delivery", "gwalior delivery", "express", "shipping", "doorstep"],
    isPopular: true
  },
  {
    id: 11,
    categoryId: "orders-delivery",
    question: "What is the return or exchange policy for store purchases?",
    answer: "We offer a 7-day replacement guarantee for manufacturing defects. If a product has a verified technical defect within 7 days of purchase, we replace it with a brand new unit at our store.",
    keywords: ["return", "exchange", "replacement", "defect", "policy", "guarantee"],
    isPopular: true
  },

  // --- Category: Sunday Sale & Special Offers ---
  {
    id: 12,
    categoryId: "sunday-deals",
    question: "What is the Prem Mobile Sunday Special Sale?",
    answer: "Every Sunday, Prem Mobile runs massive discount offers on audio gear, smartwatches, power banks, chargers, and gadgets. Stock is limited on Sunday deals, so we recommend reserving early via WhatsApp or arriving early at Pinto Park.",
    keywords: ["sunday sale", "sunday special", "weekly deal", "discount", "bhat", "boat", "noise"],
    isPopular: true
  },

  // --- Category: Account Privacy & Deletion ---
  {
    id: 13,
    categoryId: "products-warranty",
    question: "How do I close or delete my account and data?",
    answer: "You can delete your account and saved data anytime by visiting your Account Settings page (/account) and clicking 'Delete Account & Data'. Deletion is immediate and respectful. Note: You can continue browsing and ordering products anytime as a guest without an account!",
    keywords: ["delete account", "remove data", "close account", "guest access", "privacy"],
    isPopular: true
  }
];
