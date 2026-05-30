import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Clock, Globe, Shield, Activity, ArrowRight, BarChart2, Filter, Info, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const response = await axios.get('https://keysentry-2.onrender.com/scans');
                setScans(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchScans();
    }, []);

    const filteredScans = scans.filter(scan => 
        scan.url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-2">
                     <h2 className="text-4xl md:text-5xl font-extrabold font-outfit uppercase tracking-tight">Scan History</h2>
                     <p className="text-slate-400 font-medium">Review your previous audits and security progress.</p>
                 </div>
                 
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <input 
                            type="text" 
                            placeholder="Find scan by URL..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                    </div>
                    <button className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all text-slate-400">
                        <Filter className="w-5 h-5" />
                    </button>
                 </div>
            </div>

            {loading ? (
                <div className="py-32 flex flex-col items-center justify-center gap-4 opacity-50">
                    <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-outfit font-bold tracking-widest text-xs">COLLECTING HISTORY...</span>
                </div>
            ) : (
                <div className="bg-card border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                     <div className="overflow-x-auto custom-scrollbar">
                         <table className="w-full border-collapse text-left">
                             <thead>
                                 <tr className="border-b border-white/5 bg-white/5">
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Scan Target</th>
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Score</th>
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Findings</th>
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Detected Issues</th>
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
                                     <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {filteredScans.length > 0 ? (
                                     filteredScans.map((scan) => (
                                         <tr key={scan.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                             <td className="p-6">
                                                 <div className="flex items-center gap-3">
                                                     <div className="bg-accent-blue/10 p-2.5 rounded-lg border border-accent-blue/20">
                                                        <Globe className="w-4 h-4 text-accent-cyan" />
                                                     </div>
                                                     <div className="flex flex-col">
                                                         <span className="font-bold text-white text-sm truncate max-w-[200px]">{scan.url}</span>
                                                         <span className="text-[10px] font-bold font-mono text-slate-500 truncate max-w-[150px]">{scan.id}</span>
                                                     </div>
                                                 </div>
                                             </td>
                                             <td className="p-6 text-center">
                                                 <div className={`text-lg font-bold font-outfit ${scan.score >= 90 ? 'text-green-500' : scan.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                     {scan.score}
                                                 </div>
                                             </td>
                                             <td className="p-6">
                                                 <div className="flex flex-col">
                                                     <span className="text-white font-bold text-sm">{scan.total_findings} total</span>
                                                     <span className="text-xs text-red-500 font-bold">{scan.high_critical_count} risky</span>
                                                 </div>
                                             </td>
                                             <td className="p-6">
                                                 <div className="flex gap-1">
                                                      {Array.from({ length: Math.min(scan.high_critical_count, 5) }).map((_, i) => (
                                                          <div key={i} className="w-2 h-6 bg-red-500/30 rounded-full"></div>
                                                      ))}
                                                      {Array.from({ length: Math.max(0, 5 - scan.high_critical_count) }).map((_, i) => (
                                                          <div key={i} className="w-2 h-6 bg-slate-800 rounded-full"></div>
                                                      ))}
                                                 </div>
                                             </td>
                                             <td className="p-6">
                                                 <div className="flex flex-col">
                                                     <span className="text-white font-medium text-sm">{format(new Date(scan.started_at), 'MMM d, yyyy')}</span>
                                                     <span className="text-xs text-slate-500">{format(new Date(scan.started_at), 'hh:mm a')}</span>
                                                 </div>
                                             </td>
                                             <td className="p-6">
                                                 <div className="flex items-center gap-2">
                                                     <Link 
                                                        to={`/results/${scan.id}`} 
                                                        className="bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-cyan py-1.5 px-4 rounded-lg text-xs font-bold transition-all border border-accent-blue/10 group-hover:border-accent-blue/30"
                                                     >
                                                         View Report
                                                     </Link>
                                                     <button className="text-slate-600 hover:text-red-500 transition-colors p-1.5">
                                                         <Trash2 className="w-4 h-4" />
                                                     </button>
                                                 </div>
                                             </td>
                                         </tr>
                                     ))
                                 ) : (
                                     <tr>
                                         <td colSpan="6" className="p-24 text-center text-slate-500 italic opacity-50">
                                            No scan history found. Start your first audit!
                                         </td>
                                     </tr>
                                 )}
                             </tbody>
                         </table>
                     </div>
                </div>
            )}
            
            <AnimatePresence>
                {showStats && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-accent-blue/5 border border-accent-blue/10 rounded-[2.5rem] p-12 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Average Security Score</span>
                                <div className="text-5xl font-extrabold font-outfit text-accent-cyan">
                                    {scans.length > 0 
                                        ? Math.round(scans.reduce((acc, s) => acc + s.score, 0) / scans.length) 
                                        : 0}%
                                </div>
                                <p className="text-xs text-slate-400">Calculated across all historical audits.</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Critical Leaks Found</span>
                                <div className="text-5xl font-extrabold font-outfit text-red-500">
                                    {scans.reduce((acc, s) => acc + s.high_critical_count, 0)}
                                </div>
                                <p className="text-xs text-slate-400">Total high-risk secrets detected.</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Engine Throughput</span>
                                <div className="text-5xl font-extrabold font-outfit text-white">
                                    {scans.reduce((acc, s) => acc + (s.total_findings || 0), 0)}
                                </div>
                                <p className="text-xs text-slate-400">Total patterns checked and analyzed.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-card border border-white/5 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl">
                        <Activity className="w-6 h-6 text-accent-cyan" />
                    </div>
                    <div>
                        <h4 className="font-bold">Automated Security Pipelines</h4>
                        <p className="text-sm text-slate-500">Scan frequency: on-demand. Integrate KeySentry into your CI/CD for persistent monitoring.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowStats(!showStats)}
                    className={`bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all border border-white/10 flex items-center gap-2 whitespace-nowrap group ${showStats ? 'bg-white/10 border-accent-cyan/30' : ''}`}
                >
                    <BarChart2 className="w-4 h-4 text-accent-cyan group-hover:scale-110" /> 
                    {showStats ? 'Hide Statistics' : 'View Statistics'}
                </button>
            </div>
        </div>
    );
};

export default HistoryPage;
