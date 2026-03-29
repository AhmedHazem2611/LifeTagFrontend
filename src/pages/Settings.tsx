import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Layout, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const [pinEnabled, setPinEnabled] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let userName = 'Unknown User';
    let userEmail = '';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
            if (parsed && parsed.email) userEmail = parsed.email;
        }
    } catch(e) {}

    fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/profile`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setProfile({ ...data.profile, fullName: data.profile.fullName || userName, email: userEmail });
          setPinEnabled(!!data.profile.isPinProtected);
        } else {
            setProfile({ fullName: userName, email: userEmail });
        }
      })
      .catch(() => {
          setProfile({ fullName: userName, email: userEmail });
      });
  }, []);

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
            <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-1">
              <User size={18} className="text-[#0062ff]" strokeWidth={2.5} /> Account
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-[12px] font-bold text-[#64748b] ml-1">Name</label>
              <input type="text" value={profile?.fullName || "Ahmed Hazem"} readOnly className="auth-input bg-white w-full rounded-xl px-4 py-3 text-[14px] text-slate-800 font-semibold" />
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="block text-[12px] font-bold text-[#64748b] ml-1">Email</label>
              <input type="email" value={profile?.email || "ahmedrashed@gmail.com"} readOnly className="auth-input bg-white w-full rounded-xl px-4 py-3 text-[14px] text-slate-800 font-semibold" />
            </div>
          </div>

          {/* Security */}
          <div className="clay-section p-6 flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0062ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
               Security
            </div>
            <div className="flex justify-between items-center text-[14px] text-slate-800 font-bold mt-1">
              <span>PIN Protection</span>
              <div 
                className={`w-[52px] h-[30px] rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] ${pinEnabled ? 'bg-[#0062ff]' : 'bg-slate-200'}`}
                onClick={() => setPinEnabled(!pinEnabled)}
              >
                <div className={`bg-white w-[22px] h-[22px] rounded-full shadow-sm transform transition-transform duration-300 ${pinEnabled ? 'translate-x-[22px]' : 'translate-x-[0px]'}`} />
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="clay-section p-6 flex flex-col gap-4 w-full">
            <div className="flex items-center gap-2.5 text-[#1e293b] font-bold text-[15px] mb-2">
              <Layout size={18} className="text-[#0062ff]" strokeWidth={2.5} /> Template
            </div>
            <div className="flex justify-between items-center text-[14px] text-slate-800 font-bold mt-1">
              <span>Current Template</span>
              <span className="text-[#0062ff] font-bold text-[14px]">{profile?.templateType || 'Medical'}</span>
            </div>
            <button onClick={() => navigate('/choose-template')} className="text-left text-[14px] text-[#0062ff] font-bold mt-2">Change Template {'>'}</button>
          </div>

        </div>

      </div>

      <div className="w-full flex justify-center fixed bottom-8 px-6 max-w-[400px]">
        <button
          onClick={() => navigate('/signin')}
          className="w-full bg-gradient-to-r from-[#ff4d4d] to-[#e61919] text-white font-bold py-4 rounded-[16px] shadow-[0px_16px_32px_-8px_rgba(255,77,77,0.5),inset_0px_2px_4px_rgba(255,255,255,0.3)] border border-[#ff6b6b] flex items-center justify-center gap-2 text-[16px] hover:-translate-y-1 transition-transform"
        >
          <LogOut size={18} strokeWidth={2.5} /> Log Out
        </button>
      </div>
    </div>
  );
}

