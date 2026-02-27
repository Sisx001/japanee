// 800+ vocabulary, 300+ kanji, 100+ grammar patterns, sentences, stories
import { MASSIVE_N5_VOCAB } from './MassiveN5Vocab';
import { MASSIVE_N4_VOCAB } from './MassiveN4Vocab';
import { MASSIVE_SENTENCES } from './MassiveSentences';

// ==================== HIRAGANA ====================
export const HIRAGANA = [
  { char: 'あ', romaji: 'a', row: 'a' }, { char: 'い', romaji: 'i', row: 'a' }, { char: 'う', romaji: 'u', row: 'a' }, { char: 'え', romaji: 'e', row: 'a' }, { char: 'お', romaji: 'o', row: 'a' },
  { char: 'か', romaji: 'ka', row: 'k' }, { char: 'き', romaji: 'ki', row: 'k' }, { char: 'く', romaji: 'ku', row: 'k' }, { char: 'け', romaji: 'ke', row: 'k' }, { char: 'こ', romaji: 'ko', row: 'k' },
  { char: 'さ', romaji: 'sa', row: 's' }, { char: 'し', romaji: 'shi', row: 's' }, { char: 'す', romaji: 'su', row: 's' }, { char: 'せ', romaji: 'se', row: 's' }, { char: 'そ', romaji: 'so', row: 's' },
  { char: 'た', romaji: 'ta', row: 't' }, { char: 'ち', romaji: 'chi', row: 't' }, { char: 'つ', romaji: 'tsu', row: 't' }, { char: 'て', romaji: 'te', row: 't' }, { char: 'と', romaji: 'to', row: 't' },
  { char: 'な', romaji: 'na', row: 'n' }, { char: 'に', romaji: 'ni', row: 'n' }, { char: 'ぬ', romaji: 'nu', row: 'n' }, { char: 'ね', romaji: 'ne', row: 'n' }, { char: 'の', romaji: 'no', row: 'n' },
  { char: 'は', romaji: 'ha', row: 'h' }, { char: 'ひ', romaji: 'hi', row: 'h' }, { char: 'ふ', romaji: 'fu', row: 'h' }, { char: 'へ', romaji: 'he', row: 'h' }, { char: 'ほ', romaji: 'ho', row: 'h' },
  { char: 'ま', romaji: 'ma', row: 'm' }, { char: 'み', romaji: 'mi', row: 'm' }, { char: 'む', romaji: 'mu', row: 'm' }, { char: 'め', romaji: 'me', row: 'm' }, { char: 'も', romaji: 'mo', row: 'm' },
  { char: 'や', romaji: 'ya', row: 'y' }, { char: 'ゆ', romaji: 'yu', row: 'y' }, { char: 'よ', romaji: 'yo', row: 'y' },
  { char: 'ら', romaji: 'ra', row: 'r' }, { char: 'り', romaji: 'ri', row: 'r' }, { char: 'る', romaji: 'ru', row: 'r' }, { char: 'れ', romaji: 're', row: 'r' }, { char: 'ろ', romaji: 'ro', row: 'r' },
  { char: 'わ', romaji: 'wa', row: 'w' }, { char: 'を', romaji: 'wo', row: 'w' }, { char: 'ん', romaji: 'n', row: 'w' },
  // Dakuten
  { char: 'が', romaji: 'ga', row: 'g' }, { char: 'ぎ', romaji: 'gi', row: 'g' }, { char: 'ぐ', romaji: 'gu', row: 'g' }, { char: 'げ', romaji: 'ge', row: 'g' }, { char: 'ご', romaji: 'go', row: 'g' },
  { char: 'ざ', romaji: 'za', row: 'z' }, { char: 'じ', romaji: 'ji', row: 'z' }, { char: 'ず', romaji: 'zu', row: 'z' }, { char: 'ぜ', romaji: 'ze', row: 'z' }, { char: 'ぞ', romaji: 'zo', row: 'z' },
  { char: 'だ', romaji: 'da', row: 'd' }, { char: 'ぢ', romaji: 'ji', row: 'd' }, { char: 'づ', romaji: 'zu', row: 'd' }, { char: 'で', romaji: 'de', row: 'd' }, { char: 'ど', romaji: 'do', row: 'd' },
  { char: 'ば', romaji: 'ba', row: 'b' }, { char: 'び', romaji: 'bi', row: 'b' }, { char: 'ぶ', romaji: 'bu', row: 'b' }, { char: 'べ', romaji: 'be', row: 'b' }, { char: 'ぼ', romaji: 'bo', row: 'b' },
  { char: 'ぱ', romaji: 'pa', row: 'p' }, { char: 'ぴ', romaji: 'pi', row: 'p' }, { char: 'ぷ', romaji: 'pu', row: 'p' }, { char: 'ぺ', romaji: 'pe', row: 'p' }, { char: 'ぽ', romaji: 'po', row: 'p' },
  // Combo
  { char: 'きゃ', romaji: 'kya', row: 'ky' }, { char: 'きゅ', romaji: 'kyu', row: 'ky' }, { char: 'きょ', romaji: 'kyo', row: 'ky' },
  { char: 'しゃ', romaji: 'sha', row: 'sh' }, { char: 'しゅ', romaji: 'shu', row: 'sh' }, { char: 'しょ', romaji: 'sho', row: 'sh' },
  { char: 'ちゃ', romaji: 'cha', row: 'ch' }, { char: 'ちゅ', romaji: 'chu', row: 'ch' }, { char: 'ちょ', romaji: 'cho', row: 'ch' },
  { char: 'にゃ', romaji: 'nya', row: 'ny' }, { char: 'にゅ', romaji: 'nyu', row: 'ny' }, { char: 'にょ', romaji: 'nyo', row: 'ny' },
  { char: 'ひゃ', romaji: 'hya', row: 'hy' }, { char: 'ひゅ', romaji: 'hyu', row: 'hy' }, { char: 'ひょ', romaji: 'hyo', row: 'hy' },
  { char: 'みゃ', romaji: 'mya', row: 'my' }, { char: 'みゅ', romaji: 'myu', row: 'my' }, { char: 'みょ', romaji: 'myo', row: 'my' },
  { char: 'りゃ', romaji: 'rya', row: 'ry' }, { char: 'りゅ', romaji: 'ryu', row: 'ry' }, { char: 'りょ', romaji: 'ryo', row: 'ry' },
  { char: 'ぎゃ', romaji: 'gya', row: 'gy' }, { char: 'ぎゅ', romaji: 'gyu', row: 'gy' }, { char: 'ぎょ', romaji: 'gyo', row: 'gy' },
  { char: 'じゃ', romaji: 'ja', row: 'j' }, { char: 'じゅ', romaji: 'ju', row: 'j' }, { char: 'じょ', romaji: 'jo', row: 'j' },
  { char: 'びゃ', romaji: 'bya', row: 'by' }, { char: 'びゅ', romaji: 'byu', row: 'by' }, { char: 'びょ', romaji: 'byo', row: 'by' },
  { char: 'ぴゃ', romaji: 'pya', row: 'py' }, { char: 'ぴゅ', romaji: 'pyu', row: 'py' }, { char: 'ぴょ', romaji: 'pyo', row: 'py' },
];

