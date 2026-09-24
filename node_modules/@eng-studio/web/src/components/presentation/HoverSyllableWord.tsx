import React, { useState } from 'react';
import { SyllableSegment } from '@eng-studio/shared-types';

interface HoverSyllableWordProps {
  readonly word: string;
  readonly syllables: readonly SyllableSegment[];
  readonly ipa?: string;
  readonly className?: string;
}

export const HoverSyllableWord: React.FC<HoverSyllableWordProps> = ({
  word,
  syllables,
  ipa,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <span
      className={`relative inline-block select-none cursor-pointer transition-all duration-200 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      aria-label={`${word}, hover to inspect syllable decomposition and primary stress`}
    >
      {!isHovered ? (
        <span className="font-bold text-slate-900 underline decoration-slate-300 decoration-dotted underline-offset-4 hover:decoration-indigo-400">
          {word}
        </span>
      ) : (
        <span className="inline-flex items-baseline gap-0.5 rounded-lg bg-indigo-50/80 px-2 py-0.5 border border-indigo-200 shadow-xs">
          {syllables.map((syl, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300 font-light mx-0.5">-</span>}
              <span
                className={
                  syl.isStress
                    ? 'font-extrabold uppercase tracking-wide text-indigo-700 bg-indigo-100/90 px-1.5 py-0.5 rounded border-b-2 border-indigo-500'
                    : 'font-medium lowercase text-slate-700'
                }
              >
                {syl.text}
              </span>
            </React.Fragment>
          ))}
        </span>
      )}

      {/* Floating IPA Tag on hover */}
      {isHovered && ipa && (
        <span
          role="tooltip"
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-mono font-medium text-amber-300 shadow-md pointer-events-none"
        >
          {ipa}
        </span>
      )}
    </span>
  );
};
