import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { LogIn, UserPlus, Flame, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

/**
 * Auth provides the primary tactical access point for the application.
 * It handles identity verification and new operator registration.
 */
export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Orchestrates the authentication lifecycle.
   */
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError("Security hashes do not match. Verification failed.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        // Instruction to the user
        setError('Verification link dispatched. Please check your terminal (email).');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF4D00]/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#FF9900]/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0F0F0F] rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative z-10"
      >
        <div className="p-8 sm:p-12">
          {/* Brand Header */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF4D00] to-[#FF9900] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,77,0,0.4)] ring-1 ring-white/20">
              <Flame className="text-white w-9 h-9" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">TaskFire</h1>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="w-1 h-1 rounded-full bg-[#FF4D00]"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Executive Stream</span>
              </div>
            </div>
          </div>

          {/* Form Context */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              {isSignUp ? 'Initialize Node' : 'Access Authorization'}
            </h2>
            <p className="text-slate-500 text-xs font-medium italic">
              {isSignUp ? 'Requesting new operational credentials' : 'Verify identity for strategic deployment'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Identity Tag</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent outline-none transition-all placeholder:text-slate-800 font-medium"
                    placeholder="e.g. Director Smith"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Network Identity</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent outline-none transition-all placeholder:text-slate-800 font-medium"
                placeholder="operator@taskfire.io"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Security Hash</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent outline-none transition-all placeholder:text-slate-800 font-medium"
                placeholder="••••••••••••"
              />
            </div>

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 px-1">Hash Verification</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-[#FF4D00] focus:border-transparent outline-none transition-all placeholder:text-slate-800 font-medium"
                    placeholder="••••••••••••"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#FF4D00] to-[#FF9900] text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_rgba(255,77,0,0.3)] disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSignUp ? (
                <>
                   <Zap className="w-4 h-4" />
                   Initialize Authority
                </>
              ) : (
                <>
                   <ShieldCheck className="w-4 h-4" />
                   Establish Secure Link
                </>
              )}
            </button>
          </form>

          {/* Nav Switch */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button
              onClick={() => {
                 setIsSignUp(!isSignUp);
                 setError(null);
              }}
              className="text-[10px] text-[#FF9900] hover:text-white font-black uppercase tracking-[0.3em] transition-all"
            >
              {isSignUp ? 'Return to Access Gate' : "Request New Node Initialization"}
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20 text-[10px] font-black text-white uppercase tracking-[0.5em] pointer-events-none">
        TaskFire Strategic Stream // v1.0.4
      </div>
    </div>
  );
}
