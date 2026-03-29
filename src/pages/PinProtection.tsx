import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import pinshield from '../assets/pinshield.svg';

export default function PinProtection() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 400);
  }, []);

  const handleComplete = async () => {
    try {
      if (enabled) {
        // Automatically assigning a default PIN or just saving the preference
        await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/save-medical-data`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPinProtected: true, pin: "0000" }), // Auto-assigned default PIN
        });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/save-medical-data`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPinProtected: false }),     
        });
      }
    } catch (e) {
      console.log(e);
    }
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[400px] md:max-w-[480px] flex flex-col items-center transition-all duration-300">
        
        <div className="mb-6 flex justify-center mt-4">
          <img src={logo} alt="LifeTag Logo" className="w-28 h-28 object-contain drop-shadow-sm" />
        </div>

        <div className="flex gap-2 w-full max-w-xs mx-auto mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              {i <= 3 && (
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

        <div className="mb-10 w-36 h-36 flex items-center justify-center drop-shadow-xl animate-in zoom-in slide-in-from-bottom-4 duration-500 ease-out">
          <img src={pinshield} alt="PIN Protection Shield" className="w-full h-full object-contain" />
        </div>

        <div className="w-full bg-white rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(150,170,200,0.1)] border border-slate-50 flex flex-col items-center">
          
          <div className="mb-4 text-[#0062ff]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          
          <h2 className="text-xl font-extrabold text-[#1f2937] text-center mb-3 tracking-tight">PIN Protection</h2>
          
          <p className="text-[13px] text-slate-500 text-center leading-relaxed mb-8 px-2">
            The Life Tag profile is protected by a PIN. Anyone who scans the bracelet must enter the PIN to view your emergency information. This ensures your privacy while allowing fast access in emergencies.
          </p>

          <div 
             className="w-full bg-slate-50 border border-slate-100/60 rounded-[18px] p-4 flex justify-between items-center cursor-pointer transition-colors hover:bg-slate-100" 
             onClick={() => setEnabled(!enabled)}
          >
            <span className="text-[14px] font-semibold text-slate-800">Enable PIN Protection</span>
            <div className={'w-[44px] h-[24px] rounded-full p-1 transition-colors duration-200 ease-in-out ' + (enabled ? 'bg-[#0062ff]' : 'bg-slate-300')}>
              <div className={'bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ' + (enabled ? 'translate-x-[20px]' : 'translate-x-0')} />
            </div>
          </div>

        </div>

        <div className="flex gap-4 w-full mt-6">
          <button 
            onClick={() => navigate(-1)} 
            className="clay-button-white w-1/4"
          >
            Back
          </button>
          
          <button 
            onClick={handleComplete}
            className="clay-button w-3/4"
          >
            Continue to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
