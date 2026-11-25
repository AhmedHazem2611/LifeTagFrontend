import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import logo from '../assets/logo.png';
import PasswordInput from '../components/PasswordInput';
import { extractApiErrorMessage, isValidEmail } from '../utils/formErrors';

export default function StolenBracelet() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tagIdentifier = (searchParams.get('code') || searchParams.get('guid') || '').trim();

  const [showOwnerForm, setShowOwnerForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [recoveredMessage, setRecoveredMessage] = useState('');

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!tagIdentifier) {
      setError('No bracelet code was provided. Please scan the bracelet QR code again.');
      return;
    }

    const nextErrors: Record<string, string> = {};
    if (!email.trim()) {
      nextErrors.email = 'Owner email is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Owner password is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError(Object.values(nextErrors).join(' '));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/tag/recover-stolen-or-missing`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guid: tagIdentifier,
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && data.data) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            id: data.data.id,
            fullName: data.data.fullName,
            email: data.data.email,
            token: data.data.token,
          })
        );

        if (data.data.relinked) {
          navigate('/dashboard', { replace: true });
          return;
        }

        setRecoveredMessage(
          'Bracelet unlocked and returned to normal! Since you already have another active bracelet linked, this bracelet is now available again.'
        );
      } else {
        setError(extractApiErrorMessage(data, 'Could not verify bracelet owner credentials.'));
      }
    } catch {
      setError('Network error while verifying credentials. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[430px] flex flex-col items-center">
        <div className="mb-6 flex justify-center">
          <img src={logo} alt="LifeTag Logo" className="w-24 h-24 object-contain drop-shadow-sm" />
        </div>

        <div className="clay-card relative w-full text-center flex flex-col items-center gap-4">
          {recoveredMessage ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={34} strokeWidth={2.25} />
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider">
                Bracelet Restored
              </span>

              <h1 className="text-[19px] font-extrabold text-slate-900 leading-snug">
                Owner Verified
              </h1>

              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                {recoveredMessage}
              </p>

              <button
                type="button"
                onClick={() => navigate('/dashboard', { replace: true })}
                className="clay-button w-full mt-2"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center shadow-inner">
                <ShieldAlert size={34} strokeWidth={2.25} />
              </div>

              <span className="px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-extrabold uppercase tracking-wider">
                Stolen or Missing
              </span>

              <h1 className="text-[20px] font-extrabold text-slate-900 leading-snug">
                This bracelet is stolen or missing and is not available for use currently
              </h1>

              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                This bracelet has been unlinked from its owner&apos;s profile. If you are the owner and recovered your bracelet, verify your account below to restore it.
              </p>

              {!showOwnerForm ? (
                <div className="w-full flex flex-col gap-3 mt-1">
                  {tagIdentifier && (
                    <button
                      type="button"
                      onClick={() => setShowOwnerForm(true)}
                      className="clay-button w-full gap-2 text-[14px]"
                    >
                      <KeyRound size={17} strokeWidth={2.5} />
                      <span>I&apos;m the Owner — Unlock Bracelet</span>
                    </button>
                  )}

                  <Link to="/" className="clay-button-white w-full text-[14px]">
                    Go to LifeTag Home
                  </Link>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleRecoverSubmit}
                  className="w-full flex flex-col gap-4 text-left mt-2 pt-4 border-t border-slate-100"
                >
                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">
                      Owner Email
                    </label>
                    <input
                      type="email"
                      placeholder="owner@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                      }}
                      className={`auth-input ${fieldErrors.email ? '!border-red-400 bg-red-50/30' : ''}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-700 mb-1.5 ml-1">
                      Owner Password
                    </label>
                    <PasswordInput
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
                      }}
                      className={fieldErrors.password ? '!border-red-400 bg-red-50/30' : ''}
                    />
                    {fieldErrors.password && (
                      <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-[12px] font-semibold px-3.5 py-2.5 rounded-xl border border-red-200 text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2.5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOwnerForm(false);
                        setError('');
                        setFieldErrors({});
                      }}
                      disabled={submitting}
                      className="clay-button-white w-1/3 !px-3 text-[13px]"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="clay-button w-2/3 !px-4 text-[14px]"
                    >
                      {submitting ? 'Verifying...' : 'Verify & Unlock'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
