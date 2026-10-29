import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Bookmark,
  BookmarkCheck,
  Wand2,
  Sliders,
  Layers,
  RotateCcw,
  Check,
  Share2,
  Send,
  Cpu
} from 'lucide-react';
import { FloraCanvas3D } from './FloraCanvas3D';
import {
  BOTANICAL_COLLECTION,
  BotanicalSculpt,
  generateSeedCode,
  formatStatValue
} from '../utils/botanicalData';
import { audioEngine } from '../utils/audioSynthesizer';
import { apiService } from '../services/api';

interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSpecimen?: BotanicalSculpt;
}

export const StudioModal: React.FC<StudioModalProps> = ({
  isOpen,
  onClose,
  initialSpecimen = BOTANICAL_COLLECTION[0]
}) => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<BotanicalSculpt>(initialSpecimen);
  const [bloomFactor, setBloomFactor] = useState<number>(0.85);
  const [refractionIndex, setRefractionIndex] = useState<number>(initialSpecimen.refractiveIndex || 1.52);
  const [layers, setLayers] = useState<number>(initialSpecimen.layers || 4);
  const [curvature, setCurvature] = useState<number>(initialSpecimen.curvature || 0.65);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [currentSeed, setCurrentSeed] = useState<string>(initialSpecimen.seed || 'ORC-9921-X');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // AI Prompt Synthesizer state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiModelUsed, setAiModelUsed] = useState<string | null>(null);

  useEffect(() => {
    if (initialSpecimen) {
      setSelectedSpecimen(initialSpecimen);
      setRefractionIndex(initialSpecimen.refractiveIndex);
      setLayers(initialSpecimen.layers);
      setCurvature(initialSpecimen.curvature);
      setCurrentSeed(initialSpecimen.seed);
    }
  }, [initialSpecimen]);

  // Check saved state from localStorage
  useEffect(() => {
    try {
      const savedSeeds = JSON.parse(localStorage.getItem('bloom_saved_greenhouse') || '[]');
      setIsSaved(savedSeeds.includes(currentSeed));
    } catch {
      setIsSaved(false);
    }
  }, [currentSeed]);

  if (!isOpen) return null;

  // AI Synthesis via Backend Route (/api/flora/ai-synthesize)
  const handleAiSynthesize = async (promptToUse?: string) => {
    const textPrompt = promptToUse || aiPrompt;
    if (!textPrompt.trim()) return;

    audioEngine.playChime(528);
    setIsSynthesizing(true);

    const result = await apiService.synthesizeFloraAI(textPrompt, selectedSpecimen.category);

    if (result && result.specimen) {
      const spec = result.specimen;
      setSelectedSpecimen(spec);
      setRefractionIndex(spec.refractiveIndex);
      setLayers(spec.layers);
      setCurvature(spec.curvature);
      setCurrentSeed(spec.seed);
      setAiModelUsed(result.generatedBy || 'gemini-3.8-flash');
      audioEngine.playChime(1056);
    } else {
      // Local fallback variant
      const newSeed = generateSeedCode(selectedSpecimen.name, Math.floor(Math.random() * 90) + 10, layers);
      setCurrentSeed(newSeed);
    }

    setIsSynthesizing(false);
  };

  const handleToggleSave = async () => {
    audioEngine.playClick();
    try {
      const savedSeeds: string[] = JSON.parse(
        localStorage.getItem('bloom_saved_greenhouse') || '[]'
      );
      let updated: string[];
      if (savedSeeds.includes(currentSeed)) {
        updated = savedSeeds.filter((s) => s !== currentSeed);
        setIsSaved(false);
      } else {
        updated = [...savedSeeds, currentSeed];
        setIsSaved(true);
        // Persist to backend database as well
        await apiService.saveSpecimen({
          name: selectedSpecimen.name,
          category: selectedSpecimen.category,
          seed: currentSeed,
          refractiveIndex: refractionIndex,
          layers,
          curvature,
          complexity: selectedSpecimen.complexity,
          polygons: selectedSpecimen.polygons,
          description: selectedSpecimen.description,
        });
      }
      localStorage.setItem('bloom_saved_greenhouse', JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleCopyShare = () => {
    audioEngine.playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportModel = async () => {
    audioEngine.playChime(880);
    const success = await apiService.exportSpatialModel(selectedSpecimen.id, 'usdz');
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const promptSuggestions = [
    'Translucent glass Peony with liquid dew',
    'Obsidian Rose with sharp geometric fractals',
    'Bioluminescent Lotus in zero gravity',
    'Silicate Fern vascularized with light'
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="liquid-glass-strong rounded-3xl p-5 sm:p-8 max-w-5xl w-full max-h-[92vh] overflow-y-auto flex flex-col gap-5 sm:gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="studio-title" className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                  Generative Botanical Studio
                </h2>
                {aiModelUsed && (
                  <span className="text-[10px] text-white/70 px-2 py-0.5 rounded-full bg-white/10 flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    {aiModelUsed}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">
                Powered by Bloom Express Backend & Gemini 3.8 Flash Neural Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShare}
              aria-label="Share seed link"
              className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/80 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Seed Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close studio"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Prompt Synthesizer Bar */}
        <div className="liquid-glass rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex-1 w-full flex items-center gap-2 px-2">
            <Sparkles className="w-4 h-4 text-white/60 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSynthesize()}
              placeholder="Prompt Gemini AI: e.g. Translucent crystalline orchid with dew..."
              className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={() => handleAiSynthesize()}
              disabled={isSynthesizing || !aiPrompt.trim()}
              className="liquid-glass-strong rounded-full px-5 py-2 flex items-center gap-2 text-xs text-white font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize with AI'}</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-white/40 text-[11px] whitespace-nowrap">Suggested:</span>
          {promptSuggestions.map((sug) => (
            <button
              key={sug}
              type="button"
              onClick={() => {
                setAiPrompt(sug);
                handleAiSynthesize(sug);
              }}
              className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/70 whitespace-nowrap hover:scale-105 transition-transform cursor-pointer"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Specimen Switcher Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {BOTANICAL_COLLECTION.map((item) => {
            const isSelected = selectedSpecimen.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedSpecimen(item);
                  setRefractionIndex(item.refractiveIndex);
                  setLayers(item.layers);
                  setCurvature(item.curvature);
                  setCurrentSeed(item.seed);
                  audioEngine.playHover();
                }}
                className={`liquid-glass rounded-full px-4 py-2 text-xs text-white/80 whitespace-nowrap hover:scale-105 transition-transform cursor-pointer ${
                  isSelected ? 'bg-white/15 text-white font-medium' : ''
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Studio Workspace: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: 3D Real-Time Spatial Viewport */}
          <div className="lg:col-span-7 flex flex-col liquid-glass rounded-3xl p-4 h-[380px] sm:h-[440px] relative">
            <FloraCanvas3D
              bloomFactor={bloomFactor}
              onBloomChange={setBloomFactor}
              specimenName={`${selectedSpecimen.name} (${currentSeed})`}
              showControls={true}
              className="flex-1"
            />
          </div>

          {/* Right: Parametric Sculpting Controls & Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 liquid-glass rounded-3xl p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-white/50 font-medium">
                  SEED SPECIFICATION
                </span>
                <span className="font-mono text-xs text-white px-2.5 py-1 rounded-full bg-white/10">
                  {currentSeed}
                </span>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-3.5 pt-1">
                {/* Refraction Index */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Refraction Index (IOR)</span>
                    <span className="text-white font-mono">{refractionIndex.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.30"
                    max="1.95"
                    step="0.01"
                    value={refractionIndex}
                    onChange={(e) => setRefractionIndex(parseFloat(e.target.value))}
                    aria-label="Refraction index"
                    className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                {/* Concentric Petal Layers */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Radial Petal Layers</span>
                    <span className="text-white font-mono">{layers} Tiers</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="7"
                    step="1"
                    value={layers}
                    onChange={(e) => setLayers(parseInt(e.target.value, 10))}
                    aria-label="Radial petal layers"
                    className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>

                {/* Petal Curvature */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Bioluminescent Curvature</span>
                    <span className="text-white font-mono">{Math.round(curvature * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={curvature}
                    onChange={(e) => setCurvature(parseFloat(e.target.value))}
                    aria-label="Bioluminescent curvature"
                    className="w-full accent-white h-1.5 bg-white/10 rounded-lg cursor-pointer appearance-none"
                  />
                </div>
              </div>

              {/* Quick Specimen Telemetry */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="liquid-glass rounded-xl p-2.5 flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase">Mesh Density</span>
                  <span className="text-white font-medium">{formatStatValue(selectedSpecimen.polygons)} Poly</span>
                </div>
                <div className="liquid-glass rounded-xl p-2.5 flex flex-col">
                  <span className="text-white/40 text-[10px] uppercase">Vascular Rate</span>
                  <span className="text-white font-medium">{selectedSpecimen.growthTimeMs} ms</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2.5 pt-4">
              <button
                type="button"
                onClick={() => handleAiSynthesize(selectedSpecimen.name + ' glass sculpture')}
                disabled={isSynthesizing}
                className="liquid-glass-strong rounded-full py-3 flex items-center justify-center gap-2.5 text-white font-medium text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 text-white ${isSynthesizing ? 'animate-spin' : ''}`} />
                <span>{isSynthesizing ? 'Synthesizing Neural Voxel...' : 'Generate New Genetic Variant'}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className="flex-1 liquid-glass rounded-full py-2.5 flex items-center justify-center gap-2 text-xs text-white font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 text-white" />
                      <span>In My Greenhouse</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-white/70" />
                      <span>Save to Greenhouse</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExportModel}
                  className="flex-1 liquid-glass rounded-full py-2.5 flex items-center justify-center gap-2 text-xs text-white font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Package Exported</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-white/70" />
                      <span>Export USDZ / CAD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
