/* ============================================================
   RC Fragnance — shared data (mirrors src/lib/data.ts, contact.ts,
   images.ts from the Next.js source). Edit here to update content
   across every page.
   ============================================================ */

var CONTACT = {
  email: "info@rcfragrance.com",
  phone: "+91 90300 44450",
  phoneHref: "+919030044450",
  whatsapp: "919030044450",
  location: "Shop No. 4-4 534/99, 100 Kokkonda Complex, Sultan Bazar, Hyderabad, Telangana - 500095",
};

var OIL_IMAGES = {
  "Ferocious Water": "images/oils/ferocious-water.jpg",
  "Morning Sunshine": "images/oils/morning-sunshine.jpg",
  "Noir Obsession": "images/oils/noir-obsession.jpg",
  "Blue Sapphire": "images/oils/blue-sapphire.jpg",
  "Aqua De Lavender": "images/oils/aqua-de-lavender.jpg",
  "Madhurai Malli": "images/oils/madhurai-malli.jpg",
  "Guava": "images/oils/guava.jpg",
  "Candy Apple AFR": "images/oils/candy-apple-afr.jpg",
  "Pineapple": "images/oils/pineapple.jpg",
  "Green Apple Glow": "images/oils/green-apple-glow.jpg",
  "Fragnite": "images/oils/fragnite.jpg",
  "Mogra Abhikriti": "images/oils/mogra-abhikriti.jpg",
  "Lemon GNT": "images/oils/lemon-gnt.jpg",
  "Mogra PR": "images/oils/mogra-pr.jpg",
  "Lime Detergent": "images/oils/lime-detergent.jpg",
  "Mumbai Rose": "images/oils/mumbai-rose.jpg",
  "Energise": "images/oils/energise.jpg",
};

var DIFFUSER_IMAGES = {
  "RC-TW1": "images/diffusers/rc-tw1.jpg",
  "RC-D200": "images/diffusers/rc-d200.jpg",
  "RC-FD1": "images/diffusers/rc-fd1.jpg",
  "RC-FD2": "images/diffusers/rc-fd2.jpg",
  "RC-FD4": "images/diffusers/rc-fd4.jpg",
  "RC-M3": "images/diffusers/rc-m3.jpg",
  "RC-T1": "images/diffusers/rc-t1.jpg",
  "RC-F05": "images/diffusers/rc-f05.jpg",
};

var ABOUT_IMAGE = "images/about/about.jpg";
var HOME_ABOUT_IMAGE = "images/about/home.jpg";

var FEATURED_OILS = [
  {
    name: "Ferocious Water",
    description: "An electrifying rush of oceanic freshness that commands attention. Clean, powerful, and unapologetically bold.",
    top: ["Bergamot", "Lemon", "Lavender"],
    middle: ["Geranium", "Green Apple", "Mint"],
    base: ["Musk", "Patchouli", "Tonka"],
  },
  {
    name: "Morning Sunshine",
    description: "A radiant bouquet that feels like the first light of dawn. Soft, uplifting, and beautifully alive.",
    top: ["Lemon", "Peach", "Pineapple"],
    middle: ["Lily of the Valley", "Rose", "Lavender"],
    base: ["Vanilla", "Ambergris", "Musk", "Cashmere"],
  },
  {
    name: "Noir Obsession",
    description: "A deep, seductive blend wrapped in warm oriental intensity. Mysterious, addictive, and irresistibly sensual.",
    top: ["Lemon", "Pineapple", "Orange"],
    middle: ["Rose", "Jasmine", "Cinnamon"],
    base: ["Sandalwood", "Patchouli", "Musk", "Ambergris"],
  },
  {
    name: "Blue Sapphire",
    description: "A sparkling fusion of aquatic freshness and delicate florals. Elegant, luminous, and effortlessly refined.",
    top: ["Lemon", "Bergamot", "Lavender", "Aqua"],
    middle: ["Rose", "Lily of the Valley", "Cedarwood"],
    base: ["Tonka Bean", "Ambergris", "Patchouli", "Musk"],
  },
  {
    name: "Aqua De Lavender",
    description: "A soothing harmony of lavender layered with aromatic freshness. Calm, clean, and timelessly comforting.",
    top: ["Rosemary", "Lemon", "Lavender"],
    middle: ["Eucalyptus", "White Floral", "Rose"],
    base: ["Ambergris", "Musk"],
  },
];

