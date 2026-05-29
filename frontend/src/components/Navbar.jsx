import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Clock, Info } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Scan', path: '/scan', icon: <Activity className="w-5 h-5" /> },
    { name: 'History', path: '/history', icon: <Clock className="w-5 h-5" /> },
    { name: 'About', path: '/about', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-accent-blue/10 p-2 rounded-lg border border-accent-blue/20 group-hover:scale-110 transition-transform">
          <Shield className="w-6 h-6 text-accent-cyan" />
        </div>
        <span className="font-outfit text-xl font-bold tracking-tight bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
          KeySentry
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 transition-all hover:text-accent-cyan ${
              location.pathname === link.path ? 'text-accent-cyan font-semibold' : 'text-slate-400'
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </div>

      <Link 
        to="/scan" 
        className="bg-accent-blue hover:bg-accent-blue/80 text-white px-5 py-2 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(58,123,213,0.3)] hover:shadow-none"
      >
        New Scan
      </Link>
    </nav>
  );
};

export default Navbar;
