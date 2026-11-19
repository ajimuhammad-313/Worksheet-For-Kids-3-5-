import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw, Star, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { BilingualText, GameMeta, Language } from '../types';
import { UI_TEXT, t } from '../i18n/translations';
import { audioManager } from '../utils/audio';
import { BuddyAvatar } from './CuteIllustrations';

interface GameShellProps {
  game: GameMeta;
  language: Language;
  buddyId: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  onCompleteGame: (starsEarned: number) => void;
  renderGame: (props: {
    language: Language;
    round: number;
    onRoundComplete: () => void;
    onFeedback: (type: 'positive' | 'hint', customMsg?: BilingualText) => void;
    speak: (text: string) => void;
  }) => React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  game,
  language,
  buddyId,
  isMuted,
  onToggleMute,
  onBack,
  onCompleteGame,
  renderGame,
}) => {
  const [round, setRound] = useState<number>(1);
  const [completed, setCompleted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [starsEarned, setStarsEarned] = useState(3);
  const [feedback, setFeedback] = useState<{
    type: 'positive' | 'hint';
    text: string;
  } | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const feedbackTimerRef = useRef<number | null>(null);

  const speak = useCallback(
    (text: string) => {
      audioManager.speak(text, language);
    },
    [language]
  );

  // Speak initial instruction when entering game or changing language
  useEffect(() => {
    if (!completed) {
      const instructionText = t(game.instruction, language);
      const timer = window.setTimeout(() => {
        audioManager.speak(instructionText, language);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, [game.id, language, completed, game.instruction]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
      audioManager.stopSpeech();
    };
  }, []);

  const handleFeedback = useCallback(
    (type: 'positive' | 'hint', customMsg?: BilingualText) => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }

      if (type === 'positive') {
        audioManager.playCorrect();
        const msg = customMsg
          ? t(customMsg, language)
          : t(UI_TEXT.game.positiveDefault, language);
        setFeedback({ type: 'positive', text: msg });
        audioManager.speak(msg, language);
      } else {
        setHintsUsed((h) => h + 1);
        audioManager.playHint();
        const msg = customMsg
          ? t(customMsg, language)
          : t(UI_TEXT.game.hintDefault, language);
        setFeedback({ type: 'hint', text: msg });
        audioManager.speak(msg, language);
      }

      feedbackTimerRef.current = window.setTimeout(() => {
        setFeedback(null);
      }, 2600);
    },
    [language]
  );

  const handleRoundComplete = useCallback(() => {
    if (round < 3) {
      window.setTimeout(() => {
        setRound((r) => r + 1);
      }, 650);
    } else {
      // Calculate gentle non-punitive stars (always at least 1, usually 2-3!)
      const finalStars = hintsUsed <= 2 ? 3 : hintsUsed <= 5 ? 2 : 1;
      setStarsEarned(finalStars);
      window.setTimeout(() => {
        setCompleted(true);
        audioManager.playCelebration();
        audioManager.speak(t(UI_TEXT.game.completeTitle, language), language);
        onCompleteGame(finalStars);
      }, 550);
    }
  }, [round, hintsUsed, language, onCompleteGame]);

  const handleRestart = () => {
    audioManager.playTap();
    setRound(1);
    setCompleted(false);
    setHintsUsed(0);
    setFeedback(null);
    setGameKey((k) => k + 1);
  };

  return (
    <div className="space-y-5">
      {/* Clean Game Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              audioManager.playTap();
              onBack();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-800 transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t(UI_TEXT.game.backToCategory, language)}</span>
          </button>

          <div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {t(game.title, language)}
            </h1>
            <p className="text-sm text-slate-600 hidden sm:block">
              {t(game.instruction, language)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Round Progress */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FFFDF7] border border-slate-200">
            <span className="text-sm font-bold text-slate-700 tabular-nums">
              {t(UI_TEXT.game.round, language)} {round} {t(UI_TEXT.game.of, language)} 3
            </span>
            <div className="flex items-center gap-1.5 ml-1">
              {[1, 2, 3].map((step) => (
                <span
                  key={step}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    step < round
                      ? 'bg-emerald-400'
                      : step === round
                      ? 'bg-amber-400 ring-2 ring-amber-200'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              audioManager.playTap();
              speak(t(game.instruction, language));
            }}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#A8D8F0] hover:bg-[#90cce9] px-3.5 py-2.5 text-sm font-bold text-slate-900 transition-colors cursor-pointer min-h-[44px]"
            aria-label={t(UI_TEXT.game.listenAgain, language)}
          >
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t(UI_TEXT.game.listenAgain, language)}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 p-2.5 text-slate-700 transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile instruction line */}
      <p className="sm:hidden text-center text-base font-semibold text-slate-700 px-2">
        {t(game.instruction, language)}
      </p>

      {/* Gentle Feedback Toast Banner (Reserved height so layout never jumps) */}
      <div className="min-h-[52px] flex items-center justify-center">
        {feedback && !completed && (
          <div
            className={`inline-flex items-center gap-3 rounded-2xl px-5 py-2.5 text-base font-bold shadow-sm transition-all animate-star-pop ${
              feedback.type === 'positive'
                ? 'bg-[#A8E6CF] text-slate-900'
                : 'bg-[#FFF1A8] text-slate-900'
            }`}
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}
      </div>

      {/* Main Game Stage or Completion Screen */}
      {!completed ? (
        <div
          key={`${game.id}-${gameKey}`}
          className="rounded-[2rem] bg-white p-5 sm:p-8 shadow-sm border border-slate-200/80 min-h-[420px] flex flex-col justify-center"
        >
          {renderGame({
            language,
            round,
            onRoundComplete: handleRoundComplete,
            onFeedback: handleFeedback,
            speak,
          })}
        </div>
      ) : (
        <div className="rounded-[2rem] bg-white p-8 sm:p-12 shadow-sm border border-slate-200/80 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-5">
            <div className="animate-gentle-wave">
              <BuddyAvatar buddyId={buddyId} size={112} />
            </div>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t(UI_TEXT.game.completeTitle, language)}
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600">
            {t(UI_TEXT.game.completeDesc, language)}
          </p>

          {/* Animated Stars Row */}
          <div className="my-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                style={{ animationDelay: `${idx * 140}ms` }}
                className={`p-3 rounded-3xl ${
                  idx <= starsEarned
                    ? 'bg-[#FFF1A8] animate-star-pop shadow-sm'
                    : 'bg-slate-100 opacity-50'
                }`}
              >
                <Star
                  className={`h-12 w-12 sm:h-14 sm:w-14 ${
                    idx <= starsEarned
                      ? 'text-amber-500 fill-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </div>
            ))}
          </div>

          <p className="text-lg font-bold text-slate-800 mb-6 tabular-nums">
            +{starsEarned} {t(UI_TEXT.game.starsEarned, language)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A8E6CF] hover:bg-[#91dec0] px-7 py-3.5 text-base font-bold text-slate-900 shadow-xs transition-colors cursor-pointer min-h-[48px]"
            >
              <RotateCcw className="h-5 w-5" />
              <span>{t(UI_TEXT.category.playAgain, language)}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                audioManager.playTap();
                onBack();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#A8D8F0] hover:bg-[#90cce9] px-7 py-3.5 text-base font-bold text-slate-900 shadow-xs transition-colors cursor-pointer min-h-[48px]"
            >
              <span>{t(UI_TEXT.game.finishBack, language)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
