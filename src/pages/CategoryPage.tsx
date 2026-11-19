import React from 'react';
import { ArrowLeft, Play, Star } from 'lucide-react';
import { CategoryId, Language, PageRoute, ProgressState } from '../types';
import { CATEGORIES, GAMES_REGISTRY } from '../data/gamesRegistry';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';

interface CategoryPageProps {
  categoryId: CategoryId;
  language: Language;
  progress: ProgressState;
  onNavigate: (route: PageRoute) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  language,
  progress,
  onNavigate,
}) => {
  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const games = GAMES_REGISTRY.filter((g) => g.categoryId === category.id);

  return (
    <div className="space-y-7">
      {/* Category Switcher Strip */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            audioManager.playTap();
            onNavigate({ type: 'home' });
          }}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t(UI_TEXT.category.backHome, language)}</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80">
          {CATEGORIES.map((cat) => {
            const active = cat.id === category.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  audioManager.playTap();
                  onNavigate({ type: 'category', categoryId: cat.id });
                }}
                style={active ? { backgroundColor: cat.bgHex } : undefined}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {t(cat.title, language)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Hero Banner */}
      <div
        style={{ backgroundColor: category.bgHex }}
        className="rounded-[2rem] p-6 sm:p-8 border-2 border-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t(category.title, language)}
          </h1>
          <p className="mt-1.5 text-base sm:text-lg font-medium text-slate-800/90">
            {t(category.subtitle, language)}
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
            {games.filter((g) => (progress.starsByGame[g.id] ?? 0) > 0).length} / {games.length}
          </p>
          <p className="text-sm font-semibold text-slate-800">
            {t(UI_TEXT.category.completed, language)}
          </p>
        </div>
      </div>

      {/* 5 Mini-Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const stars = progress.starsByGame[game.id] ?? 0;
          const isAgeMatch = game.recommendedAges.includes(progress.settings.childAge);

          return (
            <div
              key={game.id}
              className="rounded-[2rem] bg-white p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between gap-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="tabular-nums">
                    {String(game.number).padStart(2, '0')} · {t(UI_TEXT.category.recommendedFor, language)}{' '}
                    {game.recommendedAges.join(', ')}
                    {isAgeMatch ? ' ★' : ''}
                  </span>
                  <div className="flex items-center gap-0.5" aria-label={`${stars} stars`}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= stars
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-xl font-extrabold text-slate-900">
                    {t(game.title, language)}
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    {t(game.shortDesc, language)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  audioManager.playTap();
                  onNavigate({ type: 'game', gameId: game.id });
                }}
                style={{ backgroundColor: category.bgHex }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 font-display text-base font-extrabold text-slate-900 hover:brightness-95 transition-all cursor-pointer min-h-[48px]"
              >
                <Play className="h-4 w-4 fill-slate-900" />
                <span>
                  {stars > 0
                    ? t(UI_TEXT.category.playAgain, language)
                    : t(UI_TEXT.category.playNow, language)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
