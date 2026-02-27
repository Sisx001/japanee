import React, { useEffect, useState, useRef } from 'react';

const FuturisticCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [trail, setTrail] = useState([]);
    const requestRef = useRef();

    useEffect(() => {
        const mouseMove = (e) => {
            const { clientX: x, clientY: y } = e;
            setPosition({ x, y });

            const target = e.target;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer');

            // Shodo Trail logic: Accumulate points
            setTrail(prev => {
                const newTrail = [...prev, { x, y, id: Date.now() }];
                if (newTrail.length > 12) newTrail.shift();
                return newTrail;
            });
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
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            {/* Shodo Brush Trail */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
                <filter id="brush-blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
                </filter>
                {trail.length > 1 && (
                    <polyline
                        points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-rose-500/30 dark:text-rose-400/20"
                        style={{ filter: 'url(#brush-blur)' }}
                    />
                )}
            </svg>

            {/* Enso Circle (Main Reactive Element) */}
            <div
                className={`fixed -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out flex items-center justify-center
                    ${isPointer ? 'w-14 h-14' : 'w-6 h-6'}
                    ${isMouseDown ? 'scale-75' : 'scale-100'}`}
                style={{ left: position.x, top: position.y }}
            >
                {/* Visual "Ink" core */}
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isMouseDown ? 'bg-rose-600 scale-50' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`} />

                {/* Hand-drawn Enso Border Effect (SVG Overlay) */}
                <svg className="absolute inset-0 w-full h-full opacity-40 animate-spin-slow">
                    <circle
                        cx="50%" cy="50%" r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="70 30"
                        className="text-rose-500"
                    />
                </svg>
            </div>

            {/* Floating Sakura Petals (Drift Effect) */}
            {isMouseDown && (
                <div
                    className="fixed w-3 h-3 bg-pink-300/40 rounded-full blur-[1px] animate-ping"
                    style={{ left: position.x, top: position.y }}
                />
            )}

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default FuturisticCursor;
