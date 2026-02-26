import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
    LogOut, LayoutDashboard, Brain, Target,
    AlertTriangle, FileText, Loader2, TrendingUp,
    Award, BookOpen, Clock
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer, BarChart,
    Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

const Dashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for the Radar Chart (Subject knowledge)
    const radarData = [
        { subject: 'DS', A: 85, fullMark: 100 },
        { subject: 'Python', A: 92, fullMark: 100 },
        { subject: 'ML', A: 78, fullMark: 100 },
        { subject: 'Cloud', A: 65, fullMark: 100 },
        { subject: 'DBMS', A: 88, fullMark: 100 },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [readinessRes, placementRes] = await Promise.all([
                    client.get('/students/1/readiness'),
                    client.get('/students/1/placement')
                ]);

                setStats({
                    readiness: readinessRes.data,
                    placement: placementRes.data
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-primary-500 w-12 h-12" />
            </div>
        );
    }

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
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" />
                    <SidebarLink icon={<FileText size={20} />} label="Faculty Reports" />
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
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Academic Intelligence</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">Student Performance & Career Readiness Hub</p>
                    </div>
                    <div className="flex items-center gap-5 glass p-3 rounded-2xl shadow-sm pr-6">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            JD
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 leading-tight">John Doe</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID: ENX2026-001</p>
                        </div>
                    </div>
                </header>

                {/* Primary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <MetricCard
                        title="Skill Readiness"
                        value={`${stats?.readiness?.score?.toFixed(1) || '0.0'}%`}
                        icon={<Award className="text-emerald-500" />}
                        color="emerald"
                        progress={stats?.readiness?.score || 0}
                    />
                    <MetricCard
                        title="Placement Prob."
                        value={`${stats?.placement?.probability?.toFixed(1) || '0.0'}%`}
                        icon={<TrendingUp className="text-primary-500" />}
                        color="primary"
                        progress={stats?.placement?.probability || 0}
                    />
                    <MetricCard
                        title="Burnout Risk"
                        value={stats?.readiness?.risk_level || 'Low'}
                        icon={<AlertTriangle className="text-amber-500" />}
                        color="amber"
                        progress={stats?.readiness?.risk_level === 'Low' ? 20 : 60}
                        isTextValue
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                    {/* Radar Chart Section */}
                    <div className="glass p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[450px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Skill Proficiency Radar</h3>
                            <button className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">Live Analysis</button>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="John"
                                        dataKey="A"
                                        stroke="#6366f1"
                                        fill="#6366f1"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="bg-[#0f172a] rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center h-[450px]">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
                                    <TrendingUp className="text-emerald-400 w-6 h-6" />
                                </div>
                                <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Career Trajectory</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-6 leading-tight">Insight: <span className="text-emerald-400">Full Stack</span> Fit Candidate</h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
                                {stats?.placement?.suggestions || 'Calculating your optimal career path based on your latest results...'}
                            </p>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                                    View Full Career Strategy
                                </button>
                                <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 active:scale-95">
                                    Download Report
                                </button>
                            </div>
                        </div>
                        <Target className="absolute right-[-40px] bottom-[-40px] text-white/5 w-80 h-80 -rotate-12 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components for cleaner structure
const SidebarLink = ({ icon, label, active = false }) => (
    <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold ${active
        ? 'bg-primary-500/15 text-primary-400 shadow-sm'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}>
        <span className={`${active ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-400 transition-colors'}`}>
            {icon}
        </span>
        {label}
    </a>
);

const MetricCard = ({ title, value, icon, color, progress, isTextValue = false }) => {
    const colorClasses = {
        emerald: 'bg-emerald-500',
        primary: 'bg-indigo-600',
        amber: 'bg-amber-500'
    };

    return (
        <div className="glass p-8 rounded-3xl shadow-sm border border-white relative group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{title}</h3>
                    <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                </div>
                <div className={`p-3 rounded-2xl shadow-inner ${color === 'emerald' ? 'bg-emerald-50' : color === 'primary' ? 'bg-indigo-50' : 'bg-amber-50'}`}>
                    {icon}
                </div>
            </div>

            {!isTextValue ? (
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                        className={`${colorClasses[color]} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <Clock size={16} /> Updated Just Now
                </div>
            )}
        </div>
    );
};

export default Dashboard;
