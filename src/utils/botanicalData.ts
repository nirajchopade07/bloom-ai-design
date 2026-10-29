/**
 * Pure data and algorithmic helpers for Bloom AI floral design platform.
 */

export interface BotanicalSculpt {
  id: string;
  name: string;
  category: 'artistic' | 'ai-gen' | '3d-structure';
  complexity: number;
  polygons: number;
  growthTimeMs: number;
  description: string;
  seed: string;
  refractiveIndex: number;
  layers: number;
  curvature: number;
}

export const BOTANICAL_COLLECTION: BotanicalSculpt[] = [
  {
    id: 'orchid-crystallis',
    name: 'Crystalline Orchid',
    category: 'artistic',
    complexity: 94,
    polygons: 148200,
    growthTimeMs: 1200,
    description: 'Bioluminescent procedural crystalline petals with refractive light transport.',
    seed: 'ORC-9921-X',
    refractiveIndex: 1.52,
    layers: 4,
    curvature: 0.65
  },
  {
    id: 'fern-fractal',
    name: 'Monolithic Fractal Fern',
    category: '3d-structure',
    complexity: 88,
    polygons: 212400,
    growthTimeMs: 1800,
    description: 'Deep mathematical recursion mimicking ancient Jurassic frond vascular architectures.',
    seed: 'FRN-7814-F',
    refractiveIndex: 1.48,
    layers: 6,
    curvature: 0.45
  },
  {
    id: 'lichen-lumina',
    name: 'Bioluminescent Lichen',
    category: 'ai-gen',
    complexity: 92,
    polygons: 320000,
    growthTimeMs: 950,
    description: 'Neural cellular automata simulating colony growth on basaltic rock.',
    seed: 'LCH-3309-L',
    refractiveIndex: 1.62,
    layers: 3,
    curvature: 0.82
  },
  {
    id: 'rose-obsidian',
    name: 'Obsidian Velvet Rose',
    category: 'artistic',
    complexity: 96,
    polygons: 189000,
    growthTimeMs: 1450,
    description: 'Curved light-absorbing velvet micro-facets with glass sheen highlights.',
    seed: 'ROS-5512-O',
    refractiveIndex: 1.71,
    layers: 5,
    curvature: 0.78
  },
  {
    id: 'lotus-liquid',
    name: 'Liquid Quartz Lotus',
    category: '3d-structure',
    complexity: 95,
    polygons: 265000,
    growthTimeMs: 1350,
    description: 'Concentric floating silica petals configured around an optical torus stamen.',
    seed: 'LTS-4042-Q',
    refractiveIndex: 1.54,
    layers: 5,
    curvature: 0.72
  },
  {
    id: 'dandelion-stellar',
    name: 'Stellar Dandelion Plume',
    category: 'ai-gen',
    complexity: 91,
    polygons: 310500,
    growthTimeMs: 1100,
    description: 'Fine-filament micro-acicular filaments suspended in crystalline tension.',
    seed: 'DND-8830-S',
    refractiveIndex: 1.45,
    layers: 7,
    curvature: 0.35
  }
];

export function filterFloraByCategory(
  items: BotanicalSculpt[],
  category: string
): BotanicalSculpt[] {
  if (!category || category === 'all') return items;
  return items.filter(item => item.category === category);
}

export function calculateEstimatedPolygonCount(basePolygons: number, scaleFactor: number): number {
  if (scaleFactor <= 0) return 0;
  return Math.round(basePolygons * scaleFactor);
}

export function formatStatValue(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

/**
 * Calculates petal rotation and bloom angle based on 0-1 growth percentage.
 */
export function calculatePetalAngle(layerIndex: number, petalIndex: number, totalPetals: number, bloomFactor: number): {
  rotationZ: number;
  rotationX: number;
  scale: number;
} {
  const baseAngle = (petalIndex / totalPetals) * Math.PI * 2;
  const layerOffset = (layerIndex * Math.PI) / totalPetals;
  const rotationZ = baseAngle + layerOffset;

  // Petal opens outward as bloom increases
  const maxOpen = 0.4 + layerIndex * 0.18;
  const rotationX = (1 - bloomFactor) * 0.1 + bloomFactor * maxOpen;
  const scale = 0.4 + bloomFactor * 0.6;

  return { rotationZ, rotationX, scale };
}

/**
 * Procedurally generates a unique botanical seed string based on prompt & parameters.
 */
export function generateSeedCode(name: string, complexity: number, layers: number): string {
  const prefix = (name.slice(0, 3) || 'BLM').toUpperCase();
  const hash = Math.abs((complexity * 997 + layers * 31) % 9000 + 1000);
  return `${prefix}-${hash}-${String.fromCharCode(65 + (complexity % 26))}`;
}
