import React, { useEffect, useMemo, useState } from 'react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import { CuteIllustration, IllustrationKey } from '../components/CuteIllustrations';

// 6. COUNT OBJECTS: Tap objects to count aloud, then select the matching number
export const CountObjectsGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const itemIcons: IllustrationKey[] = ['apple', 'butterfly', 'star', 'cupcake', 'duck', 'flower'];

  const { count, icon, choices } = useMemo(() => {
    const min = round === 1 ? 2 : round === 2 ? 4 : 6;
    const max = round === 1 ? 4 : round === 2 ? 6 : 9;
    const target = Math.floor(Math.random() * (max - min + 1)) + min;
    const chosenIcon = pickRandom(itemIcons, 1)[0];

    const distractorPool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== target);
    const distractors = pickRandom(distractorPool, 3);
    return {
      count: target,
      icon: chosenIcon,
      choices: shuffleArray([target, ...distractors]),
    };
  }, [round]);

  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);

  useEffect(() => {
    setCountedIndices([]);
    setSolved(false);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? 'Let us count together! Tap each picture.'
          : 'Mari kita hitung bersama! Sentuh setiap gambarnya.'
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, language, speak]);

  const handleItemTap = (idx: number) => {
    if (countedIndices.includes(idx)) {
      audioManager.playTap();
      return;
    }
    const next = [...countedIndices, idx];
    setCountedIndices(next);
    audioManager.playTap();
    speak(String(next.length));
  };

  const handleNumberChoice = (num: number) => {
    if (solved) return;
    if (num === count) {
      setSolved(true);
      onFeedback('positive', {
        en: `Great counting! There are ${count}!`,
        id: `Pintar berhitung! Jumlahnya ada ${count}!`,
      });
      onRoundComplete();
    } else {
      setWrongChoice(num);
      setTimeout(() => setWrongChoice(null), 400);
      onFeedback('hint', {
        en: `Let's count the pictures carefully! You tapped ${countedIndices.length} so far.`,
        id: `Ayo hitung gambarnya lagi! Coba sentuh satu per satu.`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap each object to count, then tap the matching number!'
          : 'Sentuh setiap benda untuk berhitung, lalu pilih angkanya!'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 max-w-xl mx-auto p-5 rounded-3xl bg-[#FFFDF7] border border-slate-200">
        {Array.from({ length: count }).map((_, idx) => {
          const countOrder = countedIndices.indexOf(idx);
          const isCounted = countOrder !== -1;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleItemTap(idx)}
              className={`relative p-2 rounded-2xl transition-transform cursor-pointer ${
                isCounted ? 'bg-[#A8E6CF]/60 scale-105' : 'hover:scale-105 bg-white shadow-xs'
              }`}
            >
              <CuteIllustration name={icon} size={68} />
              {isCounted && (
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-amber-400 text-slate-900 font-display font-extrabold text-sm flex items-center justify-center shadow-xs">
                  {countOrder + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {choices.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleNumberChoice(num)}
            className={`h-20 rounded-3xl font-display text-4xl font-extrabold border-2 transition-transform cursor-pointer tabular-nums ${
              wrongChoice === num ? 'animate-wiggle' : ''
            } ${
              solved && num === count
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 text-slate-900'
                : 'bg-[#A8D8F0]/55 hover:bg-[#A8D8F0]/85 border-sky-200 text-slate-900 hover:scale-[1.03]'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

// 7. NUMBER MATCHING: Pair numbers with groups of cute items
export const NumberMatchingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const pairCount = round === 1 ? 3 : round === 2 ? 4 : 5;
  const { numbers, groups, icon } = useMemo(() => {
    const nums = pickRandom([1, 2, 3, 4, 5, 6, 7, 8], pairCount);
    const chosenIcon = pickRandom<IllustrationKey>(['strawberry', 'star', 'flower', 'apple'], 1)[0];
    return {
      numbers: nums,
      groups: shuffleArray(nums),
      icon: chosenIcon,
    };
  }, [round, pairCount]);

  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrongGroup, setWrongGroup] = useState<number | null>(null);

  useEffect(() => {
    setSelectedNum(null);
    setMatched([]);
  }, [round]);

  const handleGroupTap = (groupCount: number) => {
    if (matched.includes(groupCount)) return;
    if (selectedNum === null) {
      onFeedback('hint', {
        en: 'Tap a number on the left first!',
        id: 'Sentuh kartu angka di sebelah kiri dulu!',
      });
      return;
    }

    if (selectedNum === groupCount) {
      const next = [...matched, groupCount];
      setMatched(next);
      setSelectedNum(null);
      if (next.length === pairCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongGroup(groupCount);
      setTimeout(() => setWrongGroup(null), 400);
      onFeedback('hint', {
        en: `Count the items! That group has ${groupCount}, not ${selectedNum}.`,
        id: `Hitung lagi! Kelompok itu ada ${groupCount}, bukan ${selectedNum}.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap a number, then tap the group with the same amount!'
          : 'Sentuh angka, lalu sentuh kelompok benda yang jumlahnya sama!'}
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="space-y-3">
          {numbers.map((num) => {
            const isMatched = matched.includes(num);
            const isSelected = selectedNum === num;
            return (
              <button
                key={num}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  audioManager.playTap();
                  setSelectedNum(num);
                  speak(String(num));
                }}
                className={`w-full h-20 rounded-3xl font-display text-4xl font-extrabold border-2 transition-transform cursor-pointer tabular-nums ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300 text-slate-900'
                    : isSelected
                    ? 'bg-[#FFF1A8] border-amber-400 scale-105 text-slate-900 shadow-md'
                    : 'bg-[#A8D8F0]/45 border-sky-200 text-slate-900 hover:scale-[1.02]'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {groups.map((grp) => {
            const isMatched = matched.includes(grp);
            return (
              <button
                key={grp}
                type="button"
                disabled={isMatched}
                onClick={() => handleGroupTap(grp)}
                className={`w-full min-h-[80px] rounded-3xl p-2 border-2 flex flex-wrap items-center justify-center gap-1 transition-transform cursor-pointer ${
                  wrongGroup === grp ? 'animate-wiggle' : ''
                } ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300'
                    : 'bg-[#FFFDF7] border-slate-200 hover:border-sky-300 hover:scale-[1.02]'
                }`}
              >
                {Array.from({ length: grp }).map((_, i) => (
                  <CuteIllustration key={i} name={icon} size={32} />
                ))}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 8. LITTLE ADDITION: Visual frog/apple addition
export const LittleAdditionGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { a, b, total, choices, icon } = useMemo(() => {
    const maxPerSide = round === 1 ? 2 : round === 2 ? 4 : 5;
    const left = Math.floor(Math.random() * maxPerSide) + 1;
    const right = Math.floor(Math.random() * maxPerSide) + 1;
    const sum = left + right;
    const distractors = pickRandom(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== sum),
      3
    );
    const chosenIcon = pickRandom<IllustrationKey>(['frog', 'apple', 'cupcake', 'duck'], 1)[0];
    return {
      a: left,
      b: right,
      total: sum,
      choices: shuffleArray([sum, ...distractors]),
      icon: chosenIcon,
    };
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongVal, setWrongVal] = useState<number | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? `What is ${a} plus ${b}? Count them all together!`
          : `Berapa ${a} ditambah ${b}? Ayo hitung semuanya bersama!`
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, a, b, language, speak]);

  const handleAnswer = (val: number) => {
    if (solved) return;
    if (val === total) {
      setSolved(true);
      onFeedback('positive', {
        en: `Awesome! ${a} + ${b} = ${total}!`,
        id: `Hebat! ${a} + ${b} = ${total}!`,
      });
      onRoundComplete();
    } else {
      setWrongVal(val);
      setTimeout(() => setWrongVal(null), 400);
      onFeedback('hint', {
        en: `Let's count all pictures from 1 to ${total}!`,
        id: `Ayo hitung semua gambar dari 1 bersama-sama!`,
      });
    }
  };

  return (
    <div className="space-y-7 text-center">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="rounded-3xl bg-[#A8E6CF]/35 border border-emerald-200 p-4 min-w-[140px]">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: a }).map((_, i) => (
              <CuteIllustration key={i} name={icon} size={52} />
            ))}
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 tabular-nums">{a}</p>
        </div>

        <span className="font-display text-4xl font-extrabold text-amber-500">+</span>

        <div className="rounded-3xl bg-[#A8D8F0]/35 border border-sky-200 p-4 min-w-[140px]">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: b }).map((_, i) => (
              <CuteIllustration key={i} name={icon} size={52} />
            ))}
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 tabular-nums">{b}</p>
        </div>

        <span className="font-display text-4xl font-extrabold text-slate-700">=</span>

        <div className="h-24 w-24 rounded-3xl bg-[#FFF1A8] border-2 border-amber-300 flex items-center justify-center font-display text-4xl font-extrabold text-slate-900 tabular-nums">
          {solved ? total : '?'}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {choices.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleAnswer(val)}
            className={`h-20 rounded-3xl font-display text-4xl font-extrabold border-2 transition-transform cursor-pointer tabular-nums ${
              wrongVal === val ? 'animate-wiggle' : ''
            } ${
              solved && val === total
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 text-slate-900'
                : 'bg-white border-slate-200 hover:border-sky-300 hover:scale-[1.03] text-slate-900'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

// 9. MISSING NUMBER: Complete the Number Train
export const MissingNumberGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { sequence, missingIdx, missingVal, choices } = useMemo(() => {
    const start = round === 1 ? 1 : round === 2 ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 4) + 3;
    const len = round === 1 ? 4 : 5;
    const seq = Array.from({ length: len }, (_, i) => start + i);
    const mIdx = Math.floor(Math.random() * (len - 2)) + 1;
    const mVal = seq[mIdx];
    const distractors = pickRandom(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== mVal),
      3
    );
    return {
      sequence: seq,
      missingIdx: mIdx,
      missingVal: mVal,
      choices: shuffleArray([mVal, ...distractors]),
    };
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongVal, setWrongVal] = useState<number | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? 'Which number is missing from the train?'
          : 'Angka mana yang hilang dari kereta?'
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, language, speak]);

  const handlePick = (val: number) => {
    if (solved) return;
    if (val === missingVal) {
      setSolved(true);
      onFeedback('positive', {
        en: `Choo-choo! Number ${missingVal} completes the train!`,
        id: `Tut-tut! Angka ${missingVal} melengkapi keretanya!`,
      });
      onRoundComplete();
    } else {
      setWrongVal(val);
      setTimeout(() => setWrongVal(null), 400);
      onFeedback('hint', {
        en: `Count along the train cars: what comes after ${sequence[missingIdx - 1]}?`,
        id: `Hitung gerbongnya: angka berapa setelah ${sequence[missingIdx - 1]}?`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap the missing number to help the train roll!'
          : 'Sentuh angka yang hilang agar kereta bisa berjalan!'}
      </p>

      {/* Train Cars */}
      <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3 py-4">
        <div className="px-4 py-4 rounded-t-3xl rounded-b-xl bg-[#FFB7C5] border-2 border-pink-300 font-display font-extrabold text-slate-900 shadow-xs">
          🚂
        </div>
        {sequence.map((num, idx) => {
          const isMissing = idx === missingIdx;
          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center font-display text-3xl sm:text-4xl font-extrabold tabular-nums transition-all ${
                  isMissing
                    ? solved
                      ? 'bg-[#A8E6CF] border-emerald-400 text-slate-900 scale-105'
                      : 'bg-[#FFF1A8] border-dashed border-amber-400 text-amber-700'
                    : 'bg-[#A8D8F0] border-sky-300 text-slate-900'
                }`}
              >
                {isMissing ? (solved ? missingVal : '?') : num}
              </div>
              <div className="flex gap-4 mt-1">
                <span className="h-3.5 w-3.5 rounded-full bg-slate-700" />
                <span className="h-3.5 w-3.5 rounded-full bg-slate-700" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {choices.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handlePick(val)}
            className={`h-20 rounded-3xl font-display text-4xl font-extrabold border-2 transition-transform cursor-pointer tabular-nums ${
              wrongVal === val ? 'animate-wiggle' : ''
            } ${
              solved && val === missingVal
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 text-slate-900'
                : 'bg-white border-slate-200 hover:border-sky-300 hover:scale-[1.03] text-slate-900'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

// 10. MORE OR LESS: Compare two picnic baskets
export const MoreOrLessGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const { leftCount, rightCount, askMore, icon } = useMemo(() => {
    const pairs: [number, number][] =
      round === 1
        ? [[2, 5], [6, 2], [1, 4]]
        : round === 2
        ? [[3, 6], [7, 4], [2, 5]]
        : [[5, 8], [7, 4], [6, 3]];
    const [a, b] = pickRandom(pairs, 1)[0];
    const swap = Math.random() > 0.5;
    return {
      leftCount: swap ? b : a,
      rightCount: swap ? a : b,
      askMore: Math.random() > 0.45,
      icon: pickRandom<IllustrationKey>(['strawberry', 'cupcake', 'apple', 'star'], 1)[0],
    };
  }, [round]);

  const [solvedSide, setSolvedSide] = useState<'left' | 'right' | null>(null);
  const [wrongSide, setWrongSide] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    setSolvedSide(null);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? askMore
            ? 'Which basket has MORE?'
            : 'Which basket has LESS?'
          : askMore
          ? 'Keranjang mana yang isinya LEBIH BANYAK?'
          : 'Keranjang mana yang isinya LEBIH SEDIKIT?'
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, askMore, language, speak]);

  const handleBasketTap = (side: 'left' | 'right') => {
    if (solvedSide) return;
    const isLeftMore = leftCount > rightCount;
    const isCorrect = askMore
      ? (side === 'left' && isLeftMore) || (side === 'right' && !isLeftMore)
      : (side === 'left' && !isLeftMore) || (side === 'right' && isLeftMore);

    if (isCorrect) {
      setSolvedSide(side);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongSide(side);
      setTimeout(() => setWrongSide(null), 400);
      onFeedback('hint', {
        en: askMore
          ? 'Look for the basket with MORE items!'
          : 'Look for the basket with FEWER items!',
        id: askMore
          ? 'Cari keranjang yang bendanya LEBIH BANYAK!'
          : 'Cari keranjang yang bendanya LEBIH SEDIKIT!',
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="inline-block rounded-3xl bg-[#FFF1A8] px-6 py-3">
        <p className="font-display text-xl sm:text-2xl font-extrabold text-slate-900">
          {language === 'en'
            ? askMore
              ? 'Tap the basket with MORE!'
              : 'Tap the basket with LESS!'
            : askMore
            ? 'Sentuh keranjang yang LEBIH BANYAK!'
            : 'Sentuh keranjang yang LEBIH SEDIKIT!'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {(['left', 'right'] as const).map((side) => {
          const count = side === 'left' ? leftCount : rightCount;
          const isSolved = solvedSide === side;
          return (
            <button
              key={side}
              type="button"
              onClick={() => handleBasketTap(side)}
              className={`rounded-[2rem] p-6 border-2 min-h-[200px] flex flex-col items-center justify-center gap-3 transition-transform cursor-pointer ${
                wrongSide === side ? 'animate-wiggle' : ''
              } ${
                isSolved
                  ? 'bg-[#A8E6CF] border-emerald-400 scale-105 shadow-md'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-sky-300 hover:scale-[1.02]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-[220px]">
                {Array.from({ length: count }).map((_, i) => (
                  <CuteIllustration key={i} name={icon} size={46} />
                ))}
              </div>
              {solvedSide && (
                <span className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
