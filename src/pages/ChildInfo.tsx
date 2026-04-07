import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function ChildInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    address: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }],
    notes: ''
  });

  const [uiState, setUiState] = useState({ showContacts: false });

  // Simulate remote loading
  useEffect(() => {
    // In a real app we might fetch child info here, 
    // but we can skip if the backend currently just overwrites.
    setTimeout(() => { setLoading(false); }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [name]: value };
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = userStr && user ? (user.id || user._id) : "temp-user";

    let userName = formData.fullName || 'Child Profile';
    
    // As per backend parsing: req.body.templateType === 'Child' extracts req.body.dob, req.body.notes, req.body.emergencyContacts
    const payload = { 
        userId: userId, 
        templateType: "Child", 
        fullName: userName,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
        notes: formData.notes,
        emergencyContacts: formData.emergencyContacts
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/save-medical-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSuccess(true);
      setTimeout(() => {
          setSuccess(false);
          // Proceed to next step in onboarding
          navigate('/pin-protection'); 
      }, 1500);
    } catch (error) {
      console.error("Error saving child info:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  const onFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[400px] md:max-w-[480px] flex flex-col items-center transition-all duration-300">
        
        <div className="mb-6 flex justify-center mt-4">
          <img src={logo} alt="LifeTag Logo" className="w-28 h-28 object-contain drop-shadow-sm" />
        </div>

        <div className="flex gap-2 w-full max-w-xs mx-auto mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              {i <= 2 && (
                <div
                  className="h-full rounded-full animate-[pulse_1s_ease-in-out_1]"
                  style={{
                    background: 'linear-gradient(333deg, hsl(216 100% 43%) 0%, hsl(196 93% 76%) 100%)',
                    width: '100%'
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight mb-6">Lost Child Information</h2>

        <div className="w-full bg-white rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(150,170,200,0.1)] border border-slate-50">
          <form onSubmit={handleSubmit} onKeyDown={onFormKeyDown} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Child Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g Tommy Doe"
                  className="auth-input w-full"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      className="auth-input bg-white w-full pr-10"
                      style={{ WebkitAppearance: 'none' }}
                      value={formData.dob}
                      onChange={handleChange as any}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Gender</label>
                  <select
                    name="gender"
                    className="auth-input bg-white w-full"
                    value={formData.gender}
                    onChange={handleChange as any}
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Address</label>
              <textarea
                name="address"
                placeholder="Residential address for reunification..."
                className="auth-input min-h-[60px]"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2">
              <label className="block text-[13px] font-medium text-slate-800 mb-1 ml-1">Parent & Emergency Contacts</label>
              {!uiState.showContacts && formData.emergencyContacts[0]?.name === '' ? (
                <button type="button" onClick={() => setUiState(p => ({...p, showContacts: true}))} className="text-[#0062ff] focus:outline-none text-[13px] font-semibold flex items-center gap-1.5 hover:underline ml-1 mt-1">
                  <Plus strokeWidth={3} className="w-3.5 h-3.5" /> Add Contact
                </button>
              ) : (
                <div className="flex flex-col gap-3 mt-1">
                  {formData.emergencyContacts.map((c, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 bg-slate-50/70 border border-slate-100 rounded-xl relative shadow-sm">
                       {i > 0 && <button type="button" onClick={() => setFormData(p => ({...p, emergencyContacts: p.emergencyContacts.filter((_,idx) => idx !== i)}))} className="absolute -top-2 -right-2 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 p-1 font-bold transition-colors">&times;</button>}
                       <input type="text" name="name" value={c.name} onChange={e => handleContactChange(i, e)} className="auth-input bg-white text-[13px] w-full" placeholder="Parent / Contact Name" />
                       <div className="flex gap-3 w-full">
                         <input type="text" name="relation" value={c.relation} onChange={e => handleContactChange(i, e)} className="auth-input bg-white text-[13px] w-1/2" placeholder="Relation (e.g Mother)" />
                         <input type="text" name="phone" value={c.phone} onChange={e => handleContactChange(i, e)} className="auth-input bg-white text-[13px] w-1/2" placeholder="Phone" />
                       </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setFormData(p => ({...p, emergencyContacts: [...p.emergencyContacts, {name:'', phone:'', relation:''}]}))} className="text-slate-400 text-[12px] font-semibold text-left ml-1 hover:text-slate-600 mt-1 flex items-center gap-1">
                     <Plus strokeWidth={3} className="w-3 h-3" /> Add Another Contact
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 mb-4">
              <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Additional Notes</label>
              <textarea
                name="notes"
                placeholder="Any special instructions or critical info..."
                className="auth-input min-h-[90px]"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4 w-full mt-4 md:mt-2">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="clay-button-white w-1/4"
              >
                Back
              </button>
              
              <button 
                type="submit" 
                disabled={saving} 
                className="clay-button w-3/4"
              >
                {saving ? '...' : (success ? 'Saved!' : 'Continue')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
