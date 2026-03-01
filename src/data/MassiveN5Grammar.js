export const MASSIVE_N5_GRAMMAR = [
    {
        pattern: "〜は〜です",
        meaning: "A is B",
        bn: "A হলো B",
        explanation: "The basic sentence structure to identify something.",
        examples: [
            { jp: "私は学生です。", romaji: "Watashi wa gakusei desu.", en: "I am a student." },
            { jp: "これは本です。", romaji: "Kore wa hon desu.", en: "This is a book." }
        ]
    },
    {
        pattern: "〜の",
        meaning: "Possessive particle / 's",
        bn: "এর (মালিকানা)",
        explanation: "Connects two nouns where the first one possesses or modifies the second.",
        examples: [
            { jp: "私の車です。", romaji: "Watashi no kuruma desu.", en: "It is my car." },
            { jp: "日本のカメラ。", romaji: "Nihon no kamera.", en: "A Japanese camera." }
        ]
    },
    {
        pattern: "〜も",
        meaning: "Also / Too",
        bn: "ও (আরও)",
        explanation: "Replaces 'wa' or 'ga' to indicate that the subject also has the same property.",
        examples: [
            { jp: "私も学生です。", romaji: "Watashi mo gakusei desu.", en: "I am also a student." },
            { jp: "明日も雨です。", romaji: "Ashita mo ame desu.", en: "It will rain tomorrow too." }
        ]
    },
    {
        pattern: "〜を",
        meaning: "Object particle",
        bn: "কে/রে (কাজটি যার ওপর করা হয়)",
        explanation: "Marks the direct object of a verb.",
        examples: [
            { jp: "水を飲みます。", romaji: "Mizu o nomimasu.", en: "I drink water." },
            { jp: "本を読みました。", romaji: "Hon o yomimashita.", en: "I read a book." }
        ]
    },
    {
        pattern: "〜に / 〜へ",
        meaning: "Destination particle",
        bn: "দিকে / অভিমুখে",
        explanation: "Indicates the direction or destination of movement.",
        examples: [
            { jp: "学校に行きます。", romaji: "Gakkou ni ikimasu.", en: "I go to school." },
            { jp: "日本へ来ました。", romaji: "Nihon e kimashita.", en: "I came to Japan." }
        ]
    },
    {
        pattern: "〜で",
        meaning: "Location of action / Means",
        bn: "এ/তে (স্থান বা মাধ্যম)",
        explanation: "Indicates where an action takes place or the means used to do something.",
        examples: [
            { jp: "レストランで食べます。", romaji: "Resutoran de tabemasu.", en: "I eat at a restaurant." },
            { jp: "バスで行きます。", romaji: "Basu de ikimasu.", en: "I go by bus." }
        ]
    },
    {
        pattern: "〜から〜まで",
        meaning: "From ~ to ~",
        bn: "থেকে ~ পর্যন্ত",
        explanation: "Indicates starting and ending points in time or space.",
        examples: [
            { jp: "９時から５時まで働きます。", romaji: "Kuji kara goji made hatarakimasu.", en: "I work from 9 to 5." },
            { jp: "ここから東京まで。", romaji: "Koko kara Toukyou made.", en: "From here to Tokyo." }
        ]
    },
    {
        pattern: "〜てください",
        meaning: "Please do",
        bn: "দয়া করে করুন",
        explanation: "Used to make a polite request.",
        examples: [
            { jp: "座ってください。", romaji: "Suwatte kudasai.", en: "Please sit down." },
            { jp: "見てください。", romaji: "Mite kudasai.", en: "Please look." }
        ]
    },
    {
        pattern: "〜ています",
        meaning: "Currently doing (Present continuous)",
        bn: "করছি/করছে (চলমান)",
        explanation: "Indicates an action currently in progress.",
        examples: [
            { jp: "日本語を勉強しています。", romaji: "Nihongo o benkyou shite imasu.", en: "I am studying Japanese." },
            { jp: "雨が降っています。", romaji: "Ame ga futte imasu.", en: "It is raining." }
        ]
    },
    {
        pattern: "〜てもいいです",
        meaning: "May I... ? / It's okay to...",
        bn: "করতে পারি কি? / করা যাবে",
        explanation: "Used to ask for or give permission.",
        examples: [
            { jp: "写真を撮ってもいいですか。", romaji: "Shashin o tottemo ii desu ka.", en: "May I take a photo?" },
            { jp: "ここで食べてもいいですよ。", romaji: "Koko de tabetemo ii desu yo.", en: "It's okay to eat here." }
        ]
    },
    {
        pattern: "〜てはいけません",
        meaning: "Must not",
        bn: "করা যাবে না (নিষেধ)",
        explanation: "Strong prohibition.",
        examples: [
            { jp: "ここでタバコを吸ってはいけません。", romaji: "Koko de tabako o sutte wa ikemasen.", en: "You must not smoke here." },
            { jp: "入ってはいけません。", romaji: "Haitte wa ikemasen.", en: "You must not enter." }
        ]
    },
    {
        pattern: "〜ことがあります",
        meaning: "Have done before / Experience",
        bn: "করার অভিজ্ঞতা আছে",
        explanation: "Used with past tense (ta-form) to describe past experiences.",
        examples: [
            { jp: "日本へ行ったことがあります。", romaji: "Nihon e itta koto ga arimasu.", en: "I have been to Japan." },
            { jp: "寿司を食べたことがあります。", romaji: "Sushi o tabeta koto ga arimasu.", en: "I have eaten sushi before." }
        ]
    },
    {
        pattern: "〜たいです",
        meaning: "Want to do",
        bn: "করতে চাই",
        explanation: "Expresses the speaker's desire.",
        examples: [
            { jp: "日本へ行きたいです。", romaji: "Nihon e ikitai desu.", en: "I want to go to Japan." },
            { jp: "お茶を飲みたいです。", romaji: "Ocha o nomitai desu.", en: "I want to drink tea." }
        ]
    },
    {
        pattern: "〜ながら",
        meaning: "While doing",
        bn: "করতে করতে (একই সাথে)",
        explanation: "Two actions happening simultaneously by the same person.",
        examples: [
            { jp: "音楽を聞きながら勉強します。", romaji: "Ongaku o kikinagara benkyou shimasu.", en: "I study while listening to music." },
            { jp: "歩きながら話しましょう。", romaji: "Arukinagara hanashimashou.", en: "Let's talk while walking." }
        ]
    },
    {
        pattern: "〜ほうがいいです",
        meaning: "Had better / It's better to",
        bn: "করা ভালো হবে (পরামর্শ)",
        explanation: "Used for giving advice.",
        examples: [
            { jp: "早く寝たほうがいいですよ。", romaji: "Hayaku neta hou ga ii desu yo.", en: "You had better go to bed early." },
            { jp: "野菜を食べたほうがいいです。", romaji: "Yasai o tabeta hou ga ii desu.", en: "It's better to eat vegetables." }
        ]
    },
    {
        pattern: "〜まえに",
        meaning: "Before doing",
        bn: "করার আগে",
        explanation: "Indicates an action that happens before another.",
        examples: [
            { jp: "寝る前に本を読みます。", romaji: "Neru mae ni hon o yomimasu.", en: "I read a book before sleeping." },
            { jp: "食べる前に手を洗います。", romaji: "Taberu mae ni te o araimasu.", en: "I wash my hands before eating." }
        ]
    },
    {
        pattern: "〜あとで",
        meaning: "After doing",
        bn: "করার পরে",
        explanation: "Indicates an action that happens after another.",
        examples: [
            { jp: "仕事のあとで飲みに行きます。", romaji: "Shigoto no ato de nomi ni ikimasu.", en: "I go for a drink after work." },
            { jp: "ご飯を食べたあとで掃除します。", romaji: "Gohan o tabeta ato de souji shimasu.", en: "I clean after eating a meal." }
        ]
    },
    {
        pattern: "〜つもりです",
        meaning: "Plan to / Intend to",
        bn: "করার সংকল্প বা পরিকল্পনা আছে",
        explanation: "Expresses intention or plan.",
        examples: [
            { jp: "来年日本へ行くつもりです。", romaji: "Rainen Nihon e iku tsumori desu.", en: "I plan to go to Japan next year." },
            { jp: "明日勉強をするつもりです。", romaji: "Ashita benkyou o suru tsumori desu.", en: "I intend to study tomorrow." }
        ]
    },
    {
        pattern: "〜になる",
        meaning: "To become",
        bn: "হওয়া / হয়ে ওঠা",
        explanation: "Indicates a change in state or condition.",
        examples: [
            { jp: "医者になりたいです。", romaji: "Isha ni naitai desu.", en: "I want to become a doctor." },
            { jp: "暗くなりました。", romaji: "Kuraku narimashita.", en: "It has become dark." }
        ]
    },
    {
        pattern: "〜（の）が〜（形容詞）",
        meaning: "Like/Good at doing something",
        bn: "কিছু করা পছন্দ বা ভালো হওয়া",
        explanation: "Using 'no' or 'koto' to nominalize a verb.",
        examples: [
            { jp: "泳ぐのが好きです。", romaji: "Oyogu no ga suki desu.", en: "I like swimming." }
        ]
    },
    {
        pattern: "〜より〜のほうが〜",
        meaning: "A is more ... than B",
        bn: "B এর চেয়ে A বেশি ...",
        explanation: "Used for comparisons.",
        examples: [
            { jp: "肉より魚のほうが好きです。", romaji: "Niku yori sakana no hou ga suki desu.", en: "I like fish more than meat." }
        ]
    }
];

