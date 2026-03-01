// This file aggregates all Japanese learning content from specialized modules.
// It serves as the unified data layer for all app components.

import {
  HIRAGANA as RAW_HIRAGANA,
  KATAKANA as RAW_KATAKANA,
  N5_KANJI as RAW_N5_KANJI,
  N4_KANJI as RAW_N4_KANJI,
  N5_GRAMMAR as RAW_N5_GRAMMAR,
  N5_VOCABULARY as RAW_N5_VOCABULARY
} from './CompleteJapaneseContent';

import { ZEN_LEXICON as RAW_ZEN_LEXICON } from './ZenLexiconData';
import { ZEN_GRAMMAR as RAW_ZEN_GRAMMAR } from './ZenGrammarData';
import { MASSIVE_SENTENCES as RAW_MASSIVE_SENTENCES } from './MassiveSentences';
import { N5_KANJI_MASSIVE, N4_KANJI_MASSIVE } from './MassiveKanji';
import { MASSIVE_STORIES as RAW_MASSIVE_STORIES } from './MassiveStories';

// ==================== INITIALIZATION & CORE STATICS ====================

/**
 * Robustly flattens grammar levels into a unified array.
 */
function getCombinedGrammar(source) {
  if (!source) return [];
  const result = [];
  try {
    ['N5', 'N4', 'N3', 'N2', 'N1'].forEach(lvl => {
      if (source[lvl] && Array.isArray(source[lvl])) {
        source[lvl].forEach(item => {
          result.push({ ...item, level: item.level || lvl });
        });
      }
    });

    Object.entries(source).forEach(([key, val]) => {
      if (!['N5', 'N4', 'N3', 'N2', 'N1'].includes(key) && Array.isArray(val)) {
        val.forEach(item => result.push({ ...item, level: item.level || key }));
      }
    });
  } catch (e) {
    console.error("Critical: Failed to flatten grammar data.", e);
  }
  return result;
}

// ==================== RESTORED CONSTANTS ====================

export const RANDOM_NAMES = [
  'Sakura Learner', 'Tokyo Student', 'Kanji Master', 'Hiragana Hero', 'Nihon Explorer',
  'Japanese Seeker', 'Language Warrior', 'Study Ninja', 'Kana Champion', 'Culture Fan',
  'Rising Sun', 'Cherry Blossom', 'Mountain Peak', 'Ocean Wave', 'Star Light',
  'Moon Walker', 'Dragon Spirit', 'Phoenix Rise', 'Tiger Claw', 'Eagle Eye',
  'Swift Wind', 'Calm Water', 'Bright Fire', 'Solid Earth', 'Pure Sky'
];

export const AVATAR_EMOJIS = [
  '🌸', '🎌', '🗾', '🏯', '⛩️', '🎎', '🎏', '🍣', '🍱', '🍙',
  '🍜', '🍵', '🌺', '🌊', '🗻', '🐉', '🦊', '🐼', '🐱', '🐶',
  '🦁', '🐯', '🦅', '🌟', '💫', '⭐', '🌙', '☀️', '🔥', '💧'
];

export const LEVEL_TITLES = {
  1: 'Beginner',
  3: 'Novice',
  5: 'Apprentice',
  8: 'Student',
  12: 'Learner',
  15: 'Scholar',
  20: 'Adept',
  25: 'Expert',
  30: 'Master',
  40: 'Sensei',
  50: 'Sage',
  75: 'Legend',
  100: 'Grandmaster'
};

export const BADGES = [
  { id: 'first_lesson', name: 'First Steps', icon: '👣', description: 'Complete your first lesson' },
  { id: 'hiragana_master', name: 'Hiragana Master', icon: 'あ', description: 'Learn all hiragana' },
  { id: 'katakana_pro', name: 'Katakana Pro', icon: 'ア', description: 'Learn all katakana' },
  { id: 'kana_ninja', name: 'Kana Ninja', icon: '🥷', description: 'Master both kana systems' },
  { id: 'vocab_100', name: 'Word Collector', icon: '📚', description: 'Learn 100 vocabulary words' },
  { id: 'kanji_50', name: 'Kanji Apprentice', icon: '漢', description: 'Learn 50 kanji' },
  { id: 'streak_7', name: 'Week Warrior', icon: '🔥', description: '7 day learning streak' },
  { id: 'streak_30', name: 'Month Master', icon: '💪', description: '30 day learning streak' },
  { id: 'perfect_quiz', name: 'Perfect Score', icon: '💯', description: 'Get 100% on a quiz' },
  { id: 'n5_ready', name: 'N5 Ready', icon: '🎯', description: 'Complete all N5 content' },
];

// ==================== EXPORTED DATA LAYERS ====================

// KANA
export const HIRAGANA = RAW_HIRAGANA || [];
export const KATAKANA = RAW_KATAKANA || [];

// KANJI
export const N5_KANJI = (N5_KANJI_MASSIVE && N5_KANJI_MASSIVE.length > 0) ? N5_KANJI_MASSIVE : (RAW_N5_KANJI || []);
export const N4_KANJI = (N4_KANJI_MASSIVE && N4_KANJI_MASSIVE.length > 0) ? N4_KANJI_MASSIVE : (RAW_N4_KANJI || []);

// GRAMMAR
export const ZEN_GRAMMAR = RAW_ZEN_GRAMMAR || { N5: [], N4: [] };
export const COMBINED_GRAMMAR = getCombinedGrammar(ZEN_GRAMMAR);
export const N5_GRAMMAR = RAW_N5_GRAMMAR || (ZEN_GRAMMAR.N5 || []);
export const N4_GRAMMAR = ZEN_GRAMMAR.N4 || [];
export const N3_GRAMMAR = ZEN_GRAMMAR.N3 || [];
export const N2_GRAMMAR = ZEN_GRAMMAR.N2 || [];
export const N1_GRAMMAR = ZEN_GRAMMAR.N1 || [];

// VOCABULARY
export const ZEN_LEXICON = RAW_ZEN_LEXICON || [];
export const N5_VOCABULARY = RAW_N5_VOCABULARY || [];
export const N4_VOCABULARY = []; // Currently empty placeholder

// READING & SENTENCES
export const MASSIVE_SENTENCES = RAW_MASSIVE_SENTENCES || [];
export const MASSIVE_STORIES = RAW_MASSIVE_STORIES || [];

// ==================== CLEANED / SPECIALIZED EXPORTS ====================
export const ZEN_LEXICON_CLEAN = ZEN_LEXICON;
export const ZEN_GRAMMAR_CLEAN = COMBINED_GRAMMAR;
export const COMBINED_GRAMMAR_CLEAN = COMBINED_GRAMMAR;

// Default export
const JapaneseData = {
  HIRAGANA,
  KATAKANA,
  N5_KANJI,
  N4_KANJI,
  N5_GRAMMAR,
  N4_GRAMMAR,
  N3_GRAMMAR,
  N2_GRAMMAR,
  N1_GRAMMAR,
  N5_VOCABULARY,
  N4_VOCABULARY,
  ZEN_LEXICON,
  ZEN_GRAMMAR,
  COMBINED_GRAMMAR,
  MASSIVE_SENTENCES,
  MASSIVE_STORIES,
  ZEN_LEXICON_CLEAN,
  ZEN_GRAMMAR_CLEAN,
  COMBINED_GRAMMAR_CLEAN,
  RANDOM_NAMES,
  AVATAR_EMOJIS,
  LEVEL_TITLES,
  BADGES
};


export default JapaneseData;
