import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  white: "#FFFFFF",
  pearl: "#F8F9FA",
  charcoal: "#1A1D21",
  blue: "#0A2540",
  blueMid: "#1a4a7a",
  blueLight: "#E8F0FF",
  gold: "#D4AF37",
  goldLight: "#F5E9A0",
  goldDark: "#A88A20",
  green: "#2D9B6F",
  red: "#E53935",
  border: "#E2E6EA",
  muted: "#6B7280",
  shadow: "0 2px 20px rgba(10,37,64,0.08)",
  shadowLg: "0 8px 40px rgba(10,37,64,0.14)",
};

// ─── I18N ─────────────────────────────────────────────────────────────────────
const translations = {
  en: {
    nav: {
      home: "Home",
      shop: "Shop",
      science: "Science",
      about: "About",
      login: "Sign In",
      cart: "Cart",
    },
    hero: {
      badge: "Powered by Omnisio Biomarkers",
      title: "Precision Longevity.",
      sub: "Every formula is clinically validated. Every dose is data-driven.",
      cta: "Shop by Biomarker",
      ctaSub: "Explore Science",
    },
    recommended: "Recommended based on your recent Omnisio biomarker scan",
    discount: "Ecosystem Discount Applied",
    filters: {
      all: "All",
      longevity: "Longevity",
      recovery: "Recovery",
      cognitive: "Cognitive Focus",
      performance: "Performance",
    },
    product: {
      addToCart: "Add to Cart",
      subscribe: "Subscribe & Save 20%",
      viewDetails: "View Details",
      clinical: "Clinical Grade",
      transparency: "Full Transparency",
      howToUse: "How to Use",
      ingredients: "Ingredients",
      science: "The Science",
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
      country: "Country",
      cardNumber: "Card Number",
      expiry: "MM/YY",
      cvv: "CVV",
    },
    footer: {
      rights: "© 2025 Celliva Life Sciences. All rights reserved.",
      kvkk: "KVKK",
      gdpr: "GDPR",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      tagline: "Precision nutrition for the longevity-focused.",
    },
    omnisioSync: "Omnisio ID Connected",
    biomarkerAlert:
      "Your biomarkers indicate elevated hs-CRP. We've highlighted targeted products and applied your 10% ecosystem discount.",
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      shop: "Mağaza",
      science: "Bilim",
      about: "Hakkımızda",
      login: "Giriş",
      cart: "Sepet",
    },
    hero: {
      badge: "Omnisio Biyobelirteçleri ile Desteklenir",
      title: "Hassas Uzun Ömür.",
      sub: "Her formül klinik olarak doğrulanmıştır. Her doz veriye dayalıdır.",
      cta: "Biyobelirtece Göre Alışveriş",
      ctaSub: "Bilimi Keşfet",
    },
    recommended: "Son Omnisio biyobelirteç taramanıza göre önerildi",
    discount: "Ekosistem İndirimi Uygulandı",
    filters: {
      all: "Tümü",
      longevity: "Uzun Ömür",
      recovery: "İyileşme",
      cognitive: "Bilişsel Odak",
      performance: "Performans",
    },
    product: {
      addToCart: "Sepete Ekle",
      subscribe: "Abone Ol & %20 Tasarruf Et",
      viewDetails: "Detayları Gör",
      clinical: "Klinik Derece",
      transparency: "Tam Şeffaflık",
      howToUse: "Nasıl Kullanılır",
      ingredients: "İçerikler",
      science: "Bilim",
    },
    checkout: {
      title: "Ödeme",
      guest: "Misafir Olarak Devam Et",
      email: "E-posta Adresi",
      omnisio: "Omnisio ID ile Giriş Yap",
      promo: "Promosyon / İndirim Kodu",
      apply: "Uygula",
      total: "Toplam",
      place: "Sipariş Ver",
      secure: "256-bit SSL Güvenli",
      firstName: "Ad",
      lastName: "Soyad",
      address: "Adres",
      city: "Şehir",
      country: "Ülke",
      cardNumber: "Kart Numarası",
      expiry: "AA/YY",
      cvv: "CVV",
    },
    footer: {
      rights: "© 2025 Celliva Yaşam Bilimleri. Tüm hakları saklıdır.",
      kvkk: "KVKK",
      gdpr: "GDPR",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları",
      tagline: "Uzun ömür odaklılar için hassas beslenme.",
    },
    omnisioSync: "Omnisio ID Bağlandı",
    biomarkerAlert:
      "Biyobelirteçleriniz yüksek hs-CRP gösteriyor. Hedefli ürünleri vurguladık ve %10 ekosistem indiriminizi uyguladık.",
  },
  ru: {
    nav: {
      home: "Главная",
      shop: "Магазин",
      science: "Наука",
      about: "О нас",
      login: "Войти",
      cart: "Корзина",
    },
    hero: {
      badge: "На основе биомаркеров Omnisio",
      title: "Точное долголетие.",
      sub: "Каждая формула клинически подтверждена. Каждая доза основана на данных.",
      cta: "Покупки по биомаркерам",
      ctaSub: "Изучить науку",
    },
    recommended:
      "Рекомендовано по результатам последнего сканирования биомаркеров Omnisio",
    discount: "Скидка экосистемы применена",
    filters: {
      all: "Все",
      longevity: "Долголетие",
      recovery: "Восстановление",
      cognitive: "Когнитивный фокус",
      performance: "Производительность",
    },
    product: {
      addToCart: "В корзину",
      subscribe: "Подписаться и сэкономить 20%",
      viewDetails: "Подробнее",
      clinical: "Клинический класс",
      transparency: "Полная прозрачность",
      howToUse: "Как применять",
      ingredients: "Состав",
      science: "Наука",
    },
    checkout: {
      title: "Оформление",
      guest: "Продолжить как гость",
      email: "Эл. почта",
      omnisio: "Войти с Omnisio ID",
      promo: "Промо / код скидки",
      apply: "Применить",
      total: "Итого",
      place: "Оформить заказ",
      secure: "256-бит SSL защита",
      firstName: "Имя",
      lastName: "Фамилия",
      address: "Адрес",
      city: "Город",
      country: "Страна",
      cardNumber: "Номер карты",
      expiry: "ММ/ГГ",
      cvv: "CVV",
    },
    footer: {
      rights: "© 2025 Celliva Life Sciences. Все права защищены.",
      kvkk: "KVKK",
      gdpr: "GDPR",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
      tagline: "Точное питание для тех, кто думает о долголетии.",
    },
    omnisioSync: "Omnisio ID подключён",
    biomarkerAlert:
      "Ваши биомаркеры указывают на повышенный hs-CRP. Мы выделили целевые продукты и применили скидку 10%.",
  },
  es: {
    nav: {
      home: "Inicio",
      shop: "Tienda",
      science: "Ciencia",
      about: "Nosotros",
      login: "Iniciar sesión",
      cart: "Carrito",
    },
    hero: {
      badge: "Impulsado por Biomarcadores Omnisio",
      title: "Longevidad de Precisión.",
      sub: "Cada fórmula está validada clínicamente. Cada dosis está basada en datos.",
      cta: "Comprar por Biomarcador",
      ctaSub: "Explorar Ciencia",
    },
    recommended: "Recomendado según tu último escaneo de biomarcadores Omnisio",
    discount: "Descuento de Ecosistema Aplicado",
    filters: {
      all: "Todo",
      longevity: "Longevidad",
      recovery: "Recuperación",
      cognitive: "Enfoque Cognitivo",
      performance: "Rendimiento",
    },
    product: {
      addToCart: "Agregar al Carrito",
      subscribe: "Suscribirse y Ahorrar 20%",
      viewDetails: "Ver Detalles",
      clinical: "Grado Clínico",
      transparency: "Transparencia Total",
      howToUse: "Cómo usar",
      ingredients: "Ingredientes",
      science: "La Ciencia",
    },
    checkout: {
      title: "Pago",
      guest: "Continuar como Invitado",
      email: "Correo Electrónico",
      omnisio: "Iniciar sesión con Omnisio ID",
      promo: "Código Promo / Descuento",
      apply: "Aplicar",
      total: "Total",
      place: "Realizar Pedido",
      secure: "Cifrado SSL de 256 bits",
      firstName: "Nombre",
      lastName: "Apellido",
      address: "Dirección",
      city: "Ciudad",
      country: "País",
      cardNumber: "Número de Tarjeta",
      expiry: "MM/AA",
      cvv: "CVV",
    },
    footer: {
      rights: "© 2025 Celliva Life Sciences. Todos los derechos reservados.",
      kvkk: "KVKK",
      gdpr: "GDPR",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      tagline: "Nutrición de precisión para los que piensan en la longevidad.",
    },
    omnisioSync: "Omnisio ID Conectado",
    biomarkerAlert:
      "Tus biomarcadores indican hs-CRP elevado. Hemos destacado productos específicos y aplicado tu descuento del 10%.",
  },
};

