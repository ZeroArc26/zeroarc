/**
 * FAQ DATA
 * ------------------------------------------------------------------
 * All FAQ categories, their questions/answers, and the special
 * icon-step block that appears under each category's first question.
 * ------------------------------------------------------------------
 */

export interface FaqStep {
  icon:
    | "ShoppingCart"
    | "ClipboardList"
    | "CreditCard"
    | "CheckCircle2"
    | "Building2"
    | "Landmark"
    | "Home"
    | "MapPin"
    | "CalendarCheck"
    | "Shirt"
    | "Tag"
    | "Package"
    | "Ruler"
    | "PencilRuler"
    | "ShoppingBag"
    | "UserPlus"
    | "Mail"
    | "UserCheck"
    | "ShieldCheck"
    | "MessageCircle"
    | "Headset"
    | "FileText";
  label: string;
  sub: string;
}

export interface FaqQuestion {
  q: string;
  a: string;
  steps?: FaqStep[];
}

export interface FaqCategory {
  slug: string;
  name: string;
  subtitle: string;
  icon:
    | "LayoutGrid"
    | "CreditCard"
    | "Truck"
    | "RotateCcw"
    | "Shirt"
    | "User"
    | "MoreHorizontal";
  questions: FaqQuestion[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    slug: "orders-payment",
    name: "Orders & Payment",
    subtitle:
      "Find answers to all your questions related to placing orders, payments, cancellations, invoices and more.",
    icon: "CreditCard",
    questions: [
      {
        q: "How do I place an order on ZeroArc?",
        a: "Simply browse our collections, select the products you love, add them to your cart and proceed to checkout. Fill in your details, choose a payment method and your order is confirmed!",
        steps: [
          { icon: "ShoppingCart", label: "Add to Cart", sub: "" },
          { icon: "ClipboardList", label: "Enter Details", sub: "" },
          { icon: "CreditCard", label: "Make Payment", sub: "" },
          { icon: "CheckCircle2", label: "Order Confirmed", sub: "" },
        ],
      },
      {
        q: "Which payment methods do you accept?",
        a: "We accept UPI, Credit/Debit Cards, Net Banking, popular wallets, and Cash on Delivery (COD).",
      },
      {
        q: "Is Cash on Delivery (COD) available?",
        a: "Yes, COD is available on most pincodes with a small additional charge shown at checkout.",
      },
      {
        q: "Why did my payment fail?",
        a: "Payment failures usually happen due to network issues, bank server downtime, or incorrect card/UPI details. Please try again or use a different payment method.",
      },
      {
        q: "My payment was deducted but my order was not placed. What should I do?",
        a: "Don't worry, the amount is auto-refunded within 5-7 business days. If it's not reflected, contact our support team with your transaction ID.",
      },
      {
        q: "Can I cancel or modify my order after placing it?",
        a: "You can cancel or modify your order within 2 hours of placing it, as long as it hasn't been shipped yet, from the \"My Orders\" section.",
      },
      {
        q: "When will my order be confirmed?",
        a: "Your order is confirmed instantly once payment is successful. You'll receive a confirmation email/SMS.",
      },
      {
        q: "Can I use multiple coupons on one order?",
        a: "Only one coupon or promo code can be applied per order.",
      },
      {
        q: "How do I download my invoice?",
        a: "Go to \"My Orders\", select your order, and click \"Download Invoice.\"",
      },
      {
        q: "Are there any additional charges on my order?",
        a: "No hidden charges. Shipping fees (if any) and COD charges (if applicable) are shown clearly at checkout.",
      },
    ],
  },
  {
    slug: "shipping-delivery",
    name: "Shipping & Delivery",
    subtitle:
      "Find answers to all your questions about order shipping, delivery timelines, tracking and more.",
    icon: "Truck",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Delivery time depends on your location and the shipping method selected. You can check the estimated delivery time for your pin code on the product page and at checkout.",
        steps: [
          { icon: "Building2", label: "Metro Cities", sub: "2 - 4 Business Days" },
          { icon: "Landmark", label: "Major Cities", sub: "3 - 5 Business Days" },
          { icon: "Home", label: "Other Cities", sub: "4 - 6 Business Days" },
          { icon: "MapPin", label: "Remote Areas", sub: "5 - 7 Business Days" },
        ],
      },
      {
        q: "Which courier partners do you use?",
        a: "We work with Delhivery, Blue Dart, Ekart, XpressBees, and India Post.",
      },
      {
        q: "How can I track my order?",
        a: "Once shipped, you'll receive a tracking link via email/SMS. You can also track it from \"My Orders.\"",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we only ship within India. International shipping is coming soon!",
      },
      {
        q: "Can I change my shipping address after placing the order?",
        a: "Address changes are possible only before the order is shipped. Contact support immediately if you need to update it.",
      },
      {
        q: "My order is delayed. What should I do?",
        a: "Delays can happen due to weather, courier issues, or high demand. Please allow extra time or contact our support team.",
      },
      {
        q: "What if my order is marked as delivered but I haven't received it?",
        a: "Please check with neighbors/security first, then contact our support team within 48 hours with your order ID.",
      },
      {
        q: "Do you ship on weekends or public holidays?",
        a: "Orders are not shipped or delivered on Sundays and public holidays.",
      },
      {
        q: "Is free shipping available?",
        a: "Yes! Free Shipping is available on Online Orders and Order above ₹1299 is Free Shipping For COD Orders.",
      },
      {
        q: "Can I choose a specific delivery date or time?",
        a: "Currently we don't support specific date/time slot selection, but our team ensures fastest possible delivery.",
      },
    ],
  },
  {
    slug: "returns-refunds",
    name: "Returns & Refunds",
    subtitle:
      "Everything you need to know about our return policy, eligible items, refund process and exchanges.",
    icon: "RotateCcw",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer hassle-free returns within 7 days of delivery. The product must be unused, unwashed, unaltered and in original condition with all tags and packaging intact.",
        steps: [
          { icon: "CalendarCheck", label: "7 Days", sub: "Return window from date of delivery" },
          { icon: "Shirt", label: "Unused", sub: "Product must be unused and unworn" },
          { icon: "Tag", label: "Original Tags", sub: "All tags must be intact" },
          { icon: "Package", label: "Original Packaging", sub: "Item must be returned in original packaging" },
        ],
      },
      {
        q: "How do I initiate a return?",
        a: "Go to \"My Orders\", select the item, click \"Request Return\" and choose your reason.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item.",
      },
      {
        q: "Can I exchange my product?",
        a: "Yes, exchanges are available for size/color, subject to stock availability.",
      },
      {
        q: "Are sale items returnable?",
        a: "Sale/discounted items are final sale and not eligible for return unless defective.",
      },
      {
        q: "What if I received a damaged or defective product?",
        a: "Please raise a return request within 48 hours of delivery with photos of the damage, and we'll arrange a free replacement or refund.",
      },
      {
        q: "What if I received the wrong product?",
        a: "We apologize for the inconvenience — raise a return request immediately and we'll send the correct item at no extra cost.",
      },
      {
        q: "How long does it take to process a return?",
        a: "Once picked up, returns are inspected and processed within 5-7 business days.",
      },
      {
        q: "Who will pay for the return shipping?",
        a: "Return shipping is free for defective/wrong items. For other reasons, a small pickup fee may apply.",
      },
      {
        q: "Can I cancel my return request?",
        a: "Yes, you can cancel a return request anytime before the item is picked up, from \"My Orders.\"",
      },
    ],
  },
  {
    slug: "product-sizing",
    name: "Product & Sizing",
    subtitle:
      "Find answers to all your questions about fabric, fit, sizing, care instructions and product quality.",
    icon: "Shirt",
    questions: [
      {
        q: "How do I find my correct size?",
        a: "Check our detailed Size Guide on each product page, which includes chest, length and shoulder measurements.",
        steps: [
          { icon: "Ruler", label: "Check Size Chart", sub: "" },
          { icon: "PencilRuler", label: "Measure Yourself", sub: "" },
          { icon: "Shirt", label: "Compare Fit", sub: "" },
          { icon: "ShoppingBag", label: "Order Confidently", sub: "" },
        ],
      },
      {
        q: "Are ZeroArc t-shirts true to size or oversized?",
        a: "Most of our tees have an oversized, relaxed fit. We recommend sizing down if you prefer a regular fit.",
      },
      {
        q: "What fabric do you use?",
        a: "We use 240 GSM premium cotton for a soft, breathable and durable feel.",
      },
      {
        q: "How should I wash my ZeroArc apparel?",
        a: "Machine wash cold with similar colors, avoid bleach, and wash inside-out to preserve the print.",
      },
      {
        q: "Will the print fade or crack after washing?",
        a: "Our prints use high-quality, long-lasting techniques designed to resist fading and cracking with proper care.",
      },
      {
        q: "Do your products shrink after washing?",
        a: "Our fabric is pre-shrunk, so shrinkage is minimal when washed as per care instructions.",
      },
      {
        q: "Are your designs limited edition?",
        a: "Some designs are part of Limited Edition drops and won't be restocked once sold out.",
      },
      {
        q: "Do you restock sold-out products?",
        a: "Popular designs may be restocked, but Limited Edition items generally do not return.",
      },
      {
        q: "Can I request a custom design or print?",
        a: "We don't offer custom designs currently, but we love hearing your ideas — reach out and who knows what's next!",
      },
      {
        q: "Do you offer plus sizes?",
        a: "Yes, we offer sizes up to XXXL across most of our collections.",
      },
    ],
  },
  {
    slug: "account-profile",
    name: "Account & Profile",
    subtitle:
      "Manage your account, addresses, passwords and everything related to your ZeroArc profile.",
    icon: "User",
    questions: [
      {
        q: "How do I create an account on ZeroArc?",
        a: "Click on the Account icon at the top right corner and select \"Sign Up\". Enter your details, verify your email or phone number and your account will be created successfully.",
        steps: [
          { icon: "UserPlus", label: "Sign Up", sub: "Click on Sign Up" },
          { icon: "Mail", label: "Verify", sub: "Verify Email / Phone" },
          { icon: "UserCheck", label: "Create Profile", sub: "Add Your Details" },
          { icon: "ShieldCheck", label: "You're Ready!", sub: "Start Shopping" },
        ],
      },
      {
        q: "How do I reset my password?",
        a: "Click \"Forgot Password\" on the login page and follow the OTP/email verification steps.",
      },
      {
        q: "How do I change my email address?",
        a: "Go to Profile Information in your account dashboard and update your email (verification required).",
      },
      {
        q: "How do I update my phone number?",
        a: "Go to Profile Information and update your phone number; an OTP will confirm the change.",
      },
      {
        q: "How do I manage my addresses?",
        a: "Go to \"Addresses\" in your account to add, edit, or remove saved addresses.",
      },
      {
        q: "How do I set a default address?",
        a: "In the Addresses section, click the \"...\" menu next to any address and select \"Set as Default.\"",
      },
      {
        q: "How do I delete my account?",
        a: "Contact our support team to request account deletion; it will be processed within 7 business days.",
      },
      {
        q: "Why did I not receive the verification email / OTP?",
        a: "Please check your spam folder, or click \"Resend\" after 60 seconds. Contact support if the issue persists.",
      },
      {
        q: "Can I login with social media accounts?",
        a: "Currently we support email/phone login only. Social login is coming soon.",
      },
      {
        q: "Is my personal information safe with ZeroArc?",
        a: "Yes, we use industry-standard encryption and never share your data with third parties without consent.",
      },
    ],
  },
  {
    slug: "others",
    name: "Others",
    subtitle:
      "Find answers to general questions about ZeroArc, policies, support, collaborations and more.",
    icon: "MoreHorizontal",
    questions: [
      {
        q: "How can I contact ZeroArc customer support?",
        a: "You can reach us via email, WhatsApp or our contact form. Our team is available Monday to Saturday, 10:00 AM to 7:00 PM.",
        steps: [
          { icon: "Mail", label: "Email Us", sub: "support@zeroarc.com" },
          { icon: "Headset", label: "Live Chat", sub: "Available on website" },
          { icon: "FileText", label: "Contact Form", sub: "We'll get back to you" },
        ],
      },
      {
        q: "Do you offer gift cards?",
        a: "Gift cards are coming soon! Stay tuned for updates.",
      },
      {
        q: "Do you have a loyalty or rewards program?",
        a: "Yes! Our \"Arc Points\" program rewards you for every purchase, redeemable on future orders.",
      },
      {
        q: "How do coupons and discount codes work?",
        a: "Apply a valid code at checkout to get instant discounts. Only one code can be used per order.",
      },
      {
        q: "Are your products limited edition?",
        a: "Select drops are limited edition and won't be restocked once sold out.",
      },
      {
        q: "How can I collaborate or partner with ZeroArc?",
        a: "Reach out via our Contact Us page with your proposal — we'd love to hear from creators and brands!",
      },
      {
        q: "Do you offer wholesale or bulk orders?",
        a: "Yes, for bulk orders please contact us directly for special pricing.",
      },
      {
        q: "Do you have a physical store?",
        a: "Currently we're online-only, delivering across India.",
      },
      {
        q: "What is ZeroArc's return shipping address?",
        a: "Our return address is shared automatically once a return request is approved.",
      },
      {
        q: "Do you ship internationally?",
        a: "Not yet — currently we only deliver within India.",
      },
      {
        q: "Are there any career opportunities at ZeroArc?",
        a: "Yes! Check our Instagram or reach out via Contact Us for current openings.",
      },
    ],
  },
];

// The 10 most common questions shown on the "All FAQs" overview page,
// picked from across every category. No icon-step blocks appear here.
export const FAQ_ALL_POPULAR: FaqQuestion[] = [
  FAQ_CATEGORIES[0].questions[0], // How do I place an order on ZeroArc?
  FAQ_CATEGORIES[0].questions[1], // Which payment methods do you accept?
  FAQ_CATEGORIES[1].questions[0], // How long does shipping take?
  FAQ_CATEGORIES[1].questions[2], // How can I track my order?
  FAQ_CATEGORIES[1].questions[8], // Is free shipping available?
  FAQ_CATEGORIES[2].questions[0], // What is your return policy?
  FAQ_CATEGORIES[2].questions[1], // How do I initiate a return?
  FAQ_CATEGORIES[3].questions[0], // How do I find my correct size?
  FAQ_CATEGORIES[4].questions[0], // How do I create an account on ZeroArc?
  FAQ_CATEGORIES[5].questions[0], // How can I contact ZeroArc customer support?
].map((q) => ({ ...q, steps: undefined }));