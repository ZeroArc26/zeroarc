# 🛍️ ZeroArc

A modern fashion e-commerce website built with **Next.js 15**, **MongoDB**, **Tailwind CSS** and **TypeScript**.

---

# 🌐 Main Website Routes

## Home

http://localhost:3000/

➡ Landing Page

---

## Shop

http://localhost:3000/shop

➡ All Products

---

## Product Details

http://localhost:3000/product/[slug]

Example:

http://localhost:3000/product/oversized-black-hoodie

➡ Single Product Page

---

## Cart

http://localhost:3000/cart

➡ Shopping Cart

---

## Checkout

http://localhost:3000/checkout

➡ Place Order

---

## Search

http://localhost:3000/search

➡ Search Products

---

## Wishlist (Future)

http://localhost:3000/wishlist

➡ Saved Products

---

## Profile (Future)

http://localhost:3000/profile

➡ User Profile

---

# 👑 Admin Panel

## Dashboard

http://localhost:3000/admin

➡ Overview
- Revenue
- Orders
- Products
- Analytics

---

## Orders

http://localhost:3000/admin/orders

➡ Manage Orders

Features

- View Orders
- Change Status
- Customer Details
- Products Ordered

---

## Products

http://localhost:3000/admin/products

➡ Product List

Features

- All Products
- Edit
- Delete
- Inventory
- Stock

---

## Add Product

http://localhost:3000/admin/products/add

➡ Add New Product

Features

- Images
- Price
- Category
- Collection
- Stock
- Featured
- Bestseller
- New Arrival

---

## Edit Product (Future)

http://localhost:3000/admin/products/edit/[id]

Example

http://localhost:3000/admin/products/edit/6847d82f1c....

➡ Edit Existing Product

---

## Inventory (Future)

http://localhost:3000/admin/inventory

➡ Manage Stock

---

## Coupons (Future)

http://localhost:3000/admin/coupons

➡ Coupon Management

---

## Users (Future)

http://localhost:3000/admin/users

➡ User Management

---

## Analytics (Future)

http://localhost:3000/admin/analytics

➡ Sales Analytics

---

# 🔥 API Routes

## Products

GET

/api/products

➡ Fetch all products

POST

/api/products

➡ Create Product

---

## Orders

GET

/api/orders

➡ Fetch Orders

POST

/api/orders

➡ Create Order

---

## Order Status

PATCH

/api/orders/[id]

➡ Update Order Status

---

## Dashboard

GET

/api/admin/dashboard

➡ Dashboard Analytics

---

# 📂 Folder Structure

app/

admin/

products/

orders/

cart/

checkout/

api/

components/

lib/

models/

public/

---

# 🗄️ MongoDB Models

Product

- title
- slug
- description
- price
- comparePrice
- category
- collection
- images
- sizes
- colors
- stock
- featured
- bestseller
- newArrival
- active

---

Order

- customer
- shippingAddress
- products
- totalItems
- subtotal
- shipping
- total
- status

---

# 🚀 Current Features

✅ Home

✅ Shop

✅ Product Page

✅ Cart

✅ Checkout

✅ MongoDB

✅ Orders

✅ Admin Dashboard

✅ Admin Orders

✅ Order Status Update

✅ Product List

✅ Add Product

---

# 🛣️ Roadmap

✅ Dashboard

✅ Orders

✅ Product List

✅ Add Product

⬜ Edit Product

⬜ Delete Product

⬜ Inventory

⬜ Variant Stock

⬜ Coupons

⬜ Wishlist

⬜ Reviews

⬜ Razorpay

⬜ User Authentication

⬜ Analytics

⬜ Email Notifications

⬜ Admin Settings

⬜ Production Deployment

---

# 💻 Tech Stack

Next.js 15

React

TypeScript

Tailwind CSS

MongoDB

Mongoose

Vercel

---

# 📌 Local Development

Install

npm install

Run

npm run dev

Open

http://localhost:3000

---

Made with ❤️ by ZeroArc
