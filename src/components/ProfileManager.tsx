import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Check,
  MapPin,
  Clock,
  Calendar,
  Lock,
  Sparkles,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import {
  getProfiles,
  saveOrUpdateProfile,
  deleteProfile,
  setActiveProfileId
} from '../utils/profileStorage';
import { POPULAR_CITIES } from '../utils/astroEngine';

interface ProfileManagerProps {
  currentProfile: UserProfile | null;
  onProfileChange: (profile: UserProfile | null) => void;
  openCreateOnMount?: boolean;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  currentProfile,
  onProfileChange,
  openCreateOnMount = false
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => getProfiles());
  const [isEditing, setIsEditing] = useState(openCreateOnMount || profiles.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('12:00');
  const [unknownTime, setUnknownTime] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState(POPULAR_CITIES[0].name);
  const [formLat, setFormLat] = useState<number>(POPULAR_CITIES[0].lat);
  const [formLon, setFormLon] = useState<number>(POPULAR_CITIES[0].lon);
  const [formTz, setFormTz] = useState<number>(POPULAR_CITIES[0].tz);
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityName, setCustomCityName] = useState('');
  const [formError, setFormError] = useState('');

  const openNewProfileModal = () => {
    setEditingId(null);
    setFormName('');
    setFormDate('');
    setFormTime('12:00');
    setUnknownTime(false);
    const defaultCity = POPULAR_CITIES[0];
    setSelectedCityName(defaultCity.name);
    setFormLat(defaultCity.lat);
    setFormLon(defaultCity.lon);
    setFormTz(defaultCity.tz);
    setIsCustomCity(false);
    setCustomCityName('');
    setFormError('');
    setIsEditing(true);
  };

  const openEditModal = (p: UserProfile) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormDate(p.birthDate);
    setFormTime(p.birthTime);
    setUnknownTime(p.birthTime === '12:00');
    setSelectedCityName(p.cityName);
    setFormLat(p.latitude);
    setFormLon(p.longitude);
    setFormTz(p.timezoneOffset);
    const inPopular = POPULAR_CITIES.find((c) => c.name === p.cityName);
    if (inPopular) {
      setIsCustomCity(false);
    } else {
      setIsCustomCity(true);
      setCustomCityName(p.cityName);
    }
    setFormError('');
    setIsEditing(true);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCityName(cityName);
    const city = POPULAR_CITIES.find((c) => c.name === cityName);
    if (city) {
      setFormLat(city.lat);
      setFormLon(city.lon);
      setFormTz(city.tz);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          const tzOffsetHours = -Math.round(new Date().getTimezoneOffset() / 60);
          setFormLat(lat);
          setFormLon(lon);
          setFormTz(tzOffsetHours);
          setIsCustomCity(true);
          setCustomCityName('Ubicación actual detectada');
        },
        (err) => {
          alert('No se pudo obtener la ubicación: ' + err.message);
        }
      );
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Por favor ingresa un nombre o alias.');
      return;
    }
    if (!formDate) {
      setFormError('Por favor selecciona tu fecha de nacimiento real.');
      return;
    }

    const cityFinalName = isCustomCity
      ? customCityName.trim() || `Coordenadas (${formLat}, ${formLon})`
      : selectedCityName;

    const updated: UserProfile = {
      id: editingId || `profile-${Date.now()}`,
      name: formName.trim(),
      birthDate: formDate,
      birthTime: unknownTime ? '12:00' : formTime || '12:00',
      cityName: cityFinalName,
      latitude: Number(formLat),
      longitude: Number(formLon),
      timezoneOffset: Number(formTz)
    };

    const newProfiles = saveOrUpdateProfile(updated);
    setProfiles(newProfiles);
    setIsEditing(false);
    onProfileChange(updated);
  };

  const handleSwitchProfile = (p: UserProfile) => {
    setActiveProfileId(p.id);
    onProfileChange(p);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Deseas eliminar este perfil?')) {
      const remaining = deleteProfile(id);
      setProfiles(remaining);
      if (currentProfile?.id === id) {
        onProfileChange(remaining[0] || null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400/80 bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full">
            Almacenamiento 100% Local y Privado
          </span>
          <h2 className="font-serif-mystic text-xl sm:text-2xl font-bold text-slate-100 mt-2">
            Gestión de Perfiles Astrales
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tus datos se guardan exclusivamente en tu dispositivo, sin perfiles simulados.
          </p>
        </div>

        <button
          onClick={openNewProfileModal}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 transition shadow-lg active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Añadir Perfil Real</span>
        </button>
      </div>

      {/* Profiles Cards Grid or Empty State */}
      {profiles.length === 0 ? (
        <div className="bg-slate-900/60 border border-dashed border-amber-500/30 rounded-3xl p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif-mystic text-lg font-bold text-slate-100">
              No hay perfiles configurados
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Crea tu perfil con tus datos de nacimiento para calcular tu Carta Astral con exactitud astronómica y activar tu Tarot Diario determinista.
            </p>
          </div>
          <button
            onClick={openNewProfileModal}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-5 py-2.5 transition shadow-lg inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Configurar Mi Primer Perfil</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {profiles.map((p) => {
            const isActive = currentProfile?.id === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-amber-400/60 shadow-xl ring-1 ring-amber-400/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-serif-mystic text-sm font-bold text-slate-100">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {p.cityName}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] font-mono bg-amber-400/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        Activo
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400/70" />
                      <span>{p.birthDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-violet-400/70" />
                      <span>{p.birthTime} (GMT {p.timezoneOffset >= 0 ? `+${p.timezoneOffset}` : p.timezoneOffset})</span>
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {!isActive ? (
                    <button
                      onClick={() => handleSwitchProfile(p)}
                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 transition py-1"
                    >
                      Activar este perfil
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Perfil en uso
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
                      title="Editar perfil"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                      title="Eliminar perfil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Privacy Guarantee Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Privacidad Absoluta y Local:</strong> Todos los cálculos astronómicos, perfiles y lecturas de tarot se procesan y almacenan de forma exclusiva en el almacenamiento interno de tu navegador (<code className="text-amber-300">localStorage</code>). Ningún dato personal sale de tu dispositivo ni se envía a servidores externos.
        </div>
      </div>

      {/* Profile Form Modal / Drawer */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/30 p-5 sm:p-6 shadow-2xl relative text-slate-200 my-auto">
            <h3 className="font-serif-mystic text-base sm:text-lg font-bold text-amber-300 mb-1">
              {editingId ? 'Editar Perfil Astral' : 'Crear Perfil Astral'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ingresa tus datos reales para calcular la posición exacta de tus planetas y casas.
            </p>

            {formError && (
              <div className="mb-4 bg-rose-950/50 border border-rose-500/30 p-2.5 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nombre o Alias
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (formError) setFormError('');
                  }}
                  placeholder="Tu nombre o alias"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => {
                      setFormDate(e.target.value);
                      if (formError) setFormError('');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Hora Exacta
                  </label>
                  <input
                    type="time"
                    disabled={unknownTime}
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400/50 disabled:opacity-40"
                  />
                </div>
              </div>

              {/* Unknown time checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                />
                <span>Desconozco la hora exacta (se usará 12:00 mediodía)</span>
              </label>

              {/* City Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Ciudad / Coordenadas</label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    Detectar ubicación con GPS
                  </button>
                </div>

                {!isCustomCity ? (
                  <div className="space-y-1.5">
                    <select
                      value={selectedCityName}
                      onChange={(e) => handleCitySelect(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-amber-400/50"
                    >
                      {POPULAR_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} (GMT {c.tz >= 0 ? `+${c.tz}` : c.tz})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(true)}
                      className="text-[10px] text-amber-400 hover:text-amber-300"
                    >
                      + Ingresar ciudad o coordenadas manuales
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="Nombre de la ciudad"
                      value={customCityName}
                      onChange={(e) => setCustomCityName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">Latitud</label>
                        <input
                          type="number"
                          step="any"
                          value={formLat}
                          onChange={(e) => setFormLat(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Longitud</label>
                        <input
                          type="number"
                          step="any"
                          value={formLon}
                          onChange={(e) => setFormLon(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Zona Horaria (UTC)</label>
                        <input
                          type="number"
                          step="1"
                          value={formTz}
                          onChange={(e) => setFormTz(parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-100 text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCustomCity(false)}
                      className="text-[10px] text-slate-400 hover:text-slate-300"
                    >
                      ← Volver a lista de ciudades principales
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                {profiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs transition shadow-lg hover:from-amber-400 hover:to-amber-500 active:scale-95"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
