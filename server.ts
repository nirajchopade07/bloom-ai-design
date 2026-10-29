import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Initialize Google GenAI client
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Initial Flora Database
interface BotanicalSpecimen {
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
  author?: string;
  createdAt: string;
}

const floraDatabase: BotanicalSpecimen[] = [
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
    curvature: 0.65,
    author: 'Bloom Core Lab',
    createdAt: new Date().toISOString()
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
    curvature: 0.45,
    author: 'Dr. Elena Rostova',
    createdAt: new Date().toISOString()
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
    curvature: 0.82,
    author: 'Neural Biosystems',
    createdAt: new Date().toISOString()
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
    curvature: 0.78,
    author: 'Marcus Aurelio',
    createdAt: new Date().toISOString()
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
    curvature: 0.72,
    author: 'Kengo Kuma Studio',
    createdAt: new Date().toISOString()
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
    curvature: 0.35,
    author: 'Aether Generative',
    createdAt: new Date().toISOString()
  }
];

// In-memory telemetry
const serverStartTime = Date.now();
let totalSynthesesCount = 1420;

// ==========================================
// API Endpoints (/api/*)
// ==========================================

// 1. System Health & Telemetry
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    version: '2.4.0',
    geminiConfigured: !!ai,
    engine: 'Neural Voxel Diffusion Engine v4',
    totalSpecimens: floraDatabase.length,
    totalSyntheses: totalSynthesesCount,
  });
});

// 2. Flora Collection (with filter, search, sort)
app.get('/api/flora', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let results = [...floraDatabase];

  if (category && category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.seed.toLowerCase().includes(q)
    );
  }

  res.json({ count: results.length, specimens: results });
});

// 3. Get Single Specimen
app.get('/api/flora/:id', (req: Request, res: Response) => {
  const specimen = floraDatabase.find((item) => item.id === req.params.id);
  if (!specimen) {
    return res.status(404).json({ error: 'Specimen not found' });
  }
  res.json(specimen);
});

// 4. Save Custom Specimen
app.post('/api/flora', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const newId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newSpecimen: BotanicalSpecimen = {
    id: newId,
    name: data.name,
    category: data.category || 'ai-gen',
    complexity: data.complexity || Math.floor(Math.random() * 20) + 80,
    polygons: data.polygons || Math.floor(Math.random() * 150000) + 120000,
    growthTimeMs: data.growthTimeMs || Math.floor(Math.random() * 800) + 900,
    description: data.description || 'Procedurally sculpted botanical mesh synthesized via Bloom Studio.',
    seed: data.seed || `BLM-${Math.floor(Math.random() * 9000) + 1000}-Z`,
    refractiveIndex: data.refractiveIndex || 1.52,
    layers: data.layers || 4,
    curvature: data.curvature || 0.65,
    author: data.author || 'Guest Architect',
    createdAt: new Date().toISOString()
  };

  floraDatabase.unshift(newSpecimen);
  totalSynthesesCount++;

  res.status(201).json({ message: 'Specimen archived successfully', specimen: newSpecimen });
});

