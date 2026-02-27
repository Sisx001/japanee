import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import {
  ChevronRight, Sparkles, Volume2, Globe, MousePointer2,
  Trash2, Brain, Activity, Zap, Star, Flame, Trophy
} from 'lucide-react';
import { HIRAGANA, KATAKANA, N5_KANJI, N4_KANJI, N5_VOCABULARY, N4_VOCABULARY, N5_GRAMMAR, N4_GRAMMAR } from '@/data/JapaneseData';
import { MASSIVE_SENTENCES } from '@/data/MassiveSentences';
import { MASSIVE_N5_VOCAB } from '@/data/MassiveN5Vocab';
import { MASSIVE_N4_VOCAB } from '@/data/MassiveN4Vocab';

const LandingPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { initializeAudio, startMusic, musicEnabled } = useAudio();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    initializeAudio();
    if (musicEnabled) {
      startMusic();
    }
    navigate('/dashboard');
  };

  const stats = [
    { num: HIRAGANA.length + KATAKANA.length, label: 'Traditional Kana', icon: 'あ' },
    { num: N5_KANJI.length + N4_KANJI.length, label: 'Kanji Hub', icon: '漢' },
    { num: (N5_VOCABULARY?.length || 0) + (N4_VOCABULARY?.length || 0) + (MASSIVE_N5_VOCAB?.length || 0) + (MASSIVE_N4_VOCAB?.length || 0), label: 'Continue Learning', icon: '単' },
    { num: N5_GRAMMAR.length + N4_GRAMMAR.length, label: 'Grammar Guide', icon: '文' },
    { num: MASSIVE_SENTENCES.length, label: 'Reading Practice', icon: '話' }
  ];

  return (
    <div className="min-h-screen transition-all duration-700 selection:bg-rose-500/30 selection:text-white overflow-x-hidden">

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Large Background Calligraphy Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-1000">
          <h1 className="text-[30vw] font-black leading-none whitespace-nowrap japanese-text">日本語</h1>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1.5 md:py-2 rounded-full border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-rose-500 italic">Nihongo Zen // Beautiful Japanese Learning</span>
          </div>

          <div className="relative inline-block mb-10 md:mb-12 group px-4">
            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.9] md:leading-[0.8] mb-4">
              <span className="text-indigo-900 dark:text-indigo-200">NIHONGO</span><br />
              <span className="text-rose-500 italic">ZEN</span> <span className="text-rose-500">ACADEMY</span>
            </h1>
            <div className="absolute -right-12 top-0 vertical-text hidden lg:block opacity-40">
              <span className="text-2xl font-black japanese-text tracking-widest text-rose-500">学習システム</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-12 bg-rose-500/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">The Path of Master</span>
              <div className="h-px w-12 bg-rose-500/20" />
            </div>
          </div>

          <p className="text-sm md:text-2xl font-bold text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed h-auto opacity-80 px-4">
            The ultimate aesthetic bridge between traditional Japanese mastery and modern elegant design.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              onClick={handleStart}
              className="h-20 px-12 rounded-[2rem] bg-rose-500 text-white hover:bg-rose-600 transition-all duration-300 font-black text-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] group overflow-hidden relative"
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-white/20 group-hover:w-full transition-all duration-500" />
              <span className="relative z-10 flex items-center gap-3">
                START JOURNEY
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
            <Link to="/practice/reading">
              <Button variant="ghost" className="h-20 px-10 rounded-[2rem] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-black text-lg hover:bg-white dark:hover:bg-white/5 transition-all">
                OUR PHILOSOPHY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Stats Section */}
      <section className="py-12 md:py-32 px-4 shadow-inner bg-slate-50/50 dark:bg-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex md:grid md:grid-cols-5 gap-2 md:gap-4 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            {stats.map((stat, idx) => (
              <div key={idx} className="group relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-rose-500/10 p-3 md:p-8 rounded-2xl md:rounded-[3rem] hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex-shrink-0 w-[140px] md:w-auto h-24 md:h-auto flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-1 md:p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <span className="text-3xl md:text-8xl japanese-text">{stat.icon}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="text-base md:text-4xl font-black italic mb-0.5 group-hover:text-rose-500 transition-colors uppercase">{stat.num}+</h3>
                  <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none whitespace-normal md:whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Philosophies (Features) */}
      <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1 space-y-10 text-center md:text-left">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">Aesthetic<br />Mastery.</h2>
                <div className="w-24 h-2 bg-rose-500 rounded-full mx-auto md:mx-0" />
              </div>
              <p className="text-xl font-medium text-slate-500 leading-relaxed">
                Every interface is carved with precision. Every character is a brush stroke of art.
                We don't just teach Japanese; we harmonize your mind with the language.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Bengali Support', sub: 'Native Linguistics' },
                  { label: 'Crystal Audio', sub: 'Shadowing Practice' },
                  { label: 'Shodo Brush', sub: 'Writing Mastery' },
                  { label: 'Zen Dojo', sub: 'Focus Exams' }
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-5 rounded-2xl border border-rose-500/5">
                    <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight">{feat.label}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual Accent */}
            <div className="w-full md:w-1/3 relative group">
              <div className="absolute -inset-4 bg-rose-500/20 rounded-[4rem] blur-2xl group-hover:bg-rose-500/40 transition-all duration-1000" />
              <div className="relative aspect-square glass rounded-[4rem] flex items-center justify-center border-rose-500/10 shadow-2xl overflow-hidden">
                <span className="text-9xl group-hover:scale-125 transition-transform duration-1000">🌸</span>
                {/* Decorative Calligraphy */}
                <div className="absolute bottom-8 right-8 writing-vertical opacity-20">
                  <span className="text-4xl font-black japanese-text">美学</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-20 px-6 border-t border-rose-500/5 text-center">
        <div className="container mx-auto space-y-10">
          <div className="flex flex-col items-center gap-4 opacity-40">
            <span className="text-4xl font-black japanese-text tracking-widest">終</span>
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zen Master // Always Learning</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            <Link to="/kana" className="hover:text-rose-500 transition-colors">Kana Hub</Link>
            <Link to="/kanji" className="hover:text-rose-500 transition-colors">Kanji Hub</Link>
            <Link to="/vocab" className="hover:text-rose-500 transition-colors">Vocabulary</Link>
            <Link to="/practice/reading" className="hover:text-rose-500 transition-colors">Reading Practice</Link>
          </div>
          <p className="text-xs font-bold text-slate-400 opacity-30">© 2026 NIHONGO ZEN. ALL TRADITIONS RESERVED.</p>
        </div>
      </footer>

      <style jsx>{`
        .japanese-text { font-family: 'Noto Sans JP', sans-serif; }
        .vertical-text { writing-mode: vertical-rl; }
        .writing-vertical { writing-mode: vertical-rl; }
      `}</style>
    </div>
  );
};

export default LandingPage;
