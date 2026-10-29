import React from 'react';

export const VisionaryQuote: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center gap-2.5 sm:gap-3 w-full max-w-md mx-auto z-20 pt-4">
      {/* Label */}
      <span className="text-xs tracking-widest uppercase text-white/50 font-medium select-none">
        VISIONARY DESIGN
      </span>

      {/* Quote: "We imagined a realm with no ending." — mixed font-display/font-serif italic spans */}
      <blockquote className="text-lg sm:text-xl md:text-2xl text-white font-normal leading-snug tracking-tight">
        “We imagined <span className="font-serif italic font-normal text-white/80">a realm</span> with no{' '}
        <span className="font-serif italic font-normal text-white/80">ending.</span>”
      </blockquote>

      {/* Author with horizontal lines on each side */}
      <div className="flex items-center justify-center gap-3.5 w-full max-w-xs mt-1">
        <div className="h-px bg-white/20 flex-1" />
        <span className="text-xs uppercase tracking-widest text-white/60 font-medium whitespace-nowrap select-none">
          MARCUS AURELIO
        </span>
        <div className="h-px bg-white/20 flex-1" />
      </div>
    </div>
  );
};
