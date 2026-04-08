import { Phone, HeartPulse, Pill, AlertTriangle, FileText, Droplet, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function PublicProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = () => {
      let userName = 'Unknown User';
      let userId = '';
      try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
              const parsed = JSON.parse(storedUser);
              if (parsed && parsed.fullName) userName = parsed.fullName;
              userId = parsed?.id || parsed?._id || '';
          }
      } catch(e) {}

      fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/profile?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            setProfile({ ...data.profile, fullName: data.profile.fullName || userName });
          } else {
            setProfile({
              fullName: userName,
              bloodType: 'A+',
              medicalConditions: ['Diabetes', 'Asthma'],
              medications: ['Ibuprofen', 'Panadol'],
              allergies: ['Cheese', 'Peanuts'],
              emergencyContacts: [{ name: 'Mohamed Mostafa', type: 'brother', phone: '01062558066' }],
              notes: 'Is lactose intolerant'
            });
          }
        })
        .catch(() => {
          setProfile({
              fullName: userName,
              bloodType: 'A+',
              medicalConditions: ['Diabetes', 'Asthma'],
              medications: ['Ibuprofen', 'Panadol'],
              allergies: ['Cheese', 'Peanuts'],
              emergencyContacts: [{ name: 'Mohamed Mostafa', type: 'brother', phone: '01062558066' }],
              notes: 'Is lactose intolerant'
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
  }, []);

  if (!profile) return <div className="p-6 text-center text-slate-500 font-medium">Loading Medical Data...</div>;

  const dobAge = profile?.dob ? Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / 31557600000) : null;
  const displayAge = (dobAge !== null && !isNaN(dobAge)) ? dobAge : profile?.age;

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] font-body min-h-screen relative pb-[12vh]">
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
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                 Address
              </div>
              {profile.address ? (
                <p className="text-[14px] font-medium text-slate-700 bg-[#f4f6fb] px-4 py-3 rounded-xl border border-slate-100 shadow-sm whitespace-pre-wrap">{profile.address}</p>
              ) : (
                <p className="text-[13px] text-slate-400 font-medium">No address provided</p>
              )}
            </div>
          )}

          {/* Emergency Contacts */}
          {profile.templateType !== 'Custom' && (
          <div className="clay-section p-6">
             <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                <Phone size={18} className="text-[#22c55e]" strokeWidth={2.5} /> Emergency Contacts
             </div>
             <div className="flex flex-col gap-3">
                {profile.emergencyContacts?.length > 0 ? profile.emergencyContacts.map((contact: any, idx: number) => (
                 <div key={idx} className="flex justify-between items-center bg-white/70 p-3.5 rounded-2xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                    <div className="flex flex-col">
                       <h3 className="font-extrabold text-[#1a1c1e] text-[14px] tracking-tight">{contact.name}</h3>
                       <p className="text-[12px] text-slate-500 font-medium mt-0.5">{contact.type || 'Contact'}</p>
                    </div>
                    <a href={'tel:' + contact.phone} className="bg-gradient-to-r from-[#34d399] to-[#22c55e] border border-[#4ade80] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-[0px_4px_12px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-transform">
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
              if (t.includes('medic') || t.includes('health') || t.includes('condition') || t.includes('surgery')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>;
              if (t.includes('pill') || t.includes('medication') || t.includes('drug') || t.includes('pharm')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>;
              if (t.includes('allerg')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
              if (t.includes('contact') || t.includes('emergency') || t.includes('phone') || t.includes('call')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
              if (t.includes('address') || t.includes('location') || t.includes('place') || t.includes('home') || t.includes('city')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
              if (t.includes('doctor') || t.includes('physician') || t.includes('specialist') || t.includes('clinic') || t.includes('hospital')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>;
              if (t.includes('blood') || t.includes('vital') || t.includes('measure')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>;
              if (t.includes('diet') || t.includes('food') || t.includes('nutrition') || t.includes('eat')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>;
              if (t.includes('insurance') || t.includes('policy') || t.includes('legal') || t.includes('protect')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
              if (t.includes('history') || t.includes('past') || t.includes('previous') || t.includes('timeline')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
              if (t.includes('note') || t.includes('additional') || t.includes('info') || t.includes('detail')) return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
              return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
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

      <div className="w-full flex justify-center fixed bottom-6 px-6 max-w-[400px]">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-t from-[#005adc] to-[#3a9fff] border border-[#68b7ff] text-white font-bold py-3.5 rounded-[16px] shadow-[0px_10px_20px_rgba(58,159,255,0.4),inset_0px_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 text-[15px] hover:-translate-y-1 transition-transform"
        >
          <Edit3 size={16} strokeWidth={2.5} /> Edit Profile
        </button>
      </div>

    </div>
  );
}
