import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Send, ArrowLeft, MoreVertical, ShieldAlert, HeartPulse, ExternalLink } from 'lucide-react';
import { emergencyApi } from '../api/emergencyApi';
import type { EmergencySessionResponse, EmergencyMessageResponse } from '../api/emergencyApi';

const TILE_SIZE = 256;
const MAP_ZOOM = 16;

function getTileData(lat: number, lng: number) {
  const n = Math.pow(2, MAP_ZOOM);
  const xFloat = ((lng + 180) / 360) * n;
  const latRad = (lat * Math.PI) / 180;
  const yFloat =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  const tileX = Math.floor(xFloat);
  const tileY = Math.floor(yFloat);
  const fracX = xFloat - tileX;
  const fracY = yFloat - tileY;

  return {
    tileX,
    tileY,
    pinPxX: (2 + fracX) * TILE_SIZE,
    pinPxY: (1 + fracY) * TILE_SIZE,
    n,
  };
}

export default function EmergencyChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<EmergencySessionResponse | null>(null);
  const [messages, setMessages] = useState<EmergencyMessageResponse[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const chatScrollRef = useRef<HTMLElement>(null);
  const prevMessagesRef = useRef<EmergencyMessageResponse[]>([]);
  const hasInitializedMessagesRef = useRef(false);
  const forceScrollNextRef = useRef(false);

  useEffect(() => {
    const prev = prevMessagesRef.current;
    const hasNewMessages =
      messages.length > prev.length ||
      (messages.length > 0 &&
        prev.length > 0 &&
        messages[messages.length - 1].id !== prev[prev.length - 1].id);

    if (!hasInitializedMessagesRef.current) {
      if (messages.length > 0) {
        hasInitializedMessagesRef.current = true;
      }
      prevMessagesRef.current = messages;
      return;
    }

    if (forceScrollNextRef.current || hasNewMessages) {
      const el = chatScrollRef.current;
      const isNearBottom =
        !el || el.scrollHeight - el.scrollTop - el.clientHeight < 140;

      if (el && (forceScrollNextRef.current || isNearBottom)) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
      forceScrollNextRef.current = false;
    }

    prevMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!sessionId || sessionId === 'undefined') {
      setIsLoading(false);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;

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
          const incoming: EmergencyMessageResponse[] = messagesRes.data;
          setMessages((current) => {
            if (
              current.length === incoming.length &&
              (incoming.length === 0 ||
                current[current.length - 1]?.id === incoming[incoming.length - 1]?.id)
            ) {
              return current;
            }
            return incoming;
          });
        }
      } catch (e) {
        console.error('Error fetching session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
    intervalId = setInterval(fetchSession, 3000);

    return () => clearInterval(intervalId);
  }, [sessionId, navigate]);

  const handleSendMessage = async () => {
    if (!message.trim() || !session || isSending) return;

    setIsSending(true);
    try {
      const res = await emergencyApi.sendMessage(session.id, 'Responder', 'Responder (You)', message.trim());
      if (res.success && res.data) {
        forceScrollNextRef.current = true;
        setMessages((prev) => [...prev, res.data]);
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
    <div className="fixed inset-0 flex items-center justify-center bg-[#f8fbff]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm tracking-tight">Initializing Secure Session...</p>
      </div>
    </div>
  );

  if (!session || !session.id) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-[#f8fbff] text-center">
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

  const getCoordinates = () => {
    const lat = parseFloat(String(session.latitude));
    const lng = parseFloat(String(session.longitude));
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
    return { lat, lng };
  };

  const coords = getCoordinates();
  const mapsUrl = coords
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords.lat.toFixed(6))},${encodeURIComponent(coords.lng.toFixed(6))}`
    : null;
  const tileData = coords ? getTileData(coords.lat, coords.lng) : null;

  return (
    <div className="fixed inset-0 h-[100dvh] max-h-[100dvh] w-full z-40 flex flex-col bg-[#f8fbff] font-body overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-red-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />

      {/* Header (pinned at top) */}
      <header className="shrink-0 relative z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
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

      {/* Scrollable Conversation Area */}
      <main ref={chatScrollRef} className="flex-1 min-h-0 w-full overflow-y-auto overscroll-contain px-4 md:px-6 py-6 flex flex-col items-center relative z-10">
        <div className="w-full max-w-2xl flex flex-col gap-5">
          {/* Verified Emergency Location Map Card */}
          {mapsUrl && tileData ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-[24px] overflow-hidden border-2 border-slate-800/80 shadow-[0_12px_30px_rgba(15,23,42,0.14)] bg-[#2b2e33] group transition-transform active:scale-[0.99]"
            >
              <div className="relative w-full h-[180px] overflow-hidden bg-[#2b2e33]">
                {/* 5x3 Esri Dark Gray tile grid centered on exact GPS coordinates */}
                <div
                  className="absolute grid grid-cols-5 pointer-events-none select-none"
                  style={{
                    width: `${5 * TILE_SIZE}px`,
                    height: `${3 * TILE_SIZE}px`,
                    left: `calc(50% - ${tileData.pinPxX}px)`,
                    top: `calc(50% - ${tileData.pinPxY}px)`,
                  }}
                >
                  {[-1, 0, 1].map((dy) =>
                    [-2, -1, 0, 1, 2].map((dx) => {
                      const x = (((tileData.tileX + dx) % tileData.n) + tileData.n) % tileData.n;
                      const y = tileData.tileY + dy;
                      return (
                        <div key={`${dx}_${dy}`} className="relative w-[256px] h-[256px]">
                          <img
                            src={`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${MAP_ZOOM}/${y}/${x}`}
                            alt=""
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                            className="w-[256px] h-[256px] block"
                            draggable={false}
                          />
                          <img
                            src={`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/${MAP_ZOOM}/${y}/${x}`}
                            alt=""
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                            className="w-[256px] h-[256px] block absolute inset-0"
                            draggable={false}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Centered Red Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.65)]">
                  <div className="w-9 h-9 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white shadow-lg">
                    <MapPin size={18} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 py-3 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      Verified Emergency Location
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">
                      Tap to open in Google Maps
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-black/50 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
                    <span>{formatTime(session.createdAt)}</span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              </div>
            </a>
          ) : (
            <div className="clay-card p-5 bg-white/70 backdrop-blur-md border border-white flex items-center gap-3">
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl">
                <MapPin size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Emergency Location</h2>
                <p className="text-[12px] text-slate-400 font-semibold italic">Location unavailable</p>
              </div>
            </div>
          )}

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
          </div>
        </div>
      </main>

      {/* Footer Composer (stays fixed at bottom of viewport) */}
      <footer className="shrink-0 relative z-20 p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-slate-100/80">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/85 backdrop-blur-xl border border-white p-3 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center gap-3">
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
