# SYOUSA - Advanced Japanese Learning System

SYOUSA is a premium, AI-powered Japanese learning platform designed with a high-end "Neon glassmorphism" aesthetic. It provides a comprehensive suite of tools for mastering JLPT levels (N5-N4) through immersive practice, interactive hubs, and neural-tuned UI/UX.

## 🚀 Key Features

- **Mastery Dashboard**: Real-time stats tracking including Kanji proficiency, vocabulary count, and XP-based level progression.
- **Kanji Hub**: Interactive Kanji library with Level filtering (N5/N4), detailed meanings (English/Bengali), stroke counts, and stroke-order visualizations.
- **Vocab & Grammar Hubs**: Categorized learning modules with pronunciation support and usage examples.
- **Practice Zones**:
  - **Writing Dojo**: Multi-stroke character recognition and whiteboard mode.
  - **Shadowing Practice**: Voice-enabled shadowing with real-time feedback.
  - **Mock Tests**: Full JLPT-style examination simulator with advanced scoring.
  - **Reading Practice**: Guided stories with multi-language translations and instant word lookup.
- **Zen Library**: E-book and PDF viewer integrated directly into the workspace.
- **Dynamic Audio**: Neural-synthesized speech for every character and word, coupled with an ambient background music system.

---

## 🛠️ Data Management (Adding Content)

All learning content is stored in modular JavaScript files within `src/data/`.

### 1. Adding Kanji
Modify `src/data/JapaneseData.js` or `src/data/CompleteJapaneseContent.js`.
Add a new object to the `N5_KANJI` or `N4_KANJI` array:
```javascript
{
  kanji: '火',
  onyomi: 'カ',
  kunyomi: 'ひ',
  meaning: 'fire',
  bn: 'আগুন',
  level: 'N5',
  strokes: 4,
  examples: [
    { word: '火曜日', reading: 'かようび', meaning: 'Tuesday' }
  ]
}
```

### 2. Adding Vocabulary
Modify `src/data/MassiveN5Vocab.js` (or similar).
```javascript
{
  id: 'v101',
  kana: 'ねこ',
  kanji: '猫',
  romaji: 'neko',
  en: 'cat',
  category: 'animals',
  sentence: { 
    jp: '猫が好きです。', 
    romaji: 'Neko ga suki desu.', 
    en: 'I like cats.' 
  }
}
```

### 3. Adding Reading Passages
Modify `src/data/CompleteJapaneseContent.js` in the `READING_PASSAGES` array.
Each passage supports English, Japanese (with Romaji), and Bengali.

---

## 🎨 Customization

### Changing Audio Tracks
The ambient music system is managed in `src/context/AudioContext.js`.
1. Add your `.mp3` files to the `public/audio/` directory.
2. Update the `TRACKS` array in `AudioContext.js`:
```javascript
const TRACKS = [
  { id: 'lofi', url: '/audio/lofi-study.mp3', label: 'Lofi Zen' },
  { id: 'nature', url: '/audio/forest.mp3', label: 'Kyoto Forest' }
];
```

### Modifying Colors & Themes
The application uses **Tailwind CSS**. 
- **Global Styles**: Defined in `src/index.css`. Look for the `:root` and `.dark` selectors for primary color tokens.
- **Glassmorphism**: Most components use the `.glass` utility class defined in `index.css`.
- **Primary Branding**: Primarily uses `rose-500` and `slate-950`.

---

## 🌐 Vercel Hosting Guide

This project is built with React (via CRACO) and is optimized for Vercel deployment.

### 1. Pre-deployment Checklist
- Ensure you have a Vercel account.
- Install the Vercel CLI: `npm i -g vercel`.

### 2. Deployment Steps
1. Push your code to a GitHub repository.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" > "Project"**.
3. Import your repository.
4. **Framework Preset**: Select "Other" or "Create React App" (Vercel usually detects this automatically).
5. **Build/Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Click **Deploy**.

### 3. Environment Variables (If needed)
If you add an API backend later, you can configure secrets in the Vercel Dashboard under **Settings > Environment Variables**.

---

## 💻 Tech Stack
- **Frontend**: React 19, Tailwind CSS
- **Routing**: React Router 7
- **UI Components**: Radix UI, Lucide Icons
- **Animation**: Tailwind Animate
- **Audio**: Web Audio API & SpeechSynthesis
- **Deployment**: Vercel
