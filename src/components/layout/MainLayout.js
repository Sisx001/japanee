import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProfile } from '@/context/ProfileContext';
import {
  Home, BookOpen, FileText, Dumbbell, Settings,
  Sun, Moon, Volume2, VolumeX, Sparkles, Brain,
  LayoutDashboard, LogOut, Search, Headphones, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/context/AudioContext';
import ZenCursor from '../ui/ZenCursor';
import JapaneseBackground from '../ui/JapaneseBackground';

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const { profile, progress, settings, toggleTheme } = useProfile();
  const { musicEnabled, toggleMusic } = useAudio();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'DASHBOARD' },
    { path: '/kana', icon: BookOpen, label: 'KANA HUB' },
    { path: '/kanji', icon: FileText, label: 'KANJI HUB' },
    { path: '/practice', icon: Dumbbell, label: 'PRACTICE DOJO' },
    { path: '/settings', icon: Settings, label: 'SETTINGS' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-rose-500/30 overflow-x-hidden cursor-${settings?.cursorType || 'traditional'}`}>
      <ZenCursor />
      <JapaneseBackground />

      {/* Premium Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-rose-500/10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-500/20 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap">NIHONGO<span className="text-rose-500 italic">ZEN</span></span>
              <span className="text-[8px] font-black text-slate-400 tracking-[0.4em] uppercase mt-1">Refined Mastery System</span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl border border-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${isActive(item.path)
                    ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-xl shadow-black/5 ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-rose-500 hover:bg-white/50 dark:hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2" />

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-xl h-12 w-12 hover:bg-rose-500/10 transition-colors ${musicEnabled ? 'text-rose-500' : 'text-slate-400'}`}
                onClick={() => toggleMusic(!musicEnabled)}
                title={musicEnabled ? "Mute Background Music" : "Play Background Music"}
              >
                {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-12 w-12 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                onClick={toggleTheme}
              >
                {settings?.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <div className="flex flex-col items-end px-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">RANK: DISCIPLE</span>
                <div className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-md shadow-sm">LV.{progress?.level || 1}</div>
              </div>
              <span className="text-sm font-black text-rose-500">{progress?.xp || 0} XP MASTERED</span>
            </div>
          </div>
        </div>
      </header>

      {/* High-Visibility Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-rose-500/20 h-16 shadow-lg shadow-rose-500/5">
        <div className="px-4 h-full flex items-center justify-between gap-2">
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[12px] tracking-tighter uppercase whitespace-nowrap">NIHONGO<span className="text-rose-500">ZEN</span></span>
              <span className="text-[6px] font-black text-slate-400 tracking-widest uppercase mt-0.5">EST. 2026</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            {/* Explicit Music Button for Mobile */}
            <Button
              variant="outline"
              size="icon"
              className={`rounded-xl h-11 w-11 border-rose-500/30 shadow-md transition-all active:scale-90 ${musicEnabled ? 'bg-rose-500 text-white border-transparent' : 'bg-white dark:bg-slate-900 text-slate-400'}`}
              onClick={() => toggleMusic(!musicEnabled)}
            >
              {musicEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-11 w-11 bg-white dark:bg-slate-900 border-rose-500/30 text-slate-400 shadow-md transition-all active:scale-90"
              onClick={toggleTheme}
            >
              {settings?.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1" />

            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-black text-rose-500 leading-none">{progress?.xp || 0} XP</span>
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">LV. {progress?.level || 1}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-10 max-w-6xl overflow-x-hidden">
        {children}
      </main>

      {/* Futuristic Mobile Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl safe-p-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center group w-12 h-12 rounded-2xl transition-all duration-500 ${isActive(item.path)
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                : 'text-slate-400 hover:text-rose-400'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {isActive(item.path) && (
                <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Elegant Footer */}
      <footer className="hidden md:block mt-20 border-t border-rose-500/5 py-10">
        <div className="container mx-auto px-6 flex items-center justify-between opacity-40">
          <p className="text-xs font-bold tracking-widest uppercase">Zen Path // Ascending</p>
          <p className="text-xs font-bold">© 2026 NIHONGO ZEN. CLASSIC MASTERY SYSTEM.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
