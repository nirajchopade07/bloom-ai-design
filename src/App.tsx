import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { HeroCenter } from './components/HeroCenter';
import { VisionaryQuote } from './components/VisionaryQuote';
import { RightPanel } from './components/RightPanel';
import { ExploreModal } from './components/ExploreModal';
import { AccountModal } from './components/AccountModal';
import { StudioModal } from './components/StudioModal';
import { GreenhouseModal } from './components/GreenhouseModal';
import { BotanicalSculpt, BOTANICAL_COLLECTION } from './utils/botanicalData';
import { audioEngine } from './utils/audioSynthesizer';
import { Eye, Sparkles } from 'lucide-react';

export default function App() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isGreenhouseOpen, setIsGreenhouseOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStudioSpecimen, setActiveStudioSpecimen] = useState<BotanicalSculpt>(BOTANICAL_COLLECTION[0]);

  // Optical physics: Update specular reflection variables based on mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = `${e.clientX}px`;
    const y = `${e.clientY}px`;
    document.documentElement.style.setProperty('--mouse-x', x);
    document.documentElement.style.setProperty('--mouse-y', y);
  }, []);

  // Keyboard accessibility & Zen mode shortcut (Press 'Z' to toggle Zen mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Zen mode with 'Z' key when no modal is open
      if (
        (e.key === 'z' || e.key === 'Z') &&
        !isExploreOpen &&
        !isAccountOpen &&
        !isStudioOpen &&
        !isGreenhouseOpen
      ) {
        setIsZenMode((prev) => !prev);
        audioEngine.playClick();
      }
      // Close open modals on Escape
      if (e.key === 'Escape') {
        setIsExploreOpen(false);
        setIsAccountOpen(false);
        setIsStudioOpen(false);
        setIsGreenhouseOpen(false);
        setIsZenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExploreOpen, isAccountOpen, isStudioOpen, isGreenhouseOpen]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setIsExploreOpen(true);
  };

  const handleOpenStudio = (specimen?: BotanicalSculpt) => {
    if (specimen) {
      setActiveStudioSpecimen(specimen);
    }
    setIsStudioOpen(true);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-x-hidden flex flex-col lg:flex-row bg-black select-none font-sans"
    >
      {/* Background: Full-screen autoplaying, looping, muted video background sitting at z-0 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4"
      />

      {/* Subtle depth veil for pure optical contrast */}
      <div className="fixed inset-0 bg-black/20 pointer-events-none z-0" />

      {/* Zen Mode Restorer Bar */}
      {isZenMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsZenMode(false)}
            className="liquid-glass-strong rounded-full px-5 py-2.5 flex items-center gap-2 text-xs text-white font-medium hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-2xl"
          >
            <Eye className="w-3.5 h-3.5 text-white" />
            <span>Exit Zen Mode (or press Z)</span>
          </button>
        </div>
      )}

      {/* Main Container: Flex row, min-h-screen. Left panel w-[52%], right panel w-[48%] */}
      <main
        className={`relative z-10 w-full min-h-screen flex flex-col lg:flex-row transition-opacity duration-700 ${
          isZenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left Panel: w-[52%] (hidden on mobile? No, right panel hidden on mobile lg:flex) */}
        <section
          aria-label="Bloom AI Hero Presentation"
          className="relative w-full lg:w-[52%] min-h-screen p-4 lg:p-6 flex flex-col"
        >
          {/* Has a liquid-glass-strong overlay (absolute inset-4 lg:inset-6 rounded-3xl) */}
          <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between flex-1 relative overflow-hidden">
            {/* Nav: Logo image (/logo.png, 32×32) + "bloom" text + Menu button + Audio & Zen */}
            <Navigation
              onOpenExplore={() => setIsExploreOpen(true)}
              onOpenStudio={() => handleOpenStudio()}
              onOpenGreenhouse={() => setIsGreenhouseOpen(true)}
              onToggleZen={() => setIsZenMode(!isZenMode)}
              isZenMode={isZenMode}
            />

            {/* Hero center (flex-1, centered) */}
            <HeroCenter
              onExplore={() => setIsExploreOpen(true)}
              onSelectCategory={handleSelectCategory}
              onLaunchStudio={() => handleOpenStudio()}
            />

            {/* Bottom quote */}
            <VisionaryQuote />
          </div>
        </section>

        {/* Right Panel (desktop only: hidden lg:flex w-[48%]) */}
        <RightPanel
          onOpenExplore={() => setIsExploreOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onOpenStudio={handleOpenStudio}
          onOpenGreenhouse={() => setIsGreenhouseOpen(true)}
        />
      </main>

      {/* Floating 3D Launch Pill for Mobile/Quick Desktop access */}
      {!isZenMode && (
        <div className="fixed bottom-4 right-4 z-40 lg:hidden">
          <button
            type="button"
            onClick={() => handleOpenStudio()}
            aria-label="Launch 3D Studio"
            className="liquid-glass-strong rounded-full p-3.5 flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Modals & Dialogs */}
      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        initialCategory={selectedCategory}
        onOpenStudioWithSpecimen={handleOpenStudio}
      />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
      <StudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialSpecimen={activeStudioSpecimen}
      />
      <GreenhouseModal
        isOpen={isGreenhouseOpen}
        onClose={() => setIsGreenhouseOpen(false)}
        onOpenStudioWithSpecimen={handleOpenStudio}
      />
    </div>
  );
}
