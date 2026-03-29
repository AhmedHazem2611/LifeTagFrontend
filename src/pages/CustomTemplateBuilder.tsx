import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// Inline TagInput mimicking MedicalInfo's behavior
const TagInput = ({ label, items, onChange }: { label: string, items: string[], onChange: (newItems: string[]) => void }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onChange([...items, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="pt-2">
      <label className="block text-[13px] font-medium text-slate-800 mb-2 ml-1">{label}</label>
      
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 px-1">
          {items.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-1.5 bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-[13px] shadow-sm animate-in fade-in zoom-in duration-200">
              <span className="font-medium">{tag}</span>
              <button type="button" onClick={() => removeTag(idx)} className="text-slate-400 hover:text-red-500 focus:outline-none transition-colors">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          className="auth-input bg-white w-full text-[13px]"
          placeholder={`Add ${label.toLowerCase()}... (press Enter)`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={() => {
            if (inputValue.trim()) {
              onChange([...items, inputValue.trim()]);
              setInputValue('');
            }
          }}
          className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-[13px] transition-colors border border-slate-200"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default function CustomTemplateBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [sections, setSections] = useState<{name: string, items: string[]}[]>([]);
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 500);
  }, []);

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, { name: newSectionName.trim(), items: [] }]);   
      setNewSectionName('');
    }
  };

  const handleUpdateSectionItems = (sectionIndex: number, newItems: string[]) => {
    const newSections = [...sections];
    newSections[sectionIndex].items = newItems;
    setSections(newSections);
  };

  const removeSection = (sectionIndex: number) => {
    setSections(sections.filter((_, idx) => idx !== sectionIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      alert("Please enter a Profile Name.");
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/save-medical-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: "temp-user",
          templateType: 'Custom',
          fullName: fullName,
          customSections: sections
        })
      });

      setSuccess(true);
      setTimeout(() => {
          setSuccess(false);
          navigate('/pin-protection'); 
      }, 1500);
    } catch (error) {
      console.error("Error saving custom template:", error);
    } finally {
      setSaving(false);
    }
  };

  const onFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Prevent form submission on enter for input fields
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

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

        <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight mb-2">Custom Builder</h2>
        <p className="text-xs text-slate-500 text-center mb-6 px-2">
          Design your own tracking layout block by block
        </p>

        <div className="w-full bg-white rounded-[24px] p-6 shadow-[0px_10px_30px_rgba(150,170,200,0.1)] border border-slate-50">
          <form onSubmit={handleSubmit} onKeyDown={onFormKeyDown} className="flex flex-col gap-4">
            
            <div className="mb-2">
              <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">Profile Category / Title</label>
              <input
                type="text"
                placeholder="e.g. Pet Care, Travel Kit"
                className="auth-input w-full"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>

            <div className="h-px w-full bg-slate-100 my-2"></div>

            <div className="flex flex-col gap-5">
              {sections.map((sec, idx) => (
                <div key={idx} className="relative p-5 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-[14px]">{sec.name}</h3>
                    <button type="button" onClick={() => removeSection(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-slate-100">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <TagInput 
                    label="Items" 
                    items={sec.items} 
                    onChange={(newItems) => handleUpdateSectionItems(idx, newItems)} 
                  />
                </div>
              ))}
            </div>

            <div className="mt-2 p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
               <label className="block text-[13px] font-medium text-slate-700 mb-2 ml-1">Create Block</label>
               <div className="flex gap-2">
                 <input
                   type="text"
                   placeholder="Section Name (e.g Vaccinations)"
                   className="auth-input bg-white w-full text-[13px]"
                   value={newSectionName}
                   onChange={e => setNewSectionName(e.target.value)}
                 />
                 <button
                   type="button"
                   onClick={handleAddSection}
                   className="px-4 py-2 bg-blue-50 text-[#0062ff] font-semibold rounded-xl text-[13px] hover:bg-blue-100 transition-colors border border-blue-100 flex items-center gap-1 shrink-0"
                 >
                   <Plus className="w-4 h-4" /> Add
                 </button>
               </div>
            </div>

            <div className="flex gap-4 w-full mt-6 md:mt-4">
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
