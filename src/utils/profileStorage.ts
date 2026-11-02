import { UserProfile } from '../types';

const PROFILES_KEY = 'celestiadeck_profiles';
const ACTIVE_PROFILE_KEY = 'celestiadeck_active_profile_id';

export function getProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Error loading profiles from localStorage', e);
    return [];
  }
}

export function saveProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles', e);
  }
}

export function getActiveProfile(): UserProfile | null {
  const profiles = getProfiles();
  if (profiles.length === 0) return null;

  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (activeId) {
    const found = profiles.find((p) => p.id === activeId);
    if (found) return found;
  }
  return profiles[0] || null;
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function saveOrUpdateProfile(profile: UserProfile): UserProfile[] {
  const profiles = getProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  saveProfiles(profiles);
  setActiveProfileId(profile.id);
  return profiles;
}

export function deleteProfile(id: string): UserProfile[] {
  let profiles = getProfiles();
  profiles = profiles.filter((p) => p.id !== id);
  saveProfiles(profiles);

  const activeId = localStorage.getItem(ACTIVE_PROFILE_KEY);
  if (activeId === id) {
    if (profiles.length > 0) {
      setActiveProfileId(profiles[0].id);
    } else {
      localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  }
  return profiles;
}
