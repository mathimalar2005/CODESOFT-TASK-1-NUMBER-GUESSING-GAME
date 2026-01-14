
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, GuessResult } from './types';
import ProgressBar from './components/ProgressBar';
import ParticleBurst from './components/ParticleBurst';
import CppGuide from './components/CppGuide';

const App: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [lastResult, setLastResult] = useState<GuessResult | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [shaking, setShaking] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const startNewGame = useCallback(() => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setStatus(GameStatus.PLAYING);
    setGuess('');
    setLastResult(null);
    setAttempts(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleGuess = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const num = parseInt(guess);
    if (isNaN(num)) return;

    setAttempts(prev => prev + 1);
    
    const diff = Math.abs(targetNumber - num);
    const range = 100;
    // Closeness: 1 is correct, 0 is far away
    const closeness = Math.max(0, 1 - (diff / range));

    if (num === targetNumber) {
      setStatus(GameStatus.WON);
      setLastResult({ message: 'CRITICAL HIT! Target neutralized.', closeness: 1, isCorrect: true });
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      
      let message = '';
      if (num < targetNumber) message = 'INSUFFICIENT VALUE. Aim higher.';
      else message = 'EXCESSIVE MAGNITUDE. Aim lower.';
      
      setLastResult({ message, closeness, isCorrect: false });
    }
    setGuess('');
  };

  useEffect(() => {
    // Auto-start on load
    if (status === GameStatus.IDLE) {
      // Small delay for initial animation
      const timer = setTimeout(() => startNewGame(), 1000);
      return () => clearTimeout(timer);
    }
  }, [status, startNewGame]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${shaking ? 'animate-shake' : ''}`}>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500 blur-[150px] rounded-full"></div>
      </div>

      {/* Header Section */}
      <div className="text-center z-10 mb-12">
        <h1 className="text-6xl md:text-8xl font-orbitron font-bold uppercase tracking-tighter text-cyan-400 animate-breathe mb-2">
          Neon Guess
        </h1>
        <p className="text-zinc-500 uppercase tracking-[0.4em] font-light text-sm">
          A Neural Number Probability System
        </p>
      </div>

      {/* Main Game Interface */}
      <div className="w-full max-w-lg px-6 z-10">
        <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>
          
          {status === GameStatus.PLAYING ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest">System Protocol</p>
                <p className="text-2xl font-semibold text-zinc-100 italic">"Identify the integer between 1 and 100"</p>
              </div>

              <form onSubmit={handleGuess} className="relative group">
                <input
                  ref={inputRef}
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="???"
                  className="w-full bg-black/50 border-2 border-zinc-800 focus:border-cyan-500 rounded-xl py-6 text-center text-5xl font-orbitron text-cyan-400 outline-none transition-all placeholder:text-zinc-800 focus:shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                  autoFocus
                />
                <div className="absolute bottom-[-40px] right-0 text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
                  Attempts Logged: {attempts}
                </div>
              </form>

              <button
                onClick={() => handleGuess()}
                className="w-full bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 font-bold py-4 rounded-xl transition-all uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Execute Probe
              </button>

              {lastResult && (
                <div className="pt-4 border-t border-zinc-800 flex flex-col items-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className={`text-center font-bold mb-2 uppercase tracking-tight ${lastResult.isCorrect ? 'text-green-400 neon-text-green' : 'text-pink-400 neon-text-pink'}`}>
                    {lastResult.message}
                  </p>
                  <ProgressBar closeness={lastResult.closeness} label={lastResult.isCorrect ? '100% MATCH' : `${Math.round(lastResult.closeness * 100)}% Match`} />
                </div>
              )}
            </div>
          ) : status === GameStatus.WON ? (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className="space-y-2">
                <h2 className="text-5xl font-orbitron font-black text-green-400 neon-text-green">SUCCESS</h2>
                <p className="text-zinc-400 uppercase tracking-widest">Access Granted in {attempts} cycles</p>
              </div>
              
              <div className="py-8 bg-black/40 rounded-2xl border border-green-500/30">
                <p className="text-sm text-zinc-500 uppercase tracking-widest mb-2">Target Decoded</p>
                <p className="text-8xl font-orbitron text-zinc-100 font-black">{targetNumber}</p>
              </div>

              <button
                onClick={startNewGame}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-5 rounded-xl transition-all uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(34,197,94,0.4)]"
              >
                Reset Connection
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Win State Particles */}
      {status === GameStatus.WON && <ParticleBurst />}

      {/* Floating Footer Controls */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
        <button 
          onClick={() => setShowGuide(true)}
          className="px-6 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-500 hover:text-cyan-400 hover:border-cyan-400/50 transition-all text-xs uppercase tracking-widest"
        >
          View C++ Source Logic
        </button>
        <button 
          onClick={startNewGame}
          className="px-6 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-500 hover:text-pink-400 hover:border-pink-400/50 transition-all text-xs uppercase tracking-widest"
        >
          Hard Reset
        </button>
      </div>

      {/* C++ Documentation Modal */}
      {showGuide && <CppGuide onClose={() => setShowGuide(false)} />}
      
    </div>
  );
};

export default App;
