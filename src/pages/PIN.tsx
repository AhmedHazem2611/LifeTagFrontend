import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PIN() {
  const [pinLength, setPinLength] = useState(4);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { code: paramCode } = useParams<{ code?: string }>();
  const tagIdentifier = (paramCode || searchParams.get('code') || searchParams.get('guid') || '').trim();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!tagIdentifier) {
      navigate('/404', { replace: true });
      return;
    }

    let cancelled = false;
    const loadPinMetadata = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/tag/${encodeURIComponent(tagIdentifier)}/pin-status`
        );
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.success && data.data) {
          if (data.data.isStolenOrMissing) {
            navigate(`/stolen-or-missing?code=${encodeURIComponent(data.data.shortCode || tagIdentifier)}`, { replace: true });
            return;
          }
          if (data.data.isActive && !data.data.isPinProtected) {
            navigate(`/public-profile/${data.data.shortCode || tagIdentifier}`, { replace: true });
            return;
          }

          const resolvedLength = Math.min(Math.max(Number(data.data.pinLength) || 4, 4), 12);
          setPinLength(resolvedLength);
          setPin(Array(resolvedLength).fill(''));
        }
      } catch {
        // Keep default 4-box PIN input if status check cannot be reached on mount
      }
    };

    loadPinMetadata();
    return () => {
      cancelled = true;
    };
  }, [tagIdentifier, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^[a-zA-Z0-9]*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value !== '' && index < pin.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '');
    if (!pasted) return;
    e.preventDefault();

    const newPin = [...pin];
    let lastIndex = index;
    for (let offset = 0; offset < pasted.length && index + offset < newPin.length; offset++) {
      newPin[index + offset] = pasted[offset];
      lastIndex = index + offset;
    }
    setPin(newPin);

    const nextFocus = Math.min(lastIndex + 1, newPin.length - 1);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handleVerify = async () => {
    const enteredPin = pin.join('').trim();
    if (enteredPin.length < pinLength) {
      setError(`Please enter the ${pinLength}-character PIN`);
      return;
    }

    if (!tagIdentifier) {
      setError('No bracelet code found. Please scan the QR code again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guid: tagIdentifier, pin: enteredPin }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const canonicalGuid = data.data?.guid || tagIdentifier;
        const shortSlug = data.data?.shortCode || tagIdentifier;
        sessionStorage.setItem('pendingTagGuid', canonicalGuid);
        sessionStorage.setItem('pendingTagPin', enteredPin);

        if (data.data.isLinked) {
          navigate(`/public-profile/${shortSlug}`);
        } else {
          navigate('/signup');
        }
      } else {
        const lowerMsg = String(data.message || '').toLowerCase();
        if (lowerMsg.includes('stolen') || lowerMsg.includes('missing')) {
          navigate(`/stolen-or-missing?code=${encodeURIComponent(tagIdentifier)}`, { replace: true });
          return;
        }
        setError(data.message || 'Invalid PIN');
        setPin(Array(pinLength).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('PIN verification error:', err);
      setError('Network error, try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCompactBoxes = pin.length > 4;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[550px] md:max-w-[380px] flex flex-col items-center">
        {/* Clay Card Content */}
        <div className="clay-card relative w-full py-6 px-4 md:px-8">
          {/* Logo inside card */}
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="LifeTag Logo" className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-[26px] font-sans font-bold text-slate-900 tracking-tight text-center mb-1">
            Enter LifeTag PIN
          </h2>

          <p className="text-[12px] text-slate-400 text-center mb-4 font-normal leading-relaxed">
            Enter the {pinLength}-character PIN found on the back of the bracelet (letters & numbers)
          </p>

          <div className="flex flex-wrap gap-[10px] justify-center mb-6 w-full">
            {pin.map((char, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                value={char}
                onChange={(e) => handleChange(i, e.target.value)}
                onPaste={(e) => handlePaste(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={
                  isCompactBoxes
                    ? 'pin-box !w-10 !h-12 !text-lg'
                    : 'pin-box'
                }
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
