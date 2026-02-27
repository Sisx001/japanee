import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Zap, Flame, Star, Target, Trophy, BookOpen,
  ChevronRight, Sparkles, Volume2, User
} from 'lucide-react';
import { HIRAGANA, KATAKANA, N5_KANJI, N4_KANJI, N5_VOCABULARY, N4_VOCABULARY } from '@/data/JapaneseData';

const Dashboard = () => {
  const { profile, progress, getLevelTitle, updateStreak, checkBadges } = useProfile();
  const { initializeAudio, startMusic, musicEnabled } = useAudio();

  useEffect(() => {
    updateStreak();
    checkBadges();
  }, [updateStreak, checkBadges]);

  const seigaihaPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Cpath fill='%23f43f5e' fill-opacity='0.05' d='M0 30c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM12.5 15c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM0 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z'/%3E%3C/svg%3E")`;

  const handleFirstInteraction = () => {
    initializeAudio();
    if (musicEnabled) {
      startMusic();
    }
  };

  const levelProgress = (progress.xp % 100);
  const xpToNextLevel = 100 - levelProgress;

  // Calculate learning progress with massive data in mind
  const totalHiragana = 46;
  const totalKatakana = 46;
  const totalKanji = N5_KANJI.length + N4_KANJI.length;
  // vocabLearned might contain items from MASSIVE_N5/N4 too
  const totalVocab = N5_VOCABULARY.length + N4_VOCABULARY.length + 1500;

  const hiraganaProgress = Math.round(((progress.hiraganaLearned?.length || 0) / totalHiragana) * 100);
  const katakanaProgress = Math.round(((progress.katakanaLearned?.length || 0) / totalKatakana) * 100);
  const kanjiProgress = Math.round(((progress.kanjiLearned?.length || 0) / totalKanji) * 100);
  const vocabProgress = Math.round(((progress.vocabLearned?.length || 0) / totalVocab) * 100) || 0;

  const quickActions = [
    { icon: 'あ', title: 'Hiragana', subtitle: `${progress.hiraganaLearned?.length || 0}/${totalHiragana}`, path: '/kana/hiragana', color: 'bg-rose-500 shadow-rose-500/20' },
    { icon: 'ア', title: 'Katakana', subtitle: `${progress.katakanaLearned?.length || 0}/${totalKatakana}`, path: '/kana/katakana', color: 'bg-blue-500 shadow-blue-500/20' },
    { icon: '漢', title: 'Kanji', subtitle: `${progress.kanjiLearned?.length || 0}/${totalKanji}`, path: '/kanji', color: 'bg-purple-500 shadow-purple-500/20' },
    { icon: '単', title: 'Vocabulary', subtitle: `${progress.vocabLearned?.length || 0} words`, path: '/vocab', color: 'bg-green-500 shadow-green-500/20' },
    { icon: '🎙️', title: 'Shadowing', subtitle: 'Voice Practice', path: '/practice/shadowing', color: 'bg-orange-500 shadow-orange-500/20' },
    { icon: '📚', title: 'Library', subtitle: 'Ebook Hub', path: '/ebooks', color: 'bg-indigo-500 shadow-indigo-500/20' },
  ];


  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10" onClick={handleFirstInteraction}>
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 md:gap-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-5 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-rose-500/10 shadow-xl relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: seigaihaPattern }} />
          <div className="flex flex-col items-center gap-4 md:gap-6 relative z-10 w-full">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500 to-indigo-500 rounded-2xl md:rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-2xl relative border border-rose-500/10">
                {profile?.avatar || '🌸'}
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-rose-500 text-white text-[8px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg shadow-lg">
                MASTER
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white italic leading-tight">
                OKAERI, <span className="text-rose-600">{profile?.name?.toUpperCase() || 'LEARNER'}</span>
              </h1>
              <div className="flex items-center justify-center gap-2 md:gap-3 mt-1">
                <Badge className="bg-rose-500/10 text-rose-600 border-0 px-2 md:px-3 py-0.5 md:py-1 rounded-lg font-black uppercase text-[8px] md:text-[10px] tracking-widest italic">
                  {getLevelTitle(progress.level)}
                </Badge>
                <div className="flex items-center gap-1.5 text-slate-400 font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  Tier {progress.level}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="glass rounded-[2rem] md:rounded-[2.5rem] border-0 overflow-hidden relative group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:scale-125 transition-all duration-700">
              <Zap className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-tight">Total Mastery</h3>
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter">{progress.xp} <span className="text-xs text-slate-400">XP</span></div>
                </div>
              </div>
              <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-3/4 animate-pulse-slow" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-[2rem] md:rounded-[2.5rem] border-0 overflow-hidden relative group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:scale-125 transition-all duration-700">
              <Star className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-rose-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-tight">Mastery Rank</h3>
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter">LV.{progress.level}</div>
                </div>
              </div>
              <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-1/2" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass rounded-[2rem] md:rounded-[2.5rem] border-0 overflow-hidden relative group hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:scale-125 transition-all duration-700">
              <Flame className="w-16 h-16 md:w-20 md:h-20" />
            </div>
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-orange-500/20 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner">
                  <Flame className="w-5 h-5 md:w-8 md:h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] italic leading-tight">Flame Streak</h3>
                  <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">{progress.streak} <span className="text-xs text-slate-400 lowercase">days</span></div>
                </div>
              </div>
              <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[80%]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="glass rounded-[2.5rem] border-0 relative overflow-hidden">
          <div className="absolute inset-0 premium-gradient opacity-[0.03]" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black italic">Next Milestone</h3>
                <p className="text-sm text-muted-foreground font-bold">Level {progress.level + 1}</p>
              </div>
              <span className="text-2xl font-black text-rose-500">{xpToNextLevel} <span className="text-xs uppercase font-bold text-muted-foreground">XP needed</span></span>
            </div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 premium-gradient transition-all duration-1000 ease-out progress-striped"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Quick Access Grid */}
          <section className="space-y-6">
            <div className="px-2">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Continue Learning</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Mastery Path</span>
                <div className="w-10 h-0.5 bg-rose-500/20" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {quickActions.map((action, idx) => (
                <Link key={idx} to={action.path} className="group">
                  <Card className="glass rounded-[1.5rem] md:rounded-[2rem] border-rose-500/5 group-hover:border-rose-500/20 transition-all duration-500 h-full relative overflow-hidden group-hover:shadow-2xl">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity" style={{ backgroundImage: seigaihaPattern }} />
                    <CardContent className="p-4 md:p-8 relative z-10 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 md:w-16 md:h-16 ${action.color} rounded-xl md:rounded-2xl flex items-center justify-center text-white text-xl md:text-3xl font-black shadow-xl mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <h3 className="font-black text-[10px] md:text-xs group-hover:text-rose-600 transition-colors uppercase tracking-[0.1em] md:tracking-[0.2em] mb-1">{action.title}</h3>
                      <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 italic opacity-80">{action.subtitle}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Master Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-4 px-2 tracking-tight">Mastery Status</h2>
            <Card className="glass rounded-[2.5rem] border-0">
              <CardContent className="p-8 space-y-6">
                {[
                  { label: 'Hiragana', value: hiraganaProgress, color: 'bg-rose-500' },
                  { label: 'Katakana', value: katakanaProgress, color: 'bg-blue-500' },
                  { label: 'Kanji', value: kanjiProgress, color: 'bg-purple-500' },
                  { label: 'Vocabulary', value: vocabProgress, color: 'bg-green-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                      <span className="text-lg font-black">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Practice Banner */}
            <Card className="rounded-[2.5rem] premium-gradient border-0 text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <CardContent className="p-8 flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-2xl font-black mb-1">Practice Zone</h3>
                  <p className="text-sm opacity-90 font-bold">Games, Quizzes & Challenges</p>
                </div>
                <Link to="/practice">
                  <Button className="rounded-2xl bg-white text-rose-500 hover:bg-slate-100 font-black px-6 h-12 transition-all hover:scale-105 shadow-xl">
                    Open Zone
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Badges Preview */}
        {progress.badges?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-black tracking-tight">Achievements</h2>
              <Link to="/settings" className="text-sm font-bold text-rose-500">View All</Link>
            </div>
            <Card className="glass rounded-[2rem] border-0">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-4">
                  {progress.badges.slice(-6).map((badgeId, idx) => (
                    <div key={idx} className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/20 group hover:scale-110 transition-transform cursor-pointer">
                      {badgeId === 'hiragana_master' && 'あ'}
                      {badgeId === 'katakana_pro' && 'ア'}
                      {badgeId === 'first_lesson' && '👣'}
                      {badgeId === 'streak_7' && '🔥'}
                      {badgeId === 'vocab_100' && '📚'}
                      {badgeId === 'kanji_50' && '漢'}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quote/Tip of the Day */}
        <Card className="glass rounded-[2rem] border-0 border-l-4 border-amber-500 overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest text-amber-600 mb-1">Tip of the Day</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Try the new <span className="text-rose-500 font-black italic">Bengali</span> toggle in settings
                to see translations in your preferred language!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
