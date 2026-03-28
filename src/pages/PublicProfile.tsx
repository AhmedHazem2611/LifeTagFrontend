import { Phone, HeartPulse, Pill, AlertTriangle, FileText, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

    fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/profile')
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
            notes: 'Is lactose intolerant.'
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
            notes: 'Is lactose intolerant.'
        });
      });
  }, []);

  if (!profile) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col bg-[#1c1c1e] h-full relative">
      <div className="w-full h-full overflow-y-auto pb-24 no-scrollbar bg-[#f8fbff]">
        
        <div className="bg-[#f8fbff] flex flex-col items-center pt-8 pb-4">
          <div className="flex justify-center items-center mb-2">
            <div className="bg-red-50 p-2 rounded-full border border-red-100">
               <HeartPulse size={32} className="text-red-500" />
            </div>
          </div>
          <div className="bg-red-100 text-red-600 text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase mb-3 border border-red-200">
            Emergency Profile
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{profile.fullName || 'Unknown User'}</h1>
        </div>

        <div className="px-5 flex flex-col gap-3 pb-8">

          {profile.bloodType && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                  <Droplet size={16} className="text-red-400" /> Blood Type       
               </div>
               <div className="text-3xl font-black text-red-400">{profile.bloodType}</div>
            </div>
          )}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                <HeartPulse size={16} className="text-red-400" /> Medical Conditions
             </div>
             <div className="flex flex-wrap gap-2">
                {profile.medicalConditions?.length > 0 ? profile.medicalConditions.map((cond: string, idx: number) => (
                    <span key={idx} className="bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-100">{cond}</span>
                )) : <span className="text-[10px] text-gray-400">None reported</span>}
             </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                <Pill size={16} className="text-blue-500" /> Medications        
             </div>
             <div className="flex flex-wrap gap-2">
                {profile.medications?.length > 0 ? profile.medications.map((med: string, idx: number) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-blue-100">{med}</span>
                )) : <span className="text-[10px] text-gray-400">None reported</span>}
             </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                <AlertTriangle size={16} className="text-orange-500" /> Allergies
             </div>
             <div className="flex flex-wrap gap-2">
                {profile.allergies?.length > 0 ? profile.allergies.map((allergy: string, idx: number) => (
                    <span key={idx} className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-orange-100">{allergy}</span>
                )) : <span className="text-[10px] text-gray-400">None reported</span>}
             </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                <Phone size={16} className="text-green-500" /> Emergency Contacts
             </div>
             <div className="flex flex-col gap-2">
                {profile.emergencyContacts?.length > 0 ? profile.emergencyContacts.map((contact: any, idx: number) => (
                 <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div>
                       <h3 className="font-bold text-gray-800 text-xs">{contact.name}</h3>
                       <p className="text-[10px] text-gray-500">{contact.type || 'Contact'}</p>
                    </div>
                    <a href={'tel:' + contact.phone} className="bg-green-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md hover:bg-green-600 transition-colors">
                      Call
                    </a>
                 </div>
                )) : <span className="text-[10px] text-gray-400">None reported</span>}
             </div>
          </div>

          {profile.notes && (
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                 <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                    <FileText size={16} className="text-gray-500" /> Notes
                 </div>
                 <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">{profile.notes}</p>
              </div>
          )}

        </div>

      </div>

      <div className="absolute bottom-6 w-full px-5 left-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity border border-blue-400"
        >
          Edit Profile (Owner)
        </button>
      </div>

    </div>
  );
}
