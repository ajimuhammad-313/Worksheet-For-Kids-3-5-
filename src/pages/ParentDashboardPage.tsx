import React, { useMemo, useState } from 'react';
import { Lock, Play, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { Language, PageRoute, ProgressState } from '../types';
import { CATEGORIES, GAMES_REGISTRY } from '../data/gamesRegistry';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';

interface ParentDashboardPageProps {
  language: Language;
  progress: ProgressState;
  onChangeLanguage: (lang: Language) => void;
  onChangeAge: (age: 3 | 4 | 5) => void;
  onResetProgress: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const ParentDashboardPage: React.FC<ParentDashboardPageProps> = ({
  language,
  progress,
  onChangeLanguage,
  onChangeAge,
  onResetProgress,
  onNavigate,
}) => {
  const challenge = useMemo(() => {
    const a = Math.floor(Math.random() * 5) + 5; // 5..9
    const b = Math.floor(Math.random() * 5) + 4; // 4..8
    return { a, b, answer: a + b };
  }, []);

  const [unlocked, setUnlocked] = useState(false);
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(gateInput.trim()) === challenge.answer) {
      audioManager.playCorrect();
      setUnlocked(true);
      setGateError(false);
    } else {
      audioManager.playHint();
      setGateError(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto my-8 rounded-[2rem] bg-white p-8 border border-slate-200 shadow-sm text-center space-y-5">
        <div className="h-16 w-16 rounded-3xl bg-[#D7C4F5] mx-auto flex items-center justify-center">
          <Lock className="h-8 w-8 text-slate-900" />
        </div>

        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            {t(UI_TEXT.parents.gateTitle, language)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {t(UI_TEXT.parents.gateDesc, language)}
          </p>
        </div>

        <form onSubmit={handleGateSubmit} className="space-y-4">
          <div className="rounded-2xl bg-[#FFFDF7] border border-slate-200 py-4 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {challenge.a} + {challenge.b} = ?
          </div>

          <input
            type="number"
            inputMode="numeric"
            value={gateInput}
            onChange={(e) => {
              setGateInput(e.target.value);
              setGateError(false);
            }}
            placeholder={t(UI_TEXT.parents.gatePlaceholder, language)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-center text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            autoFocus
          />

          {gateError && (
            <p className="text-sm font-semibold text-rose-600">
              {t(UI_TEXT.parents.gateError, language)}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-[#A8E6CF] hover:bg-[#90dec0] py-3.5 font-display text-base font-extrabold text-slate-900 transition-colors cursor-pointer"
          >
            {t(UI_TEXT.parents.gateSubmit, language)}
          </button>
        </form>
      </div>
    );
  }

  const completedGamesCount = Object.keys(progress.starsByGame).length;
  const exploredCategoriesCount = CATEGORIES.filter((cat) =>
    GAMES_REGISTRY.some(
      (g) => g.categoryId === cat.id && (progress.starsByGame[g.id] ?? 0) > 0
    )
  ).length;
  const totalSessions = Object.values(progress.playCountByGame).reduce(
    (sum, n) => sum + (n ?? 0),
    0
  );

  const recommendedGames = GAMES_REGISTRY.filter((g) =>
    g.recommendedAges.includes(progress.settings.childAge)
  ).slice(0, 6);

  const ageAdvice =
    progress.settings.childAge === 3
      ? UI_TEXT.parents.age3Rec
      : progress.settings.childAge === 4
      ? UI_TEXT.parents.age4Rec
      : UI_TEXT.parents.age5Rec;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t(UI_TEXT.parents.title, language)}
          </h1>
          <p className="mt-1 text-slate-600">{t(UI_TEXT.parents.subtitle, language)}</p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 bg-[#A8E6CF]/50 px-4 py-2.5 rounded-2xl">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{t(UI_TEXT.parents.privacyNote, language)}</span>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {t(UI_TEXT.parents.totalCompleted, language)}
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {completedGamesCount} / 30
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {t(UI_TEXT.parents.totalStars, language)}
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {progress.totalStars} ★
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {t(UI_TEXT.parents.categoriesExplored, language)}
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {exploredCategoriesCount} / 6
          </p>
        </div>
        <div className="rounded-3xl bg-white p-5 border border-slate-200 shadow-xs">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {t(UI_TEXT.parents.totalSessions, language)}
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
            {totalSessions}
          </p>
        </div>
      </div>

      {/* Category Progress + Quick Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            {t(UI_TEXT.parents.categoryProgress, language)}
          </h2>

          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const catGames = GAMES_REGISTRY.filter((g) => g.categoryId === cat.id);
              const done = catGames.filter((g) => (progress.starsByGame[g.id] ?? 0) > 0).length;
              const pct = Math.round((done / catGames.length) * 100);
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                    <span>{t(cat.title, language)}</span>
                    <span className="tabular-nums text-slate-600">
                      {done} / {catGames.length} ({pct}%)
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${pct}%`, backgroundColor: cat.bgHex }}
                      className="h-full rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Language & Age Recommendations */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 border border-slate-200 shadow-xs space-y-5">
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            {t(UI_TEXT.parents.quickSettings, language)}
          </h2>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-600">
              {t(UI_TEXT.settings.languageLabel, language)}
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100">
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                English (US)
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('id')}
                className={`py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                  language === 'id' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Bahasa Indonesia
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-600">
              {t(UI_TEXT.settings.ageLabel, language)}
            </p>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100">
              {([3, 4, 5] as const).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => onChangeAge(age)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer tabular-nums ${
                    progress.settings.childAge === age
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  {age} {t(UI_TEXT.home.yearsOld, language)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#FFFDF7] border border-slate-200 p-4 space-y-1.5">
            <p className="text-xs font-bold text-slate-500">
              {t(UI_TEXT.parents.ageRecommendations, language)}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">{t(ageAdvice, language)}</p>
          </div>
        </div>
      </div>

      {/* Recommended Games for Selected Age */}
      <section className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          {t(UI_TEXT.parents.ageRecommendations, language)} ({progress.settings.childAge}{' '}
          {t(UI_TEXT.home.yearsOld, language)})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recommendedGames.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onNavigate({ type: 'game', gameId: g.id })}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-[#FFFDF7] hover:bg-slate-50 p-3.5 text-left transition-colors cursor-pointer"
            >
              <div>
                <p className="font-display font-bold text-slate-900">{t(g.title, language)}</p>
                <p className="text-xs text-slate-500">{t(g.shortDesc, language)}</p>
              </div>
              <Play className="h-4 w-4 text-slate-700 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Game Completion History */}
      <section className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-display text-xl font-extrabold text-slate-900">
          {t(UI_TEXT.parents.recentHistory, language)}
        </h2>

        {progress.history.length === 0 ? (
          <p className="text-sm text-slate-500 py-4">{t(UI_TEXT.parents.noHistory, language)}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500">
                  <th className="py-2.5 pr-4">{t(UI_TEXT.parents.colGame, language)}</th>
                  <th className="py-2.5 pr-4">{t(UI_TEXT.parents.colCategory, language)}</th>
                  <th className="py-2.5 pr-4">{t(UI_TEXT.parents.colStars, language)}</th>
                  <th className="py-2.5">{t(UI_TEXT.parents.colWhen, language)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progress.history.slice(0, 12).map((entry) => {
                  const gMeta = GAMES_REGISTRY.find((g) => g.id === entry.gameId);
                  const cMeta = CATEGORIES.find((c) => c.id === entry.categoryId);
                  return (
                    <tr key={entry.id} className="text-slate-700">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        {gMeta ? t(gMeta.title, language) : entry.gameId}
                      </td>
                      <td className="py-3 pr-4">
                        {cMeta ? t(cMeta.title, language) : entry.categoryId}
                      </td>
                      <td className="py-3 pr-4 tabular-nums font-bold">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                          {entry.starsEarned}
                        </span>
                      </td>
                      <td className="py-3 tabular-nums text-slate-500">
                        {new Date(entry.completedAt).toLocaleString(
                          language === 'id' ? 'id-ID' : 'en-US',
                          { dateStyle: 'medium', timeStyle: 'short' }
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reset Progress Zone */}
      <section className="rounded-3xl bg-rose-50/70 border border-rose-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            {t(UI_TEXT.parents.resetZoneTitle, language)}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t(UI_TEXT.parents.resetZoneDesc, language)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-white border border-rose-300 hover:bg-rose-100 px-5 py-3 text-sm font-bold text-rose-700 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t(UI_TEXT.parents.resetBtn, language)}</span>
        </button>
      </section>

      {/* In-app Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF7] p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-display text-xl font-extrabold text-slate-900">
              {t(UI_TEXT.parents.resetConfirmTitle, language)}
            </h3>
            <p className="text-sm text-slate-600">
              {t(UI_TEXT.parents.resetConfirmDesc, language)}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t(UI_TEXT.parents.cancel, language)}
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="rounded-2xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-sm font-bold text-white cursor-pointer"
              >
                {t(UI_TEXT.parents.confirmReset, language)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
