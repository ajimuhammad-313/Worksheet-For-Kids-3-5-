import { useCallback, useEffect, useState } from 'react';
import { AppSettings, Language, PageRoute, ProgressState } from './types';
import { GAMES_REGISTRY } from './data/gamesRegistry';
import { audioManager } from './utils/audio';
import {
  INITIAL_PROGRESS,
  loadProgress,
  recordGameCompletion,
  saveProgress,
} from './utils/storage';
import { Layout } from './components/Layout';
import { GameShell } from './components/GameShell';
import { renderMiniGame } from './games/GameRouter';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { RewardsPage } from './pages/RewardsPage';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [route, setRoute] = useState<PageRoute>({ type: 'home' });

  const { settings } = progress;
  const language: Language = settings.language;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    audioManager.configure({
      soundEnabled: settings.soundEnabled,
      voiceEnabled: settings.voiceEnabled,
      volume: settings.volume,
    });
  }, [settings.soundEnabled, settings.voiceEnabled, settings.volume]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partial,
      },
    }));
  }, []);

  const handleToggleLanguage = useCallback(() => {
    audioManager.playTap();
    updateSettings({ language: language === 'en' ? 'id' : 'en' });
  }, [language, updateSettings]);

  const handleToggleMute = useCallback(() => {
    const currentlyMuted = !settings.soundEnabled && !settings.voiceEnabled;
    if (currentlyMuted) {
      updateSettings({ soundEnabled: true, voiceEnabled: true });
    } else {
      updateSettings({ soundEnabled: false, voiceEnabled: false });
    }
  }, [settings.soundEnabled, settings.voiceEnabled, updateSettings]);

  const handleNavigate = useCallback((nextRoute: PageRoute) => {
    audioManager.stopSpeech();
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleResetProgress = useCallback(() => {
    setProgress((prev) => ({
      ...INITIAL_PROGRESS,
      settings: prev.settings,
    }));
  }, []);

  const handleSelectBuddy = useCallback((buddyId: string) => {
    setProgress((prev) => ({
      ...prev,
      selectedBuddyId: buddyId,
    }));
  }, []);

  const renderPage = () => {
    switch (route.type) {
      case 'home':
        return (
          <HomePage
            language={language}
            progress={progress}
            onNavigate={handleNavigate}
          />
        );

      case 'category':
        return (
          <CategoryPage
            categoryId={route.categoryId}
            language={language}
            progress={progress}
            onNavigate={handleNavigate}
          />
        );

      case 'game': {
        const gameMeta =
          GAMES_REGISTRY.find((g) => g.id === route.gameId) || GAMES_REGISTRY[0];
        return (
          <GameShell
            game={gameMeta}
            language={language}
            buddyId={progress.selectedBuddyId}
            isMuted={!settings.soundEnabled && !settings.voiceEnabled}
            onToggleMute={handleToggleMute}
            onBack={() =>
              handleNavigate({ type: 'category', categoryId: gameMeta.categoryId })
            }
            onCompleteGame={(starsEarned) => {
              setProgress((prev) =>
                recordGameCompletion(
                  prev,
                  gameMeta.id,
                  gameMeta.categoryId,
                  starsEarned
                )
              );
            }}
            renderGame={(gameProps) => renderMiniGame(gameMeta.id, gameProps)}
          />
        );
      }

      case 'rewards':
        return (
          <RewardsPage
            language={language}
            progress={progress}
            onSelectBuddy={handleSelectBuddy}
          />
        );

      case 'parents':
        return (
          <ParentDashboardPage
            language={language}
            progress={progress}
            onChangeLanguage={(lang) => updateSettings({ language: lang })}
            onChangeAge={(age) => updateSettings({ childAge: age })}
            onResetProgress={handleResetProgress}
            onNavigate={handleNavigate}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onUpdateSettings={updateSettings}
          />
        );
    }
  };

  return (
    <Layout
      route={route}
      onNavigate={handleNavigate}
      language={language}
      onToggleLanguage={handleToggleLanguage}
      totalStars={progress.totalStars}
      settings={settings}
      onToggleMute={handleToggleMute}
    >
      {renderPage()}
    </Layout>
  );
}
