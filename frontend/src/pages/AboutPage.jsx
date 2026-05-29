import React from 'react';
import { Shield, Lock, Search, Zap, Code, AlertTriangle, User, GitBranch, Terminal, Globe, UserCheck, ShieldCheck, Activity } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 space-y-32 h-full">
            <div className="flex flex-col md:flex-row items-center gap-24">
                <div className="md:w-1/2 space-y-8">
                     <div className="flex items-center gap-3">
                         <div className="w-12 h-1 bg-accent-cyan"></div>
                         <span className="font-outfit font-bold uppercase tracking-widest text-[#00d2ff]">About KeySentry</span>
                     </div>
                     <h2 className="text-5xl md:text-7xl font-extrabold font-outfit uppercase tracking-tighter leading-none">A Modern Security Standard.</h2>
                     <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                        KeySentry was built to solve the invisible risk in modern frontend development: the accidental leakage of sensitive credentials in client-side JS bundles. As developers adopt AI-generated code and complex build systems, the risk of misconfiguration grows exponential.
                     </p>
                </div>
                <div className="md:w-1/2 relative">
                     <div className="absolute inset-0 bg-accent-blue/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
                     <div className="bg-card border border-white/5 p-12 rounded-[3.5rem] relative transform hover:-rotate-3 transition-transform duration-700">
                          <div className="grid grid-cols-2 gap-8">
                               <div className="bg-white/5 p-6 rounded-3xl flex flex-col gap-3">
                                   <GitBranch className="w-8 h-8 text-accent-cyan" />
                                   <span className="font-bold text-white uppercase text-xs tracking-widest">Branch Audit</span>
                               </div>
                               <div className="bg-white/5 p-6 rounded-3xl flex flex-col gap-3">
                                   <Terminal className="w-8 h-8 text-accent-blue" />
                                   <span className="font-bold text-white uppercase text-xs tracking-widest">CLI Scan</span>
                               </div>
                               <div className="bg-white/5 p-6 rounded-3xl flex flex-col gap-3">
                                   <Globe className="w-8 h-8 text-green-500" />
                                   <span className="font-bold text-white uppercase text-xs tracking-widest">Global Discovery</span>
                               </div>
                               <div className="bg-white/5 p-6 rounded-3xl flex flex-col gap-3">
                                   <ShieldCheck className="w-8 h-8 text-red-500" />
                                   <span className="font-bold text-white uppercase text-xs tracking-widest">SOC Analysis</span>
                               </div>
                          </div>
                          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
                                <span className="font-outfit font-bold opacity-30 tracking-tight">V1.0 ENGINE</span>
                                <div className="flex gap-2">
                                     <div className="w-4 h-4 rounded-md bg-white/5"></div>
                                     <div className="w-4 h-4 rounded-md bg-white/10"></div>
                                     <div className="w-4 h-4 rounded-md bg-white/20"></div>
                                </div>
                          </div>
                     </div>
                </div>
            </div>

            <div className="space-y-12">
                 <div className="text-center space-y-4">
                     <h3 className="text-4xl font-bold font-outfit uppercase">The Detection Engine</h3>
                     <p className="text-slate-500 max-w-xl mx-auto">KeySentry leverages multiple layers of analysis to pinpoint risks without excessive noise.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Regex Heuristics", icon: Search, desc: "Thousands of battle-tested patterns for SaaS, Cloud, and Fintech providers." },
                        { title: "Contextual Scoring", icon: Activity, desc: "We analyze surrounding variable names and comments to distinguish public from private keys." },
                        { title: "AI Smells", icon: Code, desc: "Detects insecure boilerplate and LLM-generated templates that lead to data loss." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 p-12 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 hover:bg-white/[0.08] transition-all">
                             <div className="p-4 bg-accent-blue/10 rounded-2xl w-fit">
                                 <item.icon className="w-10 h-10 text-accent-cyan" />
                             </div>
                             <h4 className="text-2xl font-bold font-outfit">{item.title}</h4>
                             <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="space-y-12 pb-24">
                <div className="text-center space-y-4">
                    <h3 className="text-4xl font-bold font-outfit uppercase">Ethical Usage Policy</h3>
                </div>
                <div className="max-w-4xl mx-auto bg-card border border-white/5 p-16 rounded-[3.5rem] relative overflow-hidden text-center flex flex-col items-center gap-8">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
                     <div className="bg-red-500/10 p-5 rounded-full border border-red-500/20">
                         <AlertTriangle className="w-12 h-12 text-red-500" />
                     </div>
                     <p className="text-slate-400 leading-relaxed text-lg">
                        This tool is provided for educational and authorized professional security testing only. Scanning websites without explicit permission from the owner may violate local laws or terms of service. KeySentry does not take responsibility for any unauthorized or malicious use of this technology.
                     </p>
                     <div className="flex gap-4">
                         <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3 rounded-xl font-bold text-sm transition-all grayscale opacity-50">Legal Documentation</button>
                         <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3 rounded-xl font-bold text-sm transition-all grayscale opacity-50">Bug Bounty Policy</button>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
