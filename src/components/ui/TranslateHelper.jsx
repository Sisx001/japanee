import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const TranslateHelper = ({
    children,
    romaji,
    bengali,
    english,
    className = ""
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span className={`cursor-help hover:text-rose-500 transition-colors border-b border-dashed border-rose-300/50 ${className}`}>
                    {children}
                </span>
            </PopoverTrigger>
            <PopoverContent className="glass border-rose-200/50 p-4 w-64 animate-in fade-in zoom-in duration-200">
                <div className="space-y-3">
                    {romaji && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Romaji</p>
                            <p className="font-bold text-rose-500 tracking-tight">{romaji}</p>
                        </div>
                    )}
                    {bengali && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bengali (বাংলা)</p>
                            <p className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{bengali}</p>
                        </div>
                    )}
                    {english && (
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">English</p>
                            <p className="font-medium text-slate-600 dark:text-slate-400 text-sm">{english}</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
