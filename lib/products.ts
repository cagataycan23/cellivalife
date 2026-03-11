export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
  metadata?: Record<string, any>;
}

export const products: ProductRecord[] = [
  {
    id: "CLV-001",
    name: "Omega-3 Ultra",
    price: 79,
    category: "longevity",
    description: "High-EPA/DHA concentrate for inflammation control.",
    image_url: "https://images.unsplash.com/photo-1502740479091-635887520276?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["Clinical", "Anti-inflammatory"],
      tagline: "Clinically dosed Omega-3 for hs-CRP reduction.",
      rating: 4.9,
      reviews: 1843,
      gradient: "linear-gradient(135deg, #0A2540 0%, #1d8dc2 100%)",
      ingredients: [
        { name: "EPA", dose: "1500mg", role: "Inflammation modulation" },
        { name: "DHA", dose: "900mg", role: "Neuroprotective" },
      ],
      dosage: "Take 2 softgels with the main meal, daily.",
    },
  },
  {
    id: "CLV-002",
    name: "NMN Elevate+",
    price: 109,
    category: "longevity",
    description: "Bioavailable NMN + TMG stack for NAD+ restoration.",
    image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["NAD+", "Vegan"],
      tagline: "Boost cellular energy and mitochondrial resilience.",
      gradient: "linear-gradient(135deg, #1c1f3b 0%, #7237bd 100%)",
      rating: 4.8,
      studies: ["Zhang et al. Cell Metabolism 2023", "MIT Longevity Lab 2024"],
    },
  },
  {
    id: "CLV-003",
    name: "Neuro Focus Stack",
    price: 89,
    category: "cognitive",
    description: "Lion's mane, citicoline, and saffron for BDNF uplift.",
    image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["BDNF", "Mood"],
      tagline: "Sharper cognition and elevated mood in one stack.",
      gradient: "linear-gradient(135deg, #14213d 0%, #fca311 100%)",
      rating: 4.7,
    },
  },
  {
    id: "CLV-004",
    name: "Recovery Matrix",
    price: 72,
    category: "recovery",
    description: "Adaptogens + magnesium threonate to modulate cortisol.",
    image_url: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["Sleep", "Cortisol"],
      tagline: "Sleep deeper, recover faster.",
      gradient: "linear-gradient(135deg, #0b3d91 0%, #3a7bd5 100%)",
      rating: 4.6,
    },
  },
  {
    id: "CLV-005",
    name: "Metabolic Flux",
    price: 95,
    category: "performance",
    description: "Berberine XR + inositol for glucose control.",
    image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["Glucose", "Metabolic"],
      gradient: "linear-gradient(135deg, #0c3b2e 0%, #2bb673 100%)",
      rating: 4.8,
    },
  },
  {
    id: "CLV-006",
    name: "Longevity Baseline",
    price: 129,
    category: "longevity",
    description: "Complete methylated B-complex and minerals for homocysteine.",
    image_url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=600&q=80",
    metadata: {
      badges: ["Homocysteine", "Foundational"],
      gradient: "linear-gradient(135deg, #43107a 0%, #f53844 100%)",
      rating: 4.9,
    },
  },
];
