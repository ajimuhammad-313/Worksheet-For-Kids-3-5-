import { AppSettings, CategoryId, GameId, ProgressState } from '../types';
import { UNLOCKABLE_CHARACTERS } from '../data/gamesRegistry';

const STORAGE_KEY = 'littleplay_progress_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  soundEnabled: true,
  voiceEnabled: true,
  volume: 0.75,
  childAge: 4,
};

export const INITIAL_PROGRESS: ProgressState = {
  totalStars: 0,
  starsByGame: {},
  playCountByGame: {},
  history: [],
  unlockedCharacters: ['bunny'],
  selectedBuddyId: 'bunny',
  settings: DEFAULT_SETTINGS,
};

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      totalStars: typeof parsed.totalStars === 'number' ? parsed.totalStars : 0,
      starsByGame: parsed.starsByGame ?? {},
      playCountByGame: parsed.playCountByGame ?? {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      unlockedCharacters: Array.isArray(parsed.unlockedCharacters) && parsed.unlockedCharacters.length > 0
        ? parsed.unlockedCharacters
        : ['bunny'],
      selectedBuddyId: parsed.selectedBuddyId || 'bunny',
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function recordGameCompletion(
  prev: ProgressState,
  gameId: GameId,
  categoryId: CategoryId,
  starsEarned: number
): ProgressState {
  const nextTotalStars = prev.totalStars + starsEarned;
  const bestForGame = Math.max(prev.starsByGame[gameId] ?? 0, starsEarned);
  const nextPlayCount = (prev.playCountByGame[gameId] ?? 0) + 1;

  const newEntry = {
    id: `${gameId}-${Date.now()}`,
    gameId,
    categoryId,
    starsEarned,
    completedAt: new Date().toISOString(),
  };

  const newlyUnlocked = UNLOCKABLE_CHARACTERS.filter(
    (char) => nextTotalStars >= char.starsRequired
  ).map((c) => c.id);

  const mergedCharacters = Array.from(
    new Set([...prev.unlockedCharacters, ...newlyUnlocked])
  );

  return {
    ...prev,
    totalStars: nextTotalStars,
    starsByGame: {
      ...prev.starsByGame,
      [gameId]: bestForGame,
    },
    playCountByGame: {
      ...prev.playCountByGame,
      [gameId]: nextPlayCount,
    },
    history: [newEntry, ...prev.history].slice(0, 60),
    unlockedCharacters: mergedCharacters,
  };
}
