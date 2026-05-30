import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Shield, AlertTriangle, CheckCircle, Info, ArrowLeft, Clock, Globe, FileText, Download, UserCheck, ChevronDown, ChevronUp, ExternalLink, Code, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { format } from 'date-fns';

const SeverityBadge = ({ severity }) => {
    const colors = {
        Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
        High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        Low: 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[severity]}`}>{severity}</span>;
};

const FindingsCard = ({ finding }) => {
     const [isOpen, setIsOpen] = useState(false);
     return (
         <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
             <div 
                className="p-6 flex items-center justify-between cursor-pointer group"
                onClick={() => setIsOpen(!isOpen)}
             >
                 <div className="flex items-center gap-6">
                     <div className={`p-4 rounded-xl ${finding.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-accent-blue/10 text-accent-cyan'} border border-white/5`}>
                         {finding.severity === 'Critical' || finding.severity === 'High' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                     </div>
                     <div className="space-y-1">
                         <div className="flex items-center gap-3">
                             <h4 className="font-outfit font-bold text-lg text-white group-hover:text-accent-cyan transition-colors">{finding.title}</h4>
                             <SeverityBadge severity={finding.severity} />
                         </div>
                         <p className="text-slate-400 text-sm italic font-mono">{finding.masked_value}</p>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 text-slate-500">
                     <span className="text-xs uppercase font-bold tracking-widest bg-white/5 px-3 py-1 rounded-full">{finding.category}</span>
                     {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                 </div>
             </div>
             {isOpen && (
                 <div className="px-6 pb-6 pt-2 space-y-6 border-t border-white/5 bg-black/20 animate-fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                             <div>
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Explanation</label>
                                 <p className="text-slate-300 text-sm leading-relaxed">{finding.explanation}</p>
                             </div>
                             <div>
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Source File</label>
                                 <div className="flex items-center gap-2 group">
                                     <Code className="w-4 h-4 text-accent-cyan" />
                                     <span className="text-xs font-mono text-slate-400 truncate max-w-[200px]">{finding.source_file}</span>
                                     <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-accent-cyan transition-colors" />
                                 </div>
                             </div>
                         </div>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Remediation Suggestion</label>
                                 <div className="bg-accent-blue/5 border border-accent-blue/10 p-4 rounded-xl text-accent-cyan text-sm flex items-start gap-3">
                                      <CheckCircle className="w-4 h-4 mt-0.5" />
                                      {finding.remediation}
                                 </div>
                             </div>
                         </div>
                     </div>
                     <div>
                         <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Evidence Snippet</label>
                         <pre className="bg-black/60 p-4 rounded-xl border border-white/5 text-xs font-mono text-slate-400 overflow-x-auto custom-scrollbar whitespace-pre-wrap">
                             <code>{finding.evidence}</code>
                         </pre>
                     </div>
                 </div>
             )}
         </div>
     );
};

const ResultsPage = () => {
    const { id } = useParams();
    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`https://keysentry-2.onrender.com/scan/${id}`);
                if (!response.data || response.data.error) {
                    throw new Error(response.data?.error || "Failed to load scan results.");
                }
                setScan(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching results:", err);
                setError(err.message || "An unexpected error occurred.");
                setLoading(false);
            }
        };
        if (id) fetchResults();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <div className="w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
                <p className="font-outfit font-bold text-accent-cyan tracking-widest uppercase">LOADING REPORT...</p>
            </div>
        );
    }

    if (error || !scan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-center px-6">
                <div className="bg-critical/10 p-6 rounded-full border border-critical/20">
                    <AlertTriangle className="w-16 h-16 text-critical" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold font-outfit">Report Not Found</h2>
                    <p className="text-slate-400 max-w-md mx-auto">{error || "The scan report you are looking for does not exist or could not be loaded."}</p>
                </div>
                <Link to="/scan" className="bg-accent-blue hover:bg-accent-blue/80 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Start New Scan
                </Link>
            </div>
        );
    }

    const findings = scan.findings || [];
    const filteredFindings = activeTab === 'All' 
        ? findings 
        : findings.filter(f => f.category === activeTab || f.severity === activeTab);

    const severityData = [
        { name: 'Critical', value: findings.filter(f => f.severity === 'Critical').length, color: '#ff3d57' },
        { name: 'High', value: findings.filter(f => f.severity === 'High').length, color: '#ff8c42' },
        { name: 'Medium', value: findings.filter(f => f.severity === 'Medium').length, color: '#f9c846' },
        { name: 'Low', value: findings.filter(f => f.severity === 'Low').length, color: '#27ae60' },
    ].filter(d => d.value > 0);

    const score = scan.score ?? 100;
    const scoreColors = score >= 90 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';
    const scoreText = score >= 90 ? 'Safe' : score >= 75 ? 'Needs Review' : score >= 50 ? 'Risky' : 'CRITICAL';

    const safeFormatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "Unknown Date";
            return format(date, 'PPP');
        } catch (e) {
            return "Unknown Date";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                    <Link to="/scan" className="text-slate-500 hover:text-accent-cyan flex items-center gap-2 text-sm font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col gap-1">
                        <h2 className="text-4xl font-extrabold font-outfit uppercase tracking-tight">Scan Report</h2>
                        <div className="flex items-center gap-3 text-slate-500">
                             <Globe className="w-4 h-4" /> 
                             <span className="font-mono text-sm">{scan.url}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <button className="bg-white/5 border border-white/10 hover:bg-white/10 p-4 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all group">
                         <Download className="w-4 h-4 text-accent-cyan group-hover:scale-110" /> Export PDF
                     </button>
                     <button className="bg-accent-blue hover:bg-accent-blue/80 p-4 px-6 rounded-2xl flex items-center gap-2 font-bold text-sm transition-all shadow-lg">
                         <UserCheck className="w-4 h-4" /> Rescan Target
                     </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
                     {/* Circular Score */}
                     <div className="w-32 h-32 rounded-full border-4 border-white/5 flex flex-col items-center justify-center relative">
                         <div className={`text-4xl font-bold font-outfit ${scoreColors}`}>{scan.score}</div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Health Score</div>
                         {/* Visual Arc (fake for demo) */}
                         <svg className="absolute inset-0 -rotate-90">
                             <circle cx="64" cy="64" r="62" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                className={`${scoreColors} opacity-20`} strokeDasharray="390" strokeDashoffset={390 - (390 * scan.score / 100)} />
                         </svg>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold ${scoreColors}`}>
                         Status: {scoreText}
                     </span>
                </div>

                <div className="md:col-span-2 glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8">
                    <div className="h-48 w-full md:w-1/2">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={severityData} 
                                    innerRadius={50} 
                                    outerRadius={70} 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#121214', border: '1px solid #ffffff1a', color: '#fff' }} />
                                <Legend verticalAlign="bottom" align="center" />
                            </PieChart>
                         </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h4 className="font-outfit font-bold uppercase tracking-widest text-xs text-slate-500">Summary Metrics</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="block text-2xl font-bold text-white">{scan.total_findings}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Total Findings</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <span className="block text-2xl font-bold text-red-500">{scan.high_critical_count}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Critical / High</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <Clock className="w-3 h-3" /> Scanned {safeFormatDate(scan.started_at)}
                        </div>
                    </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                    <h4 className="font-outfit font-bold uppercase tracking-widest text-xs text-slate-500">Engine Information</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Assets Analyzed</span>
                            <span className="text-white font-bold">14 Files</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Scanner Mode</span>
                            <span className="bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">DEEP SCAN</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">AI Detector</span>
                            <span className="text-green-500 font-bold">Enabled</span>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                             <div className="flex gap-2 items-center text-xs text-slate-400">
                                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                 Protection Active
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Findings List */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-10">
                        <h3 className="text-2xl font-bold font-outfit uppercase">Detected Findings</h3>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {['All', 'Secret Leak', 'AI Code Smell', 'Info Leak / Hygiene', 'Critical'].map((tab) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                        activeTab === tab ? 'bg-accent-blue text-white' : 'bg-white/5 text-slate-500 hover:text-white'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full md:w-64">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                         <input 
                            type="text" 
                            placeholder="Filter findings..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-cyan transition-all"
                         />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredFindings.length > 0 ? (
                        filteredFindings.map((finding) => (
                            <FindingsCard key={finding.id} finding={finding} />
                        ))
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center opacity-30 gap-4">
                            <Shield className="w-20 h-20" />
                            <p className="text-xl font-bold">No findings matches your filter.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Remediation Summary */}
            <div className="bg-gradient-to-br from-accent-blue/10 to-transparent border border-white/5 p-12 rounded-[3rem] space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-blue/20 rounded-xl">
                        <Shield className="w-8 h-8 text-accent-cyan" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold font-outfit">Priority Recommendations</h3>
                        <p className="text-slate-400">Implement these fixes to improve your security score.</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                        <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-lg flex items-center justify-center font-bold">1</div>
                        <h4 className="font-bold text-lg">Rotate Sensitive Secrets</h4>
                        <p className="text-slate-500 text-sm">Any keys flagged as 'Critical' or 'High' should be rotated immediately. Once exposed in frontend JS, they must be considered compromised.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                        <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center font-bold">2</div>
                        <h4 className="font-bold text-lg">Use Backend Proxying</h4>
                        <p className="text-slate-500 text-sm">Move API calls involving credentials to a backend service. Use your own server to forward requests with hidden headers.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                        <div className="w-10 h-10 bg-accent-cyan/10 text-accent-cyan rounded-lg flex items-center justify-center font-bold">3</div>
                        <h4 className="font-bold text-lg">Disable Source Maps</h4>
                        <p className="text-slate-400 text-sm italic">config/webpack.prod.js: devtool: false</p>
                        <p className="text-slate-500 text-sm">Disable sourcemaps in production to prevent easy source code reverse engineering and secret discovery.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                        <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center font-bold">4</div>
                        <h4 className="font-bold text-lg">Domain-Restrict Public Keys</h4>
                        <p className="text-slate-500 text-sm">For intended public keys (like Google Maps), ensured they are restricted by HTTP Referrer or IP whitelist in the provider dashboard.</p>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default ResultsPage;
