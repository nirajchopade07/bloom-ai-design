import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trash2, Globe, Layers, ArrowUpRight } from 'lucide-react';
import { BOTANICAL_COLLECTION, BotanicalSculpt, formatStatValue } from '../utils/botanicalData';
import { audioEngine } from '../utils/audioSynthesizer';
import { apiService, LiveSeedPulse } from '../services/api';

interface GreenhouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStudioWithSpecimen: (specimen: BotanicalSculpt) => void;
}

export const GreenhouseModal: React.FC<GreenhouseModalProps> = ({
  isOpen,
  onClose,
  onOpenStudioWithSpecimen
}) => {
  const [savedSeeds, setSavedSeeds] = useState<string[]>([]);
  const [allSpecimens, setAllSpecimens] = useState<BotanicalSculpt[]>(BOTANICAL_COLLECTION);
  const [liveStream, setLiveStream] = useState<LiveSeedPulse[]>([
    { location: 'Kyoto, JP', specimen: 'Liquid Quartz Lotus', seed: 'LTS-4042-Q', time: '14s ago' },
    { location: 'Zurich, CH', specimen: 'Crystalline Orchid', seed: 'ORC-9921-X', time: '38s ago' },
    { location: 'Reykjavik, IS', specimen: 'Bioluminescent Lichen', seed: 'LCH-3309-L', time: '1m ago' },
    { location: 'Paris, FR', specimen: 'Obsidian Velvet Rose', seed: 'ROS-5512-O', time: '2m ago' }
  ]);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('bloom_saved_greenhouse') || '[]');
        setSavedSeeds(stored);
      } catch {
        setSavedSeeds([]);
      }

      // Fetch live seeds from backend
      apiService.getLiveSeeds().then((seeds) => {
        if (seeds && seeds.length > 0) setLiveStream(seeds);
      });

      // Fetch latest specimens from backend
      apiService.getFloraCollection().then((list) => {
        if (list && list.length > 0) setAllSpecimens(list);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    audioEngine.playClick();
    localStorage.removeItem('bloom_saved_greenhouse');
    setSavedSeeds([]);
  };

  const savedSpecimens = allSpecimens.filter((item) =>
    savedSeeds.includes(item.seed)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="greenhouse-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="liquid-glass-strong rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="greenhouse-title" className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                My Botanical Greenhouse
              </h2>
              <p className="text-xs text-white/60">
                Curated private specimen repository and live global synthesis network
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close greenhouse"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Saved Specimens */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-widest text-white/50 font-medium">
              SAVED SEEDS ({savedSpecimens.length})
            </h3>
            {savedSpecimens.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {savedSpecimens.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-6 text-center flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-white/40" />
              <p className="text-sm text-white/80 font-medium">No botanical seeds saved yet</p>
              <p className="text-xs text-white/50 max-w-sm">
                Open any specimen in the Generative Botanical Studio and click "Save to Greenhouse" to pin it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedSpecimens.map((item) => (
                <div
                  key={item.id}
                  className="liquid-glass rounded-2xl p-4 flex flex-col justify-between gap-3 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white text-sm">{item.name}</span>
                    <span className="font-mono text-[10px] text-white/60 px-2 py-0.5 rounded-full bg-white/10">
                      {item.seed}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-white/40">
                      {formatStatValue(item.polygons)} polygons
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenStudioWithSpecimen(item);
                      }}
                      className="text-xs text-white flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer"
                    >
                      <span>Open 3D</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Global Pulse Synthesis */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 font-medium">
            <Globe className="w-3.5 h-3.5 text-white/60" />
            <span>LIVE GLOBAL FLORA MESH SYNTHESIS (REALTIME SERVER FEED)</span>
          </div>

          <div className="liquid-glass rounded-2xl p-3 flex flex-col gap-2">
            {liveStream.map((stream, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2 text-xs border-b border-white/5 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-white/80 font-medium">{stream.location}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/60">{stream.specimen}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white/40 text-[11px]">{stream.seed}</span>
                  <span className="text-white/30 text-[10px]">{stream.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