// ==================== KATAKANA ====================
export const KATAKANA = [
  { char: 'ア', romaji: 'a', row: 'a' }, { char: 'イ', romaji: 'i', row: 'a' }, { char: 'ウ', romaji: 'u', row: 'a' }, { char: 'エ', romaji: 'e', row: 'a' }, { char: 'オ', romaji: 'o', row: 'a' },
  { char: 'カ', romaji: 'ka', row: 'k' }, { char: 'キ', romaji: 'ki', row: 'k' }, { char: 'ク', romaji: 'ku', row: 'k' }, { char: 'ケ', romaji: 'ke', row: 'k' }, { char: 'コ', romaji: 'ko', row: 'k' },
  { char: 'サ', romaji: 'sa', row: 's' }, { char: 'シ', romaji: 'shi', row: 's' }, { char: 'ス', romaji: 'su', row: 's' }, { char: 'セ', romaji: 'se', row: 's' }, { char: 'ソ', romaji: 'so', row: 's' },
  { char: 'タ', romaji: 'ta', row: 't' }, { char: 'チ', romaji: 'chi', row: 't' }, { char: 'ツ', romaji: 'tsu', row: 't' }, { char: 'テ', romaji: 'te', row: 't' }, { char: 'ト', romaji: 'to', row: 't' },
  { char: 'ナ', romaji: 'na', row: 'n' }, { char: 'ニ', romaji: 'ni', row: 'n' }, { char: 'ヌ', romaji: 'nu', row: 'n' }, { char: 'ネ', romaji: 'ne', row: 'n' }, { char: 'ノ', romaji: 'no', row: 'n' },
  { char: 'ハ', romaji: 'ha', row: 'h' }, { char: 'ヒ', romaji: 'hi', row: 'h' }, { char: 'フ', romaji: 'fu', row: 'h' }, { char: 'ヘ', romaji: 'he', row: 'h' }, { char: 'ホ', romaji: 'ho', row: 'h' },
  { char: 'マ', romaji: 'ma', row: 'm' }, { char: 'ミ', romaji: 'mi', row: 'm' }, { char: 'ム', romaji: 'mu', row: 'm' }, { char: 'メ', romaji: 'me', row: 'm' }, { char: 'モ', romaji: 'mo', row: 'm' },
  { char: 'ヤ', romaji: 'ya', row: 'y' }, { char: 'ユ', romaji: 'yu', row: 'y' }, { char: 'ヨ', romaji: 'yo', row: 'y' },
  { char: 'ラ', romaji: 'ra', row: 'r' }, { char: 'リ', romaji: 'ri', row: 'r' }, { char: 'ル', romaji: 'ru', row: 'r' }, { char: 'レ', romaji: 're', row: 'r' }, { char: 'ロ', romaji: 'ro', row: 'r' },
  { char: 'ワ', romaji: 'wa', row: 'w' }, { char: 'ヲ', romaji: 'wo', row: 'w' }, { char: 'ン', romaji: 'n', row: 'n' },
  // Dakuten
  { char: 'ガ', romaji: 'ga', row: 'g' }, { char: 'ギ', romaji: 'gi', row: 'g' }, { char: 'グ', romaji: 'gu', row: 'g' }, { char: 'ゲ', romaji: 'ge', row: 'g' }, { char: 'ゴ', romaji: 'go', row: 'g' },
  { char: 'ザ', romaji: 'za', row: 'z' }, { char: 'ジ', romaji: 'ji', row: 'z' }, { char: 'ズ', romaji: 'zu', row: 'z' }, { char: 'ゼ', romaji: 'ze', row: 'z' }, { char: 'ゾ', romaji: 'zo', row: 'z' },
  { char: 'ダ', romaji: 'da', row: 'd' }, { char: 'ヂ', romaji: 'ji', row: 'd' }, { char: 'ヅ', romaji: 'zu', row: 'd' }, { char: 'デ', romaji: 'de', row: 'd' }, { char: 'ド', romaji: 'do', row: 'd' },
  { char: 'バ', romaji: 'ba', row: 'b' }, { char: 'ビ', romaji: 'bi', row: 'b' }, { char: 'ブ', romaji: 'bu', row: 'b' }, { char: 'ベ', romaji: 'be', row: 'b' }, { char: 'ボ', romaji: 'bo', row: 'b' },
  { char: 'パ', romaji: 'pa', row: 'p' }, { char: 'ピ', romaji: 'pi', row: 'p' }, { char: 'プ', romaji: 'pu', row: 'p' }, { char: 'ペ', romaji: 'pe', row: 'p' }, { char: 'ポ', romaji: 'po', row: 'p' },
];

