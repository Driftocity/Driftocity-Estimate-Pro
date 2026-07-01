// Regional pricing multipliers by ZIP code prefix (first 3 digits)
// Base rates are national averages; multipliers adjust for local COL
const REGIONAL_MULTIPLIERS = {
  // Northeast (high COL)
  "100": 1.55, "101": 1.55, "102": 1.55, "103": 1.55, "104": 1.55, // NYC
  "110": 1.45, "111": 1.45, "112": 1.45, "113": 1.45, "114": 1.45, // NYC boroughs
  "020": 1.40, "021": 1.40, "022": 1.38, "023": 1.35, "024": 1.35, // Boston
  "060": 1.38, "061": 1.38, "062": 1.35, "063": 1.33, "064": 1.33, // Connecticut
  "080": 1.30, "081": 1.30, "082": 1.28, "083": 1.28, "084": 1.28, // NJ
  "190": 1.32, "191": 1.32, "192": 1.30, "193": 1.28, "194": 1.28, // Philadelphia
  // Mid-Atlantic
  "200": 1.42, "201": 1.42, "202": 1.42, "203": 1.40, "204": 1.40, // DC/Northern VA
  "210": 1.22, "211": 1.22, "212": 1.22, "213": 1.20, "214": 1.20, // Baltimore
  // Southeast (moderate)
  "300": 1.05, "301": 1.05, "302": 1.05, "303": 1.05, "304": 1.02, // Atlanta
  "320": 0.98, "321": 0.98, "322": 0.96, "323": 0.95, "324": 0.95, // Jacksonville
  "330": 1.08, "331": 1.08, "332": 1.06, "333": 1.05, "334": 1.05, // Miami
  "340": 1.02, "341": 1.02, "342": 1.00, "343": 1.00, "344": 1.00, // Tampa
  "270": 0.97, "271": 0.97, "272": 0.96, "273": 0.95, "274": 0.95, // NC
  "280": 0.97, "281": 0.97, "282": 0.96, "283": 0.95, "284": 0.95, // NC Piedmont
  "290": 0.94, "291": 0.94, "292": 0.93, "293": 0.93, "294": 0.93, // SC
  // Midwest (below average)
  "600": 1.25, "601": 1.25, "602": 1.23, "603": 1.22, "604": 1.22, // Chicago
  "480": 1.10, "481": 1.10, "482": 1.08, "483": 1.08, "484": 1.07, // Detroit
  "550": 1.05, "551": 1.05, "552": 1.04, "553": 1.04, "554": 1.03, // Minneapolis
  "430": 1.00, "431": 1.00, "432": 0.99, "433": 0.99, "434": 0.99, // Columbus
  "440": 1.02, "441": 1.02, "442": 1.00, "443": 1.00, "444": 1.00, // Cleveland
  "630": 1.00, "631": 1.00, "632": 0.99, "633": 0.98, "634": 0.98, // St. Louis
  "640": 0.96, "641": 0.96, "642": 0.95, "643": 0.95, "644": 0.95, // Kansas City
  // South/Southwest (moderate-low)
  "750": 1.00, "751": 1.00, "752": 0.99, "753": 0.99, "754": 0.98, // Dallas
  "770": 0.99, "771": 0.99, "772": 0.98, "773": 0.97, "774": 0.97, // Houston
  "730": 0.93, "731": 0.93, "732": 0.92, "733": 0.92, "734": 0.91, // Oklahoma City
  "870": 0.92, "871": 0.92, "872": 0.91, "873": 0.91, "874": 0.91, // Albuquerque
  // Mountain West
  "800": 1.08, "801": 1.08, "802": 1.07, "803": 1.06, "804": 1.06, // Denver
  "840": 0.98, "841": 0.98, "842": 0.97, "843": 0.97, "844": 0.97, // Salt Lake
  "850": 1.00, "851": 1.00, "852": 0.99, "853": 0.98, "854": 0.98, // Phoenix
  "890": 1.03, "891": 1.03, "892": 1.02, "893": 1.01, "894": 1.01, // Las Vegas
  // West Coast (high COL)
  "900": 1.45, "901": 1.45, "902": 1.42, "903": 1.42, "904": 1.40, // LA
  "910": 1.40, "911": 1.40, "912": 1.38, "913": 1.38, "914": 1.35, // San Fernando
  "940": 1.52, "941": 1.52, "942": 1.50, "943": 1.48, "944": 1.48, // San Francisco
  "950": 1.45, "951": 1.45, "952": 1.43, "953": 1.42, "954": 1.42, // San Jose
  "970": 1.22, "971": 1.22, "972": 1.20, "973": 1.18, "974": 1.18, // Portland
  "980": 1.28, "981": 1.28, "982": 1.26, "983": 1.24, "984": 1.24, // Seattle
  // Alaska/Hawaii
  "995": 1.60, "996": 1.60, "997": 1.58, "998": 1.58, "999": 1.60, // Alaska
  "967": 1.55, "968": 1.55, // Hawaii
};

// Default multiplier for unlisted ZIP prefixes
const DEFAULT_MULTIPLIER = 1.00;

function getMultiplier(zip) {
  if (!zip || zip.length < 3) return DEFAULT_MULTIPLIER;
  const prefix = zip.substring(0, 3);
  return REGIONAL_MULTIPLIERS[prefix] || DEFAULT_MULTIPLIER;
}