// 5. AI-Powered Flora Synthesis (Gemini API)
app.post('/api/flora/ai-synthesize', async (req: Request, res: Response) => {
  const { prompt, category, style } = req.body;
  totalSynthesesCount++;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required for botanical synthesis' });
  }

  // If Gemini API is configured, use gemini-3.8-flash for structured generation
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an avant-garde computational botanist at Bloom AI Studio. Synthesize a unique mathematical, glass crystalline botanical specimen based on the user's vision: "${prompt}". Style preference: "${style || 'Crystalline Glass Morphism'}".`,
        config: {
          systemInstruction:
            'Output pure JSON adhering to the specified schema. All descriptions must evoke ethereal translucent glass, liquid light transport, procedural geometry, and high-end botanical architecture.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: 'Creative artistic botanical specimen name' },
              latinName: { type: Type.STRING, description: 'Fictional computational botanical Latin classification' },
              category: {
                type: Type.STRING,
                description: 'One of: artistic, ai-gen, 3d-structure'
              },
              description: {
                type: Type.STRING,
                description: 'Poetic, technical description of its optical and morphological properties'
              },
              complexity: { type: Type.INTEGER, description: 'Algorithmic complexity 70-99' },
              polygons: { type: Type.INTEGER, description: 'Estimated polygon count between 120000 and 380000' },
              growthTimeMs: { type: Type.INTEGER, description: 'Voxel growth simulation time in ms (800-2400)' },
              seed: { type: Type.STRING, description: 'Cryptographic seed formatted like ABC-1234-X' },
              refractiveIndex: { type: Type.NUMBER, description: 'Index of refraction between 1.35 and 1.85' },
              layers: { type: Type.INTEGER, description: 'Radial petal layer count between 3 and 7' },
              curvature: { type: Type.NUMBER, description: 'Petal curvature factor between 0.3 and 0.95' },
              botanicalNotes: { type: Type.STRING, description: 'Observations on cellular lattice tension and light dispersion' }
            },
            required: ['name', 'category', 'description', 'complexity', 'polygons', 'growthTimeMs', 'seed', 'refractiveIndex', 'layers', 'curvature']
          }
        }
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        const newSpecimen: BotanicalSpecimen = {
          id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: parsed.name,
          category: (parsed.category as 'artistic' | 'ai-gen' | '3d-structure') || (category || 'ai-gen'),
          complexity: parsed.complexity || 92,
          polygons: parsed.polygons || 184000,
          growthTimeMs: parsed.growthTimeMs || 1250,
          description: parsed.description,
          seed: parsed.seed || `AI-${Math.floor(Math.random() * 9000) + 1000}-X`,
          refractiveIndex: parsed.refractiveIndex || 1.55,
          layers: parsed.layers || 4,
          curvature: parsed.curvature || 0.65,
          author: 'Gemini 3.8 Flash Neural Engine',
          createdAt: new Date().toISOString()
        };

        floraDatabase.unshift(newSpecimen);
        return res.json({ specimen: newSpecimen, generatedBy: 'gemini-3.8-flash', metadata: parsed });
      }
    } catch (err: unknown) {
      console.warn('Gemini synthesis failed, using procedural synthesis fallback:', err);
    }
  }

  // Graceful Algorithmic Fallback Generator (if key not present or call fails)
  const cleanWord = prompt.split(' ')[0] || 'Flora';
  const fallbackPrefix = cleanWord.substring(0, 3).toUpperCase();
  const fallbackSeed = `${fallbackPrefix}-${Math.floor(Math.random() * 9000) + 1000}-Q`;

  const fallbackSpecimen: BotanicalSpecimen = {
    id: `synth-${Date.now()}`,
    name: `${cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1)} Crystallis`,
    category: (category as 'artistic' | 'ai-gen' | '3d-structure') || 'ai-gen',
    complexity: Math.floor(Math.random() * 15) + 84,
    polygons: Math.floor(Math.random() * 180000) + 140000,
    growthTimeMs: Math.floor(Math.random() * 700) + 950,
    description: `Algorithmic synthesis: "${prompt}". Translucent silicate micro-facets configured with high optical dispersion.`,
    seed: fallbackSeed,
    refractiveIndex: parseFloat((Math.random() * 0.35 + 1.45).toFixed(2)),
    layers: Math.floor(Math.random() * 4) + 3,
    curvature: parseFloat((Math.random() * 0.45 + 0.45).toFixed(2)),
    author: 'Bloom Procedural Synthesis Engine',
    createdAt: new Date().toISOString()
  };

  floraDatabase.unshift(fallbackSpecimen);
  res.json({ specimen: fallbackSpecimen, generatedBy: 'procedural-fallback' });
});

// 6. Live Global Seeds Stream
app.get('/api/seeds/live', (_req: Request, res: Response) => {
  const cities = ['Kyoto, JP', 'Zurich, CH', 'Reykjavik, IS', 'Paris, FR', 'New York, US', 'Stockholm, SE', 'Tokyo, JP'];
  const specimens = ['Liquid Quartz Lotus', 'Crystalline Orchid', 'Bioluminescent Lichen', 'Obsidian Velvet Rose', 'Stellar Dandelion', 'Monolithic Fern'];

  const dynamicStream = cities.slice(0, 5).map((city, idx) => {
    const randomMinutes = Math.floor(Math.random() * 4) + idx * 2 + 1;
    const randomSeconds = Math.floor(Math.random() * 50) + 5;
    return {
      location: city,
      specimen: specimens[idx % specimens.length],
      seed: `${specimens[idx % specimens.length].substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}-${String.fromCharCode(65 + idx)}`,
      time: idx === 0 ? `${randomSeconds}s ago` : `${randomMinutes}m ago`
    };
  });

  res.json({ livePulse: dynamicStream });
});

// 7. Spatial Model Export Packaging (Mock USDZ/OBJ file generator)
app.post('/api/export/spatial', (req: Request, res: Response) => {
  const { specimenId, format = 'usdz' } = req.body;
  const specimen = floraDatabase.find((s) => s.id === specimenId) || floraDatabase[0];

  const exportPayload = {
    format,
    specimen: specimen.name,
    seed: specimen.seed,
    polygons: specimen.polygons,
    refractionIndex: specimen.refractiveIndex,
    material: 'Silicate Glass Physical Material',
    createdWith: 'Bloom AI Generative Botany Platform v2.4.0',
    exportTimestamp: new Date().toISOString(),
    vertexStreams: {
      position: `V_POS_${specimen.seed}_STREAM`,
      normal: `V_NRM_${specimen.seed}_STREAM`,
      uv: `V_UV_${specimen.seed}_STREAM`,
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${specimen.id}.${format}"`);
  res.json(exportPayload);
});

// ==========================================
// Full-Stack Server & Vite Integration
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌸 Bloom AI Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