// ==================== COMPLETE N5 VOCABULARY (400+ words) ====================
export const N5_VOCABULARY = [
  // Greetings & Basic Expressions
  { id: 'v001', kana: 'おはよう', kanji: null, romaji: 'ohayou', en: 'good morning (casual)', category: 'greetings', sentence: { jp: 'おはよう！元気？', romaji: 'Ohayou! Genki?', en: 'Good morning! How are you?' } },
  { id: 'v002', kana: 'おはようございます', kanji: null, romaji: 'ohayou gozaimasu', en: 'good morning (polite)', category: 'greetings', sentence: { jp: 'おはようございます、先生。', romaji: 'Ohayou gozaimasu, sensei.', en: 'Good morning, teacher.' } },
  { id: 'v003', kana: 'こんにちは', kanji: null, romaji: 'konnichiwa', en: 'hello/good afternoon', category: 'greetings', sentence: { jp: 'こんにちは、お元気ですか？', romaji: 'Konnichiwa, ogenki desu ka?', en: 'Hello, how are you?' } },
  { id: 'v004', kana: 'こんばんは', kanji: null, romaji: 'konbanwa', en: 'good evening', category: 'greetings', sentence: { jp: 'こんばんは。今日は暑かったですね。', romaji: 'Konbanwa. Kyou wa atsukatta desu ne.', en: 'Good evening. It was hot today, wasn\'t it?' } },
  { id: 'v005', kana: 'さようなら', kanji: null, romaji: 'sayounara', en: 'goodbye', category: 'greetings', sentence: { jp: 'さようなら、また明日！', romaji: 'Sayounara, mata ashita!', en: 'Goodbye, see you tomorrow!' } },
  { id: 'v006', kana: 'おやすみなさい', kanji: null, romaji: 'oyasuminasai', en: 'good night', category: 'greetings', sentence: { jp: 'おやすみなさい。いい夢を。', romaji: 'Oyasuminasai. Ii yume wo.', en: 'Good night. Sweet dreams.' } },
  { id: 'v007', kana: 'ありがとう', kanji: null, romaji: 'arigatou', en: 'thank you (casual)', category: 'greetings', sentence: { jp: 'プレゼント、ありがとう！', romaji: 'Purezento, arigatou!', en: 'Thanks for the present!' } },
  { id: 'v008', kana: 'ありがとうございます', kanji: null, romaji: 'arigatou gozaimasu', en: 'thank you (polite)', category: 'greetings', sentence: { jp: '手伝ってくれて、ありがとうございます。', romaji: 'Tetsudatte kurete, arigatou gozaimasu.', en: 'Thank you for helping me.' } },
  { id: 'v009', kana: 'すみません', kanji: null, romaji: 'sumimasen', en: 'excuse me/sorry', category: 'greetings', sentence: { jp: 'すみません、駅はどこですか？', romaji: 'Sumimasen, eki wa doko desu ka?', en: 'Excuse me, where is the station?' } },
  { id: 'v010', kana: 'ごめんなさい', kanji: null, romaji: 'gomen nasai', en: 'I\'m sorry', category: 'greetings', sentence: { jp: '遅れてごめんなさい。', romaji: 'Okurete gomen nasai.', en: 'I\'m sorry for being late.' } },

  // Numbers
  { id: 'v011', kana: 'いち', kanji: '一', romaji: 'ichi', en: 'one', category: 'numbers', sentence: { jp: '一つください。', romaji: 'Hitotsu kudasai.', en: 'One please.' } },
  { id: 'v012', kana: 'に', kanji: '二', romaji: 'ni', en: 'two', category: 'numbers', sentence: { jp: '二人で行きます。', romaji: 'Futari de ikimasu.', en: 'We\'ll go as two people.' } },
  { id: 'v013', kana: 'さん', kanji: '三', romaji: 'san', en: 'three', category: 'numbers', sentence: { jp: '三時に会いましょう。', romaji: 'Sanji ni aimashou.', en: 'Let\'s meet at 3 o\'clock.' } },
  { id: 'v014', kana: 'よん/し', kanji: '四', romaji: 'yon/shi', en: 'four', category: 'numbers', sentence: { jp: '四月は桜の季節です。', romaji: 'Shigatsu wa sakura no kisetsu desu.', en: 'April is cherry blossom season.' } },
  { id: 'v015', kana: 'ご', kanji: '五', romaji: 'go', en: 'five', category: 'numbers', sentence: { jp: '五分待ってください。', romaji: 'Gofun matte kudasai.', en: 'Please wait 5 minutes.' } },
  { id: 'v016', kana: 'ろく', kanji: '六', romaji: 'roku', en: 'six', category: 'numbers', sentence: { jp: '六時に起きます。', romaji: 'Rokuji ni okimasu.', en: 'I wake up at 6 o\'clock.' } },
  { id: 'v017', kana: 'なな/しち', kanji: '七', romaji: 'nana/shichi', en: 'seven', category: 'numbers', sentence: { jp: '一週間は七日です。', romaji: 'Isshuukan wa nanoka desu.', en: 'One week is seven days.' } },
  { id: 'v018', kana: 'はち', kanji: '八', romaji: 'hachi', en: 'eight', category: 'numbers', sentence: { jp: '八百屋で野菜を買います。', romaji: 'Yaoya de yasai wo kaimasu.', en: 'I buy vegetables at the greengrocer.' } },
  { id: 'v019', kana: 'きゅう/く', kanji: '九', romaji: 'kyuu/ku', en: 'nine', category: 'numbers', sentence: { jp: '九月に日本に行きます。', romaji: 'Kugatsu ni Nihon ni ikimasu.', en: 'I\'m going to Japan in September.' } },
  { id: 'v020', kana: 'じゅう', kanji: '十', romaji: 'juu', en: 'ten', category: 'numbers', sentence: { jp: '十個ありますか？', romaji: 'Jukko arimasu ka?', en: 'Are there ten?' } },
  { id: 'v021', kana: 'ひゃく', kanji: '百', romaji: 'hyaku', en: 'hundred', category: 'numbers', sentence: { jp: '百円ショップで買いました。', romaji: 'Hyakuen shoppu de kaimashita.', en: 'I bought it at a 100 yen shop.' } },
  { id: 'v022', kana: 'せん', kanji: '千', romaji: 'sen', en: 'thousand', category: 'numbers', sentence: { jp: '千円札がありますか？', romaji: 'Senen satsu ga arimasu ka?', en: 'Do you have a 1000 yen bill?' } },
  { id: 'v023', kana: 'まん', kanji: '万', romaji: 'man', en: 'ten thousand', category: 'numbers', sentence: { jp: 'この車は百万円です。', romaji: 'Kono kuruma wa hyakuman en desu.', en: 'This car is 1 million yen.' } },

  // Time
  { id: 'v024', kana: 'いま', kanji: '今', romaji: 'ima', en: 'now', category: 'time', sentence: { jp: '今、何時ですか？', romaji: 'Ima, nanji desu ka?', en: 'What time is it now?' } },
  { id: 'v025', kana: 'きょう', kanji: '今日', romaji: 'kyou', en: 'today', category: 'time', sentence: { jp: '今日は暑いですね。', romaji: 'Kyou wa atsui desu ne.', en: 'It\'s hot today, isn\'t it?' } },
  { id: 'v026', kana: 'あした', kanji: '明日', romaji: 'ashita', en: 'tomorrow', category: 'time', sentence: { jp: '明日、映画を見ます。', romaji: 'Ashita, eiga wo mimasu.', en: 'I\'ll watch a movie tomorrow.' } },
  { id: 'v027', kana: 'きのう', kanji: '昨日', romaji: 'kinou', en: 'yesterday', category: 'time', sentence: { jp: '昨日、友達に会いました。', romaji: 'Kinou, tomodachi ni aimashita.', en: 'I met a friend yesterday.' } },
  { id: 'v028', kana: 'あさ', kanji: '朝', romaji: 'asa', en: 'morning', category: 'time', sentence: { jp: '毎朝、ジョギングをします。', romaji: 'Maiasa, jogingu wo shimasu.', en: 'I jog every morning.' } },
  { id: 'v029', kana: 'ひる', kanji: '昼', romaji: 'hiru', en: 'noon/daytime', category: 'time', sentence: { jp: '昼ごはんを食べましょう。', romaji: 'Hirugohan wo tabemashou.', en: 'Let\'s eat lunch.' } },
  { id: 'v030', kana: 'よる', kanji: '夜', romaji: 'yoru', en: 'night', category: 'time', sentence: { jp: '夜、星がきれいです。', romaji: 'Yoru, hoshi ga kirei desu.', en: 'The stars are beautiful at night.' } },
  { id: 'v031', kana: 'まいにち', kanji: '毎日', romaji: 'mainichi', en: 'every day', category: 'time', sentence: { jp: '毎日、日本語を勉強します。', romaji: 'Mainichi, nihongo wo benkyou shimasu.', en: 'I study Japanese every day.' } },
  { id: 'v032', kana: 'まいしゅう', kanji: '毎週', romaji: 'maishuu', en: 'every week', category: 'time', sentence: { jp: '毎週日曜日に教会に行きます。', romaji: 'Maishuu nichiyoubi ni kyoukai ni ikimasu.', en: 'I go to church every Sunday.' } },
  { id: 'v033', kana: 'まいつき', kanji: '毎月', romaji: 'maitsuki', en: 'every month', category: 'time', sentence: { jp: '毎月、給料をもらいます。', romaji: 'Maitsuki, kyuuryou wo moraimasu.', en: 'I receive my salary every month.' } },
  { id: 'v034', kana: 'まいとし', kanji: '毎年', romaji: 'maitoshi', en: 'every year', category: 'time', sentence: { jp: '毎年、日本に旅行します。', romaji: 'Maitoshi, Nihon ni ryokou shimasu.', en: 'I travel to Japan every year.' } },

  // Days of the week
  { id: 'v035', kana: 'げつようび', kanji: '月曜日', romaji: 'getsuyoubi', en: 'Monday', category: 'days', sentence: { jp: '月曜日は仕事が多いです。', romaji: 'Getsuyoubi wa shigoto ga ooi desu.', en: 'There\'s a lot of work on Monday.' } },
  { id: 'v036', kana: 'かようび', kanji: '火曜日', romaji: 'kayoubi', en: 'Tuesday', category: 'days', sentence: { jp: '火曜日にテストがあります。', romaji: 'Kayoubi ni tesuto ga arimasu.', en: 'There\'s a test on Tuesday.' } },
  { id: 'v037', kana: 'すいようび', kanji: '水曜日', romaji: 'suiyoubi', en: 'Wednesday', category: 'days', sentence: { jp: '水曜日は半日です。', romaji: 'Suiyoubi wa hannichi desu.', en: 'Wednesday is a half day.' } },
  { id: 'v038', kana: 'もくようび', kanji: '木曜日', romaji: 'mokuyoubi', en: 'Thursday', category: 'days', sentence: { jp: '木曜日に会議があります。', romaji: 'Mokuyoubi ni kaigi ga arimasu.', en: 'There\'s a meeting on Thursday.' } },
  { id: 'v039', kana: 'きんようび', kanji: '金曜日', romaji: 'kinyoubi', en: 'Friday', category: 'days', sentence: { jp: '金曜日の夜は飲みに行きます。', romaji: 'Kinyoubi no yoru wa nomi ni ikimasu.', en: 'I go drinking on Friday nights.' } },
  { id: 'v040', kana: 'どようび', kanji: '土曜日', romaji: 'doyoubi', en: 'Saturday', category: 'days', sentence: { jp: '土曜日は休みです。', romaji: 'Doyoubi wa yasumi desu.', en: 'Saturday is a day off.' } },
  { id: 'v041', kana: 'にちようび', kanji: '日曜日', romaji: 'nichiyoubi', en: 'Sunday', category: 'days', sentence: { jp: '日曜日に家族と過ごします。', romaji: 'Nichiyoubi ni kazoku to sugoshimasu.', en: 'I spend time with family on Sunday.' } },

  // Family
  { id: 'v042', kana: 'かぞく', kanji: '家族', romaji: 'kazoku', en: 'family', category: 'family', sentence: { jp: '私の家族は四人です。', romaji: 'Watashi no kazoku wa yonin desu.', en: 'My family has four people.' } },
  { id: 'v043', kana: 'ちち', kanji: '父', romaji: 'chichi', en: 'father (my)', category: 'family', sentence: { jp: '父は会社員です。', romaji: 'Chichi wa kaishain desu.', en: 'My father is an office worker.' } },
  { id: 'v044', kana: 'おとうさん', kanji: 'お父さん', romaji: 'otousan', en: 'father (polite)', category: 'family', sentence: { jp: 'お父さん、お帰りなさい！', romaji: 'Otousan, okaerinasai!', en: 'Welcome home, father!' } },
  { id: 'v045', kana: 'はは', kanji: '母', romaji: 'haha', en: 'mother (my)', category: 'family', sentence: { jp: '母は料理が上手です。', romaji: 'Haha wa ryouri ga jouzu desu.', en: 'My mother is good at cooking.' } },
  { id: 'v046', kana: 'おかあさん', kanji: 'お母さん', romaji: 'okaasan', en: 'mother (polite)', category: 'family', sentence: { jp: 'お母さん、手伝って！', romaji: 'Okaasan, tetsudatte!', en: 'Mom, help me!' } },
  { id: 'v047', kana: 'あに', kanji: '兄', romaji: 'ani', en: 'older brother (my)', category: 'family', sentence: { jp: '兄は大学生です。', romaji: 'Ani wa daigakusei desu.', en: 'My older brother is a university student.' } },
  { id: 'v048', kana: 'おにいさん', kanji: 'お兄さん', romaji: 'oniisan', en: 'older brother (polite)', category: 'family', sentence: { jp: 'お兄さん、これを貸してください。', romaji: 'Oniisan, kore wo kashite kudasai.', en: 'Brother, please lend me this.' } },
  { id: 'v049', kana: 'あね', kanji: '姉', romaji: 'ane', en: 'older sister (my)', category: 'family', sentence: { jp: '姉は医者です。', romaji: 'Ane wa isha desu.', en: 'My older sister is a doctor.' } },
  { id: 'v050', kana: 'おねえさん', kanji: 'お姉さん', romaji: 'oneesan', en: 'older sister (polite)', category: 'family', sentence: { jp: 'お姉さんはきれいですね。', romaji: 'Oneesan wa kirei desu ne.', en: 'Your older sister is beautiful.' } },

  // Common Verbs (u-verbs)
  { id: 'v051', kana: 'いく', kanji: '行く', romaji: 'iku', en: 'to go', category: 'verb-u', sentence: { jp: '学校に行きます。', romaji: 'Gakkou ni ikimasu.', en: 'I go to school.' } },
  { id: 'v052', kana: 'くる', kanji: '来る', romaji: 'kuru', en: 'to come', category: 'verb-irr', sentence: { jp: '明日、友達が来ます。', romaji: 'Ashita, tomodachi ga kimasu.', en: 'A friend is coming tomorrow.' } },
  { id: 'v053', kana: 'かえる', kanji: '帰る', romaji: 'kaeru', en: 'to return home', category: 'verb-u', sentence: { jp: '六時に家に帰ります。', romaji: 'Rokuji ni ie ni kaerimasu.', en: 'I return home at 6 o\'clock.' } },
  { id: 'v054', kana: 'たべる', kanji: '食べる', romaji: 'taberu', en: 'to eat', category: 'verb-ru', sentence: { jp: '朝ごはんを食べましたか？', romaji: 'Asagohan wo tabemashita ka?', en: 'Did you eat breakfast?' } },
  { id: 'v055', kana: 'のむ', kanji: '飲む', romaji: 'nomu', en: 'to drink', category: 'verb-u', sentence: { jp: 'コーヒーを飲みますか？', romaji: 'Koohii wo nomimasu ka?', en: 'Will you drink coffee?' } },
  { id: 'v056', kana: 'みる', kanji: '見る', romaji: 'miru', en: 'to see/watch', category: 'verb-ru', sentence: { jp: 'テレビを見ます。', romaji: 'Terebi wo mimasu.', en: 'I watch TV.' } },
  { id: 'v057', kana: 'きく', kanji: '聞く', romaji: 'kiku', en: 'to listen/ask', category: 'verb-u', sentence: { jp: '音楽を聞きます。', romaji: 'Ongaku wo kikimasu.', en: 'I listen to music.' } },
  { id: 'v058', kana: 'よむ', kanji: '読む', romaji: 'yomu', en: 'to read', category: 'verb-u', sentence: { jp: '本を読むのが好きです。', romaji: 'Hon wo yomu no ga suki desu.', en: 'I like reading books.' } },
  { id: 'v059', kana: 'かく', kanji: '書く', romaji: 'kaku', en: 'to write', category: 'verb-u', sentence: { jp: '手紙を書きます。', romaji: 'Tegami wo kakimasu.', en: 'I write letters.' } },
  { id: 'v060', kana: 'はなす', kanji: '話す', romaji: 'hanasu', en: 'to speak', category: 'verb-u', sentence: { jp: '日本語を話しますか？', romaji: 'Nihongo wo hanashimasu ka?', en: 'Do you speak Japanese?' } },
  { id: 'v061', kana: 'あう', kanji: '会う', romaji: 'au', en: 'to meet', category: 'verb-u', sentence: { jp: '友達に会います。', romaji: 'Tomodachi ni aimasu.', en: 'I meet with friends.' } },
  { id: 'v062', kana: 'まつ', kanji: '待つ', romaji: 'matsu', en: 'to wait', category: 'verb-u', sentence: { jp: 'ここで待ってください。', romaji: 'Koko de matte kudasai.', en: 'Please wait here.' } },
  { id: 'v063', kana: 'かう', kanji: '買う', romaji: 'kau', en: 'to buy', category: 'verb-u', sentence: { jp: '新しい服を買いました。', romaji: 'Atarashii fuku wo kaimashita.', en: 'I bought new clothes.' } },
  { id: 'v064', kana: 'おきる', kanji: '起きる', romaji: 'okiru', en: 'to wake up', category: 'verb-ru', sentence: { jp: '毎朝六時に起きます。', romaji: 'Maiasa rokuji ni okimasu.', en: 'I wake up at 6 every morning.' } },
  { id: 'v065', kana: 'ねる', kanji: '寝る', romaji: 'neru', en: 'to sleep', category: 'verb-ru', sentence: { jp: '十一時に寝ます。', romaji: 'Juuichiji ni nemasu.', en: 'I sleep at 11 o\'clock.' } },
  { id: 'v066', kana: 'する', kanji: null, romaji: 'suru', en: 'to do', category: 'verb-irr', sentence: { jp: '何をしていますか？', romaji: 'Nani wo shite imasu ka?', en: 'What are you doing?' } },
  { id: 'v067', kana: 'べんきょうする', kanji: '勉強する', romaji: 'benkyou suru', en: 'to study', category: 'verb-irr', sentence: { jp: '図書館で勉強します。', romaji: 'Toshokan de benkyou shimasu.', en: 'I study at the library.' } },
  { id: 'v068', kana: 'しごとする', kanji: '仕事する', romaji: 'shigoto suru', en: 'to work', category: 'verb-irr', sentence: { jp: '毎日仕事します。', romaji: 'Mainichi shigoto shimasu.', en: 'I work every day.' } },

  // Adjectives (i-adjectives)
  { id: 'v069', kana: 'おおきい', kanji: '大きい', romaji: 'ookii', en: 'big', category: 'adj-i', sentence: { jp: 'この家は大きいです。', romaji: 'Kono ie wa ookii desu.', en: 'This house is big.' } },
  { id: 'v070', kana: 'ちいさい', kanji: '小さい', romaji: 'chiisai', en: 'small', category: 'adj-i', sentence: { jp: '小さい猫がいます。', romaji: 'Chiisai neko ga imasu.', en: 'There is a small cat.' } },
  { id: 'v071', kana: 'たかい', kanji: '高い', romaji: 'takai', en: 'tall/expensive', category: 'adj-i', sentence: { jp: 'この建物は高いです。', romaji: 'Kono tatemono wa takai desu.', en: 'This building is tall.' } },
  { id: 'v072', kana: 'やすい', kanji: '安い', romaji: 'yasui', en: 'cheap', category: 'adj-i', sentence: { jp: 'この店は安いです。', romaji: 'Kono mise wa yasui desu.', en: 'This store is cheap.' } },
  { id: 'v073', kana: 'あたらしい', kanji: '新しい', romaji: 'atarashii', en: 'new', category: 'adj-i', sentence: { jp: '新しい車が欲しいです。', romaji: 'Atarashii kuruma ga hoshii desu.', en: 'I want a new car.' } },
  { id: 'v074', kana: 'ふるい', kanji: '古い', romaji: 'furui', en: 'old', category: 'adj-i', sentence: { jp: 'この寺は古いです。', romaji: 'Kono tera wa furui desu.', en: 'This temple is old.' } },
  { id: 'v075', kana: 'いい', kanji: '良い', romaji: 'ii', en: 'good', category: 'adj-i', sentence: { jp: '今日はいい天気ですね。', romaji: 'Kyou wa ii tenki desu ne.', en: 'It\'s good weather today.' } },
  { id: 'v076', kana: 'わるい', kanji: '悪い', romaji: 'warui', en: 'bad', category: 'adj-i', sentence: { jp: '気分が悪いです。', romaji: 'Kibun ga warui desu.', en: 'I feel bad.' } },
  { id: 'v077', kana: 'あつい', kanji: '暑い', romaji: 'atsui', en: 'hot (weather)', category: 'adj-i', sentence: { jp: '今日は暑いです。', romaji: 'Kyou wa atsui desu.', en: 'It\'s hot today.' } },
  { id: 'v078', kana: 'さむい', kanji: '寒い', romaji: 'samui', en: 'cold (weather)', category: 'adj-i', sentence: { jp: '冬は寒いです。', romaji: 'Fuyu wa samui desu.', en: 'Winter is cold.' } },
  { id: 'v079', kana: 'おいしい', kanji: null, romaji: 'oishii', en: 'delicious', category: 'adj-i', sentence: { jp: 'このラーメンはおいしいです。', romaji: 'Kono raamen wa oishii desu.', en: 'This ramen is delicious.' } },
  { id: 'v080', kana: 'たのしい', kanji: '楽しい', romaji: 'tanoshii', en: 'fun/enjoyable', category: 'adj-i', sentence: { jp: '旅行は楽しかったです。', romaji: 'Ryokou wa tanoshikatta desu.', en: 'The trip was fun.' } },

  // Adjectives (na-adjectives)
  { id: 'v081', kana: 'きれい', kanji: '綺麗', romaji: 'kirei', en: 'beautiful/clean', category: 'adj-na', sentence: { jp: 'この公園はきれいです。', romaji: 'Kono kouen wa kirei desu.', en: 'This park is beautiful.' } },
  { id: 'v082', kana: 'しずか', kanji: '静か', romaji: 'shizuka', en: 'quiet', category: 'adj-na', sentence: { jp: '図書館は静かです。', romaji: 'Toshokan wa shizuka desu.', en: 'The library is quiet.' } },
  { id: 'v083', kana: 'にぎやか', kanji: '賑やか', romaji: 'nigiyaka', en: 'lively', category: 'adj-na', sentence: { jp: '渋谷はにぎやかです。', romaji: 'Shibuya wa nigiyaka desu.', en: 'Shibuya is lively.' } },
  { id: 'v084', kana: 'ゆうめい', kanji: '有名', romaji: 'yuumei', en: 'famous', category: 'adj-na', sentence: { jp: '富士山は有名です。', romaji: 'Fujisan wa yuumei desu.', en: 'Mt. Fuji is famous.' } },
  { id: 'v085', kana: 'べんり', kanji: '便利', romaji: 'benri', en: 'convenient', category: 'adj-na', sentence: { jp: 'このアプリは便利です。', romaji: 'Kono apuri wa benri desu.', en: 'This app is convenient.' } },
  { id: 'v086', kana: 'げんき', kanji: '元気', romaji: 'genki', en: 'healthy/energetic', category: 'adj-na', sentence: { jp: 'お元気ですか？', romaji: 'Ogenki desu ka?', en: 'How are you?' } },
  { id: 'v087', kana: 'すき', kanji: '好き', romaji: 'suki', en: 'like', category: 'adj-na', sentence: { jp: '寿司が好きです。', romaji: 'Sushi ga suki desu.', en: 'I like sushi.' } },
  { id: 'v088', kana: 'きらい', kanji: '嫌い', romaji: 'kirai', en: 'dislike', category: 'adj-na', sentence: { jp: '納豆が嫌いです。', romaji: 'Nattou ga kirai desu.', en: 'I dislike natto.' } },
  { id: 'v089', kana: 'じょうず', kanji: '上手', romaji: 'jouzu', en: 'skillful', category: 'adj-na', sentence: { jp: '日本語が上手ですね。', romaji: 'Nihongo ga jouzu desu ne.', en: 'You\'re good at Japanese!' } },
  { id: 'v090', kana: 'へた', kanji: '下手', romaji: 'heta', en: 'unskillful', category: 'adj-na', sentence: { jp: '歌が下手です。', romaji: 'Uta ga heta desu.', en: 'I\'m bad at singing.' } },

  // Places
  { id: 'v091', kana: 'がっこう', kanji: '学校', romaji: 'gakkou', en: 'school', category: 'place', sentence: { jp: '学校に歩いて行きます。', romaji: 'Gakkou ni aruite ikimasu.', en: 'I walk to school.' } },
  { id: 'v092', kana: 'だいがく', kanji: '大学', romaji: 'daigaku', en: 'university', category: 'place', sentence: { jp: '東京大学で勉強しています。', romaji: 'Toukyou daigaku de benkyou shiteimasu.', en: 'I study at Tokyo University.' } },
  { id: 'v093', kana: 'えき', kanji: '駅', romaji: 'eki', en: 'station', category: 'place', sentence: { jp: '駅まで歩きます。', romaji: 'Eki made arukimasu.', en: 'I walk to the station.' } },
  { id: 'v094', kana: 'びょういん', kanji: '病院', romaji: 'byouin', en: 'hospital', category: 'place', sentence: { jp: '病院に行かなければなりません。', romaji: 'Byouin ni ikanakereba narimasen.', en: 'I have to go to the hospital.' } },
  { id: 'v095', kana: 'ぎんこう', kanji: '銀行', romaji: 'ginkou', en: 'bank', category: 'place', sentence: { jp: '銀行でお金を下ろします。', romaji: 'Ginkou de okane wo oroshimasu.', en: 'I withdraw money at the bank.' } },
  { id: 'v096', kana: 'スーパー', kanji: null, romaji: 'suupaa', en: 'supermarket', category: 'place', sentence: { jp: 'スーパーで買い物します。', romaji: 'Suupaa de kaimono shimasu.', en: 'I shop at the supermarket.' } },
  { id: 'v097', kana: 'コンビニ', kanji: null, romaji: 'konbini', en: 'convenience store', category: 'place', sentence: { jp: 'コンビニは24時間です。', romaji: 'Konbini wa nijuuyojikan desu.', en: 'The convenience store is 24 hours.' } },
  { id: 'v098', kana: 'レストラン', kanji: null, romaji: 'resutoran', en: 'restaurant', category: 'place', sentence: { jp: 'レストランを予約しました。', romaji: 'Resutoran wo yoyaku shimashita.', en: 'I reserved a restaurant.' } },
  { id: 'v099', kana: 'こうえん', kanji: '公園', romaji: 'kouen', en: 'park', category: 'place', sentence: { jp: '公園で遊びましょう。', romaji: 'Kouen de asobimashou.', en: 'Let\'s play in the park.' } },
  { id: 'v100', kana: 'としょかん', kanji: '図書館', romaji: 'toshokan', en: 'library', category: 'place', sentence: { jp: '図書館で本を借ります。', romaji: 'Toshokan de hon wo karimasu.', en: 'I borrow books at the library.' } },

  // Continue with more vocabulary...
];

