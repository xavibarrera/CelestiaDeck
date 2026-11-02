import React, { useState, useMemo } from 'react';
import {
  Sun,
  Calendar,
  BookOpen,
  Sparkles,
  Save,
  Trash2,
  Edit3,
  Check,
  Download,
  Smile,
  Search,
  Filter,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UserProfile, DrawnCard, JournalEntry } from '../types';
import { getDailyTarot, getWeeklyTarot, getLocalDateKey, getLocalWeekKey } from '../utils/prng';
import {
  getJournalEntries,
  saveJournalEntry,
  updateJournalNotes,
  deleteJournalEntry,
  exportJournalAsJson
} from '../utils/journalStorage';
import { TarotCardView } from './TarotCardView';

interface TarotDailyProps {
  profile: UserProfile | null;
  onOpenProfileSetup?: () => void;
}

export const TarotDaily: React.FC<TarotDailyProps> = ({ profile, onOpenProfileSetup }) => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'weekly' | 'journal'>('daily');

  // Daily deterministic card
  const todayDateStr = useMemo(() => getLocalDateKey(), []);
  const dailyCard = useMemo(() => {
    if (!profile) return null;
    return getDailyTarot(profile.id, todayDateStr);
  }, [profile, todayDateStr]);

  // Weekly deterministic 3 cards
  const currentWeekStr = useMemo(() => getLocalWeekKey(), []);
  const weeklyCards = useMemo(() => {
    if (!profile) return null;
    return getWeeklyTarot(profile.id, currentWeekStr);
  }, [profile, currentWeekStr]);

  // Mobile weekly card switcher (0, 1, 2)
  const [mobileWeeklyIndex, setMobileWeeklyIndex] = useState(0);

  // Flipped state for weekly cards
  const [weeklyFlipped, setWeeklyFlipped] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true
  });

  // Journal entries state
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    profile ? getJournalEntries(profile.id) : getJournalEntries()
  );
  const [journalSearch, setJournalSearch] = useState('');
  const [journalFilter, setJournalFilter] = useState<'all' | 'daily' | 'weekly' | 'free'>('all');

  // Journal modal / note editing
  const [noteText, setNoteText] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('Inspirado');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Check if today's daily reading is already saved in journal
  const dailyJournalEntry = useMemo(() => {
    if (!profile) return undefined;
    return journalEntries.find(
      (e) => e.date === todayDateStr && e.spreadType === 'daily' && e.profileId === profile.id
    );
  }, [journalEntries, todayDateStr, profile]);

  // Check if current week reading is already saved
  const weeklyJournalEntry = useMemo(() => {
    if (!profile) return undefined;
    return journalEntries.find(
      (e) => e.date === currentWeekStr && e.spreadType === 'weekly' && e.profileId === profile.id
    );
  }, [journalEntries, currentWeekStr, profile]);

  // Save or update Daily to Journal
  const handleSaveDailyToJournal = () => {
    if (!profile || !dailyCard) return;
    const entryId = `daily-${profile.id}-${todayDateStr}`;
    const newEntry: JournalEntry = {
      id: entryId,
      profileId: profile.id,
      date: todayDateStr,
      createdAt: Date.now(),
      spreadType: 'daily',
      title: `Carta del Día: ${dailyCard.card.name}`,
      cards: [dailyCard],
      userNotes: noteText || (dailyJournalEntry ? dailyJournalEntry.userNotes : ''),
      mood: selectedMood
    };
    const updated = saveJournalEntry(newEntry);
    setJournalEntries(updated.filter((e) => e.profileId === profile.id));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  // Save Weekly to Journal
  const handleSaveWeeklyToJournal = () => {
    if (!profile || !weeklyCards) return;
    const entryId = `weekly-${profile.id}-${currentWeekStr}`;
    const newEntry: JournalEntry = {
      id: entryId,
      profileId: profile.id,
      date: currentWeekStr,
      createdAt: Date.now(),
      spreadType: 'weekly',
      title: `Lectura Semanal (${currentWeekStr})`,
      cards: weeklyCards,
      userNotes: noteText || (weeklyJournalEntry ? weeklyJournalEntry.userNotes : ''),
      mood: selectedMood
    };
    const updated = saveJournalEntry(newEntry);
    setJournalEntries(updated.filter((e) => e.profileId === profile.id));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = deleteJournalEntry(id);
    if (profile) {
      setJournalEntries(updated.filter((e) => e.profileId === profile.id));
    } else {
      setJournalEntries(updated);
    }
  };

  const handleExportJournal = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportJournalAsJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `celestiadeck_diario_${profile ? profile.name.toLowerCase().replace(/\s+/g, '_') : 'local'}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredJournal = journalEntries.filter((entry) => {
    const matchesFilter =
      journalFilter === 'all'
        ? true
        : journalFilter === 'free'
        ? entry.spreadType.startsWith('free')
        : entry.spreadType === journalFilter;
    const matchesSearch =
      journalSearch === '' ||
      entry.title.toLowerCase().includes(journalSearch.toLowerCase()) ||
      entry.userNotes.toLowerCase().includes(journalSearch.toLowerCase()) ||
      entry.cards.some((c) => c.card.name.toLowerCase().includes(journalSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const humanDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-3 sm:px-4">
      {/* Sub-tab Navigation (Touch optimized with 44px height) */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-md mx-auto shadow-inner">
        <button
          onClick={() => setActiveSubTab('daily')}
          className={`flex-1 min-h-[42px] py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
            activeSubTab === 'daily'
              ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Diario</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weekly')}
          className={`flex-1 min-h-[42px] py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
            activeSubTab === 'weekly'
              ? 'bg-gradient-to-r from-violet-500/20 to-indigo-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-violet-400" />
          <span>Semanal</span>
        </button>

        <button
          onClick={() => setActiveSubTab('journal')}
          className={`flex-1 min-h-[42px] py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all touch-manipulation ${
            activeSubTab === 'journal'
              ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Mi Diario</span>
        </button>
      </div>

      {/* SUB-TAB 1: TAROT DIARIO (1 CARTA) */}
      {activeSubTab === 'daily' && (
        <>
          {!profile || !dailyCard ? (
            <div className="bg-slate-900/60 border border-dashed border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto my-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Sun className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif-mystic text-lg font-bold text-slate-100">
                  Sincroniza tu Carta del Día
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Para generar tu carta del día determinista (Mulberry32 constante durante 24 horas), configura tu perfil con tu nombre y fecha de nacimiento.
                </p>
              </div>
              {onOpenProfileSetup && (
                <button
                  onClick={onOpenProfileSetup}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-5 py-3 transition shadow-lg inline-flex items-center gap-2 active:scale-95 touch-manipulation"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Configurar Perfil</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center px-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-3 py-0.5 rounded-full">
                  Sintonía Determinista
                </span>
                <h2 className="font-serif-mystic text-lg sm:text-2xl font-bold text-slate-100 mt-1.5 capitalize">
                  {humanDate}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
                  Semilla para <strong className="text-amber-300">{profile.name}</strong>. Invariable durante todo el día.
                </p>
              </div>

              {/* Daily Card Display */}
              <div className="py-1">
                <TarotCardView drawnCard={dailyCard} />
              </div>

              {/* Journal Note Form for Today */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 max-w-md mx-auto shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    Tu Reflexión de Hoy
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Smile className="w-3.5 h-3.5 text-violet-400" />
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value as JournalEntry['mood'])}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tranquilo">Tranquilo 🌿</option>
                      <option value="Curioso">Curioso 🔍</option>
                      <option value="Inspirado">Inspirado ✨</option>
                      <option value="Reflexivo">Reflexivo 🌙</option>
                      <option value="Desafiado">Desafiado ⚡</option>
                      <option value="Agradecido">Agradecido 💖</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="¿Qué resonancia tiene este mensaje con tu día? Escribe aquí tus reflexiones..."
                  defaultValue={dailyJournalEntry?.userNotes || ''}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 resize-none transition"
                />

                <div className="flex items-center justify-between mt-3 gap-2">
                  <span className="text-[10px] text-slate-500 truncate">
                    {dailyJournalEntry ? 'Guardado en diario local' : 'Sin guardar aún'}
                  </span>
                  <button
                    onClick={handleSaveDailyToJournal}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-3.5 py-2.5 transition shadow-md active:scale-95 touch-manipulation flex-shrink-0"
                  >
                    {isSavedNotice ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                        <span>¡Guardado!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar en Diario</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 2: TAROT SEMANAL (3 CARTAS CON MODO MÓVIL SWITCHER) */}
      {activeSubTab === 'weekly' && (
        <>
          {!profile || !weeklyCards ? (
            <div className="bg-slate-900/60 border border-dashed border-violet-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 max-w-lg mx-auto my-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-400">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif-mystic text-lg font-bold text-slate-100">
                  Sincroniza tu Lectura Semanal
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Para calcular las 3 cartas semanales deterministas (Energía, Desafío y Consejo), configura tu perfil de usuario.
                </p>
              </div>
              {onOpenProfileSetup && (
                <button
                  onClick={onOpenProfileSetup}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-5 py-3 transition shadow-lg inline-flex items-center gap-2 active:scale-95 touch-manipulation"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Configurar Perfil</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center px-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-violet-400/90 bg-violet-950/40 border border-violet-500/20 px-3 py-0.5 rounded-full">
                  Semanal ({currentWeekStr})
                </span>
                <h2 className="font-serif-mystic text-lg sm:text-2xl font-bold text-slate-100 mt-1.5">
                  Energía, Desafío y Consejo
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
                  Tríada determinista para <strong className="text-violet-300">{profile.name}</strong>.
                </p>
              </div>

              {/* MOBILE CAROUSEL SELECTOR (Visible on mobile screens) */}
              <div className="block md:hidden">
                <div className="flex items-center justify-between gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-3.5">
                  {weeklyCards.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMobileWeeklyIndex(idx)}
                      className={`flex-1 py-2 px-1 text-[11px] font-semibold rounded-lg transition-all touch-manipulation text-center ${
                        mobileWeeklyIndex === idx
                          ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {idx === 0 ? '1. Energía' : idx === 1 ? '2. Desafío' : '3. Consejo'}
                    </button>
                  ))}
                </div>

                {/* Display active card on mobile */}
                <div className="relative">
                  <TarotCardView
                    drawnCard={weeklyCards[mobileWeeklyIndex]}
                    isFlipped={weeklyFlipped[mobileWeeklyIndex] ?? true}
                    onFlip={() =>
                      setWeeklyFlipped((prev) => ({
                        ...prev,
                        [mobileWeeklyIndex]: !prev[mobileWeeklyIndex]
                      }))
                    }
                    allowManualFlip={true}
                    compact={false}
                  />

                  {/* Quick Previous / Next mobile buttons */}
                  <div className="flex items-center justify-between mt-3 px-2">
                    <button
                      disabled={mobileWeeklyIndex === 0}
                      onClick={() => setMobileWeeklyIndex((i) => Math.max(0, i - 1))}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 py-1 px-2.5 bg-slate-900 rounded-lg border border-slate-800 touch-manipulation"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                    <span className="text-[11px] font-mono text-slate-500">
                      {mobileWeeklyIndex + 1} de 3
                    </span>
                    <button
                      disabled={mobileWeeklyIndex === 2}
                      onClick={() => setMobileWeeklyIndex((i) => Math.min(2, i + 1))}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 py-1 px-2.5 bg-slate-900 rounded-lg border border-slate-800 touch-manipulation"
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* DESKTOP/TABLET GRID VIEW (Hidden on small mobile screens) */}
              <div className="hidden md:grid md:grid-cols-3 gap-6 pt-2">
                {weeklyCards.map((dc, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <TarotCardView
                      drawnCard={dc}
                      isFlipped={weeklyFlipped[idx] ?? true}
                      onFlip={() =>
                        setWeeklyFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      allowManualFlip={true}
                      compact={false}
                    />
                  </div>
                ))}
              </div>

              {/* Weekly Synthesis Card */}
              <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-violet-500/20 rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto shadow-xl">
                <h3 className="font-serif-mystic text-xs sm:text-sm font-bold text-violet-300 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  Síntesis Semanal de Crecimiento
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3.5">
                  Esta semana estás invitado a conectar con la energía de{' '}
                  <strong className="text-amber-300">{weeklyCards[0].card.name}</strong>, atendiendo con paciencia el reto reflexivo de{' '}
                  <strong className="text-rose-300">{weeklyCards[1].card.name}</strong> y apoyándote en el consejo sabio de{' '}
                  <strong className="text-emerald-300">{weeklyCards[2].card.name}</strong>.
                </p>

                {/* Note & Save Weekly */}
                <div className="pt-2.5 border-t border-slate-800">
                  <textarea
                    rows={2}
                    placeholder="Añade una intención personal para tu semana..."
                    defaultValue={weeklyJournalEntry?.userNotes || ''}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-400/50 resize-none transition mb-3"
                  />
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleSaveWeeklyToJournal}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 transition shadow-md active:scale-95 touch-manipulation"
                    >
                      {isSavedNotice ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Guardada en Diario!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Guardar Tirada Semanal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 3: MI DIARIO & HISTORIAL */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="font-serif-mystic text-lg sm:text-xl font-bold text-slate-100">
                Mi Diario Introspectivo
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Historial de lecturas guardadas localmente en este dispositivo.
              </p>
            </div>
            {journalEntries.length > 0 && (
              <button
                onClick={handleExportJournal}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition touch-manipulation"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Copia JSON</span>
              </button>
            )}
          </div>

          {/* Search & Filters (Horizontal scroll on mobile) */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={journalSearch}
                onChange={(e) => setJournalSearch(e.target.value)}
                placeholder="Buscar en el diario..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <button
                onClick={() => setJournalFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  journalFilter === 'all'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Todas ({journalEntries.length})
              </button>
              <button
                onClick={() => setJournalFilter('daily')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  journalFilter === 'daily'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Diarias
              </button>
              <button
                onClick={() => setJournalFilter('weekly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  journalFilter === 'weekly'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Semanales
              </button>
              <button
                onClick={() => setJournalFilter('free')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition touch-manipulation ${
                  journalFilter === 'free'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Tiradas Libres
              </button>
            </div>
          </div>

          {/* Entries List */}
          {filteredJournal.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-5">
              <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-slate-300">No hay entradas registradas</p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Guarda tu carta diaria, la tirada semanal o lecturas libres para consultarlas aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJournal.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 sm:p-4 transition shadow-md"
                >
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-mono uppercase bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full border border-slate-700">
                          {entry.spreadType === 'daily'
                            ? 'Diaria'
                            : entry.spreadType === 'weekly'
                            ? 'Semanal'
                            : 'Tirada Libre'}
                        </span>
                        {entry.mood && (
                          <span className="text-[10px] text-slate-400 font-sans">
                            {entry.mood}
                          </span>
                        )}
                        <span className="text-[9px] text-slate-500 font-mono">
                          {new Date(entry.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>
                      <h4 className="font-serif-mystic text-xs sm:text-sm font-bold text-slate-100 mt-1">
                        {entry.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition touch-manipulation"
                      title="Eliminar de mi diario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cards involved in this entry */}
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {entry.cards.map((dc, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg"
                      >
                        <span className="text-amber-400 font-serif-mystic font-semibold">
                          {dc.card.romanNumeral || `#${dc.card.number}`}
                        </span>
                        <span className="truncate max-w-[120px]">{dc.card.name}</span>
                        {dc.isReversed && (
                          <span className="text-[8px] text-violet-400 font-mono">(Inv)</span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* User personal note */}
                  {entry.userNotes && (
                    <div className="mt-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-300 leading-relaxed font-sans">
                      <p className="italic text-slate-300">"{entry.userNotes}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
