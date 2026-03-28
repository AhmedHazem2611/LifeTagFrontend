import { useNavigate } from 'react-router-dom';
import { Smartphone, CheckCircle, ArrowLeft, Watch,  } from 'lucide-react';
import { useState } from 'react';

export default function LinkTag() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'scanning' | 'linked'>('idle');

  const startScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('linked');
      localStorage.setItem('linkedTag', JSON.stringify({ 
        id: 'LT-' + Math.floor(1000 + Math.random() * 9000), 
        type: 'Smart Bracelet', 
        date: new Date().toISOString() 
      }));
    }, 2500);
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] h-full relative">
      <div className="w-full h-full p-6 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 mt-2 w-full">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Link New Device</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          
          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${status === 'scanning' ? 'bg-blue-100/50 scale-110' : status === 'linked' ? 'bg-green-100/50' : 'bg-gray-100/50'}`}>
            
            {status === 'scanning' && (
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
            )}
            
            {status === 'scanning' && (
              <div className="absolute inset-4 rounded-full border-4 border-blue-400 animate-pulse opacity-40"></div>
            )}

            <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-colors duration-500 ${status === 'linked' ? 'bg-green-500' : 'bg-white'}`}>
              {status === 'idle' && <Smartphone size={48} className="text-gray-400" />}
              {status === 'scanning' && <Watch size={48} className="text-blue-500 animate-pulse" />}
              {status === 'linked' && <CheckCircle size={48} className="text-white" />}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
            {status === 'idle' && 'Ready to Link'}
            {status === 'scanning' && 'Scanning for LifeTag...'}
            {status === 'linked' && 'Successfully Linked!'}
          </h2>
          
          <p className="text-sm text-gray-500 text-center px-4 mb-10 leading-relaxed">
            {status === 'idle' && 'Hold your physical LifeTag or accessory near the back of your phone to pair it with your profile.'}
            {status === 'scanning' && 'Please keep your device close to the tag. This will only take a moment.'}
            {status === 'linked' && 'Your physical tag is now securely connected to your online emergency profile.'}
          </p>

          {status === 'idle' && (
            <button 
              onClick={startScan}
              className="bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-2xl shadow-lg border border-blue-700 hover:bg-blue-700 transition flex items-center gap-2"
            >
              Start NFC Scan
            </button>
          )}

          {status === 'linked' && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 text-white font-semibold py-3.5 px-8 rounded-2xl shadow-lg hover:bg-black transition"
            >
              Go to Dashboard
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