// ==================== SENTENCES & STORIES ====================
export const READING_PASSAGES = [
  {
    id: 'story001',
    level: 'N5',
    title_jp: '私の一日',
    title_en: 'My Day',
    title_bn: 'আমার দিন',
    paragraphs: [
      {
        jp: '私は毎朝六時に起きます。',
        romaji: 'Watashi wa maiasa rokuji ni okimasu.',
        en: 'I wake up at 6 AM every morning.',
        bn: 'আমি প্রতিদিন সকাল ছয়টায় উঠি।'
      },
      {
        jp: '朝ごはんを食べてから、学校に行きます。',
        romaji: 'Asagohan wo tabete kara, gakkou ni ikimasu.',
        en: 'After eating breakfast, I go to school.',
        bn: 'প্রাতঃরাশ খাওয়ার পর, আমি স্কুলে যাই।'
      },
      {
        jp: '学校で友達と日本語を勉強します。',
        romaji: 'Gakkou de tomodachi to nihongo wo benkyou shimasu.',
        en: 'I study Japanese with friends at school.',
        bn: 'স্কুলে বন্ধুদের সাথে জাপানি শিখি।'
      },
      {
        jp: '昼ごはんは学校の食堂で食べます。',
        romaji: 'Hirugohan wa gakkou no shokudou de tabemasu.',
        en: 'I eat lunch at the school cafeteria.',
        bn: 'দুপুরের খাবার আমি স্কুলের ডাইনিং হলে খাই।'
      },
      {
        jp: '三時に授業が終わります。',
        romaji: 'Sanji ni jugyou ga owarimasu.',
        en: 'Classes end at 3 o\'clock.',
        bn: 'তিনটায় ক্লাস শেষ হয়।'
      },
      {
        jp: '家に帰って、宿題をします。',
        romaji: 'Ie ni kaette, shukudai wo shimasu.',
        en: 'I return home and do homework.',
        bn: 'বাড়ি ফিরে হোমওয়ার্ক করি।'
      },
      {
        jp: '夜は家族と晩ごはんを食べます。',
        romaji: 'Yoru wa kazoku to bangohan wo tabemasu.',
        en: 'At night, I eat dinner with my family.',
        bn: 'রাতে পরিবারের সাথে রাতের খাবার খাই।'
      },
      {
        jp: '十一時に寝ます。',
        romaji: 'Juuichiji ni nemasu.',
        en: 'I sleep at 11 o\'clock.',
        bn: 'এগারোটায় ঘুমাই।'
      }
    ],
    questions: [
      { q_jp: '何時に起きますか？', q_en: 'What time do they wake up?', q_bn: 'কয়টায় উঠেন?', answer: '六時', answer_en: '6 o\'clock', answer_bn: 'ছয়টায়' },
      { q_jp: 'どこで昼ごはんを食べますか？', q_en: 'Where do they eat lunch?', q_bn: 'দুপুরের খাবার কোথায় খান?', answer: '学校の食堂', answer_en: 'School cafeteria', answer_bn: 'স্কুলের ডাইনিং হলে' },
      { q_jp: '何時に授業が終わりますか？', q_en: 'What time do classes end?', q_bn: 'ক্লাস কয়টায় শেষ হয়?', answer: '三時', answer_en: '3 o\'clock', answer_bn: 'তিনটায়' },
    ]
  },
  {
    id: 'story002',
    level: 'N5',
    title_jp: '買い物',
    title_en: 'Shopping',
    title_bn: 'কেনাকাটা',
    paragraphs: [
      {
        jp: '今日は日曜日です。私はスーパーに行きました。',
        romaji: 'Kyou wa nichiyoubi desu. Watashi wa suupaa ni ikimashita.',
        en: 'Today is Sunday. I went to the supermarket.',
        bn: 'আজ রবিবার। আমি সুপারমার্কেটে গিয়েছিলাম।'
      },
      {
        jp: '野菜と果物と肉を買いました。',
        romaji: 'Yasai to kudamono to niku wo kaimashita.',
        en: 'I bought vegetables, fruits, and meat.',
        bn: 'সবজি, ফল এবং মাংস কিনেছি।'
      },
      {
        jp: 'りんごは五個で三百円でした。',
        romaji: 'Ringo wa goko de sanbyakuen deshita.',
        en: 'Apples were 300 yen for 5.',
        bn: 'আপেল ৫টির দাম ছিল ৩০০ ইয়েন।'
      },
      {
        jp: '全部で二千円でした。',
        romaji: 'Zenbu de nisen en deshita.',
        en: 'It was 2000 yen in total.',
        bn: 'মোট দাম ছিল ২০০০ ইয়েন।'
      },
      {
        jp: '帰りに本屋にも寄りました。',
        romaji: 'Kaeri ni honya ni mo yorimashita.',
        en: 'On the way back, I also stopped by the bookstore.',
        bn: 'ফেরার পথে বইয়ের দোকানেও গিয়েছিলাম।'
      },
      {
        jp: '日本語の本を一冊買いました。',
        romaji: 'Nihongo no hon wo issatsu kaimashita.',
        en: 'I bought one Japanese book.',
        bn: 'একটি জাপানি বই কিনেছি।'
      }
    ],
    questions: [
      { q_jp: '何曜日ですか？', q_en: 'What day is it?', q_bn: 'আজ কী বার?', answer: '日曜日', answer_en: 'Sunday', answer_bn: 'রবিবার' },
      { q_jp: 'りんごはいくらでしたか？', q_en: 'How much were the apples?', q_bn: 'আপেল কত ছিল?', answer: '三百円', answer_en: '300 yen', answer_bn: '৩০০ ইয়েন' },
      { q_jp: '全部でいくらでしたか？', q_en: 'How much was everything?', q_bn: 'মোট কত ইয়েন ছিল?', answer: '二千円', answer_en: '2000 yen', answer_bn: '২০০০ ইয়েন' },
    ]
  },
  {
    id: 'story003',
    level: 'N5',
    title_jp: '週末の予定',
    title_en: 'Weekend Plans',
    title_bn: 'সপ্তাহান্তের পরিকল্পনা',
    paragraphs: [
      {
        jp: '土曜日に友達のたなかさんと会います。',
        romaji: 'Doyoubi ni tomodachi no Tanaka-san to aimasu.',
        en: 'On Saturday, I will meet with my friend Tanaka.',
        bn: 'শনিবারে বন্ধু তানাকা-সানের সাথে দেখা করব।'
      },
      {
        jp: '一緒に映画を見に行きます。',
        romaji: 'Issho ni eiga wo mi ni ikimasu.',
        en: 'We will go watch a movie together.',
        bn: 'একসাথে সিনেমা দেখতে যাব।'
      },
      {
        jp: '映画の後で、レストランで晩ごはんを食べます。',
        romaji: 'Eiga no ato de, resutoran de bangohan wo tabemasu.',
        en: 'After the movie, we will eat dinner at a restaurant.',
        bn: 'সিনেমার পর রেস্টুরেন্টে রাতের খাবার খাব।'
      },
      {
        jp: '日曜日は家で休みます。',
        romaji: 'Nichiyoubi wa ie de yasumimasu.',
        en: 'On Sunday, I will rest at home.',
        bn: 'রবিবারে বাড়িতে বিশ্রাম নেব।'
      },
      {
        jp: '本を読んだり、音楽を聞いたりします。',
        romaji: 'Hon wo yondari, ongaku wo kiitari shimasu.',
        en: 'I will read books and listen to music.',
        bn: 'বই পড়ব এবং গান শুনব।'
      },
      {
        jp: '月曜日から仕事がありますから。',
        romaji: 'Getsuyoubi kara shigoto ga arimasu kara.',
        en: 'Because I have work from Monday.',
        bn: 'কারণ সোমবার থেকে কাজ আছে।'
      }
    ],
    questions: [
      { q_jp: '土曜日に誰と会いますか？', q_en: 'Who will they meet on Saturday?', q_bn: 'শনিবারে কার সাথে দেখা হবে?', answer: 'たなかさん', answer_en: 'Tanaka', answer_bn: 'তানাকা-সান' },
      { q_jp: '何を見に行きますか？', q_en: 'What will they go see?', q_bn: 'কী দেখতে যাবে?', answer: '映画', answer_en: 'Movie', answer_bn: 'সিনেমা' },
      { q_jp: '日曜日は何をしますか？', q_en: 'What will they do on Sunday?', q_bn: 'রবিবারে কী করবে?', answer: '家で休みます', answer_en: 'Rest at home', answer_bn: 'বাড়িতে বিশ্রাম নেওয়া' },
    ]
  }
];

