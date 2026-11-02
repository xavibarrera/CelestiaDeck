export type ArcanaType = 'major' | 'minor';
export type TarotSuit = 'copas' | 'oros' | 'espadas' | 'bastos';

export interface TarotCardMeaning {
  general: string;
  love: string;
  work: string;
  advice: string;
}

export interface TarotReversedMeaning {
  general: string;
  advice: string;
}

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  arcana: ArcanaType;
  suit?: TarotSuit;
  number: number;
  romanNumeral?: string;
  keywords: string[];
  element: 'Fuego' | 'Agua' | 'Aire' | 'Tierra' | 'Éter';
  astrologyRef: string;
  iconName: string;
  upright: TarotCardMeaning;
  reversed: TarotReversedMeaning;
  reflectionQuestion: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionName?: string;
  positionMeaning?: string;
}

export type SpreadType = 'daily' | 'weekly' | 'free_one' | 'free_three_time' | 'free_three_mind' | 'free_three_action';

export interface JournalEntry {
  id: string;
  profileId: string;
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  spreadType: SpreadType;
  title: string;
  cards: DrawnCard[];
  userNotes: string;
  mood?: 'Tranquilo' | 'Curioso' | 'Inspirado' | 'Reflexivo' | 'Desafiado' | 'Agradecido';
}

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  cityName: string;
  latitude: number;
  longitude: number;
  timezoneOffset: number; // in hours from UTC
  isDefault?: boolean;
}

// Astrology Types
export type ZodiacSignName =
  | 'Aries'
  | 'Tauro'
  | 'Géminis'
  | 'Cáncer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Escorpio'
  | 'Sagitario'
  | 'Capricornio'
  | 'Acuario'
  | 'Piscis';

export type ElementType = 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
export type ModalityType = 'Cardinal' | 'Fijo' | 'Mutable';

export interface ZodiacSignInfo {
  name: ZodiacSignName;
  symbol: string;
  element: ElementType;
  modality: ModalityType;
  ruler: string;
  keyword: string;
  degreesRange: [number, number];
}

export type CelestialBodyName =
  | 'Sol'
  | 'Luna'
  | 'Mercurio'
  | 'Venus'
  | 'Marte'
  | 'Júpiter'
  | 'Saturno'
  | 'Urano'
  | 'Neptuno'
  | 'Plutón'
  | 'Ascendente'
  | 'Medio Cielo';

export interface PlanetPosition {
  name: CelestialBodyName;
  longitude: number; // 0 - 360
  sign: ZodiacSignName;
  degreeInSign: number; // 0 - 29.99
  formattedDegree: string; // e.g. "14° 22'"
  house: number; // 1 to 12
  isRetrograde?: boolean;
  description: string;
  dignity?: string;
}

export interface HouseCusp {
  number: number;
  cuspLongitude: number;
  sign: ZodiacSignName;
  formattedDegree: string;
  rulerPlanet: string;
  planetsInHouse: PlanetPosition[];
  isEmpty: boolean;
  emptyHouseExplanation?: string;
  lifeArea: string;
  introspectiveGuidance: string;
}

export type AspectType = 'Conjunción' | 'Sextil' | 'Cuadratura' | 'Trígono' | 'Oposición';

export interface AspectData {
  planet1: CelestialBodyName;
  planet2: CelestialBodyName;
  type: AspectType;
  angle: number;
  orb: number;
  exactAngle: number;
  nature: 'armonioso' | 'dinamico' | 'neutral';
  interpretation: string;
  constructiveAdvice: string;
}

export interface NatalChartData {
  profile: UserProfile;
  julianDay: number;
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: AspectData[];
  dominantElement: { element: ElementType; count: number; percentage: number };
  dominantModality: { modality: ModalityType; count: number; percentage: number };
}
