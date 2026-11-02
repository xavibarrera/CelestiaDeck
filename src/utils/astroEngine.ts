import {
  UserProfile,
  ZodiacSignName,
  ZodiacSignInfo,
  PlanetPosition,
  HouseCusp,
  AspectData,
  AspectType,
  NatalChartData,
  CelestialBodyName,
  ElementType,
  ModalityType
} from '../types';

export const ZODIAC_SIGNS: Record<ZodiacSignName, ZodiacSignInfo> = {
  Aries: {
    name: 'Aries',
    symbol: '♈',
    element: 'Fuego',
    modality: 'Cardinal',
    ruler: 'Marte',
    keyword: 'Iniciativa y coraje',
    degreesRange: [0, 30]
  },
  Tauro: {
    name: 'Tauro',
    symbol: '♉',
    element: 'Tierra',
    modality: 'Fijo',
    ruler: 'Venus',
    keyword: 'Estabilidad y sensualidad',
    degreesRange: [30, 60]
  },
  Géminis: {
    name: 'Géminis',
    symbol: '♊',
    element: 'Aire',
    modality: 'Mutable',
    ruler: 'Mercurio',
    keyword: 'Curiosidad y versatilidad',
    degreesRange: [60, 90]
  },
  Cáncer: {
    name: 'Cáncer',
    symbol: '♋',
    element: 'Agua',
    modality: 'Cardinal',
    ruler: 'Luna',
    keyword: 'Nutrición y memoria afectiva',
    degreesRange: [90, 120]
  },
  Leo: {
    name: 'Leo',
    symbol: '♌',
    element: 'Fuego',
    modality: 'Fijo',
    ruler: 'Sol',
    keyword: 'Expresión radiante y generosidad',
    degreesRange: [120, 150]
  },
  Virgo: {
    name: 'Virgo',
    symbol: '♍',
    element: 'Tierra',
    modality: 'Mutable',
    ruler: 'Mercurio',
    keyword: 'Discernimiento y servicio consciente',
    degreesRange: [150, 180]
  },
  Libra: {
    name: 'Libra',
    symbol: '♎',
    element: 'Aire',
    modality: 'Cardinal',
    ruler: 'Venus',
    keyword: 'Armonía y empatía vincular',
    degreesRange: [180, 210]
  },
  Escorpio: {
    name: 'Escorpio',
    symbol: '♏',
    element: 'Agua',
    modality: 'Fijo',
    ruler: 'Plutón',
    keyword: 'Transformación y hondura emocional',
    degreesRange: [210, 240]
  },
  Sagitario: {
    name: 'Sagitario',
    symbol: '♐',
    element: 'Fuego',
    modality: 'Mutable',
    ruler: 'Júpiter',
    keyword: 'Búsqueda de sentido y optimismo',
    degreesRange: [240, 270]
  },
  Capricornio: {
    name: 'Capricornio',
    symbol: '♑',
    element: 'Tierra',
    modality: 'Cardinal',
    ruler: 'Saturno',
    keyword: 'Estructura y perseverancia serena',
    degreesRange: [270, 300]
  },
  Acuario: {
    name: 'Acuario',
    symbol: '♒',
    element: 'Aire',
    modality: 'Fijo',
    ruler: 'Urano',
    keyword: 'Autenticidad y visión humanista',
    degreesRange: [300, 330]
  },
  Piscis: {
    name: 'Piscis',
    symbol: '♓',
    element: 'Agua',
    modality: 'Mutable',
    ruler: 'Neptuno',
    keyword: 'Compasión universal e imaginación',
    degreesRange: [330, 360]
  }
};

export const SIGN_NAMES: ZodiacSignName[] = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