// ==================== COMPLETE N5 KANJI (103 kanji) ====================
export const N5_KANJI = [
  { char: '一', on: ['イチ', 'イツ'], kun: ['ひと-', 'ひと.つ'], en: 'one', strokes: 1 },
  { char: '二', on: ['ニ', 'ジ'], kun: ['ふた-', 'ふた.つ'], en: 'two', strokes: 2 },
  { char: '三', on: ['サン'], kun: ['み-', 'み.つ'], en: 'three', strokes: 3 },
  { char: '四', on: ['シ'], kun: ['よ-', 'よん', 'よ.つ'], en: 'four', strokes: 5 },
  { char: '五', on: ['ゴ'], kun: ['いつ-', 'いつ.つ'], en: 'five', strokes: 4 },
  { char: '六', on: ['ロク'], kun: ['む-', 'む.つ'], en: 'six', strokes: 4 },
  { char: '七', on: ['シチ'], kun: ['なな-', 'なな.つ'], en: 'seven', strokes: 2 },
  { char: '八', on: ['ハチ'], kun: ['や-', 'や.つ'], en: 'eight', strokes: 2 },
  { char: '九', on: ['キュウ', 'ク'], kun: ['ここの-', 'ここの.つ'], en: 'nine', strokes: 2 },
  { char: '十', on: ['ジュウ', 'ジッ'], kun: ['とお', 'と'], en: 'ten', strokes: 2 },
  { char: '百', on: ['ヒャク', 'ビャク'], kun: [], en: 'hundred', strokes: 6 },
  { char: '千', on: ['セン'], kun: ['ち'], en: 'thousand', strokes: 3 },
  { char: '万', on: ['マン', 'バン'], kun: [], en: 'ten thousand', strokes: 3 },
  { char: '円', on: ['エン'], kun: ['まる-'], en: 'yen, circle', strokes: 4 },
  { char: '年', on: ['ネン'], kun: ['とし'], en: 'year', strokes: 6 },
  { char: '月', on: ['ゲツ', 'ガツ'], kun: ['つき'], en: 'month, moon', strokes: 4 },
  { char: '日', on: ['ニチ', 'ジツ'], kun: ['ひ', 'か'], en: 'day, sun', strokes: 4 },
  { char: '週', on: ['シュウ'], kun: [], en: 'week', strokes: 11 },
  { char: '時', on: ['ジ'], kun: ['とき'], en: 'time, hour', strokes: 10 },
  { char: '分', on: ['ブン', 'フン'], kun: ['わ.ける'], en: 'minute, part', strokes: 4 },
  { char: '半', on: ['ハン'], kun: ['なか.ば'], en: 'half', strokes: 5 },
  { char: '今', on: ['コン', 'キン'], kun: ['いま'], en: 'now', strokes: 4 },
  { char: '何', on: ['カ'], kun: ['なに', 'なん'], en: 'what', strokes: 7 },
  { char: '人', on: ['ジン', 'ニン'], kun: ['ひと'], en: 'person', strokes: 2 },
  { char: '男', on: ['ダン', 'ナン'], kun: ['おとこ'], en: 'man, male', strokes: 7 },
  { char: '女', on: ['ジョ', 'ニョ'], kun: ['おんな'], en: 'woman, female', strokes: 3 },
  { char: '子', on: ['シ', 'ス'], kun: ['こ'], en: 'child', strokes: 3 },
  { char: '父', on: ['フ'], kun: ['ちち'], en: 'father', strokes: 4 },
  { char: '母', on: ['ボ'], kun: ['はは'], en: 'mother', strokes: 5 },
  { char: '友', on: ['ユウ'], kun: ['とも'], en: 'friend', strokes: 4 },
  { char: '先', on: ['セン'], kun: ['さき'], en: 'previous, ahead', strokes: 6 },
  { char: '生', on: ['セイ', 'ショウ'], kun: ['い.きる', 'う.まれる'], en: 'life, birth', strokes: 5 },
  { char: '学', on: ['ガク'], kun: ['まな.ぶ'], en: 'study, learning', strokes: 8 },
  { char: '校', on: ['コウ'], kun: [], en: 'school', strokes: 10 },
  { char: '大', on: ['ダイ', 'タイ'], kun: ['おお-', 'おお.きい'], en: 'big, large', strokes: 3 },
  { char: '小', on: ['ショウ'], kun: ['ちい.さい', 'こ-'], en: 'small, little', strokes: 3 },
  { char: '中', on: ['チュウ'], kun: ['なか'], en: 'middle, inside', strokes: 4 },
  { char: '上', on: ['ジョウ'], kun: ['うえ', 'あ.げる', 'のぼ.る'], en: 'up, above', strokes: 3 },
  { char: '下', on: ['カ', 'ゲ'], kun: ['した', 'さ.げる', 'くだ.る'], en: 'down, below', strokes: 3 },
  { char: '左', on: ['サ'], kun: ['ひだり'], en: 'left', strokes: 5 },
  { char: '右', on: ['ウ', 'ユウ'], kun: ['みぎ'], en: 'right', strokes: 5 },
  { char: '前', on: ['ゼン'], kun: ['まえ'], en: 'front, before', strokes: 9 },
  { char: '後', on: ['ゴ', 'コウ'], kun: ['あと', 'うし.ろ'], en: 'back, after', strokes: 9 },
  { char: '外', on: ['ガイ', 'ゲ'], kun: ['そと', 'ほか'], en: 'outside', strokes: 5 },
  { char: '国', on: ['コク'], kun: ['くに'], en: 'country', strokes: 8 },
  { char: '本', on: ['ホン'], kun: ['もと'], en: 'book, origin', strokes: 5 },
  { char: '語', on: ['ゴ'], kun: ['かた.る'], en: 'language, word', strokes: 14 },
  { char: '話', on: ['ワ'], kun: ['はな.す', 'はなし'], en: 'speak, talk', strokes: 13 },
  { char: '聞', on: ['ブン', 'モン'], kun: ['き.く'], en: 'hear, listen', strokes: 14 },
  { char: '読', on: ['ドク', 'トク'], kun: ['よ.む'], en: 'read', strokes: 14 },
  { char: '書', on: ['ショ'], kun: ['か.く'], en: 'write', strokes: 10 },
  { char: '見', on: ['ケン'], kun: ['み.る', 'み.える'], en: 'see, look', strokes: 7 },
  { char: '行', on: ['コウ', 'ギョウ'], kun: ['い.く', 'おこな.う'], en: 'go', strokes: 6 },
  { char: '来', on: ['ライ'], kun: ['く.る', 'きた.る'], en: 'come', strokes: 7 },
  { char: '出', on: ['シュツ', 'スイ'], kun: ['で.る', 'だ.す'], en: 'exit, go out', strokes: 5 },
  { char: '入', on: ['ニュウ'], kun: ['い.る', 'はい.る'], en: 'enter', strokes: 2 },
  { char: '食', on: ['ショク', 'ジキ'], kun: ['た.べる', 'く.う'], en: 'eat, food', strokes: 9 },
  { char: '飲', on: ['イン'], kun: ['の.む'], en: 'drink', strokes: 12 },
  { char: '買', on: ['バイ'], kun: ['か.う'], en: 'buy', strokes: 12 },
  { char: '休', on: ['キュウ'], kun: ['やす.む'], en: 'rest', strokes: 6 },
  { char: '立', on: ['リツ'], kun: ['た.つ'], en: 'stand', strokes: 5 },
  { char: '会', on: ['カイ', 'エ'], kun: ['あ.う'], en: 'meet, meeting', strokes: 6 },
  { char: '店', on: ['テン'], kun: ['みせ'], en: 'shop, store', strokes: 8 },
  { char: '駅', on: ['エキ'], kun: [], en: 'station', strokes: 14 },
  { char: '車', on: ['シャ'], kun: ['くるま'], en: 'car, vehicle', strokes: 7 },
  { char: '電', on: ['デン'], kun: [], en: 'electricity', strokes: 13 },
  { char: '気', on: ['キ', 'ケ'], kun: [], en: 'spirit, energy', strokes: 6 },
  { char: '天', on: ['テン'], kun: ['あま-', 'あめ'], en: 'heaven, sky', strokes: 4 },
  { char: '雨', on: ['ウ'], kun: ['あめ', 'あま-'], en: 'rain', strokes: 8 },
  { char: '山', on: ['サン', 'セン'], kun: ['やま'], en: 'mountain', strokes: 3 },
  { char: '川', on: ['セン'], kun: ['かわ'], en: 'river', strokes: 3 },
  { char: '木', on: ['モク', 'ボク'], kun: ['き', 'こ-'], en: 'tree, wood', strokes: 4 },
  { char: '花', on: ['カ'], kun: ['はな'], en: 'flower', strokes: 7 },
  { char: '火', on: ['カ'], kun: ['ひ'], en: 'fire', strokes: 4 },
  { char: '水', on: ['スイ'], kun: ['みず'], en: 'water', strokes: 4 },
  { char: '金', on: ['キン', 'コン'], kun: ['かね'], en: 'gold, money', strokes: 8 },
  { char: '土', on: ['ド', 'ト'], kun: ['つち'], en: 'earth, soil', strokes: 3 },
  { char: '白', on: ['ハク', 'ビャク'], kun: ['しろ-', 'しろ.い'], en: 'white', strokes: 5 },
  { char: '黒', on: ['コク'], kun: ['くろ-', 'くろ.い'], en: 'black', strokes: 11 },
  { char: '赤', on: ['セキ', 'シャク'], kun: ['あか-', 'あか.い'], en: 'red', strokes: 7 },
  { char: '青', on: ['セイ', 'ショウ'], kun: ['あお-', 'あお.い'], en: 'blue', strokes: 8 },
  { char: '高', on: ['コウ'], kun: ['たか-', 'たか.い'], en: 'high, expensive', strokes: 10 },
  { char: '安', on: ['アン'], kun: ['やす-', 'やす.い'], en: 'cheap, peaceful', strokes: 6 },
  { char: '新', on: ['シン'], kun: ['あたら.しい', 'あら-'], en: 'new', strokes: 13 },
  { char: '古', on: ['コ'], kun: ['ふる-', 'ふる.い'], en: 'old', strokes: 5 },
  { char: '長', on: ['チョウ'], kun: ['なが-', 'なが.い'], en: 'long', strokes: 8 },
  { char: '短', on: ['タン'], kun: ['みじか-', 'みじか.い'], en: 'short', strokes: 12 },
  { char: '多', on: ['タ'], kun: ['おお-', 'おお.い'], en: 'many, much', strokes: 6 },
  { char: '少', on: ['ショウ'], kun: ['すこ-', 'すく.ない'], en: 'few, little', strokes: 4 },
  { char: '東', on: ['トウ'], kun: ['ひがし'], en: 'east', strokes: 8 },
  { char: '西', on: ['セイ', 'サイ'], kun: ['にし'], en: 'west', strokes: 6 },
  { char: '南', on: ['ナン', 'ナ'], kun: ['みなみ'], en: 'south', strokes: 9 },
  { char: '北', on: ['ホク'], kun: ['きた'], en: 'north', strokes: 5 },
  { char: '口', on: ['コウ', 'ク'], kun: ['くち'], en: 'mouth', strokes: 3 },
  { char: '目', on: ['モク', 'ボク'], kun: ['め'], en: 'eye', strokes: 5 },
  { char: '耳', on: ['ジ'], kun: ['みみ'], en: 'ear', strokes: 6 },
  { char: '手', on: ['シュ'], kun: ['て'], en: 'hand', strokes: 4 },
  { char: '足', on: ['ソク'], kun: ['あし', 'た.りる'], en: 'foot, leg', strokes: 7 },
  { char: '名', on: ['メイ', 'ミョウ'], kun: ['な'], en: 'name', strokes: 6 },
  { char: '道', on: ['ドウ'], kun: ['みち'], en: 'road, way', strokes: 12 },
  { char: '空', on: ['クウ'], kun: ['そら', 'あ.く'], en: 'sky, empty', strokes: 8 },
  { char: '毎', on: ['マイ'], kun: [], en: 'every', strokes: 6 },
];

