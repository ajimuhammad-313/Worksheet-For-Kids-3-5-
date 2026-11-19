import React from 'react';
import { Globe, MessageSquare, Smartphone, Volume2 } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';
import { PWAInstallButton } from '../components/PWAComponents';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const lang: Language = settings.language;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          {t(UI_TEXT.settings.title, lang)}
        </h1>
        <p className="mt-1.5 text-slate-600">{t(UI_TEXT.settings.subtitle, lang)}</p>
      </div>

      {/* Language Selector */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#FFF1A8] flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              {t(UI_TEXT.settings.languageLabel, lang)}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {t(UI_TEXT.settings.languageDesc, lang)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              audioManager.playTap();
              onUpdateSettings({ language: 'en' });
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
              settings.language === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English (US)
          </button>
          <button
            type="button"
            onClick={() => {
              audioManager.playTap();
              onUpdateSettings({ language: 'id' });
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
              settings.language === 'id'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bahasa Indonesia
          </button>
        </div>
      </div>

      {/* Sound Effects & Voice Guidance */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#A8D8F0] flex items-center justify-center shrink-0">
              <Volume2 className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                {t(UI_TEXT.settings.soundEffects, lang)}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {t(UI_TEXT.settings.soundDesc, lang)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer shrink-0 ${
              settings.soundEnabled
                ? 'bg-[#A8E6CF] text-slate-900'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {settings.soundEnabled ? t(UI_TEXT.settings.on, lang) : t(UI_TEXT.settings.off, lang)}
          </button>
        </div>

        <div className="border-t border-slate-100 pt-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#FFB7C5] flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 text-slate-900" />
            </div>
            <div>
              <h2 className="font-display text-lg font-extrabold text-slate-900">
                {t(UI_TEXT.settings.voiceGuide, lang)}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {t(UI_TEXT.settings.voiceDesc, lang)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer shrink-0 ${
              settings.voiceEnabled
                ? 'bg-[#A8E6CF] text-slate-900'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {settings.voiceEnabled ? t(UI_TEXT.settings.on, lang) : t(UI_TEXT.settings.off, lang)}
          </button>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="volume-slider" className="font-display text-base font-extrabold text-slate-900">
              {t(UI_TEXT.settings.volumeLabel, lang)}
            </label>
            <span className="text-sm font-bold text-slate-700 tabular-nums">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.volume * 100)}
            onChange={(e) => onUpdateSettings({ volume: Number(e.target.value) / 100 })}
            className="w-full accent-slate-900 cursor-pointer"
          />
        </div>
      </div>

      {/* Child Age Profile */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-900">
            {t(UI_TEXT.settings.ageLabel, lang)}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            {t(UI_TEXT.settings.ageDesc, lang)}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 shrink-0">
          {([3, 4, 5] as const).map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => {
                audioManager.playTap();
                onUpdateSettings({ childAge: age });
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer tabular-nums ${
                settings.childAge === age
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {age} {t(UI_TEXT.home.yearsOld, lang)}
            </button>
          ))}
        </div>
      </div>

      {/* PWA Installation & Offline Support */}
      <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#D7C4F5] flex items-center justify-center shrink-0">
            <Smartphone className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              {t(UI_TEXT.settings.installAppTitle, lang)}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {t(UI_TEXT.settings.installAppDesc, lang)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton language={lang} variant="card" />
          <span className="text-xs font-bold text-emerald-700 bg-[#A8E6CF]/45 px-3 py-1.5 rounded-xl">
            {t(UI_TEXT.settings.offlineReady, lang)}
          </span>
        </div>
      </div>
    </div>
  );
};
