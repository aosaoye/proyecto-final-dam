import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const config = {
    user: 'postgres.ccwyesttwlqsogwydaqc',
    host: 'aws-0-eu-west-1.pooler.supabase.com',
    database: 'postgres',
    password: 'JCqbZBsmngYOUcY4',
    port: 6543,
    ssl: {
        rejectUnauthorized: false
    }
};

const pool = new Pool(config);

const products = [
  // GARDEN (10)
  { name: 'Relax Lounger', description: 'Ergonomic outdoor lounger.', price: 120, stock: 15, category: 'Garden', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500' },
  { name: 'Aura Terrace Table', description: 'Durable treated wood table.', price: 250, stock: 8, category: 'Garden', image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=500' },
  { name: 'Solar Umbrella', description: 'Large sunshade with UV protection.', price: 85, stock: 20, category: 'Garden', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=500' },
  { name: 'Rattan Sofa Set', description: 'Comfortable patio sofa collection.', price: 899, stock: 5, category: 'Garden', image: 'https://images.unsplash.com/photo-1571624438279-96845d4b6641?auto=format&fit=crop&w=500' },
  { name: 'Pro Master Grill', description: 'High-performance gas barbecue.', price: 420, stock: 10, category: 'Garden', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500' },
  { name: 'Hanging Hammock', description: 'Bohemian relaxation swing.', price: 45, stock: 30, category: 'Garden', image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&w=500' },
  { name: 'Cubic Planter', description: 'Modern terracotta pot.', price: 35, stock: 45, category: 'Garden', image: 'https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&w=500' },
  { name: 'Park Bench', description: 'Classic iron and wood seating.', price: 150, stock: 12, category: 'Garden', image: 'https://images.unsplash.com/photo-1531218885125-aa8f18a3db10?auto=format&fit=crop&w=500' },
  { name: 'LED String Lights', description: 'Waterproof warm night ambience.', price: 25, stock: 50, category: 'Garden', image: 'https://images.unsplash.com/photo-1517520296626-20b15d72c55e?auto=format&fit=crop&w=500' },
  { name: 'Compact Gazebo', description: 'Easy-assemble folding tent.', price: 199, stock: 7, category: 'Garden', image: 'https://images.unsplash.com/photo-1542729779-10d77186d3f6?auto=format&fit=crop&w=500' },

  // KITCHEN (10)
  { name: 'Oak Kitchen Island', description: 'Spacious central island with wheels.', price: 550, stock: 6, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500' },
  { name: 'Steel Helper Cart', description: '3-tier mobile cart.', price: 89, stock: 22, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e1c5?auto=format&fit=crop&w=500' },
  { name: 'Spice Rack Holder', description: 'Rustic wall organizer.', price: 29, stock: 40, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=500' },
  { name: 'Chef Knife Set', description: '7-piece Damascus steel collection.', price: 135, stock: 15, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=500' },
  { name: 'Industrial Stool', description: 'Metal and wood bar stool.', price: 75, stock: 20, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=500' },
  { name: 'Retro Espresso Machine', description: 'Vintage red styled coffee maker.', price: 199, stock: 11, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=500' },
  { name: 'Folding Wall Table', description: 'Space-saving compact solution.', price: 65, stock: 18, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=500' },
  { name: 'Copper Pendant Lamp', description: 'Modern Nordic fixture design.', price: 48, stock: 25, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=500' },
  { name: 'Black Mixer Faucet', description: 'Matte single-lever kitchen tap.', price: 115, stock: 14, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&w=500' },
  { name: 'Non-Stick Pan Set', description: '5-piece ceramic skillet group.', price: 95, stock: 30, category: 'Kitchen', image: 'https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?auto=format&fit=crop&w=500' },

  // DINING (10)
  { name: 'Oak Dining Table', description: 'Solid wood table seats 6.', price: 450, stock: 5, category: 'Dining', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=500' },
  { name: 'Grey Upholstered Chair', description: 'Style and comfort for dining.', price: 95, stock: 24, category: 'Dining', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500' },
  { name: 'Scandinavian Sideboard', description: '3-door light wood buffet unit.', price: 320, stock: 7, category: 'Dining', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=500' },
  { name: 'Sphere Dining Lamp', description: 'Elegant hanging glass aesthetic.', price: 185, stock: 12, category: 'Dining', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500' },
  { name: 'Glass Cabinet Display', description: 'Ideal to showcase fine china.', price: 280, stock: 4, category: 'Dining', image: 'https://images.unsplash.com/photo-1617806118233-18e152f49600?auto=format&fit=crop&w=500' },
  { name: '24-Piece Dinnerware', description: 'Artisan beige ceramic finish.', price: 110, stock: 20, category: 'Dining', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500' },
  { name: 'Natural Linen Tablecloth', description: 'Soft, durable woven texture.', price: 45, stock: 35, category: 'Dining', image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=500' },
  { name: 'Matte Gold Cutlery', description: 'Complete set for 6 diners.', price: 89, stock: 18, category: 'Dining', image: 'https://images.unsplash.com/photo-1619993340749-04c457305784?auto=format&fit=crop&w=500' },
  { name: 'Vinyl Rug Protection', description: 'Protects floor with chic design.', price: 60, stock: 30, category: 'Dining', image: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=500' },
  { name: 'Velvet Stool Bench', description: 'Premium auxiliary soft seating.', price: 140, stock: 9, category: 'Dining', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500' },

  // LIVING (10)
  { name: 'Baltic Modular Sofa', description: '3-seater convertible modular couch.', price: 780, stock: 3, category: 'Living', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500' },
  { name: 'Leather Lounge Chair', description: 'A modern design classic.', price: 550, stock: 6, category: 'Living', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=500' },
  { name: 'Marble Coffee Table', description: 'Low table topped with real marble.', price: 210, stock: 10, category: 'Living', image: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=500' },
  { name: 'Floating TV Console', description: 'Minimalism for your salon area.', price: 340, stock: 8, category: 'Living', image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=500' },
  { name: 'Modular Bookshelf', description: 'Open metal and oak shelf unit.', price: 290, stock: 12, category: 'Living', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=500' },
  { name: 'Arch Floor Lamp', description: 'Elegant indirect warm light.', price: 125, stock: 15, category: 'Living', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=500' },
  { name: 'Berber Wool Carpet', description: 'Fluffy 2x3 meter woven texture.', price: 250, stock: 5, category: 'Living', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=500' },
  { name: 'Velvet Cushion Pack', description: 'Set of 4 decorative covers.', price: 35, stock: 50, category: 'Living', image: 'https://images.unsplash.com/photo-1579656381226-5fc0f01c7ce9?auto=format&fit=crop&w=500' },
  { name: 'Jute Circular Pouf', description: 'Boho chic extra living seat.', price: 55, stock: 25, category: 'Living', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=500' },
  { name: 'XXL Wall Clock', description: 'Industrial black stamped metal.', price: 65, stock: 20, category: 'Living', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=500' },

  // BEDROOM (10)
  { name: 'Cloud King Size Bed', description: 'Upholstered frame with high headboard.', price: 620, stock: 5, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500' },
  { name: 'Floating Nightstand', description: 'Walnut wood with gliding drawer.', price: 85, stock: 20, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=500' },
  { name: 'Viscoelastic Mattress', description: 'Medium firmness 25cm height.', price: 380, stock: 15, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=500' },
  { name: '6-Drawer Dresser', description: 'Ample white lacquered storage.', price: 275, stock: 10, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500' },
  { name: 'Gilded Standing Mirror', description: 'Golden arch dressing mirror.', price: 140, stock: 12, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500' },
  { name: 'Cotton Sheet Set', description: '300 thread count extreme softness.', price: 55, stock: 40, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500' },
  { name: 'Sherpa Fleece Blanket', description: 'Extra warm insulation for winter.', price: 35, stock: 35, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1606607291535-b0adfbf7424f?auto=format&fit=crop&w=500' },
  { name: 'Wicker Headboard', description: 'Handcrafted organic artisan detail.', price: 190, stock: 8, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1621293954908-d28190a550a0?auto=format&fit=crop&w=500' },
  { name: 'Bedfoot Bench', description: 'Grey tufted velvet upholstery.', price: 120, stock: 10, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500' },
  { name: 'Sensitive Night Light', description: 'Touch dimmable bedside lamp.', price: 29, stock: 50, category: 'Bedroom', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500' },

  // KIDS ROOM (10)
  { name: 'Montessori House Bed', description: 'Encourages safe independence.', price: 240, stock: 7, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=500' },
  { name: 'Mini Activity Table', description: 'Set with 2 matching kids chairs.', price: 75, stock: 15, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=500' },
  { name: 'Kids Teepee Tent', description: 'Playful corner for reading fun.', price: 65, stock: 25, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1566831635316-e6813b996420?auto=format&fit=crop&w=500' },
  { name: 'Toy Chest Organizer', description: 'Accessible colored sorting boxes.', price: 45, stock: 30, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1596073419667-9d8d252f0b80?auto=format&fit=crop&w=500' },
  { name: 'Elephant Pouf', description: 'Fun soft floor seating shape.', price: 49, stock: 20, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1559599101-309bbefc67c8?auto=format&fit=crop&w=500' },
  { name: 'Cloud Wall Shelves', description: 'Set of 3 decorative safe units.', price: 28, stock: 40, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1529465216261-49183b39da8d?auto=format&fit=crop&w=500' },
  { name: 'Stars Wallpaper', description: 'Washable printed vinyl roll.', price: 39, stock: 35, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500' },
  { name: 'Car Circuit Playmat', description: 'Didactic carpet for toy cars.', price: 32, stock: 50, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=500' },
  { name: 'Adjustable Kids Desk', description: 'Height grows with the child.', price: 110, stock: 10, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1564540583246-934407427776?auto=format&fit=crop&w=500' },
  { name: 'Galaxy Star Projector', description: 'Starry sky night ambience.', price: 25, stock: 60, category: 'Kids Room', image: 'https://images.unsplash.com/photo-1629796548124-5a7d5132929f?auto=format&fit=crop&w=500' },

  // BATHROOM (10)
  { name: 'Spa Vanity Unit', description: 'Teak wood floating suspension.', price: 310, stock: 6, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=500' },
  { name: 'Vertical Bath Tower', description: 'Slim space-saving organizer.', price: 120, stock: 14, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1600566752355-35792bedc5d6?auto=format&fit=crop&w=500' },
  { name: 'Anti-Fog LED Mirror', description: 'Tactile front-lit illumination.', price: 175, stock: 12, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=500' },
  { name: 'Premium Towel Pack', description: '4x 600gr Egyptian cotton.', price: 42, stock: 30, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1583943443213-76b28a19bb12?auto=format&fit=crop&w=500' },
  { name: 'Ceramic Dispenser Set', description: 'Marble and gold aesthetic.', price: 24, stock: 45, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1603792907191-89e55f70099a?auto=format&fit=crop&w=500' },
  { name: 'Bamboo Bath Mat', description: 'Eco-friendly anti-slip grip.', price: 19, stock: 50, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebe05fd?auto=format&fit=crop&w=500' },
  { name: 'Black Shower Caddy', description: 'Drill-free stainless steel shelf.', price: 22, stock: 60, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1604044124276-1f4d8090b252?auto=format&fit=crop&w=500' },
  { name: 'Linen Bamboo Basket', description: 'Includes washable interior bag.', price: 35, stock: 25, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=500' },
  { name: 'Tall Waterfall Faucet', description: 'Modern over-counter sink tap.', price: 85, stock: 18, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1584622781867-1c2f603e4a40?auto=format&fit=crop&w=500' },
  { name: 'Industrial Toilet Holder', description: 'Pipes and vintage raw wood.', price: 15, stock: 40, category: 'Bathroom', image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa9e07ac?auto=format&fit=crop&w=500' },

  // OFFICE (10)
  { name: 'Ergo Pro Chair', description: 'Lumbar support and mesh net.', price: 210, stock: 20, category: 'Office', image: 'https://images.unsplash.com/photo-1505843490701-5be5a3f7fe9c?auto=format&fit=crop&w=500' },
  { name: 'Lift Standing Desk', description: 'Motorized work surface.', price: 350, stock: 8, category: 'Office', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500' },
  { name: 'Metal Filing Cabinet', description: '3-drawer with master key.', price: 95, stock: 15, category: 'Office', image: 'https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=500' },
  { name: 'Flexo LED Desk Lamp', description: 'Wireless Qi charger built-in.', price: 45, stock: 30, category: 'Office', image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=500' },
  { name: 'Oak Monitor Riser', description: 'Ergonomic screen stand lift.', price: 38, stock: 25, category: 'Office', image: 'https://images.unsplash.com/photo-1616627561950-9f746e330170?auto=format&fit=crop&w=500' },
  { name: 'Glass Dry-Erase Board', description: 'Magnetic with easy cleaning.', price: 65, stock: 12, category: 'Office', image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=500' },
  { name: 'Desk Drawer Caddy', description: 'Compact felt and oak storage.', price: 28, stock: 40, category: 'Office', image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=500' },
  { name: 'Executive Leather Seat', description: 'High presence and total comfort.', price: 280, stock: 6, category: 'Office', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=500' },
  { name: 'A-Frame Bookshelf', description: 'Modern structure for novels.', price: 120, stock: 18, category: 'Office', image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&w=500' },
  { name: 'Clear Floor Mat', description: 'Prevents wheel scratch damage.', price: 18, stock: 50, category: 'Office', image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=500' },

  // STORAGE (10)
  { name: '2-Door Wardrobe', description: 'Internal built-in drawer tracks.', price: 299, stock: 5, category: 'Storage', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=500' },
  { name: 'Heavy Load Shelving', description: 'Metal unit for garage/shed.', price: 85, stock: 20, category: 'Storage', image: 'https://images.unsplash.com/photo-1589939705384-518cd13fa1fb?auto=format&fit=crop&w=500' },
  { name: 'Compact Shoe Rack', description: 'Capacity for up to 12 pairs.', price: 65, stock: 25, category: 'Storage', image: 'https://images.unsplash.com/photo-1603400521630-9f2de124b33b?auto=format&fit=crop&w=500' },
  { name: '3-Wood Box Set', description: 'Vintage grocery shop style.', price: 32, stock: 45, category: 'Storage', image: 'https://images.unsplash.com/photo-1606166325683-e6deb697d30a?auto=format&fit=crop&w=500' },
  { name: 'Black Metal Coat Rack', description: 'Minimalist freestanding heavy.', price: 45, stock: 30, category: 'Storage', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=500' },
  { name: 'Plastic Box Pack 5', description: 'Clear stackable transparent bin.', price: 28, stock: 50, category: 'Storage', image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=500' },
  { name: 'Plastic Bathroom Chest', description: 'Humidity and mildew resistant.', price: 39, stock: 22, category: 'Storage', image: 'https://images.unsplash.com/photo-1599666505327-7758b44a9985?auto=format&fit=crop&w=500' },
  { name: 'Storage Trunk Box', description: 'Doubles as bench auxiliary seat.', price: 115, stock: 10, category: 'Storage', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=500' },
  { name: 'Wall Bag Hanger', description: 'Closet gap-saver solution.', price: 12, stock: 60, category: 'Storage', image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=500' },
  { name: 'Ladder Shelf Lean', description: 'Functional contemporary leaning unit.', price: 79, stock: 15, category: 'Storage', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500' }
];

async function seed() {
  console.log(`🔄 Connecting with explicit user config to ${config.host}...`);
  const client = await pool.connect();
  try {
    console.log('🔄 Connecting to Postgres...');
    console.log('✅ Connected. Dropping existing products...');
    
    await client.query('DELETE FROM products');
    
    console.log(`📦 Injecting ${products.length} products...`);
    
    for (const prod of products) {
      // Set glb_url depending on item characteristics or defaults
      let glbUrl: string | null = null;
      if (prod.name === 'Relax Lounger' || prod.name === 'Baltic Modular Sofa' || prod.name === 'Leather Lounge Chair') {
        glbUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb';
      } else if (prod.name === 'Ergo Pro Chair' || prod.name === 'Oak Dining Table' || prod.name === 'Industrial Stool') {
        glbUrl = 'https://modelviewer.dev/shared-assets/models/Chair.glb';
      }

      await client.query(
        `INSERT INTO products (name, description, price, stock, category, image, glb_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [prod.name, prod.description, prod.price, prod.stock, prod.category, prod.image, glbUrl]
      );
    }
    
    console.log('🚀 SUCCESSFULLY SEEDED POSTGRES DATABASE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    client.release();
  }
}

seed();
