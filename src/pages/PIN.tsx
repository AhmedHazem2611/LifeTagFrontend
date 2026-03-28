import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function PIN() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById('pin-' + (index + 1));
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    try {
      const res = await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        navigate('/signup');
      } else {
        setError(data.message || 'Invalid PIN');
      }
    } catch (err) {
      setError('Network error, try again.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20 relative">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Shield size={240} className="text-blue-500" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm z-10 flex flex-col items-center">
        <div className="bg-blue-50 p-4 rounded-full mb-4">
          <Shield size={40} className="text-blue-500" />
        </div>
        <h2 className="text-xl text-center font-bold text-gray-800 mb-1">Enter LifeTag PIN</h2>
        <p className="text-xs text-gray-500 text-center mb-6 px-4">
          Enter the 4-digit code found on the back of the bracelet
        </p>

        <div className="flex gap-3 justify-center mb-6 w-full">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={'pin-' + i}
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

        {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium py-3 rounded-2xl shadow-md hover:from-blue-500 hover:to-blue-700 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
