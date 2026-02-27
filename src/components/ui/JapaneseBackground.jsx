import React from 'react';
import { useProfile } from '@/context/ProfileContext';

const JapaneseBackground = () => {
    const { settings } = useProfile();
    const isDark = settings?.theme === 'dark';

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 transition-colors duration-1000">
            {/* Dynamic Gradient Base */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark
                    ? 'bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#020617_100%)] opacity-100'
                    : 'bg-[radial-gradient(circle_at_50%_50%,_#fff1f2_0%,_#f8fafc_100%)] opacity-100'
                }`} />

            {/* Seigaiha (Wave) Pattern Overlay */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='60' viewBox='0 0 100 60'%3E%3Cpath fill='%23f43f5e' fill-opacity='0.4' d='M0 30c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM12.5 15c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zM0 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10zm25 0c5 0 10 5 10 10s-5 10-10 10-10-5-10-10 5-10 10-10z'/%3E%3C/svg%3E")`,
                    backgroundSize: '100px 60px'
                }}
            />

            {/* Ambient Animated Orbs */}
            <div className={`absolute top-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full blur-[120px] mix-blend-screen animate-pulse ${isDark ? 'bg-rose-900/10' : 'bg-rose-200/30'}`} />
            <div className={`absolute bottom-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full blur-[120px] mix-blend-screen animate-pulse delay-700 ${isDark ? 'bg-indigo-900/10' : 'bg-indigo-200/20'}`} />

            {/* Floating Particles (Sakura/Static) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full animate-float transition-all duration-1000 ${isDark ? 'bg-rose-500/20 w-1 h-1' : 'bg-rose-300/40 w-2 h-2'
                            }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translate(100px, -100px) rotate(360deg); opacity: 0; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
};

export default JapaneseBackground;