// =============================================
// TRADE TYPES & THEIR LINE ITEMS
// =============================================
const TRADES = {
  general: {
    label: "General Contracting",
    icon: "🏗️",
    description: "General construction, project management, site work",
    categories: [
      {
        name: "Site Preparation",
        items: [
          { id: "site_survey", name: "Site Survey & Layout", unit: "ls", basePrice: 850, laborPct: 0.70 },
          { id: "excavation", name: "Excavation (per cubic yard)", unit: "cy", basePrice: 22, laborPct: 0.65 },
          { id: "grading", name: "Grading & Leveling", unit: "sqft", basePrice: 1.80, laborPct: 0.60 },
          { id: "demo_interior", name: "Interior Demolition", unit: "sqft", basePrice: 3.50, laborPct: 0.75 },
          { id: "demo_exterior", name: "Exterior Demolition", unit: "sqft", basePrice: 5.00, laborPct: 0.70 },
          { id: "hauling", name: "Debris Hauling (per load)", unit: "load", basePrice: 380, laborPct: 0.60 },
        ]
      },
      {
        name: "Framing & Structure",
        items: [
          { id: "framing_wall", name: "Wall Framing (per LF)", unit: "lf", basePrice: 28, laborPct: 0.55 },
          { id: "framing_floor", name: "Floor Framing (per sqft)", unit: "sqft", basePrice: 8.50, laborPct: 0.50 },
          { id: "framing_roof", name: "Roof Framing (per sqft)", unit: "sqft", basePrice: 11, laborPct: 0.50 },
          { id: "sheathing", name: "OSB/Plywood Sheathing", unit: "sqft", basePrice: 3.20, laborPct: 0.45 },
          { id: "subfloor", name: "Subfloor Installation", unit: "sqft", basePrice: 4.50, laborPct: 0.50 },
          { id: "lvl_beam", name: "LVL Beam Installation (per LF)", unit: "lf", basePrice: 95, laborPct: 0.55 },
        ]
      },
      {
        name: "Project Management",
        items: [
          { id: "pm_daily", name: "Project Management (per day)", unit: "day", basePrice: 650, laborPct: 1.00 },
          { id: "permit_pull", name: "Permit Pulling & Filing", unit: "ls", basePrice: 450, laborPct: 0.80 },
          { id: "inspection", name: "Inspection Coordination", unit: "ls", basePrice: 300, laborPct: 1.00 },
          { id: "cleanup", name: "Final Cleanup", unit: "ls", basePrice: 550, laborPct: 0.85 },
        ]
      }
    ]
  },

  electrical: {
    label: "Electrical",
    icon: "⚡",
    description: "Wiring, panels, outlets, lighting, EV chargers",
    categories: [
      {
        name: "Panel & Service",
        items: [
          { id: "panel_100", name: "100A Panel Upgrade", unit: "ls", basePrice: 1800, laborPct: 0.55 },
          { id: "panel_200", name: "200A Panel Upgrade", unit: "ls", basePrice: 2800, laborPct: 0.50 },
          { id: "panel_400", name: "400A Panel Upgrade", unit: "ls", basePrice: 4500, laborPct: 0.50 },
          { id: "subpanel", name: "Subpanel Installation (60A)", unit: "ls", basePrice: 1400, laborPct: 0.55 },
          { id: "meter_socket", name: "Meter Socket Replacement", unit: "ls", basePrice: 750, laborPct: 0.60 },
          { id: "grounding", name: "Grounding System", unit: "ls", basePrice: 650, laborPct: 0.60 },
        ]
      },
      {
        name: "Wiring & Circuits",
        items: [
          { id: "circuit_20a", name: "New 20A Circuit", unit: "ea", basePrice: 320, laborPct: 0.60 },
          { id: "circuit_15a", name: "New 15A Circuit", unit: "ea", basePrice: 275, laborPct: 0.60 },
          { id: "circuit_240", name: "240V Circuit (dryer/range)", unit: "ea", basePrice: 480, laborPct: 0.58 },
          { id: "rewire_room", name: "Room Rewire", unit: "room", basePrice: 900, laborPct: 0.65 },
          { id: "rewire_house", name: "Whole House Rewire (per sqft)", unit: "sqft", basePrice: 8.50, laborPct: 0.65 },
          { id: "conduit_run", name: "Conduit Run (per LF)", unit: "lf", basePrice: 18, laborPct: 0.60 },
        ]
      },
      {
        name: "Devices & Fixtures",
        items: [
          { id: "outlet_install", name: "Outlet Installation", unit: "ea", basePrice: 185, laborPct: 0.65 },
          { id: "gfci_outlet", name: "GFCI Outlet Installation", unit: "ea", basePrice: 220, laborPct: 0.65 },
          { id: "switch_install", name: "Switch Installation", unit: "ea", basePrice: 175, laborPct: 0.65 },
          { id: "light_fixture", name: "Light Fixture Install", unit: "ea", basePrice: 195, laborPct: 0.60 },
          { id: "recessed_light", name: "Recessed Lighting (per can)", unit: "ea", basePrice: 280, laborPct: 0.60 },
          { id: "ceiling_fan", name: "Ceiling Fan Installation", unit: "ea", basePrice: 310, laborPct: 0.65 },
          { id: "ev_charger", name: "EV Charger (Level 2)", unit: "ls", basePrice: 1200, laborPct: 0.55 },
          { id: "smoke_detector", name: "Smoke/CO Detector", unit: "ea", basePrice: 145, laborPct: 0.65 },
        ]
      }
    ]
  },

  plumbing: {
    label: "Plumbing",
    icon: "🔧",
    description: "Pipes, fixtures, water heaters, drains",
    categories: [
      {
        name: "Pipe Work",
        items: [
          { id: "pipe_copper", name: "Copper Pipe (per LF)", unit: "lf", basePrice: 22, laborPct: 0.60 },
          { id: "pipe_pex", name: "PEX Pipe (per LF)", unit: "lf", basePrice: 14, laborPct: 0.55 },
          { id: "pipe_pvc", name: "PVC Drain Pipe (per LF)", unit: "lf", basePrice: 16, laborPct: 0.58 },
          { id: "pipe_cast", name: "Cast Iron Replacement (per LF)", unit: "lf", basePrice: 55, laborPct: 0.65 },
          { id: "repipe_bath", name: "Bathroom Repipe", unit: "ls", basePrice: 1800, laborPct: 0.62 },
          { id: "repipe_house", name: "Whole House Repipe (per sqft)", unit: "sqft", basePrice: 6.50, laborPct: 0.62 },
          { id: "shutoff_valve", name: "Shutoff Valve Installation", unit: "ea", basePrice: 225, laborPct: 0.65 },
        ]
      },
      {
        name: "Fixtures",
        items: [
          { id: "toilet_install", name: "Toilet Installation", unit: "ea", basePrice: 380, laborPct: 0.60 },
          { id: "sink_bath", name: "Bathroom Sink Install", unit: "ea", basePrice: 320, laborPct: 0.60 },
          { id: "sink_kitchen", name: "Kitchen Sink Install", unit: "ea", basePrice: 420, laborPct: 0.58 },
          { id: "faucet_install", name: "Faucet Installation", unit: "ea", basePrice: 280, laborPct: 0.65 },
          { id: "shower_install", name: "Shower Installation", unit: "ls", basePrice: 2200, laborPct: 0.60 },
          { id: "tub_install", name: "Bathtub Installation", unit: "ls", basePrice: 1800, laborPct: 0.58 },
          { id: "dishwasher_install", name: "Dishwasher Hook-up", unit: "ls", basePrice: 350, laborPct: 0.70 },
          { id: "garbage_disposal", name: "Garbage Disposal Install", unit: "ls", basePrice: 320, laborPct: 0.70 },
        ]
      },
      {
        name: "Water Heaters & Drains",
        items: [
          { id: "wh_tank", name: "Tank Water Heater (40 gal)", unit: "ls", basePrice: 1350, laborPct: 0.48 },
          { id: "wh_tankless", name: "Tankless Water Heater", unit: "ls", basePrice: 2800, laborPct: 0.42 },
          { id: "wh_hybrid", name: "Hybrid Heat Pump WH", unit: "ls", basePrice: 3200, laborPct: 0.42 },
          { id: "drain_clean", name: "Drain Cleaning (per drain)", unit: "ea", basePrice: 225, laborPct: 0.85 },
          { id: "sewer_camera", name: "Sewer Camera Inspection", unit: "ls", basePrice: 380, laborPct: 0.75 },
          { id: "sewer_line", name: "Sewer Line Repair (per LF)", unit: "lf", basePrice: 95, laborPct: 0.65 },
        ]
      }
    ]
  },

  hvac: {
    label: "HVAC",
    icon: "❄️",
    description: "Heating, cooling, ventilation, ductwork",
    categories: [
      {
        name: "AC & Cooling",
        items: [
          { id: "ac_2ton", name: "2-Ton AC System (split)", unit: "ls", basePrice: 4200, laborPct: 0.45 },
          { id: "ac_3ton", name: "3-Ton AC System (split)", unit: "ls", basePrice: 5200, laborPct: 0.43 },
          { id: "ac_4ton", name: "4-Ton AC System (split)", unit: "ls", basePrice: 6400, laborPct: 0.42 },
          { id: "ac_5ton", name: "5-Ton AC System (split)", unit: "ls", basePrice: 7800, laborPct: 0.42 },
          { id: "minisplit_1z", name: "Mini-Split 1 Zone", unit: "ls", basePrice: 3200, laborPct: 0.50 },
          { id: "minisplit_2z", name: "Mini-Split 2 Zone", unit: "ls", basePrice: 5400, laborPct: 0.48 },
          { id: "minisplit_4z", name: "Mini-Split 4 Zone", unit: "ls", basePrice: 8800, laborPct: 0.46 },
          { id: "condenser_only", name: "Condenser Replacement Only", unit: "ls", basePrice: 2800, laborPct: 0.50 },
          { id: "airhandler_only", name: "Air Handler Replacement Only", unit: "ls", basePrice: 1800, laborPct: 0.55 },
        ]
      },
      {
        name: "Heating",
        items: [
          { id: "furnace_gas", name: "Gas Furnace (80K BTU)", unit: "ls", basePrice: 3200, laborPct: 0.48 },
          { id: "furnace_elec", name: "Electric Furnace", unit: "ls", basePrice: 2200, laborPct: 0.50 },
          { id: "heatpump", name: "Heat Pump System (3 ton)", unit: "ls", basePrice: 5800, laborPct: 0.45 },
          { id: "boiler_gas", name: "Gas Boiler Replacement", unit: "ls", basePrice: 5500, laborPct: 0.50 },
          { id: "baseboard_elec", name: "Electric Baseboard (per LF)", unit: "lf", basePrice: 85, laborPct: 0.55 },
          { id: "radiant_floor", name: "Radiant Floor Heat (sqft)", unit: "sqft", basePrice: 22, laborPct: 0.55 },
        ]
      },
      {
        name: "Ductwork & Ventilation",
        items: [
          { id: "duct_new", name: "New Ductwork (per LF)", unit: "lf", basePrice: 28, laborPct: 0.60 },
          { id: "duct_seal", name: "Duct Sealing (per house)", unit: "ls", basePrice: 1200, laborPct: 0.80 },
          { id: "duct_clean", name: "Duct Cleaning", unit: "ls", basePrice: 550, laborPct: 0.75 },
          { id: "exhaust_fan", name: "Bathroom Exhaust Fan", unit: "ea", basePrice: 380, laborPct: 0.65 },
          { id: "range_hood", name: "Range Hood Install", unit: "ls", basePrice: 520, laborPct: 0.62 },
          { id: "erv_hrv", name: "ERV/HRV System", unit: "ls", basePrice: 2800, laborPct: 0.52 },
          { id: "register_install", name: "Register/Grille Install", unit: "ea", basePrice: 120, laborPct: 0.65 },
          { id: "thermostat_smart", name: "Smart Thermostat Install", unit: "ea", basePrice: 280, laborPct: 0.65 },
        ]
      }
    ]
  },

  roofing: {
    label: "Roofing",
    icon: "🏠",
    description: "Shingles, flat roofs, gutters, flashing",
    categories: [
      {
        name: "Roof Installation",
        items: [
          { id: "shingle_3tab", name: "3-Tab Shingles (per sq)", unit: "sq", basePrice: 380, laborPct: 0.55 },
          { id: "shingle_arch", name: "Architectural Shingles (per sq)", unit: "sq", basePrice: 480, laborPct: 0.53 },
          { id: "shingle_premium", name: "Premium Shingles (per sq)", unit: "sq", basePrice: 680, laborPct: 0.50 },
          { id: "metal_standing", name: "Standing Seam Metal (per sq)", unit: "sq", basePrice: 1100, laborPct: 0.50 },
          { id: "metal_corrugated", name: "Corrugated Metal (per sq)", unit: "sq", basePrice: 750, laborPct: 0.52 },
          { id: "flat_tpo", name: "TPO Flat Roof (per sq)", unit: "sq", basePrice: 580, laborPct: 0.55 },
          { id: "flat_epdm", name: "EPDM Flat Roof (per sq)", unit: "sq", basePrice: 520, laborPct: 0.55 },
          { id: "cedar_shake", name: "Cedar Shake (per sq)", unit: "sq", basePrice: 850, laborPct: 0.55 },
          { id: "tile_clay", name: "Clay Tile (per sq)", unit: "sq", basePrice: 1200, laborPct: 0.52 },
          { id: "tile_concrete", name: "Concrete Tile (per sq)", unit: "sq", basePrice: 900, laborPct: 0.52 },
        ]
      },
      {
        name: "Decking & Underlayment",
        items: [
          { id: "decking_osb", name: "Roof Decking/Sheathing (per sq)", unit: "sq", basePrice: 220, laborPct: 0.55 },
          { id: "underlayment", name: "Felt/Synthetic Underlayment", unit: "sq", basePrice: 45, laborPct: 0.60 },
          { id: "ice_water", name: "Ice & Water Shield (per sq)", unit: "sq", basePrice: 95, laborPct: 0.55 },
          { id: "ridge_vent", name: "Ridge Vent (per LF)", unit: "lf", basePrice: 22, laborPct: 0.60 },
          { id: "soffit_vent", name: "Soffit Vent (per ea)", unit: "ea", basePrice: 65, laborPct: 0.65 },
        ]
      },
      {
        name: "Gutters & Flashing",
        items: [
          { id: "gutter_alum", name: "Aluminum Gutters (per LF)", unit: "lf", basePrice: 14, laborPct: 0.60 },
          { id: "gutter_copper", name: "Copper Gutters (per LF)", unit: "lf", basePrice: 42, laborPct: 0.58 },
          { id: "gutter_guard", name: "Gutter Guards (per LF)", unit: "lf", basePrice: 18, laborPct: 0.55 },
          { id: "downspout", name: "Downspout (per LF)", unit: "lf", basePrice: 10, laborPct: 0.65 },
          { id: "flashing_chimney", name: "Chimney Flashing", unit: "ls", basePrice: 850, laborPct: 0.65 },
          { id: "flashing_skylight", name: "Skylight Flashing", unit: "ea", basePrice: 480, laborPct: 0.65 },
          { id: "drip_edge", name: "Drip Edge (per LF)", unit: "lf", basePrice: 5.50, laborPct: 0.65 },
        ]
      }
    ]
  },

  flooring: {
    label: "Flooring",
    icon: "🏢",
    description: "Hardwood, tile, LVP, carpet installation",
    categories: [
      {
        name: "Hardwood & Engineered",
        items: [
          { id: "hw_solid", name: "Solid Hardwood (per sqft)", unit: "sqft", basePrice: 12, laborPct: 0.48 },
          { id: "hw_engineered", name: "Engineered Hardwood (per sqft)", unit: "sqft", basePrice: 9.50, laborPct: 0.48 },
          { id: "hw_refinish", name: "Hardwood Refinish (per sqft)", unit: "sqft", basePrice: 4.50, laborPct: 0.80 },
          { id: "hw_sand_stain", name: "Sand, Stain & Poly (per sqft)", unit: "sqft", basePrice: 6.50, laborPct: 0.78 },
        ]
      },
      {
        name: "Tile & Stone",
        items: [
          { id: "tile_ceramic", name: "Ceramic Tile (per sqft)", unit: "sqft", basePrice: 8.50, laborPct: 0.55 },
          { id: "tile_porcelain", name: "Porcelain Tile (per sqft)", unit: "sqft", basePrice: 12, laborPct: 0.52 },
          { id: "tile_natural", name: "Natural Stone Tile (per sqft)", unit: "sqft", basePrice: 18, laborPct: 0.50 },
          { id: "tile_large", name: "Large Format Tile 24x24+ (sqft)", unit: "sqft", basePrice: 22, laborPct: 0.50 },
          { id: "tile_mosaic", name: "Mosaic/Backsplash Tile (sqft)", unit: "sqft", basePrice: 28, laborPct: 0.58 },
          { id: "tile_grout", name: "Grout Only (per sqft)", unit: "sqft", basePrice: 2.50, laborPct: 0.82 },
        ]
      },
      {
        name: "LVP, Laminate & Carpet",
        items: [
          { id: "lvp", name: "Luxury Vinyl Plank (per sqft)", unit: "sqft", basePrice: 7.50, laborPct: 0.48 },
          { id: "lvt", name: "Luxury Vinyl Tile (per sqft)", unit: "sqft", basePrice: 7.00, laborPct: 0.48 },
          { id: "laminate", name: "Laminate Flooring (per sqft)", unit: "sqft", basePrice: 6.00, laborPct: 0.50 },
          { id: "carpet", name: "Carpet Installation (per sqft)", unit: "sqft", basePrice: 5.50, laborPct: 0.45 },
          { id: "carpet_pad", name: "Carpet Padding (per sqft)", unit: "sqft", basePrice: 1.80, laborPct: 0.65 },
          { id: "floor_remove", name: "Old Flooring Removal (sqft)", unit: "sqft", basePrice: 2.50, laborPct: 0.80 },
        ]
      }
    ]
  },

  painting: {
    label: "Painting",
    icon: "🎨",
    description: "Interior, exterior, cabinets, specialty coatings",
    categories: [
      {
        name: "Interior Painting",
        items: [
          { id: "int_wall", name: "Interior Walls (per sqft)", unit: "sqft", basePrice: 2.80, laborPct: 0.72 },
          { id: "int_ceiling", name: "Interior Ceiling (per sqft)", unit: "sqft", basePrice: 2.50, laborPct: 0.74 },
          { id: "int_room", name: "Room Paint (walls + ceiling)", unit: "room", basePrice: 650, laborPct: 0.70 },
          { id: "int_trim", name: "Trim & Baseboard (per LF)", unit: "lf", basePrice: 4.50, laborPct: 0.75 },
          { id: "int_door", name: "Interior Door Paint", unit: "ea", basePrice: 180, laborPct: 0.75 },
          { id: "int_cabinet", name: "Cabinet Painting (per door/drawer)", unit: "ea", basePrice: 95, laborPct: 0.75 },
          { id: "int_full_house", name: "Full House Interior (sqft)", unit: "sqft", basePrice: 3.20, laborPct: 0.70 },
        ]
      },
      {
        name: "Exterior Painting",
        items: [
          { id: "ext_siding", name: "Exterior Siding (per sqft)", unit: "sqft", basePrice: 3.50, laborPct: 0.68 },
          { id: "ext_trim", name: "Exterior Trim (per LF)", unit: "lf", basePrice: 6.00, laborPct: 0.72 },
          { id: "ext_door", name: "Exterior Door Paint", unit: "ea", basePrice: 280, laborPct: 0.72 },
          { id: "ext_full_house", name: "Full Exterior House (sqft)", unit: "sqft", basePrice: 4.20, laborPct: 0.66 },
          { id: "deck_stain", name: "Deck Stain (per sqft)", unit: "sqft", basePrice: 3.00, laborPct: 0.70 },
          { id: "power_wash", name: "Power Washing (per sqft)", unit: "sqft", basePrice: 0.50, laborPct: 0.80 },
        ]
      },
      {
        name: "Specialty Coatings",
        items: [
          { id: "drywall_prime", name: "Drywall Prime Coat (sqft)", unit: "sqft", basePrice: 1.20, laborPct: 0.72 },
          { id: "epoxy_floor", name: "Epoxy Floor Coating (sqft)", unit: "sqft", basePrice: 6.50, laborPct: 0.60 },
          { id: "texture_wall", name: "Wall Texture (sqft)", unit: "sqft", basePrice: 3.80, laborPct: 0.75 },
          { id: "popcorn_remove", name: "Popcorn Ceiling Removal (sqft)", unit: "sqft", basePrice: 2.80, laborPct: 0.82 },
          { id: "faux_finish", name: "Faux/Decorative Finish (sqft)", unit: "sqft", basePrice: 12, laborPct: 0.75 },
        ]
      }
    ]
  },

  carpentry: {
    label: "Carpentry & Millwork",
    icon: "🪚",
    description: "Trim, cabinets, doors, custom woodwork",
    categories: [
      {
        name: "Trim & Moldings",
        items: [
          { id: "baseboard", name: "Baseboard Install (per LF)", unit: "lf", basePrice: 8.50, laborPct: 0.65 },
          { id: "crown_molding", name: "Crown Molding (per LF)", unit: "lf", basePrice: 14, laborPct: 0.68 },
          { id: "casing_door", name: "Door Casing (per door)", unit: "ea", basePrice: 220, laborPct: 0.65 },
          { id: "casing_window", name: "Window Casing (per window)", unit: "ea", basePrice: 195, laborPct: 0.65 },
          { id: "wainscoting", name: "Wainscoting (per sqft)", unit: "sqft", basePrice: 22, laborPct: 0.65 },
          { id: "chair_rail", name: "Chair Rail (per LF)", unit: "lf", basePrice: 10, laborPct: 0.68 },
        ]
      },
      {
        name: "Doors & Windows",
        items: [
          { id: "door_interior", name: "Interior Door Install", unit: "ea", basePrice: 380, laborPct: 0.60 },
          { id: "door_exterior", name: "Exterior Door Install", unit: "ea", basePrice: 650, laborPct: 0.55 },
          { id: "door_prehung", name: "Pre-hung Door Install", unit: "ea", basePrice: 480, laborPct: 0.58 },
          { id: "door_barn", name: "Barn Door Install", unit: "ea", basePrice: 850, laborPct: 0.55 },
          { id: "window_install", name: "Window Installation", unit: "ea", basePrice: 750, laborPct: 0.55 },
          { id: "window_replace", name: "Window Replacement", unit: "ea", basePrice: 950, laborPct: 0.52 },
          { id: "skylight_install", name: "Skylight Installation", unit: "ea", basePrice: 1800, laborPct: 0.50 },
        ]
      },
      {
        name: "Cabinets & Built-ins",
        items: [
          { id: "cabinet_install", name: "Cabinet Install (per LF)", unit: "lf", basePrice: 280, laborPct: 0.55 },
          { id: "shelving_custom", name: "Custom Shelving (per LF)", unit: "lf", basePrice: 180, laborPct: 0.62 },
          { id: "closet_system", name: "Closet System Install", unit: "ls", basePrice: 1400, laborPct: 0.55 },
          { id: "bookcase_built", name: "Built-in Bookcase (per LF)", unit: "lf", basePrice: 320, laborPct: 0.60 },
          { id: "countertop_laminate", name: "Laminate Countertop (per LF)", unit: "lf", basePrice: 85, laborPct: 0.55 },
          { id: "countertop_granite", name: "Granite Countertop (per sqft)", unit: "sqft", basePrice: 85, laborPct: 0.45 },
          { id: "countertop_quartz", name: "Quartz Countertop (per sqft)", unit: "sqft", basePrice: 95, laborPct: 0.43 },
          { id: "countertop_butcher", name: "Butcher Block (per sqft)", unit: "sqft", basePrice: 65, laborPct: 0.50 },
        ]
      }
    ]
  },

  drywall: {
    label: "Drywall & Plaster",
    icon: "🧱",
    description: "Hanging, taping, finishing, patching",
    categories: [
      {
        name: "Drywall Installation",
        items: [
          { id: "dw_hang", name: "Drywall Hanging (per sqft)", unit: "sqft", basePrice: 1.80, laborPct: 0.60 },
          { id: "dw_tape_mud", name: "Tape & Mud Only (per sqft)", unit: "sqft", basePrice: 2.20, laborPct: 0.78 },
          { id: "dw_complete", name: "Full Install + Finish (sqft)", unit: "sqft", basePrice: 4.50, laborPct: 0.68 },
          { id: "dw_ceiling", name: "Ceiling Drywall (per sqft)", unit: "sqft", basePrice: 5.50, laborPct: 0.68 },
          { id: "dw_moisture", name: "Moisture Resistant DW (sqft)", unit: "sqft", basePrice: 5.80, laborPct: 0.65 },
          { id: "dw_fire", name: "Fire-rated Drywall (per sqft)", unit: "sqft", basePrice: 6.20, laborPct: 0.65 },
          { id: "dw_sound", name: "Soundproof Drywall (per sqft)", unit: "sqft", basePrice: 8.00, laborPct: 0.62 },
        ]
      },
      {
        name: "Patching & Repairs",
        items: [
          { id: "patch_small", name: "Small Hole Patch (<6\")", unit: "ea", basePrice: 180, laborPct: 0.82 },
          { id: "patch_medium", name: "Medium Patch (6-12\")", unit: "ea", basePrice: 280, laborPct: 0.80 },
          { id: "patch_large", name: "Large Area Patch (per sqft)", unit: "sqft", basePrice: 12, laborPct: 0.78 },
          { id: "crack_repair", name: "Crack Repair (per LF)", unit: "lf", basePrice: 18, laborPct: 0.82 },
          { id: "water_damage", name: "Water Damage Repair (sqft)", unit: "sqft", basePrice: 18, laborPct: 0.75 },
        ]
      }
    ]
  },

  concrete: {
    label: "Concrete & Masonry",
    icon: "⚙️",
    description: "Foundations, flatwork, block, brick, stone",
    categories: [
      {
        name: "Flatwork",
        items: [
          { id: "concrete_slab", name: "Concrete Slab (per sqft, 4\")", unit: "sqft", basePrice: 8.50, laborPct: 0.55 },
          { id: "concrete_driveway", name: "Concrete Driveway (per sqft)", unit: "sqft", basePrice: 9.50, laborPct: 0.52 },
          { id: "concrete_sidewalk", name: "Sidewalk (per sqft)", unit: "sqft", basePrice: 8.00, laborPct: 0.55 },
          { id: "concrete_patio", name: "Patio/Pad (per sqft)", unit: "sqft", basePrice: 8.50, laborPct: 0.53 },
          { id: "stamped_concrete", name: "Stamped Concrete (per sqft)", unit: "sqft", basePrice: 18, laborPct: 0.55 },
          { id: "concrete_stain", name: "Concrete Stain/Seal (sqft)", unit: "sqft", basePrice: 3.80, laborPct: 0.68 },
          { id: "concrete_break", name: "Concrete Removal (per sqft)", unit: "sqft", basePrice: 5.50, laborPct: 0.72 },
        ]
      },
      {
        name: "Foundation & Structure",
        items: [
          { id: "foundation_pour", name: "Foundation Pour (per cy)", unit: "cy", basePrice: 320, laborPct: 0.52 },
          { id: "footer_install", name: "Footer Installation (per LF)", unit: "lf", basePrice: 65, laborPct: 0.55 },
          { id: "wall_block", name: "Block Wall (per sqft face)", unit: "sqft", basePrice: 22, laborPct: 0.60 },
          { id: "retaining_wall", name: "Retaining Wall (per sqft face)", unit: "sqft", basePrice: 32, laborPct: 0.58 },
          { id: "crack_inject", name: "Foundation Crack Injection", unit: "ea", basePrice: 550, laborPct: 0.70 },
          { id: "waterproofing", name: "Foundation Waterproofing (sqft)", unit: "sqft", basePrice: 18, laborPct: 0.62 },
        ]
      },
      {
        name: "Brick & Stone",
        items: [
          { id: "brick_lay", name: "Brick Laying (per sqft)", unit: "sqft", basePrice: 28, laborPct: 0.62 },
          { id: "tuckpointing", name: "Tuckpointing (per sqft)", unit: "sqft", basePrice: 14, laborPct: 0.80 },
          { id: "stone_veneer", name: "Stone Veneer (per sqft)", unit: "sqft", basePrice: 32, laborPct: 0.55 },
          { id: "chimney_repair", name: "Chimney Repair (per ea)", unit: "ls", basePrice: 1800, laborPct: 0.65 },
          { id: "chimney_rebuild", name: "Chimney Rebuild (per LF)", unit: "lf", basePrice: 380, laborPct: 0.62 },
          { id: "fireplace_install", name: "Fireplace Installation", unit: "ls", basePrice: 4500, laborPct: 0.55 },
        ]
      }
    ]
  },

  landscaping: {
    label: "Landscaping",
    icon: "🌿",
    description: "Grading, irrigation, sod, hardscaping, drainage",
    categories: [
      {
        name: "Lawn & Planting",
        items: [
          { id: "sod_install", name: "Sod Installation (per sqft)", unit: "sqft", basePrice: 1.80, laborPct: 0.55 },
          { id: "seed_hydro", name: "Hydroseeding (per sqft)", unit: "sqft", basePrice: 0.45, laborPct: 0.60 },
          { id: "mulch_install", name: "Mulch Install (per sqyd)", unit: "sqyd", basePrice: 12, laborPct: 0.65 },
          { id: "shrub_plant", name: "Shrub Planting (per ea)", unit: "ea", basePrice: 120, laborPct: 0.55 },
          { id: "tree_plant", name: "Tree Planting (per ea)", unit: "ea", basePrice: 380, laborPct: 0.50 },
          { id: "tree_remove", name: "Tree Removal (per ea)", unit: "ea", basePrice: 950, laborPct: 0.70 },
          { id: "stump_grind", name: "Stump Grinding (per ea)", unit: "ea", basePrice: 280, laborPct: 0.72 },
          { id: "garden_bed", name: "Garden Bed Creation (sqft)", unit: "sqft", basePrice: 8.50, laborPct: 0.62 },
        ]
      },
      {
        name: "Irrigation & Drainage",
        items: [
          { id: "irrigation_zone", name: "Irrigation Zone (per zone)", unit: "ea", basePrice: 680, laborPct: 0.58 },
          { id: "irrigation_full", name: "Full Irrigation System (sqft)", unit: "sqft", basePrice: 0.95, laborPct: 0.60 },
          { id: "french_drain", name: "French Drain (per LF)", unit: "lf", basePrice: 28, laborPct: 0.65 },
          { id: "dry_creek", name: "Dry Creek Bed (per LF)", unit: "lf", basePrice: 38, laborPct: 0.60 },
          { id: "catch_basin", name: "Catch Basin Install", unit: "ea", basePrice: 520, laborPct: 0.62 },
          { id: "downspout_ext", name: "Downspout Extension (per LF)", unit: "lf", basePrice: 18, laborPct: 0.65 },
        ]
      },
      {
        name: "Hardscaping",
        items: [
          { id: "paver_patio", name: "Paver Patio (per sqft)", unit: "sqft", basePrice: 22, laborPct: 0.58 },
          { id: "paver_walk", name: "Paver Walkway (per sqft)", unit: "sqft", basePrice: 20, laborPct: 0.60 },
          { id: "gravel_drive", name: "Gravel Driveway (per sqft)", unit: "sqft", basePrice: 3.50, laborPct: 0.60 },
          { id: "deck_wood", name: "Wood Deck (per sqft)", unit: "sqft", basePrice: 32, laborPct: 0.55 },
          { id: "deck_composite", name: "Composite Deck (per sqft)", unit: "sqft", basePrice: 45, laborPct: 0.52 },
          { id: "fence_wood", name: "Wood Fence (per LF)", unit: "lf", basePrice: 28, laborPct: 0.58 },
          { id: "fence_vinyl", name: "Vinyl Fence (per LF)", unit: "lf", basePrice: 32, laborPct: 0.55 },
          { id: "fence_chain", name: "Chain Link Fence (per LF)", unit: "lf", basePrice: 22, laborPct: 0.55 },
          { id: "pergola", name: "Pergola Installation", unit: "ls", basePrice: 4800, laborPct: 0.52 },
          { id: "retaining_landscape", name: "Landscape Retaining Wall (LF)", unit: "lf", basePrice: 85, laborPct: 0.60 },
        ]
      }
    ]
  },

  insulation: {
    label: "Insulation",
    icon: "🏚️",
    description: "Blown-in, batt, spray foam, radiant barrier",
    categories: [
      {
        name: "Insulation Types",
        items: [
          { id: "batt_fiberglass", name: "Fiberglass Batt (per sqft)", unit: "sqft", basePrice: 1.80, laborPct: 0.60 },
          { id: "batt_mineral", name: "Mineral Wool Batt (sqft)", unit: "sqft", basePrice: 2.50, laborPct: 0.60 },
          { id: "blown_attic", name: "Blown Attic Insulation (sqft)", unit: "sqft", basePrice: 1.50, laborPct: 0.65 },
          { id: "blown_wall", name: "Dense Pack Wall (per sqft)", unit: "sqft", basePrice: 2.20, laborPct: 0.68 },
          { id: "spray_open", name: "Open Cell Spray Foam (sqft)", unit: "sqft", basePrice: 1.80, laborPct: 0.55 },
          { id: "spray_closed", name: "Closed Cell Spray Foam (sqft)", unit: "sqft", basePrice: 3.50, laborPct: 0.52 },
          { id: "rigid_foam", name: "Rigid Foam Board (per sqft)", unit: "sqft", basePrice: 2.80, laborPct: 0.58 },
          { id: "radiant_barrier", name: "Radiant Barrier (per sqft)", unit: "sqft", basePrice: 1.20, laborPct: 0.65 },
          { id: "crawl_encap", name: "Crawl Space Encapsulation (sqft)", unit: "sqft", basePrice: 5.50, laborPct: 0.60 },
        ]
      }
    ]
  },

  windows_doors: {
    label: "Windows & Doors",
    icon: "🪟",
    description: "Replacement windows, entry doors, patio doors, garage doors",
    categories: [
      {
        name: "Windows",
        items: [
          { id: "window_dh", name: "Double Hung Window Replace", unit: "ea", basePrice: 850, laborPct: 0.45 },
          { id: "window_casement", name: "Casement Window Replace", unit: "ea", basePrice: 950, laborPct: 0.45 },
          { id: "window_picture", name: "Picture Window Replace", unit: "ea", basePrice: 1100, laborPct: 0.42 },
          { id: "window_bay", name: "Bay Window Replace", unit: "ea", basePrice: 3200, laborPct: 0.40 },
          { id: "window_egress", name: "Egress Window Install", unit: "ea", basePrice: 2800, laborPct: 0.45 },
          { id: "window_storm", name: "Storm Window Install", unit: "ea", basePrice: 380, laborPct: 0.55 },
        ]
      },
      {
        name: "Doors",
        items: [
          { id: "entry_door", name: "Entry Door Replace (incl. frame)", unit: "ea", basePrice: 1800, laborPct: 0.42 },
          { id: "storm_door", name: "Storm Door Install", unit: "ea", basePrice: 650, laborPct: 0.55 },
          { id: "sliding_patio", name: "Sliding Patio Door", unit: "ea", basePrice: 2200, laborPct: 0.42 },
          { id: "french_door", name: "French Patio Door", unit: "ea", basePrice: 2800, laborPct: 0.40 },
          { id: "garage_door_single", name: "Garage Door (Single)", unit: "ea", basePrice: 1400, laborPct: 0.50 },
          { id: "garage_door_double", name: "Garage Door (Double)", unit: "ea", basePrice: 2200, laborPct: 0.48 },
          { id: "garage_opener", name: "Garage Door Opener", unit: "ea", basePrice: 580, laborPct: 0.55 },
        ]
      }
    ]
  },

  siding: {
    label: "Siding & Exterior",
    icon: "🏘️",
    description: "Vinyl, fiber cement, wood, stucco siding",
    categories: [
      {
        name: "Siding Materials",
        items: [
          { id: "siding_vinyl", name: "Vinyl Siding (per sqft)", unit: "sqft", basePrice: 6.50, laborPct: 0.55 },
          { id: "siding_hardie", name: "Fiber Cement (per sqft)", unit: "sqft", basePrice: 11, laborPct: 0.52 },
          { id: "siding_wood", name: "Wood Clapboard (per sqft)", unit: "sqft", basePrice: 14, laborPct: 0.52 },
          { id: "siding_cedar", name: "Cedar Shake Siding (sqft)", unit: "sqft", basePrice: 16, laborPct: 0.50 },
          { id: "stucco_apply", name: "Stucco Application (sqft)", unit: "sqft", basePrice: 12, laborPct: 0.55 },
          { id: "eifs_apply", name: "EIFS System (per sqft)", unit: "sqft", basePrice: 14, laborPct: 0.52 },
          { id: "siding_remove", name: "Old Siding Removal (sqft)", unit: "sqft", basePrice: 2.80, laborPct: 0.78 },
          { id: "house_wrap", name: "House Wrap (per sqft)", unit: "sqft", basePrice: 1.50, laborPct: 0.62 },
          { id: "soffit_fascia", name: "Soffit & Fascia (per LF)", unit: "lf", basePrice: 18, laborPct: 0.60 },
        ]
      }
    ]
  }
};

