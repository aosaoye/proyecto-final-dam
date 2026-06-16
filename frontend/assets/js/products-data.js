const productsData = [
  // ==========================================
  // GARDEN (5 productos)
  // ==========================================
  {
    id: 1,
    category: "Garden",
    name: "Aura Garden Set",
    price: "420€",
    image: "../assets/img/garden_aura.png",
    colors: [
      { code: "#1c1917", img: "../assets/img/garden_aura.png" }
    ],
    description: "Premium outdoor garden set with soft weather-resistant cushions."
  },
  {
    id: 2,
    category: "Garden",
    name: "Pebble Lounge Chair",
    price: "240€",
    image: "../assets/img/lounge_chair.png",
    colors: [
      { code: "#78716c", img: "../assets/img/lounge_chair.png" }
    ],
    description: "Ergonomic lounge chair for ultimate patio relaxation."
  },
  {
    id: 3,
    category: "Garden",
    name: "Sunburst Table",
    price: "180€",
    image: "../assets/img/dining_table_bg.png",
    colors: [
      { code: "#4b5b2b", img: "../assets/img/dining_table_bg.png" }
    ],
    description: "Minimalist outdoor table for coffee and morning sun."
  },
  {
    id: 4,
    category: "Garden",
    name: "Oasis Planter Stand",
    price: "90€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#a8a29e", img: "../assets/img/bath_cabinet.png" }
    ],
    description: "Sustainable wood planter stand for your favorite greenery."
  },
  {
    id: 5,
    category: "Garden",
    name: "Bloom Patio Stool",
    price: "110€",
    image: "../assets/img/dining_chair.png",
    colors: [
      { code: "#d6d3d1", img: "../assets/img/dining_chair.png" }
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
    image: "../assets/img/kitchen_island.png",
    colors: [
      { code: "#1c1917", img: "../assets/img/kitchen_island.png" }
    ],
    description: "Professional-grade kitchen island with ample storage space."
  },
  {
    id: 12,
    category: "Kitchen",
    name: "Bistro Counter Stool",
    price: "145€",
    image: "../assets/img/dining_chair.png",
    colors: [
      { code: "#6b4b1f", img: "../assets/img/dining_chair.png" }
    ],
    description: "High-end oak stool for modern kitchen counters."
  },
  {
    id: 13,
    category: "Kitchen",
    name: "Modo Kitchen Cart",
    price: "190€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#fafaf9", img: "../assets/img/bath_cabinet.png" }
    ],
    description: "Compact mobile cart for optimized kitchen organization."
  },
  {
    id: 14,
    category: "Kitchen",
    name: "Gastro Spice Rack",
    price: "65€",
    image: "../assets/img/office_desk.png",
    colors: [
      { code: "#78716c", img: "../assets/img/office_desk.png" }
    ],
    description: "Handcrafted wooden organizer for your culinary herbs."
  },
  {
    id: 15,
    category: "Kitchen",
    name: "Aero Prep Board",
    price: "45€",
    image: "../assets/img/oak_table.png",
    colors: [
      { code: "#d6d3d1", img: "../assets/img/oak_table.png" }
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
    image: "../assets/img/oak_table.png",
    colors: [
      { code: "#1c1917", img: "../assets/img/oak_table.png" }
    ],
    description: "Magnificent dining table crafted with solid white oak."
  },
  {
    id: 22,
    category: "Dining",
    name: "Scandi Dining Chair",
    price: "185€",
    image: "../assets/img/dining_chair.png",
    colors: [
      { code: "#6b4b1f", img: "../assets/img/dining_chair.png" }
    ],
    description: "Refined and supportive dining chair with Scandi lines."
  },
  {
    id: 23,
    category: "Dining",
    name: "Palais Cabinet",
    price: "680€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#78716c", img: "../assets/img/bath_cabinet.png" }
    ],
    description: "Ample buffet sideboard with soft-closing sliding doors."
  },
  {
    id: 24,
    category: "Dining",
    name: "Modsy Glass Pendant",
    price: "120€",
    image: "../assets/img/office_desk.png",
    colors: [
      { code: "#d6d3d1", img: "../assets/img/office_desk.png" }
    ],
    description: "Designer lighting fixture for a sophisticated ambiance."
  },
  {
    id: 25,
    category: "Dining",
    name: "Vogue Bar Cart",
    price: "240€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#a8a29e", img: "../assets/img/bath_cabinet.png" }
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
    image: "../assets/img/modular_sofa.png",
    colors: [
      { code: "#78716c", img: "../assets/img/modular_sofa.png" },
      { code: "#1c1917", img: "../assets/img/modular_sofa.png" }
    ],
    description: "Flexible modular sofa that adapts to any living space."
  },
  {
    id: 32,
    category: "Living",
    name: "Aero Coffee Table",
    price: "310€",
    image: "../assets/img/oak_table.png",
    colors: [
      { code: "#d6d3d1", img: "../assets/img/oak_table.png" }
    ],
    description: "Elegant centerpiece table for your modern living room."
  },
  {
    id: 33,
    category: "Living",
    name: "Gala Armchair",
    price: "420€",
    image: "../assets/img/blue_armchair.png",
    colors: [
      { code: "#1e3a8a", img: "../assets/img/blue_armchair.png" },
      { code: "#78716c", img: "../assets/img/lounge_chair.png" }
    ],
    description: "Luxurious blue velvet armchair for cozy reading corners."
  },
  {
    id: 34,
    category: "Living",
    name: "Nimbus Lounge Ottoman",
    price: "160€",
    image: "../assets/img/modular_sofa.png",
    colors: [
      { code: "#a8a29e", img: "../assets/img/modular_sofa.png" }
    ],
    description: "Compact and stylish ottoman for extra comfort."
  },
  {
    id: 35,
    category: "Living",
    name: "Linear TV Stand",
    price: "480€",
    image: "../assets/img/tv_stand.png",
    colors: [
      { code: "#fafaf9", img: "../assets/img/tv_stand.png" }
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
    image: "../assets/img/bedroom_bed.png",
    colors: [
      { code: "#1c1917", img: "../assets/img/bedroom_bed.png" }
    ],
    description: "Minimalist platform bed for a peaceful sleeping space."
  },
  {
    id: 42,
    category: "Bedroom",
    name: "Nordic Nightstand",
    price: "125€",
    image: "../assets/img/nightstand.png",
    colors: [
      { code: "#fafaf9", img: "../assets/img/nightstand.png" }
    ],
    description: "Chic bedside table with a smooth natural wood finish."
  },
  {
    id: 43,
    category: "Bedroom",
    name: "Muted Dresser",
    price: "560€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#57534e", img: "../assets/img/bath_cabinet.png" }
    ],
    description: "Wide storage dresser with a clean architectural look."
  },
  {
    id: 44,
    category: "Bedroom",
    name: "Aura Bedroom Mirror",
    price: "140€",
    image: "../assets/img/office_desk.png",
    colors: [
      { code: "#1c1917", img: "../assets/img/office_desk.png" }
    ],
    description: "Full-length designer mirror with a matte iron frame."
  },
  {
    id: 45,
    category: "Bedroom",
    name: "Rest Bedside Sconce",
    price: "85€",
    image: "../assets/img/office_desk.png",
    colors: [
      { code: "#d6d3d1", img: "../assets/img/office_desk.png" }
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
    image: "../assets/img/kids_table.png",
    colors: [
      { code: "#b0c4de", img: "../assets/img/kids_table.png" }
    ],
    description: "Playful and safe wooden table for creative kids."
  },
  {
    id: 52,
    category: "Kids Room",
    name: "Play Desk Chair",
    price: "65€",
    image: "../assets/img/office_chair.png",
    colors: [
      { code: "#cbd5e1", img: "../assets/img/office_chair.png" }
    ],
    description: "Ergonomic chair designed for growing children."
  },
  {
    id: 53,
    category: "Kids Room",
    name: "Tot Toy Chest",
    price: "110€",
    image: "../assets/img/bath_cabinet.png",
    colors: [
      { code: "#fafaf9", img: "../assets/img/bath_cabinet.png" }
    ],
    description: "Safe and spacious chest for all their favorite toys."
  },
  {
    id: 54,
    category: "Kids Room",
    name: "Rainbow Play Mat",
    price: "55€",
    image: "../assets/img/kids_table.png",
    colors: [
      { code: "#e7e5e4", img: "../assets/img/kids_table.png" }
    ],
    description: "Soft foam mat for safe and comfortable playtime."
  },
  {
    id: 55,
    category: "Kids Room",
    name: "Modsy Kids Teepee",
    price: "85€",
    image: "../assets/img/kids_teepee.png",
    colors: [
      { code: "#fafaf9", img: "../assets/img/kids_teepee.png" }
    ],
    description: "Dreamy cotton canvas tent for indoor adventures."
  }
];

window.productsData = productsData;
