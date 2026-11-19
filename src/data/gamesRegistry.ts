import {
  AchievementBadge,
  CategoryMeta,
  CharacterUnlockItem,
  GameMeta,
} from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'alphabet',
    title: { en: 'Alphabet & Literacy', id: 'Huruf & Literasi' },
    subtitle: {
      en: 'Letters, phonics, and first words',
      id: 'Mengenal huruf, bunyi, dan kata pertama',
    },
    bgHex: '#FFB7C5',
    accentHex: '#E11D48',
    borderHex: '#FDA4AF',
    iconName: 'BookOpen',
  },
  {
    id: 'math',
    title: { en: 'Numbers & Math', id: 'Angka & Berhitung' },
    subtitle: {
      en: 'Counting, adding, and comparing',
      id: 'Menghitung, menjumlah, dan membandingkan',
    },
    bgHex: '#A8D8F0',
    accentHex: '#0284C7',
    borderHex: '#7DD3FC',
    iconName: 'Calculator',
  },
  {
    id: 'shapes',
    title: { en: 'Shapes & Colors', id: 'Bentuk & Warna' },
    subtitle: {
      en: 'Sorting shapes, colors, and sizes',
      id: 'Mengelompokkan bentuk, warna, dan ukuran',
    },
    bgHex: '#FFF1A8',
    accentHex: '#D97706',
    borderHex: '#FDE047',
    iconName: 'Shapes',
  },
  {
    id: 'animals',
    title: { en: 'Animals & Nature', id: 'Hewan & Alam' },
    subtitle: {
      en: 'Animal sounds, habitats, and sea life',
      id: 'Suara hewan, habitat, dan biota laut',
    },
    bgHex: '#A8E6CF',
    accentHex: '#059669',
    borderHex: '#6EE7B7',
    iconName: 'PawPrint',
  },
  {
    id: 'logic',
    title: { en: 'Logic & Thinking', id: 'Logika & Berpikir' },
    subtitle: {
      en: 'Memory, puzzles, and visual patterns',
      id: 'Ingatan, puzzle, dan pola gambar',
    },
    bgHex: '#D7C4F5',
    accentHex: '#7C3AED',
    borderHex: '#C4B5FD',
    iconName: 'Puzzle',
  },
  {
    id: 'creativity',
    title: { en: 'Creativity & Daily Life', id: 'Kreativitas & Sehari-hari' },
    subtitle: {
      en: 'Coloring, crafts, healthy habits, feelings',
      id: 'Mewarnai, prakarya, makanan sehat, emosi',
    },
    bgHex: '#FED7AA',
    accentHex: '#EA580C',
    borderHex: '#FDBA74',
    iconName: 'Palette',
  },
];

