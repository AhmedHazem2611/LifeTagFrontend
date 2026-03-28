import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Settings, HeartPulse, Pill, AlertTriangle, Phone, FileText, Plus, X, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [linkedTag, setLinkedTag] = useState<any>(null);

  useEffect(() => {
    let userName = 'New User';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
        }

        const tag = localStorage.getItem('linkedTag');
        if (tag) {
            setLinkedTag(JSON.parse(tag));
        }
    } catch(e) {}

    fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setProfile({ ...data.profile, fullName: data.profile.fullName || userName });
        } else {
          // Dummy data fallback
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
        // Fallback to dummy data
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

  const removeItem = async (field: string, index: number) => {
    if (!profile) return;
    const newItems = [...profile[field]];
    newItems.splice(index, 1);
    
    const updatedProfile = { ...profile, [field]: newItems };
    setProfile(updatedProfile);

    try {
        await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile)
        });
    } catch(err) {
        console.error('Failed to sync', err);
    }
  };

  const addItem = async (field: string, promptText: string) => {
    if (!profile) return;
    const val = window.prompt(promptText);
    if (!val || val.trim() === '') return;

    let newItems = [...(profile[field] || [])];
    
    if (field === 'emergencyContacts') {
       const phone = window.prompt("Enter phone number:");
       newItems.push({ name: val, type: 'emergency', phone: phone || '' });
    } else {
       newItems.push(val);
    }

    const updatedProfile = { ...profile, [field]: newItems };
    setProfile(updatedProfile);

    try {
        await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProfile)
        });
    } catch(err) {
        console.error('Failed to sync', err);
    }
  };

  if (!profile) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex-1 flex flex-col bg-[#f8fbff] h-full relative">
      <div className="w-full h-full overflow-y-auto p-5 pb-24 no-scrollbar">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-full">
              <Shield size={20} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-[13px] font-bold text-gray-800 leading-tight">Dashboard</h1>
              <p className="text-[10px] text-gray-500">Your Profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/location-history')} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
              <MapPin size={16} />
            </button>
            <button onClick={() => navigate('/public-profile')} className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
              <Eye size={16} />
            </button>
            <button onClick={() => navigate('/settings')} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-100 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Shield className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm">{profile.fullName}</h2>
            {profile.bloodType && (
              <p className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-md inline-block mt-1">Blood Type: {profile.bloodType}</p>
            )}
            {profile.age && (
              <p className="text-[10px] text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1 ml-1">Age: {profile.age}</p>
            )}
            {profile.templateType && (
              <p className="text-[10px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 border border-gray-100 rounded-md inline-block mt-1 ml-1">{profile.templateType}</p>
            )}
            {linkedTag && (
              <p className="text-[10px] text-green-600 font-medium bg-green-50 px-2 py-0.5 border border-green-100 rounded-md inline-block mt-1 ml-1 flex-items-center gap-1">
                Tag Active
              </p>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">
          
          {/* Medical Conditions */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                <HeartPulse size={16} className="text-red-400" />
                Medical Conditions
              </div>
              <button onClick={() => addItem('medicalConditions', 'Add a Medical Condition:')} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Plus size={14} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {profile.medicalConditions?.length > 0 ? profile.medicalConditions.map((item: string, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl text-xs text-gray-600 border border-gray-100">
                  {item} <button onClick={() => removeItem('medicalConditions', idx)} className="text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                </div>
              )) : <p className="text-xs text-gray-400 text-center py-2">Add your first medical condition</p>}
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                <Pill size={16} className="text-blue-400" />
                Medications
              </div>
              <button onClick={() => addItem('medications', 'Add a Medication:')} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Plus size={14} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {profile.medications?.length > 0 ? profile.medications.map((item: string, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl text-xs text-gray-600 border border-gray-100">
                  {item} <button onClick={() => removeItem('medications', idx)} className="text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                </div>
              )) : <p className="text-xs text-gray-400 text-center py-2">Add your first medication</p>}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                <AlertTriangle size={16} className="text-orange-400" />
                Allergies
              </div>
              <button onClick={() => addItem('allergies', 'Add an Allergy:')} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Plus size={14} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {profile.allergies?.length > 0 ? profile.allergies.map((item: string, idx: number) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl text-xs text-gray-600 border border-gray-100">
                  {item} <button onClick={() => removeItem('allergies', idx)} className="text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                </div>
              )) : <p className="text-xs text-gray-400 text-center py-2">Add your first allergy</p>}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                <Phone size={16} className="text-green-500" />
                Emergency Contacts
              </div>
              <button onClick={() => addItem('emergencyContacts', 'Add an Emergency Contact Name:')} className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500"><Plus size={14} /></button>
            </div>
            <div className="flex flex-col gap-2">
              {profile.emergencyContacts?.length > 0 ? profile.emergencyContacts.map((contact: any, idx: number) => (
                <div key={idx} className="flex flex-col bg-gray-50 px-3 py-2.5 rounded-xl text-xs text-gray-600 border border-gray-100 relative">
                  <span className="font-semibold text-gray-800 mb-0.5">{contact.name} {contact.type ? `(${contact.type})` : ''}</span>
                  <span>{contact.phone}</span>
                  <button onClick={() => removeItem('emergencyContacts', idx)} className="absolute right-3 top-3 text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                </div>
              )) : <p className="text-xs text-gray-400 text-center py-2">Add your first emergency contact</p>}
            </div>
          </div>

          {/* Address */}
          {profile.address && (
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
                <FileText size={16} className="text-gray-500" />
                Address
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100">{profile.address}</p>
            </div>
          )}

          {/* Custom Sections */}
          {profile.customSections?.map((sec: any, idx: number) => (
            <div key={idx} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                  <FileText size={16} className="text-blue-400" />
                  {sec.name}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {sec.items?.length > 0 ? sec.items.map((item: string, itemIdx: number) => (
                  <div key={itemIdx} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-xl text-xs text-gray-600 border border-gray-100">
                    {item}
                  </div>
                )) : <p className="text-xs text-gray-400 text-center py-2">No items</p>}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
              <FileText size={16} className="text-gray-500" />
              Notes
            </div>
            {profile.notes ? (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs text-gray-600">{profile.notes}</p>
              </div>
            ) : <p className="text-xs text-gray-400 text-center py-2">Additional notes...</p>}
          </div>

        </div>

      </div>
    </div>
  );
}
