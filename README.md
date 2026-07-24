# ⚡ ZeroArc Admin Panel

A modern, production-ready eCommerce Admin Panel built with **Next.js 16**, **TypeScript**, **MongoDB**, **React Hook Form**, and **Tailwind CSS**.

Designed for managing products, orders, customers, analytics, coupons, inventory, payments, and much more.

---

## ✨ Features

### 🔐 Authentication

- Secure Admin Login
- JWT Authentication
- Protected Admin Routes
- Role Based Access Control
- Logout

### 👤 Admin Profile

- Dynamic Profile
- Edit Profile
- Change Password
- Dynamic Navbar
- Dynamic Profile Dropdown

### 📦 Product Management

- Create Product
- Product Validation (Zod)
- Auto Slug Generator
- Inventory Management
- Featured Products
- Bestseller Products
- New Arrival Products
- Active / Inactive Products

### 🚧 Coming Soon

- Edit Product
- Delete Product
- Product Images Upload
- Product Variants
- Categories
- Collections
- Orders
- Customers
- Analytics
- Coupons
- Payments
- Inventory Dashboard

---

# 🛠 Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- React Hook Form
- Zod
- JWT
- bcryptjs
- Lucide React

---

# 📂 Project Structure

```text
app/
 ├── admin/
 ├── api/
 ├── login/
 └── ...

components/
 ├── admin/
 ├── ui/
 └── ...

hooks/

lib/
 ├── auth/
 ├── mongodb.ts
 ├── validations/
 └── ...

models/
 ├── Admin.ts
 └── Product.ts
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/ZeroArc26/zeroarc.git
```

```bash
cd zeroarc
```

---

## 2. Install Dependencies

Using npm

```bash
npm install
```

or using pnpm

```bash
pnpm install
```

---

## 3. Create Environment Variables

Create a file named:

```text
.env.local
```

Add:

```env
MONGODB_URI=

JWT_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Start Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 📦 Build Production

```bash
npm run build
```

Run Production

```bash
npm start
```

---

# 🧪 Scripts

```bash
npm run dev
```

Start development server

```bash
npm run build
```

Build production

```bash
npm run start
```

Start production server

```bash
npm run lint
```

Run ESLint

---

# 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| MONGODB_URI | MongoDB Connection String |
| JWT_SECRET | Secret Key for Authentication |
| NEXT_PUBLIC_APP_URL | Application URL |

---

# 📸 Screenshots

> Add screenshots here after completing the project.

```
/public/screenshots/
```

Example:

- Login
- Dashboard
- Products
- Orders
- Analytics

---

# 🗺 Roadmap

- [x] Authentication
- [x] Admin Profile
- [x] Create Product
- [ ] Read Products
- [ ] Update Product
- [ ] Delete Product
- [ ] Product Images
- [ ] Categories
- [ ] Orders
- [ ] Customers
- [ ] Coupons
- [ ] Analytics
- [ ] Inventory
- [ ] Payments

---

# 🤝 Contributing

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/feature-name
```

3. Commit changes

```bash
git commit -m "feat: add feature"
```

4. Push branch

```bash
git push origin feature/feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Vimarsh Singh**

GitHub

https://github.com/ZeroArc26

---

⭐ If you like this project, don't forget to give it a Star.
