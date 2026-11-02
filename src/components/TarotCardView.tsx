import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Compass,
  HelpCircle,
  ChevronDown,
  RotateCw,
  Eye,
  Flame,
  Droplet,
  Wind,
  Coins,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { DrawnCard } from '../types';
import { getSuitDetails } from '../utils/tarotDeck';

interface TarotCardViewProps {
  drawnCard: DrawnCard;
  isFlipped?: boolean;
  onFlip?: () => void;
  allowManualFlip?: boolean;
  compact?: boolean;
  showDetailsDefault?: boolean;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  drawnCard,
  isFlipped = true,
  onFlip,
  allowManualFlip = false,
  compact = false,
  showDetailsDefault = false
}) => {
  const { card, isReversed, positionName, positionMeaning } = drawnCard;
  const [activeTab, setActiveTab] = useState<'general' | 'love' | 'work' | 'advice'>('general');
  const [showQuestion, setShowQuestion] = useState(false);

  const suitMeta = card.suit ? getSuitDetails(card.suit) : null;

  // Icon for element/suit
  const renderCardSymbol = () => {
    if (card.element === 'Fuego') return <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />;
    if (card.element === 'Agua') return <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />;
    if (card.element === 'Aire') return <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />;
    if (card.element === 'Tierra') return <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />;
    return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto px-1">
      {/* Position Header (if in a spread) */}
      {positionName && (
        <div className="text-center mb-2 px-2">
          <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-400/90 bg-amber-950/40 border border-amber-500/20 px-2.5 py-0.5 rounded-full mb-1">
            {positionName}
          </span>
          {positionMeaning && (
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto line-clamp-1">
              {positionMeaning}
            </p>
          )}
        </div>
      )}

      {/* The 3D Flip Card Container - Mobile optimized responsive aspect ratio */}
      <div
        onClick={allowManualFlip ? onFlip : undefined}
        className={`perspective-1000 relative select-none touch-manipulation ${
          allowManualFlip ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
        } ${compact ? 'w-[150px] h-[240px]' : 'w-[250px] xs:w-[270px] sm:w-[285px] h-[375px] xs:h-[395px] sm:h-[415px]'}`}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full h-full relative preserve-3d"
        >
          {/* FRONT OF CARD (Revealed) */}
          <div
            className={`absolute inset-0 backface-hidden rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between border shadow-2xl transition-all duration-300 ${
              isReversed ? 'rotate-180 ring-1 ring-violet-500/30' : ''
            } bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/70 border-amber-500/40`}
          >
            {/* Inner Gold Inset Border */}
            <div className="absolute inset-1.5 rounded-xl border border-amber-500/20 pointer-events-none" />

            {/* Top Bar: Roman Numeral & Element */}
            <div className="flex items-center justify-between text-xs font-mono text-amber-400/80 px-1 z-10">
              <span className="font-serif-mystic text-xs sm:text-sm font-bold text-amber-300">
                {card.romanNumeral || `#${card.number}`}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-wide text-slate-400">
                  {card.element}
                </span>
                {renderCardSymbol()}
              </div>
            </div>

            {/* Central Graphic Emblem */}
            <div className="flex-1 flex flex-col items-center justify-center py-1 sm:py-2 px-1 text-center relative z-10">
              <div className="relative w-20 h-20 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-indigo-950 to-slate-900 border border-amber-400/30 flex items-center justify-center shadow-inner mb-2 sm:mb-3">
                <div className="absolute inset-1.5 rounded-full border border-dashed border-amber-400/20 animate-spin [animation-duration:40s]" />
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-violet-950/40 flex items-center justify-center text-amber-300">
                  {card.arcana === 'major' ? (
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 animate-pulse" />
                  ) : (
                    renderCardSymbol()
                  )}
                </div>
              </div>

              {/* Card Title */}
              <h3 className="font-serif-mystic text-sm sm:text-base font-bold text-slate-100 tracking-wide text-center leading-tight">
                {card.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-400/70 italic mt-0.5 font-serif-mystic">
                {card.astrologyRef}
              </p>

              {/* Keywords Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1 mt-2 max-w-[95%]">
                {card.keywords.slice(0, 3).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[9px] bg-slate-800/80 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Bar: Arcana Type Indicator */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 pt-1.5 sm:pt-2 border-t border-slate-800/80 px-1 z-10">
              <span className="uppercase tracking-widest text-[8px] sm:text-[9px] text-amber-400/70 truncate max-w-[130px]">
                {card.arcana === 'major' ? 'Arcano Mayor' : `${card.suit}`}
              </span>
              <span className="font-serif-mystic text-[9px] text-slate-400">CelestiaDeck</span>
            </div>
          </div>

          {/* BACK OF CARD (Mystic Celestial Geometry) */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-3 border border-amber-500/30 bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Concentric rings & celestial back design */}
            <div className="absolute inset-2 rounded-xl border border-amber-500/20" />
            <div className="absolute inset-3.5 rounded-lg border border-dashed border-violet-500/20" />
            
            <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full border border-amber-400/40 flex items-center justify-center bg-indigo-950/60 shadow-lg">
              <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/20 animate-spin [animation-duration:30s]" />
              <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300/80 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]" />
            </div>

            <div className="mt-3 text-center z-10">
              <p className="font-serif-mystic text-xs font-semibold text-amber-300/90 tracking-widest uppercase">
                CelestiaDeck
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Toca para develar</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile-friendly Flip Control & Orientation Badge */}
      <div className="mt-2.5 flex items-center gap-2 flex-wrap justify-center">
        {isFlipped && (
          <div>
            {isReversed ? (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-violet-300 bg-violet-950/50 border border-violet-500/30 px-2.5 py-0.5 rounded-full">
                <RotateCw className="w-3 h-3 text-violet-400" />
                Invertida • Foco Interior
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-amber-300/90 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Al Derecho • Fluidez
              </span>
            )}
          </div>
        )}

        {allowManualFlip && (
          <button
            onClick={onFlip}
            className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full hover:border-amber-400/40 active:scale-95 transition touch-manipulation"
          >
            <RotateCw className="w-2.5 h-2.5 text-amber-400" />
            <span>Girar carta</span>
          </button>
        )}
      </div>

      {/* Introspective Meaning Tabs (Clean, concise, touch-friendly on mobile) */}
      {isFlipped && !compact && (
        <div className="w-full mt-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg backdrop-blur-sm">
          {/* Quick Core Summary */}
          <div className="mb-3 pb-2.5 border-b border-slate-800/80">
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {isReversed ? card.reversed.general : card.upright.general}
            </p>
          </div>

          {/* Meaning category buttons - 44px touch target friendly */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/70 rounded-xl mb-3 border border-slate-800/80">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 touch-manipulation ${
                activeTab === 'general'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3 flex-shrink-0" />
              <span>Esencia</span>
            </button>
            <button
              onClick={() => setActiveTab('love')}
              className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 touch-manipulation ${
                activeTab === 'love'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3 h-3 flex-shrink-0" />
              <span>Vínculos</span>
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 touch-manipulation ${
                activeTab === 'work'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3 h-3 flex-shrink-0" />
              <span>Propósito</span>
            </button>
            <button
              onClick={() => setActiveTab('advice')}
              className={`py-2 px-1 text-[11px] font-medium rounded-lg transition-all flex items-center justify-center gap-1 touch-manipulation ${
                activeTab === 'advice'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>Consejo</span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[50px] text-xs leading-relaxed text-slate-200 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            {activeTab === 'general' && (
              <p>
                {isReversed
                  ? card.reversed.general
                  : card.upright.general}
              </p>
            )}
            {activeTab === 'love' && (
              <p>
                {isReversed
                  ? `Vínculos interiores: ${card.reversed.advice}`
                  : card.upright.love}
              </p>
            )}
            {activeTab === 'work' && (
              <p>
                {isReversed
                  ? `Propósito y ritmo: ${card.reversed.advice}`
                  : card.upright.work}
              </p>
            )}
            {activeTab === 'advice' && (
              <p className="text-amber-200 font-medium">
                {isReversed ? card.reversed.advice : card.upright.advice}
              </p>
            )}
          </div>

          {/* Self-care reflection question accordion */}
          <div className="mt-3 pt-2.5 border-t border-slate-800">
            <button
              onClick={() => setShowQuestion(!showQuestion)}
              className="w-full flex items-center justify-between text-left text-xs font-medium text-amber-400/90 hover:text-amber-300 transition py-1 touch-manipulation"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Pregunta para tu Diario
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showQuestion ? 'rotate-180' : ''}`}
              />
            </button>
            {showQuestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 text-xs text-amber-100/90 italic bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-lg"
              >
                "{card.reflectionQuestion}"
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
