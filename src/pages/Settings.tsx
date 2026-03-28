import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Layout, LogOut, Watch } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Settings() {
  const navigate = useNavigate();
  const [pinEnabled, setPinEnabled] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [linkedTag, setLinkedTag] = useState<any>(null);

  useEffect(() => {
    let userName = 'Unknown User';
    let userEmail = '';
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.fullName) userName = parsed.fullName;
            if (parsed && parsed.email) userEmail = parsed.email;
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
          setProfile({ ...data.profile, fullName: data.profile.fullName || userName, email: userEmail });
          setPinEnabled(!!data.profile.isPinProtected);
        } else {
            setProfile({ fullName: userName, email: userEmail });
        }
      })
      .catch(() => {
          setProfile({ fullName: userName, email: userEmail });
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#f8fbff] h-full relative">
      <div className="w-full h-full overflow-y-auto p-5 pb-24 no-scrollbar flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 mt-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Settings</h1>
        </div>

        <div className="flex flex-col gap-4">
          
          {/* Account */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
              <User size={16} className="text-blue-500" /> Account
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1 ml-1">Name</label>
              <input type="text" value={profile?.fullName || "Loading..."} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 mb-1 ml-1">Email</label>
              <input type="email" value={profile?.email || ""} readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none" />
            </div>
            <div className="flex justify-between items-center text-sm text-gray-700 font-medium">
              <span>PIN Protection</span>
              <div 
                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${pinEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => setPinEnabled(!pinEnabled)}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${pinEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
              <Layout size={16} className="text-blue-500" /> Template
            </div>
            <div className="flex justify-between items-center text-xs text-gray-700 font-medium">
              <span>Current Template</span>
              <span className="text-blue-600 font-semibold">{profile?.templateType || 'Medical'}</span>
            </div>
            <button onClick={() => navigate('/choose-template')} className="text-left text-xs text-blue-500 font-medium">Change Template &gt;</button>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                  <Watch size={16} className="text-blue-500" /> My Tags
                </div>
                {linkedTag && (
                  <button onClick={() => navigate('/link-tag')} className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                    + Add Another
                  </button>
                )}
              </div>
              
              {linkedTag ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl transition-all">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800">{linkedTag.type || 'Smart Bracelet'}</span>
                    <span className="text-xs text-green-600 font-medium mt-0.5 flexItems-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span> Active - ID: {linkedTag.id}
                    </span>
                  </div>
                  <button onClick={() => { localStorage.removeItem('linkedTag'); setLinkedTag(null); }} className="text-xs text-red-500 font-semibold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">
                    Unlink
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('/link-tag')} className="bg-blue-50 text-blue-600 font-semibold py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition text-sm">
                  + Link New Tag
                </button>
              )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 w-full px-5 left-0">
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-gradient-to-t from-red-500 to-red-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg border border-red-600 flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
    </div>
  );
}

