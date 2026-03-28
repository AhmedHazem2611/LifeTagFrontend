import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Save, Heart, Syringe, Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MedicalInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    emergencyContacts: [
      { name: '', phone: '', relation: '' }
    ],
    notes: ''
  });

  useEffect(() => {
    // Mock user
    const userId = "temp-user";
    const fetchMedicalInfo = async () => {
      try {
        const response = await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/medical-data/' + userId);
        if (response.ok) {
          const data = await response.json();
          if (data && data.data) {
             setFormData({
                bloodType: data.data.bloodType || '',
                allergies: data.data.allergies || '',
                medications: data.data.medications || '',
                conditions: data.data.conditions || '',
                emergencyContacts: data.data.emergencyContacts?.length ? data.data.emergencyContacts : [{ name: '', phone: '', relation: '' }],
                notes: data.data.notes || ''
             });
          }
        }
      } catch (error) {
        console.error("Error fetching medical info: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [name]: value };
    setFormData(prev => ({ ...prev, emergencyContacts: newContacts }));
  };

  const addContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relation: '' }]
    }));
  };

  const removeContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSaving(true);
    setSuccess(false);

    let userName = 'Medical Profile';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
        }
    } catch(q) {}

    try {
      await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: "temp-user", templateType: "Medical", data: formData, fullName: userName })
      });

      setSuccess(true);
      setTimeout(() => {
          setSuccess(false);
          navigate('/pin-protection'); // Move to next step
      }, 1500);
    } catch (error) {
      console.error("Error saving medical info:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fbff] flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans pb-8">
      <div className="bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm sticky top-0 z-10 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border border-gray-100 rounded-full hover:bg-gray-50">
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <h1 className="text-sm font-bold text-gray-800">Medical ID</h1>
        <div className="w-9 h-9"></div>
      </div>
      
      <div className="px-5">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">
            This information will be displayed to first responders when your LifeTag is scanned.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Vital Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors text-sm text-gray-800 bg-white"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., Peanuts, Penicillin, Bee stings"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors text-sm text-gray-800 min-h-[80px]"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <Syringe className="w-4 h-4 mr-2 text-blue-500" />
              Medical Conditions & Medications
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
              <textarea
                name="conditions"
                value={formData.conditions}
                onChange={handleChange}
                placeholder="e.g., Asthma, Type 1 Diabetes"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm text-gray-800 min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="List current medications and dosages"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm text-gray-800 min-h-[80px]"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-green-500" />
              Emergency Contacts
            </h2>
            
            <div className="space-y-4">
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="p-4 border border-gray-100 bg-gray-50 rounded-lg space-y-3 relative">
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeContact(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Plus className="w-4 h-4 transform rotate-45" />
                    </button>
                  )}
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Relation</label>
                      <input
                        type="text"
                        name="relation"
                        value={contact.relation}
                        onChange={(e) => handleContactChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        placeholder="Spouse"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(index, e)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addContact}
              className="w-full py-2.5 flex items-center justify-center text-sm font-medium text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Another Contact
            </button>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Medical Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalInfo;
