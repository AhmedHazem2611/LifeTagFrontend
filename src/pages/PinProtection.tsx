import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PinProtection() {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById('pin-setup-' + (index + 1));      
      nextInput?.focus();
    }
  };

  const handleComplete = async () => {
    if (enabled) {
      const enteredPin = pin.join('');
      if (enteredPin.length < 4) {
        alert('Please enter a 4-digit PIN');
        return;
      }

      try {
         await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isPinProtected: true, pin: enteredPin }),      
        });
      } catch (e) {
        console.log(e);
      }
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] h-full relative">
      <div className="w-full h-full overflow-y-auto p-6 pb-32 flex flex-col items-center">
        <div className="mt-4 mb-4 flex justify-center">
          <Shield size={32} className="text-blue-500 bg-blue-50 p-1.5 rounded-full" />
        </div>

        <div className="flex gap-1.5 mb-10 justify-center">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
        </div>

        <div className="relative mb-8 w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-inner">
          <Shield size={64} className="text-blue-500 drop-shadow-md" fill="currentColor" fillOpacity={0.1} />
          <div className="absolute inset-x-0 bottom-6 flex justify-center">     
             <div className="w-6 h-6 text-white font-bold bg-blue-500 rounded-full flex items-center justify-center text-sm">+</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-md border border-blue-50 w-full mb-4 z-10 flex flex-col items-center">
          <div className="mb-4">
             <Shield className="text-blue-600 w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 text-center mb-3">PIN Protection</h2>
          <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-8 px-2">
            The Life Tag profile is protected by a PIN. Anyone who scans the bracelet must enter the PIN to view your emergency information. This ensures your privacy while allowing fast access in emergencies.
          </p>

          <div className="w-full bg-blue-50 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition-colors mb-4" onClick={() => setEnabled(!enabled)}>
            <span className="text-sm font-semibold text-gray-800">Enable PIN Protection</span>
            <div className={'w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ' + (enabled ? 'bg-blue-600' : 'bg-gray-300')}>
              <div className={'bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ' + (enabled ? 'translate-x-4' : 'translate-x-0')} />
            </div>
          </div>

          {enabled && (
            <div className="flex gap-3 justify-center mb-2 w-full animate-fade-in">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  id={'pin-setup-' + i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-12 h-14 border border-gray-200 rounded-xl text-center text-xl font-bold bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  maxLength={1}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#f8fbff] via-[#f8fbff] to-transparent">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-white text-gray-700 font-medium py-3 rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50 text-sm"
          >
            Back
          </button>
          <button
            onClick={handleComplete}
            className="flex-[2] bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium py-3 rounded-2xl shadow-md hover:from-blue-500 hover:to-blue-700 text-sm"
          >
            Finish Setup
          </button>
        </div>
      </div>
    </div>
  );
}
