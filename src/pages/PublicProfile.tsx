import { Phone, HeartPulse, Pill, AlertTriangle, FileText, Droplet, Edit3 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { emergencyApi } from '../api/emergencyApi';

export default function PublicProfile() {
  const navigate = useNavigate();
  const { guid } = useParams();
  const [searchParams] = useSearchParams();
  const isInternal = searchParams.get('internal') === 'true';

  const [profile, setProfile] = useState<any>(null);
  const [emergencySession, setEmergencySession] = useState<any>(null);
  const [emergencyState, setEmergencyState] = useState<'idle' | 'pending' | 'acknowledged' | 'failed'>('idle');
  const [locError, setLocError] = useState<string | null>(null);
  const [showLocModal, setShowLocModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      let userName = 'Unknown User';
      let fetchUrl = '';
      
      if (guid) {
        // New GUID-based public access
        try {
            const statusRes = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/tag/${guid}/pin-status`);
            const statusData = await statusRes.json();
            
            if (!statusData.success || !statusData.data.isActive) {
                // If the tag is not active (unassigned), start onboarding
                if (!isInternal) {
                    navigate(`/pin?guid=${guid}`);
                    return;
                }
            }
            
            if (statusData.data.isPinProtected) {
                const storedPin = sessionStorage.getItem('pendingTagPin');
                if (!storedPin) {
                    navigate(`/pin?guid=${guid}`);
                    return;
                }
                fetchUrl = `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/public-profile/${guid}?pin=${storedPin}`;
            } else {
                fetchUrl = `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/public-profile/${guid}`;
            }
        } catch (e) {
            if (!isInternal) {
                navigate('/404');
                return;
            }
        }
      } else {
        // Fallback for dashboard preview
        let userId = '';
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed && parsed.fullName) userName = parsed.fullName;
                userId = parsed?.id || '';
            }
        } catch(e) {}
        fetchUrl = `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/profile?userId=${userId}`;
      }

      fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setProfile({ ...data.data, fullName: data.data.fullName || userName });
          } else {
            if (guid && !isInternal) {
              navigate('/404');
              return;
            }
            // Default mock data if profile not found or access denied (internal preview)
            setProfile({
              fullName: userName,
              bloodType: '?',
              medicalConditions: [],
              medications: [],
              allergies: [],
              emergencyContacts: [],
              notes: 'No profile data found.',
              hasEmergencyGuardian: false
            });
          }
        })
        .catch(() => {
          setProfile({
              fullName: userName,
              bloodType: '?',
              medicalConditions: [],
              medications: [],
              allergies: [],
              emergencyContacts: [],
              notes: 'Failed to load profile.',
              hasEmergencyGuardian: false
          });
        });
    };

    fetchProfile();

    const handleStorageChange = (e: StorageEvent) => {
       if (e.key === 'previewUpdate') {
           fetchProfile();
       }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [guid, isInternal, navigate]);

  // Polling for acknowledgment
  useEffect(() => {
    let interval: any;
    if (emergencyState === 'pending' && emergencySession?.id) {
      interval = setInterval(async () => {
        try {
          const res = await emergencyApi.getSessionDetails(emergencySession.id);
          if (res.success && res.data) {
            if (res.data.status === 'Acknowledged') {
              setEmergencySession(res.data);
              setEmergencyState('acknowledged');
              clearInterval(interval);
            } else if (res.data.status === 'Expired' || res.data.status === 'Closed') {
              setEmergencyState('failed');
              clearInterval(interval);
            }
          }
        } catch (e) {
          console.error('Polling error:', e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [emergencyState, emergencySession]);

  if (!profile) return <div className="p-6 text-center text-slate-500 font-medium">Loading Medical Data...</div>;

  if (profile.isError) return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-transparent min-h-screen">
          <div className="bg-red-50 text-red-500 font-bold text-[14px] px-6 py-4 rounded-2xl border border-red-100 max-w-sm">
             {profile.notes || profile.message || 'Error loading profile'}
          </div>
      </div>
  );

  const dobAge = profile?.dob ? Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / 31557600000) : null;
  const displayAge = (dobAge !== null && !isNaN(dobAge)) ? dobAge : profile?.age;

  const handleTriggerEmergency = () => {
    setLocError(null);
    setShowLocModal(false);
    
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser. Please enable location services.');
      setShowLocModal(true);
      return;
    }

    // Set temporary loading state but don't enter 'pending' (polling) yet
    setEmergencyState('pending'); 

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await emergencyApi.triggerEmergency(
            guid!, 
            position.coords.latitude, 
            position.coords.longitude
          );
          if (res.success && res.data) {
            setEmergencySession(res.data);
            // Now we are truly pending guardian response
            setEmergencyState('pending');
          } else {
            // API failure is treated as a generic failure for now
            setEmergencyState('idle');
            setLocError(res.message || 'Failed to trigger alert. Please try again.');
            setShowLocModal(true);
          }
        } catch (e) {
          setEmergencyState('idle');
          setLocError('Network error while triggering alert. Please check your connection.');
          setShowLocModal(true);
        }
      },
      (err) => {
        // Location failed: Reset to idle and show modal
        setEmergencyState('idle');
        if (err.code === 1) {
          setLocError('Location permission is required to alert the guardian. Please allow location access and try again.');
        } else {
          setLocError('Unable to retrieve location. Please enable location services and try again.');
        }
        setShowLocModal(true);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const renderEmergencyButton = () => {
    if (!profile.hasEmergencyGuardian) return null;

    switch (emergencyState) {
      case 'idle':
        return (
          <button
            onClick={handleTriggerEmergency}
            className="w-full bg-gradient-to-t from-[#e11d48] to-[#fb7185] border border-[#f43f5e] text-white font-bold py-3.5 rounded-[16px] shadow-[0px_10px_20px_rgba(225,29,72,0.4),inset_0px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 text-[15px] hover:-translate-y-1 transition-transform"
          >
            <AlertTriangle size={18} strokeWidth={2.5} /> Send Emergency Alert
          </button>
        );
      case 'pending':
        const isRequestingLocation = !emergencySession?.id;
        return (
          <button
            disabled
            className="w-full bg-slate-200 border border-slate-300 text-slate-500 font-bold py-3.5 rounded-[16px] flex items-center justify-center gap-2 text-[15px] opacity-80 cursor-not-allowed"
          >
            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            {isRequestingLocation ? 'Retrieving Location...' : 'Waiting for Guardian Response...'}
          </button>
        );
      case 'acknowledged':
        return (
          <button
            onClick={() => {
              if (emergencySession?.id) {
                navigate(`/emergency-chat/${emergencySession.id}`);
              }
            }}
            className="w-full bg-gradient-to-t from-[#059669] to-[#34d399] border border-[#10b981] text-white font-bold py-3.5 rounded-[16px] shadow-[0px_10px_20px_rgba(16,185,129,0.4),inset_0px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 text-[15px] hover:-translate-y-1 transition-transform"
          >
            <Phone size={18} strokeWidth={2.5} /> Guardian Responded — Open Chat
          </button>
        );
      case 'failed':
        return (
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => {
                setEmergencySession(null);
                handleTriggerEmergency();
              }}
              className="w-full bg-slate-100 border border-slate-200 text-slate-500 font-bold py-3.5 rounded-[16px] flex items-center justify-center gap-2 text-[15px] hover:bg-slate-200 transition-colors"
            >
              No Guardian Responded — Retry Alert
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] font-body min-h-screen relative pb-[20vh]">
      
      {/* Location Error Modal Overlay */}
      {showLocModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="clay-card w-full max-w-[340px] p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="bg-red-50 text-red-500 p-3 rounded-2xl mb-4">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-[18px] font-black text-slate-900 mb-2">Location Required</h3>
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-6">
              {locError}
            </p>
            <button 
              onClick={() => setShowLocModal(false)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[400px] md:max-w-4xl flex flex-col px-6 pt-8 pb-20">
        
        {/* Header Profile Identity */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex justify-center mb-1">
             <img src={logo} alt="LifeTag Logo" className="w-[80px] h-[80px] object-contain drop-shadow-sm" />
          </div>
          <div className="bg-[#fff1f2] text-[#f43f5e] text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider uppercase mb-2 border border-[#ffe4e6]">
            EMERGENCY PROFILE
          </div>
          {(profile.templateType === 'Medical' || !profile.templateType) && (
            <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">{profile.fullName || 'Unknown User'}</h1>
          )}
        </div>

        {/* Location Error Feedback */}
        {locError && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-[12px] font-bold p-3 rounded-xl text-center">
            {locError}
          </div>
        )}

        <div className="flex flex-col gap-4">

          {/* Child Identity Section */}
          {profile.templateType === 'Child' && (
             <div className="clay-section p-6 flex flex-col items-center mb-2 border border-[#dbeafe] bg-gradient-to-b from-[#f8fbff] to-white">
                <h1 className="text-[28px] font-black text-[#1e293b] tracking-tight mb-1">{profile.fullName || 'Unknown Child'}</h1>
                {displayAge !== undefined && displayAge !== null && displayAge !== '' && (
                  <div className="bg-blue-50 text-blue-600 font-bold text-[14px] px-4 py-1.5 rounded-full border border-blue-100 flex items-center gap-1.5 mt-2">
                     Age: {displayAge}
                  </div>
                )}
             </div>
          )}

          {(profile.templateType === 'Medical' || !profile.templateType) && (
            <>
              {/* Blood Type */}
              {profile.bloodType && (
                <div className="clay-section p-6 flex flex-col items-center">
                   <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-2 w-full">
                      <Droplet size={18} className="text-[#f43f5e]" strokeWidth={2.5} /> Blood Type       
                   </div>
                   <div className="text-[42px] font-black text-[#f43f5e] tracking-tight pb-2">{profile.bloodType}</div>
                </div>
              )}

              {/* Medical Conditions */}
              <div className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    <HeartPulse size={18} className="text-[#f43f5e]" strokeWidth={2.5} /> Medical Conditions
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {profile.medicalConditions?.length > 0 ? profile.medicalConditions.map((cond: string, idx: number) => (
                        <span key={idx} className="bg-[#fff1f2] text-[#e11d48] text-[12px] font-bold px-4 py-1.5 rounded-full border border-[#ffe4e6]">{cond}</span>
                    )) : <span className="text-[12px] text-slate-400 font-medium">None reported</span>}
                 </div>
              </div>

              {/* Medications */}
              <div className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    <Pill size={18} className="text-[#3b82f6]" strokeWidth={2.5} /> Medications        
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {profile.medications?.length > 0 ? profile.medications.map((med: string, idx: number) => (
                        <span key={idx} className="bg-[#eff6ff] text-[#2563eb] text-[12px] font-bold px-4 py-1.5 rounded-full border border-[#dbeafe]">{med}</span>
                    )) : <span className="text-[12px] text-slate-400 font-medium">None reported</span>}
                 </div>
              </div>

              {/* Allergies */}
              <div className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    <AlertTriangle size={18} className="text-[#f43f5e]" strokeWidth={2.5} /> Allergies
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {profile.allergies?.length > 0 ? profile.allergies.map((allergy: string, idx: number) => (
                        <span key={idx} className="bg-[#fff1f2] text-[#e11d48] text-[12px] font-bold px-4 py-1.5 rounded-full border border-[#ffe4e6]">{allergy}</span>
                    )) : <span className="text-[12px] text-slate-400 font-medium">None reported</span>}
                 </div>
              </div>
            </>
          )}

          {/* Address */}
          {(profile.address || profile.templateType === 'Child') && profile.templateType !== 'Custom' && (
            <div className="clay-section p-6 flex flex-col">
              <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                 <FileText size={18} className="text-[#64748b]" strokeWidth={2.5} /> Address
              </div>
              {profile.address ? (
                <p className="text-[14px] font-medium text-slate-700 bg-[#f4f6fb] px-4 py-3 rounded-xl border border-slate-100 shadow-sm whitespace-pre-wrap">{profile.address}</p>
              ) : (
                <p className="text-[13px] text-slate-400 font-medium">No address provided</p>
              )}
            </div>
          )}

          {/* Emergency Contacts */}
          {(profile.templateType !== 'Custom' || profile.emergencyContacts?.length > 0) && (
          <div className="clay-section p-6">
             <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                <Phone size={18} className="text-[#22c55e]" strokeWidth={2.5} /> Emergency Contacts
             </div>
             <div className="flex flex-col gap-3">
                {profile.emergencyContacts?.length > 0 ? profile.emergencyContacts.map((contact: any, idx: number) => (
                 <div key={idx} className="flex justify-between items-center bg-white/70 p-3.5 rounded-2xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col">
                       <h3 className="font-extrabold text-[#1a1c1e] text-[14px] tracking-tight">{contact.name || 'Emergency Contact'}</h3>
                       <p className="text-[12px] text-slate-500 font-medium mt-0.5">{contact.relation || contact.type || ''}</p>
                    </div>
                    <a href={'tel:' + (contact.phoneNumber || contact.phone)} className="bg-gradient-to-r from-[#34d399] to-[#22c55e] border border-[#4ade80] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-[0px_4px_12px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-transform">
                      Call
                    </a>
                 </div>
                )) : <span className="text-[12px] text-slate-400 font-medium">None reported</span>}
             </div>
          </div>
          )}

          {/* Notes */}
          {profile.notes && profile.templateType !== 'Custom' && (
              <div className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    <FileText size={18} className="text-[#475569]" strokeWidth={2.5} /> Notes
                 </div>
                 <p className="text-[13px] font-medium text-slate-700 bg-white/50 px-4 py-3 rounded-xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] whitespace-pre-wrap">{profile.notes}</p>
              </div>
          )}

          {/* Custom Sections */}
          {profile.templateType === 'Custom' && profile.customSections?.map((sec: any, idx: number) => {
            const getIconForTitle = (title: string) => {
              const t = (title || '').toLowerCase();
              if (t.includes('medic') || t.includes('health') || t.includes('condition') || t.includes('surgery')) return <HeartPulse size={18} className="text-[#f87171]" strokeWidth={2.5} />;
              if (t.includes('pill') || t.includes('medication') || t.includes('drug')) return <Pill size={18} className="text-[#2563eb]" strokeWidth={2.5} />;
              if (t.includes('allerg')) return <AlertTriangle size={18} className="text-[#f87171]" strokeWidth={2.5} />;
              if (t.includes('contact') || t.includes('phone')) return <Phone size={18} className="text-[#22c55e]" strokeWidth={2.5} />;
              return <FileText size={18} className="text-[#60a5fa]" strokeWidth={2.5} />;
            };
            return (
              <div key={`custom-${idx}`} className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    {getIconForTitle(sec.name)} {sec.name}
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {sec.items?.length > 0 ? sec.items.map((item: string, itemIdx: number) => (
                        <span key={itemIdx} className="bg-[#f4f6fb] text-[#1a1c1e] text-[12px] font-bold px-4 py-1.5 rounded-full border border-slate-100">{item}</span>
                    )) : <span className="text-[12px] text-slate-400 font-medium">No items</span>}
                 </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Persistent Bottom Action Area */}
      <div className="w-full flex flex-col items-center fixed bottom-6 px-6 max-w-[440px] gap-3">
        
        {/* Primary Action (Emergency or Edit) */}
        {renderEmergencyButton() || (
          <button
            onClick={() => {
              if (isInternal) navigate('/dashboard');
              else navigate(`/signin?editTagGuid=${guid || ''}`);
            }}
            className="w-full bg-gradient-to-t from-[#005adc] to-[#3a9fff] border border-[#68b7ff] text-white font-bold py-3.5 rounded-[16px] shadow-[0px_10px_20px_rgba(58,159,255,0.4),inset_0px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 text-[15px] hover:-translate-y-1 transition-transform"
          >
            <Edit3 size={16} strokeWidth={2.5} /> {isInternal ? 'Return to Editor' : 'Edit Profile'}
          </button>
        )}

        {/* Secondary Edit Action if emergency button is present */}
        {profile.hasEmergencyGuardian && emergencyState === 'idle' && (
           <button
             onClick={() => {
               if (isInternal) navigate('/dashboard');
               else navigate(`/signin?editTagGuid=${guid || ''}`);
             }}
             className="text-[12px] text-slate-400 font-bold hover:text-slate-600 transition-colors"
           >
             Edit Profile
           </button>
        )}
      </div>

    </div>
  );
}
