import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Signin failed');
      }
    } catch (err) {
      alert('Network error, please try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 items-center">
      <div className="mt-12 mb-8 flex justify-center">
        <div className="bg-blue-50 p-4 rounded-full shadow-sm">
          <Shield size={40} className="text-blue-500" />
        </div>
      </div>

      <div className="flex w-full bg-gray-100 rounded-full p-1 mb-8">
        <Link to="/signup" className="flex-1 text-center py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-800">
          Sign Up
        </Link>
        <div className="flex-1 bg-white text-center py-2 rounded-full text-sm font-medium shadow-sm text-gray-800">
          Sign In
        </div>
      </div>

      <form onSubmit={handleSignIn} className="w-full flex-1 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            required
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium py-3.5 rounded-2xl shadow-md hover:from-blue-500 hover:to-blue-700 transition-all"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
