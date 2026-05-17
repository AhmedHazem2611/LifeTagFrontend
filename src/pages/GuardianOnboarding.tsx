import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Shield, Smartphone, Bell, Users, ArrowRight } from 'lucide-react';

export default function GuardianOnboarding() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[400px] md:max-w-[520px] flex flex-col items-center animate-in fade-in duration-500">
        
        <div className="mb-6 flex justify-center mt-4">
          <img src={logo} alt="LifeTag Logo" className="w-28 h-28 object-contain drop-shadow-sm" />
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 w-full max-w-xs mx-auto mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  background: i <= 4 ? 'linear-gradient(333deg, hsl(216 100% 43%) 0%, hsl(196 93% 76%) 100%)' : 'transparent',
                  width: '100%'
                }}
              />
            </div>
          ))}
        </div>

        <div className="w-full bg-white rounded-[32px] p-8 shadow-[0px_15px_40px_rgba(150,170,200,0.12)] border border-slate-50 flex flex-col items-center">
          
          <div className="bg-blue-50 text-blue-600 p-4 rounded-[22px] mb-6 shadow-inner">
            <Shield size={32} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-[24px] font-black text-slate-900 text-center mb-2 tracking-tight">Your Emergency Network</h2>
          <p className="text-[14px] text-slate-500 text-center leading-relaxed mb-8 px-2">
            Every Life Tag can be linked to an <strong>Emergency Guardian</strong> who will receive instant alerts if your bracelet is scanned.
          </p>

          <div className="flex flex-col gap-5 w-full">
            
            <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100/50">
               <div className="bg-white p-2.5 rounded-[16px] shadow-sm text-blue-500 mt-1">
                  <Smartphone size={18} />
               </div>
               <div className="flex flex-col">
                  <h3 className="text-[14px] font-bold text-slate-800 mb-1">Guardian Mobile App</h3>
                  <p className="text-[12px] text-slate-500 leading-normal">Your guardian uses the <strong>Life Tag Guardian App</strong> to monitor your safety.</p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100/50">
               <div className="bg-white p-2.5 rounded-[16px] shadow-sm text-red-500 mt-1">
                  <Bell size={18} />
               </div>
               <div className="flex flex-col">
                  <h3 className="text-[14px] font-bold text-slate-800 mb-1">Instant Alerts</h3>
                  <p className="text-[12px] text-slate-500 leading-normal">The moment someone scans your bracelet, your guardian gets a <strong>high-priority notification</strong> with your GPS location.</p>
               </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-[24px] border border-slate-100/50">
               <div className="bg-white p-2.5 rounded-[16px] shadow-sm text-green-500 mt-1">
                  <Users size={18} />
               </div>
               <div className="flex flex-col">
                  <h3 className="text-[14px] font-bold text-slate-800 mb-1">Live Communication</h3>
                  <p className="text-[12px] text-slate-500 leading-normal">A secure chat opens between the responder and your guardian to coordinate help immediately.</p>
               </div>
            </div>

          </div>

          <div className="mt-8 bg-blue-50/40 p-4 rounded-[20px] border border-blue-100/50 w-full text-center">
             <p className="text-[12px] text-blue-600 font-bold">
               You can link your first guardian from the Dashboard after setup.
             </p>
          </div>

        </div>

        <div className="flex gap-4 w-full mt-8">
          <button 
            onClick={() => navigate(-1)} 
            className="clay-button-white w-1/4"
          >
            Back
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="clay-button w-3/4 group"
          >
            Finish Setup <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
