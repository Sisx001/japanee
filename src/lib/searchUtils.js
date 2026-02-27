// Romaji to Kana mapping (Basic)
const ROMAJI_TO_KANA = {
    'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
    'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
    'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
    'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
    'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
    'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
    'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
    'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
    'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
    'wa': 'わ', 'wo': 'を', 'n': 'ん',
    'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
    'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
    'da': 'だ', 'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
    'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ'
};

export const convertRomajiToKana = (text) => {
    let result = text.toLowerCase();
    // Sort keys by length descending to match longest sequences first (like 'sha' before 'sa')
    const keys = Object.keys(ROMAJI_TO_KANA).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        result = result.split(key).join(ROMAJI_TO_KANA[key]);
    }
    return result;
};

export const fuzzyMatch = (item, query) => {
    const q = query.toLowerCase().trim();
    if (!q) return 0;

    const fields = [
        item.display?.toLowerCase(),
        item.reading?.toLowerCase(),
        item.meaning?.toLowerCase(),
        item.bn?.toLowerCase(),
        item.romaji?.toLowerCase()
    ].filter(Boolean);

    // Exact match on display or reading
    if (item.display?.toLowerCase() === q || item.reading?.toLowerCase() === q) return 100;

    // Exact match on meaning
    if (item.meaning?.toLowerCase() === q) return 90;

    // Starts with
    if (fields.some(f => f.startsWith(q))) return 80;

    // Includes
    if (fields.some(f => f.includes(q))) return 60;

    // Romaji to Kana fuzzy match
    const kanaQuery = convertRomajiToKana(q);
    if (item.display?.includes(kanaQuery) || item.reading?.includes(kanaQuery)) return 70;

    return 0;
};
