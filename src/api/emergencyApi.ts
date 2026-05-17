const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export type EmergencySessionResponse = {
  id: number;
  tagId: number;
  tagGuid?: string;
  status: 'Pending' | 'Acknowledged' | 'Closed' | 'Expired';
  latitude: number;
  longitude: number;
  createdAt: string;
  acknowledgedAt?: string;
  guardianName?: string;
};

export type EmergencyMessageResponse = {
  id: number;
  sessionId: number;
  senderType: string;
  senderName: string;
  content: string;
  createdAt: string;
};

export const emergencyApi = {
  triggerEmergency: async (tagGuid: string, latitude: number, longitude: number) => {
    const res = await fetch(`${API_URL}/api/emergency/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tagGuid, latitude, longitude }),
    });
    return res.json();
  },

  getSessionDetails: async (sessionId: number) => {
    const res = await fetch(`${API_URL}/api/emergency/session/${sessionId}`);
    return res.json();
  },

  getMessages: async (sessionId: number) => {
    const res = await fetch(`${API_URL}/api/emergency/${sessionId}/messages`);
    return res.json();
  },

  sendMessage: async (sessionId: number, senderType: string, senderName: string, content: string) => {
    const res = await fetch(`${API_URL}/api/emergency/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, senderType, senderName, content }),
    });
    return res.json();
  }
};