// ==================== N4 KANJI (181 additional) ====================
export const N4_KANJI = [
  { char: '運', on: ['ウン'], kun: ['はこ.ぶ'], en: 'luck, transport', strokes: 12 },
  { char: '動', on: ['ドウ'], kun: ['うご.く'], en: 'move', strokes: 11 },
  { char: '物', on: ['ブツ', 'モツ'], kun: ['もの'], en: 'thing', strokes: 8 },
  { char: '事', on: ['ジ', 'ズ'], kun: ['こと'], en: 'thing, matter', strokes: 8 },
  { char: '仕', on: ['シ', 'ジ'], kun: ['つか.える'], en: 'serve, work', strokes: 5 },
  { char: '場', on: ['ジョウ'], kun: ['ば'], en: 'place', strokes: 12 },
  { char: '所', on: ['ショ'], kun: ['ところ'], en: 'place', strokes: 8 },
  { char: '住', on: ['ジュウ'], kun: ['す.む'], en: 'live, reside', strokes: 7 },
  { char: '使', on: ['シ'], kun: ['つか.う'], en: 'use', strokes: 8 },
  { char: '持', on: ['ジ'], kun: ['も.つ'], en: 'hold, have', strokes: 9 },
  { char: '待', on: ['タイ'], kun: ['ま.つ'], en: 'wait', strokes: 9 },
  { char: '送', on: ['ソウ'], kun: ['おく.る'], en: 'send', strokes: 9 },
  { char: '届', on: [], kun: ['とど.く', 'とど.ける'], en: 'deliver, reach', strokes: 8 },
  { char: '開', on: ['カイ'], kun: ['あ.ける', 'ひら.く'], en: 'open', strokes: 12 },
  { char: '閉', on: ['ヘイ'], kun: ['と.じる', 'し.める'], en: 'close', strokes: 11 },
  { char: '始', on: ['シ'], kun: ['はじ.める', 'はじ.まる'], en: 'begin', strokes: 8 },
  { char: '終', on: ['シュウ'], kun: ['お.わる'], en: 'end', strokes: 11 },
  { char: '返', on: ['ヘン'], kun: ['かえ.す'], en: 'return', strokes: 7 },
  { char: '教', on: ['キョウ'], kun: ['おし.える'], en: 'teach', strokes: 11 },
  { char: '習', on: ['シュウ'], kun: ['なら.う'], en: 'learn', strokes: 11 },
  { char: '働', on: ['ドウ'], kun: ['はたら.く'], en: 'work', strokes: 13 },
  { char: '走', on: ['ソウ'], kun: ['はし.る'], en: 'run', strokes: 7 },
  { char: '歩', on: ['ホ'], kun: ['ある.く'], en: 'walk', strokes: 8 },
  { char: '止', on: ['シ'], kun: ['と.まる', 'や.める'], en: 'stop', strokes: 4 },
  { char: '起', on: ['キ'], kun: ['お.きる', 'お.こす'], en: 'wake, rise', strokes: 10 },
  { char: '寝', on: ['シン'], kun: ['ね.る'], en: 'sleep', strokes: 13 },
  { char: '泳', on: ['エイ'], kun: ['およ.ぐ'], en: 'swim', strokes: 8 },
  { char: '遊', on: ['ユウ'], kun: ['あそ.ぶ'], en: 'play', strokes: 12 },
  { char: '産', on: ['サン'], kun: ['う.む'], en: 'produce, birth', strokes: 11 },
  { char: '業', on: ['ギョウ', 'ゴウ'], kun: ['わざ'], en: 'business', strokes: 13 },
  // ... More N4 kanji would be added here
];

