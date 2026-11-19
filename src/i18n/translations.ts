import { Language } from '../types';

export const UI_TEXT = {
  brand: {
    title: { en: 'LittlePlay', id: 'LittlePlay' },
    tagline: { en: 'Learn, Play & Grow!', id: 'Belajar, Bermain & Tumbuh!' },
  },
  nav: {
    home: { en: 'Home', id: 'Beranda' },
    categories: { en: 'Games', id: 'Permainan' },
    rewards: { en: 'Rewards', id: 'Hadiah' },
    parents: { en: 'Parents', id: 'Orang Tua' },
    settings: { en: 'Settings', id: 'Pengaturan' },
  },
  home: {
    heroTitle: {
      en: 'Playful Early Learning for Curious Little Minds',
      id: 'Belajar Sambil Bermain untuk Anak Usia Dini',
    },
    heroDesc: {
      en: '30 gentle, bilingual mini-games designed for ages 3 to 5—no timers, no ads, just joyful discovery in English and Bahasa Indonesia.',
      id: '30 mini-game dwibahasa yang ramah untuk usia 3–5 tahun—tanpa batas waktu, tanpa iklan, penuh keseruan dalam Bahasa Indonesia dan Inggris.',
    },
    startPlaying: { en: 'Start Playing', id: 'Mulai Bermain' },
    viewRewards: { en: 'My Star Box', id: 'Kotak Bintangku' },
    categoriesHeading: { en: 'Choose a Learning World', id: 'Pilih Dunia Belajar' },
    categoriesSub: {
      en: 'Six colorful worlds with five interactive games in each.',
      id: 'Enam dunia penuh warna dengan lima permainan seru di setiap dunia.',
    },
    gamesCount: { en: '5 Games', id: '5 Permainan' },
    buddyGreeting: {
      en: 'Hi friend! Ready to play and earn stars today?',
      id: 'Hai teman! Siap bermain dan mengumpulkan bintang hari ini?',
    },
    ageModeLabel: { en: 'Age Focus', id: 'Fokus Usia' },
    yearsOld: { en: 'Years', id: 'Tahun' },
  },
  category: {
    backHome: { en: 'All Worlds', id: 'Semua Dunia' },
    playNow: { en: 'Play', id: 'Main' },
    playAgain: { en: 'Play Again', id: 'Main Lagi' },
    recommendedFor: { en: 'Great for ages', id: 'Cocok untuk usia' },
    completed: { en: 'Played', id: 'Selesai' },
  },
  game: {
    backToCategory: { en: 'Back', id: 'Kembali' },
    round: { en: 'Round', id: 'Babak' },
    of: { en: 'of', id: 'dari' },
    listenAgain: { en: 'Listen', id: 'Dengar' },
    positiveDefault: {
      en: "Amazing! That's right!",
      id: 'Hebat! Jawabanmu benar!',
    },
    hintDefault: {
      en: "Almost! Let's try one more time!",
      id: 'Hampir tepat! Ayo coba sekali lagi!',
    },
    completeTitle: {
      en: 'Hooray! You Did It!',
      id: 'Hore! Kamu Berhasil!',
    },
    completeDesc: {
      en: 'You finished all 3 rounds and earned shiny stars!',
      id: 'Kamu menyelesaikan semua 3 babak dan meraih bintang!',
    },
    starsEarned: { en: 'Stars Earned', id: 'Bintang Diraih' },
    nextRound: { en: 'Next Round', id: 'Babak Berikutnya' },
    finishBack: { en: 'Back to Games', id: 'Kembali ke Daftar' },
  },
  rewards: {
    title: { en: 'Rewards & Star Collection', id: 'Koleksi Hadiah & Bintang' },
    subtitle: {
      en: 'Every game you finish helps your animal friends grow!',
      id: 'Setiap permainan yang selesai membantu teman hewanmu berkumpul!',
    },
    totalStars: { en: 'Total Stars', id: 'Total Bintang' },
    gamesCompleted: { en: 'Games Completed', id: 'Permainan Selesai' },
    badgesUnlocked: { en: 'Badges Earned', id: 'Lencana Terkumpul' },
    friendsSection: { en: 'Animal Friends', id: 'Teman Hewan' },
    friendsDesc: {
      en: 'Collect stars to welcome new animal buddies. Tap an unlocked friend to bring them along!',
      id: 'Kumpulkan bintang untuk membuka teman hewan baru. Sentuh teman yang terbuka untuk menemaniku!',
    },
    selectedBuddy: { en: 'Active Buddy', id: 'Teman Aktif' },
    selectBuddy: { en: 'Choose Buddy', id: 'Pilih Teman' },
    needStars: { en: 'Need {n} stars', id: 'Butuh {n} bintang' },
    badgesSection: { en: 'Achievement Badges', id: 'Lencana Pencapaian' },
    unlocked: { en: 'Unlocked', id: 'Terbuka' },
    keepPlaying: { en: 'Keep playing', id: 'Terus bermain' },
  },
  parents: {
    title: { en: 'Parent & Teacher Corner', id: 'Ruang Orang Tua & Guru' },
    subtitle: {
      en: 'Track learning progress, adjust age recommendations, and manage local data.',
      id: 'Pantau perkembangan belajar, lihat rekomendasi usia, dan kelola data lokal.',
    },
    gateTitle: { en: 'Quick Grown-Up Check', id: 'Verifikasi Orang Tua' },
    gateDesc: {
      en: 'Please solve this simple question to enter the Parent Dashboard.',
      id: 'Jawab pertanyaan sederhana ini untuk masuk ke Dasbor Orang Tua.',
    },
    gatePlaceholder: { en: 'Type answer...', id: 'Ketik jawaban...' },
    gateSubmit: { en: 'Unlock', id: 'Buka' },
    gateError: {
      en: 'Not quite—please check the sum and try again.',
      id: 'Belum tepat—silakan periksa hitungan dan coba lagi.',
    },
    totalCompleted: { en: 'Unique Games Played', id: 'Permainan Diselesaikan' },
    totalStars: { en: 'Total Stars Earned', id: 'Total Bintang Diraih' },
    categoriesExplored: { en: 'Categories Explored', id: 'Kategori Dijelajahi' },
    totalSessions: { en: 'Play Sessions', id: 'Sesi Bermain' },
    categoryProgress: { en: 'Learning Category Progress', id: 'Kemajuan Kategori Belajar' },
    ageRecommendations: { en: 'Age-Based Learning Recommendations', id: 'Rekomendasi Belajar Sesuai Usia' },
    age3Rec: {
      en: 'Age 3 Focus: Sound recognition, big vs. small comparisons, basic color matching, and gentle counting 1–5.',
      id: 'Fokus Usia 3: Mengenal suara hewan, perbandingan besar-kecil, mencocokkan warna dasar, dan berhitung 1–5.',
    },
    age4Rec: {
      en: 'Age 4 Focus: Letter-to-picture phonics, shape sorting, simple patterns, and animal habitats.',
      id: 'Fokus Usia 4: Huruf ke gambar, mengelompokkan bentuk, pola warna sederhana, dan habitat hewan.',
    },
    age5Rec: {
      en: 'Age 5 Focus: Letter tracing, little addition, missing number trains, spot-the-difference, and mazes.',
      id: 'Fokus Usia 5: Menebalkan huruf, penjumlahan kecil, deret angka hilang, cari perbedaan, dan labirin.',
    },
    recentHistory: { en: 'Recent Game History', id: 'Riwayat Permainan Terbaru' },
    noHistory: {
      en: 'No games completed yet. Let your child try any world from Home!',
      id: 'Belum ada permainan yang selesai. Ajak anak mencoba dari Beranda!',
    },
    colGame: { en: 'Mini-Game', id: 'Permainan' },
    colCategory: { en: 'Category', id: 'Kategori' },
    colStars: { en: 'Stars', id: 'Bintang' },
    colWhen: { en: 'Completed', id: 'Selesai' },
    quickSettings: { en: 'Quick Language & Age', id: 'Bahasa & Usia Cepat' },
    resetZoneTitle: { en: 'Reset Local Progress', id: 'Atur Ulang Kemajuan' },
    resetZoneDesc: {
      en: 'Clears earned stars, history, and unlocked characters stored on this device. No personal data is collected.',
      id: 'Menghapus bintang, riwayat, dan karakter terbuka di perangkat ini. Tidak ada data pribadi yang dikumpulkan.',
    },
    resetBtn: { en: 'Reset All Progress', id: 'Hapus Semua Kemajuan' },
    resetConfirmTitle: { en: 'Confirm Reset?', id: 'Yakin Hapus Kemajuan?' },
    resetConfirmDesc: {
      en: 'All stars and game history on this browser will return to zero.',
      id: 'Semua bintang dan riwayat permainan di peramban ini akan kembali ke nol.',
    },
    cancel: { en: 'Cancel', id: 'Batal' },
    confirmReset: { en: 'Yes, Reset', id: 'Ya, Hapus' },
    privacyNote: {
      en: 'Privacy-first: 100% offline-ready storage on your device. Zero ads, zero tracking.',
      id: 'Utamakan privasi: Penyimpanan lokal di perangkat Anda. Tanpa iklan, tanpa pelacakan.',
    },
  },
  settings: {
    title: { en: 'Settings', id: 'Pengaturan' },
    subtitle: {
      en: 'Customize language, voice guidance, sound effects, and offline app installation.',
      id: 'Atur bahasa, suara panduan, efek suara, dan pemasangan aplikasi offline.',
    },
    languageLabel: { en: 'Language / Bahasa', id: 'Bahasa / Language' },
    languageDesc: {
      en: 'Switches every menu, game instruction, and spoken voice between English and Bahasa Indonesia.',
      id: 'Mengubah seluruh menu, instruksi permainan, dan panduan suara antara Bahasa Indonesia dan Inggris.',
    },
    soundEffects: { en: 'Playful Sound Effects', id: 'Efek Suara Ceria' },
    soundDesc: {
      en: 'Gentle xylophone chimes, animal sounds, and celebration melodies.',
      id: 'Suara xilofon lembut, suara hewan, dan melodi perayaan.',
    },
    voiceGuide: { en: 'Spoken Voice Instructions', id: 'Panduan Suara Bicara' },
    voiceDesc: {
      en: 'Reads prompts and positive feedback aloud in the selected language.',
      id: 'Membacakan petunjuk dan pujian dengan suara sesuai bahasa terpilih.',
    },
    volumeLabel: { en: 'Master Volume', id: 'Volume Suara' },
    ageLabel: { en: 'Child Age Group', id: 'Usia Anak' },
    ageDesc: {
      en: 'Highlights recommended games in the Parent Dashboard.',
      id: 'Menyoroti permainan yang direkomendasikan di Dasbor Orang Tua.',
    },
    installAppTitle: { en: 'Install LittlePlay App', id: 'Pasang Aplikasi LittlePlay' },
    installAppDesc: {
      en: 'Install on your tablet, phone, or computer for instant offline play.',
      id: 'Pasang di tablet, ponsel, atau komputer untuk bermain tanpa internet.',
    },
    installedBadge: { en: 'App installed on this device', id: 'Aplikasi sudah terpasang di perangkat ini' },
    offlineReady: { en: 'Offline Ready', id: 'Siap Offline' },
    on: { en: 'On', id: 'Aktif' },
    off: { en: 'Off', id: 'Mati' },
  },
  pwa: {
    installBtn: { en: 'Install App', id: 'Pasang Aplikasi' },
    installIosBtn: { en: 'Install on iOS', id: 'Pasang di iOS' },
    iosTitle: { en: 'Install on iPhone / iPad', id: 'Pasang di iPhone / iPad' },
    iosStep1: { en: '1. Tap the Share button in Safari.', id: '1. Sentuh tombol Bagikan (Share) di Safari.' },
    iosStep2: { en: '2. Tap "Add to Home Screen".', id: '2. Pilih "Tambah ke Layar Utama" (Add to Home Screen).' },
    close: { en: 'Close', id: 'Tutup' },
    offlineBanner: {
      en: 'Offline Mode — Playing with saved games & progress',
      id: 'Mode Offline — Bermain dengan permainan & progres tersimpan',
    },
  },
};

export function t(
  obj: { en: string; id: string },
  lang: Language
): string {
  return obj[lang];
}
