import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  category: string;
  title: string;
}

export default function Breadcrumb({ category, title }: BreadcrumbProps) {
  return (
    <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
      <Link href="/" className="transition hover:text-violet-600">
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />

      <Link href="/shop" className="transition hover:text-violet-600">
        {category}
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />

      <span className="text-zinc-800">{title}</span>
    </nav>
  );
}