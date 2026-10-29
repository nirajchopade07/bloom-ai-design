import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';

interface HeroCenterProps {
  onExplore?: () => void;
  onSelectCategory?: (category: string) => void;
  onLaunchStudio?: () => void;
}

export const HeroCenter: React.FC<HeroCenterProps> = ({
  onExplore,
  onSelectCategory,
  onLaunchStudio
}) => {
  const [activePill, setActivePill] = useState<string>('AI Generation');

  const pills = [
    { label: 'Artistic Gallery', id: 'artistic' },
    { label: 'AI Generation', id: 'ai-gen' },
    { label: '3D Structures', id: '3d-structure' },
  ];

  const handlePillClick = (label: string, id: string) => {
    audioEngine.playClick();
    setActivePill(label);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center my-6 lg:my-10 z-20 gap-5 lg:gap-7 max-w-2xl mx-auto w-full">
      {/* Logo image (80x80) with 3D launcher trigger */}
      <button
        type="button"
        onClick={() => {
          audioEngine.playChime(1056);
          if (onLaunchStudio) onLaunchStudio();
        }}
        aria-label="Open 3D Spatial Flora Studio"
        title="Open 3D Spatial Flora Studio"
        className="w-20 h-20 rounded-2xl liquid-glass flex items-center justify-center p-2.5 hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer group"
      >
        <img
          src="/logo.png"
          alt="Bloom AI Emblem"
          className="w-full h-full object-contain rounded-xl group-hover:rotate-12 transition-transform duration-500"
          width={80}
          height={80}
        />
      </button>

      {/* Hero Title */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-[-0.05em] text-white font-medium text-center leading-[1.06]">
        Innovating the <br />
        <span className="font-serif italic font-normal text-white/80">
          spirit of bloom AI
        </span>
      </h1>

      {/* CTA Button */}
      <button
        type="button"
        onClick={() => {
          audioEngine.playChime(784);
          if (onExplore) onExplore();
        }}
        onMouseEnter={() => audioEngine.playHover()}
        className="liquid-glass-strong rounded-full px-7 py-3.5 flex items-center gap-3.5 text-white font-medium hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer group"
      >
        <span className="text-white text-base tracking-tight font-medium">Explore Now</span>
        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
          <Download className="w-3.5 h-3.5 text-white" />
        </div>
      </button>

      {/* Three Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2.5 pt-1">
        {pills.map((pill) => {
          const isActive = activePill === pill.label;
          return (
            <button
              key={pill.label}
              type="button"
              onClick={() => handlePillClick(pill.label, pill.id)}
              onMouseEnter={() => audioEngine.playHover()}
              className={`liquid-glass rounded-full px-4 py-1.5 text-xs text-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer ${
                isActive ? 'bg-white/15 text-white font-medium' : ''
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
