export type Language = 'en' | 'id';

export type CategoryId =
  | 'alphabet'
  | 'math'
  | 'shapes'
  | 'animals'
  | 'logic'
  | 'creativity';

export type GameId =
  // A: Alphabet & Literacy
  | 'match-letters'
  | 'find-letter'
  | 'letter-picture'
  | 'trace-letter'
  | 'upper-lower'
  // B: Numbers & Math
  | 'count-objects'
  | 'number-matching'
  | 'little-addition'
  | 'missing-number'
  | 'more-less'
  // C: Shapes & Colors
  | 'shape-sorting'
  | 'color-matching'
  | 'find-shape'
  | 'big-small'
  | 'color-pattern'
  // D: Animals & Nature
  | 'animal-sounds'
  | 'shadow-matching'
  | 'animal-matching'
  | 'animal-habitats'
  | 'ocean-animals'
  // E: Logic & Thinking
  | 'memory-cards'
  | 'odd-one-out'
  | 'picture-puzzle'
  | 'complete-pattern'
  | 'find-difference'
  // F: Creativity & Daily Life
  | 'coloring-fun'
  | 'cut-and-paste'
  | 'simple-maze'
  | 'healthy-food'
  | 'emotion-matching';

export type PageRoute =
  | { type: 'home' }
  | { type: 'category'; categoryId: CategoryId }
  | { type: 'game'; gameId: GameId }
  | { type: 'rewards' }
  | { type: 'parents' }
  | { type: 'settings' };

export interface BilingualText {
  en: string;
  id: string;
}

export interface CategoryMeta {
  id: CategoryId;
  title: BilingualText;
  subtitle: BilingualText;
  bgHex: string;
  accentHex: string;
  borderHex: string;
  iconName: string;
}

export interface GameMeta {
  id: GameId;
  categoryId: CategoryId;
  number: number;
  title: BilingualText;
  shortDesc: BilingualText;
  instruction: BilingualText;
  recommendedAges: (3 | 4 | 5)[];
  accentHex: string;
}

export interface GameHistoryEntry {
  id: string;
  gameId: GameId;
  categoryId: CategoryId;
  starsEarned: number;
  completedAt: string;
}

export interface AppSettings {
  language: Language;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  volume: number; // 0 to 1
  childAge: 3 | 4 | 5;
}

export interface ProgressState {
  totalStars: number;
  starsByGame: Partial<Record<GameId, number>>;
  playCountByGame: Partial<Record<GameId, number>>;
  history: GameHistoryEntry[];
  unlockedCharacters: string[];
  selectedBuddyId: string;
  settings: AppSettings;
}

export interface CharacterUnlockItem {
  id: string;
  name: BilingualText;
  role: BilingualText;
  starsRequired: number;
  imageUrl?: string;
  svgType: 'bunny' | 'bear' | 'owl' | 'duck' | 'fox' | 'panda' | 'elephant' | 'koala';
  bgHex: string;
}

export interface AchievementBadge {
  id: string;
  title: BilingualText;
  description: BilingualText;
  icon: string;
  bgHex: string;
  checkUnlocked: (progress: ProgressState) => boolean;
}

export interface GameComponentProps {
  language: Language;
  round: number; // 1, 2, 3
  onRoundComplete: () => void;
  onFeedback: (type: 'positive' | 'hint', customMsg?: BilingualText) => void;
  speak: (text: string) => void;
}
