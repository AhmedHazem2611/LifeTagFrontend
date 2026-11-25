import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, LogOut, Save, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTag, setActiveTag] = useState<{ shortCode?: string; guid?: string; isPinProtected?: boolean } | null>(null);
  const [isLoadingTag, setIsLoadingTag] = useState(true);
  const [confirmStolen, setConfirmStolen] = useState(false);
  const [isReportingStolen, setIsReportingStolen] = useState(false);
  const [stolenSuccessMsg, setStolenSuccessMsg] = useState('');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let userName = 'Unknown User';
    let userEmail = '';
    let userId = 0;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
            if (parsed && parsed.email) userEmail = parsed.email;
            if (parsed && parsed.id) userId = parsed.id;
        }
    } catch(e) {}

    if (userId) {
      const apiBase = import.meta.env.VITE_API_URL.replace(/\/$/, "");
      fetch(`${apiBase}/api/profile?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProfile({ ...data.data, fullName: data.data.fullName || userName, email: userEmail, userId });
          } else {
              setProfile({ fullName: userName, email: userEmail, userId });
          }
        })
        .catch(() => {
            setProfile({ fullName: userName, email: userEmail, userId });
        });

      fetch(`${apiBase}/api/active-tag/${userId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.success && data.data) {
            setActiveTag(data.data);
            setPinEnabled(!!data.data.isPinProtected);
          } else {
            setActiveTag(null);
            setPinEnabled(false);
          }
        })
        .catch(() => {
          setActiveTag(null);
          setPinEnabled(false);
        })
        .finally(() => setIsLoadingTag(false));
    } else {
        setProfile({ fullName: userName, email: userEmail, userId });
        setIsLoadingTag(false);
    }
  }, []);

  const handleUpdateAccount = async () => {
    if (!profile?.userId) return;
    setIsUpdatingAccount(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/user/update?userId=${profile.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: profile.fullName, email: profile.email }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local storage too
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.fullName = profile.fullName;
          parsed.email = profile.email;
          localStorage.setItem('user', JSON.stringify(parsed));
        }
        alert('Account updated successfully!');
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handlePinToggle = async () => {
    if (!profile?.userId || !activeTag || isLoadingTag || isUpdatingPin) return;
    const newPinStatus = !pinEnabled;
    setIsUpdatingPin(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/${profile.userId}/pin-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinProtected: newPinStatus }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        setPinEnabled(newPinStatus);
        setActiveTag(prev => prev ? { ...prev, isPinProtected: newPinStatus } : prev);
      } else {
        alert(data?.message || 'Failed to update PIN settings');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const handleActivateStolenOrMissingMode = async () => {
    if (!profile?.userId || isReportingStolen) return;
    setIsReportingStolen(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/report-stolen-or-missing?userId=${profile.userId}`, {
        method: 'POST',
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        localStorage.removeItem('linkedTag');
        setActiveTag(null);
        setConfirmStolen(false);
        setPinEnabled(false);
        setStolenSuccessMsg('Stolen or missing mode activated. Your bracelet has been unlinked and disabled.');
      } else {
        alert(data?.message || `Failed to activate stolen or missing mode (HTTP ${res.status})`);
      }
    } catch {
      alert('Network error');
    } finally {
      setIsReportingStolen(false);
    }
  };

  const handleLogout = async () => {
    if (!profile?.userId || isLoggingOut) {
        // Fallback logout if no userId
        localStorage.removeItem('user');
        navigate('/signin');
        return;
    }
    
    setIsLoggingOut(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/deactivate?userId=${profile.userId}`, {
        method: 'POST',
      });
      // Even if deactivate fails, we should clear local storage and redirect
      localStorage.removeItem('user');
      navigate('/signin');
    } catch (err) {
      localStorage.removeItem('user');
      navigate('/signin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] font-body min-h-screen relative pb-[12vh]">
      <div className="w-full max-w-[400px] md:max-w-4xl flex flex-col px-6 pt-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-[38px] h-[38px] rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[22px] font-extrabold text-[#1a1c1e] tracking-tight">Settings</h1>
        </div>

        <div className="flex flex-col gap-5">
          
          {/* Account */}
          <div className="clay-section p-6 flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px]">
                    <User size={18} className="text-[#0062ff]" strokeWidth={2.5} /> Account
                </div>
                <button 
                    onClick={handleUpdateAccount}
                    disabled={isUpdatingAccount}
                    className="flex items-center gap-1.5 bg-[#0062ff] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm hover:bg-[#0056e0] transition-colors disabled:opacity-50"
                >
                    <Save size={14} /> {isUpdatingAccount ? 'Saving...' : 'Save'}
                </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-[12px] font-bold text-[#64748b] ml-1">Name</label>
              <input 
                type="text" 
                value={profile?.fullName || ""} 
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="auth-input bg-white w-full rounded-xl px-4 py-3 text-[14px] text-slate-800 font-semibold" 
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="block text-[12px] font-bold text-[#64748b] ml-1">Email</label>
              <input 
                type="email" 
                value={profile?.email || ""} 
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="auth-input bg-white w-full rounded-xl px-4 py-3 text-[14px] text-slate-800 font-semibold" 
                placeholder="Email Address"
              />
            </div>
          </div>

          {/* Security */}
          <div className="clay-section p-6 flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0062ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
               Security
            </div>
            <div className="flex justify-between items-center text-[14px] text-slate-800 font-bold mt-1">
              <div className="flex flex-col">
                <span>PIN Protection</span>
                {!isLoadingTag && !activeTag && (
                  <span className="text-[11px] font-medium text-slate-400">Link a bracelet to enable or disable PIN protection</span>
                )}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={pinEnabled}
                aria-label="PIN Protection"
                disabled={isLoadingTag || !activeTag || isUpdatingPin}
                onClick={handlePinToggle}
                className={`w-[52px] h-[30px] rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${pinEnabled ? 'bg-[#0062ff]' : 'bg-slate-200'} ${(isLoadingTag || !activeTag || isUpdatingPin) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`bg-white w-[22px] h-[22px] rounded-full shadow-sm transform transition-transform duration-300 ${pinEnabled ? 'translate-x-[22px]' : 'translate-x-[0px]'}`} />
              </button>
            </div>
          </div>

          {/* Stolen or Missing Mode */}
          <div className="clay-section p-6 flex flex-col gap-3 w-full border border-red-100/80">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px]">
                <ShieldAlert size={18} className="text-red-500" strokeWidth={2.5} /> Stolen or Missing Mode
              </div>
              {activeTag?.shortCode && (
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                  {activeTag.shortCode}
                </span>
              )}
            </div>

            <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
              Immediately unlinks your connected bracelet and displays a stolen or missing notice when scanned. Only the owner (via account login on scan) or an administrator can re-enable it.
            </p>

            {stolenSuccessMsg && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[12px] font-semibold px-3.5 py-2.5 rounded-xl">
                {stolenSuccessMsg}
              </div>
            )}

            {activeTag ? (
              !confirmStolen ? (
                <button
                  type="button"
                  onClick={() => setConfirmStolen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldAlert size={17} strokeWidth={2.5} /> Activate Stolen or Missing Mode
                </button>
              ) : (
                <div className="flex flex-col gap-2.5 bg-red-50/70 border border-red-200 rounded-xl p-3.5">
                  <p className="text-[12px] font-bold text-red-700">
                    Confirm: unlink bracelet {activeTag.shortCode || ''} and lock it as stolen or missing?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmStolen(false)}
                      disabled={isReportingStolen}
                      className="flex-1 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[13px] hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleActivateStolenOrMissingMode}
                      disabled={isReportingStolen}
                      className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] transition-colors disabled:opacity-50"
                    >
                      {isReportingStolen ? 'Locking...' : 'Confirm Lock'}
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="text-[12px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-center">
                No active bracelet currently linked to this profile
              </div>
            )}
          </div>

        </div>

      </div>

      <div className="w-full flex justify-center fixed bottom-8 px-6 max-w-[400px]">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full bg-gradient-to-r from-[#ff4d4d] to-[#e61919] text-white font-bold py-4 rounded-[16px] shadow-[0px_16px_32px_-8px_rgba(255,77,77,0.5),inset_0px_2px_4px_rgba(255,255,255,0.3)] border border-[#ff6b6b] flex items-center justify-center gap-2 text-[16px] hover:-translate-y-1 transition-transform disabled:opacity-50"
        >
          <LogOut size={18} strokeWidth={2.5} /> {isLoggingOut ? 'Logging Out...' : 'Log Out'}
        </button>
      </div>
    </div>
  );
}
