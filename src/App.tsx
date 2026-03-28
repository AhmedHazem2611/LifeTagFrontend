import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PIN from './pages/PIN';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ChooseTemplate from './pages/ChooseTemplate';
import MedicalInfo from './pages/MedicalInfo';
import ChildInfo from './pages/ChildInfo';
import CustomTemplateBuilder from './pages/CustomTemplateBuilder';
import PinProtection from './pages/PinProtection';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import PublicProfile from './pages/PublicProfile';
import LinkTag from './pages/LinkTag';
import LocationHistory from './pages/LocationHistory';

function App() {
  return (
    <BrowserRouter>
      {/* Outer wrapper - dark background for presentation */}
      <div className="flex items-center justify-center bg-[#1c1c1e] min-h-screen font-sans py-10">
        
        {/* Mobile Device Frame */}
        <div className="w-[390px] h-[844px] bg-[#f8fbff] relative shadow-2xl rounded-[3rem] border-[8px] border-black overflow-hidden flex flex-col text-gray-900 ring-4 ring-gray-800">
          
          {/* Simulated Notch / Dynamic Island */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
            <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
          </div>

          {/* Simulated Status Bar Text (Time / Battery inside real apps) */}
          <div className="absolute top-1 left-6 z-50 pointer-events-none text-[10px] font-bold text-black opacity-80 mt-1">9:41</div>
          <div className="absolute top-1 right-6 z-50 pointer-events-none text-[10px] font-bold text-black opacity-80 mt-1 flex items-center gap-1">
            <div className="w-4 h-2.5 border border-black rounded-[3px] relative after:content-[''] after:absolute after:right-[-3px] after:top-[2px] after:h-1 after:w-0.5 after:bg-black after:rounded-r-sm"><div className="bg-black w-full h-full rounded-[1px]"></div></div>
          </div>

          <div className="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar pt-8 flex flex-col relative w-full h-full">
            <Routes>
              <Route path="/" element={<Navigate to="/pin" replace />} />
              <Route path="/pin" element={<PIN />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/choose-template" element={<ChooseTemplate />} />
              <Route path="/medical-info" element={<MedicalInfo />} />
              <Route path="/child-info" element={<ChildInfo />} />
              <Route path="/custom-template" element={<CustomTemplateBuilder />} />
              <Route path="/pin-protection" element={<PinProtection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/public-profile" element={<PublicProfile />} />              <Route path="/link-tag" element={<LinkTag />} />
              <Route path="/location-history" element={<LocationHistory />} />            </Routes>
          </div>
        </div>

        {/* Floating Credit Badge */}
        <div className="fixed bottom-6 right-8 lg:bottom-10 lg:right-10 z-50 group">
          {/* Animated glow effect behind the badge */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
          
          {/* Actual Badge */}
          <div className="relative flex items-center gap-2.5 bg-[#121212] px-6 py-3 rounded-full border border-gray-800/80 shadow-2xl transform group-hover:-translate-y-1 transition-all duration-300 cursor-default">
            {/* Heart Icon Beating */}
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </div>
            
            <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">Created By</span>
            <span className="text-sm font-black bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">ERROR</span>
          </div>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
