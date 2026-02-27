/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Flame, 
  Ghost, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Lock, 
  X, 
  ChevronRight,
  Info,
  Volume2,
  VolumeX,
  Settings,
  Edit2,
  Save,
  Upload,
  Plus,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import { Mode, ModeConfig, Task } from './types';
import { MODES } from './constants';

// --- Components ---

const AgeVerification = ({ onVerify }: { onVerify: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-romantic-black p-6"
    >
      <div className="max-w-md w-full glass-panel p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-romantic-pink/20 flex items-center justify-center glow-pink">
            <ShieldCheck className="w-10 h-10 text-romantic-pink" />
          </div>
        </div>
        <h1 className="text-3xl font-serif italic">SpinPlay</h1>
        <p className="text-gray-400">
          This application contains adult content intended for individuals aged 18 and over.
        </p>
        <div className="space-y-4">
          <button 
            onClick={onVerify}
            className="w-full py-4 bg-romantic-pink hover:bg-rose-600 transition-colors rounded-xl font-semibold text-lg"
          >
            I am 18+ and Consent
          </button>
          <button 
            className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold"
            onClick={() => window.location.href = 'https://google.com'}
          >
            Exit
          </button>
        </div>
      </div>
    </motion.div>
  );
};



const Wheel = ({ 
  tasks, 
  onResult, 
  isSpinning, 
  setIsSpinning, 
  color, 
  onSpinStart, 
  remoteRotation, 
  isMuted,
  onHoverTask
}: { 
  tasks: Task[], 
  onResult: (task: Task) => void,
  isSpinning: boolean,
  setIsSpinning: (val: boolean) => void,
  color: string,
  onSpinStart?: (rotation: number) => void,
  remoteRotation?: number,
  isMuted: boolean,
  onHoverTask: (task: Task | null) => void
}) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  const spinSound = useRef<HTMLAudioElement | null>(null);
  const stopSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3');
    stopSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    
    if (spinSound.current) spinSound.current.loop = true;
    
    return () => {
      if (spinSound.current) spinSound.current.pause();
      if (stopSound.current) stopSound.current.pause();
    };
  }, []);

  // Handle remote rotation
  useEffect(() => {
    if (remoteRotation !== undefined && remoteRotation !== rotation) {
      setIsSpinning(true);
      setRotation(remoteRotation);
      
      if (!isMuted && spinSound.current) {
        spinSound.current.currentTime = 0;
        spinSound.current.play().catch(() => {});
      }
      
      setTimeout(() => {
        setIsSpinning(false);
        if (spinSound.current) spinSound.current.pause();
        if (!isMuted && stopSound.current) {
          stopSound.current.currentTime = 0;
          stopSound.current.play().catch(() => {});
        }
        
        const normalizedRotation = remoteRotation % 360;
        const segmentSize = 360 / tasks.length;
        const index = Math.floor(((360 - (normalizedRotation % 360)) % 360) / segmentSize);
        onResult(tasks[index]);
      }, 4000);
    }
  }, [remoteRotation]);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    onHoverTask(null);
    const extraSpins = 5 + Math.random() * 5;
    const newRotation = rotation + extraSpins * 360 + Math.random() * 360;
    setRotation(newRotation);

    if (!isMuted && spinSound.current) {
      spinSound.current.currentTime = 0;
      spinSound.current.play().catch(() => {});
    }

    if (onSpinStart) {
      onSpinStart(newRotation);
    }

    setTimeout(() => {
      setIsSpinning(false);
      if (spinSound.current) spinSound.current.pause();
      if (!isMuted && stopSound.current) {
        stopSound.current.currentTime = 0;
        stopSound.current.play().catch(() => {});
      }
      
      const normalizedRotation = newRotation % 360;
      const segmentSize = 360 / tasks.length;
      const index = Math.floor(((360 - (normalizedRotation % 360)) % 360) / segmentSize);
      onResult(tasks[index]);
    }, 4000);
  };

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto flex flex-col items-center">
      {/* Wheel Stand / Base */}
      <div className="absolute -bottom-10 w-48 h-16 bg-gradient-to-b from-white/10 to-transparent rounded-t-[100px] border-t border-white/20 shadow-[0_-10px_20px_rgba(255,255,255,0.05)]" />
      <div className="absolute -bottom-12 w-64 h-4 bg-white/5 rounded-full blur-sm" />

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
        <div className="w-8 h-10 bg-gradient-to-b from-amber-300 to-amber-600 clip-path-triangle shadow-[0_0_15px_rgba(251,191,36,0.5)]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full blur-[1px] opacity-50" />
      </div>

      {/* Wheel Container */}
      <motion.div 
        ref={wheelRef}
        animate={{ rotate: rotation }}
        transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
        className="w-full h-full rounded-full border-[12px] border-[#2a1b3d] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5),0_0_20px_rgba(255,45,85,0.2)]"
        style={{ background: 'conic-gradient(#1a0b2e, #050505, #1a0b2e)' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {tasks.map((task, i) => {
            const angle = 360 / tasks.length;
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            
            const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const colors = [
              'rgba(255, 45, 85, 0.4)',   // Pink
              'rgba(139, 92, 246, 0.4)',  // Purple
              'rgba(59, 130, 246, 0.4)',  // Blue
              'rgba(16, 185, 129, 0.4)',  // Green
              'rgba(245, 158, 11, 0.4)',  // Amber
              'rgba(239, 68, 68, 0.4)',   // Red
            ];
            const wedgeColor = colors[i % colors.length];

            return (
              <g 
                key={task.id} 
                onMouseEnter={() => !isSpinning && onHoverTask(task)}
                onMouseLeave={() => onHoverTask(null)}
                className="cursor-help pointer-events-auto"
              >
                <path 
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill={wedgeColor}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="0.3"
                  className="transition-opacity hover:opacity-80 pointer-events-auto"
                />
                <text
                  x="50"
                  y="10"
                  transform={`rotate(${startAngle + angle / 2}, 50, 50) rotate(90, 50, 10)`}
                  fill="white"
                  fontSize="2.4"
                  fontWeight="700"
                  textAnchor="start"
                  className="pointer-events-none select-none"
                  style={{ textShadow: '0px 1px 2px rgba(0,0,0,1)' }}
                >
                  {task.text.length > 18 ? task.text.substring(0, 15) + '...' : task.text}
                </text>
                
                {/* Decorative Stud */}
                <circle 
                  cx="50" 
                  cy="5" 
                  r="1.2" 
                  fill="url(#studGradient)" 
                  transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                  className="drop-shadow-sm pointer-events-none"
                />
                
                {/* Subtle Highlight */}
                <path 
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                  fill="url(#wedgeHighlight)"
                  className="opacity-20 pointer-events-none"
                />
              </g>
            );
          })}
          <defs>
            <radialGradient id="studGradient">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <linearGradient id="wedgeHighlight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Hub Decoration */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-24 h-24 rounded-full border-4 border-white/10 bg-black/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-[2px]" />
        </div>
        
        {/* Center Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button 
            onClick={spin}
            disabled={isSpinning}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-[0_0_30px_rgba(255,45,85,0.5)] transform active:scale-95 transition-all duration-300 disabled:opacity-50 border-4 border-white/20`}
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            <span className="relative font-bold text-[10px] tracking-widest uppercase text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">Spin</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TaskResultModal = ({ task, onClose }: { task: Task, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-10 text-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-romantic-pink to-transparent" />
        
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-romantic-pink font-bold">Your Task</p>
          <h2 className="text-3xl font-serif italic text-white leading-tight">
            "{task.text}"
          </h2>
        </div>

        { (task.visual || task.image) && (
          <div className="flex justify-center py-4">
            <motion.div 
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                damping: 10, 
                stiffness: 100,
                delay: 0.2 
              }}
              className="w-48 h-48 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] border-2 border-white/30 relative group overflow-hidden"
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 via-transparent to-white/10 animate-pulse" />
              
              {/* Floating Particles (Simulated) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-ping" />
                <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/60 rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" />
              </div>

              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[12px] font-black px-3 py-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] uppercase tracking-widest border border-white/20 z-10">
                Heavenly
              </div>
              
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                {task.image ? (
                  <img 
                    src={task.image} 
                    alt={task.text} 
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-8xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                    {task.visual}
                  </span>
                )}
              </div>
              
              {/* Shine Effect */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.div>
          </div>
        )}

        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-romantic-pink animate-pulse" />
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Spin Again
        </button>
      </motion.div>
    </motion.div>
  );
};

