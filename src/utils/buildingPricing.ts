import { BuildingPlot } from '../types';

export type BuildingStyle =
  | 'cottage'
  | 'bakery'
  | 'bank'
  | 'gas_station'
  | 'police'
  | 'bookstore'
  | 'ramen_kiosk'
  | 'fastfood'
  | 'modern_loft'
  | 'modern'
  | 'villa'
  | 'solar'
  | 'townhall'
  | 'cyber';

export interface StageDetail {
  stage: 1 | 2 | 3;
  name: string;
  shortName: string;
  cost: number;
  description: string;
  icon: string;
  expReward?: number;
}

export interface BuildingTierConfig {
  id: BuildingStyle;
  name: string;
  icon: string;
  tag: string;
  tier: number;
  description: string;
  accent: string;
  stages: [StageDetail, StageDetail, StageDetail];
  totalCost: number;
  completionExp: number;
  dailyExp: number;
  xpValue: number;
}

export const BUILDING_TIER_CONFIGS: Record<BuildingStyle, BuildingTierConfig> = {
  cottage: {
    id: 'cottage',
    name: 'Twilight Cottage',
    icon: '🏡',
    tag: 'Tier 1 Starter Haven',
    tier: 1,
    description: 'Cozy stone foundation, slate gable roof, glowing lantern & warm hearth.',
    accent: 'border-amber-400 bg-amber-500/10 text-amber-300',
    totalCost: 225,
    completionExp: 50,
    dailyExp: 10,
    xpValue: 80,
    stages: [
      {
        stage: 1,
        name: 'Stone Basework & Groundwork',
        shortName: 'Basework',
        cost: 50,
        description: 'Pound concrete footing & stone foundation trenching.',
        icon: '🧱',
      },
      {
        stage: 2,
        name: 'Timber Framing & Scaffolding',
        shortName: 'Wood Framing',
        cost: 75,
        description: 'Erect cedar wood framing, joists & wall scaffolding.',
        icon: '🪵',
      },
      {
        stage: 3,
        name: 'Slate Roof & Hearth Finishing',
        shortName: 'Roof & Finishes',
        cost: 100,
        description: 'Install dark slate shingles, warm glowing windows & garden fence.',
        icon: '✨',
        expReward: 50,
      },
    ],
  },
  bakery: {
    id: 'bakery',
    name: 'Artisan Bakery',
    icon: '🥖',
    tag: 'Tier 2 Commercial',
    tier: 2,
    description: 'Pastry display windows, terracotta chimney, striped canopy & cafe seating.',
    accent: 'border-orange-400 bg-orange-500/10 text-orange-300',
    totalCost: 450,
    completionExp: 100,
    dailyExp: 25,
    xpValue: 180,
    stages: [
      {
        stage: 1,
        name: 'Reinforced Commercial Basework',
        shortName: 'Basework',
        cost: 100,
        description: 'Heavy duty concrete slab & plumbing for kitchen ovens.',
        icon: '🧱',
      },
      {
        stage: 2,
        name: 'Brick Oven Structure & Front Frame',
        shortName: 'Oven Framing',
        cost: 150,
        description: 'Build brick fire-chamber, kitchen walls & window archways.',
        icon: '🏗️',
      },
      {
        stage: 3,
        name: 'Striped Awning & Pastry Signage',
        shortName: 'Awning & Decor',
        cost: 200,
        description: 'Add striped cafe awning, baking ventilation & display case.',
        icon: '🥐',
        expReward: 100,
      },
    ],
  },
  ramen_kiosk: {
    id: 'ramen_kiosk',
    name: 'Cyber Ramen & Vending Stall',
    icon: '🍜',
    tag: 'Tier 2 Night Bazaar',
    tier: 2,
    description: 'Neon billboards, outdoor drink vending machine & warm street food counter.',
    accent: 'border-red-400 bg-red-500/10 text-red-300',
    totalCost: 550,
    completionExp: 130,
    dailyExp: 30,
    xpValue: 220,
    stages: [
      {
        stage: 1,
        name: 'Pavement Grid & Cable Conduit',
        shortName: 'Pavement Basework',
        cost: 120,
        description: 'Lay street tiles, electrical wiring & drainage pipe.',
        icon: '🔌',
      },
      {
        stage: 2,
        name: 'Wood Kiosk Frame & Window Counter',
        shortName: 'Kiosk Framing',
        cost: 180,
        description: 'Erect cedar wood booth, serving counter & kitchen stall.',
        icon: '🪵',
      },
      {
        stage: 3,
        name: 'Neon Kanji Signs & Vending Machine',
        shortName: 'Neon & Vending',
        cost: 250,
        description: 'Mount glowing Japanese neon signs, soda vending machine & ramen bar.',
        icon: '🏮',
        expReward: 130,
      },
    ],
  },
  fastfood: {
    id: 'fastfood',
    name: 'Golden Burger Bistro',
    icon: '🍔',
    tag: 'Tier 2 Drive-Thru & Patio',
    tier: 2,
    description: 'Glowing golden arches, outdoor umbrella dining patio & wood slat architecture.',
    accent: 'border-yellow-400 bg-yellow-500/10 text-yellow-300',
    totalCost: 650,
    completionExp: 160,
    dailyExp: 40,
    xpValue: 260,
    stages: [
      {
        stage: 1,
        name: 'Commercial Foundation & Driveway',
        shortName: 'Driveway Base',
        cost: 150,
        description: 'Pave restaurant foundation, drive-thru lane & plumbing.',
        icon: '🚗',
      },
      {
        stage: 2,
        name: 'Steel Dining Shell & Service Window',
        shortName: 'Dining Shell',
        cost: 220,
        description: 'Erect steel framing, kitchen pass-through & order windows.',
        icon: '🏗️',
      },
      {
        stage: 3,
        name: 'Golden Arch Sign & Patio Seating',
        shortName: 'Golden Arch & Patio',
        cost: 280,
        description: 'Mount illuminated golden arches, outdoor picnic tables & parasols.',
        icon: '🍟',
        expReward: 160,
      },
    ],
  },
  gas_station: {
    id: 'gas_station',
    name: 'Solar EV & Fuel Plaza',
    icon: '⛽',
    tag: 'Tier 3 Energy Plaza',
    tier: 3,
    description: 'Bold yellow canopy, twin digital charging pumps & illuminated convenience mart.',
    accent: 'border-amber-500 bg-amber-500/10 text-amber-200',
    totalCost: 800,
    completionExp: 200,
    dailyExp: 50,
    xpValue: 320,
    stages: [
      {
        stage: 1,
        name: 'Fuel Tanks & High-Voltage Trenching',
        shortName: 'Vault Basework',
        cost: 180,
        description: 'Excavate double-walled tanks, electrical grounding & pump islands.',
        icon: '⚡',
      },
      {
        stage: 2,
        name: 'Overhead Steel Canopy & Pillars',
        shortName: 'Canopy Frame',
        cost: 270,
        description: 'Erect high-clearance steel canopy pillars & retail store shell.',
        icon: '🏗️',
      },
      {
        stage: 3,
        name: 'Digital Pumps & Mart Glazing',
        shortName: 'Pumps & Mart',
        cost: 350,
        description: 'Install smart fuel/EV dispensers, LED canopy fascia & 24/7 store.',
        icon: '🏪',
        expReward: 200,
      },
    ],
  },
  bookstore: {
    id: 'bookstore',
    name: 'Corner Books & Cafe',
    icon: '📚',
    tag: 'Tier 3 Cultural Hub',
    tier: 3,
    description: 'Rooftop water cisterns, glowing amber bookshelves, outdoor staircase & garden fence.',
    accent: 'border-yellow-600 bg-yellow-600/10 text-yellow-200',
    totalCost: 950,
    completionExp: 250,
    dailyExp: 60,
    xpValue: 400,
    stages: [
      {
        stage: 1,
        name: 'Poured Concrete Slab & Garden Bed',
        shortName: 'Basework',
        cost: 220,
        description: 'Level concrete pad, exterior stair footings & garden perimeter.',
        icon: '🧱',
      },
      {
        stage: 2,
        name: 'Two-Story Charcoal Frame & Stairs',
        shortName: 'Store Frame',
        cost: 330,
        description: 'Build charcoal facade structure, roof deck & iron staircase.',
        icon: '📐',
      },
      {
        stage: 3,
        name: 'Illuminated Books Sign & Water Tanks',
        shortName: 'Books Sign & Roof Deck',
        cost: 400,
        description: 'Install glowing amber neon sign, rooftop cisterns & warm window shelves.',
        icon: '📖',
        expReward: 250,
      },
    ],
  },
  police: {
    id: 'police',
    name: 'Metro Police & Civic HQ',
    icon: '🚓',
    tag: 'Tier 3 Public Safety',
    tier: 3,
    description: 'Tiered blue and white civic architecture, communication tower & large security glass.',
    accent: 'border-blue-500 bg-blue-500/10 text-blue-300',
    totalCost: 1100,
    completionExp: 300,
    dailyExp: 75,
    xpValue: 480,
    stages: [
      {
        stage: 1,
        name: 'Reinforced Security Sub-level',
        shortName: 'Basework',
        cost: 250,
        description: 'Pour bomb-resistant foundation, holding cells & vehicle bays.',
        icon: '🛡️',
      },
      {
        stage: 2,
        name: 'Blue Civic Framing & Tower Spire',
        shortName: 'Civic Frame',
        cost: 380,
        description: 'Erect central dispatch tower, multi-tiered roof decks & columns.',
        icon: '🏢',
      },
      {
        stage: 3,
        name: 'Siren Beacons & Grid Glazing',
        shortName: 'Tower Spire & Glazing',
        cost: 470,
        description: 'Mount communication mast, blue security beacon & bold POLICE marquee.',
        icon: '🚨',
        expReward: 300,
      },
    ],
  },
  modern_loft: {
    id: 'modern_loft',
    name: 'Nordic Skylight Studio',
    icon: '📐',
    tag: 'Tier 4 Designer Loft',
    tier: 4,
    description: 'Sloped architectural roof with skylights, 2-story glass mezzanine & side garage.',
    accent: 'border-emerald-400 bg-emerald-500/10 text-emerald-200',
    totalCost: 1400,
    completionExp: 400,
    dailyExp: 90,
    xpValue: 620,
    stages: [
      {
        stage: 1,
        name: 'Monolithic Slab & Garage Trenching',
        shortName: 'Basework',
        cost: 320,
        description: 'Poured level pad, garage ramp & reinforced retaining wall.',
        icon: '🧱',
      },
      {
        stage: 2,
        name: 'Asymmetric Pitched Timber Truss',
        shortName: 'Loft Framing',
        cost: 480,
        description: 'Frame geometric angled roof, mezzanine floor & garage bay.',
        icon: '📐',
      },
      {
        stage: 3,
        name: 'Dual Skylights & Glass Mezzanine',
        shortName: 'Skylights & Garage',
        cost: 600,
        description: 'Install roof skylights, open-concept glass wall & roll-up garage door.',
        icon: '✨',
        expReward: 400,
      },
    ],
  },
  solar: {
    id: 'solar',
    name: 'Solar Eco Haven',
    icon: '🌿',
    tag: 'Tier 4 Clean Tech',
    tier: 4,
    description: 'Photovoltaic glass shingles, mini wind turbine & vertical herb garden.',
    accent: 'border-teal-400 bg-teal-500/10 text-teal-300',
    totalCost: 1600,
    completionExp: 450,
    dailyExp: 100,
    xpValue: 700,
    stages: [
      {
        stage: 1,
        name: 'Geothermal Sub-grid Basework',
        shortName: 'Basework',
        cost: 350,
        description: 'Lay geothermal conductive base & power grid grounding.',
        icon: '⚡',
      },
      {
        stage: 2,
        name: 'Eco-Frame & Turbine Mast',
        shortName: 'Turbine Frame',
        cost: 550,
        description: 'Mount wind generator mast & sustainable timber framing.',
        icon: '🌱',
      },
      {
        stage: 3,
        name: 'Photovoltaic Cells & Living Wall',
        shortName: 'Solar Roof & Bio-Wall',
        cost: 700,
        description: 'Install solar glass shingles, battery bank & vertical gardens.',
        icon: '🔋',
        expReward: 450,
      },
    ],
  },
  bank: {
    id: 'bank',
    name: 'Grand Reserve Bank',
    icon: '🏛️',
    tag: 'Tier 5 Financial Citadel',
    tier: 5,
    description: 'Neoclassical Roman columns, golden 3D sign, marble staircase & gold vault.',
    accent: 'border-yellow-400 bg-yellow-500/10 text-yellow-300',
    totalCost: 2200,
    completionExp: 650,
    dailyExp: 140,
    xpValue: 950,
    stages: [
      {
        stage: 1,
        name: 'Underground Vault & Foundation',
        shortName: 'Vault Basework',
        cost: 500,
        description: 'Pour steel-reinforced vault subterranean floor & column pads.',
        icon: '💰',
      },
      {
        stage: 2,
        name: 'Marble Colonnade & Pediment Frame',
        shortName: 'Colonnade Frame',
        cost: 750,
        description: 'Erect classic Fluted Roman columns, triangular pediment & blue glass.',
        icon: '🏛️',
      },
      {
        stage: 3,
        name: 'Golden BANK Sign & Lantern Steps',
        shortName: 'Golden Sign & Steps',
        cost: 950,
        description: 'Mount 3D golden BANK typography, grand marble steps & brass lanterns.',
        icon: '👑',
        expReward: 650,
      },
    ],
  },
  villa: {
    id: 'villa',
    name: 'Luxury Infinity Pool Villa',
    icon: '🏊',
    tag: 'Tier 5 Luxury Oasis',
    tier: 5,
    description: 'Floating cantilever deck, turquoise infinity pool, sun loungers & rooftop umbrella lawn.',
    accent: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
    totalCost: 2800,
    completionExp: 800,
    dailyExp: 180,
    xpValue: 1200,
    stages: [
      {
        stage: 1,
        name: 'Pool Basin Excavation & Cantilever Pilings',
        shortName: 'Pool Basework',
        cost: 650,
        description: 'Excavate swimming pool shell, filtration pumps & cantilever foundation.',
        icon: '🌊',
      },
      {
        stage: 2,
        name: 'Cantilever Upper Floor & Rooftop Deck',
        shortName: 'Villa Superstructure',
        cost: 950,
        description: 'Construct floating second-story box, glass railings & staircase.',
        icon: '🏢',
      },
      {
        stage: 3,
        name: 'Infinity Water, Pool LED & Sun Deck',
        shortName: 'Pool Water & Rooftop Lawn',
        cost: 1200,
        description: 'Fill crystal pool water, install deck step lights, umbrella & sun loungers.',
        icon: '💎',
        expReward: 800,
      },
    ],
  },
  townhall: {
    id: 'townhall',
    name: 'Classic Brick Manor',
    icon: '🏰',
    tag: 'Tier 5 Civic Landmark',
    tier: 5,
    description: 'Terracotta tiled roof, brick chimney smoke & heritage stone archways.',
    accent: 'border-rose-400 bg-rose-500/10 text-rose-300',
    totalCost: 3200,
    completionExp: 900,
    dailyExp: 200,
    xpValue: 1350,
    stages: [
      {
        stage: 1,
        name: 'Heritage Stone Vault Basework',
        shortName: 'Basework',
        cost: 700,
        description: 'Chisel dressed limestone footings & municipal vault subfloor.',
        icon: '🏛️',
      },
      {
        stage: 2,
        name: 'Grand Colonnade & Brick Walls',
        shortName: 'Colonnade Frame',
        cost: 1100,
        description: 'Erect classic stone columns, arched corridors & brickwork.',
        icon: '🧱',
      },
      {
        stage: 3,
        name: 'Terracotta Clocktower & Entry Gates',
        shortName: 'Clocktower & Roof',
        cost: 1400,
        description: 'Install brass clockwork, terracotta tiles & grand oak doors.',
        icon: '👑',
        expReward: 900,
      },
    ],
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk Neon Hub',
    icon: '⚡',
    tag: 'Tier 6 Skyline Pinnacle',
    tier: 6,
    description: 'Obsidian frame with pulsating neon trim, server cores & floating hologram.',
    accent: 'border-purple-400 bg-purple-500/10 text-purple-300',
    totalCost: 4500,
    completionExp: 1200,
    dailyExp: 260,
    xpValue: 1800,
    stages: [
      {
        stage: 1,
        name: 'Obsidian Sub-Matrix Basework',
        shortName: 'Basework',
        cost: 1000,
        description: 'Synthesize carbon nano-tube subterranean quantum anchor.',
        icon: '🔮',
      },
      {
        stage: 2,
        name: 'Carbon Lattice & Fiber Core',
        shortName: 'Lattice Frame',
        cost: 1500,
        description: 'Weave lightweight carbon lattice & superconductive conduits.',
        icon: '⚡',
      },
      {
        stage: 3,
        name: 'Holographic Projector & Neon Finishes',
        shortName: 'Hologram & Neon',
        cost: 2000,
        description: 'Deploy 3D volumetric cloud hologram & hyper-luminescent piping.',
        icon: '🌌',
        expReward: 1200,
      },
    ],
  },
  modern: {
    id: 'modern',
    name: 'Nordic Mezzanine Villa',
    icon: '🏢',
    tag: 'Tier 4 Modernist Studio',
    tier: 4,
    description: 'Crisp white architecture, pitched roof skylights, garage workshop & corner studio glass.',
    accent: 'border-cyan-400 bg-cyan-500/10 text-cyan-200',
    totalCost: 1500,
    completionExp: 400,
    dailyExp: 90,
    xpValue: 600,
    stages: [
      {
        stage: 1,
        name: 'Polished Concrete Slab & Garage Pit',
        shortName: 'Basework',
        cost: 350,
        description: 'Pour reinforced concrete foundation and insulated subterranean slab.',
        icon: '🧱',
      },
      {
        stage: 2,
        name: 'Steel Truss & Pitch Roof Framework',
        shortName: 'Truss Frame',
        cost: 500,
        description: 'Assemble asymmetric pitched steel rafters and mezzanine floor joists.',
        icon: '📐',
      },
      {
        stage: 3,
        name: 'Skylights & Roll-Up Workshop Bay',
        shortName: 'Skylights & Studio',
        cost: 650,
        description: 'Mount tempered ceiling skylights, insulated roll-up door & facade siding.',
        icon: '🏢',
        expReward: 400,
      },
    ],
  },
};

