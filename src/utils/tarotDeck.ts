import rawDeck from './tarotDeck.json';
import { TarotCard, ArcanaType, TarotSuit } from '../types';

export const TAROT_DECK: TarotCard[] = rawDeck as unknown as TarotCard[];

export function getCardById(id: number): TarotCard {
  const card = TAROT_DECK.find((c) => c.id === id);
  if (!card) {
    return TAROT_DECK[0];
  }
  return card;
}

export function getMajorArcana(): TarotCard[] {
  return TAROT_DECK.filter((c) => c.arcana === 'major');
}

export function getMinorArcana(suit?: TarotSuit): TarotCard[] {
  if (suit) {
    return TAROT_DECK.filter((c) => c.arcana === 'minor' && c.suit === suit);
  }
  return TAROT_DECK.filter((c) => c.arcana === 'minor');
}

export function getSuitDetails(suit: TarotSuit) {
  switch (suit) {
    case 'copas':
      return {
        name: 'Copas',
        element: 'Agua',
        color: 'from-sky-500 to-indigo-600',
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/30',
        bgLight: 'bg-sky-950/40',
        icon: 'Droplet',
        description: 'Emociones, afectos, relaciones, intuición y bienestar interior.',
      };
    case 'oros':
      return {
        name: 'Oros',
        element: 'Tierra',
        color: 'from-amber-400 to-yellow-600',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgLight: 'bg-amber-950/40',
        icon: 'Coins',
        description: 'Recursos, proyectos tangibles, salud corporal y estabilidad.',
      };
    case 'espadas':
      return {
        name: 'Espadas',
        element: 'Aire',
        color: 'from-teal-400 to-cyan-600',
        textColor: 'text-teal-300',
        borderColor: 'border-teal-500/30',
        bgLight: 'bg-teal-950/40',
        icon: 'Wind',
        description: 'Mente, claridad, toma de decisiones, verdad y discernimiento.',
      };
    case 'bastos':
      return {
        name: 'Bastos',
        element: 'Fuego',
        color: 'from-rose-500 to-amber-600',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgLight: 'bg-rose-950/40',
        icon: 'Flame',
        description: 'Pasión, impulso vital, creatividad, vocación y voluntad activa.',
      };
  }
}