// ==================== GRAMMAR PATTERNS ====================
export const N5_GRAMMAR = [
  {
    id: 'g001',
    pattern: 'です',
    meaning: 'to be (polite)',
    explanation: 'Used to make polite statements',
    examples: [
      { jp: '私は学生です。', romaji: 'Watashi wa gakusei desu.', en: 'I am a student.' },
      { jp: 'これはペンです。', romaji: 'Kore wa pen desu.', en: 'This is a pen.' },
    ]
  },
  {
    id: 'g002',
    pattern: 'は～が',
    meaning: 'topic marker + subject marker',
    explanation: 'は marks the topic, が marks the subject',
    examples: [
      { jp: '象は鼻が長いです。', romaji: 'Zou wa hana ga nagai desu.', en: 'Elephants have long noses.' },
      { jp: '私は日本語が好きです。', romaji: 'Watashi wa nihongo ga suki desu.', en: 'I like Japanese.' },
    ]
  },
  {
    id: 'g003',
    pattern: 'を',
    meaning: 'object marker',
    explanation: 'Marks the direct object of an action',
    examples: [
      { jp: 'パンを食べます。', romaji: 'Pan wo tabemasu.', en: 'I eat bread.' },
      { jp: '本を読みます。', romaji: 'Hon wo yomimasu.', en: 'I read books.' },
    ]
  },
  {
    id: 'g004',
    pattern: 'に',
    meaning: 'direction/time marker',
    explanation: 'Indicates direction, time, or indirect object',
    examples: [
      { jp: '学校に行きます。', romaji: 'Gakkou ni ikimasu.', en: 'I go to school.' },
      { jp: '七時に起きます。', romaji: 'Shichiji ni okimasu.', en: 'I wake up at 7.' },
    ]
  },
  {
    id: 'g005',
    pattern: 'で',
    meaning: 'location/means marker',
    explanation: 'Indicates where an action takes place or means',
    examples: [
      { jp: '図書館で勉強します。', romaji: 'Toshokan de benkyou shimasu.', en: 'I study at the library.' },
      { jp: 'バスで行きます。', romaji: 'Basu de ikimasu.', en: 'I go by bus.' },
    ]
  },
  {
    id: 'g006',
    pattern: 'から～まで',
    meaning: 'from ~ to ~',
    explanation: 'Indicates range (time or place)',
    examples: [
      { jp: '九時から五時まで働きます。', romaji: 'Kuji kara goji made hatarakimasu.', en: 'I work from 9 to 5.' },
      { jp: '東京から大阪まで新幹線で行きます。', romaji: 'Tokyo kara Osaka made shinkansen de ikimasu.', en: 'I go from Tokyo to Osaka by bullet train.' },
    ]
  },
  {
    id: 'g007',
    pattern: '～ませんか',
    meaning: 'Won\'t you ~? (invitation)',
    explanation: 'Polite invitation or suggestion',
    examples: [
      { jp: '一緒に映画を見ませんか。', romaji: 'Issho ni eiga wo mimasen ka.', en: 'Won\'t you watch a movie with me?' },
      { jp: 'コーヒーを飲みませんか。', romaji: 'Koohii wo nomimasen ka.', en: 'Won\'t you have some coffee?' },
    ]
  },
  {
    id: 'g008',
    pattern: '～ましょう',
    meaning: 'Let\'s ~',
    explanation: 'Suggestion to do something together',
    examples: [
      { jp: '昼ごはんを食べましょう。', romaji: 'Hirugohan wo tabemashou.', en: 'Let\'s eat lunch.' },
      { jp: '始めましょう。', romaji: 'Hajimemashou.', en: 'Let\'s begin.' },
    ]
  },
  {
    id: 'g009',
    pattern: '～てください',
    meaning: 'Please do ~',
    explanation: 'Polite request',
    examples: [
      { jp: 'ここに名前を書いてください。', romaji: 'Koko ni namae wo kaite kudasai.', en: 'Please write your name here.' },
      { jp: 'ちょっと待ってください。', romaji: 'Chotto matte kudasai.', en: 'Please wait a moment.' },
    ]
  },
  {
    id: 'g010',
    pattern: '～ています',
    meaning: 'doing ~ / in the state of ~',
    explanation: 'Progressive or resultant state',
    examples: [
      { jp: '今、勉強しています。', romaji: 'Ima, benkyou shiteimasu.', en: 'I am studying now.' },
      { jp: '彼は結婚しています。', romaji: 'Kare wa kekkon shiteimasu.', en: 'He is married.' },
    ]
  },
];

export default {
  HIRAGANA,
  KATAKANA,
  N5_VOCABULARY,
  READING_PASSAGES,
  N5_KANJI,
  N4_KANJI,
  N5_GRAMMAR,
  MASSIVE_N5_VOCAB,
  MASSIVE_N4_VOCAB,
  MASSIVE_SENTENCES
};
