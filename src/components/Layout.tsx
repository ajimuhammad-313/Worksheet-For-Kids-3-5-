import React, { useState } from 'react';
import { Award, Home, Menu, Settings, ShieldCheck, Star, Volume2, VolumeX, X, LayoutGrid } from 'lucide-react';
import { AppSettings, Language, PageRoute } from '../types';
import { UI_TEXT, t } from '../i18n/translations';
import { OfflineIndicator } from './PWAComponents';

interface LayoutProps {
  route: PageRoute;
  onNavigate: (route: PageRoute) => void;
  language: Language;
  onToggleLanguage: () => void;
  totalStars: number;
  settings: AppSettings;
  onToggleMute: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  route,
  onNavigate,
  language,
  onToggleLanguage,
  totalStars,
  settings,
  onToggleMute,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMuted = !settings.soundEnabled && !settings.voiceEnabled;

  const isNavActive = (key: string) => {
    if (key === 'home' && route.type === 'home') return true;
    if (key === 'categories' && (route.type === 'category' || route.type === 'game')) return true;
    if (key === 'rewards' && route.type === 'rewards') return true;
    if (key === 'parents' && route.type === 'parents') return true;
    if (key === 'settings' && route.type === 'settings') return true;
    return false;
  };

  const navItems: { key: string; label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { key: 'home', label: t(UI_TEXT.nav.home, language), route: { type: 'home' }, icon: <Home className="h-4 w-4" /> },
    { key: 'categories', label: t(UI_TEXT.nav.categories, language), route: { type: 'category', categoryId: 'alphabet' }, icon: <LayoutGrid className="h-4 w-4" /> },
    { key: 'rewards', label: t(UI_TEXT.nav.rewards, language), route: { type: 'rewards' }, icon: <Award className="h-4 w-4" /> },
    { key: 'parents', label: t(UI_TEXT.nav.parents, language), route: { type: 'parents' }, icon: <ShieldCheck className="h-4 w-4" /> },
    { key: 'settings', label: t(UI_TEXT.nav.settings, language), route: { type: 'settings' }, icon: <Settings className="h-4 w-4" /> },
  ];

  const handleNavClick = (r: PageRoute) => {
    onNavigate(r);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-slate-800">
      {/* Three-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-sm border-b border-slate-200/80">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Title */}
          <button
            type="button"
            onClick={() => handleNavClick({ type: 'home' })}
            className="font-display text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg px-1"
          >
            LittlePlay
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Primary Navigation">
            {navItems.map((item) => {
              const active = isNavActive(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item.route)}
                  className={`text-sm font-semibold whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'text-slate-900 border-slate-900'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Language Switcher) + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onToggleLanguage}
              className="inline-flex items-center justify-center rounded-2xl bg-[#FFF1A8] border border-amber-200 px-4 py-2 text-sm font-bold text-slate-900 shadow-xs hover:bg-[#fde87d] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
              aria-label="Switch Language"
            >
              {language === 'en' ? 'EN · Bahasa ID' : 'ID · English US'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer min-h-[44px] min-w-[44px]"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-[#FFFDF7] px-4 py-3 space-y-1.5 shadow-md">
            {navItems.map((item) => {
              const active = isNavActive(item.key);
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#A8E6CF] text-slate-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between px-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                {totalStars}
              </span>
              <button
                type="button"
                onClick={onToggleMute}
                className="inline-flex items-center gap-1.5 font-semibold text-slate-700 py-1.5 px-3 rounded-xl bg-white border border-slate-200 cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span>{isMuted ? t(UI_TEXT.settings.off, language) : t(UI_TEXT.settings.on, language)}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200/70 bg-white/60 py-5 mt-8">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900">LittlePlay</span>
            <span aria-hidden="true">·</span>
            <span>{t(UI_TEXT.brand.tagline, language)}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800 tabular-nums">
              <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
              {totalStars} {t(UI_TEXT.rewards.totalStars, language)}
            </span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onToggleMute}
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isMuted ? t(UI_TEXT.settings.off, language) : t(UI_TEXT.settings.on, language)}</span>
            </button>
          </div>
        </div>
      </footer>

      <OfflineIndicator language={language} />
    </div>
  );
};
