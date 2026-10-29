import { BotanicalSculpt, BOTANICAL_COLLECTION } from '../utils/botanicalData';

export interface HealthStatus {
  status: string;
  uptimeSeconds: number;
  version: string;
  geminiConfigured: boolean;
  engine: string;
  totalSpecimens: number;
  totalSyntheses: number;
}

export interface LiveSeedPulse {
  location: string;
  specimen: string;
  seed: string;
  time: string;
}

export const apiService = {
  // System Health
  async getHealth(): Promise<HealthStatus | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Get Flora Collection
  async getFloraCollection(category?: string, search?: string): Promise<BotanicalSculpt[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/flora?${params.toString()}`);
      if (!res.ok) return BOTANICAL_COLLECTION;
      const data = await res.json();
      return data.specimens || BOTANICAL_COLLECTION;
    } catch {
      return BOTANICAL_COLLECTION;
    }
  },

  // Get Single Specimen
  async getSpecimen(id: string): Promise<BotanicalSculpt | null> {
    try {
      const res = await fetch(`/api/flora/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // AI-Powered Synthesis via Gemini API
  async synthesizeFloraAI(
    prompt: string,
    category?: string,
    style?: string
  ): Promise<{ specimen: BotanicalSculpt; generatedBy: string } | null> {
    try {
      const res = await fetch('/api/flora/ai-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, style }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Fetch Live Global Seeds
  async getLiveSeeds(): Promise<LiveSeedPulse[]> {
    try {
      const res = await fetch('/api/seeds/live');
      if (!res.ok) return [];
      const data = await res.json();
      return data.livePulse || [];
    } catch {
      return [];
    }
  },

  // Save Specimen to Backend
  async saveSpecimen(specimen: Partial<BotanicalSculpt>): Promise<BotanicalSculpt | null> {
    try {
      const res = await fetch('/api/flora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specimen),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.specimen;
    } catch {
      return null;
    }
  },

  // Export Spatial Model File
  async exportSpatialModel(specimenId: string, format = 'usdz'): Promise<boolean> {
    try {
      const res = await fetch('/api/export/spatial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specimenId, format }),
      });
      if (!res.ok) return false;
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${specimenId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch {
      return false;
    }
  }
};
