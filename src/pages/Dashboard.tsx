import { useNavigate } from 'react-router-dom';
import { Eye, Settings, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import medicalInfoShield from '../assets/medical-info-sheild.svg';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [linkedTag, setLinkedTag] = useState<any>(null);

  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ field: string, index: number } | null>(null);
  const [editVal, setEditVal] = useState<any>('');

  useEffect(() => {
    let userName = 'New User';
    let userId = '';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
            userId = parsed?.id || parsed?._id || '';
        }

        const tag = localStorage.getItem('linkedTag');
        if (tag) {
            setLinkedTag(JSON.parse(tag));
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
            medicalConditions: [],
            medications: [],
            allergies: [],
            emergencyContacts: [],
            notes: ''
          });
        }
      })
      .catch(() => {
        setProfile({
            fullName: userName,
            medicalConditions: [],
            medications: [],
            allergies: [],
            emergencyContacts: [],
            notes: ''
        });
      });
  }, []);

  const syncProfile = async (updatedProfile: any) => {
    setProfile(updatedProfile);
    let userId = '';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            userId = parsed?.id || parsed?._id || '';
        }
    } catch(e) {}

    try {
        await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/save-medical-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...updatedProfile, userId})
        });
    } catch(err) {
        console.error('Failed to sync', err);
    }
  };

  const removeItem = (field: string, index: number) => {
    if (!profile) return;
    const newItems = [...profile[field]];
    newItems.splice(index, 1);
    syncProfile({ ...profile, [field]: newItems });
  };

  const handleSaveAdd = (field: string, val: any) => {
    if (!profile) return;
    let newItems = [...(profile[field] || [])];
    newItems.push(val);
    syncProfile({ ...profile, [field]: newItems });
    setAddingTo(null);
  };

  const handleSaveEdit = () => {
    if (!profile || !editingItem || !editVal) return;
    if (editingItem.field === 'customSections') {
        const { sectionIdx, index: itemIdx } = editingItem as any;
        const newSections = [...(profile.customSections || [])];
        const newItems = [...(newSections[sectionIdx].items || [])];
        newItems[itemIdx] = editVal;
        newSections[sectionIdx] = { ...newSections[sectionIdx], items: newItems };
        syncProfile({ ...profile, customSections: newSections });
        setEditingItem(null);
        return;
    }
    let newItems = [...(profile[editingItem.field] || [])];
    newItems[editingItem.index] = editVal;
    syncProfile({ ...profile, [editingItem.field]: newItems });
    setEditingItem(null);
  };

  const removeCustomItem = (sectionIdx: number, itemIdx: number) => {
    if (!profile) return;
    const newSections = [...(profile.customSections || [])];
    const newItems = [...newSections[sectionIdx].items];
    newItems.splice(itemIdx, 1);
    newSections[sectionIdx] = { ...newSections[sectionIdx], items: newItems };
    syncProfile({ ...profile, customSections: newSections });
  };

  const handleSaveAddCustomItem = (sectionIdx: number, val: string) => {
    if (!profile) return;
    const newSections = [...(profile.customSections || [])];
    const newItems = [...(newSections[sectionIdx].items || [])];
    newItems.push(val);
    newSections[sectionIdx] = { ...newSections[sectionIdx], items: newItems };
    syncProfile({ ...profile, customSections: newSections });
    setAddingTo(null);
  };

  const handleSaveCustomSectionTitle = (sectionIdx: number, val: string) => {
    if (!profile) return;
    const newSections = [...(profile.customSections || [])];
    newSections[sectionIdx] = { ...newSections[sectionIdx], name: val };
    syncProfile({ ...profile, customSections: newSections });
    setEditingItem(null);
  };

  const addNewCustomSection = () => {
    if (!profile) return;
    const newSections = [...(profile.customSections || [])];
    newSections.push({ name: 'New Section', items: [] });
    syncProfile({ ...profile, customSections: newSections });
  };

  const deleteCustomSection = (sectionIdx: number) => {
    if (!profile) return;
    const newSections = [...(profile.customSections || [])];
    newSections.splice(sectionIdx, 1);
    syncProfile({ ...profile, customSections: newSections });
  };

  const InlineInput = ({ onSave, onCancel, isContact, initialVal }: any) => {
    const [val, setVal] = useState(initialVal?.name || initialVal || '');
    const [phone, setPhone] = useState(initialVal?.phone || '');
    
    return (
      <div className="flex gap-2 w-full mt-2 bg-slate-50 p-2 rounded-xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2">
         {isContact ? (
            <div className="flex flex-col gap-2 flex-1">
              <input autoFocus className="auth-input py-2 text-[13px] bg-white w-full" placeholder="Contact Name" value={val} onChange={e=>setVal(e.target.value)} />
              <input className="auth-input py-2 text-[13px] bg-white w-full" placeholder="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
         ) : (
            <input autoFocus className="auth-input flex-1 py-1.5 text-[13px] bg-white" placeholder="Type here..." value={val} onChange={e=>setVal(e.target.value)} />
         )}
         <div className="flex flex-col gap-2">
           <button onClick={() => { if(val.trim()) onSave(isContact ? {name: val, phone, type: 'Emergency'} : val) }} className="bg-[#0062ff] text-white px-3 py-1.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-600 transition-colors h-full">Save</button>
           <button onClick={onCancel} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-slate-300 transition-colors max-h-[32px]">Cancel</button>
         </div>
      </div>
    )
  };

  if (!profile) return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
  );

  const dobAge = profile?.dob ? Math.floor((new Date().getTime() - new Date(profile.dob).getTime()) / 31557600000) : null;
  const displayAge = (dobAge !== null && !isNaN(dobAge)) ? dobAge : profile?.age;

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[400px] md:max-w-4xl flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-3">
            <img src={logo} alt="LifeTag" className="w-10 h-10 object-contain drop-shadow-sm" />
            <div>
              <h1 className="text-[17px] font-extrabold text-[#1f2937] leading-tight">Dashboard</h1>
              <p className="text-[12px] text-slate-500 font-medium">Your Profile</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => navigate('/public-profile')} className="w-[34px] h-[34px] rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors border border-slate-100">
              <Eye className="w-4 h-4 opacity-80" />
            </button>
            <button onClick={() => navigate('/settings')} className="w-[34px] h-[34px] rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors border border-slate-100">
              <Settings className="w-4 h-4 opacity-80" />
            </button>
          </div>
        </div>

        {/* Profile Info Card ported from lifeline */}
        <div className="template-card p-6 flex items-center gap-4 w-full mb-6 border border-white/60">
          <div className="w-16 h-16 bg-[#e8f2ff] rounded-2xl flex items-center justify-center border border-blue-100/50 shrink-0">
            <img src={medicalInfoShield} alt="Shield" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h2 className="font-extrabold text-[18px] text-[#1a1c1e]">
              {profile.fullName || 'Ahmed Hazem'}
            </h2>
             {profile.bloodType && (
               <span className="inline-block mt-2 px-3 py-1 rounded-full bg-red-50 text-red-500 text-[13px] font-bold border border-red-100">
                Blood Type: {profile.bloodType}
              </span>
            )}
            {displayAge !== undefined && displayAge !== null && displayAge !== '' && (
               <span className="inline-block mt-2 ml-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[13px] font-bold border border-blue-100">
                Age: {displayAge}
              </span>
            )}
            {linkedTag && (
               <span className="inline-block mt-2 ml-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[13px] font-bold border border-emerald-100 flex-items-center gap-1">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Sections Grid ported from lifeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
          
          {(profile.templateType === 'Medical' || !profile.templateType) && (
            <>
              {/* Medical Conditions */}
              <div className="clay-section p-5 w-full">
                  <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
                    Medical Conditions
                  </div>
                  <button onClick={() => setAddingTo('medicalConditions')} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 outline-none">
                    <Plus strokeWidth={2.5} size={16} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {addingTo === 'medicalConditions' && (
                    <div className="mb-3">
                      <InlineInput onSave={(v: string) => handleSaveAdd('medicalConditions', v)} onCancel={() => setAddingTo(null)} />
                    </div>
                  )}
                  {profile.medicalConditions?.length > 0 ? profile.medicalConditions.map((item: string, idx: number) => (
                    editingItem?.field === 'medicalConditions' && editingItem?.index === idx ? (
                       <InlineInput key={idx} initialVal={item} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} />
                    ) : (
                       <div key={idx} onClick={() => { setEditingItem({field: 'medicalConditions', index: idx}); setEditVal(item); }} className="flex justify-between items-center bg-[#f4f6fb] px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group">
                         {item} <button onClick={(e) => { e.stopPropagation(); removeItem('medicalConditions', idx); }} className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={12} /></button>
                       </div>
                    )
                  )) : (
                    <div className="text-center py-6">
                      <img src={medicalInfoShield} className="w-14 h-14 mx-auto mb-3 opacity-80" alt="Empty Shield" />
                      <p className="text-slate-400 text-[13px] font-medium">Add your first medical condition</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div className="clay-section p-5 w-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                    Medications
                  </div>
                  <button onClick={() => setAddingTo('medications')} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 outline-none">
                    <Plus strokeWidth={2.5} size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  {addingTo === 'medications' && (
                    <div className="mb-3">
                      <InlineInput onSave={(v: string) => handleSaveAdd('medications', v)} onCancel={() => setAddingTo(null)} />
                    </div>
                  )}
                  {profile.medications?.length > 0 ? profile.medications.map((item: string, idx: number) => (
                    editingItem?.field === 'medications' && editingItem?.index === idx ? (
                       <InlineInput key={idx} initialVal={item} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} />
                    ) : (
                       <div key={idx} onClick={() => { setEditingItem({field: 'medications', index: idx}); setEditVal(item); }} className="flex justify-between items-center bg-[#f4f6fb] px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group">
                         {item} <button onClick={(e) => { e.stopPropagation(); removeItem('medications', idx); }} className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={12} /></button>
                       </div>
                    )
                  )) : (
                     <div className="text-center py-6">
                      <p className="text-slate-400 text-[13px] font-medium mt-6">Add your first medication</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="clay-section p-5 w-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    Allergies
                  </div>
                  <button onClick={() => setAddingTo('allergies')} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 outline-none">
                    <Plus strokeWidth={2.5} size={16} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {addingTo === 'allergies' && (
                    <div className="mb-3">
                      <InlineInput onSave={(v: string) => handleSaveAdd('allergies', v)} onCancel={() => setAddingTo(null)} />
                    </div>
                  )}
                  {profile.allergies?.length > 0 ? profile.allergies.map((item: string, idx: number) => (
                    editingItem?.field === 'allergies' && editingItem?.index === idx ? (
                       <InlineInput key={idx} initialVal={item} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} />
                    ) : (
                       <div key={idx} onClick={() => { setEditingItem({field: 'allergies', index: idx}); setEditVal(item); }} className="flex justify-between items-center bg-[#f4f6fb] px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group">
                         {item} <button onClick={(e) => { e.stopPropagation(); removeItem('allergies', idx); }} className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={12} /></button>
                       </div>
                    )
                  )) : (
                     <div className="text-center py-6">
                      <p className="text-slate-400 text-[13px] font-medium mt-6">Add your first allergy</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Emergency Contacts */}
          {profile.templateType !== 'Custom' && (
          <div className="clay-section p-5 w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Emergency Contacts
              </div>
              <button onClick={() => setAddingTo('emergencyContacts')} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 outline-none">
                <Plus strokeWidth={2.5} size={16} />
              </button>
            </div>
            
            <div className="space-y-2">
              {addingTo === 'emergencyContacts' && (
                <div className="mb-3">
                  <InlineInput isContact={true} onSave={(v: any) => handleSaveAdd('emergencyContacts', v)} onCancel={() => setAddingTo(null)} />
                </div>
              )}
              {profile.emergencyContacts?.length > 0 ? profile.emergencyContacts.map((contact: any, idx: number) => (
                editingItem?.field === 'emergencyContacts' && editingItem?.index === idx ? (
                   <InlineInput key={idx} initialVal={contact} isContact={true} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} />
                ) : (
                   <div key={idx} onClick={() => { setEditingItem({field: 'emergencyContacts', index: idx}); setEditVal(contact); }} className="flex flex-col bg-[#f4f6fb] px-4 py-3 rounded-xl text-[13px] text-slate-600 relative pr-10 cursor-pointer hover:bg-slate-100 transition-colors group">
                     <span className="font-extrabold text-[#1a1c1e] text-[14px]">{contact.name}</span>
                     <span className="font-medium text-slate-500 mt-0.5">{contact.phone} {contact.type ? `• ${contact.type}` : ''}</span>
                     <button onClick={(e) => { e.stopPropagation(); removeItem('emergencyContacts', idx); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={12} /></button>
                   </div>
                )
              )) : (
                 <div className="text-center py-6">
                  <p className="text-slate-400 text-[13px] font-medium mt-6">Add your first emergency contact</p>
                </div>
              )}
            </div>
          </div>
          )}
          
          {/* Address */}
          {(profile.address || profile.templateType === 'Child') && profile.templateType !== 'Custom' && (
            <div className="clay-section p-5 w-full flex flex-col">
              <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px] mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Address
              </div>
              {addingTo === 'address' ? (
                <div className="flex flex-col gap-2 w-full flex-1 animate-in fade-in slide-in-from-top-2">
                  <textarea 
                    autoFocus 
                    className="auth-input min-h-[80px] w-full text-[13px] whitespace-pre-wrap flex-1" 
                    value={editVal} 
                    onChange={e => setEditVal(e.target.value)} 
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { syncProfile({...profile, address: editVal}); setAddingTo(null); }} className="bg-[#0062ff] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-600 transition-colors">Save Address</button>
                    <button onClick={() => setAddingTo(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-slate-300 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <div onClick={() => { setEditVal(profile.address || ''); setAddingTo('address'); }} className="flex-1 w-full bg-[#f4f6fb] rounded-xl outline-none p-4 text-[14px] leading-relaxed shadow-sm min-h-[80px] flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group text-center">
                  {profile.address ? (
                    <p className="font-semibold text-left w-full h-full text-[#1a1c1e] whitespace-pre-wrap flex items-center justify-start">{profile.address}</p>
                  ) : (
                     <p className="text-[13px] text-slate-400 font-medium group-hover:text-blue-500 transition-colors w-full h-full flex items-center justify-center">Add Address... Click to edit</p>
                  )}
                </div>
              )}
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
            <div key={`custom-${idx}`} className="clay-section p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <div onClick={() => { setEditingItem({field: 'custom-title', index: idx}); setEditVal(sec.name); }} className="flex items-center gap-2.5 font-bold text-slate-800 text-[16px] cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-md transition-colors -ml-2">
                  {getIconForTitle(editingItem?.field === 'custom-title' && editingItem.index === idx ? editVal : sec.name)}
                  {editingItem?.field === 'custom-title' && editingItem.index === idx ? (
                      <input 
                         autoFocus 
                         value={editVal}
                         onChange={e=>setEditVal(e.target.value)}
                         onBlur={() => handleSaveCustomSectionTitle(idx, editVal)}
                         onKeyDown={(e) => { if(e.key==='Enter') handleSaveCustomSectionTitle(idx, editVal); }}
                         className="auth-input py-1 text-[15px] max-w-[150px] bg-white text-slate-800 focus:outline-none" 
                      />
                  ) : sec.name}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setAddingTo(`custom-add-${idx}`)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors shrink-0 outline-none">
                    <Plus strokeWidth={2.5} size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCustomSection(idx); }} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 outline-none">
                    <X strokeWidth={2.5} size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {addingTo === `custom-add-${idx}` && (
                  <div className="mb-3">
                    <InlineInput onSave={(v: string) => handleSaveAddCustomItem(idx, v)} onCancel={() => setAddingTo(null)} />
                  </div>
                )}
                {sec.items?.length > 0 ? sec.items.map((item: string, itemIdx: number) => (
                  editingItem?.field === 'customSections' && (editingItem as any)?.sectionIdx === idx && editingItem?.index === itemIdx ? (
                     <InlineInput key={itemIdx} initialVal={item} onSave={handleSaveEdit} onCancel={() => setEditingItem(null)} />
                  ) : (
                     <div key={itemIdx} onClick={() => { setEditingItem({field: 'customSections', sectionIdx: idx, index: itemIdx} as any); setEditVal(item); }} className="flex justify-between items-center bg-[#f4f6fb] px-4 py-3 rounded-xl text-[14px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group">
                       {item} <button onClick={(e) => { e.stopPropagation(); removeCustomItem(idx, itemIdx); }} className="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100 shrink-0"><X size={12} /></button>
                     </div>
                  )
                )) : <p className="text-[13px] text-slate-400 font-medium text-center py-6">No items</p>}
              </div>
            </div>
          )})}

          {profile.templateType === 'Custom' && (
             <div onClick={addNewCustomSection} className="clay-section p-5 w-full border-2 border-dashed border-blue-200 bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors min-h-[140px] shadow-none group">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Plus strokeWidth={2.5} size={20} />
                </div>
                <span className="text-[14px] font-bold text-blue-600">Add a new section</span>
             </div>
          )}

        </div>

        {/* Notes */}
        {profile.templateType !== 'Custom' && (
        <div className="template-card p-5 w-full flex flex-col border border-white/60">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2.5 font-bold text-slate-800 text-[15px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Notes
            </div>
          </div>
          {addingTo === 'notes' ? (
            <div className="flex flex-col gap-2 w-full h-full animate-in fade-in slide-in-from-top-2">
              <textarea 
                autoFocus 
                className="auth-input min-h-[100px] w-full text-[13px] whitespace-pre-wrap" 
                value={editVal} 
                onChange={e => setEditVal(e.target.value)} 
              />
              <div className="flex gap-2">
                <button onClick={() => { syncProfile({...profile, notes: editVal}); setAddingTo(null); }} className="bg-[#0062ff] text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-blue-600 transition-colors">Save Notes</button>
                <button onClick={() => setAddingTo(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm hover:bg-slate-300 transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <div onClick={() => { setEditVal(profile.notes || ''); setAddingTo('notes'); }} className="h-full bg-white/60 rounded-[12px] border border-white/80 outline-none p-4 text-[13px] text-slate-600 shadow-sm min-h-[100px] flex items-center justify-center cursor-pointer hover:bg-white transition-colors group">
              {profile.notes ? (
                <p className="font-medium text-left w-full h-full text-slate-600 whitespace-pre-wrap">{profile.notes}</p>
              ) : (
                 <p className="text-slate-400 font-medium group-hover:text-blue-500 transition-colors">Additional notes... Click to edit</p>
              )}
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
}
