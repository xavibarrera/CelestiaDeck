import { TAROT_DECK } from './tarotDeck';
import { DrawnCard } from '../types';

/**
 * 32-bit string hashing algorithm (FNV-1a variant + bit mixing)
 * Produces an unsigned 32-bit integer seed from any arbitrary string.
 */
export function stringToSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  // Avalanching bits
  h += (h << 13) >>> 0;
  h ^= (h >>> 7);
  h += (h << 3) >>> 0;
  h ^= (h >>> 17);
  h += (h << 5) >>> 0;
  return h >>> 0;
}

/**
 * Mulberry32 PRNG
 * Returns a generator function returning pseudo-random float [0, 1)
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns ISO Date string "YYYY-MM-DD" for local time
 */
export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns ISO Week string "YYYY-Www"
 */
export function getLocalWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number (make Sunday day 7)
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * Deterministic Daily Tarot (1 Card)
 * Generates the exact same card for a given userId + YYYY-MM-DD
 */
export function getDailyTarot(userId: string, dateStr = getLocalDateKey()): DrawnCard {
  const seedKey = `celestia-daily:${userId}:${dateStr}`;
  const seed = stringToSeed(seedKey);
  const rng = mulberry32(seed);

  const cardIndex = Math.floor(rng() * TAROT_DECK.length);
  // Introspective rule: 85% upright, 15% reversed to invite gentle reflection
  const isReversed = rng() < 0.15;

  return {
    card: TAROT_DECK[cardIndex],
    isReversed,
    positionName: 'Carta del Día',
    positionMeaning: 'Energía arquetípica guía para tus próximas 24 horas y tu momento presente.'
  };
}

/**
 * Deterministic Weekly Tarot (3 Cards: Energía, Desafío, Consejo)
 * Generates the exact same 3 distinct cards for userId + YYYY-Wweek
 */
export function getWeeklyTarot(userId: string, weekStr = getLocalWeekKey()): DrawnCard[] {
  const seedKey = `celestia-weekly:${userId}:${weekStr}`;
  const seed = stringToSeed(seedKey);
  const rng = mulberry32(seed);

  // Seeded Fisher-Yates on a copy of indices [0..77]
  const indices = Array.from({ length: TAROT_DECK.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const positions = [
    {
      name: 'Energía Central',
      meaning: 'La frecuencia y disposición anímica que te acompaña durante esta semana.'
    },
    {
      name: 'Desafío u Oportunidad',
      meaning: 'El aspecto que te invita a madurar, flexibilizarte o cultivar paciencia.'
    },
    {
      name: 'Consejo de Autocuidado',
      meaning: 'La acción constructiva y amable recomendada para mantener tu equilibrio.'
    }
  ];

  return [0, 1, 2].map((idx) => {
    const cardId = indices[idx];
    const isReversed = rng() < 0.18;
    return {
      card: TAROT_DECK[cardId],
      isReversed,
      positionName: positions[idx].name,
      positionMeaning: positions[idx].meaning
    };
  });
}

/**
 * Cryptographically secure Fisher-Yates random shuffle for free spreads
 */
export function cryptoShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;

  if (!cryptoObj || !cryptoObj.getRandomValues) {
    // Math.random fallback
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const randomUint32 = new Uint32Array(1);
  for (let i = arr.length - 1; i > 0; i--) {
    cryptoObj.getRandomValues(randomUint32);
    const j = Math.floor((randomUint32[0] / 4294967296) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * Free spread draw (1 or 3 cards)
 */
export function drawFreeSpread(count: 1 | 3, spreadType: 'one' | 'time' | 'mind' | 'action'): DrawnCard[] {
  const shuffled = cryptoShuffle(TAROT_DECK);
  const randomUint8 = new Uint8Array(count);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomUint8);
  } else {
    for (let i = 0; i < count; i++) randomUint8[i] = Math.floor(Math.random() * 256);
  }

  let positionDefs: { name: string; meaning: string }[] = [];

  if (count === 1) {
    positionDefs = [
      {
        name: 'Foco Introspectivo',
        meaning: 'Claridad inmediata para tu pregunta o estado interior actual.'
      }
    ];
  } else if (spreadType === 'time') {
    positionDefs = [
      { name: 'Raíz / Pasado reciente', meaning: 'El aprendizaje o base de donde vienes.' },
      { name: 'Momento Presente', meaning: 'La energía viva que estás transitando ahora.' },
      { name: 'Potencial Evolutivo', meaning: 'El camino hacia donde fluye tu intención consciente.' }
    ];
  } else if (spreadType === 'mind') {
    positionDefs = [
      { name: 'Mente / Pensamientos', meaning: 'Lo que estás razonando o ideando.' },
      { name: 'Cuerpo / Realidad Material', meaning: 'Tus sensaciones físicas y entorno práctico.' },
      { name: 'Espíritu / Intuición', meaning: 'El llamado de tu propósito e inspiración profunda.' }
    ];
  } else {
    positionDefs = [
      { name: 'Situación', meaning: 'El contexto real sin adornos ni juicios.' },
      { name: 'Acción Consciente', meaning: 'El paso concreto que puedes dar con calma.' },
      { name: 'Resolución / Paz', meaning: 'El estado de equilibrio que puedes cosechar.' }
    ];
  }

  return Array.from({ length: count }).map((_, i) => ({
    card: shuffled[i],
    isReversed: (randomUint8[i] % 100) < 20, // 20% chance of inverted
    positionName: positionDefs[i]?.name,
    positionMeaning: positionDefs[i]?.meaning
  }));
}