// Unit labels for display
const UNIT_LABELS = {
  sqft: "sq ft", lf: "lin ft", ea: "each", ls: "lump sum",
  cy: "cu yd", sq: "square (100 sqft)", room: "room",
  day: "day", load: "load", sqyd: "sq yd"
};

// Overhead & profit defaults
const DEFAULT_OVERHEAD = 15; // %
const DEFAULT_PROFIT = 10;   // %
const DEFAULT_TAX_RATE = 8.5; // % (materials only)

// Expose to global scope for browser use
if (typeof window !== 'undefined') {
  window.TRADES = TRADES;
  window.REGIONAL_MULTIPLIERS = REGIONAL_MULTIPLIERS;
  window.DEFAULT_MULTIPLIER = DEFAULT_MULTIPLIER;
  window.getMultiplier = getMultiplier;
  window.UNIT_LABELS = UNIT_LABELS;
  window.DEFAULT_OVERHEAD = DEFAULT_OVERHEAD;
  window.DEFAULT_PROFIT = DEFAULT_PROFIT;
  window.DEFAULT_TAX_RATE = DEFAULT_TAX_RATE;
}

if (typeof module !== 'undefined') {
  module.exports = { TRADES, REGIONAL_MULTIPLIERS, DEFAULT_MULTIPLIER, getMultiplier, UNIT_LABELS, DEFAULT_OVERHEAD, DEFAULT_PROFIT, DEFAULT_TAX_RATE };
}
