import { JournalEntry } from '../types';

const JOURNAL_KEY = 'celestiadeck_journal_entries';

export function getJournalEntries(profileId?: string): JournalEntry[] {
  try {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (!raw) return [];
    const entries: JournalEntry[] = JSON.parse(raw);
    if (!Array.isArray(entries)) return [];
    if (profileId) {
      return entries.filter((e) => e.profileId === profileId);
    }
    return entries.sort((a, b) => b.createdAt - a.createdAt);
  } catch (e) {
    console.error('Error loading journal entries', e);
    return [];
  }
}

export function saveJournalEntry(entry: JournalEntry): JournalEntry[] {
  const current = getJournalEntries();
  // Check if entry with same id already exists
  const existingIdx = current.findIndex((e) => e.id === entry.id);
  if (existingIdx >= 0) {
    current[existingIdx] = entry;
  } else {
    current.unshift(entry);
  }
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving journal entry', e);
  }
  return current;
}

export function updateJournalNotes(
  id: string,
  userNotes: string,
  mood?: JournalEntry['mood']
): JournalEntry[] {
  const current = getJournalEntries();
  const entry = current.find((e) => e.id === id);
  if (entry) {
    entry.userNotes = userNotes;
    if (mood) entry.mood = mood;
    try {
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(current));
    } catch (e) {
      console.error('Error updating journal entry', e);
    }
  }
  return current;
}

export function deleteJournalEntry(id: string): JournalEntry[] {
  let current = getJournalEntries();
  current = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Error deleting journal entry', e);
  }
  return current;
}

export function exportJournalAsJson(): string {
  const entries = getJournalEntries();
  return JSON.stringify(entries, null, 2);
}
