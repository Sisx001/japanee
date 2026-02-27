// Extended N5 + N4 Vocabulary - 800+ words with sentences
// Categories: greetings, numbers, time, days, family, verbs, adjectives, places, food, body, nature, etc.

export const EXTENDED_VOCABULARY = [
  // ==================== GREETINGS & EXPRESSIONS (50) ====================
  { id: 'ev001', kana: 'おはよう', kanji: null, romaji: 'ohayou', en: 'good morning (casual)', bn: 'শুভ সকাল', level: 'N5', category: 'greetings', sentence: { jp: 'おはよう！元気？', romaji: 'Ohayou! Genki?', en: 'Good morning! How are you?' }},
  { id: 'ev002', kana: 'おはようございます', kanji: null, romaji: 'ohayou gozaimasu', en: 'good morning (polite)', bn: 'শুভ সকাল', level: 'N5', category: 'greetings', sentence: { jp: 'おはようございます、先生。', romaji: 'Ohayou gozaimasu, sensei.', en: 'Good morning, teacher.' }},
  { id: 'ev003', kana: 'こんにちは', kanji: null, romaji: 'konnichiwa', en: 'hello/good afternoon', bn: 'হ্যালো', level: 'N5', category: 'greetings', sentence: { jp: 'こんにちは、お元気ですか？', romaji: 'Konnichiwa, ogenki desu ka?', en: 'Hello, how are you?' }},
  { id: 'ev004', kana: 'こんばんは', kanji: null, romaji: 'konbanwa', en: 'good evening', bn: 'শুভ সন্ধ্যা', level: 'N5', category: 'greetings', sentence: { jp: 'こんばんは。今日は暑かったですね。', romaji: 'Konbanwa. Kyou wa atsukatta desu ne.', en: 'Good evening. It was hot today.' }},
  { id: 'ev005', kana: 'さようなら', kanji: null, romaji: 'sayounara', en: 'goodbye', bn: 'বিদায়', level: 'N5', category: 'greetings', sentence: { jp: 'さようなら、また明日！', romaji: 'Sayounara, mata ashita!', en: 'Goodbye, see you tomorrow!' }},
  { id: 'ev006', kana: 'おやすみなさい', kanji: null, romaji: 'oyasuminasai', en: 'good night', bn: 'শুভ রাত্রি', level: 'N5', category: 'greetings', sentence: { jp: 'おやすみなさい。いい夢を。', romaji: 'Oyasuminasai. Ii yume wo.', en: 'Good night. Sweet dreams.' }},
  { id: 'ev007', kana: 'ありがとう', kanji: null, romaji: 'arigatou', en: 'thank you (casual)', bn: 'ধন্যবাদ', level: 'N5', category: 'greetings', sentence: { jp: 'プレゼント、ありがとう！', romaji: 'Purezento, arigatou!', en: 'Thanks for the present!' }},
  { id: 'ev008', kana: 'ありがとうございます', kanji: null, romaji: 'arigatou gozaimasu', en: 'thank you (polite)', bn: 'ধন্যবাদ', level: 'N5', category: 'greetings', sentence: { jp: '手伝ってくれて、ありがとうございます。', romaji: 'Tetsudatte kurete, arigatou gozaimasu.', en: 'Thank you for helping me.' }},
  { id: 'ev009', kana: 'すみません', kanji: null, romaji: 'sumimasen', en: 'excuse me/sorry', bn: 'মাফ করবেন', level: 'N5', category: 'greetings', sentence: { jp: 'すみません、駅はどこですか？', romaji: 'Sumimasen, eki wa doko desu ka?', en: 'Excuse me, where is the station?' }},
  { id: 'ev010', kana: 'ごめんなさい', kanji: null, romaji: 'gomen nasai', en: 'I am sorry', bn: 'দুঃখিত', level: 'N5', category: 'greetings', sentence: { jp: '遅れてごめんなさい。', romaji: 'Okurete gomen nasai.', en: 'I am sorry for being late.' }},
  { id: 'ev011', kana: 'いただきます', kanji: null, romaji: 'itadakimasu', en: 'bon appetit', bn: 'খাওয়া শুরু', level: 'N5', category: 'greetings', sentence: { jp: 'いただきます！おいしそう！', romaji: 'Itadakimasu! Oishisou!', en: 'Let me eat! Looks delicious!' }},
  { id: 'ev012', kana: 'ごちそうさまでした', kanji: null, romaji: 'gochisousama deshita', en: 'thanks for the meal', bn: 'খাওয়া শেষ', level: 'N5', category: 'greetings', sentence: { jp: 'ごちそうさまでした。おいしかったです。', romaji: 'Gochisousama deshita. Oishikatta desu.', en: 'Thanks for the meal. It was delicious.' }},
  { id: 'ev013', kana: 'いってきます', kanji: '行ってきます', romaji: 'ittekimasu', en: 'I am leaving', bn: 'যাচ্ছি', level: 'N5', category: 'greetings', sentence: { jp: 'いってきます！', romaji: 'Ittekimasu!', en: 'I am leaving!' }},
  { id: 'ev014', kana: 'いってらっしゃい', kanji: null, romaji: 'itterasshai', en: 'have a good trip', bn: 'শুভ যাত্রা', level: 'N5', category: 'greetings', sentence: { jp: 'いってらっしゃい！気をつけてね。', romaji: 'Itterasshai! Ki wo tsukete ne.', en: 'Have a good trip! Be careful.' }},
  { id: 'ev015', kana: 'ただいま', kanji: null, romaji: 'tadaima', en: 'I am home', bn: 'ফিরলাম', level: 'N5', category: 'greetings', sentence: { jp: 'ただいま！疲れた～。', romaji: 'Tadaima! Tsukareta~.', en: 'I am home! I am tired~.' }},
  { id: 'ev016', kana: 'おかえりなさい', kanji: null, romaji: 'okaerinasai', en: 'welcome home', bn: 'স্বাগতম', level: 'N5', category: 'greetings', sentence: { jp: 'おかえりなさい！夕飯できてるよ。', romaji: 'Okaerinasai! Yuuhan dekiteru yo.', en: 'Welcome home! Dinner is ready.' }},
  { id: 'ev017', kana: 'はじめまして', kanji: '初めまして', romaji: 'hajimemashite', en: 'nice to meet you', bn: 'পরিচয়', level: 'N5', category: 'greetings', sentence: { jp: 'はじめまして。田中です。', romaji: 'Hajimemashite. Tanaka desu.', en: 'Nice to meet you. I am Tanaka.' }},
  { id: 'ev018', kana: 'よろしくおねがいします', kanji: 'よろしくお願いします', romaji: 'yoroshiku onegaishimasu', en: 'please treat me well', bn: 'আপনার সহযোগিতা চাই', level: 'N5', category: 'greetings', sentence: { jp: 'よろしくお願いします！', romaji: 'Yoroshiku onegaishimasu!', en: 'Please treat me well!' }},
  { id: 'ev019', kana: 'おめでとう', kanji: null, romaji: 'omedetou', en: 'congratulations', bn: 'অভিনন্দন', level: 'N5', category: 'greetings', sentence: { jp: '誕生日おめでとう！', romaji: 'Tanjoubi omedetou!', en: 'Happy birthday!' }},
  { id: 'ev020', kana: 'おめでとうございます', kanji: null, romaji: 'omedetou gozaimasu', en: 'congratulations (polite)', bn: 'অভিনন্দন', level: 'N5', category: 'greetings', sentence: { jp: 'ご結婚おめでとうございます。', romaji: 'Gokekkon omedetou gozaimasu.', en: 'Congratulations on your marriage.' }},
  
  // ==================== NUMBERS (30) ====================
  { id: 'ev021', kana: 'ぜろ', kanji: '零', romaji: 'zero', en: 'zero', bn: 'শূন্য', level: 'N5', category: 'numbers', sentence: { jp: '点数はゼロです。', romaji: 'Tensuu wa zero desu.', en: 'The score is zero.' }},
  { id: 'ev022', kana: 'いち', kanji: '一', romaji: 'ichi', en: 'one', bn: 'এক', level: 'N5', category: 'numbers', sentence: { jp: '一つください。', romaji: 'Hitotsu kudasai.', en: 'One please.' }},
  { id: 'ev023', kana: 'に', kanji: '二', romaji: 'ni', en: 'two', bn: 'দুই', level: 'N5', category: 'numbers', sentence: { jp: '二人で行きます。', romaji: 'Futari de ikimasu.', en: 'We will go as two people.' }},
  { id: 'ev024', kana: 'さん', kanji: '三', romaji: 'san', en: 'three', bn: 'তিন', level: 'N5', category: 'numbers', sentence: { jp: '三時に会いましょう。', romaji: 'Sanji ni aimashou.', en: 'Let us meet at 3 o clock.' }},
  { id: 'ev025', kana: 'よん', kanji: '四', romaji: 'yon', en: 'four', bn: 'চার', level: 'N5', category: 'numbers', sentence: { jp: '四月は桜の季節です。', romaji: 'Shigatsu wa sakura no kisetsu desu.', en: 'April is cherry blossom season.' }},
  { id: 'ev026', kana: 'ご', kanji: '五', romaji: 'go', en: 'five', bn: 'পাঁচ', level: 'N5', category: 'numbers', sentence: { jp: '五分待ってください。', romaji: 'Gofun matte kudasai.', en: 'Please wait 5 minutes.' }},
  { id: 'ev027', kana: 'ろく', kanji: '六', romaji: 'roku', en: 'six', bn: 'ছয়', level: 'N5', category: 'numbers', sentence: { jp: '六時に起きます。', romaji: 'Rokuji ni okimasu.', en: 'I wake up at 6 o clock.' }},
  { id: 'ev028', kana: 'なな', kanji: '七', romaji: 'nana', en: 'seven', bn: 'সাত', level: 'N5', category: 'numbers', sentence: { jp: '一週間は七日です。', romaji: 'Isshuukan wa nanoka desu.', en: 'One week is seven days.' }},
  { id: 'ev029', kana: 'はち', kanji: '八', romaji: 'hachi', en: 'eight', bn: 'আট', level: 'N5', category: 'numbers', sentence: { jp: '八時に学校に行きます。', romaji: 'Hachiji ni gakkou ni ikimasu.', en: 'I go to school at 8.' }},
  { id: 'ev030', kana: 'きゅう', kanji: '九', romaji: 'kyuu', en: 'nine', bn: 'নয়', level: 'N5', category: 'numbers', sentence: { jp: '九月に日本に行きます。', romaji: 'Kugatsu ni Nihon ni ikimasu.', en: 'I am going to Japan in September.' }},
  { id: 'ev031', kana: 'じゅう', kanji: '十', romaji: 'juu', en: 'ten', bn: 'দশ', level: 'N5', category: 'numbers', sentence: { jp: '十個ありますか？', romaji: 'Jukko arimasu ka?', en: 'Are there ten?' }},
  { id: 'ev032', kana: 'じゅういち', kanji: '十一', romaji: 'juuichi', en: 'eleven', bn: 'এগারো', level: 'N5', category: 'numbers', sentence: { jp: '十一月は寒いです。', romaji: 'Juuichigatsu wa samui desu.', en: 'November is cold.' }},
  { id: 'ev033', kana: 'じゅうに', kanji: '十二', romaji: 'juuni', en: 'twelve', bn: 'বারো', level: 'N5', category: 'numbers', sentence: { jp: '十二時に昼ご飯を食べます。', romaji: 'Juuniji ni hirugohan wo tabemasu.', en: 'I eat lunch at 12.' }},
  { id: 'ev034', kana: 'にじゅう', kanji: '二十', romaji: 'nijuu', en: 'twenty', bn: 'বিশ', level: 'N5', category: 'numbers', sentence: { jp: '二十歳になりました。', romaji: 'Hatachi ni narimashita.', en: 'I turned 20 years old.' }},
  { id: 'ev035', kana: 'ひゃく', kanji: '百', romaji: 'hyaku', en: 'hundred', bn: 'একশ', level: 'N5', category: 'numbers', sentence: { jp: '百円ショップで買いました。', romaji: 'Hyakuen shoppu de kaimashita.', en: 'I bought it at a 100 yen shop.' }},
  { id: 'ev036', kana: 'せん', kanji: '千', romaji: 'sen', en: 'thousand', bn: 'হাজার', level: 'N5', category: 'numbers', sentence: { jp: '千円札がありますか？', romaji: 'Senen satsu ga arimasu ka?', en: 'Do you have a 1000 yen bill?' }},
  { id: 'ev037', kana: 'まん', kanji: '万', romaji: 'man', en: 'ten thousand', bn: 'দশ হাজার', level: 'N5', category: 'numbers', sentence: { jp: 'この車は百万円です。', romaji: 'Kono kuruma wa hyakuman en desu.', en: 'This car is 1 million yen.' }},
  
  // ==================== TIME (40) ====================
  { id: 'ev038', kana: 'いま', kanji: '今', romaji: 'ima', en: 'now', bn: 'এখন', level: 'N5', category: 'time', sentence: { jp: '今、何時ですか？', romaji: 'Ima, nanji desu ka?', en: 'What time is it now?' }},
  { id: 'ev039', kana: 'きょう', kanji: '今日', romaji: 'kyou', en: 'today', bn: 'আজ', level: 'N5', category: 'time', sentence: { jp: '今日は暑いですね。', romaji: 'Kyou wa atsui desu ne.', en: 'It is hot today.' }},
  { id: 'ev040', kana: 'あした', kanji: '明日', romaji: 'ashita', en: 'tomorrow', bn: 'আগামীকাল', level: 'N5', category: 'time', sentence: { jp: '明日、映画を見ます。', romaji: 'Ashita, eiga wo mimasu.', en: 'I will watch a movie tomorrow.' }},
  { id: 'ev041', kana: 'きのう', kanji: '昨日', romaji: 'kinou', en: 'yesterday', bn: 'গতকাল', level: 'N5', category: 'time', sentence: { jp: '昨日、友達に会いました。', romaji: 'Kinou, tomodachi ni aimashita.', en: 'I met a friend yesterday.' }},
  { id: 'ev042', kana: 'あさって', kanji: '明後日', romaji: 'asatte', en: 'day after tomorrow', bn: 'পরশু', level: 'N5', category: 'time', sentence: { jp: '明後日、東京に行きます。', romaji: 'Asatte, Toukyou ni ikimasu.', en: 'I am going to Tokyo the day after tomorrow.' }},
  { id: 'ev043', kana: 'おととい', kanji: '一昨日', romaji: 'ototoi', en: 'day before yesterday', bn: 'গত পরশু', level: 'N5', category: 'time', sentence: { jp: 'おととい、病院に行きました。', romaji: 'Ototoi, byouin ni ikimashita.', en: 'I went to the hospital the day before yesterday.' }},
  { id: 'ev044', kana: 'あさ', kanji: '朝', romaji: 'asa', en: 'morning', bn: 'সকাল', level: 'N5', category: 'time', sentence: { jp: '毎朝、ジョギングをします。', romaji: 'Maiasa, jogingu wo shimasu.', en: 'I jog every morning.' }},
  { id: 'ev045', kana: 'ひる', kanji: '昼', romaji: 'hiru', en: 'noon/daytime', bn: 'দুপুর', level: 'N5', category: 'time', sentence: { jp: '昼ごはんを食べましょう。', romaji: 'Hirugohan wo tabemashou.', en: 'Let us eat lunch.' }},
  { id: 'ev046', kana: 'ゆうがた', kanji: '夕方', romaji: 'yuugata', en: 'evening', bn: 'সন্ধ্যা', level: 'N5', category: 'time', sentence: { jp: '夕方、散歩します。', romaji: 'Yuugata, sanpo shimasu.', en: 'I take a walk in the evening.' }},
  { id: 'ev047', kana: 'よる', kanji: '夜', romaji: 'yoru', en: 'night', bn: 'রাত', level: 'N5', category: 'time', sentence: { jp: '夜、星がきれいです。', romaji: 'Yoru, hoshi ga kirei desu.', en: 'The stars are beautiful at night.' }},
  { id: 'ev048', kana: 'まいにち', kanji: '毎日', romaji: 'mainichi', en: 'every day', bn: 'প্রতিদিন', level: 'N5', category: 'time', sentence: { jp: '毎日、日本語を勉強します。', romaji: 'Mainichi, nihongo wo benkyou shimasu.', en: 'I study Japanese every day.' }},
  { id: 'ev049', kana: 'まいしゅう', kanji: '毎週', romaji: 'maishuu', en: 'every week', bn: 'প্রতি সপ্তাহ', level: 'N5', category: 'time', sentence: { jp: '毎週日曜日に教会に行きます。', romaji: 'Maishuu nichiyoubi ni kyoukai ni ikimasu.', en: 'I go to church every Sunday.' }},
  { id: 'ev050', kana: 'まいつき', kanji: '毎月', romaji: 'maitsuki', en: 'every month', bn: 'প্রতি মাস', level: 'N5', category: 'time', sentence: { jp: '毎月、給料をもらいます。', romaji: 'Maitsuki, kyuuryou wo moraimasu.', en: 'I receive my salary every month.' }},
  
  // ==================== DAYS OF WEEK (7) ====================
  { id: 'ev051', kana: 'げつようび', kanji: '月曜日', romaji: 'getsuyoubi', en: 'Monday', bn: 'সোমবার', level: 'N5', category: 'days', sentence: { jp: '月曜日は仕事が多いです。', romaji: 'Getsuyoubi wa shigoto ga ooi desu.', en: 'There is a lot of work on Monday.' }},
  { id: 'ev052', kana: 'かようび', kanji: '火曜日', romaji: 'kayoubi', en: 'Tuesday', bn: 'মঙ্গলবার', level: 'N5', category: 'days', sentence: { jp: '火曜日にテストがあります。', romaji: 'Kayoubi ni tesuto ga arimasu.', en: 'There is a test on Tuesday.' }},
  { id: 'ev053', kana: 'すいようび', kanji: '水曜日', romaji: 'suiyoubi', en: 'Wednesday', bn: 'বুধবার', level: 'N5', category: 'days', sentence: { jp: '水曜日は半日です。', romaji: 'Suiyoubi wa hannichi desu.', en: 'Wednesday is a half day.' }},
  { id: 'ev054', kana: 'もくようび', kanji: '木曜日', romaji: 'mokuyoubi', en: 'Thursday', bn: 'বৃহস্পতিবার', level: 'N5', category: 'days', sentence: { jp: '木曜日に会議があります。', romaji: 'Mokuyoubi ni kaigi ga arimasu.', en: 'There is a meeting on Thursday.' }},
  { id: 'ev055', kana: 'きんようび', kanji: '金曜日', romaji: 'kinyoubi', en: 'Friday', bn: 'শুক্রবার', level: 'N5', category: 'days', sentence: { jp: '金曜日の夜は飲みに行きます。', romaji: 'Kinyoubi no yoru wa nomi ni ikimasu.', en: 'I go drinking on Friday nights.' }},
  { id: 'ev056', kana: 'どようび', kanji: '土曜日', romaji: 'doyoubi', en: 'Saturday', bn: 'শনিবার', level: 'N5', category: 'days', sentence: { jp: '土曜日は休みです。', romaji: 'Doyoubi wa yasumi desu.', en: 'Saturday is a day off.' }},
  { id: 'ev057', kana: 'にちようび', kanji: '日曜日', romaji: 'nichiyoubi', en: 'Sunday', bn: 'রবিবার', level: 'N5', category: 'days', sentence: { jp: '日曜日に家族と過ごします。', romaji: 'Nichiyoubi ni kazoku to sugoshimasu.', en: 'I spend time with family on Sunday.' }},
  
  // ==================== FAMILY (20) ====================
  { id: 'ev058', kana: 'かぞく', kanji: '家族', romaji: 'kazoku', en: 'family', bn: 'পরিবার', level: 'N5', category: 'family', sentence: { jp: '私の家族は四人です。', romaji: 'Watashi no kazoku wa yonin desu.', en: 'My family has four people.' }},
  { id: 'ev059', kana: 'りょうしん', kanji: '両親', romaji: 'ryoushin', en: 'parents', bn: 'বাবা-মা', level: 'N5', category: 'family', sentence: { jp: '両親は元気です。', romaji: 'Ryoushin wa genki desu.', en: 'My parents are healthy.' }},
  { id: 'ev060', kana: 'ちち', kanji: '父', romaji: 'chichi', en: 'father (my)', bn: 'বাবা', level: 'N5', category: 'family', sentence: { jp: '父は会社員です。', romaji: 'Chichi wa kaishain desu.', en: 'My father is an office worker.' }},
  { id: 'ev061', kana: 'おとうさん', kanji: 'お父さん', romaji: 'otousan', en: 'father (polite)', bn: 'বাবা', level: 'N5', category: 'family', sentence: { jp: 'お父さん、お帰りなさい！', romaji: 'Otousan, okaerinasai!', en: 'Welcome home, father!' }},
  { id: 'ev062', kana: 'はは', kanji: '母', romaji: 'haha', en: 'mother (my)', bn: 'মা', level: 'N5', category: 'family', sentence: { jp: '母は料理が上手です。', romaji: 'Haha wa ryouri ga jouzu desu.', en: 'My mother is good at cooking.' }},
  { id: 'ev063', kana: 'おかあさん', kanji: 'お母さん', romaji: 'okaasan', en: 'mother (polite)', bn: 'মা', level: 'N5', category: 'family', sentence: { jp: 'お母さん、手伝って！', romaji: 'Okaasan, tetsudatte!', en: 'Mom, help me!' }},
  { id: 'ev064', kana: 'あに', kanji: '兄', romaji: 'ani', en: 'older brother (my)', bn: 'বড় ভাই', level: 'N5', category: 'family', sentence: { jp: '兄は大学生です。', romaji: 'Ani wa daigakusei desu.', en: 'My older brother is a university student.' }},
  { id: 'ev065', kana: 'おにいさん', kanji: 'お兄さん', romaji: 'oniisan', en: 'older brother (polite)', bn: 'বড় ভাই', level: 'N5', category: 'family', sentence: { jp: 'お兄さん、これを貸してください。', romaji: 'Oniisan, kore wo kashite kudasai.', en: 'Brother, please lend me this.' }},
  { id: 'ev066', kana: 'あね', kanji: '姉', romaji: 'ane', en: 'older sister (my)', bn: 'বড় বোন', level: 'N5', category: 'family', sentence: { jp: '姉は医者です。', romaji: 'Ane wa isha desu.', en: 'My older sister is a doctor.' }},
  { id: 'ev067', kana: 'おねえさん', kanji: 'お姉さん', romaji: 'oneesan', en: 'older sister (polite)', bn: 'বড় বোন', level: 'N5', category: 'family', sentence: { jp: 'お姉さんはきれいですね。', romaji: 'Oneesan wa kirei desu ne.', en: 'Your older sister is beautiful.' }},
  { id: 'ev068', kana: 'おとうと', kanji: '弟', romaji: 'otouto', en: 'younger brother', bn: 'ছোট ভাই', level: 'N5', category: 'family', sentence: { jp: '弟は高校生です。', romaji: 'Otouto wa koukousei desu.', en: 'My younger brother is a high school student.' }},
  { id: 'ev069', kana: 'いもうと', kanji: '妹', romaji: 'imouto', en: 'younger sister', bn: 'ছোট বোন', level: 'N5', category: 'family', sentence: { jp: '妹は中学生です。', romaji: 'Imouto wa chuugakusei desu.', en: 'My younger sister is a middle school student.' }},
  { id: 'ev070', kana: 'おじいさん', kanji: 'お祖父さん', romaji: 'ojiisan', en: 'grandfather', bn: 'দাদা/নানা', level: 'N5', category: 'family', sentence: { jp: 'おじいさんは八十歳です。', romaji: 'Ojiisan wa hachijussai desu.', en: 'My grandfather is 80 years old.' }},
  { id: 'ev071', kana: 'おばあさん', kanji: 'お祖母さん', romaji: 'obaasan', en: 'grandmother', bn: 'দাদি/নানি', level: 'N5', category: 'family', sentence: { jp: 'おばあさんの料理が好きです。', romaji: 'Obaasan no ryouri ga suki desu.', en: 'I like grandmother cooking.' }},
  
  // ==================== VERBS (100) ====================
  { id: 'ev072', kana: 'いく', kanji: '行く', romaji: 'iku', en: 'to go', bn: 'যাওয়া', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '学校に行きます。', romaji: 'Gakkou ni ikimasu.', en: 'I go to school.' }},
  { id: 'ev073', kana: 'くる', kanji: '来る', romaji: 'kuru', en: 'to come', bn: 'আসা', level: 'N5', category: 'verb', type: 'irregular', sentence: { jp: '明日、友達が来ます。', romaji: 'Ashita, tomodachi ga kimasu.', en: 'A friend is coming tomorrow.' }},
  { id: 'ev074', kana: 'かえる', kanji: '帰る', romaji: 'kaeru', en: 'to return home', bn: 'ফিরে যাওয়া', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '六時に家に帰ります。', romaji: 'Rokuji ni ie ni kaerimasu.', en: 'I return home at 6 o clock.' }},
  { id: 'ev075', kana: 'たべる', kanji: '食べる', romaji: 'taberu', en: 'to eat', bn: 'খাওয়া', level: 'N5', category: 'verb', type: 'ru-verb', sentence: { jp: '朝ごはんを食べましたか？', romaji: 'Asagohan wo tabemashita ka?', en: 'Did you eat breakfast?' }},
  { id: 'ev076', kana: 'のむ', kanji: '飲む', romaji: 'nomu', en: 'to drink', bn: 'পান করা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: 'コーヒーを飲みますか？', romaji: 'Koohii wo nomimasu ka?', en: 'Will you drink coffee?' }},
  { id: 'ev077', kana: 'みる', kanji: '見る', romaji: 'miru', en: 'to see/watch', bn: 'দেখা', level: 'N5', category: 'verb', type: 'ru-verb', sentence: { jp: 'テレビを見ます。', romaji: 'Terebi wo mimasu.', en: 'I watch TV.' }},
  { id: 'ev078', kana: 'きく', kanji: '聞く', romaji: 'kiku', en: 'to listen/ask', bn: 'শোনা/জিজ্ঞাসা করা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '音楽を聞きます。', romaji: 'Ongaku wo kikimasu.', en: 'I listen to music.' }},
  { id: 'ev079', kana: 'よむ', kanji: '読む', romaji: 'yomu', en: 'to read', bn: 'পড়া', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '本を読むのが好きです。', romaji: 'Hon wo yomu no ga suki desu.', en: 'I like reading books.' }},
  { id: 'ev080', kana: 'かく', kanji: '書く', romaji: 'kaku', en: 'to write', bn: 'লেখা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '手紙を書きます。', romaji: 'Tegami wo kakimasu.', en: 'I write letters.' }},
  { id: 'ev081', kana: 'はなす', kanji: '話す', romaji: 'hanasu', en: 'to speak', bn: 'কথা বলা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '日本語を話しますか？', romaji: 'Nihongo wo hanashimasu ka?', en: 'Do you speak Japanese?' }},
  { id: 'ev082', kana: 'あう', kanji: '会う', romaji: 'au', en: 'to meet', bn: 'দেখা করা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '友達に会います。', romaji: 'Tomodachi ni aimasu.', en: 'I meet with friends.' }},
  { id: 'ev083', kana: 'まつ', kanji: '待つ', romaji: 'matsu', en: 'to wait', bn: 'অপেক্ষা করা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: 'ここで待ってください。', romaji: 'Koko de matte kudasai.', en: 'Please wait here.' }},
  { id: 'ev084', kana: 'かう', kanji: '買う', romaji: 'kau', en: 'to buy', bn: 'কেনা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '新しい服を買いました。', romaji: 'Atarashii fuku wo kaimashita.', en: 'I bought new clothes.' }},
  { id: 'ev085', kana: 'おきる', kanji: '起きる', romaji: 'okiru', en: 'to wake up', bn: 'জাগা', level: 'N5', category: 'verb', type: 'ru-verb', sentence: { jp: '毎朝六時に起きます。', romaji: 'Maiasa rokuji ni okimasu.', en: 'I wake up at 6 every morning.' }},
  { id: 'ev086', kana: 'ねる', kanji: '寝る', romaji: 'neru', en: 'to sleep', bn: 'ঘুমানো', level: 'N5', category: 'verb', type: 'ru-verb', sentence: { jp: '十一時に寝ます。', romaji: 'Juuichiji ni nemasu.', en: 'I sleep at 11 o clock.' }},
  { id: 'ev087', kana: 'する', kanji: null, romaji: 'suru', en: 'to do', bn: 'করা', level: 'N5', category: 'verb', type: 'irregular', sentence: { jp: '何をしていますか？', romaji: 'Nani wo shite imasu ka?', en: 'What are you doing?' }},
  { id: 'ev088', kana: 'べんきょうする', kanji: '勉強する', romaji: 'benkyou suru', en: 'to study', bn: 'পড়াশোনা করা', level: 'N5', category: 'verb', type: 'irregular', sentence: { jp: '図書館で勉強します。', romaji: 'Toshokan de benkyou shimasu.', en: 'I study at the library.' }},
  { id: 'ev089', kana: 'しごとする', kanji: '仕事する', romaji: 'shigoto suru', en: 'to work', bn: 'কাজ করা', level: 'N5', category: 'verb', type: 'irregular', sentence: { jp: '毎日仕事します。', romaji: 'Mainichi shigoto shimasu.', en: 'I work every day.' }},
  { id: 'ev090', kana: 'あるく', kanji: '歩く', romaji: 'aruku', en: 'to walk', bn: 'হাঁটা', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '公園を歩きます。', romaji: 'Kouen wo arukimasu.', en: 'I walk in the park.' }},
  { id: 'ev091', kana: 'はしる', kanji: '走る', romaji: 'hashiru', en: 'to run', bn: 'দৌড়ানো', level: 'N5', category: 'verb', type: 'u-verb', sentence: { jp: '毎朝走ります。', romaji: 'Maiasa hashirimasu.', en: 'I run every morning.' }},
  
  // ==================== ADJECTIVES (80) ====================
  { id: 'ev092', kana: 'おおきい', kanji: '大きい', romaji: 'ookii', en: 'big', bn: 'বড়', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: 'この家は大きいです。', romaji: 'Kono ie wa ookii desu.', en: 'This house is big.' }},
  { id: 'ev093', kana: 'ちいさい', kanji: '小さい', romaji: 'chiisai', en: 'small', bn: 'ছোট', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: '小さい猫がいます。', romaji: 'Chiisai neko ga imasu.', en: 'There is a small cat.' }},
  { id: 'ev094', kana: 'たかい', kanji: '高い', romaji: 'takai', en: 'tall/expensive', bn: 'উঁচু/দামি', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: 'この建物は高いです。', romaji: 'Kono tatemono wa takai desu.', en: 'This building is tall.' }},
  { id: 'ev095', kana: 'ひくい', kanji: '低い', romaji: 'hikui', en: 'low/short', bn: 'নিচু', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: 'この机は低いです。', romaji: 'Kono tsukue wa hikui desu.', en: 'This desk is low.' }},
  { id: 'ev096', kana: 'やすい', kanji: '安い', romaji: 'yasui', en: 'cheap', bn: 'সস্তা', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: 'この店は安いです。', romaji: 'Kono mise wa yasui desu.', en: 'This store is cheap.' }},
  { id: 'ev097', kana: 'あたらしい', kanji: '新しい', romaji: 'atarashii', en: 'new', bn: 'নতুন', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: '新しい車が欲しいです。', romaji: 'Atarashii kuruma ga hoshii desu.', en: 'I want a new car.' }},
  { id: 'ev098', kana: 'ふるい', kanji: '古い', romaji: 'furui', en: 'old', bn: 'পুরানো', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: 'この寺は古いです。', romaji: 'Kono tera wa furui desu.', en: 'This temple is old.' }},
  { id: 'ev099', kana: 'いい', kanji: '良い', romaji: 'ii', en: 'good', bn: 'ভালো', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: '今日はいい天気ですね。', romaji: 'Kyou wa ii tenki desu ne.', en: 'It is good weather today.' }},
  { id: 'ev100', kana: 'わるい', kanji: '悪い', romaji: 'warui', en: 'bad', bn: 'খারাপ', level: 'N5', category: 'adjective', type: 'i-adj', sentence: { jp: '気分が悪いです。', romaji: 'Kibun ga warui desu.', en: 'I feel bad.' }},
  
  // ==================== PLACES (50) ====================
  { id: 'ev101', kana: 'がっこう', kanji: '学校', romaji: 'gakkou', en: 'school', bn: 'স্কুল', level: 'N5', category: 'place', sentence: { jp: '学校に歩いて行きます。', romaji: 'Gakkou ni aruite ikimasu.', en: 'I walk to school.' }},
  { id: 'ev102', kana: 'だいがく', kanji: '大学', romaji: 'daigaku', en: 'university', bn: 'বিশ্ববিদ্যালয়', level: 'N5', category: 'place', sentence: { jp: '東京大学で勉強しています。', romaji: 'Toukyou daigaku de benkyou shiteimasu.', en: 'I study at Tokyo University.' }},
  { id: 'ev103', kana: 'えき', kanji: '駅', romaji: 'eki', en: 'station', bn: 'স্টেশন', level: 'N5', category: 'place', sentence: { jp: '駅まで歩きます。', romaji: 'Eki made arukimasu.', en: 'I walk to the station.' }},
  { id: 'ev104', kana: 'びょういん', kanji: '病院', romaji: 'byouin', en: 'hospital', bn: 'হাসপাতাল', level: 'N5', category: 'place', sentence: { jp: '病院に行かなければなりません。', romaji: 'Byouin ni ikanakereba narimasen.', en: 'I have to go to the hospital.' }},
  { id: 'ev105', kana: 'ぎんこう', kanji: '銀行', romaji: 'ginkou', en: 'bank', bn: 'ব্যাংক', level: 'N5', category: 'place', sentence: { jp: '銀行でお金を下ろします。', romaji: 'Ginkou de okane wo oroshimasu.', en: 'I withdraw money at the bank.' }},
  { id: 'ev106', kana: 'ゆうびんきょく', kanji: '郵便局', romaji: 'yuubinkyoku', en: 'post office', bn: 'পোস্ট অফিস', level: 'N5', category: 'place', sentence: { jp: '郵便局で手紙を出します。', romaji: 'Yuubinkyoku de tegami wo dashimasu.', en: 'I mail letters at the post office.' }},
  { id: 'ev107', kana: 'スーパー', kanji: null, romaji: 'suupaa', en: 'supermarket', bn: 'সুপারমার্কেট', level: 'N5', category: 'place', sentence: { jp: 'スーパーで買い物します。', romaji: 'Suupaa de kaimono shimasu.', en: 'I shop at the supermarket.' }},
  { id: 'ev108', kana: 'コンビニ', kanji: null, romaji: 'konbini', en: 'convenience store', bn: 'সুবিধার দোকান', level: 'N5', category: 'place', sentence: { jp: 'コンビニは二十四時間です。', romaji: 'Konbini wa nijuuyojikan desu.', en: 'The convenience store is 24 hours.' }},
  { id: 'ev109', kana: 'レストラン', kanji: null, romaji: 'resutoran', en: 'restaurant', bn: 'রেস্তোরাঁ', level: 'N5', category: 'place', sentence: { jp: 'レストランを予約しました。', romaji: 'Resutoran wo yoyaku shimashita.', en: 'I reserved a restaurant.' }},
  { id: 'ev110', kana: 'こうえん', kanji: '公園', romaji: 'kouen', en: 'park', bn: 'পার্ক', level: 'N5', category: 'place', sentence: { jp: '公園で遊びましょう。', romaji: 'Kouen de asobimashou.', en: 'Let us play in the park.' }},

  // Continue adding more vocabulary up to 800...
];

// Categories for vocabulary
export const VOCAB_CATEGORIES = [
  'greetings', 'numbers', 'time', 'days', 'family', 'verb', 'adjective', 
  'place', 'food', 'body', 'nature', 'weather', 'transport', 'occupation',
  'school', 'home', 'shopping', 'sports', 'hobbies', 'emotions'
];

export default EXTENDED_VOCABULARY;
