import React, { useEffect, useState, useRef } from 'react';
import { useProfile } from '@/context/ProfileContext';

const ZenCursor = () => {
    const { settings } = useProfile();
    const cursorType = settings?.cursorType || 'traditional';

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [trail, setTrail] = useState([]);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const mouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            setPosition({ x, y });

            const target = e.target;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');

            if (cursorType === 'ink_brush') {
                setTrail(prev => {
                    const newTrail = [...prev, { x, y, id: Math.random() }];
                    if (newTrail.length > 20) newTrail.shift();
                    return newTrail;
                });
            }

            if (cursorType === 'sakura' && Math.random() > 0.85) {
                setParticles(prev => [
                    ...prev,
                    {
                        x, y,
                        id: Math.random(),
                        vx: (Math.random() - 0.5) * 2,
                        vy: Math.random() * 2 + 1,
                        rotation: Math.random() * 360,
                        rv: (Math.random() - 0.5) * 10
                    }
                ].slice(-15));
            }
        };

        const mouseDown = () => setIsMouseDown(true);
        const mouseUp = () => setIsMouseDown(false);

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mousedown', mouseDown);
        window.addEventListener('mouseup', mouseUp);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mousedown', mouseDown);
            window.removeEventListener('mouseup', mouseUp);
        };
    }, [cursorType]);

    // Particle animation loop
    useEffect(() => {
        if (cursorType !== 'sakura') return;

        const timer = setInterval(() => {
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                rotation: p.rotation + p.rv
            })).filter(p => p.y < window.innerHeight));
        }, 30);

        return () => clearInterval(timer);
    }, [cursorType]);

    if (typeof window === 'undefined') return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block overflow-hidden">
            {/* Ink Brush Mode */}
            {cursorType === 'ink_brush' && (
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <filter id="ink-blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    </filter>
                    <path
                        d={trail.length > 1 ? `M ${trail.map(p => `${p.x},${p.y}`).join(' L ')}` : ''}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-900/40 dark:text-slate-100/30"
                        style={{ filter: 'url(#ink-blur)' }}
                    />
                </svg>
            )}

            {/* Sakura Mode Particles */}
            {cursorType === 'sakura' && particles.map(p => (
                <div
                    key={p.id}
                    className="absolute w-3 h-3 text-rose-300 pointer-events-none transition-opacity duration-1000"
                    style={{
                        left: p.x,
                        top: p.y,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2C12,2 14.5,6 18,6C21,6 23,8 23,11C23,13.5 21,15 18,15C15,15 12,19 12,19C12,19 9,15 6,15C3,15 1,13.5 1,11C1,8 3,6 6,6C9.5,6 12,2 12,2Z" />
                    </svg>
                </div>
            ))}

            {/* Main Cursor Circle */}
            <div
                className={`fixed -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center
                    ${isPointer ? 'w-10 h-10' : 'w-5 h-5'}
                    ${isMouseDown ? 'scale-75' : 'scale-100'}`}
                style={{ left: position.x, top: position.y }}
            >
                {/* Core Element */}
                <div className={`
                    absolute inset-0 rounded-full border-2 
                    ${cursorType === 'ink_brush' ? 'border-slate-900/50 dark:border-slate-100/50' : 'border-rose-500/50'}
                    ${isPointer ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                    transition-all duration-300
                `} />

                <div className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${cursorType === 'ink_brush' ? 'bg-slate-900 dark:bg-slate-100' : 'bg-rose-500'}
                    ${isMouseDown ? 'scale-50' : 'scale-100'}
                `} />
            </div>
        </div>
    );
};

export default ZenCursor;
