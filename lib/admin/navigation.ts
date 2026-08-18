import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ShoppingCart,
  Users,
  Ticket,
  BarChart3,
  MessageSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
  children?: AdminNavItem[];
  section?: string;
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    section: "MAIN",
  },

  {
    title: "Catalog",
    href: "/admin/catalog",
    icon: Package,
    section: "STORE",
    children: [
      {
        title: "Products",
        href: "/admin/dashboard/products",
        icon: Package,
      },
      {
        title: "Categories",
        href: "/admin/dashboard/categories",
        icon: FolderTree,
      },
      {
        title: "Inventory",
        href: "/admin/dashboard/inventory",
        icon: Warehouse,
      },
    ],
  },

  {
    title: "Sales",
    href: "/admin/sales",
    icon: ShoppingCart,
    section: "SALES",
    children: [
      {
        title: "Orders",
        href: "/admin/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        href: "/admin/dashboard/customers",
        icon: Users,
      },
      {
        title: "Coupons",
        href: "/admin/dashboard/coupons",
        icon: Ticket,
      },
    ],
  },

  {
    title: "Analytics",
    href: "/admin/dashboard/analytics",
    icon: BarChart3,
    section: "INSIGHTS",
  },

  {
    title: "Testimonials",
    href: "/admin/dashboard/testimonials",
    icon: MessageSquare,
    section: "INSIGHTS",
  },

  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
    section: "SYSTEM",
  },
];