const PremiumLock = ({ mode, onUnlock }: { mode: ModeConfig, onUnlock: () => void }) => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-400/20 flex items-center justify-center">
        <Lock className="w-6 h-6 text-amber-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-lg">{mode.name} Mode</h3>
        <p className="text-sm text-gray-400">Unlock this premium experience</p>
      </div>
      <button 
        onClick={onUnlock}
        className="px-6 py-2 bg-amber-400 text-black font-bold rounded-full text-sm hover:bg-amber-300 transition-colors"
      >
        Unlock Now
      </button>
    </div>
  );
};


const AdminLogin = ({ 
  onLogin, 
  onClose 
}: { 
  onLogin: () => void, 
  onClose: () => void 
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration
    // In a real app, this would be validated against a backend
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid admin password');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-sm w-full glass-panel p-8 space-y-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-amber-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif italic">Admin Login</h2>
          <p className="text-gray-400 text-sm">Enter password to access console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-amber-400 transition-colors text-center"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminPanel = ({ 
  modes, 
  onUpdate, 
  onClose 
}: { 
  modes: ModeConfig[], 
  onUpdate: (newConfig: ModeConfig[]) => void,
  onClose: () => void 
}) => {
  const [editingMode, setEditingMode] = useState<ModeConfig | null>(null);
  const [localModes, setLocalModes] = useState<ModeConfig[]>(modes);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleTaskChange = (modeId: string, taskId: string, field: string, value: string) => {
    const updated = localModes.map(m => {
      if (m.id === modeId) {
        return {
          ...m,
          tasks: m.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t)
        };
      }
      return m;
    });
    setLocalModes(updated);
  };

  const handleImageUpload = (modeId: string, taskId: string, file: File) => {
    setUploadError(null);
    
    // 500KB limit check
    if (file.size > 500 * 1024) {
      setUploadError(`Image too large (${(file.size / 1024).toFixed(0)}KB). Max limit is 500KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleTaskChange(modeId, taskId, 'image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const saveConfig = () => {
    onUpdate(localModes);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-romantic-black overflow-y-auto p-6"
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        <div className="flex justify-between items-center sticky top-0 bg-romantic-black/80 backdrop-blur-md py-4 z-10 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-serif italic">Admin Console</h1>
          </div>
          <div className="flex items-center gap-4">
            {uploadError && (
              <p className="text-red-400 text-xs font-bold animate-pulse bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                {uploadError}
              </p>
            )}
            <button 
              onClick={saveConfig}
              className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {localModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setEditingMode(mode)}
              className={`p-6 rounded-2xl border-2 transition-all text-left space-y-2 ${
                editingMode?.id === mode.id 
                  ? 'border-romantic-pink bg-romantic-pink/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <span className="text-3xl">{mode.icon}</span>
              <h3 className="font-bold uppercase tracking-widest text-sm">{mode.name}</h3>
              <p className="text-xs text-gray-500">{mode.tasks.length} Tasks</p>
            </button>
          ))}
        </div>

        {editingMode && (
          <motion.div 
            key={editingMode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <span className="text-4xl">{editingMode.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{editingMode.name} Mode Tasks</h2>
                <p className="text-gray-400 text-sm">Edit task names and upload custom visuals.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {localModes.find(m => m.id === editingMode.id)?.tasks.map((task, idx) => (
                <div key={task.id} className="glass-panel p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="flex-1 space-y-4 w-full">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Task Text</label>
                      <input 
                        type="text"
                        value={task.text}
                        onChange={(e) => handleTaskChange(editingMode.id, task.id, 'text', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-romantic-pink transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Emoji Visual (Optional)</label>
                      <input 
                        type="text"
                        value={task.visual || ''}
                        onChange={(e) => handleTaskChange(editingMode.id, task.id, 'visual', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-romantic-pink transition-colors"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-48 space-y-4">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block">Custom Image</label>
                    <div className="relative aspect-square rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden group">
                      {task.image ? (
                        <>
                          <img src={task.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                              <Upload className="w-6 h-6" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(editingMode.id, task.id, e.target.files[0])}
                              />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
                          <Upload className="w-8 h-8" />
                          <span className="text-[10px] font-bold">Upload Image</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(editingMode.id, task.id, e.target.files[0])}
                          />
                        </label>
                      )}
                    </div>
                    {task.image && (
                      <button 
                        onClick={() => handleTaskChange(editingMode.id, task.id, 'image', '')}
                        className="w-full py-2 text-[10px] uppercase font-bold text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [modes, setModes] = useState<ModeConfig[]>(MODES);
  const [currentMode, setCurrentMode] = useState<ModeConfig>(MODES[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultTask, setResultTask] = useState<Task | null>(null);
  const [unlockedModes, setUnlockedModes] = useState<Set<Mode>>(new Set([Mode.FLIRTY, Mode.HOT]));
  const [isMuted, setIsMuted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Tooltip State
  const [hoveredTask, setHoveredTask] = useState<Task | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // (long-distance feature removed, app is now purely local)
  const [remoteRotation, setRemoteRotation] = useState<number | undefined>(undefined);

  const handleModeChange = (mode: ModeConfig) => {
    if (isSpinning) return;
    
    // requiresConsent removed from modes; directly set mode.
    
    setCurrentMode(mode);
  };

  const handleConfigUpdate = (newConfig: ModeConfig[]) => {
    // No realtime backend in this deployment; apply locally.
    setModes(newConfig);
  };



  const handleSpinStart = (rotation: number) => {
    // No-op for static deployment (no realtime sync).
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUnlock = (modeId: Mode) => {
    setUnlockedModes(prev => new Set(prev).add(modeId));
  };

  if (!isAgeVerified) {
    return <AgeVerification onVerify={() => setIsAgeVerified(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif italic tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">SpinPlay</h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <div className={`w-2 h-2 rounded-full ${isPaired ? 'bg-indigo-500 glow-indigo' : 'bg-green-500'} animate-pulse`} />
            {isPaired ? 'Paired Session Active' : 'Private Session Active'}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-romantic-pink" />}
          </button>
          <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </header>

        <>
          {/* Mode Selector */}
          <div className="mb-12 overflow-x-auto no-scrollbar flex gap-4 pb-4">
            {modes.map((mode) => {
              const isActive = currentMode.id === mode.id;
              const isLocked = mode.isPremium && !unlockedModes.has(mode.id);
              
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    if (isLocked) {
                      handleUnlock(mode.id);
                    } else {
                      handleModeChange(mode);
                    }
                  }}
                  className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 min-w-[100px] relative group ${
                    isActive 
                      ? `bg-gradient-to-br ${mode.color} shadow-[0_0_20px_rgba(255,45,85,0.4)] scale-105` 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-2xl blur-[2px] opacity-50" />
                  )}
                  <span className="text-2xl relative z-10 group-hover:scale-110 transition-transform">{mode.icon}</span>
                  <div className="text-center relative z-10">
                    <p className={`text-xs font-bold uppercase tracking-tighter ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {mode.name}
                    </p>
                    {isLocked && <Lock className="w-3 h-3 mx-auto mt-1 text-amber-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Wheel Area */}
          <main className="flex-1 flex flex-col items-center justify-center relative">
            <div className="mb-12 text-center relative">
              <div className="absolute -inset-4 bg-romantic-pink/20 blur-2xl rounded-full animate-pulse" />
              <h2 className="text-sm uppercase tracking-[0.5em] text-romantic-pink font-bold mb-2">Spin the Wheel</h2>
              <h3 className="text-5xl font-serif italic text-white drop-shadow-[0_0_10px_rgba(255,45,85,0.5)]">
                {currentMode.name}
              </h3>
            </div>

            <div className="relative">
              <Wheel 
                tasks={currentMode.tasks} 
                color={currentMode.color}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                onResult={(task) => setResultTask(task)}
                onSpinStart={handleSpinStart}
                remoteRotation={remoteRotation}
                isMuted={isMuted}
                onHoverTask={setHoveredTask}
              />
              
              {/* Subtle Glow Background */}
              <div className={`absolute inset-0 -z-10 blur-[100px] opacity-20 bg-gradient-to-br ${currentMode.color}`} />
            </div>

            <div className="mt-12 text-center">
              <p className="text-xs text-gray-500 italic max-w-[250px]">
                "The journey to intimacy is a shared path. Enjoy every moment together."
              </p>
            </div>
          </main>
        </>
      )}

      {/* Footer / Exit */}
      <footer className="mt-auto pt-8 flex flex-col items-center gap-6">
        <button 
          onClick={() => window.location.reload()}
          className="px-12 py-3 bg-indigo-900/50 border-2 border-indigo-500 rounded-lg text-indigo-200 font-bold tracking-widest hover:bg-indigo-800 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]"
        >
          BACK
        </button>
        
        <div className="flex items-center gap-2 text-gray-600 text-[10px] uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          End-to-End Encrypted Session
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLogin 
            onLogin={() => {
              setIsAdmin(true);
              setShowAdminLogin(false);
            }}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
        {isAdmin && (
          <AdminPanel 
            modes={modes} 
            onUpdate={handleConfigUpdate} 
            onClose={() => setIsAdmin(false)} 
          />
        )}
        
        {resultTask && (
          <TaskResultModal 
            task={resultTask} 
            onClose={() => setResultTask(null)} 
          />
        )}
      </AnimatePresence>

      {/* Global Tooltip */}
      <AnimatePresence>
        {hoveredTask && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[9999] pointer-events-none"
            style={{ 
              left: mousePos.x + 20, 
              top: mousePos.y + 20 
            }}
          >
            <div className="bg-romantic-purple/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/20 glow-purple flex items-center gap-3">
              {hoveredTask.image ? (
                <img 
                  src={hoveredTask.image} 
                  alt={hoveredTask.text} 
                  className="w-10 h-10 object-contain bg-white/10 rounded-lg p-1"
                  referrerPolicy="no-referrer"
                />
              ) : hoveredTask.visual && (
                <span className="text-2xl bg-white/10 rounded-lg p-1">{hoveredTask.visual}</span>
              )}
              <p className="text-sm font-semibold text-white whitespace-nowrap">
                {hoveredTask.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
