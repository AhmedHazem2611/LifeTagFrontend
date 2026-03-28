import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, X } from 'lucide-react';

export default function ChildInfo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    templateType: 'Child',
    fullName: '',
    age: '',
    address: '',
    notes: '',
    emergencyContacts: [] as any[]
  });

  const handleAddContact = () => {
    const val = window.prompt("Enter Parent Contact Name (e.g. Dad - 010...):");
    if (val && val.trim() !== '') {
      setFormData({
         ...formData,
         emergencyContacts: [...formData.emergencyContacts, { name: val, type: 'parent', phone: '' }]
      });
    }
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleSave = async () => {
    let userName = 'Medical Profile';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
        }
    } catch(q) {}

    const payload = { ...formData, fullName: userName };

    try {
      await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      navigate('/pin-protection');
    } catch (e) {
      navigate('/pin-protection');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#f8fbff] h-screen relative">
      <div className="w-full h-full overflow-y-auto p-6 pb-32 no-scrollbar">    
        <div className="mt-4 mb-4 flex justify-center">
          <Shield size={32} className="text-blue-500 bg-blue-50 p-1.5 rounded-full" />
        </div>

        <div className="flex gap-1.5 mb-6 justify-center">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 text-center mb-6">Child Information</h2>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Child Name</label>
            <input
              type="text"
              placeholder="e.g John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})} 
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Contact Numbers</label>
            {formData.emergencyContacts.length > 0 && (
               <div className="flex flex-col gap-2 mb-2">
                 {formData.emergencyContacts.map((contact, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg text-xs text-gray-600 border border-gray-100">
                      {contact.name} <button onClick={() => handleRemoveContact(idx)} className="text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                    </div>
                 ))}
               </div>
            )}
            <button onClick={handleAddContact} className="flex items-center text-xs text-blue-500 hover:text-blue-700 font-medium">
               <Plus size={14} className="mr-1" /> Add Contact
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Address</label>
            <textarea
              placeholder="Home address..."
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Any additional notes..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#f8fbff] via-[#f8fbff] to-transparent">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-white text-gray-700 font-medium py-3 rounded-2xl border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium py-3 rounded-2xl shadow-md hover:from-blue-500 hover:to-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