var MORE_OILS = [
  {
    name: "Madhurai Malli",
    description: "A pure jasmine sambac accord inspired by the temple garlands of South India. Heady, white-floral, and deeply traditional.",
    top: ["Green Leaf", "Bergamot"],
    middle: ["Jasmine Sambac", "Tuberose"],
    base: ["Musk", "Sandalwood"],
  },
  {
    name: "Guava",
    description: "A juicy, sun-ripened tropical fruit accord with a soft floral undertone. Playful, fresh, and unmistakably vacation-scented.",
    top: ["Guava", "Pink Grapefruit"],
    middle: ["White Floral", "Papaya"],
    base: ["Musk", "Vanilla"],
  },
  {
    name: "Candy Apple AFR",
    description: "A caramelised apple gourmand wrapped in warm sugared spice. Nostalgic, sweet, and comforting.",
    top: ["Red Apple", "Cinnamon"],
    middle: ["Caramel", "Clove"],
    base: ["Vanilla", "Musk", "Tonka"],
  },
  {
    name: "Pineapple",
    description: "A bright, juicy pineapple accord layered with tropical warmth. Bold, sunny, and instantly uplifting.",
    top: ["Pineapple", "Mandarin"],
    middle: ["Coconut", "Ylang Ylang"],
    base: ["Musk", "Amber"],
  },
  {
    name: "Green Apple Glow",
    description: "A crisp, dewy green apple accord with a clean floral heart. Sharp, youthful, and effortlessly fresh.",
    top: ["Green Apple", "Lemon"],
    middle: ["Lily of the Valley", "Freesia"],
    base: ["White Musk", "Cedar"],
  },
  {
    name: "Fragnite",
    description: "A bold amber-woods accord built for presence after dark. Smoky, resinous, and quietly commanding.",
    top: ["Bergamot", "Pink Pepper"],
    middle: ["Amber", "Incense"],
    base: ["Oud", "Sandalwood", "Musk"],
  },
  {
    name: "Mogra Abhikriti",
    description: "An expressive mogra accord, rich and creamy at its heart. Traditional, opulent, and quietly hypnotic.",
    top: ["Green Leaf", "Neroli"],
    middle: ["Mogra", "Jasmine"],
    base: ["Sandalwood", "Musk"],
  },
  {
    name: "Lemon GNT",
    description: "A crisp citrus and juniper accord inspired by a classic gin and tonic. Sharp, botanical, and refreshingly grown-up.",
    top: ["Lemon", "Juniper Berry"],
    middle: ["Bergamot", "Botanical Herbs"],
    base: ["Musk", "Vetiver"],
  },
  {
    name: "Mogra PR",
    description: "A refined take on mogra, brighter and more linear than its Abhikriti sibling. Clean, floral, and effortlessly wearable.",
    top: ["Bergamot", "Green Leaf"],
    middle: ["Mogra", "White Floral"],
    base: ["Musk", "Amber"],
  },
  {
    name: "Lime Detergent",
    description: "A crisp, laundered-linen accord built around sparkling lime. Clean, minimal, and instantly familiar.",
    top: ["Lime", "Aldehydes"],
    middle: ["Clean Cotton", "White Musk"],
    base: ["Musk", "Cedarwood"],
  },
  {
    name: "Mumbai Rose",
    description: "A rose accord with an urban edge — softer than a garden rose, warmer than a city street. Romantic with real character.",
    top: ["Lychee", "Bergamot"],
    middle: ["Rose", "Peony"],
    base: ["Musk", "Ambergris"],
  },
  {
    name: "Energise",
    description: "An invigorating citrus-mint accord designed to sharpen focus and lift a room in seconds. Clean, cold, and immediate.",
    top: ["Grapefruit", "Mint"],
    middle: ["Eucalyptus", "Basil"],
    base: ["White Musk", "Vetiver"],
  },
];

var ALL_OILS = FEATURED_OILS.concat(MORE_OILS);

var DIFFUSERS = [
  {
    code: "RC-TW1",
    name: "Tower",
    form: "Wall-mounted / portable",
    coverage: "Up to 2,500 sqft",
    bottle: "2 × 1000ml",
    material: "Metal",
    power: "24W",
    features: ["Safe lock", "Built-in fan", "Touch screen", "Bluetooth & Wi-Fi app"],
  },
  {
    code: "RC-D200",
    name: "Slim Tower",
    form: "Tabletop, waterless",
    coverage: "Up to 1,000 sqft",
    bottle: "100ml",
    material: "Aluminium alloy + PP",
    power: "5W",
    features: ["Waterless technology", "USB-C powered", "Bluetooth & app control", "Ultra-quiet (<38dB)"],
  },
  {
    code: "RC-FD1",
    name: "Studio",
    form: "Wall-mounted / stand-alone",
    coverage: "Up to 3,000 sqft",
    bottle: "1000ml",
    material: "Metal",
    power: "24W",
    features: ["Remote app control", "Touchscreen", "Large capacity", "Durable build"],
  },
  {
    code: "RC-FD2",
    name: "Portable Pro",
    form: "Hand-held / stand-alone",
    coverage: "1,500 – 2,000 sqft",
    bottle: "1000ml",
    material: "Metal",
    power: "60W",
    features: ["Time programming", "Bluetooth & Wi-Fi app", "Large coverage"],
  },
  {
    code: "RC-FD4",
    name: "Slim",
    form: "Portable, press design",
    coverage: "200 – 500 sqft",
    bottle: "100ml",
    material: "Aluminium alloy",
    power: "12W",
    features: ["Quiet performance", "Time programming", "Bluetooth & Wi-Fi app"],
  },
  {
    code: "RC-M3",
    name: "Cube",
    form: "Portable, cubic design",
    coverage: "800 – 1,000 sqft",
    bottle: "200ml",
    material: "Aluminium alloy",
    power: "12W",
    features: ["Low noise", "Touch screen", "Built-in Bluetooth speaker"],
  },
  {
    code: "RC-T1",
    name: "Puck",
    form: "Compact, waterless",
    coverage: "800 – 1,000 sqft",
    bottle: "500ml",
    material: "PP plastic",
    power: "12W",
    features: ["No wall damage", "Long lasting", "Bluetooth & Wi-Fi app"],
  },
  {
    code: "RC-F05",
    name: "Dual Reservoir",
    form: "Hand-held / stand-alone",
    coverage: "Up to 7,000 sqft",
    bottle: "2 × 1000ml",
    material: "Metal",
    power: "60W",
    features: ["Dual scent channels", "Time programming", "Large-venue coverage"],
  },
];
