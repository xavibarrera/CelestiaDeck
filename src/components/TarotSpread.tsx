import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Shuffle,
  RotateCcw,
  BookOpen,
  Save,
  Check,
  Compass,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye
} from 'lucide-react';
import { UserProfile, DrawnCard, JournalEntry } from '../types';
import { drawFreeSpread } from '../utils/prng';
import { saveJournalEntry } from '../utils/journalStorage';
import { TarotCardView } from './TarotCardView';

interface TarotSpreadProps {
  profile: UserProfile | null;
}

type SpreadOption = {
  id: 'one' | 'time' | 'mind' | 'action';
  title: string;
  cardsCount: 1 | 3;
  description: string;
  badge: string;
};

const SPREAD_OPTIONS: SpreadOption[] = [
  {
    id: 'one',
    title: 'Foco Introspectivo',
    cardsCount: 1,
    description: 'Una carta esencial para responder a una duda puntual o meditar.',
    badge: '1 Carta'
  },
  {
    id: 'time',
    title: 'Pasado • Presente • Futuro',
    cardsCount: 3,
    description: 'Raíz del asunto, situación actual y rumbo natural de tu energía.',
    badge: '3 Cartas'
  },
  {
    id: 'mind',
    title: 'Mente • Cuerpo • Espíritu',
    cardsCount: 3,
    description: 'Alineación entre pensamientos, cuerpo físico e intuición.',
    badge: '3 Cartas'
  },
  {
    id: 'action',
    title: 'Situación • Acción • Resolución',
    cardsCount: 3,
    description: 'Enfoque práctico: contexto real, paso sabio y paz esperada.',
    badge: '3 Cartas'
  }
];

