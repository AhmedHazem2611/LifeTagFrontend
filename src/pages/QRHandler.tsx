import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function QRHandler() {
  const [searchParams] = useSearchParams();
  const { code: paramCode } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const identifier = (paramCode || searchParams.get('code') || searchParams.get('guid') || '').trim();

  useEffect(() => {
    const checkStatus = async () => {
      if (!identifier) {
        navigate('/404', { replace: true });
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/tag/${encodeURIComponent(identifier)}/pin-status`
        );
        const data = await res.json();

        if (res.ok && data.success && data.data) {
          const { isActive, isPinProtected, isStolenOrMissing, shortCode } = data.data;
          const slug = shortCode || identifier;

          if (isStolenOrMissing) {
            navigate(`/stolen-or-missing?code=${encodeURIComponent(slug)}`, { replace: true });
            return;
          }

          if (isActive && !isPinProtected) {
            navigate(`/public-profile/${slug}`, { replace: true });
          } else {
            navigate(`/pin?code=${encodeURIComponent(slug)}`, { replace: true });
          }
        } else {
          console.error('Tag not found or error', data.message);
          navigate('/404', { replace: true });
        }
      } catch (err) {
        console.error('QR check failed', err);
        navigate('/404', { replace: true });
      }
    };

    checkStatus();
  }, [identifier, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      <p className="mt-4 text-slate-500 font-medium">Verifying Tag...</p>
    </div>
  );
}
