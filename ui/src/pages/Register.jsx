import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Loader } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 fade-in">
      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-accent font-extrabold tracking-[0.25em] uppercase font-display">FRENCH CLUB</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold text-platinum uppercase tracking-tight font-display">
            Create Account
          </h2>
          <p className="text-xs text-slate-gray font-semibold uppercase">Join the French Club Collective</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-gray" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-primary border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-xs text-platinum outline-none placeholder-slate-gray focus:border-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-gray" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-primary border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-xs text-platinum outline-none placeholder-slate-gray focus:border-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-gray" />
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full bg-primary border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-xs text-platinum outline-none placeholder-slate-gray focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-gray font-bold uppercase block mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-gray" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-primary border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-xs text-platinum outline-none placeholder-slate-gray focus:border-accent"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-platinum hover:bg-accent text-primary font-bold py-3 rounded-lg text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer font-display"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin text-primary" /> : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-gray border-t border-white/5 pt-4 font-sans">
          Already have an account? <Link to="/login" className="text-accent hover:underline font-bold">Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