export const GAMES_REGISTRY: GameMeta[] = [
  // A: Alphabet & Literacy
  {
    id: 'match-letters',
    categoryId: 'alphabet',
    number: 1,
    title: { en: 'Match Letters', id: 'Pasangkan Huruf' },
    shortDesc: {
      en: 'Connect big uppercase and small lowercase letters.',
      id: 'Hubungkan huruf besar dan huruf kecil yang cocok.',
    },
    instruction: {
      en: 'Tap a big letter, then tap its matching small letter!',
      id: 'Sentuh huruf besar, lalu sentuh huruf kecil yang cocok!',
    },
    recommendedAges: [4, 5],
    accentHex: '#FFB7C5',
  },
  {
    id: 'find-letter',
    categoryId: 'alphabet',
    number: 2,
    title: { en: 'Find the Letter', id: 'Cari Hurufnya' },
    shortDesc: {
      en: 'Pop the floating bubbles with the target letter.',
      id: 'Pecahkan gelembung yang berisi huruf yang diminta.',
    },
    instruction: {
      en: 'Find and tap all bubbles with the matching letter!',
      id: 'Cari dan sentuh semua gelembung dengan huruf yang tepat!',
    },
    recommendedAges: [3, 4],
    accentHex: '#FFB7C5',
  },
  {
    id: 'letter-picture',
    categoryId: 'alphabet',
    number: 3,
    title: { en: 'Letter to Picture', id: 'Huruf ke Gambar' },
    shortDesc: {
      en: 'Match each starting letter with its fun picture.',
      id: 'Cocokkan huruf awal dengan gambar yang sesuai.',
    },
    instruction: {
      en: 'Which picture starts with this letter? Tap it!',
      id: 'Gambar mana yang berawalan huruf ini? Sentuh gambarnya!',
    },
    recommendedAges: [4, 5],
    accentHex: '#FFB7C5',
  },
  {
    id: 'trace-letter',
    categoryId: 'alphabet',
    number: 4,
    title: { en: 'Trace the Letter', id: 'Menebalkan Huruf' },
    shortDesc: {
      en: 'Follow the dotted guide path to draw letters.',
      id: 'Ikuti garis titik-titik untuk menulis huruf.',
    },
    instruction: {
      en: 'Draw over the dotted letter with your finger or mouse!',
      id: 'Gambar mengikuti garis huruf dengan jari atau mouse!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FFB7C5',
  },
  {
    id: 'upper-lower',
    categoryId: 'alphabet',
    number: 5,
    title: { en: 'Uppercase & Lowercase', id: 'Huruf Besar & Kecil' },
    shortDesc: {
      en: 'Sort big letters and small letters into baskets.',
      id: 'Pisahkan huruf besar dan huruf kecil ke keranjang.',
    },
    instruction: {
      en: 'Send each letter to the Big Nest or Small Nest!',
      id: 'Masukkan setiap huruf ke Sarang Besar atau Sarang Kecil!',
    },
    recommendedAges: [4, 5],
    accentHex: '#FFB7C5',
  },

  // B: Numbers & Math
  {
    id: 'count-objects',
    categoryId: 'math',
    number: 6,
    title: { en: 'Count Objects', id: 'Hitung Benda' },
    shortDesc: {
      en: 'Tap objects to count them, then pick the number.',
      id: 'Sentuh benda untuk menghitung, lalu pilih angkanya.',
    },
    instruction: {
      en: 'Tap each object to count together, then choose the number!',
      id: 'Sentuh setiap benda untuk menghitung, lalu pilih angkanya!',
    },
    recommendedAges: [3, 4],
    accentHex: '#A8D8F0',
  },
  {
    id: 'number-matching',
    categoryId: 'math',
    number: 7,
    title: { en: 'Number Matching', id: 'Cocokkan Angka' },
    shortDesc: {
      en: 'Pair each number card with the right group of items.',
      id: 'Pasangkan kartu angka dengan kelompok benda yang tepat.',
    },
    instruction: {
      en: 'Tap a number, then tap the group with that many items!',
      id: 'Sentuh angka, lalu sentuh kelompok dengan jumlah yang sama!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#A8D8F0',
  },
  {
    id: 'little-addition',
    categoryId: 'math',
    number: 8,
    title: { en: 'Little Addition', id: 'Penjumlahan Kecil' },
    shortDesc: {
      en: 'Count two friendly groups together to find the sum.',
      id: 'Gabungkan dua kelompok benda untuk menghitung jumlahnya.',
    },
    instruction: {
      en: 'Count all the friendly items together and tap the total!',
      id: 'Hitung semua benda bersama-sama dan sentuh hasilnya!',
    },
    recommendedAges: [4, 5],
    accentHex: '#A8D8F0',
  },
  {
    id: 'missing-number',
    categoryId: 'math',
    number: 9,
    title: { en: 'Missing Number', id: 'Angka yang Hilang' },
    shortDesc: {
      en: 'Complete the number train with the missing car.',
      id: 'Lengkapi kereta angka dengan gerbong yang hilang.',
    },
    instruction: {
      en: 'Which number is missing from the train? Tap it!',
      id: 'Angka mana yang hilang dari kereta? Sentuh angkanya!',
    },
    recommendedAges: [4, 5],
    accentHex: '#A8D8F0',
  },
  {
    id: 'more-less',
    categoryId: 'math',
    number: 10,
    title: { en: 'More or Less', id: 'Lebih Banyak atau Sedikit' },
    shortDesc: {
      en: 'Compare two baskets to see which has more or less.',
      id: 'Bandingkan dua keranjang mana yang lebih banyak atau sedikit.',
    },
    instruction: {
      en: 'Look closely at both baskets and tap the right one!',
      id: 'Lihat kedua keranjang dan sentuh jawaban yang tepat!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#A8D8F0',
  },

  // C: Shapes & Colors
  {
    id: 'shape-sorting',
    categoryId: 'shapes',
    number: 11,
    title: { en: 'Shape Sorting', id: 'Kelompokkan Bentuk' },
    shortDesc: {
      en: 'Place each colorful shape into its matching cutout.',
      id: 'Masukkan setiap bentuk warna-warni ke lubang yang cocok.',
    },
    instruction: {
      en: 'Drag or tap a shape to place it in the matching slot!',
      id: 'Geser atau sentuh bentuk untuk dimasukkan ke tempatnya!',
    },
    recommendedAges: [3, 4],
    accentHex: '#FFF1A8',
  },
  {
    id: 'color-matching',
    categoryId: 'shapes',
    number: 12,
    title: { en: 'Color Matching', id: 'Cocokkan Warna' },
    shortDesc: {
      en: 'Match everyday objects with their paint bucket color.',
      id: 'Pasangkan benda dengan ember cat berwarna sama.',
    },
    instruction: {
      en: 'Tap the paint bucket that matches the object color!',
      id: 'Sentuh ember cat yang warnanya sama dengan benda!',
    },
    recommendedAges: [3, 4],
    accentHex: '#FFF1A8',
  },
  {
    id: 'find-shape',
    categoryId: 'shapes',
    number: 13,
    title: { en: 'Find the Shape', id: 'Cari Bentuknya' },
    shortDesc: {
      en: 'Spot real-world objects shaped like circles or stars.',
      id: 'Temukan benda sehari-hari yang berbentuk lingkaran atau bintang.',
    },
    instruction: {
      en: 'Tap all the items that have the target shape!',
      id: 'Sentuh semua gambar yang memiliki bentuk yang diminta!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FFF1A8',
  },
  {
    id: 'big-small',
    categoryId: 'shapes',
    number: 14,
    title: { en: 'Big or Small', id: 'Besar atau Kecil' },
    shortDesc: {
      en: 'Compare friendly animals and toys by their size.',
      id: 'Bandingkan hewan dan mainan berdasarkan ukurannya.',
    },
    instruction: {
      en: 'Tap the biggest or smallest friend as asked!',
      id: 'Sentuh teman yang paling besar atau paling kecil!',
    },
    recommendedAges: [3, 4],
    accentHex: '#FFF1A8',
  },
  {
    id: 'color-pattern',
    categoryId: 'shapes',
    number: 15,
    title: { en: 'Complete the Color Pattern', id: 'Lengkapi Pola Warna' },
    shortDesc: {
      en: 'Finish the colorful caterpillar bead sequence.',
      id: 'Lengkapi urutan warna manik-manik ulat lucu.',
    },
    instruction: {
      en: 'Which color comes next on the caterpillar?',
      id: 'Warna apa yang berikutnya pada tubuh ulat?',
    },
    recommendedAges: [4, 5],
    accentHex: '#FFF1A8',
  },

  // D: Animals & Nature
  {
    id: 'animal-sounds',
    categoryId: 'animals',
    number: 16,
    title: { en: 'Animal Sounds', id: 'Suara Hewan' },
    shortDesc: {
      en: 'Listen to cute animal sounds and pick who made it.',
      id: 'Dengarkan suara hewan lucu dan tebak hewannya.',
    },
    instruction: {
      en: 'Press Listen, then tap the animal making that sound!',
      id: 'Tekan Dengarkan, lalu sentuh hewan yang bersuara itu!',
    },
    recommendedAges: [3, 4],
    accentHex: '#A8E6CF',
  },
  {
    id: 'shadow-matching',
    categoryId: 'animals',
    number: 17,
    title: { en: 'Shadow Matching', id: 'Cocokkan Bayangan' },
    shortDesc: {
      en: 'Match cute forest and farm animals to their shadows.',
      id: 'Pasangkan hewan lucu dengan bayangannya yang tepat.',
    },
    instruction: {
      en: 'Tap an animal, then tap its matching dark shadow!',
      id: 'Sentuh hewan, lalu sentuh bayangan yang cocok!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#A8E6CF',
  },
  {
    id: 'animal-matching',
    categoryId: 'animals',
    number: 18,
    title: { en: 'Animal Matching', id: 'Temukan Hewan Kembar' },
    shortDesc: {
      en: 'Spot the exact twin animal hiding in the meadow.',
      id: 'Temukan hewan kembar yang sama persis di padang rumput.',
    },
    instruction: {
      en: 'Look at our animal friend and find its exact twin!',
      id: 'Lihat teman hewan di atas dan cari kembarannya!',
    },
    recommendedAges: [3, 4],
    accentHex: '#A8E6CF',
  },
  {
    id: 'animal-habitats',
    categoryId: 'animals',
    number: 19,
    title: { en: 'Animal Habitats', id: 'Habitat Hewan' },
    shortDesc: {
      en: 'Help animals get back to their cozy natural homes.',
      id: 'Bantu hewan pulang ke tempat tinggal alaminya.',
    },
    instruction: {
      en: 'Where does this animal live? Tap its cozy home!',
      id: 'Di mana hewan ini tinggal? Sentuh rumahnya!',
    },
    recommendedAges: [4, 5],
    accentHex: '#A8E6CF',
  },
  {
    id: 'ocean-animals',
    categoryId: 'animals',
    number: 20,
    title: { en: 'Ocean Animals', id: 'Hewan Laut' },
    shortDesc: {
      en: 'Explore the deep blue sea and tap sea creatures.',
      id: 'Jelajahi laut biru dan temukan makhluk laut lucu.',
    },
    instruction: {
      en: 'Spot and tap the sea creature swimming in the ocean!',
      id: 'Cari dan sentuh hewan laut yang diminta!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#A8E6CF',
  },

  // E: Logic & Thinking
  {
    id: 'memory-cards',
    categoryId: 'logic',
    number: 21,
    title: { en: 'Memory Cards', id: 'Kartu Ingatan' },
    shortDesc: {
      en: 'Flip pastel picture cards to find matching pairs.',
      id: 'Buka kartu gambar dan temukan pasangan yang sama.',
    },
    instruction: {
      en: 'Flip two cards at a time to find all matching pairs!',
      id: 'Buka dua kartu sekaligus untuk menemukan semua pasangan!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#D7C4F5',
  },
  {
    id: 'odd-one-out',
    categoryId: 'logic',
    number: 22,
    title: { en: 'Odd One Out', id: 'Cari yang Berbeda' },
    shortDesc: {
      en: 'Look at four pictures and spot the one that differs.',
      id: 'Lihat empat gambar dan temukan satu yang tidak sekelompok.',
    },
    instruction: {
      en: 'Three items belong together. Tap the odd one out!',
      id: 'Tiga benda sama jenisnya. Sentuh satu yang berbeda!',
    },
    recommendedAges: [4, 5],
    accentHex: '#D7C4F5',
  },
  {
    id: 'picture-puzzle',
    categoryId: 'logic',
    number: 23,
    title: { en: 'Picture Puzzle', id: 'Puzzle Gambar' },
    shortDesc: {
      en: 'Assemble colorful picture pieces into a happy scene.',
      id: 'Susun potongan gambar hingga menjadi gambar utuh.',
    },
    instruction: {
      en: 'Tap a puzzle piece, then tap where it fits on the board!',
      id: 'Sentuh potongan puzzle, lalu sentuh tempatnya di papan!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#D7C4F5',
  },
  {
    id: 'complete-pattern',
    categoryId: 'logic',
    number: 24,
    title: { en: 'Complete the Pattern', id: 'Lengkapi Pola' },
    shortDesc: {
      en: 'Discover the visual rule and pick the next symbol.',
      id: 'Temukan aturan pola gambar dan pilih simbol selanjutnya.',
    },
    instruction: {
      en: 'Look at the pattern carefully. Which picture comes next?',
      id: 'Perhatikan polanya. Gambar apa yang selanjutnya?',
    },
    recommendedAges: [4, 5],
    accentHex: '#D7C4F5',
  },
  {
    id: 'find-difference',
    categoryId: 'logic',
    number: 25,
    title: { en: 'Find the Difference', id: 'Cari Perbedaan' },
    shortDesc: {
      en: 'Compare two sunny scenes to spot what changed.',
      id: 'Bandingkan dua gambar pemandangan dan temukan perbedaannya.',
    },
    instruction: {
      en: 'Tap the spots on the right picture that look different!',
      id: 'Sentuh bagian di gambar kanan yang terlihat berbeda!',
    },
    recommendedAges: [4, 5],
    accentHex: '#D7C4F5',
  },

  // F: Creativity & Daily Life
  {
    id: 'coloring-fun',
    categoryId: 'creativity',
    number: 26,
    title: { en: 'Coloring Fun', id: 'Asyiknya Mewarnai' },
    shortDesc: {
      en: 'Pick crayon colors and tap to fill cute drawings.',
      id: 'Pilih warna krayon dan sentuh gambar untuk mewarnai.',
    },
    instruction: {
      en: 'Pick a color below, then tap any white part to color it!',
      id: 'Pilih warna di bawah, lalu sentuh bagian putih untuk mewarnai!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FED7AA',
  },
  {
    id: 'cut-and-paste',
    categoryId: 'creativity',
    number: 27,
    title: { en: 'Cut and Paste', id: 'Gunting & Tempel' },
    shortDesc: {
      en: 'Snip along dotted lines and paste craft pieces.',
      id: 'Gunting garis putus-putus lalu tempelkan hiasan lucu.',
    },
    instruction: {
      en: 'Tap the scissors to cut each piece, then place it on the craft!',
      id: 'Sentuh gunting untuk memotong, lalu tempel di papan prakarya!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FED7AA',
  },
  {
    id: 'simple-maze',
    categoryId: 'creativity',
    number: 28,
    title: { en: 'Simple Maze', id: 'Labirin Sederhana' },
    shortDesc: {
      en: 'Guide your little animal friend through a garden path.',
      id: 'Bimbing teman hewan melewati jalan taman menuju tujuan.',
    },
    instruction: {
      en: 'Use the arrow buttons or tap next to your friend to reach the goal!',
      id: 'Gunakan tombol panah atau sentuh kotak di dekatmu menuju tujuan!',
    },
    recommendedAges: [4, 5],
    accentHex: '#FED7AA',
  },
  {
    id: 'healthy-food',
    categoryId: 'creativity',
    number: 29,
    title: { en: 'Healthy Food', id: 'Makanan Sehat' },
    shortDesc: {
      en: 'Pack nutritious fruits and veggies into the lunchbox.',
      id: 'Pilih buah dan sayur sehat ke dalam kotak bekal.',
    },
    instruction: {
      en: 'Tap the healthy foods to pack a yummy picnic lunchbox!',
      id: 'Sentuh makanan sehat untuk mengisi kotak bekal piknik!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FED7AA',
  },
  {
    id: 'emotion-matching',
    categoryId: 'creativity',
    number: 30,
    title: { en: 'Emotion Matching', id: 'Mengenal Perasaan' },
    shortDesc: {
      en: 'Recognize happy, sad, angry, and surprised feelings.',
      id: 'Kenali ekspresi senang, sedih, marah, dan terkejut.',
    },
    instruction: {
      en: 'Read the short story and tap the matching feeling face!',
      id: 'Dengarkan ceritanya dan sentuh wajah perasaan yang sesuai!',
    },
    recommendedAges: [3, 4, 5],
    accentHex: '#FED7AA',
  },
];

export const UNLOCKABLE_CHARACTERS: CharacterUnlockItem[] = [
  {
    id: 'bunny',
    name: { en: 'Bibi Bunny', id: 'Kelinci Bibi' },
    role: { en: 'Starter Friend', id: 'Teman Pertama' },
    starsRequired: 0,
    imageUrl: '/src/assets/images/mascot_bunny_1795113930338.jpg',
    svgType: 'bunny',
    bgHex: '#FFB7C5',
  },
  {
    id: 'bear',
    name: { en: 'Bobo Bear', id: 'Beruang Bobo' },
    role: { en: 'Star Keeper', id: 'Penjaga Bintang' },
    starsRequired: 3,
    imageUrl: '/src/assets/images/mascot_bear_1795113930238.jpg',
    svgType: 'bear',
    bgHex: '#FFF1A8',
  },
  {
    id: 'owl',
    name: { en: 'Ollie Owl', id: 'Burung Hantu Ollie' },
    role: { en: 'Story Reader', id: 'Pembaca Cerita' },
    starsRequired: 6,
    imageUrl: '/src/assets/images/mascot_owl_1795113930504.jpg',
    svgType: 'owl',
    bgHex: '#D7C4F5',
  },
  {
    id: 'duck',
    name: { en: 'Dodo Duckling', id: 'Bebek Dodo' },
    role: { en: 'Pond Splasher', id: 'Si Suka Air' },
    starsRequired: 12,
    svgType: 'duck',
    bgHex: '#FFF1A8',
  },
  {
    id: 'fox',
    name: { en: 'Fifi Fox', id: 'Rubah Fifi' },
    role: { en: 'Pattern Finder', id: 'Penemu Pola' },
    starsRequired: 18,
    svgType: 'fox',
    bgHex: '#FED7AA',
  },
  {
    id: 'panda',
    name: { en: 'Poko Panda', id: 'Panda Poko' },
    role: { en: 'Bamboo Chef', id: 'Koki Bambu' },
    starsRequired: 25,
    svgType: 'panda',
    bgHex: '#A8E6CF',
  },
  {
    id: 'elephant',
    name: { en: 'Elli Elephant', id: 'Gajah Elli' },
    role: { en: 'Gentle Giant', id: 'Sahabat Baik' },
    starsRequired: 35,
    svgType: 'elephant',
    bgHex: '#A8D8F0',
  },
  {
    id: 'koala',
    name: { en: 'Koko Koala', id: 'Koala Koko' },
    role: { en: 'Dream Explorer', id: 'Penjelajah Mimpi' },
    starsRequired: 45,
    svgType: 'koala',
    bgHex: '#D7C4F5',
  },
];

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first-star',
    title: { en: 'First Shining Star', id: 'Bintang Pertama' },
    description: {
      en: 'Complete your very first mini-game!',
      id: 'Selesaikan mini-game pertamamu!',
    },
    icon: 'Star',
    bgHex: '#FFF1A8',
    checkUnlocked: (p) => p.totalStars >= 1,
  },
  {
    id: 'five-games',
    title: { en: 'Curious Explorer', id: 'Penjelajah Cilik' },
    description: {
      en: 'Finish 5 different mini-games.',
      id: 'Selesaikan 5 mini-game yang berbeda.',
    },
    icon: 'Compass',
    bgHex: '#A8D8F0',
    checkUnlocked: (p) => Object.keys(p.starsByGame).length >= 5,
  },
  {
    id: 'fifteen-stars',
    title: { en: 'Star Collector', id: 'Pengumpul Bintang' },
    description: {
      en: 'Earn 15 stars across all activities.',
      id: 'Kumpulkan 15 bintang dari semua permainan.',
    },
    icon: 'Sparkles',
    bgHex: '#FFB7C5',
    checkUnlocked: (p) => p.totalStars >= 15,
  },
  {
    id: 'alphabet-ace',
    title: { en: 'Alphabet Friend', id: 'Sahabat Huruf' },
    description: {
      en: 'Try 3 games in Alphabet & Literacy.',
      id: 'Mainkan 3 permainan di Huruf & Literasi.',
    },
    icon: 'BookOpen',
    bgHex: '#FFB7C5',
    checkUnlocked: (p) =>
      GAMES_REGISTRY.filter(
        (g) => g.categoryId === 'alphabet' && (p.starsByGame[g.id] ?? 0) > 0
      ).length >= 3,
  },
  {
    id: 'math-whiz',
    title: { en: 'Counting Star', id: 'Jago Menghitung' },
    description: {
      en: 'Try 3 games in Numbers & Math.',
      id: 'Mainkan 3 permainan di Angka & Berhitung.',
    },
    icon: 'Calculator',
    bgHex: '#A8D8F0',
    checkUnlocked: (p) =>
      GAMES_REGISTRY.filter(
        (g) => g.categoryId === 'math' && (p.starsByGame[g.id] ?? 0) > 0
      ).length >= 3,
  },
  {
    id: 'nature-lover',
    title: { en: 'Animal Buddy', id: 'Pecinta Hewan' },
    description: {
      en: 'Try 3 games in Animals & Nature.',
      id: 'Mainkan 3 permainan di Hewan & Alam.',
    },
    icon: 'PawPrint',
    bgHex: '#A8E6CF',
    checkUnlocked: (p) =>
      GAMES_REGISTRY.filter(
        (g) => g.categoryId === 'animals' && (p.starsByGame[g.id] ?? 0) > 0
      ).length >= 3,
  },
  {
    id: 'all-rounder',
    title: { en: 'All-Category Adventurer', id: 'Petualang Semua Kategori' },
    description: {
      en: 'Play at least one game in all 6 categories.',
      id: 'Mainkan minimal satu permainan di semua 6 kategori.',
    },
    icon: 'Award',
    bgHex: '#D7C4F5',
    checkUnlocked: (p) => {
      const cats = new Set(
        GAMES_REGISTRY.filter((g) => (p.starsByGame[g.id] ?? 0) > 0).map(
          (g) => g.categoryId
        )
      );
      return cats.size >= 6;
    },
  },
  {
    id: 'master-thirty',
    title: { en: 'LittlePlay Champion', id: 'Juara LittlePlay' },
    description: {
      en: 'Complete all 30 educational mini-games!',
      id: 'Selesaikan semua 30 mini-game edukasi!',
    },
    icon: 'Trophy',
    bgHex: '#FFF1A8',
    checkUnlocked: (p) => Object.keys(p.starsByGame).length >= 30,
  },
];
