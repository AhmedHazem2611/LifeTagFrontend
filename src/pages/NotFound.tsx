import { Search, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function NotFound() {

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f8fbff] min-h-screen font-body relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-60 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-40" />

      <div className="w-full max-w-[480px] flex flex-col items-center relative z-10">
        
        <div className="mb-8 flex justify-center animate-bounce-slow">
          <img src={logo} alt="LifeTag Logo" className="w-32 h-32 object-contain drop-shadow-xl" />
        </div>

        <div className="clay-card w-full p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-[30px] flex items-center justify-center mb-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <Search className="w-10 h-10 text-blue-500 opacity-80" strokeWidth={2.5} />
          </div>

          <h1 className="text-[42px] font-black text-[#1e293b] tracking-tight mb-2 leading-tight">
            404
          </h1>
          <h2 className="text-xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Page Not Found
          </h2>
          
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-8 px-4">
            Oops! It looks like you've landed on a page that doesn't exist or you accessed the site without a Tag scan.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-2 mt-2 text-slate-400 text-[13px] font-semibold justify-center">
              <AlertCircle size={14} /> 
              Please scan your LifeTag QR code to begin
            </div>
          </div>
        </div>

        <p className="mt-8 text-slate-400 text-[12px] font-bold tracking-widest uppercase opacity-60">
          LifeTag Safety Systems
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
