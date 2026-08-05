/**
 * DUMMY ORDER DATA
 * ------------------------------------------------------------------
 * Used by both the orders list page (/account/orders) and the order
 * detail page (/account/orders/[id]).
 *
 * TODO (before launch): replace this with a real fetch from the
 * Order model, scoped to the logged-in user.
 * ------------------------------------------------------------------
 */

export interface DummyOrder {
  id: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  items: {
    title: string;
    size: string;
    color: string;
    qty: number;
    price: number;
    image: string;
  }[];
  orderDate: string;
  statusDate: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    lines: string[];
    phone: string;
  };
  timeline: {
    label: string;
    date: string;
    done: boolean;
  }[];
}

export const DUMMY_ORDERS: DummyOrder[] = [
  {
    id: "ZA8765",
    status: "Delivered",
    items: [
      {
        title: "Limitless Aura Oversized T-Shirt",
        size: "M",
        color: "Black",
        qty: 1,
        price: 999,
        image: "/images/products/chaos-control/chaos-control-black.webp",
      },
    ],
    orderDate: "10 May 2024",
    statusDate: "Delivered on 12 May 2024",
    paymentMethod: "UPI",
    subtotal: 999,
    shipping: 0,
    discount: 0,
    total: 999,
    shippingAddress: {
      name: "Aryan Verma",
      lines: ["A-23, Green Park Extension", "New Delhi - 110016, India"],
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", date: "10 May 2024", done: true },
      { label: "Processing", date: "10 May 2024", done: true },
      { label: "Shipped", date: "11 May 2024", done: true },
      { label: "Delivered", date: "12 May 2024", done: true },
    ],
  },
  {
    id: "ZA8643",
    status: "Delivered",
    items: [
      {
        title: "Violet Void Oversized T-Shirt",
        size: "L",
        color: "White",
        qty: 1,
        price: 999,
        image: "/images/products/future-unknown/future-unknown-black.webp",
      },
    ],
    orderDate: "26 Apr 2024",
    statusDate: "Delivered on 28 Apr 2024",
    paymentMethod: "UPI",
    subtotal: 999,
    shipping: 0,
    discount: 0,
    total: 999,
    shippingAddress: {
      name: "Aryan Verma",
      lines: ["A-23, Green Park Extension", "New Delhi - 110016, India"],
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", date: "26 Apr 2024", done: true },
      { label: "Processing", date: "26 Apr 2024", done: true },
      { label: "Shipped", date: "27 Apr 2024", done: true },
      { label: "Delivered", date: "28 Apr 2024", done: true },
    ],
  },
  {
    id: "ZA8521",
    status: "Shipped",
    items: [
      {
        title: "Shadow Ronin Hoodie",
        size: "M",
        color: "Black",
        qty: 1,
        price: 1499,
        image: "/images/products/shadow-within/shadow-within-black.webp",
      },
    ],
    orderDate: "16 Apr 2024",
    statusDate: "Shipped on 18 Apr 2024",
    paymentMethod: "Cards",
    subtotal: 1499,
    shipping: 0,
    discount: 0,
    total: 1499,
    shippingAddress: {
      name: "Aryan Verma",
      lines: ["Room No. 204, Boys Hostel", "DTU, Rohini, Delhi - 110042"],
      phone: "+91 91234 56789",
    },
    timeline: [
      { label: "Order Placed", date: "16 Apr 2024", done: true },
      { label: "Processing", date: "17 Apr 2024", done: true },
      { label: "Shipped", date: "18 Apr 2024", done: true },
      { label: "Delivered", date: "Expected 21 Apr 2024", done: false },
    ],
  },
  {
    id: "ZA8432",
    status: "Processing",
    items: [
      {
        title: "Eclipse Drift Oversized T-Shirt",
        size: "S",
        color: "White",
        qty: 1,
        price: 999,
        image: "/images/products/arc-beginning/arc-beginning-black.webp",
      },
    ],
    orderDate: "14 May 2024",
    statusDate: "Order placed on 14 May 2024",
    paymentMethod: "UPI",
    subtotal: 999,
    shipping: 0,
    discount: 0,
    total: 999,
    shippingAddress: {
      name: "Aryan Verma",
      lines: ["A-23, Green Park Extension", "New Delhi - 110016, India"],
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", date: "14 May 2024", done: true },
      { label: "Processing", date: "14 May 2024", done: true },
      { label: "Shipped", date: "Pending", done: false },
      { label: "Delivered", date: "Pending", done: false },
    ],
  },
  {
    id: "ZA8321",
    status: "Cancelled",
    items: [
      {
        title: "Phantom Blade Oversized T-Shirt",
        size: "L",
        color: "Black",
        qty: 1,
        price: 999,
        image: "/images/products/chaos-control/chaos-control-black.webp",
      },
    ],
    orderDate: "04 Apr 2024",
    statusDate: "Cancelled on 05 Apr 2024",
    paymentMethod: "UPI",
    subtotal: 999,
    shipping: 0,
    discount: 0,
    total: 999,
    shippingAddress: {
      name: "Aryan Verma",
      lines: ["A-23, Green Park Extension", "New Delhi - 110016, India"],
      phone: "+91 98765 43210",
    },
    timeline: [
      { label: "Order Placed", date: "04 Apr 2024", done: true },
      { label: "Cancelled", date: "05 Apr 2024", done: true },
    ],
  },
];