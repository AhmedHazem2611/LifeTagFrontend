import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, X, Menu,  } from 'lucide-react';

export default function CustomTemplateBuilder() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [sections, setSections] = useState<{name: string, items: string[]}[]>([]);
  const [newSectionName, setNewSectionName] = useState('');

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, { name: newSectionName.trim(), items: [] }]);   
      setNewSectionName('');
    }
  };

  const handleAddItem = (sectionIndex: number) => {
    const val = window.prompt("Enter item value:");
    if (val && val.trim() !== '') {
      const newSections = [...sections];
      newSections[sectionIndex].items.push(val);
      setSections(newSections);
    }
  };

  const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {       
    const newSections = [...sections];
    newSections[sectionIndex].items.splice(itemIndex, 1);
    setSections(newSections);
  };

  const handleSave = async () => {
    if (!fullName) {
      alert("Please enter a profile name");
      return;
    }

    try {
      await fetch('https://life-tag-backend-ahmedrashed2611-5674s-projects.vercel.app/api/save-medical-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: 'Custom',
          fullName: fullName,
          customSections: sections
        }),
      });
      navigate('/pin-protection');
    } catch (e) {
      navigate('/pin-protection');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans relative overflow-hidden pb-32">
      <div className="max-w-md mx-auto px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-10">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-500">
            <X size={18} />
          </button>
          <Shield size={32} className="text-blue-500 bg-blue-50 p-1.5 rounded-full" />
        </div>

        <div className="flex gap-1.5 mb-6 justify-center">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Custom Template Builder</h2>
        <p className="text-xs text-gray-500 text-center mb-6 px-2">
          Create custom sections and add fields to each one
        </p>

        {/* Profile Name Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-1">Profile Name / Title</label>
          <input
            type="text"
            placeholder="e.g. John's Pet, or My Custom Tracker"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Add Section Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New section name..."
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none"
          />
          <button
            onClick={handleAddSection}
            className="w-11 h-11 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-blue-600"
          >
            <Plus size={20} />
          </button>
        </div>

        {sections.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">Add your first section above to get started</p>
        ) : (
          <div className="flex flex-col gap-4">
            {sections.map((sec, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Menu size={16} className="text-gray-400" />
                  <h3 className="font-bold text-gray-800 text-sm flex-1">{sec.name}</h3>
                  <button onClick={() => setSections(sections.filter((_, i) => i !== idx))} className="text-red-400 bg-red-50 rounded-full p-1"><X size={14} /></button>
                </div>
                {sec.items.length > 0 && (
                  <div className="flex flex-col gap-2 mb-2 ml-6">
                    {sec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between items-center bg-gray-50 px-3 py-1.5 rounded-lg text-xs text-gray-600 border border-gray-100">
                        {item} <button onClick={() => handleRemoveItem(idx, itemIdx)} className="text-red-400 bg-red-50 rounded-full p-0.5"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-gray-50 pt-2 ml-6">
                  <button onClick={() => handleAddItem(idx)} className="flex items-center text-xs text-blue-500 hover:text-blue-700 font-medium">
                    <Plus size={12} className="mr-1" /> Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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

