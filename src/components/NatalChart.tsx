import React, { useState, useMemo } from 'react';
import {
  Sun,
  Moon,
  Compass,
  Sparkles,
  Info,
  ChevronDown,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Coins,
  Wind,
  Droplet,
  UserPlus
} from 'lucide-react';
import { UserProfile, NatalChartData, HouseCusp, AspectData, PlanetPosition } from '../types';
import { calculateNatalChart, ZODIAC_SIGNS } from '../utils/astroEngine';

interface NatalChartProps {
  profile: UserProfile | null;
  onOpenProfileSetup?: () => void;
}

export const NatalChart: React.FC<NatalChartProps> = ({ profile, onOpenProfileSetup }) => {
  const [activeSection, setActiveSection] = useState<'wheel' | 'planets' | 'houses' | 'aspects'>('wheel');
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<'all' | 'empty' | 'occupied'>('all');
  const [selectedAspectFilter, setSelectedAspectFilter] = useState<string>('all');

  const chartData: NatalChartData | null = useMemo(() => {
    if (!profile) return null;
    return calculateNatalChart(profile);
  }, [profile]);

  // If no profile configured yet, show real profile setup invitation (no mock data!)
  if (!profile || !chartData) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-serif-mystic text-lg sm:text-xl font-bold text-slate-100">
            Calcula tu Carta Natal Real
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            CelestiaDeck no utiliza cartas astrales simuladas ni datos ficticios. Configura tu perfil con tu fecha, hora y ciudad de nacimiento reales para calcular tus posiciones planetarias exactas, las 12 casas y la matriz de aspectos.
          </p>
        </div>
        {onOpenProfileSetup && (
          <button
            onClick={onOpenProfileSetup}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-5 py-3 transition shadow-lg inline-flex items-center gap-2 active:scale-95 touch-manipulation"
          >
            <UserPlus className="w-4 h-4" />
            <span>Configurar Mi Perfil Astral</span>
          </button>
        )}
      </div>
    );
  }

  const sun = chartData.planets.find((p) => p.name === 'Sol');
  const moon = chartData.planets.find((p) => p.name === 'Luna');
  const asc = chartData.ascendant;
  const mc = chartData.midheaven;

  const emptyHousesCount = chartData.houses.filter((h) => h.isEmpty).length;

  const filteredHouses = chartData.houses.filter((h) => {
    if (selectedHouseFilter === 'empty') return h.isEmpty;
    if (selectedHouseFilter === 'occupied') return !h.isEmpty;
    return true;
  });

  const filteredAspects = chartData.aspects.filter((a) => {
    if (selectedAspectFilter === 'all') return true;
    return a.type === selectedAspectFilter;
  });

  // SVG Chart Wheel geometry helpers
  const wheelRadius = 150;
  const center = 175;

  // Polar coordinates for degree (0 - 360)
  const getCoordinates = (deg: number, r: number) => {
    const angleRad = ((deg - chartData.ascendant.longitude + 180) * Math.PI) / 180;
    const x = center + r * Math.cos(angleRad);
    const y = center - r * Math.sin(angleRad);
    return { x, y };
  };

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Header Banner */}
      <div className="text-center px-2">
        <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-violet-400/90 bg-violet-950/40 border border-violet-500/20 px-3 py-0.5 rounded-full">
          Cálculo Astronómico Local
        </span>
        <h2 className="font-serif-mystic text-lg sm:text-2xl font-bold text-slate-100 mt-1.5">
          Carta Astral de {profile.name}
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
          {profile.birthDate} a las {profile.birthTime} • {profile.cityName}
        </p>
      </div>

      {/* Main Core Triad Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Sun */}
        <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 flex-shrink-0">
            <Sun className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
              Signo Solar
            </span>
            <h3 className="font-serif-mystic text-sm sm:text-base font-bold text-slate-100">
              {sun?.sign} {ZODIAC_SIGNS[sun?.sign || 'Aries'].symbol}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400">{sun?.formattedDegree} • Casa {sun?.house}</p>
          </div>
        </div>

        {/* Moon */}
        <div className="bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-violet-500/30 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 flex-shrink-0">
            <Moon className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-violet-400/80">
              Signo Lunar
            </span>
            <h3 className="font-serif-mystic text-sm sm:text-base font-bold text-slate-100">
              {moon?.sign} {ZODIAC_SIGNS[moon?.sign || 'Tauro'].symbol}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400">{moon?.formattedDegree} • Casa {moon?.house}</p>
          </div>
        </div>

        {/* Ascendant */}
        <div className="bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 border border-sky-500/30 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 flex-shrink-0">
            <Compass className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-sky-400/80">
              Ascendente (ASC)
            </span>
            <h3 className="font-serif-mystic text-sm sm:text-base font-bold text-slate-100">
              {asc.sign} {ZODIAC_SIGNS[asc.sign].symbol}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-slate-400">{asc.formattedDegree} • Casa 1</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Touch friendly horizontal scroll) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-lg mx-auto shadow-inner overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('wheel')}
          className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
            activeSection === 'wheel'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Rueda Natal
        </button>
        <button
          onClick={() => setActiveSection('planets')}
          className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
            activeSection === 'planets'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Planetas ({chartData.planets.length})
        </button>
        <button
          onClick={() => setActiveSection('houses')}
          className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
            activeSection === 'houses'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          12 Casas
        </button>
        <button
          onClick={() => setActiveSection('aspects')}
          className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
            activeSection === 'aspects'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Aspectos
        </button>
      </div>

      {/* SECTION 1: VISUAL NATAL WHEEL (Optimized responsive diameter) */}
      {activeSection === 'wheel' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col items-center">
          <div className="relative w-full max-w-[290px] xs:max-w-[320px] sm:max-w-[350px] aspect-square mx-auto">
            <svg viewBox="0 0 350 350" className="w-full h-full select-none">
              <defs>
                <radialGradient id="wheelCenterGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#090d16" stopOpacity="0.95" />
                </radialGradient>
              </defs>

              {/* Outer boundary circles */}
              <circle cx={center} cy={center} r={wheelRadius} fill="url(#wheelCenterGrad)" stroke="#334155" strokeWidth="1.5" />
              <circle cx={center} cy={center} r={wheelRadius - 25} fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 3" />
              <circle cx={center} cy={center} r={wheelRadius - 60} fill="none" stroke="#334155" strokeWidth="1" />
              <circle cx={center} cy={center} r={35} fill="#0b0f19" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />

              {/* 12 House Cusps Lines */}
              {chartData.houses.map((house) => {
                const p1 = getCoordinates(house.cuspLongitude, wheelRadius - 25);
                const p2 = getCoordinates(house.cuspLongitude, 35);
                const isAxis = house.number === 1 || house.number === 7 || house.number === 4 || house.number === 10;
                return (
                  <g key={`cusp-${house.number}`}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isAxis ? '#fbbf24' : '#334155'}
                      strokeWidth={isAxis ? 1.8 : 0.8}
                      opacity={isAxis ? 0.9 : 0.6}
                    />
                  </g>
                );
              })}

              {/* Aspect lines connecting planets in center */}
              {chartData.aspects.slice(0, 12).map((aspect, idx) => {
                const p1Pos = chartData.planets.find((p) => p.name === aspect.planet1) || chartData.ascendant;
                const p2Pos = chartData.planets.find((p) => p.name === aspect.planet2) || chartData.midheaven;
                const pt1 = getCoordinates(p1Pos.longitude, wheelRadius - 65);
                const pt2 = getCoordinates(p2Pos.longitude, wheelRadius - 65);

                const color =
                  aspect.nature === 'armonioso'
                    ? '#38bdf8'
                    : aspect.nature === 'dinamico'
                    ? '#f43f5e'
                    : '#fbbf24';

                return (
                  <line
                    key={`aspect-line-${idx}`}
                    x1={pt1.x}
                    y1={pt1.y}
                    x2={pt2.x}
                    y2={pt2.y}
                    stroke={color}
                    strokeWidth="0.8"
                    opacity="0.35"
                  />
                );
              })}

              {/* Zodiac Signs in outer ring */}
              {chartData.houses.map((house, idx) => {
                const midAngle = house.cuspLongitude + 15;
                const coord = getCoordinates(midAngle, wheelRadius - 13);
                const signInfo = ZODIAC_SIGNS[house.sign];
                return (
                  <text
                    key={`zodiac-sym-${idx}`}
                    x={coord.x}
                    y={coord.y}
                    fontSize="13"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fbbf24"
                    className="font-bold opacity-80"
                  >
                    {signInfo.symbol}
                  </text>
                );
              })}

              {/* Planet markers plotted at their exact longitudes */}
              {chartData.planets.map((planet) => {
                const coord = getCoordinates(planet.longitude, wheelRadius - 42);
                return (
                  <g key={`planet-plot-${planet.name}`}>
                    <circle cx={coord.x} cy={coord.y} r="8.5" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.2" />
                    <text
                      x={coord.x}
                      y={coord.y}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#e2e8f0"
                    >
                      {planet.name[0]}
                    </text>
                  </g>
                );
              })}

              {/* Ascendant marker on left */}
              <text x="20" y={center} fill="#fbbf24" fontSize="11" fontWeight="bold" dominantBaseline="central">
                ASC
              </text>
              {/* Midheaven marker on top */}
              <text x={center} y="22" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                MC
              </text>
            </svg>
          </div>

          {/* Elemental & Modality Breakdown (Mobile friendly 2x2 grid) */}
          <div className="w-full mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase text-amber-400 font-mono">Elemento</span>
              <p className="font-bold text-slate-100 mt-0.5">{chartData.dominantElement.element}</p>
              <p className="text-[10px] text-slate-400">{chartData.dominantElement.percentage}%</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase text-violet-400 font-mono">Modalidad</span>
              <p className="font-bold text-slate-100 mt-0.5">{chartData.dominantModality.modality}</p>
              <p className="text-[10px] text-slate-400">{chartData.dominantModality.percentage}%</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase text-emerald-400 font-mono">Casas Vacías</span>
              <p className="font-bold text-slate-100 mt-0.5">{emptyHousesCount} de 12</p>
              <p className="text-[10px] text-slate-400">Flujo sereno</p>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] uppercase text-sky-400 font-mono">Aspectos</span>
              <p className="font-bold text-slate-100 mt-0.5">{chartData.aspects.length} activos</p>
              <p className="text-[10px] text-slate-400">Con orbe</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PLANETARY POSITIONS */}
      {activeSection === 'planets' && (
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {chartData.planets.map((planet) => {
              const signData = ZODIAC_SIGNS[planet.sign];
              return (
                <div
                  key={planet.name}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 transition shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm flex-shrink-0">
                        {planet.name === 'Sol' ? '☉' : planet.name === 'Luna' ? '☽' : signData.symbol}
                      </div>
                      <div>
                        <h4 className="font-serif-mystic text-xs sm:text-sm font-bold text-slate-100">
                          {planet.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-amber-400 font-mono">
                          {planet.sign} {signData.symbol} • {planet.formattedDegree}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                      Casa {planet.house}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
                    {planet.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: 12 HOUSES & REGLA DE CASAS VACÍAS */}
      {activeSection === 'houses' && (
        <div className="space-y-3.5">
          {/* Reassuring Banner for Empty Houses */}
          <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif-mystic text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Regla de Casas Vacías de CelestiaDeck
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed">
                Tener casas sin planetas es <strong>totalmente normal y positivo</strong>: esa área fluye sin tensiones activas. Se interpreta a través del <strong>planeta regente</strong> del signo en su cúspide.
              </p>
            </div>
          </div>

          {/* Filter buttons (Horizontal scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedHouseFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                selectedHouseFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Todas (12)
            </button>
            <button
              onClick={() => setSelectedHouseFilter('empty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                selectedHouseFilter === 'empty'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Casas Vacías ({emptyHousesCount})
            </button>
            <button
              onClick={() => setSelectedHouseFilter('occupied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                selectedHouseFilter === 'occupied'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Casas con Planetas ({12 - emptyHousesCount})
            </button>
          </div>

          {/* Houses list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {filteredHouses.map((house) => (
              <div
                key={house.number}
                className={`rounded-2xl p-3.5 border transition-all ${
                  house.isEmpty
                    ? 'bg-slate-900/60 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif-mystic text-xs sm:text-sm font-bold text-slate-100">
                        Casa {house.number}
                      </span>
                      {house.isEmpty ? (
                        <span className="text-[9px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                          Vacía • Flujo Sereno
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                          {house.planetsInHouse.length} Planeta(s)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-amber-400 font-mono mt-0.5">
                      Cúspide en {house.sign} ({house.formattedDegree}) • Regente: {house.rulerPlanet}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                  <strong>Ámbito:</strong> {house.lifeArea}
                </p>

                {/* If occupied, list planets */}
                {!house.isEmpty && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                    {house.planetsInHouse.map((p) => (
                      <span
                        key={p.name}
                        className="text-[10px] bg-slate-950 border border-slate-800 text-slate-200 px-2 py-0.5 rounded-md"
                      >
                        {p.name} en {p.sign}
                      </span>
                    ))}
                  </div>
                )}

                {/* Empty house reassuring explanation */}
                {house.isEmpty && house.emptyHouseExplanation && (
                  <div className="mt-2 pt-2 border-t border-emerald-900/30 text-[10px] sm:text-[11px] text-emerald-200/90 leading-relaxed bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10">
                    <p>{house.emptyHouseExplanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ASPECT MATRIX */}
      {activeSection === 'aspects' && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif-mystic text-xs sm:text-sm font-bold text-slate-200">
                Matriz de Aspectos
              </h3>
              <p className="text-[11px] text-slate-400">
                Diálogos geométricos con orbe de tolerancia.
              </p>
            </div>

            {/* Filter by aspect type */}
            <select
              value={selectedAspectFilter}
              onChange={(e) => setSelectedAspectFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos los aspectos</option>
              <option value="Conjunción">Conjunciones (0°)</option>
              <option value="Trígono">Trígonos (120°)</option>
              <option value="Sextil">Sextiles (60°)</option>
              <option value="Cuadratura">Cuadraturas (90°)</option>
              <option value="Oposición">Oposiciones (180°)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {filteredAspects.map((aspect, i) => {
              const badgeColor =
                aspect.nature === 'armonioso'
                  ? 'bg-sky-950/60 text-sky-300 border-sky-500/30'
                  : aspect.nature === 'dinamico'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                  : 'bg-amber-950/60 text-amber-300 border-amber-500/30';

              return (
                <div
                  key={i}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 transition shadow-md"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif-mystic text-xs font-bold text-slate-100">
                      {aspect.planet1} ⟷ {aspect.planet2}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {aspect.type} ({aspect.orb}°)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {aspect.interpretation}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] sm:text-[11px] text-amber-200/90 italic">
                    <strong>Consejo:</strong> {aspect.constructiveAdvice}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
