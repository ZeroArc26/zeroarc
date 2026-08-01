import Image from "next/image";
import Link from "next/link";
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1c.5 1.6 2 2.8 3.8 2.9A8.3 8.3 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.9c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.5H7.5V13H10v8h3.5z" />
    </svg>
  );
}

const FOOTER_LINKS = {
  shop: [
    { label: "Men", href: "/men" },
    { label: "Women", href: "/women" },
    { label: "Collections", href: "/collections" },
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
  ],
  help: [
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns", href: "/returns" },
    { label: "Shipping", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  about: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-zinc-400">
      <div className="mx-auto max-w-[1700px] px-6 py-16 md:px-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Image
              src="/images/logo/zeroarc-logo.png"
              alt="ZeroArc"
              width={150}
              height={48}
              className="h-auto w-[150px] brightness-0 invert"
            />

            <p className="mt-4 max-w-[280px] text-sm leading-relaxed">
              Streetwear inspired by anime, culture and limitless
              imagination.
            </p>

            <div className="mt-6 flex gap-4">
  <Link href="#" className="transition hover:text-white">
    <InstagramIcon />
  </Link>
  <Link href="#" className="transition hover:text-white">
    <YoutubeIcon />
  </Link>
  <Link href="#" className="transition hover:text-white">
    <TwitterIcon />
  </Link>
  <Link href="#" className="transition hover:text-white">
    <FacebookIcon />
  </Link>
</div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              Help
            </h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
              About
            </h4>
            <ul className="space-y-3 text-sm">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App download */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-800 pt-8 md:flex-row md:items-center">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-white">
              Download Our App
            </h4>
            <p className="mt-1 text-sm">Coming Soon</p>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-white">
              <span>▶</span> Google Play
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-white">
              <span></span> App Store
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900 px-6 py-6 text-center text-xs text-zinc-500 md:px-14">
        © {new Date().getFullYear()} ZeroArc. All rights reserved.
      </div>
    </footer>
  );
}