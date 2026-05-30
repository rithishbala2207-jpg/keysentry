import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Globe, Shield, Activity, Lock, Code, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ScanPage = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    const steps = [
        { label: 'Resolving Target URL', icon: Globe },
        { label: 'Fetching HTML & Discovery', icon: Search },
        { label: 'Extracting JS Assets', icon: Code },
        { label: 'Running Secret Detectors', icon: Shield },
        { label: 'Performing AI Risk Scoring', icon: Activity },
        { label: 'Generating Final Report', icon: CheckCircle },
    ];

    useEffect(() => {
        let interval;
        if (isLoading) {
             interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + (100 - prev) * 0.1;
                    const stepIdx = Math.floor((next / 100) * steps.length);
                    setCurrentStep(Math.min(stepIdx, steps.length - 1));
                    return next;
                });
             }, 800);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url) return;

        setIsLoading(true);
        setStatus('scanning');
        setProgress(0);
        setCurrentStep(0);

        try {
            const response = await axios.post('https://keysentry-2.onrender.com/scan?url=' + encodeURIComponent(url));
            const scanId = response.data.id;
            
            // Finish progress
            setProgress(100);
            setCurrentStep(steps.length - 1);
            
            setTimeout(() => {
                navigate(`/results/${scanId}`);
            }, 1000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-24 px-6 relative overflow-hidden">
             {/* Decorative grid */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] -z-10"></div>
             
             <div className="w-full max-w-4xl flex flex-col gap-12">
                 <div className="text-center space-y-4">
                     <h2 className="text-4xl md:text-6xl font-extrabold font-outfit">Launch New Audit</h2>
                     <p className="text-slate-400 text-lg max-w-xl mx-auto">
                         Enter the URL of the public website you wish to scan.
                         KeySentry will perform a deep dive into its client-side components.
                     </p>
                 </div>

                 <div className="glass p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isLoading ? (
                            <motion.form 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleScan} 
                                className="space-y-8"
                            >
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="https://example.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-6 pl-16 pr-6 text-xl text-white focus:outline-none focus:border-accent-cyan transition-all shadow-inner font-inter"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 px-4 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-cyan text-xs font-bold uppercase tracking-widest hidden md:block">
                                        Scan Target
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                     <button 
                                        type="submit" 
                                        className="flex-grow bg-accent-blue hover:bg-accent-blue/80 text-white py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-[0_15px_30px_rgba(58,123,213,0.3)]"
                                     >
                                         <Search className="w-6 h-6" />
                                         Start Detailed Scan
                                     </button>
                                     <div className="md:w-1/4 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                                         <div className="flex gap-1 mb-2">
                                             {[1,2,3].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 3 ? 'bg-accent-cyan' : 'bg-slate-700'}`}></div>)}
                                         </div>
                                         <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Scanning Engine v1.0.0</span>
                                     </div>
                                </div>
                                
                                <div className="pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Lock className="w-4 h-4" /> SSL Verified
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <AlertTriangle className="w-4 h-4" /> Secret Detection
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Code className="w-4 h-4" /> Map Analysis
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Shield className="w-4 h-4" /> AI Risk Scoring
                                    </div>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-12 gap-8"
                            >
                                <div className="relative">
                                     <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-accent-cyan animate-spin"></div>
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <span className="font-outfit font-bold text-lg">{Math.round(progress)}%</span>
                                     </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold font-outfit text-white">Analyzing <span className="text-accent-cyan">"{url}"</span></h3>
                                    <p className="text-slate-500 font-medium">Please wait while our engine performs deep scanning.</p>
                                </div>

                                <div className="w-full max-w-md space-y-6">
                                     {steps.map((step, idx) => {
                                         const isActive = idx === currentStep;
                                         const isDone = idx < currentStep;
                                         const Icon = step.icon;
                                         return (
                                             <div key={idx} className={`flex items-center justify-between transition-all ${isActive ? 'opacity-100 scale-105' : isDone ? 'opacity-60' : 'opacity-20'}`}>
                                                 <div className="flex items-center gap-4">
                                                     <div className={`p-2 rounded-lg ${isActive ? 'bg-accent-cyan text-background' : isDone ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white'}`}>
                                                         {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                                     </div>
                                                     <span className={`font-semibold ${isActive ? 'text-accent-cyan' : 'text-white'}`}>{step.label}</span>
                                                 </div>
                                                 {isActive && <Loader2 className="w-5 h-5 animate-spin text-accent-cyan" />}
                                             </div>
                                         );
                                     })}
                                </div>

                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                                     <motion.div 
                                        className="h-full bg-accent-cyan shadow-[0_0_20px_#00d2ff]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                     />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                 </div>

                 {status === 'error' && (
                     <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-center flex items-center justify-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> 
                          Error connecting to scan service. Please ensure the backend is running.
                     </div>
                 )}
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                     <div className="bg-card/40 border border-white/5 p-8 rounded-2xl space-y-4">
                         <h4 className="font-outfit font-bold text-xl flex items-center gap-2">
                             <Shield className="w-5 h-5 text-accent-cyan" /> Secure Infrastructure
                         </h4>
                         <p className="text-slate-400 text-sm leading-relaxed">
                             Scans are conducted anonymously using our distributed node network. We do not store sensitive data longer than required for report generation. Data is encrypted end-to-end.
                         </p>
                     </div>
                     <div className="bg-card/40 border border-white/5 p-8 rounded-2xl space-y-4">
                         <h4 className="font-outfit font-bold text-xl flex items-center gap-2">
                             <Lock className="w-5 h-5 text-accent-cyan" /> Authorization Note
                         </h4>
                         <p className="text-slate-400 text-sm leading-relaxed">
                             By starting a scan, you confirm that you have authorization to test the target website. This tool is for educational and authorized professional use only.
                         </p>
                     </div>
                 </div>
             </div>
        </div>
    );
};

export default ScanPage;