/**
 * Maps a building plot or style to its corresponding tier configuration.
 */
export function getBuildingConfig(
  styleOrPlot?: string | BuildingPlot | null
): BuildingTierConfig {
  if (!styleOrPlot) {
    return BUILDING_TIER_CONFIGS.cottage;
  }

  if (typeof styleOrPlot === 'string') {
    const key = styleOrPlot.toLowerCase() as BuildingStyle;
    if (BUILDING_TIER_CONFIGS[key]) {
      return BUILDING_TIER_CONFIGS[key];
    }
  } else {
    // If it's a BuildingPlot
    const styleKey = styleOrPlot.buildingStyle as BuildingStyle;
    if (styleKey && BUILDING_TIER_CONFIGS[styleKey]) {
      return BUILDING_TIER_CONFIGS[styleKey];
    }

    // Fallback based on plot id or type
    if (styleOrPlot.type && BUILDING_TIER_CONFIGS[styleOrPlot.type as BuildingStyle]) {
      return BUILDING_TIER_CONFIGS[styleOrPlot.type as BuildingStyle];
    }
    if (styleOrPlot.id === 'plot-1') return BUILDING_TIER_CONFIGS.cottage;
    if (styleOrPlot.id === 'plot-2') return BUILDING_TIER_CONFIGS.bakery;
    if (styleOrPlot.id === 'plot-3') return BUILDING_TIER_CONFIGS.ramen_kiosk;
    if (styleOrPlot.id === 'plot-4') return BUILDING_TIER_CONFIGS.fastfood;
    if (styleOrPlot.id === 'plot-5') return BUILDING_TIER_CONFIGS.gas_station;
    if (styleOrPlot.id === 'plot-6') return BUILDING_TIER_CONFIGS.bookstore;
    if (styleOrPlot.id === 'plot-7') return BUILDING_TIER_CONFIGS.police;
    if (styleOrPlot.id === 'plot-8') return BUILDING_TIER_CONFIGS.modern_loft;
    if (styleOrPlot.id === 'plot-9') return BUILDING_TIER_CONFIGS.solar;
    if (styleOrPlot.id === 'plot-10') return BUILDING_TIER_CONFIGS.bank;
    if (styleOrPlot.id === 'plot-11') return BUILDING_TIER_CONFIGS.villa;
    if (styleOrPlot.id === 'plot-12') return BUILDING_TIER_CONFIGS.cyber;
  }

  return BUILDING_TIER_CONFIGS.cottage;
}

/**
 * Calculates the exact cost to construct the next stage.
 */
export function getNextStageCost(
  plot: BuildingPlot,
  selectedStyle?: string
): number {
  const config = getBuildingConfig(selectedStyle || plot.buildingStyle || plot);
  const currentStage = plot.stage || 0;

  if (currentStage === 0) {
    return config.stages[0].cost;
  } else if (currentStage === 1) {
    return config.stages[1].cost;
  } else if (currentStage === 2) {
    return config.stages[2].cost;
  }

  return 0; // Already completed
}

/**
 * Returns full details for the next stage of construction.
 */
export function getNextStageDetails(
  plot: BuildingPlot,
  selectedStyle?: string
): StageDetail {
  const config = getBuildingConfig(selectedStyle || plot.buildingStyle || plot);
  const currentStage = plot.stage || 0;
  const targetIndex = Math.min(currentStage, 2);
  return config.stages[targetIndex];
}

/**
 * Returns completion EXP reward for a given style/plot
 */
export function getCompletionRewardExp(
  plot: BuildingPlot,
  selectedStyle?: string
): number {
  const config = getBuildingConfig(selectedStyle || plot.buildingStyle || plot);
  return config.completionExp;
}
