import React, { useState } from 'react';
import { X, Wand2, Download, Check, Sparkles, Layers, Box } from 'lucide-react';
import { BOTANICAL_COLLECTION, BotanicalSculpt, filterFloraByCategory, formatStatValue } from '../utils/botanicalData';
import heroFlowersImg from '@/assets/hero-flowers.png';
import { audioEngine } from '../utils/audioSynthesizer';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  onOpenStudioWithSpecimen?: (specimen: BotanicalSculpt) => void;
}

export const ExploreModal: React.FC<ExploreModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'all',
  onOpenStudioWithSpecimen
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeItem, setActiveItem] = useState<BotanicalSculpt>(BOTANICAL_COLLECTION[0]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredItems = filterFloraByCategory(BOTANICAL_COLLECTION, selectedCategory);

  const handleExport = () => {
    audioEngine.playChime(660);
    setIsExporting(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      audioEngine.playChime(1320);
      setTimeout(() => setExportComplete(false), 2500);
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="explore-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="liquid-glass-strong rounded-3xl p-5 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 id="explore-title" className="text-xl sm:text-2xl font-medium text-white tracking-tight">
                Generative Flora Vault
              </h2>
              <p className="text-xs text-white/60">
                Explore algorithmic botanical structures synthesized by Bloom AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'artistic', 'ai-gen', '3d-structure'].map((cat) => {
            const label =
              cat === 'all'
                ? 'All Specimens'
                : cat === 'artistic'
                ? 'Artistic Gallery'
                : cat === 'ai-gen'
                ? 'AI Generation'
                : '3D Structures';
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  audioEngine.playHover();
                  setSelectedCategory(cat);
                }}
                className={`liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
                  isActive ? 'bg-white/15 text-white font-medium' : ''
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Grid of specimens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  audioEngine.playHover();
                  setActiveItem(item);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveItem(item);
                  }
                }}
                className={`liquid-glass rounded-2xl p-4 flex flex-col gap-2.5 hover:scale-[1.02] transition-transform cursor-pointer text-left ${
                  isSelected ? 'bg-white/[0.08]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-white">{item.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-white/50 px-2 py-0.5 rounded-full bg-white/5 font-mono">
                    {item.seed}
                  </span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                <div className="flex items-center justify-between pt-2 text-xs text-white/50">
                  <span>Complexity: {item.complexity}%</span>
                  <span>{formatStatValue(item.polygons)} polygons</span>
                  <span>{item.growthTimeMs}ms synthesis</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Specimen Highlight */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
          <img
            src={heroFlowersImg}
            alt={activeItem.name}
            className="w-28 h-20 object-cover rounded-xl shadow-xl shrink-0"
            width={112}
            height={80}
          />
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-lg font-medium text-white tracking-tight">{activeItem.name}</h4>
              <span className="text-[10px] font-mono text-white/50 bg-white/10 px-2 py-0.5 rounded-full">
                {activeItem.seed}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              Synthesized using recursive diffusion lattice. Complete parametric USDZ and OBJ exports ready for spatial pipelines.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-2.5 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-white/60" />
                Voxel Lattice v4
              </span>
              <span className="flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-white/60" />
                Procedural
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenStudioWithSpecimen && (
              <button
                type="button"
                onClick={() => {
                  audioEngine.playChime(1056);
                  onClose();
                  onOpenStudioWithSpecimen(activeItem);
                }}
                className="liquid-glass rounded-full px-5 py-3 flex items-center gap-2 text-white text-xs font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-white" />
                <span>Open in 3D</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="liquid-glass-strong rounded-full px-5 py-3 flex items-center gap-2 text-white text-xs font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {exportComplete ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Model Exported</span>
                </>
              ) : isExporting ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Export USDZ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
