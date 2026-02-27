import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HIRAGANA, KATAKANA, N5_VOCABULARY, N5_KANJI } from '@/data/CompleteJapaneseContent';
import n5Kanji from '@/data/n5_kanji.json';
import n5Vocab from '@/data/n5_vocab.json';

const DictionaryPage = () => {
  const { t, showRomaji, language } = useSettings();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchLocal = (q) => {
    const term = q.toLowerCase().trim();
    const found = [];

    // Search hiragana / katakana
    [...HIRAGANA, ...KATAKANA].forEach(k => {
      if (
        k.char?.includes(term) ||
        k.romaji?.toLowerCase().includes(term)
      ) {
        found.push({
          type: 'kana',
          data: {
            id: k.char,
            character: k.char,
            romaji: k.romaji,
            kana_type: HIRAGANA.find(h => h.char === k.char) ? 'hiragana' : 'katakana',
            group: k.row || k.romaji?.charAt(0) || ''
          }
        });
      }
    });

    // Search N5 kanji JSON
    [...n5Kanji].forEach(k => {
      if (
        k.kanji?.includes(term) ||
        k.meaning?.toLowerCase().includes(term) ||
        k.onyomi?.toLowerCase().includes(term) ||
        k.kunyomi?.toLowerCase().includes(term)
      ) {
        found.push({
          type: 'kanji',
          data: {
            id: k.kanji,
            character: k.kanji,
            meanings_en: [k.meaning],
            meanings_bn: [k.meaning_bn || k.meaning],
            jlpt_level: 'N5',
            stroke_count: k.strokes || '?',
            onyomi: k.onyomi ? [k.onyomi] : [],
            kunyomi: k.kunyomi ? [k.kunyomi] : []
          }
        });
      }
    });

    // Search N5 vocab JSON
    [...n5Vocab].forEach(v => {
      if (
        v.word?.includes(term) ||
        v.reading?.includes(term) ||
        v.meaning?.toLowerCase().includes(term) ||
        v.romaji?.toLowerCase().includes(term)
      ) {
        found.push({
          type: 'vocab',
          data: {
            id: v.word,
            word_kanji: v.word,
            word_kana: v.reading || v.word,
            romaji: v.romaji || '',
            meaning_en: v.meaning,
            meaning_bn: v.meaning_bn || v.meaning,
            jlpt_level: 'N5',
            tags: v.tags || []
          }
        });
      }
    });

    return found.slice(0, 30);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      setResults(searchLocal(query));
      setLoading(false);
    }, 150);
  };

  const renderResult = (item) => {
    switch (item.type) {
      case 'kana':
        return (
          <Card key={item.data.id} className="rounded-2xl">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-3xl font-bold japanese-text">{item.data.character}</span>
              </div>
              <div>
                <Badge variant="outline" className="mb-1">{item.data.kana_type}</Badge>
                <p className="font-bold">{item.data.romaji}</p>
                <p className="text-sm text-muted-foreground">{item.data.group} row</p>
              </div>
            </CardContent>
          </Card>
        );

      case 'kanji':
        return (
          <Card key={item.data.id} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-4xl font-bold japanese-text">{item.data.character}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{item.data.jlpt_level}</Badge>
                    <span className="text-sm text-muted-foreground">{item.data.stroke_count} strokes</span>
                  </div>
                  <p className="font-bold">
                    {language === 'bn' ? item.data.meanings_bn?.join(', ') : item.data.meanings_en?.join(', ')}
                  </p>
                  <div className="mt-2 text-sm">
                    {item.data.onyomi?.length > 0 && <>
                      <span className="text-muted-foreground">On: </span>
                      <span className="japanese-text">{item.data.onyomi.join('、')}</span>
                    </>}
                    {item.data.onyomi?.length > 0 && item.data.kunyomi?.length > 0 && <span className="mx-2">|</span>}
                    {item.data.kunyomi?.length > 0 && <>
                      <span className="text-muted-foreground">Kun: </span>
                      <span className="japanese-text">{item.data.kunyomi.join('、')}</span>
                    </>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'vocab':
        return (
          <Card key={item.data.id} className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold japanese-text">
                      {item.data.word_kanji || item.data.word_kana}
                    </span>
                    {item.data.word_kanji && (
                      <span className="text-sm text-muted-foreground japanese-text">
                        ({item.data.word_kana})
                      </span>
                    )}
                    <Badge variant="outline">{item.data.jlpt_level}</Badge>
                  </div>
                  {showRomaji && (
                    <p className="text-sm text-muted-foreground">{item.data.romaji}</p>
                  )}
                  <p className="font-medium mt-1">
                    {language === 'bn' ? item.data.meaning_bn : item.data.meaning_en}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {item.data.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div data-testid="dictionary-page" className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {t('Dictionary', 'অভিধান')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('Search kana, kanji, and vocabulary', 'কানা, কাঞ্জি ও শব্দভান্ডার খুঁজুন')}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('Search by romaji, kana, kanji, or meaning...', 'রোমাজি, কানা, কাঞ্জি বা অর্থ দিয়ে খুঁজুন...')}
              className="pl-12 h-14 rounded-2xl text-lg"
              data-testid="dictionary-search-input"
            />
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">{t('Searching...', 'খুঁজছি...')}</p>
            </div>
          </div>
        ) : searched ? (
          results.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {results.length} {t('results found', 'টি ফলাফল পাওয়া গেছে')}
              </p>
              {results.map((item, idx) => (
                <div key={idx}>{renderResult(item)}</div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-muted-foreground">
                {t('No results found', 'কোন ফলাফল পাওয়া যায়নি')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('Try a different search term', 'অন্য কিছু দিয়ে খুঁজুন')}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <p className="text-muted-foreground">
              {t('Start typing to search', 'খুঁজতে টাইপ শুরু করুন')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['あ', '日', 'cat', 'hello'].map(term => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setQuery(term);
                    setResults(searchLocal(term));
                    setSearched(true);
                  }}
                >
                  {t('Try', 'চেষ্টা করুন')}: {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DictionaryPage;
