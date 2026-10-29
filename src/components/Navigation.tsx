import React, { useState } from 'react';
import { Menu, X, ArrowRight, Volume2, VolumeX, Eye, Layers } from 'lucide-react';
import { audioEngine } from '../utils/audioSynthesizer';

interface NavigationProps {
  onOpenExplore?: () => void;
  onOpenStudio?: () => void;
  onOpenGreenhouse?: () => void;
  onToggleZen?: () => void;
  isZenMode?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenExplore,
  onOpenStudio,
  onOpenGreenhouse,
  onToggleZen,
  isZenMode = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const menuItems = [
    { label: '3D Botanical Studio', tag: 'Interactive', action: onOpenStudio },
    { label: 'Generative Flora Vault', tag: 'Curated', action: onOpenExplore },
    { label: 'My Greenhouse', tag: 'Saved Seeds', action: onOpenGreenhouse },
    { label: 'Cinematic Zen Mode', tag: 'Press Z', action: onToggleZen },
  ];

  return (
    <>
      <nav aria-label="Main Navigation" className="w-full flex items-center justify-between z-20">
        {/* Left: Logo image (/logo.png, 32x32) + "bloom" text */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            audioEngine.playHover();
            if (onOpenStudio) onOpenStudio();
          }}
        >
          <img
            src="/logo.png"
            alt="Bloom Logo"
            className="w-8 h-8 rounded-lg object-contain group-hover:scale-110 transition-transform"
            width={32}
            height={32}
          />
          <span className="font-semibold text-2xl tracking-tighter text-white select-none">
            bloom
          </span>
        </div>

        {/* Right Actions: Sound Toggle + Menu Button */}
        <div className="flex items-center gap-2">
          {/* Ambient Soundscape Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Enable ambient glass frequency" : "Mute ambient audio"}
            title={isMuted ? "Unmute generative crystal soundscape" : "Mute audio"}
            className="liquid-glass rounded-full w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/50" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>

          {/* Zen View Button */}
          {onToggleZen && (
            <button
              type="button"
              onClick={onToggleZen}
              aria-label="Toggle cinematic view"
              title="Zen view (hide controls)"
              className="liquid-glass rounded-full w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              <Eye className="w-4 h-4 text-white/70" />
            </button>
          )}

          {/* Menu button with Menu icon, liquid-glass pill */}
          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              setIsMenuOpen(true);
            }}
            className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-sm text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-expanded={isMenuOpen}
            aria-label="Open menu"
          >
            <span className="text-white/90 font-medium">Menu</span>
            <Menu className="w-4 h-4 text-white" />
          </button>
        </div>
      </nav>

      {/* Interactive Liquid Glass Menu Drawer */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Drawer"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="liquid-glass-strong rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Bloom Logo"
                  className="w-7 h-7 rounded-md object-contain"
                />
                <span className="font-semibold text-xl tracking-tighter text-white">
                  bloom navigation
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  audioEngine.playClick();
                  setIsMenuOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    audioEngine.playClick();
                    setIsMenuOpen(false);
                    if (item.action) item.action();
                  }}
                  className="liquid-glass rounded-2xl px-5 py-3.5 flex items-center justify-between text-left hover:scale-105 transition-transform group cursor-pointer"
                >
                  <span className="text-white font-medium text-base group-hover:text-white/90">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50">{item.tag}</span>
                    <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-white/40">
              Bloom Generative Botany Platform • v2.4.0
            </div>
          </div>
        </div>
      )}
    </>
  );
};
