import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  Palette,
  PawPrint,
  Play,
  Puzzle,
  Shapes,
  Star,
  Award,
} from 'lucide-react';
import { CategoryId, Language, PageRoute, ProgressState } from '../types';
import { CATEGORIES, GAMES_REGISTRY, UNLOCKABLE_CHARACTERS } from '../data/gamesRegistry';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';
import { BuddyAvatar } from '../components/CuteIllustrations';
import { PWAInstallButton } from '../components/PWAComponents';

interface HomePageProps {
  language: Language;
  progress: ProgressState;
  onNavigate: (route: PageRoute) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-7 w-7 text-slate-900" />,
  Calculator: <Calculator className="h-7 w-7 text-slate-900" />,
  Shapes: <Shapes className="h-7 w-7 text-slate-900" />,
  PawPrint: <PawPrint className="h-7 w-7 text-slate-900" />,
  Puzzle: <Puzzle className="h-7 w-7 text-slate-900" />,
  Palette: <Palette className="h-7 w-7 text-slate-900" />,
};

export const HomePage: React.FC<HomePageProps> = ({
  language,
  progress,
  onNavigate,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const activeBuddy =
    UNLOCKABLE_CHARACTERS.find((c) => c.id === progress.selectedBuddyId) ||
    UNLOCKABLE_CHARACTERS[0];

  const getCategoryStats = (catId: CategoryId) => {
    const games = GAMES_REGISTRY.filter((g) => g.categoryId === catId);
    const completed = games.filter((g) => (progress.starsByGame[g.id] ?? 0) > 0).length;
    return { total: games.length, completed };
  };

  return (
    <div className="space-y-10">
      {/* Hero Section: Two-column balanced split */}
      <section className="rounded-[2.25rem] bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Copy Column */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="animate-gentle-wave">
                  <BuddyAvatar buddyId={activeBuddy.id} size={56} />
                </div>
                <div className="text-sm text-slate-600">
                  <p className="font-bold text-slate-900">
                    {t(activeBuddy.name, language)}
                  </p>
                  <p>{t(UI_TEXT.home.buddyGreeting, language)}</p>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-slate-900 leading-[1.15] text-balance">
                {t(UI_TEXT.home.heroTitle, language)}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {t(UI_TEXT.home.heroDesc, language)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    audioManager.playTap();
                    onNavigate({ type: 'category', categoryId: 'alphabet' });
                  }}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-[#A8E6CF] hover:bg-[#91dec0] px-7 py-3.5 font-display text-lg font-extrabold text-slate-900 shadow-xs transition-transform hover:scale-[1.02] cursor-pointer whitespace-nowrap shrink-0 min-h-[48px]"
                >
                  <Play className="h-5 w-5 fill-slate-900" />
                  <span>{t(UI_TEXT.home.startPlaying, language)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    audioManager.playTap();
                    onNavigate({ type: 'rewards' });
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FFF1A8] hover:bg-[#fde77c] px-6 py-3.5 font-display text-base font-bold text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[48px]"
                >
                  <Award className="h-5 w-5" />
                  <span>{t(UI_TEXT.home.viewRewards, language)}</span>
                </button>

                <PWAInstallButton language={language} />
              </div>

              {/* Clean unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
                <span>{t(UI_TEXT.brand.tagline, language)}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {t(UI_TEXT.home.ageModeLabel, language)}: {progress.settings.childAge}{' '}
                  {t(UI_TEXT.home.yearsOld, language)}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-semibold text-slate-700">
                  {progress.totalStars} {t(UI_TEXT.rewards.totalStars, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-6 bg-[#A8D8F0]/25 relative min-h-[260px] lg:min-h-[380px]">
            {!heroImgFailed ? (
              <img
                src="/src/assets/images/littleplay_hero_meadow_1795113929996.jpg"
                alt="LittlePlay animal friends playing with alphabet blocks and pastel shapes"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#A8E6CF]/40 via-[#FFF1A8]/40 to-[#A8D8F0]/40 text-center">
                <BuddyAvatar buddyId={activeBuddy.id} size={136} />
                <p className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                  LittlePlay
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Six Learning Worlds Grid */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t(UI_TEXT.home.categoriesHeading, language)}
            </h2>
            <p className="text-slate-600 text-base mt-1">
              {t(UI_TEXT.home.categoriesSub, language)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const { total, completed } = getCategoryStats(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audioManager.playTap();
                  onNavigate({ type: 'category', categoryId: cat.id });
                }}
                style={{ backgroundColor: cat.bgHex }}
                className="group text-left rounded-[2rem] p-6 border-2 border-white shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[195px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white/85 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {CATEGORY_ICONS[cat.iconName]}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-800 tabular-nums">
                    <Star className="h-4 w-4 text-amber-600 fill-amber-400" />
                    {completed}/{total}
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
                    {t(cat.title, language)}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-800/85">
                    {t(cat.subtitle, language)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900/10 flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{t(UI_TEXT.home.gamesCount, language)}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