// ─── PRODUCT DATA ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000";
const INVENTORY_ENDPOINT = `${API_BASE}/api/inventory`;
const ORDERS_ENDPOINT = `${API_BASE}/api/orders`;
const FALLBACK_GRADIENT = "linear-gradient(135deg, #0A2540 0%, #1a6bc0 100%)";

const resolveImageUrl = (url) => {
  if (!url) return "/placeholder-product.png";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
};

const normalizeProduct = (product) => {
  const metadata = product.metadata || {};
  return {
    ...product,
    metadata,
    badges: metadata.badges || product.badges || [],
    tagline: metadata.tagline || product.tagline || product.description,
    rating: metadata.rating || product.rating || 4.8,
    reviews: metadata.reviews || product.reviews || 0,
    gradient: metadata.gradient || product.gradient || FALLBACK_GRADIENT,
    color: metadata.color || product.color || T.blue,
    scienceCopy: metadata.science || product.science || product.description,
    ingredients: metadata.ingredients || product.ingredients || [],
    dosage:
      metadata.dosage ||
      metadata.howToUse ||
      metadata.how_to_use ||
      product.dosage ||
      null,
    studies: metadata.studies || product.studies || [],
    imageResolved: resolveImageUrl(product.image_url),
  };
};

// ─── BOTTLE SVG RENDERS ───────────────────────────────────────────────────────
const BottleSVG = ({ gradient, id, size = 120 }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 120 168"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop
          offset="0%"
          stopColor={
            gradient.split("(135deg, ")[1]?.split(" 0%")[0] || "#0A2540"
          }
        />
        <stop
          offset="100%"
          stopColor={
            gradient.split("100%)")[0]?.split(", ").pop()?.split(" ")[0] ||
            "#1a6bc0"
          }
        />
      </linearGradient>
      <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
      </linearGradient>
      <filter id={`shadow-${id}`}>
        <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.25" />
      </filter>
    </defs>
    {/* Cap */}
    <rect
      x="38"
      y="8"
      width="44"
      height="22"
      rx="8"
      fill={`url(#grad-${id})`}
      filter={`url(#shadow-${id})`}
    />
    <rect
      x="42"
      y="10"
      width="12"
      height="18"
      rx="4"
      fill={`url(#shine-${id})`}
    />
    {/* Neck */}
    <rect
      x="44"
      y="28"
      width="32"
      height="16"
      rx="4"
      fill={`url(#grad-${id})`}
    />
    {/* Body */}
    <rect
      x="22"
      y="42"
      width="76"
      height="108"
      rx="14"
      fill={`url(#grad-${id})`}
      filter={`url(#shadow-${id})`}
    />
    <rect
      x="26"
      y="46"
      width="20"
      height="96"
      rx="8"
      fill={`url(#shine-${id})`}
    />
    {/* Label area */}
    <rect
      x="30"
      y="64"
      width="60"
      height="64"
      rx="8"
      fill="rgba(255,255,255,0.12)"
    />
    <rect
      x="36"
      y="72"
      width="48"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.7)"
    />
    <rect
      x="40"
      y="82"
      width="40"
      height="3"
      rx="1.5"
      fill="rgba(255,255,255,0.4)"
    />
    <rect
      x="40"
      y="91"
      width="36"
      height="3"
      rx="1.5"
      fill="rgba(255,255,255,0.4)"
    />
    <rect
      x="40"
      y="100"
      width="32"
      height="3"
      rx="1.5"
      fill="rgba(255,255,255,0.4)"
    />
    <rect
      x="34"
      y="112"
      width="52"
      height="10"
      rx="5"
      fill="rgba(212,175,55,0.85)"
    />
    <rect
      x="38"
      y="115"
      width="44"
      height="4"
      rx="2"
      fill="rgba(255,255,255,0.6)"
    />
  </svg>
);

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span style={{ color: T.gold, fontSize: 13 }}>
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span style={{ color: T.muted, marginLeft: 4, fontSize: 12 }}>
      {rating}
    </span>
  </span>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CellivaApp() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home"); // home | shop | pdp | checkout | auth
  const [filter, setFilter] = useState("all");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [omnisioConnected, setOmnisioConnected] = useState(false);
  const [biomarkerAlert, setBiomarkerAlert] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("auth"); // auth | details | payment | success
  const [authMode, setAuthMode] = useState("choice"); // choice | email | omnisio
  const [cartOpen, setCartOpen] = useState(false);
  const [pdpTab, setPdpTab] = useState("science");
  const [legalModal, setLegalModal] = useState(null);
  const [animIn, setAnimIn] = useState(true);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [inventoryError, setInventoryError] = useState(null);
  const initialCheckoutForm = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "Turkey",
  };
  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  const t = translations[lang];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    setTimeout(() => setCartOpen(false), 2000);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const discount =
    omnisioConnected && biomarkerAlert ? 0.1 : promoApplied ? 0.15 : 0;
  const discountedTotal = cartTotal * (1 - discount);

  const navigate = (p) => {
    setAnimIn(false);
    setTimeout(() => {
      setPage(p);
      setAnimIn(true);
    }, 150);
  };

  const connectOmnisio = () => {
    setOmnisioConnected(true);
    setBiomarkerAlert(true);
    setAuthMode("success");
  };

  const applyPromo = () => {
    if (
      promoCode.toUpperCase() === "LONGEVITY15" ||
      promoCode.toUpperCase() === "CELLIVA"
    ) {
      setPromoApplied(true);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const loadInventory = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(INVENTORY_ENDPOINT);
        if (!res.ok) throw new Error(`Inventory API responded ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const inventory = Array.isArray(data?.inventory)
          ? data.inventory.map(normalizeProduct)
          : [];
        setProducts(inventory);
        setInventoryError(
          inventory.length === 0 ? "No products available." : null,
        );
      } catch (error) {
        if (!cancelled) {
          setInventoryError(error?.message || "Unable to load products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };
    loadInventory();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct && products.length) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const updateCheckoutForm = (field) => (event) => {
    const value = event?.target?.value ?? "";
    setCheckoutForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      setOrderError("Add at least one product to your cart.");
      return;
    }
    setOrderSubmitting(true);
    setOrderError(null);
    try {
      const payload = {
        order: {
          source: "celliva_web",
          status: "processing",
          total_amount: Number(discountedTotal.toFixed(2)),
          currency: "USD",
          order_date: new Date().toISOString(),
          shipping_address: checkoutForm,
          metadata: {
            promoApplied,
            promoCode: promoApplied ? promoCode : null,
            omnisioConnected,
            biomarkerAlert,
            discount,
          },
        },
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.qty,
          unit_price: item.price,
        })),
      };
      const res = await fetch(ORDERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Order API responded ${res.status}`);
      }
      const data = await res.json();
      setLastOrderId(data?.orderId || null);
      setOrderSuccess(true);
      setCart([]);
      setCheckoutForm(initialCheckoutForm);
    } catch (error) {
      setOrderError(error?.message || "Unable to place order right now.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    const category = (product.category || "").toLowerCase();
    if (filter === "recovery")
      return (
        category.includes("sleep") ||
        category.includes("stress") ||
        category.includes("recovery")
      );
    if (filter === "performance")
      return (
        category.includes("performance") ||
        category.includes("energy") ||
        category.includes("metabolic")
      );
    return category.includes(filter);
  });

  // ── Styles ──────────────────────────────────────────────────────────────────
  const styles = {
    app: {
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: T.white,
      color: T.charcoal,
      minHeight: "100vh",
      WebkitFontSmoothing: "antialiased",
    },
    nav: {
      background: T.white,
      borderBottom: `1px solid ${T.border}`,
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 12px rgba(10,37,64,0.06)",
    },
    logo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
    logoText: {
      fontSize: 20,
      fontWeight: 700,
      color: T.blue,
      letterSpacing: "-0.5px",
    },
    logoDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: T.gold,
      marginTop: 2,
    },
    navLinks: { display: "flex", gap: 28, alignItems: "center" },
    navLink: {
      fontSize: 14,
      fontWeight: 500,
      color: T.muted,
      cursor: "pointer",
      transition: "color 0.2s",
      border: "none",
      background: "none",
      padding: 0,
    },
    navActions: { display: "flex", gap: 12, alignItems: "center" },
    cartBtn: {
      position: "relative",
      background: T.blue,
      color: T.white,
      border: "none",
      borderRadius: 10,
      padding: "8px 16px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    cartBadge: {
      position: "absolute",
      top: -6,
      right: -6,
      background: T.gold,
      color: T.blue,
      borderRadius: "50%",
      width: 18,
      height: 18,
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    langSelect: {
      border: `1px solid ${T.border}`,
      borderRadius: 8,
      padding: "6px 10px",
      fontSize: 12,
      cursor: "pointer",
      background: T.white,
      color: T.charcoal,
    },
    page: {
      opacity: animIn ? 1 : 0,
      transform: animIn ? "translateY(0)" : "translateY(8px)",
      transition: "all 0.2s ease",
    },
  };

  // ── NAVBAR ──────────────────────────────────────────────────────────────────
  const Navbar = () => (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate("home")}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="14" fill={T.blue} />
          <path
            d="M8 14c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6"
            stroke={T.gold}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="14" cy="14" r="2" fill={T.gold} />
        </svg>
        <span style={styles.logoText}>
          celliva<span style={{ color: T.gold }}>.life</span>
        </span>
      </div>
      <div style={styles.navLinks}>
        {["home", "shop", "science", "about"].map((p) => (
          <button
            key={p}
            style={{
              ...styles.navLink,
              color: page === p ? T.blue : T.muted,
              fontWeight: page === p ? 600 : 500,
            }}
            onClick={() =>
              navigate(p === "home" ? "home" : p === "shop" ? "shop" : "home")
            }
          >
            {t.nav[p]}
          </button>
        ))}
      </div>
      <div style={styles.navActions}>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          style={styles.langSelect}
        >
          {["en", "tr", "ru", "es"].map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
        {omnisioConnected ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#E6F9EF",
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 12,
              color: T.green,
              fontWeight: 600,
            }}
          >
            <span>⚡</span> {t.omnisioSync}
          </div>
        ) : (
          <button
            style={{ ...styles.navLink, color: T.blue, fontWeight: 600 }}
            onClick={() => navigate("auth")}
          >
            {t.nav.login}
          </button>
        )}
        <button style={styles.cartBtn} onClick={() => navigate("checkout")}>
          🛒 {t.nav.cart}
          {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );

  // ── HERO SECTION ─────────────────────────────────────────────────────────────
  const Hero = () => {
    const heroProducts = products.slice(0, 3);
    return (
      <section
        style={{
          background: `linear-gradient(160deg, #F0F4FF 0%, ${T.white} 60%)`,
          padding: "80px 32px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          minHeight: 520,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background ornament */}
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(10,37,64,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: T.blueLight,
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 24,
              fontSize: 12,
              fontWeight: 600,
              color: T.blue,
            }}
          >
            <span>⚡</span> {t.hero.badge}
          </div>
          <h1
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: T.blue,
              lineHeight: 1.05,
              marginBottom: 20,
              letterSpacing: "-2px",
            }}
          >
            {t.hero.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span style={{ color: T.gold }}>
              {t.hero.title.split(" ").slice(-1)}
            </span>
          </h1>
          <p
            style={{
              fontSize: 17,
              color: T.muted,
              lineHeight: 1.65,
              marginBottom: 36,
              maxWidth: 420,
            }}
          >
            {t.hero.sub}
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <button
              onClick={() => navigate("shop")}
              style={{
                background: T.gold,
                color: T.blue,
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 4px 20px rgba(212,175,55,0.4)`,
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              {t.hero.cta}
            </button>
            <button
              style={{
                background: "transparent",
                color: T.blue,
                border: `2px solid ${T.blue}`,
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.hero.ctaSub}
            </button>
          </div>
        </div>
        {/* Floating visuals */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-end",
            minHeight: 220,
          }}
        >
          {loadingProducts && (
            <div style={{ color: T.muted, fontSize: 14 }}>
              Loading hero products...
            </div>
          )}
          {!loadingProducts && heroProducts.length === 0 && (
            <div style={{ color: T.muted, fontSize: 14 }}>
              Products will appear here soon.
            </div>
          )}
          {!loadingProducts &&
            heroProducts.map((p, i) => (
              <div
                key={p.id}
                style={{
                  transform: `translateY(${i % 2 === 1 ? -20 : 0}px)`,
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  animation: `float${i} 3s ease-in-out infinite alternate`,
                  textAlign: "center",
                }}
                onClick={() => {
                  setSelectedProduct(p);
                  navigate("pdp");
                }}
              >
                <div
                  style={{
                    background: p.gradient || FALLBACK_GRADIENT,
                    borderRadius: 24,
                    padding: 16,
                    width: 180,
                    height: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={p.imageResolved}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div
                  style={{ marginTop: 12, fontWeight: 600, color: T.charcoal }}
                >
                  {p.name}
                </div>
              </div>
            ))}
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes float0 { from { transform: translateY(0px); } to { transform: translateY(-10px); } }
          @keyframes float1 { from { transform: translateY(-20px); } to { transform: translateY(-30px); } }
          @keyframes float2 { from { transform: translateY(0px); } to { transform: translateY(-8px); } }
        `}</style>
      </section>
    );
  };

  // ── BIOMARKER ALERT ────────────────────────────────────────────────────────
  const BiomarkerAlert = () =>
    biomarkerAlert ? (
      <div
        style={{
          margin: "0 32px 24px",
          background: "linear-gradient(135deg, #E6F9EF, #F0FFF4)",
          border: "1px solid #A7F3D0",
          borderRadius: 14,
          padding: "16px 20px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 20 }}>🔬</span>
        <div>
          <div
            style={{
              fontWeight: 700,
              color: "#065F46",
              fontSize: 14,
              marginBottom: 4,
            }}
          >
            Omnisio Health Sync Active
          </div>
          <div style={{ fontSize: 13, color: "#047857", lineHeight: 1.5 }}>
            {t.biomarkerAlert}
          </div>
        </div>
        <button
          onClick={() => setBiomarkerAlert(false)}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>
    ) : null;

  // ── SHOP PAGE ──────────────────────────────────────────────────────────────
  const ShopPage = () => (
    <div style={{ padding: "40px 32px" }}>
      <BiomarkerAlert />
      <div style={{ display: "flex", gap: 40 }}>
        {/* Sidebar Filters */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: T.muted,
              marginBottom: 16,
            }}
          >
            Categories
          </div>
          {["all", "longevity", "recovery", "cognitive", "performance"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  marginBottom: 4,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: filter === cat ? 600 : 400,
                  background: filter === cat ? T.blue : "transparent",
                  color: filter === cat ? T.white : T.charcoal,
                  transition: "all 0.15s",
                }}
              >
                {t.filters[cat]}
              </button>
            ),
          )}
          <div
            style={{
              marginTop: 32,
              background: T.pearl,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.blue,
                marginBottom: 8,
              }}
            >
              🔬 Biomarker Sync
            </div>
            <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
              Connect Omnisio to get personalized recommendations
            </div>
            {!omnisioConnected && (
              <button
                onClick={() => navigate("auth")}
                style={{
                  marginTop: 10,
                  width: "100%",
                  background: T.gold,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: T.blue,
                }}
              >
                Connect Now
              </button>
            )}
          </div>
        </div>
        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {inventoryError && (
            <div style={{ marginBottom: 16, color: "#B45309", fontSize: 13 }}>
              {inventoryError}
            </div>
          )}
          {loadingProducts && (
            <div style={{ marginBottom: 16, color: T.muted, fontSize: 13 }}>
              Loading inventory...
            </div>
          )}
          {!loadingProducts &&
            !inventoryError &&
            filteredProducts.length === 0 && (
              <div style={{ marginBottom: 16, color: T.muted, fontSize: 13 }}>
                No products match this filter.
              </div>
            )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── PRODUCT CARD ────────────────────────────────────────────────────────────
  const ProductCard = ({ product }) => {
    const badges = Array.isArray(product.badges) ? product.badges : [];
    const isRecommended =
      omnisioConnected && biomarkerAlert && product.id === "CLV-001";
    const productImage =
      product.imageResolved || resolveImageUrl(product.image_url);
    const ratingValue = Number(product.rating || 4.8);
    const reviewsValue = Number(product.reviews || 0);
    const tagline = product.tagline || product.description;
    const gradient = product.gradient || FALLBACK_GRADIENT;

    return (
      <div
        style={{
          background: T.white,
          borderRadius: 20,
          border: isRecommended
            ? `2px solid ${T.gold}`
            : `1px solid ${T.border}`,
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.2s",
          boxShadow: isRecommended
            ? `0 8px 32px rgba(212,175,55,0.2)`
            : T.shadow,
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = T.shadowLg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isRecommended
            ? `0 8px 32px rgba(212,175,55,0.2)`
            : T.shadow;
        }}
      >
        {isRecommended && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              background: T.gold,
              color: T.blue,
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 11,
              fontWeight: 700,
              textAlign: "center",
              zIndex: 2,
              lineHeight: 1.3,
            }}
          >
            🔬 {t.recommended}
          </div>
        )}
        <div
          style={{
            background: gradient,
            padding: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
          onClick={() => {
            setSelectedProduct(product);
            navigate("pdp");
            setPdpTab("science");
          }}
        >
          <img
            src={productImage}
            alt={product.name}
            style={{
              width: "80%",
              height: 180,
              objectFit: "contain",
              filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.15))",
            }}
          />
        </div>
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            {badges.map((b) => (
              <span
                key={b}
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  background: T.blueLight,
                  color: T.blue,
                  borderRadius: 6,
                  padding: "3px 7px",
                }}
              >
                {b}
              </span>
            ))}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: T.charcoal,
              marginBottom: 4,
            }}
            onClick={() => {
              setSelectedProduct(product);
              navigate("pdp");
            }}
          >
            {product.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.muted,
              marginBottom: 10,
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </div>
          <div style={{ marginBottom: 12 }}>
            <Stars rating={ratingValue} />{" "}
            <span style={{ fontSize: 11, color: T.muted }}>
              ({reviewsValue.toLocaleString()})
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.blue }}>
                $
                {discount > 0
                  ? (product.price * (1 - discount)).toFixed(0)
                  : product.price}
              </span>
              {discount > 0 && (
                <span
                  style={{
                    fontSize: 13,
                    color: T.muted,
                    textDecoration: "line-through",
                    marginLeft: 6,
                  }}
                >
                  ${product.price}
                </span>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              style={{
                background: T.gold,
                color: T.blue,
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.product.addToCart}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── PDP (PRODUCT DETAIL PAGE) ───────────────────────────────────────────────
  const PDPPage = () => {
    if (!selectedProduct) return null;
    const p = selectedProduct;
    const badges = Array.isArray(p.badges) ? p.badges : [];
    const scienceCopy = p.scienceCopy || p.description;
    const ingredients = Array.isArray(p.ingredients) ? p.ingredients : [];
    const dosage = p.dosage || p.metadata?.dosage;
    const studies = Array.isArray(p.studies) ? p.studies : [];
    const productImage = p.imageResolved || resolveImageUrl(p.image_url);
    const tabs = ["science", "ingredients", "howToUse"];
    return (
      <div style={{ padding: "40px 32px", maxWidth: 1100, margin: "0 auto" }}>
        <button
          onClick={() => navigate("shop")}
          style={{
            background: "none",
            border: "none",
            color: T.muted,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Back to Shop
        </button>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}
        >
          {/* Left: Visual */}
          <div>
            <div
              style={{
                background: p.gradient || FALLBACK_GRADIENT,
                borderRadius: 24,
                padding: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <img
                src={productImage}
                alt={p.name}
                style={{ width: "100%", maxHeight: 360, objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                {
                  icon: "🔬",
                  label: t.product.clinical,
                  sub: "Third-party tested",
                },
                {
                  icon: "📋",
                  label: t.product.transparency,
                  sub: "No proprietary blends",
                },
                { icon: "🌿", label: "Non-GMO", sub: "Clean label certified" },
                {
                  icon: "🏭",
                  label: "GMP Certified",
                  sub: "FDA-registered facility",
                },
              ].map((badge) => (
                <div
                  key={badge.label}
                  style={{
                    background: T.pearl,
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{badge.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.charcoal,
                      }}
                    >
                      {badge.label}
                    </div>
                    <div style={{ fontSize: 11, color: T.muted }}>
                      {badge.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Details */}
          <div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              {badges.map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: T.blueLight,
                    color: T.blue,
                    borderRadius: 8,
                    padding: "4px 10px",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
            <h1
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: T.blue,
                marginBottom: 8,
                letterSpacing: "-1px",
              }}
            >
              {p.name}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: T.muted,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              {p.tagline}
            </p>
            <div style={{ marginBottom: 20 }}>
              <Stars rating={p.rating || 4.8} />{" "}
              <span style={{ fontSize: 13, color: T.muted }}>
                ({Number(p.reviews || 0).toLocaleString()} verified reviews)
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: T.blue }}>
                $
                {discount > 0 ? (p.price * (1 - discount)).toFixed(0) : p.price}
              </span>
              {discount > 0 && (
                <>
                  <span
                    style={{
                      fontSize: 18,
                      color: T.muted,
                      textDecoration: "line-through",
                    }}
                  >
                    ${p.price}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#DCFCE7",
                      color: T.green,
                      borderRadius: 6,
                      padding: "3px 8px",
                    }}
                  >
                    {t.discount} ({(discount * 100).toFixed(0)}% OFF)
                  </span>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
              <button
                onClick={() => {
                  addToCart(p);
                }}
                style={{
                  flex: 1,
                  background: T.gold,
                  color: T.blue,
                  border: "none",
                  borderRadius: 12,
                  padding: "15px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 4px 16px rgba(212,175,55,0.35)`,
                }}
              >
                {t.product.addToCart}
              </button>
              <button
                style={{
                  flex: 1,
                  background: T.blue,
                  color: T.white,
                  border: "none",
                  borderRadius: 12,
                  padding: "15px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t.product.subscribe}
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                borderBottom: `2px solid ${T.border}`,
                marginBottom: 24,
                display: "flex",
                gap: 0,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPdpTab(tab)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom:
                      pdpTab === tab
                        ? `2px solid ${T.blue}`
                        : "2px solid transparent",
                    marginBottom: -2,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: pdpTab === tab ? 700 : 500,
                    color: pdpTab === tab ? T.blue : T.muted,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t.product[tab]}
                </button>
              ))}
            </div>

            {pdpTab === "science" && (
              <div>
                <div
                  style={{
                    background: T.blueLight,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.blue,
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Mechanism of Action
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: T.charcoal,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {scienceCopy}
                  </p>
                </div>
                {studies.length > 0 && (
                  <>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.muted,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 10,
                      }}
                    >
                      Referenced Studies
                    </div>
                    {studies.map((s) => (
                      <div
                        key={s}
                        style={{
                          fontSize: 13,
                          color: T.blue,
                          marginBottom: 6,
                          display: "flex",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: T.gold,
                            display: "inline-block",
                            flexShrink: 0,
                          }}
                        />
                        {s}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
            {pdpTab === "ingredients" && (
              <div>
                {ingredients.map((ing) => (
                  <div
                    key={ing.name}
                    style={{
                      borderBottom: `1px solid ${T.border}`,
                      paddingBottom: 16,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: T.charcoal,
                        }}
                      >
                        {ing.name}
                      </span>
                      <span
                        style={{ fontWeight: 700, fontSize: 14, color: T.blue }}
                      >
                        {ing.dose}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>
                      {ing.role}
                    </div>
                  </div>
                ))}
                {ingredients.length === 0 && (
                  <div style={{ fontSize: 13, color: T.muted }}>
                    Ingredient detail coming soon.
                  </div>
                )}
                <div
                  style={{
                    background: "#FFF8E7",
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 12,
                    color: "#92400E",
                    marginTop: 8,
                  }}
                >
                  ✓ No proprietary blends. All doses are fully disclosed and
                  clinically validated.
                </div>
              </div>
            )}
            {pdpTab === "howToUse" && (
              <div
                style={{ background: T.pearl, borderRadius: 12, padding: 20 }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.charcoal,
                    marginBottom: 10,
                  }}
                >
                  Recommended Protocol
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: T.muted,
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {dosage || "Usage instructions will be available soon."}
                </p>
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <div
                    style={{
                      background: T.white,
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: T.blue,
                      fontWeight: 600,
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    Clinically dosed
                  </div>
                  <div
                    style={{
                      background: T.white,
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: T.blue,
                      fontWeight: 600,
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    60-day supply
                  </div>
                  <div
                    style={{
                      background: T.white,
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 12,
                      color: T.blue,
                      fontWeight: 600,
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    Vegan friendly
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── AUTH PAGE ──────────────────────────────────────────────────────────────
  const AuthPage = () => (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div
        style={{
          background: T.white,
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 440,
          boxShadow: T.shadowLg,
        }}
      >
        {authMode === "choice" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: T.blue,
                  marginBottom: 8,
                }}
              >
                Welcome to Celliva
              </h2>
              <p style={{ fontSize: 14, color: T.muted }}>
                Sign in to unlock your personalized health stack
              </p>
            </div>
            <button
              onClick={connectOmnisio}
              style={{
                width: "100%",
                background: T.blue,
                color: T.white,
                border: "none",
                borderRadius: 12,
                padding: "15px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <span>⚡</span> {t.checkout.omnisio}
            </button>
            <button
              onClick={() => setAuthMode("email")}
              style={{
                width: "100%",
                background: T.pearl,
                color: T.charcoal,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "15px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              📧 Sign in with Email
            </button>
            <button
              onClick={() => {
                navigate("checkout");
                setCheckoutStep("details");
              }}
              style={{
                width: "100%",
                background: "transparent",
                color: T.muted,
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {t.checkout.guest} →
            </button>
            <div
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: 11,
                color: T.muted,
              }}
            >
              🔒 Your health data is encrypted and never sold.
            </div>
          </>
        )}
        {authMode === "email" && (
          <>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.blue,
                marginBottom: 24,
              }}
            >
              Sign In
            </h2>
            <input
              placeholder={t.checkout.email}
              style={{
                width: "100%",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 14,
                marginBottom: 12,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              style={{
                width: "100%",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                fontSize: 14,
                marginBottom: 16,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
            <button
              style={{
                width: "100%",
                background: T.gold,
                color: T.blue,
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode("choice")}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: T.muted,
                fontSize: 13,
                cursor: "pointer",
                marginTop: 12,
              }}
            >
              ← Back
            </button>
          </>
        )}
        {authMode === "success" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 20px",
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: T.blue,
                marginBottom: 8,
              }}
            >
              {t.omnisioSync}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: T.muted,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Your biomarker data has been synced. We've personalized your
              recommendations and applied your ecosystem discount.
            </p>
            <div
              style={{
                background: "#FFF8E7",
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
                fontSize: 13,
                color: "#92400E",
              }}
            >
              🔬 Elevated hs-CRP detected → Omega-3 Ultra highlighted
              <br />
              💰 10% Ecosystem Discount applied
            </div>
            <button
              onClick={() => navigate("shop")}
              style={{
                background: T.gold,
                color: T.blue,
                border: "none",
                borderRadius: 12,
                padding: "14px 28px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View My Recommendations →
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // ── CHECKOUT ───────────────────────────────────────────────────────────────
  const CheckoutPage = () => (
    <div style={{ padding: "40px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <h2
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: T.blue,
          marginBottom: 32,
        }}
      >
        {t.checkout.title}
      </h2>
      {orderSuccess ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 24px",
            }}
          >
            ✓
          </div>
          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: T.blue,
              marginBottom: 8,
            }}
          >
            Order Confirmed!
          </h3>
          {lastOrderId && (
            <p style={{ color: T.muted, marginBottom: 8 }}>
              Reference: <strong>{lastOrderId}</strong>
            </p>
          )}
          <p style={{ color: T.muted, marginBottom: 8 }}>
            Your order has been placed and synced to Omnisio for refill
            tracking.
          </p>
          <div style={{ fontSize: 12, color: T.green, fontWeight: 600 }}>
            📡 Webhook pushed to /api/orders/webhook — Omnisio Admin notified
          </div>
          <button
            onClick={() => {
              navigate("shop");
              setOrderSuccess(false);
              setCart([]);
              setLastOrderId(null);
              setOrderError(null);
            }}
            style={{
              marginTop: 24,
              background: T.gold,
              color: T.blue,
              border: "none",
              borderRadius: 12,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40 }}
        >
          {/* Left: Form */}
          <div>
            {checkoutStep === "auth" && (
              <div
                style={{
                  background: T.pearl,
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: T.charcoal,
                    marginBottom: 16,
                  }}
                >
                  Account
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={connectOmnisio}
                    style={{
                      flex: 1,
                      background: omnisioConnected ? "#DCFCE7" : T.blue,
                      color: omnisioConnected ? T.green : T.white,
                      border: "none",
                      borderRadius: 10,
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {omnisioConnected
                      ? `✓ ${t.omnisioSync}`
                      : `⚡ ${t.checkout.omnisio}`}
                  </button>
                  <button
                    onClick={() => setCheckoutStep("details")}
                    style={{
                      flex: 1,
                      background: T.white,
                      color: T.charcoal,
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {t.checkout.guest}
                  </button>
                </div>
                <button
                  onClick={() => setCheckoutStep("details")}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    background: T.white,
                    color: T.blue,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign in with Email
                </button>
              </div>
            )}
            <div
              style={{
                background: T.pearl,
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <div
                style={{ fontWeight: 700, color: T.charcoal, marginBottom: 16 }}
              >
                Shipping Details
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <input
                  value={checkoutForm.firstName}
                  onChange={updateCheckoutForm("firstName")}
                  placeholder={t.checkout.firstName}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <input
                  value={checkoutForm.lastName}
                  onChange={updateCheckoutForm("lastName")}
                  placeholder={t.checkout.lastName}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
              <input
                value={checkoutForm.email}
                onChange={updateCheckoutForm("email")}
                placeholder={t.checkout.email}
                style={{
                  width: "100%",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontSize: 13,
                  marginBottom: 12,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <input
                value={checkoutForm.address}
                onChange={updateCheckoutForm("address")}
                placeholder={t.checkout.address}
                style={{
                  width: "100%",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontSize: 13,
                  marginBottom: 12,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <input
                  value={checkoutForm.city}
                  onChange={updateCheckoutForm("city")}
                  placeholder={t.checkout.city}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <select
                  value={checkoutForm.country}
                  onChange={updateCheckoutForm("country")}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    background: T.white,
                    outline: "none",
                  }}
                >
                  <option>Turkey</option>
                  <option>Germany</option>
                  <option>Russia</option>
                  <option>Spain</option>
                  <option>United States</option>
                </select>
              </div>
            </div>
            <div style={{ background: T.pearl, borderRadius: 16, padding: 24 }}>
              <div
                style={{ fontWeight: 700, color: T.charcoal, marginBottom: 16 }}
              >
                Payment
              </div>
              <input
                placeholder={t.checkout.cardNumber}
                style={{
                  width: "100%",
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "11px 13px",
                  fontSize: 13,
                  marginBottom: 12,
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <input
                  placeholder={t.checkout.expiry}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <input
                  placeholder={t.checkout.cvv}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "11px 13px",
                    fontSize: 11,
                    color: T.muted,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  🔒 {t.checkout.secure}
                </div>
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                {["VISA", "MC", "AMEX", "PayPal"].map((c) => (
                  <span
                    key={c}
                    style={{
                      background: T.white,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "4px 8px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.muted,
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Right: Order Summary */}
          <div>
            <div
              style={{
                background: T.pearl,
                borderRadius: 16,
                padding: 24,
                position: "sticky",
                top: 80,
              }}
            >
              <div
                style={{ fontWeight: 700, color: T.charcoal, marginBottom: 16 }}
              >
                Order Summary
              </div>
              {cart.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: T.muted,
                    fontSize: 13,
                  }}
                >
                  Your cart is empty.{" "}
                  <button
                    onClick={() => navigate("shop")}
                    style={{
                      background: "none",
                      border: "none",
                      color: T.blue,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Shop now →
                  </button>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        marginBottom: 14,
                        paddingBottom: 14,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 10,
                          background: item.gradient,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <BottleSVG
                          gradient={item.gradient}
                          id={`co-${item.id}`}
                          size={36}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.charcoal,
                          }}
                        >
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: T.muted }}>
                          Qty: {item.qty}
                        </div>
                      </div>
                      <div
                        style={{ fontSize: 14, fontWeight: 700, color: T.blue }}
                      >
                        ${item.price * item.qty}
                      </div>
                    </div>
                  ))}
                  {/* Promo */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={t.checkout.promo}
                      style={{
                        flex: 1,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: "9px 12px",
                        fontSize: 13,
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={applyPromo}
                      style={{
                        background: T.blue,
                        color: T.white,
                        border: "none",
                        borderRadius: 10,
                        padding: "9px 14px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {t.checkout.apply}
                    </button>
                  </div>
                  {promoApplied && (
                    <div
                      style={{
                        background: "#DCFCE7",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        color: T.green,
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      ✓ Promo code applied! 15% off
                    </div>
                  )}
                  {omnisioConnected && biomarkerAlert && (
                    <div
                      style={{
                        background: "#FFF8E7",
                        borderRadius: 8,
                        padding: "8px 12px",
                        fontSize: 12,
                        color: "#92400E",
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      ⚡ {t.discount}: -10%
                    </div>
                  )}
                  <div
                    style={{
                      borderTop: `2px solid ${T.border}`,
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 13, color: T.muted }}>
                        Subtotal
                      </span>
                      <span style={{ fontSize: 13, color: T.charcoal }}>
                        ${cartTotal}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontSize: 13, color: T.green }}>
                          Discount
                        </span>
                        <span style={{ fontSize: 13, color: T.green }}>
                          -${(cartTotal * discount).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 800,
                          color: T.charcoal,
                        }}
                      >
                        {t.checkout.total}
                      </span>
                      <span
                        style={{ fontSize: 18, fontWeight: 800, color: T.blue }}
                      >
                        ${discountedTotal.toFixed(2)}
                      </span>
                    </div>
                    {orderError && (
                      <div
                        style={{
                          color: "#B91C1C",
                          fontSize: 12,
                          marginBottom: 8,
                        }}
                      >
                        {orderError}
                      </div>
                    )}
                    <button
                      onClick={handlePlaceOrder}
                      disabled={orderSubmitting}
                      style={{
                        width: "100%",
                        background: T.gold,
                        color: T.blue,
                        border: "none",
                        borderRadius: 12,
                        padding: "16px",
                        fontSize: 16,
                        fontWeight: 800,
                        cursor: orderSubmitting ? "not-allowed" : "pointer",
                        boxShadow: `0 4px 20px rgba(212,175,55,0.4)`,
                        opacity: orderSubmitting ? 0.7 : 1,
                      }}
                    >
                      {orderSubmitting
                        ? "Processing…"
                        : `${t.checkout.place} →`}
                    </button>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: 12,
                        fontSize: 11,
                        color: T.muted,
                      }}
                    >
                      🔒 {t.checkout.secure}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── LEGAL MODAL ────────────────────────────────────────────────────────────
  const LegalModal = () => {
    if (!legalModal) return null;
    const content = {
      kvkk: {
        title: "KVKK Aydınlatma Metni",
        body: "Celliva Life Sciences olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizi işlemekteyiz. Toplanan veriler: ad-soyad, e-posta, sipariş geçmişi, sağlık biyobelirteçleri. Veri işleme amacı: sipariş yönetimi, kişiselleştirilmiş ürün önerileri. Verilerinizi silme, düzeltme ve itiraz hakkına sahipsiniz.",
      },
      gdpr: {
        title: "GDPR Privacy Notice",
        body: "Celliva Life Sciences processes your personal data under GDPR Article 6(1)(b) for contract performance and Article 6(1)(a) for consent-based health data processing. Data retention: 2 years post-purchase. You have rights to access, rectification, erasure ('right to be forgotten'), portability, and objection. DPO contact: privacy@celliva.life",
      },
      privacy: {
        title: "Privacy Policy",
        body: "Celliva.life collects email, shipping address, payment method (tokenized), and optional health biomarker data from Omnisio sync. We use Stripe for payment processing (PCI-DSS Level 1 compliant). We never sell personal data. Health data is encrypted at rest (AES-256) and in transit (TLS 1.3). Cookies used: essential only. Analytics: anonymized, aggregated.",
      },
      terms: {
        title: "Terms of Service",
        body: "By purchasing from Celliva.life, you agree that supplements are not intended to diagnose, treat, cure, or prevent any disease. Results may vary. All sales are final for opened products unless defective. Subscription cancellations require 48-hour notice. Governing law: Republic of Turkey / EU Regulation 2017/745 for digital health integrations.",
      },
    };
    const c = content[legalModal];
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={() => setLegalModal(null)}
      >
        <div
          style={{
            background: T.white,
            borderRadius: 20,
            padding: 36,
            maxWidth: 560,
            width: "100%",
            maxHeight: "70vh",
            overflow: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: T.blue,
                margin: 0,
              }}
            >
              {c.title}
            </h3>
            <button
              onClick={() => setLegalModal(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: T.muted,
              }}
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.75 }}>
            {c.body}
          </p>
        </div>
      </div>
    );
  };

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  const Footer = () => (
    <footer
      style={{
        background: T.blue,
        color: "rgba(255,255,255,0.7)",
        padding: "40px 32px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: T.white,
                marginBottom: 8,
              }}
            >
              celliva<span style={{ color: T.gold }}>.life</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 280 }}>
              {t.footer.tagline}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {["🔒 SSL", "✓ GMP", "🌿 Non-GMO", "⚡ Omnisio"].map((b) => (
                <span
                  key={b}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: T.goldLight,
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: T.gold,
                marginBottom: 12,
              }}
            >
              Shop
            </div>
            {["Longevity", "Recovery", "Cognitive", "Performance"].map((c) => (
              <div
                key={c}
                style={{ fontSize: 13, marginBottom: 8, cursor: "pointer" }}
              >
                {c}
              </div>
            ))}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: T.gold,
                marginBottom: 12,
              }}
            >
              Science
            </div>
            {["Research", "Clinical Trials", "Biomarkers", "Partners"].map(
              (c) => (
                <div
                  key={c}
                  style={{ fontSize: 13, marginBottom: 8, cursor: "pointer" }}
                >
                  {c}
                </div>
              ),
            )}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: T.gold,
                marginBottom: 12,
              }}
            >
              Legal
            </div>
            {[
              ["kvkk", t.footer.kvkk],
              ["gdpr", t.footer.gdpr],
              ["privacy", t.footer.privacy],
              ["terms", t.footer.terms],
            ].map(([key, label]) => (
              <div
                key={key}
                style={{
                  fontSize: 13,
                  marginBottom: 8,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,255,255,0.3)",
                }}
                onClick={() => setLegalModal(key)}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12 }}>{t.footer.rights}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <span>🇹🇷 KVKK Compliant</span>
            <span>🇪🇺 GDPR Compliant</span>
            <span>🔒 PCI-DSS Level 1</span>
          </div>
        </div>
      </div>
    </footer>
  );

  // ── HOMEPAGE ───────────────────────────────────────────────────────────────
  const HomePage = () => (
    <div>
      <Hero />
      <BiomarkerAlert />
      {/* Featured products strip */}
      <div style={{ padding: "40px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 800, color: T.blue }}>
            Best Sellers
          </h2>
          <button
            onClick={() => navigate("shop")}
            style={{
              background: "none",
              border: "none",
              color: T.gold,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            View All →
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {(loadingProducts ? [] : products.slice(0, 3)).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      {/* Omnisio banner */}
      <div
        style={{
          margin: "0 32px 40px",
          background: `linear-gradient(135deg, ${T.blue} 0%, #1a4a7a 100%)`,
          borderRadius: 24,
          padding: "40px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: T.gold,
              marginBottom: 12,
            }}
          >
            Powered by Omnisio
          </div>
          <h3
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: T.white,
              marginBottom: 10,
              lineHeight: 1.2,
            }}
          >
            Your biomarkers.
            <br />
            Your perfect stack.
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 360,
            }}
          >
            Connect your Omnisio health data and we'll automatically surface the
            supplements your body actually needs, backed by your latest blood
            panel.
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("auth")}
            style={{
              background: T.gold,
              color: T.blue,
              border: "none",
              borderRadius: 14,
              padding: "16px 32px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: `0 4px 24px rgba(212,175,55,0.4)`,
            }}
          >
            Connect Omnisio ID
          </button>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              marginTop: 8,
            }}
          >
            End-to-end encrypted • GDPR compliant
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.app}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap"
        rel="stylesheet"
      />
      <Navbar />
      {/* Cart toast */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 20,
            background: T.blue,
            color: T.white,
            borderRadius: 12,
            padding: "12px 20px",
            fontSize: 14,
            fontWeight: 600,
            zIndex: 200,
            boxShadow: T.shadowLg,
          }}
        >
          ✓ Added to cart
        </div>
      )}
      <div style={styles.page}>
        {page === "home" && <HomePage />}
        {page === "shop" && <ShopPage />}
        {page === "pdp" && <PDPPage />}
        {page === "checkout" && <CheckoutPage />}
        {page === "auth" && <AuthPage />}
      </div>
      <Footer />
      <LegalModal />
    </div>
  );
}
