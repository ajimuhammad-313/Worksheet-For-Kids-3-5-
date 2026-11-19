import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import { CuteIllustration, IllustrationKey } from '../components/CuteIllustrations';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// 1. MATCH LETTERS: Tap uppercase on left & matching lowercase on right with SVG connector lines
export const MatchLettersGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const pairCount = round === 1 ? 3 : round === 2 ? 4 : 5;
  const { leftLetters, rightLetters } = useMemo(() => {
    const chosen = pickRandom(ALPHABET, pairCount);
    return {
      leftLetters: chosen,
      rightLetters: shuffleArray(chosen.map((c) => c.toLowerCase())),
    };
  }, [round, pairCount]);

  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [shakeLower, setShakeLower] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);

  useEffect(() => {
    setSelectedUpper(null);
    setMatched([]);
    setLines([]);
  }, [round]);

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return;
      const box = containerRef.current.getBoundingClientRect();
      const colors = ['#FB7185', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6'];
      const nextLines = matched
        .map((upper, idx) => {
          const lEl = leftRefs.current[upper];
          const rEl = rightRefs.current[upper.toLowerCase()];
          if (!lEl || !rEl) return null;
          const lr = lEl.getBoundingClientRect();
          const rr = rEl.getBoundingClientRect();
          return {
            x1: lr.right - box.left,
            y1: lr.top + lr.height / 2 - box.top,
            x2: rr.left - box.left,
            y2: rr.top + rr.height / 2 - box.top,
            color: colors[idx % colors.length],
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);
      setLines(nextLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [matched]);

  const handleUpperClick = (letter: string) => {
    if (matched.includes(letter)) return;
    audioManager.playTap();
    setSelectedUpper(letter);
    speak(letter);
  };

  const handleLowerClick = (lower: string) => {
    const upper = lower.toUpperCase();
    if (matched.includes(upper)) return;
    if (!selectedUpper) {
      onFeedback('hint', {
        en: 'Tap a big letter on the left first!',
        id: 'Sentuh huruf besar di sebelah kiri dulu ya!',
      });
      return;
    }

    if (selectedUpper === upper) {
      const nextMatched = [...matched, upper];
      setMatched(nextMatched);
      setSelectedUpper(null);
      if (nextMatched.length === pairCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setShakeLower(lower);
      setTimeout(() => setShakeLower(null), 400);
      onFeedback('hint', {
        en: `Look closely! Find the small letter for ${selectedUpper}.`,
        id: `Ayo perhatikan! Cari huruf kecil untuk ${selectedUpper}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap a big letter, then connect it to its small twin!'
          : 'Sentuh huruf besar, lalu pasangkan dengan huruf kecilnya!'}
      </p>

      <div ref={containerRef} className="relative max-w-xl mx-auto grid grid-cols-2 gap-12 sm:gap-24 py-2">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {lines.map((line, i) => (
            <path
              key={i}
              d={`M ${line.x1} ${line.y1} C ${(line.x1 + line.x2) / 2} ${line.y1}, ${(line.x1 + line.x2) / 2} ${line.y2}, ${line.x2} ${line.y2}`}
              fill="none"
              stroke={line.color}
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div className="space-y-4 relative z-10">
          {leftLetters.map((letter) => {
            const isMatched = matched.includes(letter);
            const isSelected = selectedUpper === letter;
            return (
              <button
                key={letter}
                ref={(el) => {
                  leftRefs.current[letter] = el;
                }}
                type="button"
                onClick={() => handleUpperClick(letter)}
                disabled={isMatched}
                className={`w-full h-16 sm:h-20 rounded-3xl font-display text-3xl sm:text-4xl font-extrabold border-2 transition-transform cursor-pointer ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300 text-slate-900'
                    : isSelected
                    ? 'bg-[#FFF1A8] border-amber-400 text-slate-900 scale-105 shadow-md'
                    : 'bg-[#FFB7C5]/45 border-pink-200 text-slate-900 hover:scale-[1.03]'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="space-y-4 relative z-10">
          {rightLetters.map((lower) => {
            const isMatched = matched.includes(lower.toUpperCase());
            return (
              <button
                key={lower}
                ref={(el) => {
                  rightRefs.current[lower] = el;
                }}
                type="button"
                onClick={() => handleLowerClick(lower)}
                disabled={isMatched}
                className={`w-full h-16 sm:h-20 rounded-3xl font-display text-3xl sm:text-4xl font-extrabold border-2 transition-transform cursor-pointer ${
                  shakeLower === lower ? 'animate-wiggle' : ''
                } ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300 text-slate-900'
                    : 'bg-[#A8D8F0]/45 border-sky-200 text-slate-900 hover:scale-[1.03]'
                }`}
              >
                {lower}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. FIND THE LETTER: Pop floating bubbles containing the target letter
export const FindLetterGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const targetCount = round + 1; // 2, 3, 4
  const totalBubbles = round === 1 ? 6 : round === 2 ? 8 : 9;

  const { targetLetter, bubbles } = useMemo(() => {
    const target = pickRandom(ALPHABET, 1)[0];
    const distractors = pickRandom(
      ALPHABET.filter((l) => l !== target),
      totalBubbles - targetCount
    );
    const all = shuffleArray([
      ...Array.from({ length: targetCount }, () => target),
      ...distractors,
    ]).map((letter, idx) => ({
      id: `${round}-${idx}`,
      letter,
      color: ['#FFB7C5', '#A8D8F0', '#FFF1A8', '#D7C4F5', '#A8E6CF'][idx % 5],
    }));
    return { targetLetter: target, bubbles: all };
  }, [round, targetCount, totalBubbles]);

  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setPoppedIds([]);
    const prompt =
      language === 'en'
        ? `Let's find the letter ${targetLetter}!`
        : `Ayo, cari huruf ${targetLetter}!`;
    const timer = setTimeout(() => speak(prompt), 250);
    return () => clearTimeout(timer);
  }, [round, targetLetter, language, speak]);

  const handleBubbleTap = (id: string, letter: string) => {
    if (poppedIds.includes(id)) return;

    if (letter === targetLetter) {
      const nextPopped = [...poppedIds, id];
      setPoppedIds(nextPopped);
      if (nextPopped.length === targetCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: `That's ${letter}. Look for letter ${targetLetter}!`,
        id: `Itu huruf ${letter}. Ayo cari huruf ${targetLetter}!`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-4 rounded-3xl bg-[#FFFDF7] border border-slate-200 px-6 py-3">
        <span className="text-base sm:text-lg font-bold text-slate-700">
          {language === 'en' ? 'Find all bubbles with:' : 'Cari semua gelembung huruf:'}
        </span>
        <button
          type="button"
          onClick={() => speak(targetLetter)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#FFF1A8] px-5 py-2 font-display text-3xl font-extrabold text-slate-900 shadow-xs cursor-pointer"
        >
          <span>{targetLetter}</span>
          <Volume2 className="h-5 w-5 text-slate-700" />
        </button>
        <span className="text-sm font-bold text-slate-600 tabular-nums">
          {poppedIds.length} / {targetCount}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto py-2">
        {bubbles.map((b, idx) => {
          const isPopped = poppedIds.includes(b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBubbleTap(b.id, b.letter)}
              disabled={isPopped}
              style={{
                backgroundColor: isPopped ? '#E2E8F0' : b.color,
                animationDelay: `${idx * 120}ms`,
              }}
              className={`h-24 sm:h-28 w-24 sm:w-28 mx-auto rounded-full font-display text-4xl font-extrabold text-slate-900 shadow-sm border-4 border-white transition-all cursor-pointer flex items-center justify-center ${
                isPopped
                  ? 'scale-75 opacity-35'
                  : wrongId === b.id
                  ? 'animate-wiggle'
                  : 'hover:scale-105 animate-gentle-bounce'
              }`}
            >
              {isPopped ? '★' : b.letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 3. LETTER TO PICTURE: Language-accurate phonics matching!
interface PhonicsEntry {
  letter: string;
  word: string;
  illustration: IllustrationKey;
}

const PHONICS_EN: PhonicsEntry[] = [
  { letter: 'A', word: 'Apple', illustration: 'apple' },
  { letter: 'B', word: 'Ball', illustration: 'ball' },
  { letter: 'C', word: 'Cat', illustration: 'cat' },
  { letter: 'D', word: 'Duck', illustration: 'duck' },
  { letter: 'E', word: 'Elephant', illustration: 'elephant' },
  { letter: 'F', word: 'Frog', illustration: 'frog' },
  { letter: 'G', word: 'Grapes', illustration: 'grapes' },
  { letter: 'H', word: 'Hat', illustration: 'hat' },
  { letter: 'K', word: 'Kite', illustration: 'kite' },
  { letter: 'L', word: 'Lion', illustration: 'lion' },
  { letter: 'M', word: 'Moon', illustration: 'moon' },
  { letter: 'P', word: 'Panda', illustration: 'panda' },
  { letter: 'R', word: 'Rabbit', illustration: 'rabbit' },
  { letter: 'S', word: 'Sun', illustration: 'sun' },
  { letter: 'U', word: 'Umbrella', illustration: 'umbrella' },
];

const PHONICS_ID: PhonicsEntry[] = [
  { letter: 'A', word: 'Apel', illustration: 'apple' },
  { letter: 'B', word: 'Bola', illustration: 'ball' },
  { letter: 'D', word: 'Donat', illustration: 'donut' },
  { letter: 'G', word: 'Gajah', illustration: 'elephant' },
  { letter: 'K', word: 'Kucing', illustration: 'cat' },
  { letter: 'M', word: 'Matahari', illustration: 'sun' },
  { letter: 'N', word: 'Nanas', illustration: 'pineapple' },
  { letter: 'P', word: 'Pisang', illustration: 'banana' },
  { letter: 'R', word: 'Rumah', illustration: 'house' },
  { letter: 'S', word: 'Sapi', illustration: 'cow' },
  { letter: 'T', word: 'Topi', illustration: 'hat' },
  { letter: 'W', word: 'Wortel', illustration: 'carrot' },
];

export const LetterToPictureGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const optionCount = round === 1 ? 3 : 4;
  const pool = language === 'id' ? PHONICS_ID : PHONICS_EN;

  const { target, options } = useMemo(() => {
    const picked = pickRandom(pool, optionCount);
    return {
      target: picked[0],
      options: shuffleArray(picked),
    };
  }, [round, language, optionCount, pool]);

  const [solved, setSolved] = useState(false);
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);

  useEffect(() => {
    setSolved(false);
    const msg =
      language === 'en'
        ? `Which picture starts with ${target.letter}?`
        : `Gambar mana yang berawalan huruf ${target.letter}?`;
    const timer = setTimeout(() => speak(msg), 250);
    return () => clearTimeout(timer);
  }, [round, target, language, speak]);

  const handlePick = (item: PhonicsEntry, idx: number) => {
    if (solved) return;
    if (item.letter === target.letter) {
      setSolved(true);
      onFeedback('positive', {
        en: `Yes! ${target.letter} is for ${target.word}!`,
        id: `Benar! ${target.letter} untuk ${target.word}!`,
      });
      onRoundComplete();
    } else {
      setWrongIdx(idx);
      setTimeout(() => setWrongIdx(null), 400);
      onFeedback('hint', {
        en: `That is ${item.word}. Let's look for ${target.letter}!`,
        id: `Itu ${item.word}. Ayo cari yang berawalan huruf ${target.letter}!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-28 w-28 rounded-[2rem] bg-[#FFB7C5] border-4 border-white shadow-md flex items-center justify-center font-display text-6xl font-extrabold text-slate-900">
          {target.letter}
        </div>
        <p className="text-lg font-bold text-slate-700">
          {language === 'en'
            ? `Tap the picture that starts with "${target.letter}"`
            : `Sentuh gambar yang berawalan huruf "${target.letter}"`}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {options.map((item, idx) => {
          const isTargetSolved = solved && item.letter === target.letter;
          return (
            <button
              key={item.word}
              type="button"
              onClick={() => handlePick(item, idx)}
              className={`rounded-3xl p-4 border-2 flex flex-col items-center gap-2 transition-transform cursor-pointer ${
                wrongIdx === idx ? 'animate-wiggle' : ''
              } ${
                isTargetSolved
                  ? 'bg-[#A8E6CF] border-emerald-400 scale-105 shadow-md'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-pink-300 hover:scale-[1.03]'
              }`}
            >
              <CuteIllustration name={item.illustration} size={84} />
              <span className="font-display text-lg font-bold text-slate-800">
                {item.word}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 4. TRACE THE LETTER: Interactive Canvas Touch/Mouse Drawing with Stroke Guide
interface TraceTemplate {
  letter: string;
  checkpoints: [number, number][]; // normalized 0..1 coordinates
}

const TRACE_TEMPLATES: TraceTemplate[] = [
  { letter: 'A', checkpoints: [[0.5, 0.16], [0.35, 0.5], [0.24, 0.82], [0.65, 0.5], [0.76, 0.82], [0.5, 0.6]] },
  { letter: 'B', checkpoints: [[0.3, 0.18], [0.3, 0.5], [0.3, 0.82], [0.64, 0.3], [0.55, 0.5], [0.68, 0.68]] },
  { letter: 'C', checkpoints: [[0.72, 0.25], [0.46, 0.18], [0.26, 0.45], [0.32, 0.72], [0.58, 0.82], [0.74, 0.72]] },
  { letter: 'L', checkpoints: [[0.32, 0.18], [0.32, 0.48], [0.32, 0.82], [0.52, 0.82], [0.72, 0.82]] },
  { letter: 'O', checkpoints: [[0.5, 0.18], [0.25, 0.48], [0.5, 0.82], [0.75, 0.48]] },
  { letter: 'S', checkpoints: [[0.68, 0.22], [0.38, 0.22], [0.42, 0.48], [0.64, 0.62], [0.36, 0.8]] },
];

export const TraceLetterGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const templates = useMemo(() => pickRandom(TRACE_TEMPLATES, 3), []);
  const current = templates[round - 1] || templates[0];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hitCheckpoints, setHitCheckpoints] = useState<number[]>([]);
  const [completedRound, setCompletedRound] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHitCheckpoints([]);
    setCompletedRound(false);
  };

  useEffect(() => {
    clearCanvas();
    const prompt =
      language === 'en'
        ? `Trace the letter ${current.letter}!`
        : `Tebalkan huruf ${current.letter}!`;
    const timer = setTimeout(() => speak(prompt), 250);
    return () => clearTimeout(timer);
  }, [round, current.letter, language, speak]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, nx: 0, ny: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y, nx: x / canvas.width, ny: y / canvas.height };
  };

  const drawDotAndCheck = (x: number, y: number, nx: number, ny: number, isMove: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#FB7185';
    ctx.lineWidth = 18;

    if (!isMove) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1);
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    // Check proximity to letter checkpoints
    setHitCheckpoints((prev) => {
      const next = [...prev];
      current.checkpoints.forEach(([cx, cy], idx) => {
        if (!next.includes(idx) && Math.hypot(nx - cx, ny - cy) < 0.16) {
          next.push(idx);
        }
      });
      return next;
    });
  };

  useEffect(() => {
    if (!completedRound && hitCheckpoints.length >= current.checkpoints.length) {
      setCompletedRound(true);
      onFeedback('positive', {
        en: `Wonderful tracing of ${current.letter}!`,
        id: `Hebat! Kamu berhasil menebalkan huruf ${current.letter}!`,
      });
      onRoundComplete();
    }
  }, [hitCheckpoints, current.checkpoints.length, current.letter, completedRound, onFeedback, onRoundComplete]);

  const progressPct = Math.round((hitCheckpoints.length / current.checkpoints.length) * 100);

  return (
    <div className="space-y-5 flex flex-col items-center">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-slate-800">
          {language === 'en'
            ? `Trace the letter "${current.letter}"`
            : `Tebalkan huruf "${current.letter}"`}
        </span>
        <span className="text-sm font-bold text-emerald-700 bg-[#A8E6CF]/60 px-3 py-1 rounded-xl tabular-nums">
          {progressPct}%
        </span>
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-[2rem] bg-[#FFFDF7] border-4 border-dashed border-pink-200 overflow-hidden shadow-inner">
        {/* Letter Guide Overlay */}
        <svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          aria-hidden="true"
        >
          <text
            x="50"
            y="80"
            textAnchor="middle"
            fontSize="82"
            fontWeight="800"
            fontFamily="Outfit, sans-serif"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          >
            {current.letter}
          </text>
          {current.checkpoints.map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx * 100}
              cy={cy * 100}
              r={hitCheckpoints.includes(idx) ? 4 : 3.2}
              fill={hitCheckpoints.includes(idx) ? '#10B981' : '#F59E0B'}
              opacity={hitCheckpoints.includes(idx) ? 0.9 : 0.65}
            />
          ))}
        </svg>

        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          style={{ touchAction: 'none' }}
          onPointerDown={(e) => {
            if (completedRound) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            setDrawing(true);
            const { x, y, nx, ny } = getCoords(e);
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
              ctx.beginPath();
              ctx.moveTo(x, y);
            }
            drawDotAndCheck(x, y, nx, ny, false);
          }}
          onPointerMove={(e) => {
            if (!drawing || completedRound) return;
            const { x, y, nx, ny } = getCoords(e);
            drawDotAndCheck(x, y, nx, ny, true);
          }}
          onPointerUp={() => setDrawing(false)}
          onPointerCancel={() => setDrawing(false)}
          className="relative z-10 h-full w-full cursor-crosshair"
        />
      </div>

      <button
        type="button"
        onClick={() => {
          audioManager.playTap();
          clearCanvas();
        }}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        <span>{language === 'en' ? 'Clear & Redraw' : 'Hapus & Ulangi'}</span>
      </button>
    </div>
  );
};

// 5. UPPERCASE & LOWERCASE: Sort letter tiles into Mama Big Nest vs Baby Small Nest
interface SortLetterItem {
  id: string;
  char: string;
  isUpper: boolean;
}

export const UppercaseLowercaseGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const count = round === 1 ? 4 : round === 2 ? 5 : 6;
  const items = useMemo<SortLetterItem[]>(() => {
    const letters = pickRandom('ABDEFGHMNQR'.split(''), count);
    return letters.map((l, idx) => {
      const isUpper = idx % 2 === 0;
      return {
        id: `${round}-${idx}-${l}`,
        char: isUpper ? l.toUpperCase() : l.toLowerCase(),
        isUpper,
      };
    });
  }, [round, count]);

  const [index, setIndex] = useState(0);
  const [bigNest, setBigNest] = useState<string[]>([]);
  const [smallNest, setSmallNest] = useState<string[]>([]);
  const [cardWiggle, setCardWiggle] = useState(false);

  useEffect(() => {
    setIndex(0);
    setBigNest([]);
    setSmallNest([]);
  }, [round]);

  const current = items[index];

  const handleSort = (chosenBig: boolean) => {
    if (!current) return;
    if (chosenBig === current.isUpper) {
      audioManager.playCorrect();
      if (chosenBig) {
        setBigNest((b) => [...b, current.char]);
      } else {
        setSmallNest((s) => [...s, current.char]);
      }

      if (index + 1 >= items.length) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        setIndex((i) => i + 1);
      }
    } else {
      setCardWiggle(true);
      setTimeout(() => setCardWiggle(false), 400);
      onFeedback('hint', {
        en: current.isUpper
          ? `Look! "${current.char}" is a BIG uppercase letter!`
          : `Look! "${current.char}" is a small lowercase letter!`,
        id: current.isUpper
          ? `Lihat! "${current.char}" adalah huruf BESAR!`
          : `Lihat! "${current.char}" adalah huruf kecil!`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      {current ? (
        <>
          <p className="text-base sm:text-lg font-bold text-slate-700">
            {language === 'en'
              ? 'Is this a Big Letter or a Small Letter? Tap the right nest!'
              : 'Apakah ini Huruf Besar atau Huruf Kecil? Sentuh sarang yang tepat!'}
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => speak(current.char)}
              className={`h-28 w-28 rounded-[2rem] bg-[#FFF1A8] border-4 border-white shadow-md flex items-center justify-center font-display text-6xl font-extrabold text-slate-900 cursor-pointer ${
                cardWiggle ? 'animate-wiggle' : 'animate-gentle-bounce'
              }`}
            >
              {current.char}
            </button>
          </div>

          <p className="text-sm font-semibold text-slate-500 tabular-nums">
            {index + 1} / {items.length}
          </p>
        </>
      ) : (
        <div className="py-6 flex items-center justify-center gap-2 text-emerald-700 font-bold text-xl">
          <Sparkles className="h-6 w-6" />
          <span>{language === 'en' ? 'All letters sorted!' : 'Semua huruf tersusun!'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => handleSort(true)}
          className="rounded-3xl bg-[#FFB7C5]/50 hover:bg-[#FFB7C5]/75 border-2 border-pink-200 p-5 text-left transition-colors cursor-pointer min-h-[120px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-extrabold text-slate-900">
              {language === 'en' ? 'Big Letters (ABC)' : 'Huruf Besar (ABC)'}
            </span>
            <CuteIllustration name="bear" size={44} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
            {bigNest.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-white font-display font-bold text-slate-900 shadow-xs">
                {c}
              </span>
            ))}
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSort(false)}
          className="rounded-3xl bg-[#A8D8F0]/50 hover:bg-[#A8D8F0]/75 border-2 border-sky-200 p-5 text-left transition-colors cursor-pointer min-h-[120px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-extrabold text-slate-900">
              {language === 'en' ? 'Small Letters (abc)' : 'Huruf Kecil (abc)'}
            </span>
            <CuteIllustration name="duck" size={44} />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
            {smallNest.map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-white font-display font-bold text-slate-900 shadow-xs">
                {c}
              </span>
            ))}
          </div>
        </button>
      </div>
    </div>
  );
};
