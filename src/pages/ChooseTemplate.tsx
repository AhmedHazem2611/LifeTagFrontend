import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import medicalImage from '../assets/Medical Data.svg';
import childImage from '../assets/Lost Child.svg';
import customImage from '../assets/Custom Template.svg';

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
    <div className="flex-1 flex flex-col items-center p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[400px] md:max-w-4xl flex flex-col items-center">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center mt-4">
          <img src={logo} alt="LifeTag Logo" className="w-28 h-28 object-contain drop-shadow-sm" />
        </div>

        {/* Progress Bar (from lifeline-tag-aid reference) */}
        <div className="flex gap-2 w-full max-w-xs mx-auto mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              {i <= 1 && (
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

        {/* Headers */}
        <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight mb-2">Choose a Template</h2>
        <p className="text-[13px] text-[#64748b] mb-8 text-center px-4 font-medium">
          Select the type of emergency profile to create
        </p>

        {/* Template Cards Context */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Medical Data Card */}
          <div 
            onClick={() => handleSelect('medical')}
            className="template-card p-6 cursor-pointer hover:-translate-y-1 transition-all text-center h-full flex flex-col items-center w-full"
          >
            <img src={medicalImage} alt="Medical Data" className="w-24 h-24 object-contain mb-4 drop-shadow-sm" />
            <h3 className="font-bold text-[#1e293b] text-[15px] mb-1">Medical Data</h3>
            <p className="text-[#64748b] text-xs mb-3 px-2 leading-relaxed">
              Blood type, conditions, medications, allergies & emergency contacts
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
              {['Blood Type', 'Medical Conditions', 'Medications', 'Allergies', 'Emergency Contacts'].map(f => (
                <span key={f} className="text-[10px] px-3 py-1.5 rounded-full bg-[#0062ff]/10 text-[#0062ff] font-semibold">{f}</span>
              ))}
            </div>
          </div>

          {/* Lost Child Card */}
          <div 
            onClick={() => handleSelect('child')}
            className="template-card p-6 cursor-pointer hover:-translate-y-1 transition-all text-center h-full flex flex-col items-center w-full"
          >
            <img src={childImage} alt="Lost Child" className="w-24 h-24 object-contain mb-4 drop-shadow-sm" />
            <h3 className="font-bold text-[#1e293b] text-[15px] mb-1">Lost Child</h3>
            <p className="text-[#64748b] text-xs mb-3 px-2 leading-relaxed">
              Child info, parent contacts, and address for quick reunification
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
              {['Child Name', 'Age', 'Parent Contacts', 'Address'].map(f => (
                <span key={f} className="text-[10px] px-3 py-1.5 rounded-full bg-[#0062ff]/10 text-[#0062ff] font-semibold">{f}</span>
              ))}
            </div>
          </div>

          {/* Custom Template Card */}
          <div 
            onClick={() => handleSelect('custom')}
            className="template-card p-6 cursor-pointer hover:-translate-y-1 transition-all text-center h-full flex flex-col items-center w-full"
          >
            <img src={customImage} alt="Custom Template" className="w-24 h-24 object-contain mb-4 drop-shadow-sm" />
            <h3 className="font-bold text-[#1e293b] text-[15px] mb-1">Custom Template</h3>
            <p className="text-[#64748b] text-xs mb-3 px-2 leading-relaxed">
              Build your own sections and fields from scratch
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
              {['Custom Sections', 'Custom Fields'].map(f => (
                <span key={f} className="text-[10px] px-3 py-1.5 rounded-full bg-[#0062ff]/10 text-[#0062ff] font-semibold">{f}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="w-full mt-10 flex justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="clay-button-white px-12"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
}