export const TarotSpread: React.FC<TarotSpreadProps> = ({ profile }) => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadOption>(SPREAD_OPTIONS[1]);
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [mobileCardIndex, setMobileCardIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [questionInput, setQuestionInput] = useState('');

  // Draw cards with cryptographic Fisher-Yates
  const handleShuffleAndDraw = () => {
    setIsShuffling(true);
    setCards(null);
    setFlippedCards({});
    setMobileCardIndex(0);
    setIsSaved(false);

    setTimeout(() => {
      const drawn = drawFreeSpread(selectedSpread.cardsCount, selectedSpread.id);
      setCards(drawn);
      setIsShuffling(false);
      setFlippedCards({});
    }, 600);
  };

  const handleFlipCard = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleRevealAll = () => {
    if (!cards) return;
    const allFlipped: Record<number, boolean> = {};
    cards.forEach((_, idx) => {
      allFlipped[idx] = true;
    });
    setFlippedCards(allFlipped);
  };

  const handleSaveToJournal = () => {
    if (!cards) return;
    const targetProfileId = profile?.id || 'invitado';
    const entryId = `free-${targetProfileId}-${Date.now()}`;
    const newEntry: JournalEntry = {
      id: entryId,
      profileId: targetProfileId,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      spreadType: selectedSpread.cardsCount === 1 ? 'free_one' : 'free_three_time',
      title: questionInput ? `Tirada: "${questionInput}"` : `Tirada: ${selectedSpread.title}`,
      cards,
      userNotes: journalNote,
      mood: 'Reflexivo'
    };

    saveJournalEntry(newEntry);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const allRevealed = cards && cards.every((_, idx) => !!flippedCards[idx]);

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-3 sm:px-4">
      {/* Title & intro */}
      <div className="text-center px-2">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-3 py-0.5 rounded-full">
          Baraja Completa (78 Arcanos)
        </span>
        <h2 className="font-serif-mystic text-lg sm:text-2xl font-bold text-slate-100 mt-1.5">
          Mesa de Tiradas Libres
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
          Barajado algorítmico <span className="text-slate-300 font-mono">Fisher-Yates</span> con criptografía real.
        </p>
      </div>

      {/* Spread Type Selector (Responsive 2x2 on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {SPREAD_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setSelectedSpread(opt);
              setCards(null);
            }}
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between touch-manipulation active:scale-[0.98] ${
              selectedSpread.id === opt.id
                ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-amber-500/50 shadow-lg ring-1 ring-amber-400/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                    selectedSpread.id === opt.id
                      ? 'bg-amber-400/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {opt.badge}
                </span>
                {selectedSpread.id === opt.id && (
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                )}
              </div>
              <h3 className="font-serif-mystic text-xs font-bold text-slate-200 line-clamp-1">
                {opt.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                {opt.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Introspective Question Input & Action Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 sm:p-4 max-w-xl mx-auto shadow-xl">
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          Pregunta o tema de introspección (opcional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Escribe tu pregunta o tema de reflexión..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3.5">
          <button
            onClick={handleShuffleAndDraw}
            disabled={isShuffling}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold py-2.5 px-4 transition shadow-lg active:scale-95 disabled:opacity-50 touch-manipulation"
          >
            <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
            <span>
              {isShuffling
                ? 'Barajando 78 cartas...'
                : cards
                ? 'Volver a Barajar'
                : 'Barajar y Repartir'}
            </span>
          </button>

          {cards && !allRevealed && (
            <button
              onClick={handleRevealAll}
              className="min-h-[44px] flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition touch-manipulation active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Develar</span>
            </button>
          )}
        </div>
      </div>

      {/* The Velvet Table of Cards */}
      {cards && (
        <div className="space-y-4 pt-1">
          {/* Instruction banner if unrevealed */}
          {!allRevealed && (
            <p className="text-center text-xs text-amber-300/80 animate-pulse font-serif-mystic">
              ✦ Toca la carta para girarla ✦
            </p>
          )}

          {/* If 1 card spread */}
          {cards.length === 1 && (
            <div className="max-w-md mx-auto">
              <TarotCardView
                drawnCard={cards[0]}
                isFlipped={!!flippedCards[0]}
                onFlip={() => handleFlipCard(0)}
                allowManualFlip={true}
                compact={false}
              />
            </div>
          )}

          {/* If 3 cards spread: MOBILE SWITCHER */}
          {cards.length === 3 && (
            <>
              {/* Mobile View */}
              <div className="block md:hidden">
                <div className="flex items-center justify-between gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-3">
                  {cards.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMobileCardIndex(idx)}
                      className={`flex-1 py-2 px-1 text-[11px] font-semibold rounded-lg transition-all touch-manipulation text-center ${
                        mobileCardIndex === idx
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'text-slate-400'
                      }`}
                    >
                      <span className="truncate block">
                        {idx + 1}. {c.positionName?.split('/')[0].trim()}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <TarotCardView
                    drawnCard={cards[mobileCardIndex]}
                    isFlipped={!!flippedCards[mobileCardIndex]}
                    onFlip={() => handleFlipCard(mobileCardIndex)}
                    allowManualFlip={true}
                    compact={false}
                  />

                  {/* Previous / Next buttons */}
                  <div className="flex items-center justify-between mt-3 px-2">
                    <button
                      disabled={mobileCardIndex === 0}
                      onClick={() => setMobileCardIndex((i) => Math.max(0, i - 1))}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 py-1.5 px-3 bg-slate-900 rounded-lg border border-slate-800 touch-manipulation"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      {mobileCardIndex + 1} de 3
                    </span>
                    <button
                      disabled={mobileCardIndex === 2}
                      onClick={() => setMobileCardIndex((i) => Math.min(2, i + 1))}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 py-1.5 px-3 bg-slate-900 rounded-lg border border-slate-800 touch-manipulation"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop/Tablet Grid View */}
              <div className="hidden md:grid md:grid-cols-3 gap-6">
                {cards.map((drawnCard, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <TarotCardView
                      drawnCard={drawnCard}
                      isFlipped={!!flippedCards[index]}
                      onFlip={() => handleFlipCard(index)}
                      allowManualFlip={true}
                      compact={false}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Reading Synthesis & Journal Save (when cards are revealed) */}
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-amber-500/20 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto shadow-2xl space-y-3.5"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-serif-mystic font-bold text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Síntesis Holística de la Tirada</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                {questionInput && (
                  <p className="text-amber-200/90 font-medium pb-2 border-b border-slate-800">
                    Pregunta: "{questionInput}"
                  </p>
                )}
                {cards.map((c, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-xs">
                    <span className="text-amber-400 font-semibold">•</span>
                    <span>
                      <strong className="text-slate-100">{c.positionName}:</strong>{' '}
                      {c.card.name} {c.isReversed ? '(Invertida)' : ''} —{' '}
                      {c.isReversed ? c.card.reversed.general : c.card.upright.general}
                    </span>
                  </p>
                ))}
              </div>

              {/* Personal Reflection & Save to Journal */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Anotar reflexiones para Mi Diario
                </label>
                <textarea
                  rows={2}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="¿Qué resonó contigo en esta lectura?..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 resize-none transition"
                />

                <div className="flex items-center justify-end mt-2.5">
                  <button
                    onClick={handleSaveToJournal}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 transition shadow-md active:scale-95 touch-manipulation"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>¡Guardada en Mi Diario!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Tirada en Diario</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
