import React, { useEffect, useMemo, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { GameComponentProps } from '../types';
import { pickRandom, shuffleArray } from '../utils/random';
import { audioManager } from '../utils/audio';
import { CuteIllustration, IllustrationKey } from '../components/CuteIllustrations';

interface AnimalInfo {
  key: IllustrationKey;
  en: string;
  idLabel: string;
  soundCueEn: string;
  soundCueId: string;
}

const SOUND_ANIMALS: AnimalInfo[] = [
  { key: 'cat', en: 'Cat', idLabel: 'Kucing', soundCueEn: 'Meow!', soundCueId: 'Meong!' },
  { key: 'dog', en: 'Dog', idLabel: 'Anjing', soundCueEn: 'Woof!', soundCueId: 'Guk!' },
  { key: 'cow', en: 'Cow', idLabel: 'Sapi', soundCueEn: 'Moo!', soundCueId: 'Moo!' },
  { key: 'duck', en: 'Duck', idLabel: 'Bebek', soundCueEn: 'Quack!', soundCueId: 'Kwek!' },
  { key: 'frog', en: 'Frog', idLabel: 'Katak', soundCueEn: 'Ribbit!', soundCueId: 'Krok!' },
  { key: 'lion', en: 'Lion', idLabel: 'Singa', soundCueEn: 'Roar!', soundCueId: 'Auum!' },
  { key: 'sheep', en: 'Sheep', idLabel: 'Domba', soundCueEn: 'Baa!', soundCueId: 'Mbeek!' },
  { key: 'rooster', en: 'Rooster', idLabel: 'Ayam Jago', soundCueEn: 'Cock-a-doodle-doo!', soundCueId: 'Kukuruyuk!' },
];

// 16. ANIMAL SOUNDS: Play sound & tap matching animal
export const AnimalSoundsGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const optCount = round === 1 ? 3 : 4;
  const { target, options } = useMemo(() => {
    const picked = pickRandom(SOUND_ANIMALS, optCount);
    return {
      target: picked[0],
      options: shuffleArray(picked),
    };
  }, [round, optCount]);

  const [solved, setSolved] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      audioManager.playAnimalSound(target.key, language);
    }, 350);
    return () => clearTimeout(timer);
  }, [round, target.key, language]);

  const handlePick = (animal: AnimalInfo) => {
    if (solved) return;
    if (animal.key === target.key) {
      setSolved(true);
      onFeedback('positive', {
        en: `Yes! The ${animal.en} says ${animal.soundCueEn}`,
        id: `Benar! ${animal.idLabel} berbunyi ${animal.soundCueId}`,
      });
      onRoundComplete();
    } else {
      setWrongKey(animal.key);
      setTimeout(() => setWrongKey(null), 400);
      onFeedback('hint', {
        en: `That is a ${animal.en}. Press Play Sound again!`,
        id: `Itu ${animal.idLabel}. Ayo dengarkan suaranya lagi!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => audioManager.playAnimalSound(target.key, language)}
          className="inline-flex items-center gap-3 rounded-3xl bg-[#A8E6CF] hover:bg-[#91dec0] border-2 border-emerald-300 px-8 py-4 font-display text-xl font-extrabold text-slate-900 shadow-sm transition-transform hover:scale-105 cursor-pointer"
        >
          <Volume2 className="h-7 w-7" />
          <span>{language === 'en' ? 'Play Animal Sound' : 'Putar Suara Hewan'}</span>
        </button>
        <p className="text-sm font-semibold text-slate-500">
          {language === 'en' ? `Clue: "${target.soundCueEn}"` : `Petunjuk: "${target.soundCueId}"`}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {options.map((animal) => (
          <button
            key={animal.key}
            type="button"
            onClick={() => handlePick(animal)}
            className={`rounded-3xl p-4 border-2 flex flex-col items-center gap-2 transition-transform cursor-pointer ${
              wrongKey === animal.key ? 'animate-wiggle' : ''
            } ${
              solved && animal.key === target.key
                ? 'bg-[#A8E6CF] border-emerald-400 scale-105 shadow-md'
                : 'bg-[#FFFDF7] border-slate-200 hover:border-emerald-300 hover:scale-[1.03]'
            }`}
          >
            <CuteIllustration name={animal.key} size={86} />
            <span className="font-display text-lg font-bold text-slate-800">
              {language === 'en' ? animal.en : animal.idLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 17. SHADOW MATCHING: Match cute animals to their silhouettes
export const ShadowMatchingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const pairCount = round === 1 ? 3 : 4;
  const { animals, shadows } = useMemo(() => {
    const pool: IllustrationKey[] = ['rabbit', 'elephant', 'frog', 'owl', 'cat', 'duck', 'lion', 'penguin'];
    const picked = pickRandom(pool, pairCount);
    return {
      animals: picked,
      shadows: shuffleArray(picked),
    };
  }, [round, pairCount]);

  const [selectedAnimal, setSelectedAnimal] = useState<IllustrationKey | null>(null);
  const [matched, setMatched] = useState<IllustrationKey[]>([]);
  const [wrongShadow, setWrongShadow] = useState<IllustrationKey | null>(null);

  useEffect(() => {
    setSelectedAnimal(null);
    setMatched([]);
  }, [round]);

  const handleShadowTap = (shadowKey: IllustrationKey) => {
    if (matched.includes(shadowKey)) return;
    if (!selectedAnimal) {
      onFeedback('hint', {
        en: 'Tap a colorful animal on the left first!',
        id: 'Sentuh gambar hewan berwarna di sebelah kiri dulu!',
      });
      return;
    }

    if (selectedAnimal === shadowKey) {
      const next = [...matched, shadowKey];
      setMatched(next);
      setSelectedAnimal(null);
      if (next.length === pairCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongShadow(shadowKey);
      setTimeout(() => setWrongShadow(null), 400);
      onFeedback('hint', {
        en: 'Look at the ears and shape of the shadow!',
        id: 'Perhatikan bentuk telinga dan tubuh bayangannya!',
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-lg font-bold text-slate-800">
        {language === 'en'
          ? 'Tap an animal, then tap its matching shadow!'
          : 'Sentuh hewannya, lalu sentuh bayangan yang cocok!'}
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
        <div className="space-y-3">
          {animals.map((key) => {
            const isMatched = matched.includes(key);
            const isSelected = selectedAnimal === key;
            return (
              <button
                key={key}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  audioManager.playTap();
                  setSelectedAnimal(key);
                }}
                className={`w-full py-3 rounded-3xl border-2 flex items-center justify-center transition-transform cursor-pointer ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300 opacity-75'
                    : isSelected
                    ? 'bg-[#FFF1A8] border-amber-400 scale-105 shadow-md'
                    : 'bg-white border-slate-200 hover:scale-[1.03]'
                }`}
              >
                <CuteIllustration name={key} size={74} />
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {shadows.map((key) => {
            const isMatched = matched.includes(key);
            return (
              <button
                key={key}
                type="button"
                disabled={isMatched}
                onClick={() => handleShadowTap(key)}
                className={`w-full py-3 rounded-3xl border-2 flex items-center justify-center transition-transform cursor-pointer ${
                  wrongShadow === key ? 'animate-wiggle' : ''
                } ${
                  isMatched
                    ? 'bg-[#A8E6CF] border-emerald-300'
                    : 'bg-slate-100 border-slate-200 hover:border-emerald-300 hover:scale-[1.03]'
                }`}
              >
                <CuteIllustration name={key} size={74} silhouette={!isMatched} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 18. ANIMAL MATCHING: Find exact twins hiding in the meadow
export const AnimalMatchingGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
}) => {
  const twinCount = round; // 1, 2, 3 twins to find among distractors
  const { target, grid } = useMemo(() => {
    const pool: IllustrationKey[] = ['panda', 'fox', 'koala', 'bear', 'rabbit', 'monkey', 'cat', 'dog'];
    const picked = pickRandom(pool, 5);
    const main = picked[0];
    const distractors = picked.slice(1);
    const cards = shuffleArray([
      ...Array.from({ length: twinCount }, () => main),
      ...distractors.slice(0, 6 - twinCount),
    ]).map((key, idx) => ({ id: `${round}-${idx}`, key }));
    return { target: main, grid: cards };
  }, [round, twinCount]);

  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);

  useEffect(() => {
    setFoundIds([]);
  }, [round]);

  const handleTap = (id: string, key: IllustrationKey) => {
    if (foundIds.includes(id)) return;
    if (key === target) {
      const next = [...foundIds, id];
      setFoundIds(next);
      if (next.length === twinCount) {
        onFeedback('positive');
        onRoundComplete();
      } else {
        audioManager.playCorrect();
      }
    } else {
      setWrongId(id);
      setTimeout(() => setWrongId(null), 400);
      onFeedback('hint', {
        en: 'Look closely at our friend at the top and find the same twin!',
        id: 'Lihat gambar teman di atas dan cari kembarannya yang sama persis!',
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-4 rounded-3xl bg-[#A8E6CF]/45 border border-emerald-200 px-6 py-3">
        <CuteIllustration name={target} size={64} />
        <div className="text-left">
          <p className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
            {language === 'en'
              ? `Find ${twinCount} matching twin${twinCount > 1 ? 's' : ''}!`
              : `Temukan ${twinCount} kembaran yang sama!`}
          </p>
          <p className="text-sm font-semibold text-slate-600 tabular-nums">
            {foundIds.length} / {twinCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {grid.map((card) => {
          const isFound = foundIds.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleTap(card.id, card.key)}
              className={`rounded-3xl p-4 border-2 flex items-center justify-center transition-transform cursor-pointer ${
                wrongId === card.id ? 'animate-wiggle' : ''
              } ${
                isFound
                  ? 'bg-[#A8E6CF] border-emerald-400 scale-105'
                  : 'bg-[#FFFDF7] border-slate-200 hover:border-emerald-300 hover:scale-[1.03]'
              }`}
            >
              <CuteIllustration name={card.key} size={78} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 19. ANIMAL HABITATS: Match animals with their natural homes
interface HabitatAnimal {
  key: IllustrationKey;
  en: string;
  idLabel: string;
  habitat: 'forest' | 'ocean' | 'farm' | 'arctic';
}

const HABITAT_ANIMALS: HabitatAnimal[] = [
  { key: 'monkey', en: 'Monkey', idLabel: 'Monyet', habitat: 'forest' },
  { key: 'owl', en: 'Owl', idLabel: 'Burung Hantu', habitat: 'forest' },
  { key: 'whale', en: 'Whale', idLabel: 'Paus', habitat: 'ocean' },
  { key: 'octopus', en: 'Octopus', idLabel: 'Gurita', habitat: 'ocean' },
  { key: 'cow', en: 'Cow', idLabel: 'Sapi', habitat: 'farm' },
  { key: 'sheep', en: 'Sheep', idLabel: 'Domba', habitat: 'farm' },
  { key: 'penguin', en: 'Penguin', idLabel: 'Penguin', habitat: 'arctic' },
];

const HABITATS: {
  id: 'forest' | 'ocean' | 'farm' | 'arctic';
  en: string;
  idLabel: string;
  bg: string;
  emoji: string;
}[] = [
  { id: 'forest', en: 'Forest', idLabel: 'Hutan', bg: '#A8E6CF', emoji: '🌳' },
  { id: 'ocean', en: 'Ocean', idLabel: 'Laut', bg: '#A8D8F0', emoji: '🌊' },
  { id: 'farm', en: 'Farm', idLabel: 'Peternakan', bg: '#FFF1A8', emoji: '🏡' },
  { id: 'arctic', en: 'Snowy Ice', idLabel: 'Kutub Salju', bg: '#E0F2FE', emoji: '❄️' },
];

export const AnimalHabitatsGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const activeHabitats = round === 1 ? HABITATS.slice(0, 3) : HABITATS;
  const animal = useMemo(() => {
    const valid = HABITAT_ANIMALS.filter((a) =>
      activeHabitats.some((h) => h.id === a.habitat)
    );
    return pickRandom(valid, 1)[0];
  }, [round]);

  const [solved, setSolved] = useState(false);
  const [wrongHab, setWrongHab] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? `Where does the ${animal.en} live?`
          : `Di mana ${animal.idLabel} tinggal?`
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, animal, language, speak]);

  const handleHabitatTap = (habId: string) => {
    if (solved) return;
    if (habId === animal.habitat) {
      setSolved(true);
      onFeedback('positive');
      onRoundComplete();
    } else {
      setWrongHab(habId);
      setTimeout(() => setWrongHab(null), 400);
      onFeedback('hint', {
        en: `Think about where a ${animal.en} likes to play and eat!`,
        id: `Pikirkan di mana ${animal.idLabel} suka bermain dan tinggal!`,
      });
    }
  };

  return (
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 rounded-[2rem] bg-[#FFFDF7] border-2 border-slate-200 animate-gentle-bounce">
          <CuteIllustration name={animal.key} size={96} />
        </div>
        <p className="font-display text-xl font-extrabold text-slate-900">
          {language === 'en'
            ? `Where does ${animal.en} live?`
            : `Di mana ${animal.idLabel} tinggal?`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {activeHabitats.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => handleHabitatTap(h.id)}
            style={{ backgroundColor: h.bg }}
            className={`rounded-3xl p-5 border-2 transition-transform cursor-pointer flex flex-col items-center gap-2 ${
              wrongHab === h.id ? 'animate-wiggle' : ''
            } ${
              solved && h.id === animal.habitat
                ? 'border-emerald-600 scale-105 shadow-md'
                : 'border-white hover:scale-[1.03] shadow-xs'
            }`}
          >
            <span className="text-4xl" aria-hidden="true">
              {h.emoji}
            </span>
            <span className="font-display text-lg font-extrabold text-slate-900">
              {language === 'en' ? h.en : h.idLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// 20. OCEAN ANIMALS: Underwater submarine window sea creature finder
interface SeaAnimal {
  key: IllustrationKey;
  en: string;
  idLabel: string;
}

const SEA_ANIMALS: SeaAnimal[] = [
  { key: 'octopus', en: 'Octopus', idLabel: 'Gurita' },
  { key: 'whale', en: 'Whale', idLabel: 'Ikan Paus' },
  { key: 'crab', en: 'Crab', idLabel: 'Kepiting' },
  { key: 'seahorse', en: 'Seahorse', idLabel: 'Kuda Laut' },
  { key: 'starfish', en: 'Starfish', idLabel: 'Bintang Laut' },
  { key: 'fish', en: 'Clownfish', idLabel: 'Ikan Badut' },
  { key: 'turtle', en: 'Sea Turtle', idLabel: 'Penyu Laut' },
  { key: 'shark', en: 'Friendly Shark', idLabel: 'Hiu Ramah' },
];

export const OceanAnimalsGame: React.FC<GameComponentProps> = ({
  language,
  round,
  onRoundComplete,
  onFeedback,
  speak,
}) => {
  const count = round === 1 ? 4 : 6;
  const { target, swimmers } = useMemo(() => {
    const picked = pickRandom(SEA_ANIMALS, count);
    return {
      target: picked[0],
      swimmers: shuffleArray(picked),
    };
  }, [round, count]);

  const [solved, setSolved] = useState(false);
  const [wrongKey, setWrongKey] = useState<string | null>(null);

  useEffect(() => {
    setSolved(false);
    const timer = setTimeout(() => {
      speak(
        language === 'en'
          ? `Tap the ${target.en}!`
          : `Sentuh ${target.idLabel}!`
      );
    }, 250);
    return () => clearTimeout(timer);
  }, [round, target, language, speak]);

  const handleTap = (sea: SeaAnimal) => {
    if (solved) return;
    if (sea.key === target.key) {
      setSolved(true);
      onFeedback('positive', {
        en: `Splash! You found the ${target.en}!`,
        id: `Byur! Kamu menemukan ${target.idLabel}!`,
      });
      onRoundComplete();
    } else {
      setWrongKey(sea.key);
      setTimeout(() => setWrongKey(null), 400);
      onFeedback('hint', {
        en: `That is a ${sea.en}. Look for the ${target.en}!`,
        id: `Itu ${sea.idLabel}. Ayo cari ${target.idLabel}!`,
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="inline-flex items-center gap-3 rounded-3xl bg-[#A8D8F0] px-6 py-3">
        <span className="font-display text-xl font-extrabold text-slate-900">
          {language === 'en'
            ? `Spot the ${target.en} in the ocean!`
            : `Temukan ${target.idLabel} di dalam laut!`}
        </span>
        <button
          type="button"
          onClick={() => speak(language === 'en' ? target.en : target.idLabel)}
          className="p-2 rounded-full bg-white/80 hover:bg-white cursor-pointer"
          aria-label="Hear name"
        >
          <Volume2 className="h-4 w-4 text-slate-800" />
        </button>
      </div>

      <div className="rounded-[2rem] bg-gradient-to-b from-[#A8D8F0]/55 to-[#7DD3FC]/45 border-4 border-[#A8D8F0] p-6 grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
        {swimmers.map((sea, idx) => (
          <button
            key={sea.key}
            type="button"
            onClick={() => handleTap(sea)}
            style={{ animationDelay: `${idx * 180}ms` }}
            className={`rounded-3xl p-4 bg-white/80 hover:bg-white border-2 transition-transform cursor-pointer flex flex-col items-center gap-1 animate-gentle-bounce ${
              wrongKey === sea.key ? 'animate-wiggle' : ''
            } ${
              solved && sea.key === target.key
                ? 'border-emerald-500 bg-[#A8E6CF] scale-105'
                : 'border-white'
            }`}
          >
            <CuteIllustration name={sea.key} size={82} />
          </button>
        ))}
      </div>
    </div>
  );
};
