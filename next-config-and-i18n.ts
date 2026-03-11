// next.config.ts
// Celliva.life — Next.js 15 + next-intl Configuration

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    ppr: true, // Partial Pre-rendering (Next.js 15)
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["cdn.celliva.life", "omnisio.app"],
  },
};

export default withNextIntl(nextConfig);

// ─────────────────────────────────────────────────────────────────────────────
// i18n/request.ts
// ─────────────────────────────────────────────────────────────────────────────
/*
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  // Priority: 1) cookie, 2) Accept-Language header, 3) default "en"
  const cookieStore = cookies();
  const acceptLang = headers().get("accept-language") ?? "";

  const cookieLang = cookieStore.get("celliva_lang")?.value;
  const headerLang = ["tr", "ru", "es"].find(l => acceptLang.startsWith(l));

  const locale = cookieLang ?? headerLang ?? "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
*/

// ─────────────────────────────────────────────────────────────────────────────
// messages/en.json structure (abridged)
// ─────────────────────────────────────────────────────────────────────────────
export const EN_MESSAGES = {
  nav: {
    home: "Home", shop: "Shop", science: "Science", about: "About",
    login: "Sign In", cart: "Cart"
  },
  hero: {
    badge: "Powered by Omnisio Biomarkers",
    title: "Precision Longevity.",
    sub: "Every formula is clinically validated. Every dose is data-driven.",
    cta: "Shop by Biomarker",
    ctaSub: "Explore Science"
  },
  product: {
    addToCart: "Add to Cart",
    subscribe: "Subscribe & Save 20%",
    viewDetails: "View Details",
    clinical: "Clinical Grade",
    transparency: "Full Transparency",
    howToUse: "How to Use",
    ingredients: "Ingredients",
    science: "The Science"
  },
  checkout: {
    title: "Checkout",
    guest: "Continue as Guest",
    email: "Email Address",
    omnisio: "Log in with Omnisio ID",
    promo: "Promo / Discount Code",
    apply: "Apply",
    total: "Total",
    place: "Place Order",
    secure: "256-bit SSL Secured",
    firstName: "First Name",
    lastName: "Last Name",
    address: "Address",
    city: "City",
    country: "Country"
  },
  biomarker: {
    alert: "Your biomarkers indicate elevated hs-CRP. We've highlighted targeted products and applied your 10% ecosystem discount.",
    recommended: "Recommended based on your recent Omnisio biomarker scan",
    discount: "Ecosystem Discount Applied"
  },
  footer: {
    rights: "© 2025 Celliva Life Sciences. All rights reserved.",
    kvkk: "KVKK",
    gdpr: "GDPR",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    tagline: "Precision nutrition for the longevity-focused."
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// app/[locale]/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
/*
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export function generateStaticParams() {
  return [
    { locale: "en" }, { locale: "tr" }, { locale: "ru" }, { locale: "es" }
  ];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
*/

// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts — locale routing
// ─────────────────────────────────────────────────────────────────────────────
/*
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "tr", "ru", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en/shop → /shop, /tr/shop → /tr/shop
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
*/

// ─────────────────────────────────────────────────────────────────────────────
// FILE STRUCTURE (Next.js 15 App Router)
// ─────────────────────────────────────────────────────────────────────────────
/*
celliva.life/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # NextIntlClientProvider wrapper
│   │   ├── page.tsx                # Homepage
│   │   ├── shop/
│   │   │   └── page.tsx            # Product catalog
│   │   ├── products/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # PDP (generateStaticParams for 6 products)
│   │   ├── checkout/
│   │   │   └── page.tsx            # 1-page checkout
│   │   └── auth/
│   │       └── page.tsx            # Omnisio sync / email login
│   ├── api/
│   │   ├── auth/
│   │   │   └── omnisio/
│   │   │       └── route.ts        # POST: Omnisio ID auth + biomarker fetch
│   │   └── orders/
│   │       └── webhook/
│   │           └── route.ts        # POST: Push order to Omnisio Admin
├── components/
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── PDP/
│   │   ├── ScienceTab.tsx
│   │   ├── IngredientsTab.tsx
│   │   └── HowToUseTab.tsx
│   ├── Checkout/
│   │   ├── AuthStep.tsx
│   │   ├── DetailsStep.tsx
│   │   ├── PaymentStep.tsx
│   │   └── OrderSummary.tsx
│   ├── BiomarkerAlert.tsx
│   └── Footer.tsx
├── lib/
│   ├── omnisio-sync.ts             # Biomarker fetch + personalization
│   ├── stripe.ts                   # Stripe payment intent
│   └── products.ts                 # Product catalog data
├── messages/
│   ├── en.json
│   ├── tr.json
│   ├── ru.json
│   └── es.json
├── i18n/
│   └── request.ts                  # next-intl config
├── middleware.ts                    # Locale routing
└── next.config.ts
*/
