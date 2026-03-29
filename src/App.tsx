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
      {/* Root Layout */}
      <div className="min-h-screen bg-[#f8fbff] text-gray-900 font-sans flex flex-col">
        
        {/* Responsive Content Container */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
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
          <Route path="/public-profile" element={<PublicProfile />} />
          <Route path="/link-tag" element={<LinkTag />} />
          <Route path="/location-history" element={<LocationHistory />} />
        </Routes>
      </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
