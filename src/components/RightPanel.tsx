import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Twitter,
  Linkedin,
  Instagram,
  Wand2,
  BookOpen,
  Plus,
  Check,
  Zap,
  Layers
} from 'lucide-react';
import heroFlowersImg from '@/assets/hero-flowers.png';
import { audioEngine } from '../utils/audioSynthesizer';
import { BotanicalSculpt, BOTANICAL_COLLECTION } from '../utils/botanicalData';

interface RightPanelProps {
  onOpenExplore?: () => void;
  onOpenAccount?: () => void;
  onOpenStudio?: (specimen?: BotanicalSculpt) => void;
  onOpenGreenhouse?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  onOpenExplore,
  onOpenAccount,
  onOpenStudio,
  onOpenGreenhouse
}) => {
  const [activeFeature, setActiveFeature] = useState<'processing' | 'archive' | 'sculpting'>('sculpting');
  const [isSculptingExpanded, setIsSculptingExpanded] = useState<boolean>(false);
  const [hasBookmarked, setHasBookmarked] = useState<boolean>(false);

  return (
    <aside
      aria-label="Features and Community Panel"
      className="hidden lg:flex w-full lg:w-[48%] relative min-h-screen p-4 lg:p-6 flex-col justify-between z-10"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Social icons in a liquid-glass pill with ArrowRight */}
        <div className="liquid-glass rounded-full px-4 py-2.5 flex items-center gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            onMouseEnter={() => audioEngine.playHover()}
            className="text-white hover:text-white/80 transition-colors hover:scale-105 transition-transform"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            onMouseEnter={() => audioEngine.playHover()}
            className="text-white hover:text-white/80 transition-colors hover:scale-105 transition-transform"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            onMouseEnter={() => audioEngine.playHover()}
            className="text-white hover:text-white/80 transition-colors hover:scale-105 transition-transform"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <div className="w-px h-3.5 bg-white/20" />
          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              if (onOpenExplore) onOpenExplore();
            }}
            aria-label="Explore Community Feed"
            className="text-white hover:text-white/80 transition-colors hover:scale-105 transition-transform cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Account button with Sparkles icon button, both liquid-glass */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              audioEngine.playClick();
              if (onOpenAccount) onOpenAccount();
            }}
            className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            Account
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playChime(987);
              if (onOpenStudio) onOpenStudio();
            }}
            aria-label="AI Generation Studio"
            title="Launch 3D Generative Studio"
            className="liquid-glass rounded-full w-9 h-9 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Community Card (w-56) */}
      <div className="self-end my-auto">
        <div
          role="region"
          aria-label="Community Announcement"
          className="liquid-glass rounded-3xl p-5 w-56 flex flex-col gap-2 hover:scale-105 transition-transform cursor-pointer group"
          onClick={() => {
            audioEngine.playClick();
            if (onOpenGreenhouse) onOpenGreenhouse();
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-white/50 font-medium select-none">
              COMMUNITY
            </span>
            <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
          </div>
          <h3 className="text-sm font-medium text-white tracking-tight leading-snug">
            Enter our ecosystem
          </h3>
          <p className="text-xs text-white/60 leading-relaxed font-normal">
            Join 45,000+ botanical creators sculpting flora in real-time generative lattices.
          </p>
        </div>
      </div>

      {/* Bottom Feature Section: Outer liquid-glass container with rounded-[2.5rem] */}
      <div className="mt-auto">
        <div className="liquid-glass rounded-[2.5rem] p-4 sm:p-5 flex flex-col gap-3.5">
          {/* Two Side-by-Side Cards: Processing (Wand2) & Growth Archive (BookOpen) */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Processing Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveFeature('processing');
                audioEngine.playChime(660);
                if (onOpenStudio) onOpenStudio(BOTANICAL_COLLECTION[0]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveFeature('processing');
                  if (onOpenStudio) onOpenStudio(BOTANICAL_COLLECTION[0]);
                }
              }}
              className={`liquid-glass rounded-3xl p-4 flex flex-col gap-3 hover:scale-105 transition-transform cursor-pointer ${
                activeFeature === 'processing' ? 'bg-white/[0.04]' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-medium text-white tracking-tight">
                  Processing
                </h4>
                <p className="text-xs text-white/60 line-clamp-1">
                  Neural voxel synthesis
                </p>
              </div>
            </div>

            {/* Growth Archive Card */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setActiveFeature('archive');
                audioEngine.playClick();
                if (onOpenGreenhouse) onOpenGreenhouse();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveFeature('archive');
                  if (onOpenGreenhouse) onOpenGreenhouse();
                }
              }}
              className={`liquid-glass rounded-3xl p-4 flex flex-col gap-3 hover:scale-105 transition-transform cursor-pointer ${
                activeFeature === 'archive' ? 'bg-white/[0.04]' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-medium text-white tracking-tight">
                  Growth Archive
                </h4>
                <p className="text-xs text-white/60 line-clamp-1">
                  84,000 algorithmic specimens
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card: flower thumbnail (96x64), "Advanced Plant Sculpting" title + description, and a "+" button */}
          <div className="liquid-glass rounded-3xl p-3.5 sm:p-4 flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <img
                src={heroFlowersImg}
                alt="Advanced Plant Sculpting Preview"
                className="w-24 h-16 object-cover rounded-xl shadow-lg shrink-0 cursor-pointer hover:scale-105 transition-transform"
                width={96}
                height={64}
                onClick={() => {
                  audioEngine.playChime(784);
                  if (onOpenStudio) onOpenStudio();
                }}
              />
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => {
                  audioEngine.playChime(784);
                  if (onOpenStudio) onOpenStudio();
                }}
              >
                <h4 className="text-sm sm:text-base font-medium text-white tracking-tight">
                  Advanced Plant Sculpting
                </h4>
                <p className="text-xs text-white/60 leading-relaxed truncate sm:whitespace-normal">
                  Real-time procedural mesh deformers and cellular hydration simulation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  audioEngine.playClick();
                  setIsSculptingExpanded(!isSculptingExpanded);
                  setHasBookmarked(!hasBookmarked);
                  if (!isSculptingExpanded && onOpenStudio) {
                    onOpenStudio();
                  }
                }}
                aria-label={isSculptingExpanded ? "Collapse sculpting parameters" : "Expand sculpting parameters in 3D"}
                title="Launch 3D Interactive Sculpting"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform shrink-0 cursor-pointer"
              >
                {hasBookmarked ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Expandable parameters when clicked */}
            {isSculptingExpanded && (
              <div className="pt-2 flex items-center justify-between text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-white/80" />
                  Resolution: 148.2k polygons
                </span>
                <button
                  type="button"
                  onClick={() => onOpenStudio && onOpenStudio()}
                  className="text-white underline hover:text-white/80 cursor-pointer"
                >
                  Open 3D Viewport
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
