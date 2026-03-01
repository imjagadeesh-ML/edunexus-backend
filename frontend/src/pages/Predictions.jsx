import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Brain, Target, LayoutDashboard, AlertTriangle, FileText, BookOpen, LogOut, TrendingUp, RefreshCw, Star } from 'lucide-react';

const Predictions = () => {
    const { user, logout } = useAuth();
    const [form, setForm] = useState({
        override_skill_score: '',
        override_projects: '',
    });
    const [result, setResult] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const fetchRecords = async () => {
        setFetching(true);
        setError('');
        try {
            const res = await client.post('/predictions/predict-placement', {
                student_id: user.id,
            });
            setResult(res.data);

            // Fetch Roadmap
            const roadmapRes = await client.get(`/predictions/roadmap/${user.id}`);
            setRoadmap(roadmapRes.data);

            if (res.data.suggested_improvements?.length > 0) {
                const recRes = await client.post('/predictions/recommendations', ["Python", "React", "SQL"]);
                setRecommendations(recRes.data);
            }
        } catch (err) {
            setError('Failed to fetch your academic records. Please ensure your profile is complete.');
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await client.post('/predictions/predict-placement', {
                student_id: user.id,
                override_skill_score: form.override_skill_score ? parseFloat(form.override_skill_score) : null,
                override_projects: form.override_projects ? parseInt(form.override_projects) : null,
            });
            setResult(res.data);
        } catch (err) {
            setError('Prediction failed. Please check your overrides.');
        } finally {
            setLoading(false);
        }
    };

    const initials = user?.name ? user.name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar (Same as before) */}
            <div className="w-68 glass-dark text-white p-6 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="bg-emerald-500 p-2 rounded-lg"><Brain className="text-white w-6 h-6" /></div>
                    <h2 className="text-xl font-bold tracking-tight">EduNexus AI</h2>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarLink icon={<Brain size={20} />} label="Collaboration Hub" href="/collaboration" />
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
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Intelligence Hub</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Predicting your path to professional success</p>
                    </div>
                    <div className="flex items-center gap-4 glass p-3 rounded-2xl shadow-sm pr-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">{initials}</div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">{user?.name || 'Student'}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID: {user?.roll_number || '—'}</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    {/* Automation Panel */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl shadow-sm border border-emerald-100 bg-emerald-50/30">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Smart Analysis</h2>
                            <p className="text-sm text-slate-600 mb-6">Skip the forms. Fetch your marks and attendance directly from our core academic registry.</p>
                            <button
                                onClick={fetchRecords}
                                disabled={fetching}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-60"
                            >
                                {fetching ? <RefreshCw className="animate-spin" /> : <RefreshCw size={20} />}
                                {fetching ? 'Fetching Records...' : 'Sync Academic Profile'}
                            </button>
                        </div>

                        <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">What-If Simulation</h2>
                            <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest font-bold">Simulate your future score</p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1">Target Skill Score</label>
                                        <input type="number" name="override_skill_score" placeholder="e.g. 85" value={form.override_skill_score} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 block mb-1">Target Project Count</label>
                                        <input type="number" name="override_projects" placeholder="e.g. 5" value={form.override_projects} onChange={handleChange} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-60">
                                    Run Simulation
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Result Panel */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                        {result ? (
                            <div className="animate-fade-in">
                                <div className="text-center mb-10 p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4"><Star className="text-amber-400 fill-amber-400" size={24} /></div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Estimated Placement Readiness</p>
                                    <p className={`text-8xl font-black tracking-tighter ${result.placement_probability >= 70 ? 'text-emerald-500' : result.placement_probability >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                        {result.placement_probability}%
                                    </p>
                                    <div className="flex items-center justify-center gap-6 mt-4">
                                        <p className="text-slate-400 text-sm font-medium">Confidence: {result.confidence_score}%</p>
                                        <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                                        <p className="text-slate-400 text-sm font-medium">Data Health: Optimal</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <DataPoint label="Avg Academic Score" value={`${result.data_points?.avg_marks}%`} />
                                    <DataPoint label="Attendance" value={`${result.data_points?.attendance_pct}%`} />
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                        <TrendingUp size={16} /> Roadmap to 100%
                                    </p>
                                    <ul className="space-y-2">
                                        {result.suggested_improvements.map((s, i) => (
                                            <li key={i} className="p-4 bg-primary-50/50 border border-primary-100 rounded-2xl text-sm text-slate-700 font-medium">
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {recommendations.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-4">Recommended Resources</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {recommendations.map((r, i) => (
                                                <a key={i} href={r.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                            <BookOpen size={16} />
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700">{r.title}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-primary-500 uppercase bg-primary-50 px-2 py-1 rounded">Course</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                                <Target className="mb-6 text-slate-200" size={120} />
                                <h3 className="text-2xl font-bold text-slate-800">Ready to simulate?</h3>
                                <p className="max-w-xs mx-auto mt-2 font-medium">Sync your profile or run a what-if simulation to see your placement trajectory.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Journey Roadmap Section */}
                {roadmap && (
                    <div className="animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Your B.Tech Skill Journey</h2>
                            <div className="flex gap-4">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Completed: {roadmap.status_summary.completed}</span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Active: {roadmap.status_summary.active}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(year => (
                                <div key={year} className={`p-6 rounded-3xl border ${roadmap.current_year === year ? 'border-primary-200 bg-primary-50/20 ring-4 ring-primary-500/5' : 'border-slate-100 bg-white shadow-sm'}`}>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
                                        Year {year}
                                        {roadmap.current_year === year && <span className="text-primary-600">You are here</span>}
                                    </p>
                                    <div className="space-y-3">
                                        {roadmap.roadmap[year.toString()].map((skill, idx) => (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                                                    <span>{skill.name}</span>
                                                    {skill.status === 'Completed' ? (
                                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                                    ) : skill.status === 'In Progress' ? (
                                                        <TrendingUp size={12} className="text-indigo-500" />
                                                    ) : null}
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${skill.status === 'Completed' ? 'bg-emerald-500 w-full' :
                                                            skill.status === 'In Progress' ? 'bg-indigo-500 w-1/2' : 'bg-slate-200 w-0'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DataPoint = ({ label, value }) => (
    <div className="p-4 rounded-2xl border border-slate-100 bg-white">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
);

const SidebarLink = ({ icon, label, active = false, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold ${active ? 'bg-primary-500/15 text-primary-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <span className={`${active ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-400 transition-colors'}`}>{icon}</span>
        {label}
    </a>
);

export default Predictions;
