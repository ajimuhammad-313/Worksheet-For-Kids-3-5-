import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Scissors } from 'lucide-react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import { CuteIllustration, IllustrationKey } from '../components/CuteIllustrations';

// 26. COLORING FUN: Tap-to-fill SVG Coloring Book
const CRAYON_COLORS = [
  { id: 'pink', hex: '#FFB7C5', en: 'Pink', idLabel: 'Merah Muda' },
  { id: 'yellow', hex: '#FFF1A8', en: 'Yellow', idLabel: 'Kuning' },
  { id: 'blue', hex: '#A8D8F0', en: 'Blue', idLabel: 'Biru' },
  { id: 'green', hex: '#A8E6CF', en: 'Green', idLabel: 'Hijau' },
  { id: 'purple', hex: '#D7C4F5', en: 'Purple', idLabel: 'Ungu' },
  { id: 'orange', hex: '#FDBA74', en: 'Orange', idLabel: 'Oranye' },
];

export const ColoringFunGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const [selectedColor, setSelectedColor] = useState(CRAYON_COLORS[0].hex);
  const [fills, setFills] = useState<Record<string, string>>({});

  const requiredParts =
    round === 1
      ? ['wingTL', 'wingTR', 'wingBL', 'wingBR', 'body']
      : round === 2
      ? ['roof', 'wall', 'door', 'sun', 'tree']
      : ['cone', 'body', 'finL', 'finR', 'window'];

  useEffect(() => {
    setFills({});
  }, [round]);

  const colorPart = (partId: string) => {
    audioManager.playTap();
    setFills((prev) => ({ ...prev, [partId]: selectedColor }));
  };

  const coloredCount = requiredParts.filter((p) => Boolean(fills[p])).length;
  const allColored = coloredCount === requiredParts.length;

  const handleFinish = () => {
    if (!allColored) {
      onFeedback('hint', {
        en: 'Color all the white parts first!',
        id: 'Warnai semua bagian yang masih putih dulu ya!',
      });
      return;
    }
    onFeedback('positive', {
      en: 'What a colorful masterpiece!',
      id: 'Indah sekali hasil mewarnaimu!',
    });
    onRoundComplete();
  };

  return (
    <div className="space-y-5 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="text-lg font-bold text-slate-800">
          {language === 'en'
            ? 'Pick a crayon and tap each part to color!'
            : 'Pilih krayon lalu sentuh bagian gambar untuk mewarnai!'}
        </p>
        <span className="px-3 py-1 rounded-xl bg-[#FED7AA] text-sm font-bold text-slate-900 tabular-nums">
          {coloredCount} / {requiredParts.length}
        </span>
      </div>

      {/* Coloring Canvas */}
      <div className="max-w-xs mx-auto bg-[#FFFDF7] rounded-3xl border-2 border-slate-200 p-4">
        {round === 1 && (
          <svg viewBox="0 0 200 180" className="w-full h-auto">
            <ellipse
              cx="60"
              cy="66"
              rx="42"
              ry="32"
              fill={fills.wingTL || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('wingTL')}
              className="cursor-pointer hover:opacity-90"
            />
            <ellipse
              cx="140"
              cy="66"
              rx="42"
              ry="32"
              fill={fills.wingTR || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('wingTR')}
              className="cursor-pointer hover:opacity-90"
            />
            <ellipse
              cx="66"
              cy="122"
              rx="32"
              ry="26"
              fill={fills.wingBL || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('wingBL')}
              className="cursor-pointer hover:opacity-90"
            />
            <ellipse
              cx="134"
              cy="122"
              rx="32"
              ry="26"
              fill={fills.wingBR || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('wingBR')}
              className="cursor-pointer hover:opacity-90"
            />
            <rect
              x="88"
              y="44"
              width="24"
              height="100"
              rx="12"
              fill={fills.body || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('body')}
              className="cursor-pointer hover:opacity-90"
            />
          </svg>
        )}

        {round === 2 && (
          <svg viewBox="0 0 200 180" className="w-full h-auto">
            <circle
              cx="40"
              cy="38"
              r="22"
              fill={fills.sun || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('sun')}
              className="cursor-pointer"
            />
            <rect
              x="76"
              y="92"
              width="96"
              height="70"
              rx="6"
              fill={fills.wall || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('wall')}
              className="cursor-pointer"
            />
            <polygon
              points="64,94 124,42 184,94"
              fill={fills.roof || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              onClick={() => colorPart('roof')}
              className="cursor-pointer"
            />
            <rect
              x="110"
              y="120"
              width="28"
              height="42"
              rx="4"
              fill={fills.door || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('door')}
              className="cursor-pointer"
            />
            <rect x="34" y="128" width="12" height="34" fill="#B45309" stroke="#334155" strokeWidth="3" />
            <circle
              cx="40"
              cy="108"
              r="24"
              fill={fills.tree || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('tree')}
              className="cursor-pointer"
            />
          </svg>
        )}

        {round === 3 && (
          <svg viewBox="0 0 200 180" className="w-full h-auto">
            <polygon
              points="66,112 36,146 68,140"
              fill={fills.finL || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              onClick={() => colorPart('finL')}
              className="cursor-pointer"
            />
            <polygon
              points="134,112 164,146 132,140"
              fill={fills.finR || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              onClick={() => colorPart('finR')}
              className="cursor-pointer"
            />
            <path
              d="M66 64 L134 64 L134 142 L66 142 Z"
              fill={fills.body || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('body')}
              className="cursor-pointer"
            />
            <polygon
              points="66,64 100,20 134,64"
              fill={fills.cone || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              strokeLinejoin="round"
              onClick={() => colorPart('cone')}
              className="cursor-pointer"
            />
            <circle
              cx="100"
              cy="98"
              r="18"
              fill={fills.window || '#FFFFFF'}
              stroke="#334155"
              strokeWidth="4"
              onClick={() => colorPart('window')}
              className="cursor-pointer"
            />
          </svg>
        )}
      </div>

      {/* Crayon Palette */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CRAYON_COLORS.map((c) => {
          const isSelected = selectedColor === c.hex;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                audioManager.playTap();
                setSelectedColor(c.hex);
              }}
              style={{ backgroundColor: c.hex }}
              className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-4 transition-transform cursor-pointer ${
                isSelected ? 'border-slate-900 scale-115 shadow-md' : 'border-white shadow-xs hover:scale-105'
              }`}
              aria-label={language === 'en' ? c.en : c.idLabel}
            />
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleFinish}
        className={`inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-display text-lg font-extrabold transition-colors cursor-pointer ${
          allColored
            ? 'bg-[#A8E6CF] hover:bg-[#90dec0] text-slate-900 shadow-sm'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        <Check className="h-5 w-5" />
        <span>{language === 'en' ? 'Finish Picture!' : 'Selesai Mewarnai!'}</span>
      </button>
    </div>
  );
};

// 27. CUT AND PASTE: Snip along dotted craft pieces, then paste onto craft board
interface CraftPiece {
  id: string;
  en: string;
  idLabel: string;
  icon: IllustrationKey;
}

const CRAFT_SETS: CraftPiece[][] = [
  [
    { id: 'sun', en: 'Sun', idLabel: 'Matahari', icon: 'sun' },
    { id: 'tree', en: 'Tree', idLabel: 'Pohon', icon: 'tree' },
    { id: 'flower', en: 'Flower', idLabel: 'Bunga', icon: 'flower' },
  ],
  [
    { id: 'house', en: 'House', idLabel: 'Rumah', icon: 'house' },
    { id: 'butterfly', en: 'Butterfly', idLabel: 'Kupu-kupu', icon: 'butterfly' },
    { id: 'cat', en: 'Cat', idLabel: 'Kucing', icon: 'cat' },
  ],
  [
    { id: 'moon', en: 'Moon', idLabel: 'Bulan', icon: 'moon' },
    { id: 'star', en: 'Star', idLabel: 'Bintang', icon: 'star' },
    { id: 'rocket', en: 'Rocket', idLabel: 'Roket', icon: 'rocket' },
    { id: 'rabbit', en: 'Bunny', idLabel: 'Kelinci', icon: 'rabbit' },
  ],
];

export const CutAndPasteGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const pieces = CRAFT_SETS[(round - 1) % CRAFT_SETS.length];
  const [cutIds, setCutIds] = useState<string[]>([]);
  const [pastedIds, setPastedIds] = useState<string[]>([]);
  const [holdingId, setHoldingId] = useState<string | null>(null);

  useEffect(() => {
    setCutIds([]);
    setPastedIds([]);
    setHoldingId(null);
  }, [round]);

  const handlePieceTap = (piece: CraftPiece) => {
    if (pastedIds.includes(piece.id)) return;
    if (!cutIds.includes(piece.id)) {
      audioManager.playSnip();
      setCutIds((prev) => [...prev, piece.id]);
      setHoldingId(piece.id);
    } else {
      audioManager.playTap();
      setHoldingId(piece.id);
    }
  };

  const handleSlotPaste = (slotId: string) => {
    if (pastedIds.includes(slotId)) return;
    if (!holdingId) {
      onFeedback('hint', {
        en: 'Tap a dotted craft piece below with the scissors first!',
        id: 'Sentuh gambar bergaris putus-putus di bawah untuk menggunting dulu!',
      });
      return;
    }

    if (holdingId === slotId) {
      const next = [...pastedIds, slotId];
      setPastedIds(next);
      setHoldingId(null);
      if (next.length === pieces.length) {
        onFeedback('positive', {
          en: 'Awesome craft! Everything is cut and pasted!',
          id: 'Prakarya keren! Semua sudah digunting dan ditempel!',
        });
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      onFeedback('hint', {
        en: 'Match the picture to the slot with the same name!',
        id: 'Cocokkan gambarnya dengan kotak yang bertuliskan nama yang sama!',
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Step 1: Tap a piece to snip it out! Step 2: Tap its dashed spot to paste it!'
          : 'Langkah 1: Sentuh gambar untuk menggunting! Langkah 2: Sentuh tempatnya untuk menempel!'}
      </p>

      {/* Craft Board */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-2xl mx-auto p-5 rounded-3xl bg-[#FFFDF7] border-2 border-amber-200">
        {pieces.map((p) => {
          const isPasted = pastedIds.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSlotPaste(p.id)}
              className={`rounded-3xl p-4 border-2 border-dashed flex flex-col items-center justify-center min-h-[120px] gap-2 transition-all cursor-pointer ${
                isPasted
                  ? 'bg-[#A8E6CF]/45 border-emerald-400 border-solid'
                  : 'bg-white border-slate-300 hover:border-amber-400'
              }`}
            >
              {isPasted ? (
                <CuteIllustration name={p.icon} size={68} />
              ) : (
                <span className="font-display text-sm font-bold text-slate-500">
                  {language === 'en' ? p.en : p.idLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Scissor Cutout Tray */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {pieces.map((p) => {
          if (pastedIds.includes(p.id)) return null;
          const isCut = cutIds.includes(p.id);
          const isHolding = holdingId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePieceTap(p)}
              className={`relative rounded-3xl p-4 border-2 transition-transform cursor-pointer flex flex-col items-center gap-1 ${
                isCut
                  ? isHolding
                    ? 'bg-[#FFF1A8] border-amber-400 scale-110 shadow-md border-solid'
                    : 'bg-white border-emerald-300 border-solid hover:scale-105'
                  : 'bg-white border-dashed border-slate-400 hover:scale-105'
              }`}
            >
              {!isCut && (
                <span className="absolute -top-2.5 -right-2.5 p-1.5 rounded-full bg-[#FFB7C5] border border-white shadow-xs">
                  <Scissors className="h-4 w-4 text-slate-800" />
                </span>
              )}
              <CuteIllustration name={p.icon} size={64} />
              <span className="text-xs font-bold text-slate-700">
                {isCut
                  ? language === 'en'
                    ? 'Tap board to paste'
                    : 'Tempel ke papan'
                  : language === 'en'
                  ? 'Tap to cut'
                  : 'Sentuh gunting'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 28. SIMPLE MAZE: Guide bunny to carrot using buttons, keyboard, or tapping adjacent cells
interface MazeConfig {
  size: number;
  walls: string[]; // "r,c"
  start: [number, number];
  goal: [number, number];
}

const MAZES: MazeConfig[] = [
  {
    size: 4,
    walls: ['0,2', '1,0', '1,2', '2,2', '3,1'],
    start: [0, 0],
    goal: [3, 3],
  },
  {
    size: 5,
    walls: ['0,2', '1,2', '1,4', '2,0', '2,4', '3,1', '3,2', '4,1'],
    start: [0, 0],
    goal: [4, 4],
  },
  {
    size: 6,
    walls: [
      '0,1', '1,1', '1,3', '1,4', '2,3', '3,0', '3,1', '3,3', '4,3', '4,5', '5,1',
    ],
    start: [0, 0],
    goal: [5, 5],
  },
];

export const SimpleMazeGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const maze = MAZES[(round - 1) % MAZES.length];
  const [pos, setPos] = useState<[number, number]>(maze.start);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setPos(maze.start);
    setSolved(false);
  }, [round, maze]);

  const tryMove = (dr: number, dc: number) => {
    if (solved) return;
    const nr = pos[0] + dr;
    const nc = pos[1] + dc;
    if (nr < 0 || nr >= maze.size || nc < 0 || nc >= maze.size) return;
    if (maze.walls.includes(`${nr},${nc}`)) {
      audioManager.playHint();
      return;
    }

    audioManager.playTap();
    setPos([nr, nc]);

    if (nr === maze.goal[0] && nc === maze.goal[1]) {
      setSolved(true);
      onFeedback('positive', {
        en: 'Yum! Bunny reached the carrot!',
        id: 'Hore! Kelinci sampai ke wortelnya!',
      });
      onRoundComplete();
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        tryMove(1, 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        tryMove(0, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        tryMove(0, 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="space-y-5 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Help Bunny reach the carrot! Tap the arrows or adjacent green tiles.'
          : 'Bantu Kelinci menuju wortel! Tekan panah atau kotak jalan di dekatnya.'}
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Maze Grid */}
        <div
          style={{
            gridTemplateColumns: `repeat(${maze.size}, minmax(0, 1fr))`,
          }}
          className="grid gap-1.5 bg-emerald-100 p-3 rounded-3xl border-2 border-emerald-200"
        >
          {Array.from({ length: maze.size * maze.size }).map((_, idx) => {
            const r = Math.floor(idx / maze.size);
            const c = idx % maze.size;
            const isWall = maze.walls.includes(`${r},${c}`);
            const isPlayer = pos[0] === r && pos[1] === c;
            const isGoal = maze.goal[0] === r && maze.goal[1] === c;
            const isAdjacent = Math.abs(pos[0] - r) + Math.abs(pos[1] - c) === 1;

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={isWall}
                onClick={() => {
                  if (isAdjacent) {
                    tryMove(r - pos[0], c - pos[1]);
                  }
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors ${
                  isWall
                    ? 'bg-emerald-700/80 cursor-not-allowed'
                    : isPlayer
                    ? 'bg-[#FFF1A8] border-2 border-amber-400'
                    : isAdjacent
                    ? 'bg-white hover:bg-[#A8E6CF] cursor-pointer border border-emerald-300'
                    : 'bg-white/90'
                }`}
              >
                {isPlayer && <CuteIllustration name="rabbit" size={40} />}
                {!isPlayer && isGoal && <CuteIllustration name="carrot" size={38} />}
                {isWall && <span className="text-emerald-200 text-lg" aria-hidden="true">🌿</span>}
              </button>
            );
          })}
        </div>

        {/* Large Touch D-Pad */}
        <div className="grid grid-cols-3 gap-2 w-44">
          <div />
          <button
            type="button"
            onClick={() => tryMove(-1, 0)}
            className="h-14 rounded-2xl bg-[#A8D8F0] hover:bg-[#8ecae8] flex items-center justify-center text-slate-900 shadow-xs cursor-pointer"
            aria-label="Up"
          >
            <ArrowUp className="h-6 w-6" />
          </button>
          <div />
          <button
            type="button"
            onClick={() => tryMove(0, -1)}
            className="h-14 rounded-2xl bg-[#A8D8F0] hover:bg-[#8ecae8] flex items-center justify-center text-slate-900 shadow-xs cursor-pointer"
            aria-label="Left"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => tryMove(1, 0)}
            className="h-14 rounded-2xl bg-[#A8D8F0] hover:bg-[#8ecae8] flex items-center justify-center text-slate-900 shadow-xs cursor-pointer"
            aria-label="Down"
          >
            <ArrowDown className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => tryMove(0, 1)}
            className="h-14 rounded-2xl bg-[#A8D8F0] hover:bg-[#8ecae8] flex items-center justify-center text-slate-900 shadow-xs cursor-pointer"
            aria-label="Right"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 29. HEALTHY FOOD: Pack healthy foods into the picnic lunchbox
interface FoodChoice {
  key: IllustrationKey;
  en: string;
  idLabel: string;
  healthy: boolean;
}

const HEALTHY_LIST: FoodChoice[] = [
  { key: 'apple', en: 'Apple', idLabel: 'Apel', healthy: true },
  { key: 'banana', en: 'Banana', idLabel: 'Pisang', healthy: true },
  { key: 'carrot', en: 'Carrot', idLabel: 'Wortel', healthy: true },
  { key: 'broccoli', en: 'Broccoli', idLabel: 'Brokoli', healthy: true },
  { key: 'milk', en: 'Milk', idLabel: 'Susu', healthy: true },
  { key: 'strawberry', en: 'Strawberry', idLabel: 'Stroberi', healthy: true },
];

const TREAT_LIST: FoodChoice[] = [
  { key: 'candy', en: 'Candy', idLabel: 'Permen', healthy: false },
  { key: 'donut', en: 'Donut', idLabel: 'Donat', healthy: false },
  { key: 'chips', en: 'Chips', idLabel: 'Keripik', healthy: false },
  { key: 'soda', en: 'Soda', idLabel: 'Minuman Soda', healthy: false },
];

export const HealthyFoodGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const healthyTarget = round === 1 ? 2 : 3;
  const foods = useMemo(() => {
    const h = pickRandom(HEALTHY_LIST, healthyTarget);
    const t = pickRandom(TREAT_LIST, 3);
    return shuffleArray([...h, ...t]);
  }, [round, healthyTarget]);

  const [packed, setPacked] = useState<IllustrationKey[]>([]);
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setPacked([]);
  }, [round]);

  const handleFoodTap = (food: FoodChoice) => {
    if (packed.includes(food.key)) return;
    if (food.healthy) {
      const next = [...packed, food.key];
      setPacked(next);
      if (next.length === healthyTarget) {
        onFeedback('positive', {
          en: 'Yum! Your lunchbox is full of healthy energy!',
          id: 'Mantap! Kotak bekalmu penuh makanan sehat!',
        });
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongKey(food.key);
      setTimeout(() => setWrongKey(null), 400);
      onFeedback('hint', {
        en: `${food.en} is an occasional treat. Pick fruits, veggies, or milk!`,
        id: `${food.idLabel} boleh sesekali saja. Ayo pilih buah, sayur, atau susu!`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? `Tap ${healthyTarget} healthy foods to pack the picnic lunchbox!`
          : `Sentuh ${healthyTarget} makanan sehat untuk mengisi kotak bekal!`}
      </p>

      {/* Lunchbox */}
      <div className="max-w-md mx-auto rounded-3xl bg-[#A8E6CF]/45 border-2 border-emerald-300 p-4 flex items-center justify-center gap-3 min-h-[96px]">
        {Array.from({ length: healthyTarget }).map((_, idx) => {
          const item = packed[idx];
          return (
            <div
              key={idx}
              className="h-18 w-18 rounded-2xl bg-white border-2 border-dashed border-emerald-300 flex items-center justify-center"
            >
              {item ? <CuteIllustration name={item} size={56} /> : <span className="text-slate-300 font-bold">+</span>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {foods.map((food) => {
          const isPacked = packed.includes(food.key);
          return (
            <button
              key={food.key}
              type="button"
              disabled={isPacked}
              onClick={() => handleFoodTap(food)}
              className={`rounded-3xl p-4 border-2 flex flex-col items-center gap-1 transition-transform cursor-pointer ${
                wrongKey === food.key ? 'animate-wiggle' : ''
              } ${
                isPacked
                  ? 'bg-[#A8E6CF] border-emerald-400 opacity-50'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-emerald-300 hover:scale-[1.03]'
              }`}
            >
              <CuteIllustration name={food.key} size={74} />
              <span className="font-display text-base font-bold text-slate-800">
                {language === 'en' ? food.en : food.idLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 30. EMOTION MATCHING: Recognize feelings from short preschool stories
interface EmotionPrompt {
  key: IllustrationKey;
  enName: string;
  idName: string;
  storyEn: string;
  storyId: string;
}

const EMOTIONS: EmotionPrompt[] = [
  {
    key: 'happy',
    enName: 'Happy',
    idName: 'Senang',
    storyEn: 'Bibi Bunny got a shiny birthday balloon! How does Bibi feel?',
    storyId: 'Kelinci Bibi mendapat balon ulang tahun! Bagaimana perasaan Bibi?',
  },
  {
    key: 'sad',
    enName: 'Sad',
    idName: 'Sedih',
    storyEn: 'Oh no, Bobo dropped his ice cream on the ground. How does he feel?',
    storyId: 'Yah, es krim Bobo jatuh ke tanah. Bagaimana perasaannya?',
  },
  {
    key: 'angry',
    enName: 'Angry',
    idName: 'Marah',
    storyEn: 'Someone knocked down the block tower Leo built. How does Leo feel?',
    storyId: 'Menara balok buatan Leo terjatuh karena tersenggol. Bagaimana perasaannya?',
  },
  {
    key: 'surprised',
    enName: 'Surprised',
    idName: 'Terkejut',
    storyEn: 'A tiny puppy jumped out of a gift box! How do you feel?',
    storyId: 'Seekor anak anjing lucu melompat keluar dari kotak hadiah! Bagaimana rasanya?',
  },
  {
    key: 'sleepy',
    enName: 'Sleepy',
    idName: 'Mengantuk',
    storyEn: 'It is bedtime and the stars are twinkling. How does Owl feel?',
    storyId: 'Sudah waktunya tidur dan bintang bersinar. Bagaimana perasaan Burung Hantu?',
  },
  {
    key: 'silly',
    enName: 'Silly',
    idName: 'Lucu / Ceria',
    storyEn: 'Duckling made a funny face in the mirror! Which face is silly?',
    storyId: 'Bebek Dodo membuat wajah lucu di cermin! Mana wajah yang lucu?',
  },
];

export const EmotionMatchingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { target, choices } = useMemo(() => {
    const picked = pickRandom(EMOTIONS, 4);
    return {
      target: picked[0],
      choices: shuffleArray(picked),
    };
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      speak(language === 'en' ? target.storyEn : target.storyId);
    }, 250);
    return () => clearTimeout(timer);
  }, [round, target, language, speak]);

  const handleTap = (em: EmotionPrompt) => {
    if (solved) return;
    if (em.key === target.key) {
      setSolved(true);
      onFeedback('positive', {
        en: `Yes! That face is ${em.enName}!`,
        id: `Benar! Itu ekspresi ${em.idName}!`,
      });
      onRoundComplete();
    } else {
      setWrongKey(em.key);
      setTimeout(() => setWrongKey(null), 400);
      onFeedback('hint', {
        en: `That face looks ${em.enName}. Look for the ${target.enName} face!`,
        id: `Wajah itu terlihat ${em.idName}. Ayo cari wajah ${target.idName}!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="max-w-xl mx-auto rounded-3xl bg-[#FFF1A8]/65 border border-amber-200 p-5">
        <p className="font-display text-xl font-extrabold text-slate-900">
          {language === 'en' ? target.storyEn : target.storyId}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {choices.map((em) => (
          <button
            key={em.key}
            type="button"
            onClick={() => handleTap(em)}
            className={`rounded-3xl p-4 border-2 flex flex-col items-center gap-2 transition-transform cursor-pointer ${
              wrongKey === em.key ? 'animate-wiggle' : ''
            } ${
              solved && em.key === target.key
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 shadow-md'
                : 'bg-[#FFFDF7] border-slate-200 hover:border-amber-300 hover:scale-[1.03]'
            }`}
          >
            <CuteIllustration name={em.key} size={90} />
            <span className="font-display text-lg font-bold text-slate-800">
              {language === 'en' ? em.enName : em.idName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
