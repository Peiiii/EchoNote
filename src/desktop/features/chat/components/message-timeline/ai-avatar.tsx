import { Sparkles } from "lucide-react";

export const AIAvatar = () => (
    <div className="relative">
        {/* Outer glow */}
        <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-sm animate-pulse"></div>
        
        {/* Main avatar */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="relative">
                    <Sparkles className="w-4 h-4 text-white drop-shadow-sm" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/30 blur-sm animate-ping"></div>
                </div>
            </div>
            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-1 rounded-full bg-white/40 blur-sm"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 rounded-full bg-black/20 blur-sm"></div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white shadow-sm">
            <div className="w-full h-full rounded-full bg-green-400 animate-pulse"></div>
        </div>
    </div>
); 