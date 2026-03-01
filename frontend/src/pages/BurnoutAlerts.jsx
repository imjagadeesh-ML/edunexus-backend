import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Brain, Target, LayoutDashboard, AlertTriangle, FileText, BookOpen, LogOut, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const BurnoutAlerts = () => {
    const { user, logout } = useAuth();
    const [form, setForm] = useState({
        weekly_attendance_trend: '',
        marks_decline_trend: '',
        lab_submission_delays: '',
        high_attendance_low_marks: false,
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
            const res = await client.post('/predictions/predict-burnout', {
                weekly_attendance_trend: parseFloat(form.weekly_attendance_trend),
                marks_decline_trend: parseFloat(form.marks_decline_trend),
                lab_submission_delays: parseInt(form.lab_submission_delays),
                high_attendance_low_marks: form.high_attendance_low_marks ? 1 : 0,
            });
            setResult(res.data);
        } catch (err) {
            setError('Failed to compute burnout risk. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const initials = user?.name ? user.name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    const riskColor = result
        ? result.warning_level === 'Low' ? 'text-emerald-500'
            : result.warning_level === 'Medium' ? 'text-amber-500'
                : 'text-red-500'
        : '';

    const riskBg = result
        ? result.warning_level === 'Low' ? 'bg-emerald-50 border-emerald-200'
            : result.warning_level === 'Medium' ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
        : '';

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
                    <SidebarLink icon={<Target size={20} />} label="Predictions" href="/predictions" />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" href="/burnout" active />
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
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Burnout Alerts</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Detect early signs of academic burnout</p>
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
                    {/* Form */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Recent Trend Analysis</h2>
                        <p className="text-sm text-slate-500 mb-6">Enter your recent academic trends. Use negative values for declining trends.</p>
                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {[
                                { label: 'Weekly Attendance Trend (e.g. -0.1 = 10% drop)', name: 'weekly_attendance_trend', placeholder: 'e.g. -0.15' },
                                { label: 'Marks Decline Trend (e.g. -0.2 = dropping)', name: 'marks_decline_trend', placeholder: 'e.g. -0.1' },
                                { label: 'Lab Submission Delays (count)', name: 'lab_submission_delays', placeholder: 'e.g. 3' },
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
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="high_attendance_low_marks" checked={form.high_attendance_low_marks} onChange={handleChange} className="w-5 h-5 rounded accent-amber-500" />
                                <span className="text-sm font-semibold text-slate-600">High attendance but low marks pattern detected</span>
                            </label>
                            <button type="submit" disabled={loading} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-60">
                                {loading ? 'Analysing...' : 'Analyse Burnout Risk'}
                            </button>
                        </form>
                    </div>

                    {/* Result */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center">
                        {result ? (
                            <div>
                                <div className={`text-center p-8 rounded-2xl border mb-8 ${riskBg}`}>
                                    <Activity className={`mx-auto mb-3 ${riskColor}`} size={48} />
                                    <p className={`text-6xl font-black mb-2 ${riskColor}`}>{result.warning_level}</p>
                                    <p className="text-slate-500 font-semibold">Burnout Risk Level</p>
                                    <p className="text-2xl font-bold text-slate-700 mt-2">{result.burnout_probability}% probability</p>
                                </div>
                                <div className={`flex items-center gap-3 p-4 rounded-xl border ${result.burnout_risk_flag ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                                    {result.burnout_risk_flag
                                        ? <TrendingDown size={20} />
                                        : <TrendingUp size={20} />
                                    }
                                    <p className="font-semibold text-sm">
                                        {result.burnout_risk_flag
                                            ? '⚠️ Burnout risk flag raised. Consider speaking with your advisor.'
                                            : '✅ No burnout flag raised. Keep up the good work!'
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400">
                                <AlertTriangle className="mx-auto mb-4 text-slate-200" size={80} />
                                <p className="font-semibold text-lg">Enter your recent trends to analyse</p>
                                <p className="text-sm mt-1">Your burnout risk assessment will appear here</p>
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

export default BurnoutAlerts;
