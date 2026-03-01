import React from 'react';
import { Brain } from 'lucide-react';

const SplashScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 blur-[120px] rounded-full animate-pulse" />

            <div className="relative flex flex-col items-center">
                {/* Animated Icon Container */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 animate-pulse" />
                    <div className="bg-primary-500 p-6 rounded-3xl shadow-2xl shadow-primary-500/20 transform animate-bounce-slow">
                        <Brain className="text-white w-12 h-12" />
                    </div>
                </div>

                {/* Text Container */}
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-3 tracking-tighter animate-fade-in">
                        Strat<span className="text-primary-400">Acade</span>
                    </h1>
                    <div className="flex items-center gap-2 justify-center">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em] mt-8 animate-pulse">
                        Optimizing Your Path
                    </p>
                </div>
            </div>

            {/* Progress Bar Placeholder */}
            <div className="absolute bottom-12 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 w-1/2 animate-shimmer" />
            </div>
        </div>
    );
};

export default SplashScreen;
