import React, { useState } from 'react';
import { Download, WifiOff } from 'lucide-react';
import { Language } from '../types';
import { UI_TEXT, t } from '../i18n/translations';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const PWAInstallButton: React.FC<{ language: Language; variant?: 'compact' | 'card' }> = ({
  language,
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'card') {
      return (
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          {t(UI_TEXT.settings.installedBadge, language)}
        </span>
      );
    }
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#A8E6CF] px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-[#92dec1] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="h-4 w-4" />
        {t(UI_TEXT.pwa.installBtn, language)}
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {t(UI_TEXT.pwa.installIosBtn, language)}
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#FFFDF7] p-6 shadow-xl border border-slate-200">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {t(UI_TEXT.pwa.iosTitle, language)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {t(UI_TEXT.pwa.iosStep1, language)}
                <br />
                {t(UI_TEXT.pwa.iosStep2, language)}
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-2xl bg-[#A8D8F0] py-2.5 text-sm font-bold text-slate-900 hover:bg-[#93cce8] transition-colors cursor-pointer"
              >
                {t(UI_TEXT.pwa.close, language)}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export const OfflineIndicator: React.FC<{ language: Language }> = ({ language }) => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-[#FFF1A8] border border-amber-300 px-4 py-2 text-xs font-semibold text-slate-900 shadow-md"
    >
      <WifiOff className="h-4 w-4 text-amber-700 shrink-0" />
      <span>{t(UI_TEXT.pwa.offlineBanner, language)}</span>
    </div>
  );
};
