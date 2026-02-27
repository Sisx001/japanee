import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ChevronLeft, ChevronRight, FileText, Sparkles } from 'lucide-react';

const EBOOKS = [
    {
        id: 1,
        title: 'Beginner Hiragana Guide',
        description: 'Complete Visual Handbook',
        url: '/pdf/example1.pdf',
        level: 'N5',
        type: 'Core Guide'
    },
    {
        id: 2,
        title: 'Intermediate N4 Kanji',
        description: 'Traditional Stroke Mastery',
        url: '/pdf/example2.pdf',
        level: 'N4',
        type: 'Handbook'
    }
];

const EbookReader = () => {
    const [activeEbook, setActiveEbook] = useState(EBOOKS[0]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <MainLayout>
            <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-6 animate-fade-in px-4 pb-10">
                {/* Sidebar / Library Selector */}
                <div className={`glass rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 transition-all duration-500 overflow-hidden flex flex-col gap-4 md:gap-8 ${sidebarOpen ? 'w-full lg:w-96' : 'w-full lg:w-24'}`}>
                    <div className="flex items-center justify-between px-2">
                        {sidebarOpen && <h2 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">Zen Library</h2>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="rounded-2xl hover:bg-rose-500/10 text-rose-500 h-12 w-12"
                        >
                            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                        </Button>
                    </div>

                    <div className={`flex-1 space-y-3 md:space-y-4 overflow-y-auto no-scrollbar ${!sidebarOpen && 'hidden lg:block'}`}>
                        {EBOOKS.map((ebook) => (
                            <Card
                                key={ebook.id}
                                onClick={() => {
                                    setActiveEbook(ebook);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`cursor-pointer transition-all duration-500 border-0 overflow-hidden rounded-[1.5rem] md:rounded-[2rem] ${activeEbook.id === ebook.id
                                    ? 'bg-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] scale-[1.02]'
                                    : 'bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-900/60'
                                    }`}
                            >
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${activeEbook.id === ebook.id ? 'bg-white/20' : 'bg-rose-500/10'}`}>
                                            <BookOpen className={`w-5 h-5 md:w-6 md:h-6 ${activeEbook.id === ebook.id ? 'text-white' : 'text-rose-500'}`} />
                                        </div>
                                        {sidebarOpen && (
                                            <div className="min-w-0">
                                                <p className={`font-black text-xs uppercase tracking-widest truncate ${activeEbook.id === ebook.id ? 'text-white' : 'text-foreground'}`}>
                                                    {ebook.title}
                                                </p>
                                                <Badge className={`mt-2 text-[8px] font-black uppercase ${activeEbook.id === ebook.id ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    {ebook.level} LEVEL
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {sidebarOpen && (
                        <div className="p-4 md:p-6 bg-rose-500/5 rounded-[1.5rem] md:rounded-[2rem] border border-rose-500/10 space-y-2 md:space-y-3">
                            <div className="flex items-center gap-2 text-rose-500">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Zen Reading</span>
                            </div>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 italic leading-relaxed uppercase">
                                Sync complete. Focus on the brush strokes.
                            </p>
                        </div>
                    )}
                </div>

                {/* Reader Area */}
                <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">
                    <div className="glass rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 flex items-center justify-between shadow-xl border-rose-500/10">
                        <div className="flex items-center gap-3 md:gap-5">
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-rose-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                                <FileText className="w-5 h-5 md:w-7 md:h-7" />
                            </div>
                            <div>
                                <h1 className="text-base md:text-2xl font-black italic tracking-tighter uppercase leading-none md:leading-normal">{activeEbook.title}</h1>
                                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{activeEbook.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-rose-500/20 text-rose-500 md:flex hidden"
                                onClick={() => window.open(activeEbook.url, '_blank')}
                            >
                                <Sparkles className="w-4 h-4 mr-2" /> FULLSCREEN
                            </Button>
                            {!sidebarOpen && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-rose-500/20 text-rose-500 lg:hidden"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    LIBRARY
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[500px] md:h-[850px] glass rounded-[2rem] md:rounded-[3.5rem] overflow-hidden relative shadow-2xl border-rose-500/5 bg-slate-100 dark:bg-slate-900 flex flex-col">
                        <iframe
                            src={activeEbook.url}
                            className="w-full h-full border-0"
                            style={{ minHeight: '400px', height: '100%' }}
                            title={activeEbook.title}
                        />
                        <div className="lg:hidden p-6 bg-amber-500/10 dark:bg-amber-900/20 backdrop-blur-md flex flex-col items-center gap-4 text-center border-t border-amber-500/20">
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-[10px] tracking-widest uppercase">
                                <Sparkles className="w-4 h-4" /> PERFORMANCE CAUTION
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">
                                MOBILE VIEWERS MAY REQUIRE SYSTEM ASSISTANCE FOR LARGE DATA DOCUMENTS.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-rose-500 bg-rose-500 text-white font-black italic shadow-lg shadow-rose-500/20"
                                onClick={() => window.open(activeEbook.url, '_blank')}
                            >
                                OPEN IN TRADITIONAL VIEWER
                            </Button>
                        </div>
                        <div className="absolute inset-0 pointer-events-none border-[10px] md:border-[20px] border-black/5 rounded-[2rem] md:rounded-[3.5rem]"></div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default EbookReader;