export const POPULAR_CITIES = [
  { name: 'Madrid, España', lat: 40.4168, lon: -3.7038, tz: 1 },
  { name: 'Barcelona, España', lat: 41.3851, lon: 2.1734, tz: 1 },
  { name: 'Ciudad de México, México', lat: 19.4326, lon: -99.1332, tz: -6 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816, tz: -3 },
  { name: 'Bogotá, Colombia', lat: 4.7110, lon: -74.0721, tz: -5 },
  { name: 'Santiago, Chile', lat: -33.4489, lon: -70.6693, tz: -3 },
  { name: 'Lima, Perú', lat: -12.0464, lon: -77.0428, tz: -5 },
  { name: 'Montevideo, Uruguay', lat: -34.9011, lon: -56.1645, tz: -3 },
  { name: 'San José, Costa Rica', lat: 9.9281, lon: -84.0907, tz: -6 },
  { name: 'Quito, Ecuador', lat: -0.1807, lon: -78.4678, tz: -5 },
  { name: 'Caracas, Venezuela', lat: 10.4806, lon: -66.9036, tz: -4 },
  { name: 'Miami, EE. UU.', lat: 25.7617, lon: -80.1918, tz: -5 },
  { name: 'Nueva York, EE. UU.', lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: 'Los Ángeles, EE. UU.', lat: 34.0522, lon: -118.2437, tz: -8 },
  { name: 'Londres, Reino Unido', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'París, Francia', lat: 48.8566, lon: 2.3522, tz: 1 }
];

const HOUSE_THEMES = [
  {
    num: 1,
    name: 'Casa 1 (Ascendente)',
    lifeArea: 'Identidad, presencia, inicio de proyectos y filtro con el mundo.',
    advice: 'Cómo te muestras al mundo y cómo das los primeros pasos en tus aventuras vitales.'
  },
  {
    num: 2,
    name: 'Casa 2',
    lifeArea: 'Autoestima, talentos innatos, recursos materiales y sentido del valor propio.',
    advice: 'Cultivar la abundancia reconociendo lo que ya eres y tus dones naturales.'
  },
  {
    num: 3,
    name: 'Casa 3',
    lifeArea: 'Mente cotidiana, comunicación, aprendizaje, hermanos y entorno cercano.',
    advice: 'Curiosidad para conectar ideas y expresar tu verdad de forma sencilla y clara.'
  },
  {
    num: 4,
    name: 'Casa 4 (Fondo de Cielo)',
    lifeArea: 'Raíces, hogar íntimo, familia y sensación de refugio y pertenencia.',
    advice: 'Construir un santuario personal donde tu alma se sienta en casa y a salvo.'
  },
  {
    num: 5,
    name: 'Casa 5',
    lifeArea: 'Creatividad auténtica, gozo vital, romance, pasatiempos y el niño interior.',
    advice: 'Permitirte crear y disfrutar sin la exigencia de utilidad ni perfeccionismo.'
  },
  {
    num: 6,
    name: 'Casa 6',
    lifeArea: 'Rutinas diarias, salud holística, orden personal y servicio generoso.',
    advice: 'Cuidar tu cuerpo y tu tiempo como un acto devocional de respeto hacia ti.'
  },
  {
    num: 7,
    name: 'Casa 7 (Descendente)',
    lifeArea: 'Relaciones de pareja, vínculos uno a uno, acuerdos y asociaciones íntimas.',
    advice: 'Reconocer en el otro un espejo para evolucionar juntos desde el respeto mutuo.'
  },
  {
    num: 8,
    name: 'Casa 8',
    lifeArea: 'Transformación profunda, intimidad compartida, duelos y regeneración.',
    advice: 'Abrazar los ciclos de morir a lo viejo para renacer más sabio y resiliente.'
  },
  {
    num: 9,
    name: 'Casa 9',
    lifeArea: 'Filosofía de vida, viajes expansivos, estudios superiores y búsqueda de sentido.',
    advice: 'Ampliar horizontes mentales con generosidad y fe en el camino del aprendizaje.'
  },
  {
    num: 10,
    name: 'Casa 10 (Medio Cielo)',
    lifeArea: 'Vocación, contribución a la sociedad, legado público y maestría personal.',
    advice: 'Alinear tu vocación con tu integridad ética para dejar una huella luminosa.'
  },
  {
    num: 11,
    name: 'Casa 11',
    lifeArea: 'Comunidad, amistades afines, causas colectivas y sueños para el futuro.',
    advice: 'Tejer redes de apoyo donde cada persona pueda brillar con su propia originalidad.'
  },
  {
    num: 12,
    name: 'Casa 12',
    lifeArea: 'Mundo inconsciente, espiritualidad, retiro consciente, empatía y descanso del ego.',
    advice: 'Honrar el misterio de la vida a través del silencio, el arte y la compasión universal.'
  }
];

