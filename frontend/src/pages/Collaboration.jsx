import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
    LogOut, LayoutDashboard, Brain, Target,
    AlertTriangle, FileText, Loader2, BookOpen,
    Download, Share2, Upload, Plus, MessageSquare,
    Search, Filter, ExternalLink, Megaphone, Clock, Sparkles, Send, X
} from 'lucide-react';

const Collaboration = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('materials'); // 'materials' or 'notices'
    const [materials, setMaterials] = useState([]);
    const [notices, setNotices] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');

    // AI Q&A State
    const [showAI, setShowAI] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [aiQuestion, setAiQuestion] = useState('');
    const [aiAnswer, setAiAnswer] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    // Upload Form State
    const [showUpload, setShowUpload] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        category: 'Notes',
        subject_id: '',
        description: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matRes, noticeRes, subRes] = await Promise.all([
                    client.get('/collaboration/materials'),
                    client.get('/collaboration/notifications'),
                    client.get('/students/subjects')
                ]);
                setMaterials(matRes.data);
                setNotices(noticeRes.data);
                setSubjects(subRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAskAI = async (e) => {
        e.preventDefault();
        if (!aiQuestion.trim() || !selectedMaterial) return;

        setAiLoading(true);
        setAiAnswer('');
        try {
            const res = await client.post('/collaboration/ai/ask', {
                material_id: selectedMaterial.id,
                question: aiQuestion
            });
            setAiAnswer(res.data.answer);
        } catch (err) {
            setAiAnswer("Sorry, I couldn't reach the AI at the moment. Please verify the backend is running and the API key is set.");
        } finally {
            setAiLoading(false);
        }
    };

    const openAIModal = (material) => {
        setSelectedMaterial(material);
        setShowAI(true);
        setAiQuestion('');
        setAiAnswer('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', newMaterial.title);
        formData.append('category', newMaterial.category);
        formData.append('subject_id', newMaterial.subject_id);
        formData.append('description', newMaterial.description);

        try {
            const res = await client.post('/collaboration/materials', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMaterials([res.data, ...materials]);
            setShowUpload(false);
            setNewMaterial({ title: '', category: 'Notes', subject_id: '', description: '' });
            setSelectedFile(null);
        } catch (err) {
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (id, filename) => {
        window.open(`https://edunexus-backend-f3n5.onrender.com/api/v1/collaboration/materials/${id}/download`);
    };

    const handleShare = (material) => {
        if (navigator.share) {
            navigator.share({
                title: material.title,
                text: `Check out this ${material.category} on EduNexus AI!`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
            </div>
        );
    }

    const initials = user?.name
        ? user.name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <div className="w-68 glass-dark text-white p-6 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Brain className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">EduNexus AI</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" href="/predictions" />
                    <SidebarLink icon={<MessageSquare size={20} />} label="Collaboration" href="/collaboration" active />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" href="/burnout" />
                    <SidebarLink icon={<BookOpen size={20} />} label="Curriculum" href="/curriculum" />
                </nav>

                <button
                    onClick={logout}
                    className="mt-auto flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all font-semibold border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Collaborative Hub</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Share materials and stay updated with campus news</p>
                    </div>
                    <div className="flex items-center gap-5 glass p-3 rounded-2xl shadow-sm pr-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            {initials}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">{user?.name || 'Student'}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID: {user?.roll_number || '—'}</p>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('materials')}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTab === 'materials' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
                    >
                        <FileText size={18} /> Resource Library
                    </button>
                    <button
                        onClick={() => setActiveTab('notices')}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${activeTab === 'notices' ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
                    >
                        <Megaphone size={18} /> Notice Board
                    </button>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="ml-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95"
                    >
                        <Plus size={18} /> Share Material
                    </button>
                </div>

                {activeTab === 'materials' ? (
                    <div className="space-y-6 animate-slide-up">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Notes', 'Lab', 'Assignments', 'PrevPapers'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterCategory === cat ? 'bg-primary-500 text-white border-primary-500 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Materials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {materials.filter(m => filterCategory === 'All' || m.category === filterCategory).map(mat => (
                                <div key={mat.id} className="glass group p-6 rounded-3xl border border-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${mat.category === 'Lab' ? 'bg-emerald-50 text-emerald-600' : mat.category === 'Notes' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleDownload(mat.id)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Download">
                                                <Download size={18} />
                                            </button>
                                            <button onClick={() => handleShare(mat)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500" title="Share">
                                                <Share2 size={18} />
                                            </button>
                                            <button onClick={() => openAIModal(mat)} className="p-2 hover:bg-primary-100 rounded-lg text-primary-500 font-bold flex items-center gap-1" title="Ask AI">
                                                <Sparkles size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{mat.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">{mat.description || 'No description provided.'}</p>

                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-xs font-black text-primary-600 bg-primary-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                                            {mat.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            <Clock size={12} /> {new Date(mat.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl space-y-6 animate-slide-up">
                        {notices.map(notice => (
                            <div key={notice.id} className={`p-8 rounded-3xl border-l-8 shadow-sm ${notice.priority === 'High' || notice.priority === 'Urgent' ? 'bg-red-50/30 border-red-500 outline outline-red-100/50' : 'bg-white border-primary-500 border shadow-slate-100'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-slate-800">{notice.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${notice.priority === 'Urgent' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {notice.priority}
                                    </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 font-medium text-lg">{notice.content}</p>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(notice.created_at).toLocaleString()}</span>
                                    <span className="text-slate-200">|</span>
                                    <span className="text-primary-600">{notice.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Modal */}
                {showUpload && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="glass w-full max-w-lg p-8 rounded-3xl shadow-2xl relative animate-scale-up">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Upload className="text-emerald-500" /> Share New Material
                            </h2>
                            <form onSubmit={handleUpload} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                    <input
                                        required
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                                        placeholder="Experiment 5 - Chemical Kinetics"
                                        value={newMaterial.title}
                                        onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold"
                                            value={newMaterial.category}
                                            onChange={e => setNewMaterial({ ...newMaterial, category: e.target.value })}
                                        >
                                            <option>Notes</option>
                                            <option>Lab</option>
                                            <option>Assignments</option>
                                            <option>PrevPapers</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-primary-600"
                                            value={newMaterial.subject_id}
                                            onChange={e => setNewMaterial({ ...newMaterial, subject_id: e.target.value })}
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px] font-medium"
                                        placeholder="Add any details about this resource..."
                                        value={newMaterial.description}
                                        onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select File</label>
                                    <input
                                        type="file"
                                        required
                                        onChange={e => setSelectedFile(e.target.files[0])}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpload(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={uploading}
                                        className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 active:scale-95 flex justify-center items-center"
                                    >
                                        {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Start Sharing'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* AI Q&A Modal */}
                {showAI && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="glass w-full max-w-2xl flex flex-col h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border-white">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary-500 p-2 rounded-xl text-white shadow-lg shadow-primary-200">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">AI Study Assistant</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Discussing: {selectedMaterial?.title}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowAI(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                                {aiAnswer ? (
                                    <div className="animate-fade-in">
                                        <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm relative">
                                            <div className="absolute -left-2 top-0 text-slate-100"><MessageSquare fill="currentColor" size={24} /></div>
                                            <div className="prose prose-slate max-w-none text-slate-700 font-medium whitespace-pre-wrap">
                                                {aiAnswer}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                                        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-2">
                                            <Brain size={40} className="opacity-20" />
                                        </div>
                                        <p className="text-slate-400 font-bold text-lg">Ask me anything about this document.<br /><span className="text-sm font-medium opacity-60">I've analyzed the content for you.</span></p>
                                    </div>
                                )}
                                {aiLoading && (
                                    <div className="flex items-center gap-3 animate-pulse">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                            <Loader2 size={16} className="animate-spin text-primary-500" />
                                        </div>
                                        <p className="text-sm font-bold text-primary-600 italic">Gemini is thinking...</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100">
                                <form onSubmit={handleAskAI} className="relative">
                                    <input
                                        autoFocus
                                        className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-2 focus:ring-primary-500 outline-none font-medium text-slate-700 shadow-inner"
                                        placeholder="Explain the main conclusion of these notes..."
                                        value={aiQuestion}
                                        onChange={e => setAiQuestion(e.target.value)}
                                        disabled={aiLoading}
                                    />
                                    <button
                                        type="submit"
                                        disabled={aiLoading || !aiQuestion.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {aiLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const SidebarLink = ({ icon, label, active = false, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold ${active
        ? 'bg-primary-500/15 text-primary-400 shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}>
        <span className={`${active ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-400 transition-colors'}`}>
            {icon}
        </span>
        {label}
    </a>
);

export default Collaboration;
