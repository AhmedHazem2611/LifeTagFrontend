import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/choose-template');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">

      <div className="w-full max-w-[400px] flex flex-col items-center">

        {/* Layout Top: Logo -> Progress Bar */}
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="LifeTag Logo" className="w-28 h-28 object-contain drop-shadow-sm" />
        </div>

        {/* Progress Bar (from lifeline-tag-aid reference) */}
        <div className="flex gap-2 w-full max-w-xs mx-auto mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              {i <= 0 && (
                <div
                  className="h-full rounded-full animate-[pulse_1s_ease-in-out_1]"
                  style={{
                    background: 'linear-gradient(333deg, hsl(216 100% 43%) 0%, hsl(196 93% 76%) 100%)',
                    width: '100%'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Clay Card Content */}
        <div className="clay-card relative w-full">

          {/* Tab Switcher */}
          <div className="flex w-full bg-[#f1f5f9] rounded-xl p-[4px] mb-8">
            <div className="flex-1 bg-white text-center py-2 rounded-lg text-[13px] font-semibold shadow-sm text-slate-800 transition-all cursor-default">
              Sign Up
            </div>
            <Link to="/signin" className="flex-1 text-center py-2 rounded-lg text-[13px] font-semibold text-slate-400 hover:text-slate-600 transition-all">
              Sign In
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="w-full flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                className="auth-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                required
                className="auth-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-2">
              <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="auth-input tracking-widest"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-[11px] font-medium px-4 py-2 rounded-lg -mt-3 border border-red-100 text-center w-full animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="clay-button w-full mt-2"
            >
              {isLoading ? 'Creating...' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