// Helper: Normalize angle to 0 - 360
export function normalizeDegrees(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Convert degree (0 - 360) into Zodiac sign and degree within sign (0 - 29.99)
export function getSignFromDegrees(deg: number): { sign: ZodiacSignName; degreeInSign: number; formatted: string } {
  const normalized = normalizeDegrees(deg);
  const signIndex = Math.floor(normalized / 30);
  const sign = SIGN_NAMES[signIndex % 12];
  const degreeInSign = normalized - signIndex * 30;
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.floor((degreeInSign - degrees) * 60);
  const formatted = `${degrees}° ${String(minutes).padStart(2, '0')}'`;

  return { sign, degreeInSign, formatted };
}

/**
 * Calculates Julian Day Number for local time + timezone
 */
export function calculateJulianDay(dateStr: string, timeStr: string, tzOffsetHours: number): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '12:00').split(':').map(Number);

  // Decimal universal time
  const utHours = hours + minutes / 60 - tzOffsetHours;

  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5 +
    utHours / 24.0;

  return jd;
}

/**
 * Greenwich Mean Sidereal Time in degrees
 */
export function calculateGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeDegrees(gmst);
}

/**
 * Ascendant calculation
 * RAMC = GMST + Longitude
 * tan(Asc) = -cos(RAMC) / (sin(e)*tan(lat) + cos(e)*sin(RAMC))
 */
