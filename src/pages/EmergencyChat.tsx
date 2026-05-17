import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Send, ArrowLeft, MoreVertical, ShieldAlert, HeartPulse } from 'lucide-react';
import { emergencyApi } from '../api/emergencyApi';
import type { EmergencySessionResponse, EmergencyMessageResponse } from '../api/emergencyApi';

export default function EmergencyChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<EmergencySessionResponse | null>(null);
  const [messages, setMessages] = useState<EmergencyMessageResponse[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!sessionId || sessionId === 'undefined') {
      setIsLoading(false);
      return;
    }

    let intervalId: any;

    const fetchSession = async () => {
      try {
        const id = parseInt(sessionId);
        if (isNaN(id)) {
          setIsLoading(false);
          return;
        }

        const [sessionRes, messagesRes] = await Promise.all([
          emergencyApi.getSessionDetails(id),
          emergencyApi.getMessages(id)
        ]);

        if (sessionRes.success && sessionRes.data) {
          setSession(sessionRes.data);
          
          if (sessionRes.data.status === 'Closed' || sessionRes.data.status === 'Expired') {
            clearInterval(intervalId);
            if (sessionRes.data.tagGuid) {
              navigate(`/public-profile/${sessionRes.data.tagGuid}`);
            } else {
              navigate('/');
            }
          }
        }

        if (messagesRes.success && messagesRes.data) {
          setMessages(messagesRes.data);
        }
      } catch (e) {
        console.error('Error fetching session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession(); // initial fetch
    intervalId = setInterval(fetchSession, 3000); // poll every 3 seconds

    return () => clearInterval(intervalId);
  }, [sessionId, navigate]);

  const handleSendMessage = async () => {
    if (!message.trim() || !session || isSending) return;
    
    setIsSending(true);
    try {
      const res = await emergencyApi.sendMessage(session.id, 'Responder', 'Responder (You)', message.trim());
      if (res.success && res.data) {
        setMessages(prev => [...prev, res.data]);
        setMessage('');
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-[#f8fbff] min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm tracking-tight">Initializing Secure Session...</p>
      </div>
    </div>
  );

  if (!session || !session.id) return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f8fbff] min-h-screen text-center">
      <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-8 rounded-[40px] border border-slate-50 flex flex-col items-center">
        <div className="bg-red-50 text-red-500 p-5 rounded-[24px] mb-6 shadow-inner">
          <ShieldAlert size={48} strokeWidth={2} />
        </div>
        <h2 className="text-[24px] font-black text-slate-900 mb-2 tracking-tight">Session Unavailable</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-[280px] leading-relaxed">
          This emergency session may have expired or the secure link is no longer valid.
        </p>
        <button 
          onClick={() => navigate('/')} 
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-[20px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  const generateMapsUrl = () => {
    if (!session) return null;
    const lat = parseFloat(String(session.latitude));
    const lng = parseFloat(String(session.longitude));
    
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
      console.warn("Generated Google Maps URL: Coordinates are invalid or 0,0");
      return null;
    }
    
    // Force decimal formatting using '.' (never locale commas)
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    
    const encodedLat = encodeURIComponent(latStr);
    const encodedLng = encodeURIComponent(lngStr);
    
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedLat},${encodedLng}`;
    console.log("Generated Google Maps URL:", url);
    return url;
  };

  const mapsUrl = generateMapsUrl();

  return (
    <div className="flex-1 flex flex-col bg-[#f8fbff] min-h-screen font-body relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-red-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/80 hover:bg-white rounded-[18px] transition-all text-slate-500 shadow-sm border border-slate-100/50"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[16px] font-black text-slate-900 leading-tight flex items-center gap-2">
              Emergency Contact <HeartPulse size={16} className="text-red-500 animate-pulse" />
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
               <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.1em]">
                 Live with {session.guardianName || 'Guardian'}
               </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-slate-300 hover:text-slate-500 transition-colors">
            <MoreVertical size={22} />
          </button>
        </div>
      </header>

      {/* Conversation Wrapper */}
      <main className="flex-1 pt-24 pb-32 px-6 flex flex-col items-center overflow-y-auto">
        
        <div className="w-full max-w-2xl flex flex-col gap-6">
          
          {/* Enhanced Clay Location Card */}
          <div className="clay-card p-6 bg-white/60 backdrop-blur-md border border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <MapPin size={80} strokeWidth={1} />
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="bg-red-50 text-red-500 p-4 rounded-[22px] mb-4 shadow-[inset_0_2px_10px_rgba(239,68,68,0.1)]">
                <MapPin size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-[15px] font-black text-slate-900 mb-2 uppercase tracking-tight">Verified Emergency Location</h2>
              <p className="text-[13px] text-slate-500 font-medium mb-6 leading-relaxed max-w-[280px]">
                Current responder location is securely shared for immediate assistance.
              </p>
              {mapsUrl ? (
                <div className="flex flex-col items-center gap-2 w-full">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    CLICK TO OPEN MAPS
                  </span>
                  <a 
                    href={mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[12px] text-blue-600 font-bold hover:underline break-all text-center max-w-full px-4"
                  >
                    {mapsUrl}
                  </a>
                </div>
              ) : (
                <span className="text-[12px] text-slate-400 font-semibold italic">
                  Location unavailable
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-center">
             <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-[0.3em] py-2 px-6 bg-slate-50 rounded-full border border-slate-100">
                End-to-End Encrypted
             </span>
          </div>

          {/* Chat Bubbles Container */}
          <div className="flex flex-col gap-4">
            
            {/* System Message */}
            <div className="flex flex-col items-center text-center px-8 py-2">
               <p className="text-[12px] text-slate-400 font-medium leading-relaxed italic">
                 Security Alert: Guardian "{session.guardianName || 'Emergency Guardian'}" has joined the session and is reviewing the medical profile.
               </p>
            </div>

            {messages.map((msg) => {
              const isResponder = msg.senderType === 'Responder';
              return (
                <div key={msg.id} className={`flex flex-col ${isResponder ? 'items-end ml-auto' : 'items-start'} max-w-[85%] group`}>
                  <div className={`p-4 rounded-[24px] shadow-[0_10px_20px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.03)] transition-all ${isResponder ? 'bg-gradient-to-tr from-blue-600 to-blue-500 text-white rounded-br-[6px]' : 'bg-white border border-slate-50 text-slate-700 rounded-bl-[6px]'}`}>
                    <p className="text-[14px] font-medium leading-relaxed break-words whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                  <span className={`text-[10px] text-slate-300 font-bold mt-2 ${isResponder ? 'mr-2' : 'ml-2'} uppercase tracking-wider`}>
                    {msg.senderName} • {formatTime(msg.createdAt)}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

        </div>

      </main>

      {/* Soft Clay Message Composer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 pb-8 md:pb-10">
        <div className="max-w-2xl mx-auto">
           <div className="bg-white/80 backdrop-blur-xl border border-white p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-[#f8fbff] border-none rounded-[24px] px-6 py-4 text-[15px] font-medium placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)]"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
                className={`p-4 rounded-[22px] shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center ${message.trim() && !isSending ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                {isSending ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={22} strokeWidth={2.5} />}
              </button>
           </div>
        </div>
      </footer>

    </div>
  );
}
