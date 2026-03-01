import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Brain, Target, LayoutDashboard, AlertTriangle, FileText, BookOpen, LogOut, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

const Predictions = () => {
    const { user, logout } = useAuth();
    const [form, setForm] = useState({
        skill_readiness_score: '',
        project_count: '',
        internship_status: false,
        internship_type: 'Technical', // New field
        internship_duration: '3', // New field (months)
        communication_rating: '',
        core_subject_marks: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await client.post('/predictions/predict-placement', {
                skill_readiness_score: parseFloat(form.skill_readiness_score),
                project_count: parseInt(form.project_count),
                internship_status: form.internship_status,
                internship_type: form.internship_type,
                internship_duration: parseInt(form.internship_duration),
                communication_rating: parseFloat(form.communication_rating),
                core_subject_marks: parseFloat(form.core_subject_marks),
            });
            setResult(res.data);
        } catch (err) {
            setError('Failed to compute prediction. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <div className="w-68 glass-dark text-white p-6 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="bg-emerald-500 p-2 rounded-lg"><Brain className="text-white w-6 h-6" /></div>
                    <h2 className="text-xl font-bold tracking-tight">EduNexus AI</h2>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" href="/predictions" active />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" href="/burnout" />
                    <SidebarLink icon={<FileText size={20} />} label="Faculty Reports" href="/reports" />
                    <SidebarLink icon={<BookOpen size={20} />} label="Curriculum" href="/curriculum" />
                </nav>
                <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all font-semibold border border-transparent hover:border-red-500/20">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Placement Prediction</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Calculate your placement probability score</p>
                    </div>
                    <div className="flex items-center gap-4 glass p-3 rounded-2xl shadow-sm pr-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">{initials}</div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">{user?.name || 'Student'}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID: {user?.roll_number || '—'}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Academic Profile</h2>
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {[
                                { label: 'Skill Readiness Score (0–100)', name: 'skill_readiness_score', placeholder: 'e.g. 72.5' },
                                { label: 'Number of Projects', name: 'project_count', placeholder: 'e.g. 3' },
                                { label: 'Communication Rating (0–10)', name: 'communication_rating', placeholder: 'e.g. 7.5' },
                                { label: 'Core Subject Marks (0–100)', name: 'core_subject_marks', placeholder: 'e.g. 78' },
                            ].map(({ label, name, placeholder }) => (
                                <div key={name}>
                                    <label className="text-sm font-semibold text-slate-600 block mb-1">{label}</label>
                                    <input
                                        type="number"
                                        name={name}
                                        required
                                        step="any"
                                        placeholder={placeholder}
                                        value={form[name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    />
                                </div>
                            ))}
                            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="internship_status" checked={form.internship_status} onChange={handleChange} className="w-5 h-5 rounded accent-indigo-600" />
                                    <span className="text-sm font-bold text-slate-700">I have completed an internship</span>
                                </label>

                                {form.internship_status && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Internship Type</label>
                                            <select
                                                name="internship_type"
                                                value={form.internship_type}
                                                onChange={handleChange}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                            >
                                                <option value="Technical">Technical/IT</option>
                                                <option value="Research">Research</option>
                                                <option value="Industrial">Industrial (Core)</option>
                                                <option value="Corporate">Corporate/Mgmt</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Duration (Months): {form.internship_duration}</label>
                                            <input
                                                type="range"
                                                name="internship_duration"
                                                min="1"
                                                max="12"
                                                value={form.internship_duration}
                                                onChange={handleChange}
                                                className="w-full accent-primary-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {loading ? 'Calculating...' : 'Calculate Placement Score'}
                            </button>
                        </form>
                    </div>

                    {/* Result Panel */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                        {result ? (
                            <div>
                                <div className="text-center mb-8">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Placement Probability</p>
                                    <p className={`text-7xl font-black ${result.placement_probability >= 60 ? 'text-emerald-500' : result.placement_probability >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                        {result.placement_probability}%
                                    </p>
                                    <p className="text-slate-400 mt-2">Confidence: {result.confidence_score}%</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-4">Suggested Improvements</p>
                                    <ul className="space-y-3">
                                        {result.suggested_improvements.map((s, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <TrendingUp className="text-primary-500 mt-0.5 shrink-0" size={16} />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400">
                                <Target className="mx-auto mb-4 text-slate-200" size={80} />
                                <p className="font-semibold text-lg">Fill in your profile and hit calculate</p>
                                <p className="text-sm mt-1">Your personalised placement score will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarLink = ({ icon, label, active = false, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold ${active ? 'bg-primary-500/15 text-primary-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <span className={`${active ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-400 transition-colors'}`}>{icon}</span>
        {label}
    </a>
);

export default Predictions;
