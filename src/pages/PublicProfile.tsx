import { Phone, HeartPulse, Pill, AlertTriangle, FileText, Droplet, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export default function PublicProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let userName = 'Unknown User';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
        }
    } catch(e) {}

    fetch(`${import.meta.env.VITE_API_URL}/api/profile`)
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
  }, []);

  if (!profile) return <div className="p-6 text-center text-slate-500 font-medium">Loading Medical Data...</div>;

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
          <h1 className="text-[26px] font-black text-[#1e293b] tracking-tight">{profile.fullName || 'Unknown User'}</h1>
        </div>

        <div className="flex flex-col gap-4">

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

          {/* Emergency Contacts */}
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

          {/* Notes */}
          {profile.notes && (
              <div className="clay-section p-6">
                 <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px] mb-3">
                    <FileText size={18} className="text-[#475569]" strokeWidth={2.5} /> Notes
                 </div>
                 <p className="text-[13px] font-medium text-slate-700 bg-white/50 px-4 py-3 rounded-xl border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] whitespace-pre-wrap">{profile.notes}</p>
              </div>
          )}

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
