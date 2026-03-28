import { useNavigate } from 'react-router-dom';
import { Shield, Baby, LayoutTemplate } from 'lucide-react';

export default function ChooseTemplate() {
  const navigate = useNavigate();

  const handleSelect = (template: string) => {
    if (template === 'medical') {
      navigate('/medical-info');
    } else if (template === 'child') {
      navigate('/child-info');
    } else if (template === 'custom') {
      navigate('/custom-template');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 items-center bg-[#f8fbff] pb-24 overflow-y-auto">
      <div className="mt-4 mb-4 flex justify-center">
        <Shield size={32} className="text-blue-500 bg-blue-50 p-1.5 rounded-full" />
      </div>

      <div className="flex gap-1.5 mb-6">
        <div className="w-8 h-1.5 bg-blue-500 rounded-full"></div>
        <div className="w-8 h-1.5 bg-blue-200 rounded-full"></div>
        <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-1.5 bg-gray-200 rounded-full"></div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-1">Choose a Template</h2>
      <p className="text-xs text-gray-500 text-center mb-6">
        Select the type of emergency profile to create
      </p>

      <div className="flex flex-col gap-4 w-full">
        {/* Medical Data Card */}
        <div 
          onClick={() => handleSelect('medical')}
          className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:border-blue-200"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
            <Shield className="text-red-400" size={32} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Medical Data</h3>
          <p className="text-[10px] text-gray-500 text-center mb-3 px-2">
            Blood type, conditions, medications, allergies & emergency contacts
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Blood Type</span>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Medical Conditions</span>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Medications</span>
          </div>
        </div>

        {/* Lost Child Card */}
        <div 
          onClick={() => handleSelect('child')}
          className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:border-orange-200"
        >
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3">
            <Baby className="text-orange-400" size={32} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Lost Child</h3>
          <p className="text-[10px] text-gray-500 text-center mb-3 px-2">
            Child info, parent contacts, and address for quick reunification
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Child Name</span>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Age</span>
            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-1 rounded-md font-medium">Parent Contacts</span>
          </div>
        </div>

        {/* Custom Template Card */}
        <div 
          onClick={() => handleSelect('custom')}
          className="bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:border-teal-200"
        >
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-3">
            <LayoutTemplate className="text-teal-400" size={32} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm mb-1">Custom Template</h3>
          <p className="text-[10px] text-gray-500 text-center mb-3 px-2">
            Build your own sections and fields from scratch
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 w-full px-6 left-0">
        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-white text-gray-700 font-medium py-3.5 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
