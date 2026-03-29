import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PIN() {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length < 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        navigate('/signup');
      } else {
        setError(data.message || 'Invalid PIN');
        setPin(['', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (err) {
      setError('Network error, try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">

      <div className="w-full max-w-[340px] flex flex-col items-center">

        {/* Clay Card Content */}
        <div className="clay-card relative w-full">

          {/* Logo inside card */}
          {/* Logo -> Title: 16px */}
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="LifeTag Logo" className="w-24 h-24 object-contain" />
          </div>

          {/* Title -> Subtitle: 8px */}
          <h2 className="text-[20px] font-sans font-bold text-slate-800 tracking-tight text-center mb-2">
            Enter LifeTag PIN
          </h2>

          {/* Subtitle -> PIN inputs: 24px */}
          <p className="text-[12px] text-slate-400 text-center mb-6 font-normal leading-relaxed whitespace-nowrap">
            Enter the 4-digit code found on the back of the bracelet
          </p>

          {/* PIN Input Boxes */}
          {/* gap-3 = 12px, PIN inputs -> Button: 24px */}
          <div className="flex gap-3 justify-center mb-6 w-full">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="pin-box"
                maxLength={1}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[11px] font-bold px-4 py-2 rounded-full mb-6 border border-red-100 text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="clay-button w-full"
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
