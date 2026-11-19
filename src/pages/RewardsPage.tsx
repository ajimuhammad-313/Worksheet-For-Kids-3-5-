import React from 'react';
import { Award, Check, Compass, Lock, Sparkles, Star, Trophy, BookOpen, Calculator, PawPrint } from 'lucide-react';
import { Language, ProgressState } from '../types';
import { ACHIEVEMENTS, GAMES_REGISTRY, UNLOCKABLE_CHARACTERS } from '../data/gamesRegistry';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';
import { BuddyAvatar } from '../components/CuteIllustrations';

interface RewardsPageProps {
  language: Language;
  progress: ProgressState;
  onSelectBuddy: (buddyId: string) => void;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Star: <Star className="h-6 w-6 text-slate-900" />,
  Compass: <Compass className="h-6 w-6 text-slate-900" />,
  Sparkles: <Sparkles className="h-6 w-6 text-slate-900" />,
  BookOpen: <BookOpen className="h-6 w-6 text-slate-900" />,
  Calculator: <Calculator className="h-6 w-6 text-slate-900" />,
  PawPrint: <PawPrint className="h-6 w-6 text-slate-900" />,
  Award: <Award className="h-6 w-6 text-slate-900" />,
  Trophy: <Trophy className="h-6 w-6 text-slate-900" />,
};

export const RewardsPage: React.FC<RewardsPageProps> = ({
  language,
  progress,
  onSelectBuddy,
}) => {
  const completedCount = Object.keys(progress.starsByGame).length;
  const unlockedBadgesCount = ACHIEVEMENTS.filter((a) => a.checkUnlocked(progress)).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-[2rem] bg-[#FFF1A8]/70 border-2 border-white p-6 sm:p-8 shadow-sm">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t(UI_TEXT.rewards.title, language)}
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-700">
          {t(UI_TEXT.rewards.subtitle, language)}
        </p>

        {/* Summary KPI Strip */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl bg-white p-5 border border-amber-200/70">
            <p className="text-sm font-semibold text-slate-600">
              {t(UI_TEXT.rewards.totalStars, language)}
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
              {progress.totalStars} ★
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 border border-amber-200/70">
            <p className="text-sm font-semibold text-slate-600">
              {t(UI_TEXT.rewards.gamesCompleted, language)}
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
              {completedCount} / {GAMES_REGISTRY.length}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 border border-amber-200/70">
            <p className="text-sm font-semibold text-slate-600">
              {t(UI_TEXT.rewards.badgesUnlocked, language)}
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
              {unlockedBadgesCount} / {ACHIEVEMENTS.length}
            </p>
          </div>
        </div>
      </section>

      {/* Unlockable Animal Characters */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t(UI_TEXT.rewards.friendsSection, language)}
          </h2>
          <p className="mt-1 text-slate-600">
            {t(UI_TEXT.rewards.friendsDesc, language)}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {UNLOCKABLE_CHARACTERS.map((char) => {
            const isUnlocked =
              progress.totalStars >= char.starsRequired ||
              progress.unlockedCharacters.includes(char.id);
            const isSelected = progress.selectedBuddyId === char.id;

            return (
              <div
                key={char.id}
                className={`rounded-[2rem] p-5 border-2 flex flex-col items-center text-center justify-between gap-3 transition-shadow ${
                  isSelected
                    ? 'bg-[#A8E6CF]/45 border-emerald-400 shadow-md'
                    : isUnlocked
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200/70 opacity-75'
                }`}
              >
                <div className="relative">
                  <BuddyAvatar
                    buddyId={char.id}
                    size={86}
                    className={!isUnlocked ? 'grayscale opacity-60' : ''}
                  />
                  {!isUnlocked && (
                    <span className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-slate-700 text-white flex items-center justify-center border-2 border-white">
                      <Lock className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {t(char.name, language)}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {t(char.role, language)}
                  </p>
                </div>

                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      audioManager.playCorrect();
                      onSelectBuddy(char.id);
                    }}
                    className={`w-full rounded-2xl py-2.5 px-3 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#A8D8F0] hover:bg-[#91cce9] text-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    <span>
                      {isSelected
                        ? t(UI_TEXT.rewards.selectedBuddy, language)
                        : t(UI_TEXT.rewards.selectBuddy, language)}
                    </span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-600 tabular-nums">
                    {t(UI_TEXT.rewards.needStars, language).replace(
                      '{n}',
                      String(char.starsRequired)
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Achievement Badges */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t(UI_TEXT.rewards.badgesSection, language)}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((badge) => {
            const unlocked = badge.checkUnlocked(progress);
            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-5 border flex flex-col justify-between gap-4 ${
                  unlocked
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200/70 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    style={{ backgroundColor: unlocked ? badge.bgHex : '#E2E8F0' }}
                    className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                  >
                    {BADGE_ICONS[badge.icon]}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      unlocked ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {unlocked
                      ? t(UI_TEXT.rewards.unlocked, language)
                      : t(UI_TEXT.rewards.keepPlaying, language)}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {t(badge.title, language)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {t(badge.description, language)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
