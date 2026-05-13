import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function QRHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const guid = searchParams.get('guid');

  useEffect(() => {
    const checkStatus = async () => {
      if (!guid) {
        // If no guid, just go to 404
        navigate('/404');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/${guid}/pin-status`);
        const data = await res.json();

        if (res.ok && data.success) {
          const { isActive, isPinProtected } = data.data;

          if (isActive && !isPinProtected) {
            // Active + No PIN -> Public Profile
            navigate(`/public-profile/${guid}`);
          } else {
            // Unassigned OR Active with PIN -> Enter PIN
            navigate(`/pin?guid=${guid}`);
          }
        } else {
          console.error("Tag not found or error", data.message);
          navigate('/404');
        }
      } catch (err) {
        console.error("QR check failed", err);
        navigate('/404');
      }
    };

    checkStatus();
  }, [guid, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
        <p className="mt-4 text-slate-500 font-medium">Verifying Tag...</p>
    </div>
  );
}
