import { useState, useEffect } from 'react';
import { Tag, Users, Trash2, Unlink, Shield, ShieldOff, RotateCcw, ExternalLink, User as UserIcon, X, KeyRound, Copy, Check, UserCheck, UserX } from 'lucide-react';
import logo from '../assets/logo.png';

interface AdminTag {
    id: number;
    guid: string;
    shortCode: string;
    pin: string;
    isActive: boolean;
    isPinProtected: boolean;
    linkedUserId: number | null;
    linkedUserName: string | null;
    hasGuardian?: boolean;
    guardianName?: string | null;
}

interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    linkedTagGuid: string | null;
    linkedTagShortCode: string | null;
}

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'tags' | 'users'>('tags');
    const [tags, setTags] = useState<AdminTag[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [editingPinTag, setEditingPinTag] = useState<AdminTag | null>(null);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');
    const [pinSaving, setPinSaving] = useState(false);
    const [copiedTagId, setCopiedTagId] = useState<number | null>(null);

    const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'tags' ? 'tags' : 'users';
            const res = await fetch(`${API_URL}/api/admin/${endpoint}`);
            const data = await res.json();
            if (activeTab === 'tags') setTags(data);
            else setUsers(data);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSystem = async () => {
        setResetLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/reset-system`, { method: 'POST' });
            if (res.ok) {
                setShowResetModal(false);
                fetchData();
                alert("System Reset Successful!");
            }
        } catch (error) {
            alert("Reset failed. Check console.");
        } finally {
            setResetLoading(false);
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user? All profile data will be lost.")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const handleUnlinkTag = async (id: number) => {
        const tag = tags.find(t => t.id === id);
        if (!tag) return;
        if (!confirm("Unlink this bracelet from the user?")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/tags/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tag, linkedUserId: null })
            });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const handleTogglePin = async (id: number) => {
        const tag = tags.find(t => t.id === id);
        if (!tag) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/tags/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...tag, isPinProtected: !tag.isPinProtected })
            });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const handleDeleteTag = async (id: number) => {
        if (!confirm("Delete this tag record? GUID and PIN will be removed from database.")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/tags/${id}`, { method: 'DELETE' });
            if (res.ok) fetchData();
        } catch (error) { console.error(error); }
    };

    const openEditPinModal = (tag: AdminTag) => {
        setEditingPinTag(tag);
        setPinInput(tag.pin);
        setPinError('');
    };

    const handleSavePin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPinTag || pinSaving) return;

        const trimmed = pinInput.trim();
        if (!/^[a-zA-Z0-9]{4,12}$/.test(trimmed)) {
            setPinError("PIN must be 4 to 12 letters or numbers.");
            return;
        }

        setPinSaving(true);
        setPinError('');
        try {
            const res = await fetch(`${API_URL}/api/admin/tags/${editingPinTag.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editingPinTag, pin: trimmed })
            });
            if (res.ok) {
                setEditingPinTag(null);
                fetchData();
            } else {
                const err = await res.json().catch(() => null);
                setPinError(err?.message || "Failed to update PIN.");
            }
        } catch (error) {
            console.error(error);
            setPinError("Network error while updating PIN.");
        } finally {
            setPinSaving(false);
        }
    };

    const handleCopyShortUrl = async (tag: AdminTag) => {
        const shortUrl = `${window.location.origin}/${tag.shortCode || tag.guid}`;
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopiedTagId(tag.id);
            setTimeout(() => setCopiedTagId(null), 1800);
        } catch (error) {
            console.error("Failed to copy URL:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <img src={logo} alt="LifeTag" className="w-14 h-14 object-contain drop-shadow-sm" />
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Console</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Development Utility Panel</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all border border-red-100 shadow-sm active:scale-95 w-full md:w-auto"
                >
                    <RotateCcw size={18} />
                    Reset System
                </button>
            </div>

            {/* Tabs & Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex gap-2 bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-fit backdrop-blur-sm border border-slate-200/50">
                    <button 
                        onClick={() => setActiveTab('tags')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-[13px] transition-all ${activeTab === 'tags' ? 'bg-white text-[#0062ff] shadow-md shadow-blue-100/50 border border-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                    >
                        <Tag size={16} />
                        Bracelets
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-[13px] transition-all ${activeTab === 'users' ? 'bg-white text-[#0062ff] shadow-md shadow-blue-100/50 border border-blue-50' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                    >
                        <Users size={16} />
                        Users
                    </button>
                </div>
            </div>

            {/* Content Table Container */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden flex-1 flex flex-col min-h-[400px]">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-100 border-b-blue-500"></div>
                        <span className="text-slate-400 font-bold text-sm tracking-wide">Syncing Data...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    {activeTab === 'tags' ? (
                                        <>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Bracelet Info</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Linked To</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Security Status</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">User Identity</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Active Bracelet</th>
                                            <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'tags' ? (
                                    tags.length > 0 ? tags.map(tag => (
                                        <tr key={tag.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    {tag.shortCode && (
                                                        <span className="font-mono text-[14px] text-[#0062ff] bg-blue-50 px-2.5 py-0.5 rounded-lg font-black tracking-wider border border-blue-100">
                                                            {tag.shortCode}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleCopyShortUrl(tag)}
                                                        title="Copy short QR link"
                                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-[#0062ff] px-2 py-0.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        {copiedTagId === tag.id ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                                                        {copiedTagId === tag.id ? 'Copied' : 'Copy URL'}
                                                    </button>
                                                </div>
                                                <div className="font-mono text-[11px] text-slate-400 font-medium tracking-tight mt-1">{tag.guid}</div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider">PIN: {tag.pin}</span>
                                                    <button
                                                        onClick={() => openEditPinModal(tag)}
                                                        title="Edit PIN"
                                                        className="text-[11px] font-bold text-[#0062ff] hover:underline inline-flex items-center gap-1"
                                                    >
                                                        <KeyRound size={12} /> Edit
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {tag.linkedUserName ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-black text-xs">
                                                            {tag.linkedUserName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-extrabold text-slate-800 text-[14px]">{tag.linkedUserName}</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 text-xs font-black uppercase tracking-widest italic">Available</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {tag.isActive ? (
                                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-green-100 shadow-sm shadow-green-100/50">Active</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-lg border border-slate-100">Pending</span>
                                                    )}
                                                    {tag.isPinProtected && (
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 flex items-center gap-1.5 shadow-sm shadow-blue-100/50">
                                                            <Shield size={11} strokeWidth={3} /> Guarded
                                                        </span>
                                                    )}
                                                    {tag.hasGuardian === true ? (
                                                        <span
                                                            title={tag.guardianName ? `Guardian: ${tag.guardianName}` : 'Guardian Linked'}
                                                            className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black uppercase rounded-lg border border-purple-100 flex items-center gap-1.5 shadow-sm shadow-purple-100/50"
                                                        >
                                                            <UserCheck size={11} strokeWidth={3} /> Guardian
                                                        </span>
                                                    ) : tag.hasGuardian === false ? (
                                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100 flex items-center gap-1.5">
                                                            <UserX size={11} strokeWidth={3} /> No Guardian
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditPinModal(tag)} title="Edit PIN" className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                        <KeyRound size={18} />
                                                    </button>
                                                    <button onClick={() => handleTogglePin(tag.id)} title="Toggle PIN Protection" className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                                        {tag.isPinProtected ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                    </button>
                                                    {tag.linkedUserId && (
                                                        <button onClick={() => handleUnlinkTag(tag.id)} title="Unlink User" className="p-2.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                                                            <Unlink size={18} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteTag(tag.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="p-20 text-center font-bold text-slate-300">No Tags Found</td></tr>
                                    )
                                ) : (
                                    users.length > 0 ? users.map(user => (
                                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center">
                                                        <UserIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-800 text-[15px]">{user.fullName}</div>
                                                        <div className="text-[12px] text-slate-400 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {user.linkedTagGuid ? (
                                                    <div className="font-mono text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-slate-600 font-bold tracking-tight shadow-sm inline-block">
                                                        {user.linkedTagShortCode || `${user.linkedTagGuid.substring(0, 18)}...`}
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-300 text-xs font-black uppercase tracking-widest italic">No Link</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {user.linkedTagGuid && (
                                                        <button onClick={() => window.open(`/public-profile/${user.linkedTagShortCode || user.linkedTagGuid}`, '_blank')} title="Open Preview" className="p-2.5 text-slate-400 hover:text-[#0062ff] hover:bg-blue-50 rounded-xl transition-all">
                                                            <ExternalLink size={18} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteUser(user.id)} title="Delete User" className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="p-20 text-center font-bold text-slate-300">No Users Found</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit PIN Modal */}
            {editingPinTag && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <form
                        onSubmit={handleSavePin}
                        className="bg-white rounded-[36px] p-8 max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/50 animate-in zoom-in-95 duration-300 relative"
                    >
                        <button
                            type="button"
                            onClick={() => setEditingPinTag(null)}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-blue-50 text-[#0062ff] rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-sm">
                            <KeyRound size={28} strokeWidth={2.5} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight mb-1">Edit Bracelet PIN</h2>
                        <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider mb-6">
                            Bracelet {editingPinTag.shortCode || editingPinTag.guid}
                        </p>

                        <div className="mb-4">
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                                New PIN (4–12 letters or numbers)
                            </label>
                            <input
                                type="text"
                                value={pinInput}
                                onChange={(e) => {
                                    setPinInput(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
                                    setPinError('');
                                }}
                                maxLength={12}
                                autoFocus
                                placeholder="e.g. A7K9 or 1234"
                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-lg font-bold tracking-widest text-slate-800 focus:outline-none focus:border-[#0062ff] focus:bg-white transition-all"
                            />
                        </div>

                        {pinError && (
                            <div className="mb-4 bg-red-50 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-100">
                                {pinError}
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setEditingPinTag(null)}
                                className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={pinSaving}
                                className="flex-1 px-6 py-3.5 bg-[#0062ff] text-white font-black rounded-2xl hover:bg-[#0052d6] shadow-lg shadow-blue-200/60 transition-all uppercase text-xs tracking-widest disabled:opacity-50"
                            >
                                {pinSaving ? 'Saving...' : 'Save PIN'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/50 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <button onClick={() => setShowResetModal(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <X size={20} />
                        </button>

                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[28px] flex items-center justify-center mb-8 mx-auto shadow-sm shadow-red-100">
                            <RotateCcw size={36} strokeWidth={2.5} />
                        </div>
                        
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Factory Reset?</h2>
                            <p className="text-slate-500 text-[15px] leading-relaxed">
                                This will PERMANENTLY delete <span className="font-black text-red-500 underline decoration-2 underline-offset-4">ALL user accounts and profile data</span>.
                            </p>
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Tags will remain but become inactive
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowResetModal(false)}
                                className="flex-1 px-8 py-5 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-all active:scale-[0.98] uppercase text-xs tracking-widest"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleResetSystem}
                                disabled={resetLoading}
                                className="flex-1 px-8 py-5 bg-red-500 text-white font-black rounded-3xl hover:bg-red-600 shadow-xl shadow-red-200/50 transition-all active:scale-[0.98] uppercase text-xs tracking-widest disabled:opacity-50"
                            >
                                {resetLoading ? 'Cleaning...' : 'Confirm Reset'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
