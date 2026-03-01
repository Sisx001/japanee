import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useProfile } from '@/context/ProfileContext';
import { useAudio } from '@/context/AudioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Volume2, VolumeX, Sun, Moon, Target, Music, Sparkles, Languages,
  User, Settings, Trophy, Check, Edit2, ShieldAlert, Globe,
  Zap, Flame, Star, Activity, Crown, History,
  SkipBack, SkipForward, Play, Pause
} from 'lucide-react';
import { AVATAR_EMOJIS, BADGES, LEVEL_TITLES, N5_KANJI, N4_KANJI, N5_VOCABULARY, N4_VOCABULARY, ZEN_LEXICON } from '@/data/JapaneseData';

const SettingsPage = () => {
  const {
    profile, progress, settings,
    updateName, updateAvatar, updateSettings, toggleTheme, getLevelTitle, resetProgress, setLanguagePreference
  } = useProfile();
  const {
    musicEnabled, toggleMusic, musicVolume, setMusicVolume, playSound,
    currentTrack, nextTrack, prevTrack, musicPlaying
  } = useAudio();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSaveName = () => {
    if (newName.trim()) {
      updateName(newName.trim());
      setIsEditingName(false);
      playSound('correct');
    }
  };

  const handleAvatarChange = (emoji) => {
    updateAvatar(emoji);
    setShowAvatarPicker(false);
    playSound('click');
  };

  const accuracy = progress.totalQuestions > 0
    ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
    : 0;

  const earnedBadges = BADGES.filter(b => progress.badges?.includes(b.id));
  const lockedBadges = BADGES.filter(b => !progress.badges?.includes(b.id));

  // Expanded stats targets
  const totalHiragana = 46;
  const totalKatakana = 46;
  const totalKanji = N5_KANJI.length + N4_KANJI.length;
  const totalVocab = ZEN_LEXICON.length;
  const totalGrammar = 500 + 500; // N5 + N4 target

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
        {/* Profile Hero Header */}
        <div className="relative rounded-[3rem] overflow-hidden group">
          <div className="absolute inset-0 premium-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-white">
            <div className="relative group/avatar">
              <div
                className="w-28 h-28 md:w-32 md:h-32 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center text-5xl md:text-6xl shadow-2xl border-4 border-white/30 cursor-pointer hover:scale-105 transition-all active:scale-95"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                {profile?.avatar || '🌸'}
              </div>
              <button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-rose-500 rounded-2xl flex items-center justify-center shadow-xl hover:bg-rose-50 transition-colors"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {showAvatarPicker && (
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 glass border-white/20 p-4 rounded-[2rem] shadow-2xl flex flex-wrap justify-center gap-3 w-64 animate-bounce-in">
                  {AVATAR_EMOJIS.map((emoji, idx) => (
                    <button
                      key={idx}
                      className={`text-3xl p-2 rounded-2xl hover:bg-white/20 transition-all hover:scale-110 ${profile?.avatar === emoji ? 'bg-white/30 scale-110 shadow-inner' : ''}`}
                      onClick={() => handleAvatarChange(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-2 flex-1">
              <div className="flex items-center justify-center md:justify-start gap-4">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-2xl font-black bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-2xl px-6 min-w-[180px]"
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                    />
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-white text-rose-500 hover:bg-rose-50" onClick={handleSaveName}>
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 group/name">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter drop-shadow-lg uppercase italic">{profile?.name}</h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="opacity-0 group-hover/name:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-xl"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-4 text-sm font-black uppercase tracking-widest backdrop-blur-md rounded-full shadow-lg">
                  {getLevelTitle(progress.level)}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white py-1.5 px-4 text-sm font-bold rounded-full">
                  Level {progress.level}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white py-1.5 px-4 text-sm font-bold rounded-full">
                  {progress.xp} XP
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Control */}
        <Tabs defaultValue="stats" className="space-y-8">
          <TabsList className="glass p-1.5 rounded-[2rem] h-14 w-full max-w-2xl mx-auto flex">
            <TabsTrigger value="stats" className="flex-1 rounded-2xl font-black uppercase tracking-tighter h-full data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all gap-2">
              <Activity className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-1 rounded-2xl font-black uppercase tracking-tighter h-full data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all gap-2">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 rounded-2xl font-black uppercase tracking-tighter h-full data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="stats" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Level', val: progress.level, icon: <Crown className="text-amber-500" />, bg: 'bg-amber-500/10' },
                { label: 'Total XP', val: progress.xp, icon: <Zap className="text-rose-500" />, bg: 'bg-rose-500/10' },
                { label: 'Streak', val: `${progress.streak}d`, icon: <Flame className="text-orange-500" />, bg: 'bg-orange-500/10' },
                { label: 'Accuracy', val: `${accuracy}%`, icon: <Star className="text-yellow-500" />, bg: 'bg-yellow-500/10' },
              ].map((stat, i) => (
                <Card key={i} className="glass rounded-3xl border-0 overflow-hidden group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-black">{stat.val}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass rounded-[2.5rem] border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <History className="w-6 h-6 text-rose-500" />
                    Learning Mastery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { label: 'Hiragana', current: progress.hiraganaLearned?.length || 0, total: totalHiragana, color: 'bg-rose-500' },
                    { label: 'Katakana', current: progress.katakanaLearned?.length || 0, total: totalKatakana, color: 'bg-blue-500' },
                    { label: 'Kanji', current: progress.kanjiLearned?.length || 0, total: totalKanji, color: 'bg-purple-500' },
                    { label: 'Vocabulary', current: progress.vocabLearned?.length || 0, total: totalVocab, color: 'bg-green-500' },
                    { label: 'Grammar', current: progress.grammarLearned?.length || 0, total: totalGrammar, color: 'bg-amber-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                        <span className="text-lg font-black">{item.current} <span className="text-xs text-muted-foreground">/ {item.total}</span></span>
                      </div>
                      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${(item.current / item.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass rounded-[2.5rem] border-0">
                <CardHeader>
                  <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progress.quizHistory?.length > 0 ? (
                      progress.quizHistory.slice(-4).reverse().map((quiz, i) => (
                        <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white text-xs font-black">
                              QZ
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{quiz.title || 'General Quiz'}</h4>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(quiz.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-rose-500">+{quiz.xp} XP</div>
                            <div className="text-[10px] font-bold text-muted-foreground border border-muted px-2 rounded-full">{quiz.score}/{quiz.total}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 opacity-50">
                        <History className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold">No recent activity found.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BADGES.map((badge) => {
                const isEarned = progress.badges?.includes(badge.id);
                return (
                  <Card key={badge.id} className={`glass rounded-[2rem] border-0 overflow-hidden transition-all duration-500 ${isEarned ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-95'}`}>
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-transform ${isEarned ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-orange-500/20 rotate-3' : 'bg-muted/50'}`}>
                        {isEarned ? badge.icon : '🔒'}
                      </div>
                      <div>
                        <h3 className="font-black text-sm tracking-tighter uppercase">{badge.name}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground leading-tight px-2">{badge.description}</p>
                      </div>
                      {isEarned && (
                        <div className="flex justify-center">
                          <Badge className="bg-green-500 text-white border-0 text-[8px] font-black uppercase">Earned</Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <Card className="glass rounded-[2.5rem] border-0 overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 text-rose-500">
                  <Activity className="w-7 h-7" />
                  Settings & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Theme Selection */}
                <div className="flex items-center justify-between gap-4 glass-light p-6 rounded-3xl">
                  <div>
                    <Label className="text-lg font-black tracking-tight">Visual Theme</Label>
                    <p className="text-sm text-muted-foreground font-medium">Toggle between Light and Dark mode</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-14 w-14 rounded-2xl glass hover:bg-white/10 text-rose-500">
                    {settings?.theme === 'dark' ? <Moon className="w-7 h-7" /> : <Sun className="w-7 h-7" />}
                  </Button>
                </div>

                {/* Language Selection */}
                <div className="space-y-4 glass-light p-6 rounded-3xl">
                  <Label className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    Language Interface
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'en', label: 'ENGLISH' },
                      { id: 'bn', label: 'BENGALI' }
                    ].map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguagePreference(lang.id)}
                        className={`h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settings?.languagePreference === lang.id ? 'bg-indigo-500 text-white shadow-lg' : 'glass hover:bg-white/10'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Mode */}
                <div className="space-y-4 glass-light p-6 rounded-3xl">
                  <Label className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Target className="w-5 h-5 text-rose-500" />
                    Mastery Difficulty
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'easy', label: 'TRAINEE' },
                      { id: 'medium', label: 'OPERATOR' },
                      { id: 'hard', label: 'ELITE' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        onClick={() => updateSettings({ difficulty: diff.id })}
                        className={`h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settings?.difficulty === diff.id ? 'bg-rose-500 text-white shadow-lg' : 'glass hover:bg-white/10'}`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Music & Sound Control */}
                <div className="space-y-6 glass-light p-6 rounded-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-lg font-black tracking-tight flex items-center gap-2 text-rose-500">
                        <Music className="w-6 h-6" />
                        Background Music
                      </Label>
                      <p className="text-xs text-muted-foreground font-bold italic">Immersive Japanese environment</p>
                    </div>
                    <Switch
                      checked={musicEnabled}
                      onCheckedChange={toggleMusic}
                      className="data-[state=checked]:bg-rose-500"
                    />
                  </div>

                  {musicEnabled && (
                    <div className="space-y-4 p-4 glass rounded-2xl animate-fade-in">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="text-[10px] font-black uppercase text-rose-500/50 tracking-[0.2em]">Now Playing</div>
                        <div className="text-sm font-black tracking-tight truncate max-w-full italic text-rose-600 dark:text-rose-400">
                          {currentTrack?.title || "Selecting Track..."}
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { prevTrack(); playSound('click'); }}
                          className="h-10 w-10 rounded-xl hover:bg-rose-500/10 text-rose-500"
                        >
                          <SkipBack className="w-5 h-5 fill-current" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { nextTrack(); playSound('click'); }}
                          className="h-10 w-10 rounded-xl hover:bg-rose-500/10 text-rose-500"
                        >
                          <SkipForward className="w-5 h-5 fill-current" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t border-rose-500/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Master Volume</span>
                      <span className="text-sm font-black text-rose-500">{Math.round(musicVolume * 100)}%</span>
                    </div>
                    <Slider
                      value={[musicVolume * 100]}
                      onValueChange={(v) => setMusicVolume(v[0] / 100)}
                      max={100}
                      step={1}
                      className="py-4 opacity-100 ring-offset-background"
                    />
                  </div>
                </div>

                {/* Cursor Mode */}
                <div className="space-y-4 glass-light p-6 rounded-3xl">
                  <Label className="text-lg font-black tracking-tight flex items-center gap-2">
                    <Star className="w-5 h-5 text-rose-500" />
                    Cursor Style
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Ink Brush', 'Sakura', 'Traditional'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateSettings({ cursorType: mode.toLowerCase().replace(' ', '_') })}
                        className={`h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${settings?.cursorType === mode.toLowerCase().replace(' ', '_') ? 'bg-rose-500 text-white shadow-lg' : 'glass hover:bg-white/10'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Goals */}
            <Card className="glass rounded-[2.5rem] border-0 overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3 text-indigo-500">
                  <Zap className="w-7 h-7" />
                  Daily Library Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  { label: 'Kanji Mastery', current: 2, total: 5, xp: 50 },
                  { label: 'Vocabulary Practice', current: 14, total: 20, xp: 100 },
                  { label: 'Echo Practice', current: 1, total: 3, xp: 150 }
                ].map((mission, i) => (
                  <div key={i} className="p-5 glass-light rounded-3xl flex items-center justify-between group hover:border-rose-500/30 transition-all">
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between mb-2 pr-4">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">{mission.label}</span>
                        <span className="text-xs font-black text-rose-500">{mission.current}/{mission.total}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mr-4">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(mission.current / mission.total) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-indigo-500">+{mission.xp} XP</div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Reward</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass rounded-[2.5rem] border-0 overflow-hidden border-rose-500/20 bg-rose-500/5">
              <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-2">
                  <h3 className="text-2xl font-black text-rose-500 tracking-tighter flex items-center justify-center md:justify-start gap-2">
                    <ShieldAlert className="w-7 h-7" />
                    Reset Disciple Data
                  </h3>
                  <p className="text-sm text-muted-foreground font-bold italic">Warning: This action is permanent and will erase all your hard-earned progress!</p>
                </div>
                <Button
                  variant="destructive"
                  className="h-16 px-12 rounded-3xl font-black uppercase tracking-widest text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  onClick={() => {
                    if (confirm('Are you absolutely sure, Learner? All your XP, Badges and Course Progress will be vanished into the void.')) {
                      resetProgress();
                    }
                  }}
                >
                  Reset Progress
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs >
      </div >
    </MainLayout >
  );
};

export default SettingsPage;
