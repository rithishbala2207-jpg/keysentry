import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full py-12 px-8 md:px-24 border-t border-white/5 bg-background">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-accent-cyan" />
                    <span className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                        KeySentry
                    </span>
                </div>
                <p className="text-slate-400 text-sm md:max-w-md text-center md:text-left">
                    Professional AI-powered security scanner for modern web applications.
                    Detect secrets, tokens, and insecure code smells before attackers do.
                </p>
                <div className="flex gap-6 text-sm font-bold uppercase tracking-wider">
                    <Link to="/about" className="text-slate-400 hover:text-accent-cyan transition-colors">Documentation</Link>
                    <a href="https://github.com/rithishbala/frsafechecker" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-accent-cyan transition-colors">Github</a>
                    <Link to="/about" className="text-slate-400 hover:text-accent-cyan transition-colors">Support</Link>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/5 pt-8 text-slate-500 text-xs gap-4">
                <p>Copyright © 2026 KeySentry Security. All rights reserved.</p>
                <div className="flex gap-4 italic opacity-75">
                    Note: Scan only websites you own or are authorized to test.
                </div>
                <div className="flex gap-4">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
