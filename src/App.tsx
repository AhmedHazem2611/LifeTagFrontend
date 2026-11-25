import { BrowserRouter, Routes, Route, Outlet, useSearchParams } from 'react-router-dom';
import PIN from './pages/PIN';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MedicalInfo from './pages/MedicalInfo';
import PinProtection from './pages/PinProtection';
import GuardianOnboarding from './pages/GuardianOnboarding';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import PublicProfile from './pages/PublicProfile';
import LinkTag from './pages/LinkTag';
import LocationHistory from './pages/LocationHistory';
import QRHandler from './pages/QRHandler';
import AdminPanel from './pages/AdminPanel';
import EmergencyChat from './pages/EmergencyChat';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import StolenBracelet from './pages/StolenBracelet';

function AppContainer() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
      <Outlet />
    </div>
  );
}

function RootEntry() {
  const [searchParams] = useSearchParams();
  const hasTagQuery = Boolean(searchParams.get('code')?.trim() || searchParams.get('guid')?.trim());

  if (hasTagQuery) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
        <QRHandler />
      </div>
    );
  }

  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f8fbff] text-gray-900 font-sans flex flex-col">
        <Routes>
          <Route path="/" element={<RootEntry />} />
          <Route path="/home" element={<LandingPage />} />

          <Route element={<AppContainer />}>
            <Route path="/t/:code" element={<QRHandler />} />
            <Route path="/pin" element={<PIN />} />
            <Route path="/pin/:code" element={<PIN />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/medical-info" element={<MedicalInfo />} />
            <Route path="/pin-protection" element={<PinProtection />} />
            <Route path="/guardian-onboarding" element={<GuardianOnboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/public-profile" element={<PublicProfile />} />
            <Route path="/public-profile/:guid" element={<PublicProfile />} />
            <Route path="/link-tag" element={<LinkTag />} />
            <Route path="/location-history" element={<LocationHistory />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/emergency-chat/:sessionId" element={<EmergencyChat />} />
            <Route path="/stolen-or-missing" element={<StolenBracelet />} />
            <Route path="/stolen" element={<StolenBracelet />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/:code" element={<QRHandler />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