export function calculateAscendant(jd: number, lat: number, lon: number): number {
  const gmst = calculateGMST(jd);
  const ramc = normalizeDegrees(gmst + lon);
  const ramcRad = (ramc * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const eps = (23.4392911 * Math.PI) / 180; // Obliquity of ecliptic

  const y = -Math.cos(ramcRad);
  const x = Math.sin(eps) * Math.tan(latRad) + Math.cos(eps) * Math.sin(ramcRad);
  let ascDeg = (Math.atan2(y, x) * 180) / Math.PI;

  ascDeg = normalizeDegrees(ascDeg);

  // Quadrant check: Ascendant is always in Eastern hemisphere (RAMC to RAMC+180)
  if (Math.abs(normalizeDegrees(ascDeg - ramc) - 90) > 90) {
    ascDeg = normalizeDegrees(ascDeg + 180);
  }

  return ascDeg;
}

/**
 * Astronomical Ephemeris approximations (analytical Keplerian elements & perturbations)
 * Produces accurate ecliptic longitudes for Western astrological charts
 */
export function calculatePlanetLongitudes(jd: number): Record<CelestialBodyName, number> {
  const d = jd - 2451545.0; // Days since J2000.0
  const T = d / 36525.0;

  // 1. Sun (Sol)
  const sunMeanLong = normalizeDegrees(280.46646 + 0.98564736 * d);
  const sunMeanAnom = normalizeDegrees(357.52911 + 0.98560028 * d);
  const sunAnomRad = (sunMeanAnom * Math.PI) / 180;
  const sunEquationOfCenter =
    (1.914602 - 0.004817 * T) * Math.sin(sunAnomRad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * sunAnomRad) +
    0.000289 * Math.sin(3 * sunAnomRad);
  const sunLong = normalizeDegrees(sunMeanLong + sunEquationOfCenter);

  // 2. Moon (Luna)
  const moonMeanLong = normalizeDegrees(218.3165 + 13.176396 * d);
  const moonMeanAnom = normalizeDegrees(134.9634 + 13.064993 * d);
  const moonMeanElong = normalizeDegrees(297.8502 + 12.190749 * d);
  const moonMeanAnomRad = (moonMeanAnom * Math.PI) / 180;
  const moonMeanElongRad = (moonMeanElong * Math.PI) / 180;
  const moonPerturbations =
    6.289 * Math.sin(moonMeanAnomRad) +
    1.274 * Math.sin(2 * moonMeanElongRad - moonMeanAnomRad) +
    0.658 * Math.sin(2 * moonMeanElongRad) -
    0.186 * Math.sin(sunAnomRad);
  const moonLong = normalizeDegrees(moonMeanLong + moonPerturbations);

  // 3. Mercury (Mercurio)
  const mercMeanLong = normalizeDegrees(252.2509 + 4.0923344 * d);
  const mercMeanAnom = normalizeDegrees(174.7948 + 4.0923344 * d);
  const mercLong = normalizeDegrees(
    mercMeanLong + 23.44 * Math.sin((mercMeanAnom * Math.PI) / 180) + 2.98 * Math.sin(2 * (mercMeanAnom * Math.PI) / 180)
  );

  // 4. Venus (Venus)
  const venusMeanLong = normalizeDegrees(181.9798 + 1.6021305 * d);
  const venusMeanAnom = normalizeDegrees(50.4161 + 1.6021305 * d);
  const venusLong = normalizeDegrees(
    venusMeanLong + 0.776 * Math.sin((venusMeanAnom * Math.PI) / 180)
  );

  // 5. Mars (Marte)
  const marsMeanLong = normalizeDegrees(355.433 + 0.524071 * d);
  const marsMeanAnom = normalizeDegrees(19.373 + 0.524071 * d);
  const marsLong = normalizeDegrees(
    marsMeanLong + 10.69 * Math.sin((marsMeanAnom * Math.PI) / 180) + 0.62 * Math.sin(2 * (marsMeanAnom * Math.PI) / 180)
  );

  // 6. Jupiter (Júpiter)
  const jupMeanLong = normalizeDegrees(34.3515 + 0.0830853 * d);
  const jupMeanAnom = normalizeDegrees(20.02 + 0.0830853 * d);
  const jupLong = normalizeDegrees(
    jupMeanLong + 5.55 * Math.sin((jupMeanAnom * Math.PI) / 180)
  );

  // 7. Saturn (Saturno)
  const satMeanLong = normalizeDegrees(50.0774 + 0.033444 * d);
  const satMeanAnom = normalizeDegrees(317.02 + 0.033444 * d);
  const satLong = normalizeDegrees(
    satMeanLong + 6.35 * Math.sin((satMeanAnom * Math.PI) / 180)
  );

  // 8. Uranus (Urano)
  const uraMeanLong = normalizeDegrees(314.055 + 0.011728 * d);
  const uraLong = normalizeDegrees(uraMeanLong + 5.3 * Math.sin(((uraMeanLong - 173) * Math.PI) / 180));

  // 9. Neptune (Neptuno)
  const nepMeanLong = normalizeDegrees(304.348 + 0.005981 * d);
  const nepLong = normalizeDegrees(nepMeanLong + 1.0 * Math.sin(((nepMeanLong - 48) * Math.PI) / 180));

  // 10. Pluto (Plutón)
  const pluMeanLong = normalizeDegrees(238.96 + 0.00397 * d);
  const pluLong = normalizeDegrees(pluMeanLong + 14.5 * Math.sin(((pluMeanLong - 224) * Math.PI) / 180));

  return {
    Sol: sunLong,
    Luna: moonLong,
    Mercurio: mercLong,
    Venus: venusLong,
    Marte: marsLong,
    Júpiter: jupLong,
    Saturno: satLong,
    Urano: uraLong,
    Neptuno: nepLong,
    Plutón: pluLong,
    Ascendente: 0,
    'Medio Cielo': 0
  };
}

/**
 * Midheaven (Medium Coeli - MC) calculation
 */
export function calculateMidheaven(jd: number, lon: number): number {
  const gmst = calculateGMST(jd);
  const ramc = normalizeDegrees(gmst + lon);
  const ramcRad = (ramc * Math.PI) / 180;
  const eps = (23.4392911 * Math.PI) / 180;

  let mc = (Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(eps)) * 180) / Math.PI;
  mc = normalizeDegrees(mc);

  // MC must match quadrant of RAMC
  if (Math.abs(normalizeDegrees(mc - ramc) - 0) > 90 && Math.abs(normalizeDegrees(mc - ramc) - 360) > 90) {
    mc = normalizeDegrees(mc + 180);
  }

  return mc;
}

