import React, { useEffect, useMemo, useState } from 'react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import { CuteIllustration, IllustrationKey } from '../components/CuteIllustrations';

// 21. MEMORY CARDS: 3D flip-card memory pairs (Round 1: 4 cards, Round 2: 6 cards, Round 3: 8 cards)
export const MemoryCardsGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const pairCount = round === 1 ? 2 : round === 2 ? 3 : 4;
  const deck = useMemo(() => {
    const pool: IllustrationKey[] = ['apple', 'cat', 'sun', 'rocket', 'butterfly', 'duck', 'star', 'flower'];
    const chosen = pickRandom(pool, pairCount);
    return shuffleArray([...chosen, ...chosen]).map((icon, idx) => ({
      id: `${round}-${idx}`,
      icon,
    }));
  }, [round, pairCount]);

  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedIcons, setMatchedIcons] = useState<IllustrationKey[]>([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setFlippedIds([]);
    setMatchedIcons([]);
    setLocked(false);
  }, [round]);

  const handleCardClick = (id: string, icon: IllustrationKey) => {
    if (locked || flippedIds.includes(id) || matchedIcons.includes(icon)) return;
    audioManager.playTap();
    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const firstCard = deck.find((c) => c.id === nextFlipped[0]);
      if (firstCard && firstCard.icon === icon) {
        const nextMatched = [...matchedIcons, icon];
        setMatchedIcons(nextMatched);
        setFlippedIds([]);
        setLocked(false);
        if (nextMatched.length === pairCount) {
          onFeedback('positive');
          onRoundComplete();
        } else {
          audioManager.playCorrect();
        }
      } else {
        setTimeout(() => {
          setFlippedIds([]);
          setLocked(false);
        }, 850);
      }
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Flip two cards to find matching picture pairs!'
          : 'Buka dua kartu untuk menemukan gambar yang kembar!'}
      </p>

      <div
        className={`grid gap-4 mx-auto ${
          pairCount === 2
            ? 'grid-cols-2 max-w-xs'
            : pairCount === 3
            ? 'grid-cols-3 max-w-md'
            : 'grid-cols-4 max-w-xl'
        }`}
      >
        {deck.map((card) => {
          const isOpen = flippedIds.includes(card.id) || matchedIcons.includes(card.icon);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.id, card.icon)}
              className="perspective-1000 h-28 sm:h-32 w-full cursor-pointer"
            >
              <div
                className={`relative h-full w-full transition-transform duration-300 preserve-3d ${
                  isOpen ? 'rotate-y-180' : ''
                }`}
              >
                {/* Card Back */}
                <div className="absolute inset-0 backface-hidden rounded-3xl bg-[#D7C4F5] border-4 border-white shadow-sm flex items-center justify-center font-display text-3xl font-extrabold text-purple-900">
                  ?
                </div>
                {/* Card Front */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl border-4 border-white shadow-sm flex items-center justify-center ${
                    matchedIcons.includes(card.icon) ? 'bg-[#A8E6CF]' : 'bg-[#FFFDF7]'
                  }`}
                >
                  <CuteIllustration name={card.icon} size={66} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 22. ODD ONE OUT: Identify the picture that does not belong
interface OddSet {
  items: IllustrationKey[];
  odd: IllustrationKey;
  hintEn: string;
  hintId: string;
}

const ODD_SETS: OddSet[] = [
  {
    items: ['apple', 'banana', 'strawberry', 'shoe'],
    odd: 'shoe',
    hintEn: 'Three are yummy fruits! Which one do you wear on your foot?',
    hintId: 'Tiga adalah buah lezat! Mana yang dipakai di kaki?',
  },
  {
    items: ['cat', 'dog', 'cow', 'airplane'],
    odd: 'airplane',
    hintEn: 'Three are cute animals! Which one flies in the sky?',
    hintId: 'Tiga adalah hewan lucu! Mana yang terbang di langit?',
  },
  {
    items: ['octopus', 'whale', 'crab', 'carrot'],
    odd: 'carrot',
    hintEn: 'Three swim in the ocean! Which one grows in the garden?',
    hintId: 'Tiga tinggal di laut! Mana yang tumbuh di kebun?',
  },
  {
    items: ['broccoli', 'carrot', 'banana', 'rocket'],
    odd: 'rocket',
    hintEn: 'Three are healthy foods! Which one goes to space?',
    hintId: 'Tiga adalah makanan sehat! Mana yang terbang ke luar angkasa?',
  },
  {
    items: ['hat', 'shoe', 'umbrella', 'frog'],
    odd: 'frog',
    hintEn: 'Three are things we wear or carry! Which one is a hopping animal?',
    hintId: 'Tiga adalah benda yang kita pakai! Mana yang hewan melompat?',
  },
];

export const OddOneOutGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const sets = useMemo(() => pickRandom(ODD_SETS, 3), []);
  const currentSet = sets[round - 1] || sets[0];
  const shuffledItems = useMemo(() => shuffleArray(currentSet.items), [currentSet]);

  const [solved, setSolved] = useState(false);
  const [wrongItem, setWrongItem] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
  }, [round]);

  const handleTap = (item: IllustrationKey) => {
    if (solved) return;
    if (item === currentSet.odd) {
      setSolved(true);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongItem(item);
      setTimeout(() => setWrongItem(null), 400);
      onFeedback('hint', { en: currentSet.hintEn, id: currentSet.hintId });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Three items belong together. Tap the odd one out!'
          : 'Tiga gambar satu kelompok. Sentuh satu yang berbeda!'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {shuffledItems.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleTap(item)}
            className={`rounded-3xl p-5 border-2 flex items-center justify-center transition-transform cursor-pointer ${
              wrongItem === item ? 'animate-wiggle' : ''
            } ${
              solved && item === currentSet.odd
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 shadow-md'
                : 'bg-[#FFFDF7] border-slate-200 hover:border-purple-300 hover:scale-[1.03]'
            }`}
          >
            <CuteIllustration name={item} size={90} />
          </button>
        ))}
      </div>
    </div>
  );
};

// 23. PICTURE PUZZLE: Assemble sliced SVG scene tiles into a complete board
interface PuzzleScene {
  id: string;
  titleEn: string;
  titleId: string;
  renderSvg: () => React.ReactNode;
}

const PUZZLE_SCENES: PuzzleScene[] = [
  {
    id: 'meadow',
    titleEn: 'Sunny Garden',
    titleId: 'Taman Cerah',
    renderSvg: () => (
      <g>
        <rect width="200" height="200" fill="#A8D8F0" />
        <rect y="135" width="200" height="65" fill="#A8E6CF" />
        <circle cx="48" cy="48" r="24" fill="#FFF1A8" stroke="#F59E0B" strokeWidth="4" />
        <rect x="108" y="88" width="60" height="54" rx="4" fill="#FFFDF7" stroke="#334155" strokeWidth="4" />
        <polygon points="98,90 138,54 178,90" fill="#FFB7C5" stroke="#334155" strokeWidth="4" strokeLinejoin="round" />
        <rect x="128" y="112" width="18" height="30" rx="2" fill="#A8D8F0" stroke="#334155" strokeWidth="3" />
        <circle cx="52" cy="148" r="14" fill="#FFB7C5" stroke="#334155" strokeWidth="3" />
        <circle cx="52" cy="148" r="6" fill="#FFF1A8" />
      </g>
    ),
  },
  {
    id: 'space',
    titleEn: 'Space Rocket',
    titleId: 'Roket Luar Angkasa',
    renderSvg: () => (
      <g>
        <rect width="200" height="200" fill="#312E81" />
        <circle cx="34" cy="42" r="5" fill="#FFF1A8" />
        <circle cx="164" cy="38" r="6" fill="#FFF1A8" />
        <circle cx="160" cy="150" r="22" fill="#FFB7C5" />
        <circle cx="44" cy="158" r="14" fill="#A8D8F0" />
        <path d="M100 32 C128 60 132 108 124 142 L76 142 C68 108 72 60 100 32 Z" fill="#FFFDF7" stroke="#1E293B" strokeWidth="4" />
        <circle cx="100" cy="86" r="16" fill="#A8D8F0" stroke="#1E293B" strokeWidth="4" />
        <polygon points="88,142 112,142 100,174" fill="#F59E0B" />
      </g>
    ),
  },
  {
    id: 'ocean',
    titleEn: 'Happy Whale',
    titleId: 'Paus Ceria',
    renderSvg: () => (
      <g>
        <rect width="200" height="200" fill="#E0F2FE" />
        <rect y="95" width="200" height="105" fill="#A8D8F0" />
        <circle cx="155" cy="42" r="22" fill="#FFF1A8" />
        <path d="M44 134 C44 96 124 96 130 132 C132 158 96 164 60 160 C46 158 44 146 44 134 Z" fill="#60A5FA" stroke="#1E293B" strokeWidth="4" />
        <polygon points="128,134 158,114 154,138 162,154" fill="#60A5FA" stroke="#1E293B" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="70" cy="126" r="5" fill="#1E293B" />
        <circle cx="96" cy="70" r="6" fill="#FFFFFF" />
        <circle cx="108" cy="54" r="5" fill="#FFFFFF" />
      </g>
    ),
  },
];

export const PicturePuzzleGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const cols = round === 1 ? 2 : 3;
  const rows = 2;
  const totalPieces = cols * rows;
  const scene = PUZZLE_SCENES[(round - 1) % PUZZLE_SCENES.length];

  const shuffledPieces = useMemo(
    () => shuffleArray(Array.from({ length: totalPieces }, (_, i) => i)),
    [round, totalPieces]
  );

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [placedSlots, setPlacedSlots] = useState<number[]>([]);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);

  useEffect(() => {
    setSelectedPiece(null);
    setPlacedSlots([]);
  }, [round]);

  const handleSlotTap = (slotIdx: number) => {
    if (placedSlots.includes(slotIdx)) return;
    if (selectedPiece === null) {
      onFeedback('hint', {
        en: 'Tap a puzzle piece below first!',
        id: 'Sentuh salah satu potongan gambar di bawah dulu!',
      });
      return;
    }

    if (selectedPiece === slotIdx) {
      const next = [...placedSlots, slotIdx];
      setPlacedSlots(next);
      setSelectedPiece(null);
      if (next.length === totalPieces) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongSlot(slotIdx);
      setTimeout(() => setWrongSlot(null), 400);
      onFeedback('hint', {
        en: 'Try matching the colors and lines on another square!',
        id: 'Coba cocokkan garis dan warnanya di kotak lain!',
      });
    }
  };

  const renderTileSlice = (pieceIdx: number) => {
    const col = pieceIdx % cols;
    const row = Math.floor(pieceIdx / cols);
    const tileW = 200 / cols;
    const tileH = 200 / rows;
    return (
      <svg
        viewBox={`${col * tileW} ${row * tileH} ${tileW} ${tileH}`}
        className="w-full h-full block"
      >
        {scene.renderSvg()}
      </svg>
    );
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? `Build the "${scene.titleEn}" puzzle! Tap a piece, then tap its spot.`
          : `Susun puzzle "${scene.titleId}"! Sentuh potongan, lalu sentuh tempatnya.`}
      </p>

      {/* Target Puzzle Board */}
      <div
        className={`grid gap-1.5 bg-slate-200 p-2 rounded-3xl mx-auto shadow-inner ${
          cols === 2 ? 'grid-cols-2 max-w-[260px]' : 'grid-cols-3 max-w-[360px]'
        }`}
      >
        {Array.from({ length: totalPieces }).map((_, slotIdx) => {
          const isPlaced = placedSlots.includes(slotIdx);
          return (
            <button
              key={slotIdx}
              type="button"
              onClick={() => handleSlotTap(slotIdx)}
              className={`aspect-square rounded-2xl overflow-hidden border-2 transition-transform cursor-pointer flex items-center justify-center ${
                wrongSlot === slotIdx ? 'animate-wiggle' : ''
              } ${
                isPlaced
                  ? 'border-emerald-400'
                  : 'bg-[#FFFDF7] border-dashed border-slate-300 hover:border-purple-400'
              }`}
            >
              {isPlaced ? (
                renderTileSlice(slotIdx)
              ) : (
                <span className="font-display text-lg font-bold text-slate-400 tabular-nums">
                  {slotIdx + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Unplaced Pieces Tray */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {shuffledPieces.map((pieceIdx) => {
          if (placedSlots.includes(pieceIdx)) return null;
          const isSelected = selectedPiece === pieceIdx;
          return (
            <button
              key={pieceIdx}
              type="button"
              onClick={() => {
                audioManager.playTap();
                setSelectedPiece(pieceIdx);
              }}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 transition-transform cursor-pointer shadow-sm ${
                isSelected
                  ? 'border-amber-400 scale-110 ring-4 ring-amber-100'
                  : 'border-white hover:scale-105'
              }`}
            >
              {renderTileSlice(pieceIdx)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 24. COMPLETE THE PATTERN: Visual symbol sequence
export const CompletePatternGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const { sequence, answer, choices } = useMemo(() => {
    const sets: { seq: IllustrationKey[]; ans: IllustrationKey; pool: IllustrationKey[] }[] = [
      {
        seq: ['moon', 'star', 'moon', 'star', 'moon'],
        ans: 'star',
        pool: ['star', 'moon', 'sun'],
      },
      {
        seq: ['apple', 'apple', 'banana', 'apple', 'apple'],
        ans: 'banana',
        pool: ['banana', 'apple', 'strawberry'],
      },
      {
        seq: ['sun', 'flower', 'butterfly', 'sun', 'flower'],
        ans: 'butterfly',
        pool: ['butterfly', 'sun', 'flower', 'tree'],
      },
    ];
    const picked = sets[(round - 1) % sets.length];
    return {
      sequence: picked.seq,
      answer: picked.ans,
      choices: shuffleArray(picked.pool),
    };
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
  }, [round]);

  const handleChoice = (item: IllustrationKey) => {
    if (solved) return;
    if (item === answer) {
      setSolved(true);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongChoice(item);
      setTimeout(() => setWrongChoice(null), 400);
      onFeedback('hint', {
        en: 'Say the pictures out loud in order to hear what comes next!',
        id: 'Sebutkan urutan gambarnya untuk menebak gambar berikutnya!',
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Which picture comes next in the pattern?'
          : 'Gambar mana yang muncul berikutnya dalam pola ini?'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-4 rounded-3xl bg-[#FFFDF7] border border-slate-200 max-w-2xl mx-auto">
        {sequence.map((item, idx) => (
          <div key={idx} className="p-2 rounded-2xl bg-white border border-slate-100 shadow-xs">
            <CuteIllustration name={item} size={56} />
          </div>
        ))}
        <div
          className={`h-[74px] w-[74px] rounded-2xl border-2 flex items-center justify-center font-display text-3xl font-extrabold ${
            solved
              ? 'bg-[#A8E6CF] border-emerald-400'
              : 'bg-[#FFF1A8] border-dashed border-amber-400 text-amber-700'
          }`}
        >
          {solved ? <CuteIllustration name={answer} size={56} /> : '?'}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {choices.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => handleChoice(item)}
            className={`rounded-3xl p-4 border-2 bg-white hover:scale-105 transition-transform cursor-pointer ${
              wrongChoice === item ? 'animate-wiggle' : ''
            } ${
              solved && item === answer
                ? 'bg-[#A8E6CF] border-emerald-400'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <CuteIllustration name={item} size={76} />
          </button>
        ))}
      </div>
    </div>
  );
};

// 25. FIND THE DIFFERENCE: Side-by-side Spot the Difference scenes
interface DiffSpot {
  id: string;
  cx: number;
  cy: number;
  r: number;
}

export const FindDifferenceGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  // Progressive differences: Round 1 = 2 diffs, Round 2 = 3 diffs, Round 3 = 4 diffs
  const activeDiffs: DiffSpot[] = useMemo(() => {
    const all: DiffSpot[] = [
      { id: 'roof', cx: 195, cy: 112, r: 24 },
      { id: 'sun', cx: 48, cy: 44, r: 22 },
      { id: 'butterfly', cx: 130, cy: 62, r: 20 },
      { id: 'flower', cx: 88, cy: 174, r: 20 },
    ];
    return all.slice(0, round + 1);
  }, [round]);

  const [foundIds, setFoundIds] = useState<string[]>([]);

  useEffect(() => {
    setFoundIds([]);
  }, [round]);

  const handleSpotClick = (id: string) => {
    if (foundIds.includes(id)) return;
    const next = [...foundIds, id];
    setFoundIds(next);
    if (next.length === activeDiffs.length) {
      onFeedback('positive', {
        en: 'Eagle eyes! You spotted every difference!',
        id: 'Mata jeli! Kamu menemukan semua perbedaannya!',
      });
      onRoundComplete();
    } else {
      audioManager.playCorrect();
    }
  };

  const renderScene = (isModified: boolean) => (
    <svg viewBox="0 0 260 200" className="w-full h-auto rounded-3xl border-2 border-slate-200 bg-[#E0F2FE]">
      {/* Grass */}
      <rect y="140" width="260" height="60" fill="#A8E6CF" />
      {/* Sun (Diff 2: smiling vs sunglasses or orange vs yellow) */}
      <circle
        cx="48"
        cy="44"
        r="20"
        fill={isModified && activeDiffs.some((d) => d.id === 'sun') ? '#FDBA74' : '#FFF1A8'}
        stroke="#F59E0B"
        strokeWidth="3"
      />
      {/* Cloud */}
      <path d="M90 42 Q98 26 116 32 Q132 24 142 40 Q154 44 148 54 L90 54 Z" fill="#FFFFFF" />
      {/* Tree */}
      <rect x="44" y="114" width="14" height="36" rx="3" fill="#B45309" />
      <circle cx="51" cy="98" r="24" fill="#6EE7B7" stroke="#334155" strokeWidth="3" />
      {/* House */}
      <rect x="160" y="118" width="70" height="48" rx="4" fill="#FFFDF7" stroke="#334155" strokeWidth="3" />
      <polygon
        points="152,120 195,86 238,120"
        fill={isModified && activeDiffs.some((d) => d.id === 'roof') ? '#A8D8F0' : '#FFB7C5'}
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="186" y="138" width="18" height="28" rx="2" fill="#D7C4F5" stroke="#334155" strokeWidth="2.5" />

      {/* Diff 3: Butterfly present in left, missing or moved in right */}
      {!(isModified && activeDiffs.some((d) => d.id === 'butterfly')) && (
        <g transform="translate(115, 48)">
          <ellipse cx="10" cy="12" rx="8" ry="6" fill="#FFB7C5" stroke="#334155" strokeWidth="2" />
          <ellipse cx="22" cy="12" rx="8" ry="6" fill="#FFB7C5" stroke="#334155" strokeWidth="2" />
          <rect x="14" y="8" width="4" height="14" rx="2" fill="#334155" />
        </g>
      )}

      {/* Diff 4: Extra flower */}
      {isModified && activeDiffs.some((d) => d.id === 'flower') && (
        <g transform="translate(76, 160)">
          <line x1="12" y1="12" x2="12" y2="28" stroke="#10B981" strokeWidth="3" />
          <circle cx="12" cy="10" r="8" fill="#FB7185" />
          <circle cx="12" cy="10" r="3.5" fill="#FFF1A8" />
        </g>
      )}

      {/* Interactive hit targets on the right picture */}
      {isModified &&
        activeDiffs.map((spot) => {
          const isFound = foundIds.includes(spot.id);
          return (
            <g
              key={spot.id}
              onClick={() => handleSpotClick(spot.id)}
              className="cursor-pointer"
            >
              <circle
                cx={spot.cx}
                cy={spot.cy}
                r={spot.r}
                fill={isFound ? 'rgba(16, 185, 129, 0.18)' : 'transparent'}
                stroke={isFound ? '#10B981' : 'transparent'}
                strokeWidth="3.5"
              />
            </g>
          );
        })}
    </svg>
  );

  return (
    <div className="space-y-5 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <p className="text-lg font-bold text-slate-800">
          {language === 'en'
            ? 'Tap the differences on the RIGHT picture!'
            : 'Sentuh bagian yang berbeda pada gambar KANAN!'}
        </p>
        <span className="px-3 py-1 rounded-xl bg-[#D7C4F5] font-display font-bold text-sm text-slate-900 tabular-nums">
          {foundIds.length} / {activeDiffs.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        <div>
          <p className="text-xs font-bold text-slate-500 mb-1.5">
            {language === 'en' ? 'Original Picture' : 'Gambar Asli'}
          </p>
          {renderScene(false)}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700 mb-1.5">
            {language === 'en' ? 'Tap Differences Here' : 'Sentuh Perbedaan di Sini'}
          </p>
          {renderScene(true)}
        </div>
      </div>
    </div>
  );
};
