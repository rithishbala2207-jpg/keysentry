import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Search, Zap, Code, AlertTriangle, ChevronRight, Activity, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-card border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-all hover:bg-white/5 shadow-lg flex flex-col gap-4">
        <div className={`p-4 rounded-xl bg-${color}/10 w-fit border border-${color}/20`}>
            <Icon className={`w-8 h-8 text-${color}`} />
        </div>
        <h3 className="font-outfit text-xl font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const LandingPage = () => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-accent-blue/10 rounded-full blur-[150px] -z-10 animate-pulse-slow font-inter opacity-60"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-accent-cyan/10 rounded-full blur-[150px] -z-10 animate-pulse-slow font-inter opacity-60 delay-1000"></div>

                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8 }}
                   className="flex flex-col items-center gap-6 max-w-4xl"
                >
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 mb-4 group cursor-default">
                        <span className="bg-accent-cyan w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_#00d2ff]"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00d2ff]/80 font-outfit">AI-Powered Security Detection</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold font-outfit tracking-tight leading-[1.1]">
                        Secure Your Frontend <br />
                        <span className="bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-cyan bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-flow">Before They Leak</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                        KeySentry scans your client-side assets to detect API keys, secrets, tokens, 
                        and insecure AI-generated code smells in real-time.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <Link to="/scan" className="bg-accent-cyan hover:bg-accent-cyan/90 text-background px-8 py-4 rounded-xl font-bold flex items-center gap-2 text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(0,210,255,0.4)] shadow-[#00d2ff]/30">
                            Start Free Scan <ChevronRight className="w-5 h-5" />
                        </Link>
                        <Link to="/scan" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all text-lg">
                            Live Demo
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Preview Mockup */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="mt-24 w-full max-w-6xl relative"
                >
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold uppercase tracking-[0.2em]">
                            Live Dashboard Preview
                        </div>
                    </div>
                    <div className="bg-card border border-white/10 rounded-t-3xl p-4 shadow-2xl relative overflow-hidden group">
                        <div className="border border-white/5 rounded-t-2xl bg-black/40 overflow-hidden">
                             <div className="flex gap-1.5 p-4 border-b border-white/5">
                                 <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                                 <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                             </div>
                             <div className="p-8 h-64 flex flex-col gap-8">
                                  <div className="flex justify-between items-center">
                                      <div className="h-6 w-1/3 bg-white/10 rounded-md"></div>
                                      <div className="h-6 w-24 bg-accent-cyan/20 border border-accent-cyan/30 rounded-full"></div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                      <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-2">
                                          <div className="h-3 w-1/2 bg-white/10 rounded-sm"></div>
                                          <div className="h-8 w-2/3 bg-white/20 rounded-md"></div>
                                      </div>
                                      <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col gap-2">
                                          <div className="h-3 w-1/2 bg-white/10 rounded-sm"></div>
                                          <div className="h-8 w-1/3 bg-white/20 rounded-md"></div>
                                      </div>
                                      <div className="h-24 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-2 relative overflow-hidden">
                                          <div className="absolute top-0 right-0 p-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div></div>
                                          <div className="h-3 w-1/2 bg-white/10 rounded-sm"></div>
                                          <div className="h-8 w-full bg-white/20 rounded-md"></div>
                                      </div>
                                  </div>
                                  <div className="h-20 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-4 gap-4">
                                      <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
                                      <div className="flex-grow space-y-2">
                                          <div className="h-3 w-1/4 bg-white/10 rounded-sm"></div>
                                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                              <div className="w-3/4 h-full bg-accent-cyan/40"></div>
                                          </div>
                                      </div>
                                  </div>
                             </div>
                        </div>
                         {/* Overlay scan demo */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 backdrop-blur-md pointer-events-none">
                             <div className="flex flex-col items-center gap-6">
                                 <div className="relative">
                                     <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-accent-cyan animate-spin"></div>
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <Search className="w-8 h-8 text-accent-cyan animate-pulse" />
                                     </div>
                                 </div>
                                 <div className="flex flex-col items-center gap-2">
                                     <p className="font-outfit font-bold text-accent-cyan tracking-[0.3em] uppercase text-sm">Engine Demo</p>
                                     <p className="text-white/60 text-xs font-medium">Click "Start Free Scan" to run a real audit.</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats/Categories */}
            <section className="w-full bg-card/50 border-y border-white/5 py-16">
                 <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
                     <div className="flex flex-col gap-2 items-center text-center">
                         <h4 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">50+</h4>
                         <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Key Pattern Detectors</p>
                     </div>
                     <div className="flex flex-col gap-2 items-center text-center">
                         <h4 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">AI</h4>
                         <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Risk Scoring Engine</p>
                     </div>
                     <div className="flex flex-col gap-2 items-center text-center">
                         <h4 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">99%</h4>
                         <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Detection Accuracy</p>
                     </div>
                     <div className="flex flex-col gap-2 items-center text-center">
                         <h4 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">Realtime</h4>
                         <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Asset Analysis</p>
                     </div>
                 </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto w-full">
                <div className="text-center mb-24 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-bold font-outfit">Comprehensive Threat Detection</h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A multidimensional scanner that analyzes HTML, JS bundles, source maps, and metadata to find what you missed.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={Lock} 
                        title="Secret Leak Detection" 
                        color="[#00d2ff]"
                        description="Deep regex scanning for AWS keys, Slack tokens, OpenAI credentials, Stripe secrets, and thousands of other patterns." 
                    />
                    <FeatureCard 
                        icon={Code} 
                        title="Insecure Code Smells" 
                        color="[#3a7bd5]"
                        description="Identify patterns commonly found in insecure code, such as hardcoded localhost DB references and direct API calls." 
                    />
                    <FeatureCard 
                        icon={AlertTriangle} 
                        title="Risk Scoring" 
                        color="[#ff3d57]"
                        description="Professional security posture scoring that differentiates between safe public keys and dangerous private secrets." 
                    />
                    <FeatureCard 
                        icon={Globe} 
                        title="Information Disclosure" 
                        color="[#f9c846]"
                        description="Detect leaked internal IP addresses, admin panel routes hidden in JS, and verbose debug logs." 
                    />
                    <FeatureCard 
                        icon={Database} 
                        title="Source Map Analysis" 
                        color="[#27ae60]"
                        description="The scanner automatically checks for exposed .map files to reconstruct original source structures and hidden logic." 
                    />
                    <FeatureCard 
                        icon={Zap} 
                        title="Instant Reports" 
                        color="[#00d2ff]"
                        description="Get detailed PDF-ready reports with remediation steps and severity breakdown immediately after scanning." 
                    />
                </div>
            </section>

            {/* Risk Categories */}
            <section className="w-full py-32 bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-accent-blue/5 rounded-full blur-[150px] -z-0"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-24">
                    <div className="md:w-1/2 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold font-outfit">Understand Your <br /> Risk Surface.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Not all exposed keys are vulnerabilities. KeySentry intelligently classifies findings so you can focus on rotating critical credentials instead of chasing false positives.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Critical Exposure", desc: "Private secrets like AWS/OpenAI keys found in client bundles.", color: "bg-red-500" },
                                { title: "High Risk", desc: "Bearer tokens, JWTs, and unrestricted credentials.", color: "bg-orange-500" },
                                { title: "Medium Exposure", desc: "Leaked internal IPs and info about hidden admin routes.", color: "bg-yellow-500" },
                                { title: "Hygiene Issue", desc: "Console logs and public keys without proper restrictions.", color: "bg-green-500" }
                            ].map((risk, index) => (
                                <div key={index} className="flex gap-4 items-start group">
                                     <div className={`mt-1.5 w-3 h-3 rounded-full ${risk.color} shadow-[0_0_10px_current]`}></div>
                                     <div>
                                         <h4 className="font-bold text-white group-hover:text-accent-cyan transition-colors">{risk.title}</h4>
                                         <p className="text-slate-500 text-sm">{risk.desc}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:w-1/2 bg-black/40 border border-white/5 rounded-3xl p-12 relative">
                         <div className="flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                  <span className="font-outfit font-bold">Severity Distribution</span>
                                  <span className="text-xs text-slate-500">Live Demo Scan</span>
                              </div>
                              <div className="flex h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                                  <div className="w-[15%] h-full bg-red-500"></div>
                                  <div className="w-[25%] h-full bg-orange-500"></div>
                                  <div className="w-[35%] h-full bg-yellow-500"></div>
                                  <div className="w-[25%] h-full bg-green-500"></div>
                              </div>
                              <div className="space-y-4 pt-4">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                         <div className="flex gap-3">
                                             <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/5"></div>
                                             <div className="flex flex-col gap-1">
                                                 <div className="h-4 w-32 bg-white/5 rounded-md"></div>
                                                 <div className="h-3 w-48 bg-white/5 rounded-md"></div>
                                             </div>
                                         </div>
                                         <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                                     </div>
                                 ))}
                              </div>
                         </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 w-full max-w-5xl mx-auto">
                 <div className="bg-gradient-to-br from-accent-blue/20 to-accent-cyan/10 border border-white/10 rounded-[3rem] p-16 flex flex-col items-center text-center gap-8 relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-cyan to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold font-outfit max-w-2xl leading-tight">Ready to Audit your <br/> Frontend Risk?</h2>
                    <p className="text-slate-400 text-lg max-w-xl">
                        Join security professionals identifying thousands of leaks daily. Scan any public URL. 
                    </p>
                    <Link to="/scan" className="bg-white text-background px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-2xl">
                        Get Started Now
                    </Link>
                 </div>
            </section>
        </div>
    );
};

export default LandingPage;
