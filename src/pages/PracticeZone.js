import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Dumbbell, Target, Zap, Trophy, Pen, Eye, FileText,
  Infinity, MessageSquare, BookText, ArrowRight, Flame, Sparkles, Headphones, Mic,
  Library, Activity
} from 'lucide-react';

const PracticeZone = () => {
  const { progress, settings, profile } = useProfile();
  const language = profile?.preferredLanguage || 'en';

  // Pattern SVGs for card backgrounds
  const patterns = {
    seigaiha: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Cpath fill='%23f43f5e' fill-opacity='0.05' d='M0 30c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM12.5 15c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM0 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z'/%3E%3C/svg%3E")`,
    asanoha: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath fill='%236366f1' fill-opacity='0.05' d='M40 0l40 40-40 40L0 40z'/%3E%3C/svg%3E")`,
  };

  const practiceCategories = [
    { title: 'Kana Drills', desc: 'Syllabic Foundation', icon: 'あ', color: 'text-rose-500', pattern: patterns.seigaiha, path: '/quiz/kana' },
    { title: 'Kanji Hub', desc: 'Symbolic Wisdom', icon: '漢', color: 'text-purple-500', pattern: patterns.asanoha, path: '/quiz/kanji' },
    { title: 'Vocabulary Practice', desc: 'Word Harmony', icon: '単', color: 'text-blue-500', pattern: patterns.seigaiha, path: '/quiz/vocab' },
    { title: 'Grammar Guide', desc: 'Elegant Structure', icon: '文', color: 'text-green-500', pattern: patterns.asanoha, path: '/quiz/grammar' },
  ];

  const advancedModes = [
    { title: 'Shodo Brush', icon: Pen, desc: 'Calligraphy Practice', path: '/practice/writing', color: 'text-amber-500', badge: 'Art' },
    { title: 'Zen Board', icon: Sparkles, desc: 'Digital Ink Painting', path: '/practice/whiteboard', color: 'text-violet-500', badge: 'Free' },
    { title: 'Conjugation Trainer', icon: Target, desc: 'Verb/Adjective Logic', path: '/practice/conjugation', color: 'text-rose-500', badge: 'New' },
    { title: 'Sentence Path', icon: BookOpen, desc: 'Contextual Building', path: '/practice/sentence', color: 'text-emerald-500' },
    { title: 'Echo Shadowing', icon: Mic, desc: 'Voice Mastery', path: '/practice/shadowing', color: 'text-orange-500', badge: 'Voice' },
    { title: 'Listening Hub', icon: Headphones, desc: 'Audio Recognition', path: '/practice/listening', color: 'text-blue-500' },
    { title: 'Story Library', icon: BookText, desc: 'Reading Practice', path: '/practice/reading', color: 'text-cyan-500' },
    { title: 'Unlimited Practice', icon: Infinity, desc: 'Random Challenges', path: '/practice/unlimited', color: 'text-pink-500', badge: 'Bonus' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-10 max-w-5xl mx-auto pb-20">

        {/* Traditional Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 text-indigo-950 dark:text-indigo-200">Practice Dojo</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">Mastery Path // Discipline Active</p>
          </div>
          <div className="flex items-center gap-4 bg-white/50 dark:bg-white/5 px-6 py-3 rounded-2xl border border-rose-500/10 backdrop-blur-xl">
            <Target className="w-5 h-5 text-rose-500" />
            <span className="text-xs font-black uppercase tracking-widest">{settings.difficulty} MODE</span>
          </div>
        </div>

        {/* Zen Progress Stats */}
        <Card className="glass rounded-[2rem] md:rounded-[3rem] border-0 overflow-hidden relative group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: patterns.seigaiha }} />
          <CardContent className="p-6 md:p-10 relative z-10 flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8">
            {[
              { val: progress.totalQuestions || 0, label: 'Mastery Points', color: 'text-rose-500' },
              { val: progress.totalCorrect || 0, label: 'Harmonized', color: 'text-green-500' },
              { val: `${Math.round((progress.totalCorrect / (progress.totalQuestions || 1)) * 100)}%`, label: 'Efficiency', color: 'text-amber-500' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.val}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Discipline Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <Activity className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Daily Discipline</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {practiceCategories.map((cat, i) => (
              <Link key={i} to={cat.path} className="group">
                <Card className="glass rounded-[2rem] border-0 h-full hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 overflow-hidden relative border border-rose-500/5 hover:border-rose-500/20 shadow-sm">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity" style={{ backgroundImage: cat.pattern }} />
                  <CardContent className="p-6 md:p-8 text-center relative z-10">
                    <div className={`text-3xl font-black mb-4 group-hover:scale-110 transition-transform ${cat.color}`}>{cat.icon}</div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest mb-1">{cat.title}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{cat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Traditional Mastery Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <Sparkles className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Traditional Mastery</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advancedModes.map((mode, i) => (
              <Link key={i} to={mode.path} className="group">
                <Card className="glass rounded-[2.5rem] border-0 h-full border border-rose-500/5 hover:border-rose-500/30 hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-500 shadow-sm hover:shadow-xl">
                  <CardContent className="p-6 md:p-8 flex items-center gap-4 md:gap-6">
                    <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center group-hover:bg-rose-500 transition-all duration-500 shadow-inner">
                      <mode.icon className={`w-6 h-6 ${mode.color} group-hover:text-white transition-colors`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-sm uppercase tracking-tight group-hover:text-rose-600 transition-colors">{mode.title}</h3>
                        {mode.badge && <Badge className="text-[8px] bg-rose-500 text-white border-0 px-2 py-0.5 rounded-lg font-black italic">{mode.badge}</Badge>}
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic opacity-80">{mode.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Challenge/Exam Section */}
        <section>
          <Card className="rounded-[2.5rem] md:rounded-[3rem] bg-indigo-950 border-0 text-white p-8 md:p-12 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: patterns.seigaiha }} />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-1">Shogun Certification</h2>
                <p className="text-sm opacity-80 font-bold max-w-md uppercase tracking-widest">Master the complete JLPT sequence to unlock legendary status.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/practice/mock-test?level=N5">
                  <Button className="h-14 px-10 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black italic tracking-tight transition-all hover:scale-105 shadow-xl">N5 MASTERY</Button>
                </Link>
                <Link to="/practice/mock-test?level=N4">
                  <Button className="h-14 px-10 rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-black italic tracking-tight transition-all hover:scale-105 shadow-xl border border-white/10">N4 MASTERY</Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </MainLayout>
  );
};

export default PracticeZone;
