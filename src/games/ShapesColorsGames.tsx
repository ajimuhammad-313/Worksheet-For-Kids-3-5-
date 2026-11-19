import React, { useEffect, useMemo, useState } from 'react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import {
  CuteIllustration,
  IllustrationKey,
  ShapeKey,
  ShapeSvg,
} from '../components/CuteIllustrations';

const SHAPE_INFO: Record<
  ShapeKey,
  { en: string; id: string; color: string }
> = {
  circle: { en: 'Circle', id: 'Lingkaran', color: '#FFB7C5' },
  square: { en: 'Square', id: 'Persegi', color: '#A8D8F0' },
  triangle: { en: 'Triangle', id: 'Segitiga', color: '#FFF1A8' },
  star: { en: 'Star', id: 'Bintang', color: '#D7C4F5' },
  heart: { en: 'Heart', id: 'Hati', color: '#FDA4AF' },
  diamond: { en: 'Diamond', id: 'Belah Ketupat', color: '#A8E6CF' },
  rectangle: { en: 'Rectangle', id: 'Persegi Panjang', color: '#FED7AA' },
  oval: { en: 'Oval', id: 'Lonjong', color: '#C4B5FD' },
};

// 11. SHAPE SORTING: Drag-or-tap shapes into matching dashed cutouts
export const ShapeSortingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const count = round === 1 ? 3 : round === 2 ? 4 : 5;
  const { targets, tray } = useMemo(() => {
    const pool: ShapeKey[] = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
    const picked = pickRandom(pool, count);
    return {
      targets: picked,
      tray: shuffleArray(picked),
    };
  }, [round, count]);

  const [selectedShape, setSelectedShape] = useState<ShapeKey | null>(null);
  const [placed, setPlaced] = useState<ShapeKey[]>([]);
  const [wrongSlot, setWrongSlot] = useState<ShapeKey | null>(null);

  useEffect(() => {
    setSelectedShape(null);
    setPlaced([]);
  }, [round]);

  const attemptPlace = (shapeToPlace: ShapeKey, slotShape: ShapeKey) => {
    if (placed.includes(slotShape)) return;
    if (shapeToPlace === slotShape) {
      const next = [...placed, slotShape];
      setPlaced(next);
      setSelectedShape(null);
      if (next.length === count) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongSlot(slotShape);
      setTimeout(() => setWrongSlot(null), 400);
      onFeedback('hint', {
        en: `That slot is for ${SHAPE_INFO[slotShape].en}. Try another slot!`,
        id: `Tempat itu untuk ${SHAPE_INFO[slotShape].id}. Coba lubang lainnya!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Drag a shape (or tap it, then tap its matching cutout)!'
          : 'Geser bentuknya (atau sentuh bentuk lalu sentuh lubangnya)!'}
      </p>

      {/* Target Toy Board */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-6 rounded-3xl bg-[#FFFDF7] border-2 border-slate-200 max-w-2xl mx-auto">
        {targets.map((slot) => {
          const isPlaced = placed.includes(slot);
          return (
            <button
              key={slot}
              type="button"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dragged = e.dataTransfer.getData('text/plain') as ShapeKey;
                if (dragged) attemptPlace(dragged, slot);
              }}
              onClick={() => {
                if (!selectedShape) {
                  onFeedback('hint', {
                    en: 'Pick a colorful shape below first!',
                    id: 'Pilih bentuk warna-warni di bawah dulu ya!',
                  });
                  return;
                }
                attemptPlace(selectedShape, slot);
              }}
              className={`p-3 rounded-3xl border-2 transition-transform cursor-pointer flex flex-col items-center gap-1 ${
                wrongSlot === slot ? 'animate-wiggle' : ''
              } ${
                isPlaced
                  ? 'bg-[#A8E6CF]/40 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              <ShapeSvg
                shape={slot}
                color={SHAPE_INFO[slot].color}
                size={78}
                outlineOnly={!isPlaced}
              />
              <span className="text-xs font-bold text-slate-600">
                {SHAPE_INFO[slot][language]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Draggable / Tappable Shape Tray */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {tray.map((shape) => {
          const isPlaced = placed.includes(shape);
          if (isPlaced) return null;
          const isSelected = selectedShape === shape;
          return (
            <button
              key={shape}
              type="button"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', shape);
                setSelectedShape(shape);
              }}
              onClick={() => {
                audioManager.playTap();
                setSelectedShape(shape);
              }}
              className={`p-3 rounded-3xl bg-white border-2 shadow-sm transition-transform cursor-grab active:cursor-grabbing ${
                isSelected
                  ? 'border-amber-400 scale-110 ring-4 ring-amber-100'
                  : 'border-slate-200 hover:scale-105'
              }`}
            >
              <ShapeSvg shape={shape} color={SHAPE_INFO[shape].color} size={76} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 12. COLOR MATCHING: Match objects with their paint bucket colors
interface ColorItem {
  id: string;
  en: string;
  idLabel: string;
  hex: string;
  object: IllustrationKey;
}

const COLOR_ITEMS: ColorItem[] = [
  { id: 'red', en: 'Red', idLabel: 'Merah', hex: '#FB7185', object: 'strawberry' },
  { id: 'yellow', en: 'Yellow', idLabel: 'Kuning', hex: '#FDE047', object: 'banana' },
  { id: 'blue', en: 'Blue', idLabel: 'Biru', hex: '#60A5FA', object: 'whale' },
  { id: 'green', en: 'Green', idLabel: 'Hijau', hex: '#34D399', object: 'broccoli' },
  { id: 'orange', en: 'Orange', idLabel: 'Oranye', hex: '#FB923C', object: 'carrot' },
  { id: 'purple', en: 'Purple', idLabel: 'Ungu', hex: '#C084FC', object: 'grapes' },
];

export const ColorMatchingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const bucketCount = round === 1 ? 3 : 4;
  const { buckets, sequence } = useMemo(() => {
    const picked = pickRandom(COLOR_ITEMS, bucketCount);
    return {
      buckets: picked,
      sequence: shuffleArray(picked).slice(0, 3),
    };
  }, [round, bucketCount]);

  const [step, setStep] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setStep(0);
  }, [round]);

  const currentItem = sequence[step];

  useEffect(() => {
    if (currentItem) {
      speak(language === 'en' ? currentItem.en : currentItem.idLabel);
    }
  }, [step, currentItem, language, speak]);

  const handleBucketTap = (bucket: ColorItem) => {
    if (!currentItem) return;
    if (bucket.id === currentItem.id) {
      if (step + 1 >= sequence.length) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
        setStep((s) => s + 1);
      }
    } else {
      setWrongId(bucket.id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: `That paint is ${bucket.en}. Look for ${currentItem.en}!`,
        id: `Cat itu berwarna ${bucket.idLabel}. Cari warna ${currentItem.idLabel}!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap the paint bucket that matches this object color!'
          : 'Sentuh ember cat yang warnanya sama dengan gambar ini!'}
      </p>

      {currentItem && (
        <div className="flex flex-col items-center gap-2">
          <div className="p-5 rounded-[2rem] bg-[#FFFDF7] border-2 border-slate-200 shadow-xs animate-gentle-bounce">
            <CuteIllustration name={currentItem.object} size={104} />
          </div>
          <span className="text-sm font-bold text-slate-500 tabular-nums">
            {step + 1} / {sequence.length}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {buckets.map((bucket) => (
          <button
            key={bucket.id}
            type="button"
            onClick={() => handleBucketTap(bucket)}
            className={`rounded-3xl p-4 border-2 border-slate-200 bg-white hover:scale-105 transition-transform cursor-pointer flex flex-col items-center gap-2 ${
              wrongId === bucket.id ? 'animate-wiggle' : ''
            }`}
          >
            <div
              style={{ backgroundColor: bucket.hex }}
              className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm"
            />
            <span className="font-display text-lg font-bold text-slate-900">
              {language === 'en' ? bucket.en : bucket.idLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 13. FIND THE SHAPE: Spot everyday objects with the target shape
interface ShapeObjectItem {
  id: string;
  illustration: IllustrationKey;
  shape: ShapeKey;
}

const SHAPE_OBJECTS: ShapeObjectItem[] = [
  { id: 'clock', illustration: 'clock', shape: 'circle' },
  { id: 'ball', illustration: 'ball', shape: 'circle' },
  { id: 'sun', illustration: 'sun', shape: 'circle' },
  { id: 'pizza', illustration: 'pizza', shape: 'triangle' },
  { id: 'carrot', illustration: 'carrot', shape: 'triangle' },
  { id: 'window', illustration: 'window', shape: 'square' },
  { id: 'book', illustration: 'book', shape: 'square' },
  { id: 'kite', illustration: 'kite', shape: 'diamond' },
  { id: 'starfish', illustration: 'starfish', shape: 'star' },
];

export const FindShapeGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { targetShape, gridItems, targetCount } = useMemo(() => {
    const shapes: ShapeKey[] = ['circle', 'triangle', 'square'];
    const target = shapes[(round - 1) % shapes.length];
    const matches = SHAPE_OBJECTS.filter((o) => o.shape === target).slice(0, 2);
    const others = pickRandom(
      SHAPE_OBJECTS.filter((o) => o.shape !== target),
      4
    );
    return {
      targetShape: target,
      gridItems: shuffleArray([...matches, ...others]),
      targetCount: matches.length,
    };
  }, [round]);

  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setFoundIds([]);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? `Find objects shaped like a ${SHAPE_INFO[targetShape].en}!`
          : `Cari benda yang berbentuk ${SHAPE_INFO[targetShape].id}!`
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, targetShape, language, speak]);

  const handleTap = (item: ShapeObjectItem) => {
    if (foundIds.includes(item.id)) return;
    if (item.shape === targetShape) {
      const next = [...foundIds, item.id];
      setFoundIds(next);
      if (next.length === targetCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongId(item.id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: `Look for a ${SHAPE_INFO[targetShape].en} shape!`,
        id: `Ayo cari benda berbentuk ${SHAPE_INFO[targetShape].id}!`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-4 rounded-3xl bg-[#FFF1A8] px-6 py-3">
        <ShapeSvg shape={targetShape} color={SHAPE_INFO[targetShape].color} size={46} />
        <span className="font-display text-xl font-extrabold text-slate-900">
          {language === 'en'
            ? `Find ${targetCount} ${SHAPE_INFO[targetShape].en} objects!`
            : `Cari ${targetCount} benda bentuk ${SHAPE_INFO[targetShape].id}!`}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
        {gridItems.map((item) => {
          const isFound = foundIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTap(item)}
              className={`rounded-3xl p-4 border-2 flex items-center justify-center transition-transform cursor-pointer ${
                wrongId === item.id ? 'animate-wiggle' : ''
              } ${
                isFound
                  ? 'bg-[#A8E6CF] border-emerald-400 scale-105'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-amber-300 hover:scale-[1.03]'
              }`}
            >
              <CuteIllustration name={item.illustration} size={86} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 14. BIG OR SMALL: Compare size of friendly objects/animals
export const BigOrSmallGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { items, askBig } = useMemo(() => {
    const icon = pickRandom<IllustrationKey>(['elephant', 'bear', 'duck', 'ball', 'apple'], 1)[0];
    const sizes = round === 1 ? [132, 64] : [136, 92, 56];
    const arranged = shuffleArray(
      sizes.map((px, idx) => ({
        id: `${round}-${idx}`,
        size: px,
        icon,
      }))
    );
    return {
      items: arranged,
      askBig: Math.random() > 0.45,
    };
  }, [round]);

  const [solvedId, setSolvedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setSolvedId(null);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? askBig
            ? 'Tap the BIGGEST one!'
            : 'Tap the SMALLEST one!'
          : askBig
          ? 'Sentuh yang PALING BESAR!'
          : 'Sentuh yang PALING KECIL!'
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, askBig, language, speak]);

  const targetSize = askBig
    ? Math.max(...items.map((i) => i.size))
    : Math.min(...items.map((i) => i.size));

  const handleTap = (id: string, size: number) => {
    if (solvedId) return;
    if (size === targetSize) {
      setSolvedId(id);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: askBig ? 'Look for the BIGGEST one!' : 'Look for the SMALLEST one!',
        id: askBig ? 'Cari yang ukurannya PALING BESAR!' : 'Cari yang ukurannya PALING KECIL!',
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="inline-block rounded-3xl bg-[#FFF1A8] px-6 py-3">
        <p className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
          {language === 'en'
            ? askBig
              ? 'Tap the BIGGEST friend!'
              : 'Tap the SMALLEST friend!'
            : askBig
            ? 'Sentuh teman yang PALING BESAR!'
            : 'Sentuh teman yang PALING KECIL!'}
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10 py-4">
        {items.map((item) => {
          const isSolved = solvedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTap(item.id, item.size)}
              className={`rounded-[2rem] p-5 border-2 flex items-center justify-center transition-transform cursor-pointer min-w-[100px] min-h-[100px] ${
                wrongId === item.id ? 'animate-wiggle' : ''
              } ${
                isSolved
                  ? 'bg-[#A8E6CF] border-emerald-400 scale-105'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-amber-300 hover:scale-[1.03]'
              }`}
            >
              <CuteIllustration name={item.icon} size={item.size} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 15. COMPLETE THE COLOR PATTERN: Caterpillar bead builder
interface BeadColor {
  id: string;
  hex: string;
  en: string;
  idLabel: string;
}

const BEAD_COLORS: BeadColor[] = [
  { id: 'pink', hex: '#FFB7C5', en: 'Pink', idLabel: 'Merah Muda' },
  { id: 'blue', hex: '#A8D8F0', en: 'Blue', idLabel: 'Biru' },
  { id: 'yellow', hex: '#FFF1A8', en: 'Yellow', idLabel: 'Kuning' },
  { id: 'green', hex: '#A8E6CF', en: 'Green', idLabel: 'Hijau' },
  { id: 'purple', hex: '#D7C4F5', en: 'Purple', idLabel: 'Ungu' },
];

export const ColorPatternGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const { sequence, answer, choices } = useMemo(() => {
    const picked = pickRandom(BEAD_COLORS, 3);
    const [A, B, C] = picked;
    let seq: BeadColor[];
    let ans: BeadColor;
    if (round === 1) {
      seq = [A, B, A, B, A];
      ans = B;
    } else if (round === 2) {
      seq = [A, A, B, A, A];
      ans = B;
    } else {
      seq = [A, B, C, A, B];
      ans = C;
    }
    return {
      sequence: seq,
      answer: ans,
      choices: shuffleArray(picked),
    };
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
  }, [round]);

  const handleChoice = (bead: BeadColor) => {
    if (solved) return;
    if (bead.id === answer.id) {
      setSolved(true);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongId(bead.id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: 'Look at the repeating color rhythm on the caterpillar!',
        id: 'Perhatikan urutan warna yang berulang pada tubuh ulat!',
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Which color bead completes the caterpillar?'
          : 'Warna manik mana yang melengkapi ulat lucu?'}
      </p>

      {/* Caterpillar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
        <div className="h-16 w-16 rounded-full bg-[#A8E6CF] border-3 border-slate-700 flex items-center justify-center text-2xl shadow-xs">
          😊
        </div>
        {sequence.map((bead, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: bead.hex }}
            className="h-14 w-14 rounded-full border-3 border-slate-700 shadow-xs"
          />
        ))}
        <div
          style={{ backgroundColor: solved ? answer.hex : '#F8FAFC' }}
          className={`h-14 w-14 rounded-full border-3 flex items-center justify-center font-display text-2xl font-extrabold ${
            solved ? 'border-emerald-600 scale-110' : 'border-dashed border-slate-400 text-slate-500'
          }`}
        >
          {solved ? '★' : '?'}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {choices.map((bead) => (
          <button
            key={bead.id}
            type="button"
            onClick={() => handleChoice(bead)}
            className={`rounded-3xl p-4 border-2 border-slate-200 bg-white hover:scale-105 transition-transform cursor-pointer flex items-center gap-3 min-w-[140px] justify-center ${
              wrongId === bead.id ? 'animate-wiggle' : ''
            }`}
          >
            <span
              style={{ backgroundColor: bead.hex }}
              className="h-10 w-10 rounded-full border-2 border-slate-700 shrink-0"
            />
            <span className="font-display text-lg font-bold text-slate-900">
              {language === 'en' ? bead.en : bead.idLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