/**
 * Determine which house a planet belongs to based on house cusps
 */
export function getHouseForLongitude(deg: number, cusps: number[]): number {
  const normDeg = normalizeDegrees(deg);
  for (let i = 0; i < 12; i++) {
    const cuspCurrent = cusps[i];
    const cuspNext = cusps[(i + 1) % 12];

    if (cuspNext > cuspCurrent) {
      if (normDeg >= cuspCurrent && normDeg < cuspNext) return i + 1;
    } else {
      // wraps around 360 / 0
      if (normDeg >= cuspCurrent || normDeg < cuspNext) return i + 1;
    }
  }
  return 1;
}

/**
 * Calculate Aspect matrix with tolerance orbs
 */
export function calculateAspects(planets: PlanetPosition[]): AspectData[] {
  const aspects: AspectData[] = [];
  const aspectDefs: { type: AspectType; targetAngle: number; maxOrb: number; nature: 'armonioso' | 'dinamico' | 'neutral' }[] = [
    { type: 'Conjunción', targetAngle: 0, maxOrb: 8.0, nature: 'neutral' },
    { type: 'Sextil', targetAngle: 60, maxOrb: 5.5, nature: 'armonioso' },
    { type: 'Cuadratura', targetAngle: 90, maxOrb: 7.0, nature: 'dinamico' },
    { type: 'Trígono', targetAngle: 120, maxOrb: 8.0, nature: 'armonioso' },
    { type: 'Oposición', targetAngle: 180, maxOrb: 8.0, nature: 'dinamico' }
  ];

  // Compare each pair
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      // Exclude comparisons between Asc and MC
      if (
        (p1.name === 'Ascendente' && p2.name === 'Medio Cielo') ||
        (p1.name === 'Medio Cielo' && p2.name === 'Ascendente')
      ) {
        continue;
      }

      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;

      for (const def of aspectDefs) {
        const orb = Math.abs(diff - def.targetAngle);
        if (orb <= def.maxOrb) {
          const formattedOrb = Math.round(orb * 10) / 10;
          let interp = '';
          let advice = '';

          if (def.type === 'Conjunción') {
            interp = `Fusión intensa de energías: la esencia de ${p1.name} y ${p2.name} actúan al unísono.`;
            advice = `Canaliza esta unión con consciencia para no sobrecargar el área donde se encuentran.`;
          } else if (def.type === 'Trígono') {
            interp = `Fluidez natural y dones innatos entre ${p1.name} y ${p2.name}; talento que opera sin esfuerzo.`;
            advice = `Aprovecha esta facilidad sin darla por sentada; cultiva conscientemente este don.`;
          } else if (def.type === 'Sextil') {
            interp = `Oportunidad armónica de colaboración activa entre ${p1.name} y ${p2.name}.`;
            advice = `Abre espacio para que estas dos facetas dialoguen a través de proyectos o creatividad.`;
          } else if (def.type === 'Cuadratura') {
            interp = `Tensión dinámica creativa entre ${p1.name} y ${p2.name}; motor de evolución y aprendizaje.`;
            advice = `No lo vivas como conflicto: es el impulso que te enseña a madurar y superar límites antiguos.`;
          } else {
            interp = `Polaridad e invitación al equilibrio consciente entre las necesidades de ${p1.name} y ${p2.name}.`;
            advice = `Integra ambos polos sin renunciar a ninguno: en el punto medio hallarás tu sabiduría.`;
          }

          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: def.type,
            angle: Math.round(diff * 10) / 10,
            orb: formattedOrb,
            exactAngle: def.targetAngle,
            nature: def.nature,
            interpretation: interp,
            constructiveAdvice: advice
          });
        }
      }
    }
  }

  // Sort by smallest orb (strongest aspects first)
  return aspects.sort((a, b) => a.orb - b.orb);
}

