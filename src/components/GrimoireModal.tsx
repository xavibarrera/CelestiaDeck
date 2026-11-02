import React, { useState } from 'react';
import { Search, X, Sparkles, Filter, Eye, ArrowLeft } from 'lucide-react';
import { TAROT_DECK } from '../utils/tarotDeck';
import { TarotCard, ArcanaType, TarotSuit } from '../types';
import { TarotCardView } from './TarotCardView';

interface GrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [arcanaFilter, setArcanaFilter] = useState<'all' | 'major' | 'minor'>('all');
  const [suitFilter, setSuitFilter] = useState<TarotSuit | 'all'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  if (!isOpen) return null;

  const filteredCards = TAROT_DECK.filter((card) => {
    const matchesArcana = arcanaFilter === 'all' || card.arcana === arcanaFilter;
    const matchesSuit = suitFilter === 'all' || card.suit === suitFilter;
    const matchesSearch =
      search === '' ||
      card.name.toLowerCase().includes(search.toLowerCase()) ||
      card.keywords.some((kw) => kw.toLowerCase().includes(search.toLowerCase())) ||
      card.astrologyRef.toLowerCase().includes(search.toLowerCase());
    return matchesArcana && matchesSuit && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md sm:p-4 animate-in fade-in duration-200">
      <div className="w-full h-full sm:h-[90vh] sm:max-w-4xl bg-slate-900 border-0 sm:border border-amber-500/30 sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header with mobile safe area */}
        <div className="pt-safe pb-3 px-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            {selectedCard ? (
              <button
                onClick={() => setSelectedCard(null)}
                className="text-amber-400 hover:text-amber-300 p-1.5 rounded-full hover:bg-slate-800 flex items-center gap-1 text-xs font-semibold touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Volver</span>
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
            )}
            <div>
              <h2 className="font-serif-mystic text-sm sm:text-base font-bold text-slate-100">
                {selectedCard ? selectedCard.name : 'Grimorio (78 Arcanos)'}
              </h2>
              <p className="text-[10px] text-slate-400 hidden xs:block">
                {selectedCard ? selectedCard.astrologyRef : 'Enciclopedia de sabiduría e introspección'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition touch-manipulation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar (Hidden when inspecting a single card) */}
        {!selectedCard && (
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, clave o signo..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <button
                onClick={() => {
                  setArcanaFilter('all');
                  setSuitFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  arcanaFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Todos ({TAROT_DECK.length})
              </button>
              <button
                onClick={() => {
                  setArcanaFilter('major');
                  setSuitFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  arcanaFilter === 'major'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Mayores (22)
              </button>
              <button
                onClick={() => {
                  setArcanaFilter('minor');
                  setSuitFilter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  arcanaFilter === 'minor' && suitFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Menores (56)
              </button>
            </div>
          </div>
        )}

        {/* Card grid & Detail View */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 pb-safe">
          {selectedCard ? (
            <div className="max-w-md mx-auto space-y-4 py-2">
              <TarotCardView
                drawnCard={{
                  card: selectedCard,
                  isReversed: false,
                  positionName: selectedCard.arcana === 'major' ? 'Arcano Mayor' : `Palo de ${selectedCard.suit}`,
                  positionMeaning: selectedCard.keywords.join(' • ')
                }}
                isFlipped={true}
                compact={false}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-2.5 sm:p-3 cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between group touch-manipulation"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span className="font-serif-mystic text-amber-400 font-bold">
                        {card.romanNumeral || `#${card.number}`}
                      </span>
                      <span className="uppercase text-[8px] sm:text-[9px]">{card.element}</span>
                    </div>
                    <h4 className="font-serif-mystic text-xs font-bold text-slate-200 group-hover:text-amber-300 transition line-clamp-1">
                      {card.name}
                    </h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                      {card.astrologyRef}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-1.5 border-t border-slate-900 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
                    <span className="line-clamp-1 text-[8px] sm:text-[9px]">{card.keywords[0]}</span>
                    <Eye className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
