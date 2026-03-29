import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function LocationHistory() {
  const navigate = useNavigate();

  // Mock location data
  const locations = [
    { id: 1, address: 'Alexandria, Cairo Desert Road', date: 'Oct 24, 2023 at 4:32 PM', status: 'Recent' },
    { id: 2, address: 'Sporting, Alexandria', date: 'Oct 23, 2023 at 11:15 AM', status: 'Viewed' },
    { id: 3, address: 'San Stefano Mall, Alex', date: 'Oct 20, 2023 at 8:40 PM', status: 'Viewed' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#f8fbff] h-full relative">
      <div className="w-full h-full overflow-y-auto p-5 flex flex-col no-scrollbar">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-2">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 shadow-sm">
               <ArrowLeft size={16} />
             </button>
             <h1 className="text-lg font-bold text-gray-800">Scan History</h1>
          </div>
        </div>

        {/* Map Mockup */}
        <div className="w-full h-48 bg-gray-200 rounded-3xl mb-6 relative overflow-hidden shadow-inner border border-gray-200 flex items-center justify-center">
            {/* Fake map via CSS pattern */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center animate-pulse absolute"></div>
               <MapPin size={32} className="text-red-500 drop-shadow-md z-10 -mt-2" />
            </div>

            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/40 shadow-sm">
                <span className="text-[10px] font-bold text-gray-800">Latest: Alex Desert Rd.</span>
            </div>
        </div>

        {/* History List */}
        <h2 className="text-sm font-bold text-gray-800 mb-3 ml-1">Recent Scans</h2>
        <div className="flex flex-col gap-3">
           {locations.map((loc, i) => (
             <div key={loc.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i === 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                  <MapPin size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-bold text-gray-800 leading-tight pr-2">{loc.address}</h3>
                    {i === 0 && <span className="bg-red-100 text-red-600 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">New</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Clock size={10} />
                    <span>{loc.date}</span>
                  </div>
                </div>
                <button className="text-blue-500 bg-blue-50 p-2 rounded-xl">
                  <ExternalLink size={14} />
                </button>
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}