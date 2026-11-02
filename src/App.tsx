/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sun,
  Layers,
  Compass,
  Users,
  BookOpen,
  Sparkles,
  ChevronDown,
  Moon,
  UserPlus
} from 'lucide-react';
import { UserProfile } from './types';
import { getActiveProfile, getProfiles } from './utils/profileStorage';
import { TarotDaily } from './components/TarotDaily';
import { TarotSpread } from './components/TarotSpread';
import { NatalChart } from './components/NatalChart';
import { ProfileManager } from './components/ProfileManager';
import { GrimoireModal } from './components/GrimoireModal';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';

type MainTab = 'daily' | 'spreads' | 'natal' | 'profiles';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('daily');
  const [profile, setProfile] = useState<UserProfile | null>(() => getActiveProfile());
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>(() => getProfiles());
  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Sync profile changes
  const handleProfileChange = (updated: UserProfile | null) => {
    setProfile(updated);
    setAllProfiles(getProfiles());
  };

  const handleOpenProfileSetup = () => {
    setActiveTab('profiles');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans antialiased overflow-x-hidden">
      {/* Offline Banner Indicator */}
      <OfflineIndicator />

      {/* Top Application Header (Safe-area aware for mobile notch/Dynamic Island) */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 pt-safe pb-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('daily')}
            className="flex items-center gap-2 cursor-pointer select-none group touch-manipulation flex-shrink-0"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-amber-400/50 flex items-center justify-center shadow-lg group-hover:border-amber-400 transition">
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
            </div>
            <div>
              <h1 className="font-serif-mystic text-sm sm:text-base font-bold tracking-wider text-slate-100 group-hover:text-amber-300 transition">
                Celestia<span className="text-amber-400">Deck</span>
              </h1>
            </div>
          </div>

          {/* Quick Header Actions: Profile Pill, Grimoire & PWA Install */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Profile Selector Pill or Create CTA */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition shadow-sm touch-manipulation"
                >
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[70px] xs:max-w-[100px] sm:max-w-[120px] truncate font-medium">
                    {profile.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-slate-500">
                      Perfiles Locales
                    </div>
                    {allProfiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleProfileChange(p);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition touch-manipulation ${
                          p.id === profile.id
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{p.name}</span>
                        {p.id === profile.id && <Sparkles className="w-3 h-3 text-amber-400" />}
                      </button>
                    ))}
                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setActiveTab('profiles');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-amber-400 hover:bg-slate-800 transition font-medium touch-manipulation"
                      >
                        + Gestionar perfiles...
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleOpenProfileSetup}
                className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-400/40 px-2.5 py-1 text-xs text-amber-300 hover:bg-amber-400/20 transition shadow-sm font-medium touch-manipulation"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold">Crear Perfil</span>
              </button>
            )}

            {/* Grimoire Encyclopedia Modal Button */}
            <button
              onClick={() => setIsGrimoireOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium transition flex items-center gap-1.5 touch-manipulation"
              title="Enciclopedia de 78 Arcanos"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Grimorio (78)</span>
            </button>

            {/* PWA Install Button (discreet / floating) */}
            <PWAInstallPrompt />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-3 pb-24 sm:pb-20">
        {activeTab === 'daily' && (
          <TarotDaily
            profile={profile}
            onOpenProfileSetup={handleOpenProfileSetup}
          />
        )}
        {activeTab === 'spreads' && <TarotSpread profile={profile} />}
        {activeTab === 'natal' && (
          <NatalChart
            profile={profile}
            onOpenProfileSetup={handleOpenProfileSetup}
          />
        )}
        {activeTab === 'profiles' && (
          <ProfileManager
            currentProfile={profile}
            onProfileChange={handleProfileChange}
          />
        )}
      </main>

      {/* Grimoire Modal */}
      <GrimoireModal
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
      />

      {/* Bottom Sticky Mobile Navigation Bar (With iOS safe-area-inset-bottom support) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pt-1 pb-safe">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* Tab 1: Diario */}
          <button
            onClick={() => setActiveTab('daily')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation active:scale-95 ${
              activeTab === 'daily'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Diario</span>
          </button>

          {/* Tab 2: Tiradas Libres */}
          <button
            onClick={() => setActiveTab('spreads')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation active:scale-95 ${
              activeTab === 'spreads'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Tiradas</span>
          </button>

          {/* Tab 3: Carta Astral */}
          <button
            onClick={() => setActiveTab('natal')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation active:scale-95 ${
              activeTab === 'natal'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Carta Astral</span>
          </button>

          {/* Tab 4: Perfiles */}
          <button
            onClick={() => setActiveTab('profiles')}
            className={`min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all touch-manipulation active:scale-95 ${
              activeTab === 'profiles'
                ? 'text-amber-400 bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Perfiles</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
