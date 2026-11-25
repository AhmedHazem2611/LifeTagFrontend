import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import PasswordInput from '../components/PasswordInput';
import { extractApiErrorMessage, isValidEmail } from '../utils/formErrors';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editTagGuid = searchParams.get('editTagGuid');
  const hasPendingTag = Boolean(sessionStorage.getItem('pendingTagGuid'));
  const [verifiedUser, setVerifiedUser] = useState<{ id: number; fullName?: string; email?: string } | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editTagGuid || hasPendingTag) return;

    let parsed: any = null;
    try {
      const raw = localStorage.getItem('user');
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }
    if (!parsed?.id) return;

    let cancelled = false;
    fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/profile?userId=${parsed.id}`)
      .then(async (res) => {
        if (res.status === 404) {
          localStorage.removeItem('user');
          localStorage.removeItem('linkedTag');
          return;
        }
        const data = await res.json().catch(() => null);
        if (!cancelled && res.ok && data?.success && data.data) {
          setVerifiedUser({
            id: parsed.id,
            fullName: data.data.fullName || parsed.fullName,
            email: parsed.email,
          });
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [editTagGuid, hasPendingTag]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const nextErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError(Object.values(nextErrors).join(' '));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Backend returns user in data.data
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Handle Tag Linking
        const pendingGuid = sessionStorage.getItem('pendingTagGuid');
        const pendingPin = sessionStorage.getItem('pendingTagPin');
        
        if (pendingGuid && pendingPin) {
          await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/link-tag?userId=${data.data.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guid: pendingGuid, pin: pendingPin }),
          });
          sessionStorage.removeItem('pendingTagGuid');
          sessionStorage.removeItem('pendingTagPin');
        }

        if (editTagGuid) {
          // Ownership verification mode
          try {
            const ownerRes = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/${editTagGuid}/owner?userId=${data.data.id}`);
            const ownerData = await ownerRes.json();
            
            if (ownerRes.ok && ownerData.success && ownerData.data === true) {
               // Ownership verified
               navigate('/dashboard');
            } else {
               // Not the owner
               localStorage.removeItem('user');
               setError('Invalid User: You do not own this tag.');
            }
          } catch (e) {
            localStorage.removeItem('user');
            setError('Failed to verify ownership.');
          }
        } else {
          // Normal sign-in
          navigate('/dashboard');
        }
      } else {
        setError(extractApiErrorMessage(data, 'Signin failed'));
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

        {/* Progress Bar (Only shown during bracelet onboarding) */}
        {!editTagGuid && hasPendingTag && (
          <div className="flex gap-2 w-full max-w-xs mx-auto mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
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
        )}

        {/* Title */}
        {editTagGuid ? (
          <h2 className="text-[20px] font-bold text-slate-800 text-center mb-6">Sign in to edit this tag</h2>
        ) : !hasPendingTag ? (
          <h2 className="text-[20px] font-bold text-slate-800 text-center mb-6">Sign in to your Dashboard</h2>
        ) : null}

        {/* Clay Card Content */}
        <div className="clay-card relative w-full">
          {/* Tabs (Shown only during bracelet onboarding) */}
          {!editTagGuid && hasPendingTag && (
            <div className="flex w-full bg-[#f1f5f9] rounded-xl p-[4px] mb-8">
              <Link to="/signup" className="flex-1 text-center py-2 rounded-lg text-[13px] font-semibold text-slate-400 hover:text-slate-600 transition-all">
                Sign Up
              </Link>
              <div className="flex-1 bg-white text-center py-2 rounded-lg text-[13px] font-semibold shadow-sm text-slate-800 transition-all cursor-default">
                Sign In
              </div>
            </div>
          )}

          {!editTagGuid && !hasPendingTag && verifiedUser?.id && (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full mb-5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-100 text-[#005adc] text-[13px] font-semibold transition-colors text-center"
            >
              Continue as {verifiedUser.fullName || verifiedUser.email} →
            </button>
          )}

          {/* Form */}
          <form noValidate onSubmit={handleSignIn} className="w-full flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`auth-input ${fieldErrors.email ? '!border-red-400 bg-red-50/30' : ''}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                }}
              />
              {fieldErrors.email && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">Password</label>
              <PasswordInput
                placeholder="••••••••"
                className={fieldErrors.password ? '!border-red-400 bg-red-50/30' : ''}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
                }}
              />
              {fieldErrors.password && (
                <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">{fieldErrors.password}</p>
              )}
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