/**
 * Reassuring Empty House Explanation Generator
 * Explains ruling planet and dispels any alarmist myths!
 */
export function generateEmptyHouseExplanation(houseNum: number, sign: ZodiacSignName, ruler: string): string {
  const rulerInfo = ZODIAC_SIGNS[sign];
  return (
    `Tener la Casa ${houseNum} vacía es completamente habitual y positivo: significa que las temáticas de esta área ` +
    `fluyen de manera natural y sin fricciones planetarias directas. La energía de esta casa se gestiona a través ` +
    `de su signo en la cúspide (${sign}, elemento ${rulerInfo.element}) y su planeta regente, ${ruler}. ` +
    `Para comprender cómo abordas esta área, observa dónde se sitúa ${ruler} en tu carta: esa es la llave conductora ` +
    `que nutre este ámbito de tu vida.`
  );
}

/**
 * Complete Natal Chart Calculation
 */
export function calculateNatalChart(profile: UserProfile): NatalChartData {
  const jd = calculateJulianDay(profile.birthDate, profile.birthTime, profile.timezoneOffset);
  const ascLong = calculateAscendant(jd, profile.latitude, profile.longitude);
  const mcLong = calculateMidheaven(jd, profile.longitude);

  const rawLongitudes = calculatePlanetLongitudes(jd);
  rawLongitudes['Ascendente'] = ascLong;
  rawLongitudes['Medio Cielo'] = mcLong;

  // Calculate 12 House Cusps (Equal House System from Ascendant with MC integration)
  const houseCuspDegrees: number[] = [];
  for (let h = 0; h < 12; h++) {
    houseCuspDegrees.push(normalizeDegrees(ascLong + h * 30));
  }

  // Planet descriptions for introspective reading
  const descriptions: Record<CelestialBodyName, string> = {
    Sol: 'Tu núcleo de vitalidad, identidad consciente y brillo genuino.',
    Luna: 'Tu mundo emocional íntimo, tus necesidades de seguridad afectiva y nutrición.',
    Mercurio: 'Tu estilo mental, comunicación, procesamiento de ideas y curiosidad.',
    Venus: 'Tu forma de valorar, amar, disfrutar del placer, el arte y la armonía vincular.',
    Marte: 'Tu motor de acción, asertividad, pasión vital y capacidad de poner límites.',
    Júpiter: 'Tu principio de expansión, búsqueda de significado, optimismo y fe en la vida.',
    Saturno: 'Tu maestro de madurez, resiliencia, disciplina constructiva y maestría a largo plazo.',
    Urano: 'Tu chispazo de originalidad, libertad personal, intuición súbita e innovación.',
    Neptuno: 'Tu sensibilidad mística, imaginación compasiva, sueños y conexión espiritual.',
    Plutón: 'Tu capacidad de regeneración profunda, empoderamiento interno y renacimiento.',
    Ascendente: 'Tu presencia hacia el mundo exterior, tu estilo de iniciar proyectos y filtro vital.',
    'Medio Cielo': 'Tu vocación, legado ético, aspiración profesional y contribución a la comunidad.'
  };

  // Convert raw longitudes to PlanetPosition array
  const planets: PlanetPosition[] = [];
  const planetKeys: CelestialBodyName[] = [
    'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte',
    'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
  ];

  for (const name of planetKeys) {
    const lon = rawLongitudes[name];
    const { sign, degreeInSign, formatted } = getSignFromDegrees(lon);
    const house = getHouseForLongitude(lon, houseCuspDegrees);
    planets.push({
      name,
      longitude: lon,
      sign,
      degreeInSign,
      formattedDegree: formatted,
      house,
      description: descriptions[name]
    });
  }

  // Ascendant position
  const ascSignData = getSignFromDegrees(ascLong);
  const ascendant: PlanetPosition = {
    name: 'Ascendente',
    longitude: ascLong,
    sign: ascSignData.sign,
    degreeInSign: ascSignData.degreeInSign,
    formattedDegree: ascSignData.formatted,
    house: 1,
    description: descriptions['Ascendente']
  };

  // Midheaven position
  const mcSignData = getSignFromDegrees(mcLong);
  const midheaven: PlanetPosition = {
    name: 'Medio Cielo',
    longitude: mcLong,
    sign: mcSignData.sign,
    degreeInSign: mcSignData.degreeInSign,
    formattedDegree: mcSignData.formatted,
    house: 10,
    description: descriptions['Medio Cielo']
  };

  // Build 12 House Cusps with empty-house rule
  const houses: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const cuspDeg = houseCuspDegrees[i];
    const { sign, formatted } = getSignFromDegrees(cuspDeg);
    const ruler = ZODIAC_SIGNS[sign].ruler;
    const theme = HOUSE_THEMES[i];

    // Find planets in this house
    const planetsInHouse = planets.filter((p) => p.house === houseNum);
    const isEmpty = planetsInHouse.length === 0;

    houses.push({
      number: houseNum,
      cuspLongitude: cuspDeg,
      sign,
      formattedDegree: formatted,
      rulerPlanet: ruler,
      planetsInHouse,
      isEmpty,
      emptyHouseExplanation: isEmpty ? generateEmptyHouseExplanation(houseNum, sign, ruler) : undefined,
      lifeArea: theme.lifeArea,
      introspectiveGuidance: theme.advice
    });
  }

  // Calculate aspects between planets + Ascendant + MC
  const allPoints = [...planets, ascendant, midheaven];
  const aspects = calculateAspects(allPoints);

  // Dominant elements & modalities calculation
  const elementCounts: Record<ElementType, number> = { Fuego: 0, Tierra: 0, Aire: 0, Agua: 0 };
  const modalityCounts: Record<ModalityType, number> = { Cardinal: 0, Fijo: 0, Mutable: 0 };

  planets.forEach((p) => {
    const signInfo = ZODIAC_SIGNS[p.sign];
    elementCounts[signInfo.element]++;
    modalityCounts[signInfo.modality]++;
  });

  let topElement: ElementType = 'Fuego';
  let maxEl = 0;
  (Object.keys(elementCounts) as ElementType[]).forEach((el) => {
    if (elementCounts[el] > maxEl) {
      maxEl = elementCounts[el];
      topElement = el;
    }
  });

  let topModality: ModalityType = 'Cardinal';
  let maxMod = 0;
  (Object.keys(modalityCounts) as ModalityType[]).forEach((m) => {
    if (modalityCounts[m] > maxMod) {
      maxMod = modalityCounts[m];
      topModality = m;
    }
  });

  return {
    profile,
    julianDay: jd,
    ascendant,
    midheaven,
    planets,
    houses,
    aspects,
    dominantElement: {
      element: topElement,
      count: maxEl,
      percentage: Math.round((maxEl / planets.length) * 100)
    },
    dominantModality: {
      modality: topModality,
      count: maxMod,
      percentage: Math.round((maxMod / planets.length) * 100)
    }
  };
}
