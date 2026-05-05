const productsData = [
  // ==========================================
  // GARDEN (5 productos)
  // ==========================================
  {
    id: 1,
    category: "Garden",
    name: "Aura Garden Set",
    price: "420€",
    image: "img/garden_aura.png",
    colors: [
      { code: "#1c1917", img: "img/garden_aura.png" }
    ],
    description: "Premium outdoor garden set with soft weather-resistant cushions."
  },
  {
    id: 2,
    category: "Garden",
    name: "Pebble Lounge Chair",
    price: "240€",
    image: "img/lounge_chair.png",
    colors: [
      { code: "#78716c", img: "img/lounge_chair.png" }
    ],
    description: "Ergonomic lounge chair for ultimate patio relaxation."
  },
  {
    id: 3,
    category: "Garden",
    name: "Sunburst Table",
    price: "180€",
    image: "img/dining_table_bg.png",
    colors: [
      { code: "#4b5b2b", img: "img/dining_table_bg.png" }
    ],
    description: "Minimalist outdoor table for coffee and morning sun."
  },
  {
    id: 4,
    category: "Garden",
    name: "Oasis Planter Stand",
    price: "90€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#a8a29e", img: "img/bath_cabinet.png" }
    ],
    description: "Sustainable wood planter stand for your favorite greenery."
  },
  {
    id: 5,
    category: "Garden",
    name: "Bloom Patio Stool",
    price: "110€",
    image: "img/dining_chair.png",
    colors: [
      { code: "#d6d3d1", img: "img/dining_chair.png" }
    ],
    description: "Versatile patio stool with a natural oak finish."
  },

  // ==========================================
  // KITCHEN (5 productos)
  // ==========================================
  {
    id: 11,
    category: "Kitchen",
    name: "Chef Island Table",
    price: "850€",
    image: "img/kitchen_island.png",
    colors: [
      { code: "#1c1917", img: "img/kitchen_island.png" }
    ],
    description: "Professional-grade kitchen island with ample storage space."
  },
  {
    id: 12,
    category: "Kitchen",
    name: "Bistro Counter Stool",
    price: "145€",
    image: "img/dining_chair.png",
    colors: [
      { code: "#6b4b1f", img: "img/dining_chair.png" }
    ],
    description: "High-end oak stool for modern kitchen counters."
  },
  {
    id: 13,
    category: "Kitchen",
    name: "Modo Kitchen Cart",
    price: "190€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#fafaf9", img: "img/bath_cabinet.png" }
    ],
    description: "Compact mobile cart for optimized kitchen organization."
  },
  {
    id: 14,
    category: "Kitchen",
    name: "Gastro Spice Rack",
    price: "65€",
    image: "img/office_desk.png",
    colors: [
      { code: "#78716c", img: "img/office_desk.png" }
    ],
    description: "Handcrafted wooden organizer for your culinary herbs."
  },
  {
    id: 15,
    category: "Kitchen",
    name: "Aero Prep Board",
    price: "45€",
    image: "img/oak_table.png",
    colors: [
      { code: "#d6d3d1", img: "img/oak_table.png" }
    ],
    description: "Gourmet cutting board with a premium natural finish."
  },

  // ==========================================
  // DINING (5 productos)
  // ==========================================
  {
    id: 21,
    category: "Dining",
    name: "Balthasar Oak Table",
    price: "920€",
    image: "img/oak_table.png",
    colors: [
      { code: "#1c1917", img: "img/oak_table.png" }
    ],
    description: "Magnificent dining table crafted with solid white oak."
  },
  {
    id: 22,
    category: "Dining",
    name: "Scandi Dining Chair",
    price: "185€",
    image: "img/dining_chair.png",
    colors: [
      { code: "#6b4b1f", img: "img/dining_chair.png" }
    ],
    description: "Refined and supportive dining chair with Scandi lines."
  },
  {
    id: 23,
    category: "Dining",
    name: "Palais Cabinet",
    price: "680€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#78716c", img: "img/bath_cabinet.png" }
    ],
    description: "Ample buffet sideboard with soft-closing sliding doors."
  },
  {
    id: 24,
    category: "Dining",
    name: "Modsy Glass Pendant",
    price: "120€",
    image: "img/office_desk.png",
    colors: [
      { code: "#d6d3d1", img: "img/office_desk.png" }
    ],
    description: "Designer lighting fixture for a sophisticated ambiance."
  },
  {
    id: 25,
    category: "Dining",
    name: "Vogue Bar Cart",
    price: "240€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#a8a29e", img: "img/bath_cabinet.png" }
    ],
    description: "Modern brass frame bar cart with elegant storage."
  },

  // ==========================================
  // LIVING (5 productos)
  // ==========================================
  {
    id: 31,
    category: "Living",
    name: "Modsy Modular Sofa",
    price: "1400€",
    image: "img/modular_sofa.png",
    colors: [
      { code: "#78716c", img: "img/modular_sofa.png" },
      { code: "#1c1917", img: "img/modular_sofa.png" }
    ],
    description: "Flexible modular sofa that adapts to any living space."
  },
  {
    id: 32,
    category: "Living",
    name: "Aero Coffee Table",
    price: "310€",
    image: "img/oak_table.png",
    colors: [
      { code: "#d6d3d1", img: "img/oak_table.png" }
    ],
    description: "Elegant centerpiece table for your modern living room."
  },
  {
    id: 33,
    category: "Living",
    name: "Gala Armchair",
    price: "420€",
    image: "img/blue_armchair.png",
    colors: [
      { code: "#1e3a8a", img: "img/blue_armchair.png" },
      { code: "#78716c", img: "img/lounge_chair.png" }
    ],
    description: "Luxurious blue velvet armchair for cozy reading corners."
  },
  {
    id: 34,
    category: "Living",
    name: "Nimbus Lounge Ottoman",
    price: "160€",
    image: "img/modular_sofa.png",
    colors: [
      { code: "#a8a29e", img: "img/modular_sofa.png" }
    ],
    description: "Compact and stylish ottoman for extra comfort."
  },
  {
    id: 35,
    category: "Living",
    name: "Linear TV Stand",
    price: "480€",
    image: "img/tv_stand.png",
    colors: [
      { code: "#fafaf9", img: "img/tv_stand.png" }
    ],
    description: "Sleek lowboard unit with integrated cable management."
  },

  // ==========================================
  // BEDROOM (5 productos)
  // ==========================================
  {
    id: 41,
    category: "Bedroom",
    name: "Serene Platform Bed",
    price: "980€",
    image: "img/bedroom_bed.png",
    colors: [
      { code: "#1c1917", img: "img/bedroom_bed.png" }
    ],
    description: "Minimalist platform bed for a peaceful sleeping space."
  },
  {
    id: 42,
    category: "Bedroom",
    name: "Nordic Nightstand",
    price: "125€",
    image: "img/nightstand.png",
    colors: [
      { code: "#fafaf9", img: "img/nightstand.png" }
    ],
    description: "Chic bedside table with a smooth natural wood finish."
  },
  {
    id: 43,
    category: "Bedroom",
    name: "Muted Dresser",
    price: "560€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#57534e", img: "img/bath_cabinet.png" }
    ],
    description: "Wide storage dresser with a clean architectural look."
  },
  {
    id: 44,
    category: "Bedroom",
    name: "Aura Bedroom Mirror",
    price: "140€",
    image: "img/office_desk.png",
    colors: [
      { code: "#1c1917", img: "img/office_desk.png" }
    ],
    description: "Full-length designer mirror with a matte iron frame."
  },
  {
    id: 45,
    category: "Bedroom",
    name: "Rest Bedside Sconce",
    price: "85€",
    image: "img/office_desk.png",
    colors: [
      { code: "#d6d3d1", img: "img/office_desk.png" }
    ],
    description: "Minimalist lighting for perfect bedside reading."
  },

  // ==========================================
  // KIDS ROOM (5 productos)
  // ==========================================
  {
    id: 51,
    category: "Kids Room",
    name: "Joy Mini Table",
    price: "135€",
    image: "img/kids_table.png",
    colors: [
      { code: "#b0c4de", img: "img/kids_table.png" }
    ],
    description: "Playful and safe wooden table for creative kids."
  },
  {
    id: 52,
    category: "Kids Room",
    name: "Play Desk Chair",
    price: "65€",
    image: "img/office_chair.png",
    colors: [
      { code: "#cbd5e1", img: "img/office_chair.png" }
    ],
    description: "Ergonomic chair designed for growing children."
  },
  {
    id: 53,
    category: "Kids Room",
    name: "Tot Toy Chest",
    price: "110€",
    image: "img/bath_cabinet.png",
    colors: [
      { code: "#fafaf9", img: "img/bath_cabinet.png" }
    ],
    description: "Safe and spacious chest for all their favorite toys."
  },
  {
    id: 54,
    category: "Kids Room",
    name: "Rainbow Play Mat",
    price: "55€",
    image: "img/kids_table.png",
    colors: [
      { code: "#e7e5e4", img: "img/kids_table.png" }
    ],
    description: "Soft foam mat for safe and comfortable playtime."
  },
  {
    id: 55,
    category: "Kids Room",
    name: "Modsy Kids Teepee",
    price: "85€",
    image: "img/kids_teepee.png",
    colors: [
      { code: "#fafaf9", img: "img/kids_teepee.png" }
    ],
    description: "Dreamy cotton canvas tent for indoor adventures."
  }
];
