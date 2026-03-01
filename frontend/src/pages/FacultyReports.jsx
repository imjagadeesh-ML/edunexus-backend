import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Brain, Target, LayoutDashboard, AlertTriangle,
    FileText, BookOpen, LogOut, Download, BarChart2,
    Users, TrendingUp, Award, Activity
} from 'lucide-react';

// Comprehensive department mock data for the report
const reportData = {
    department: "Computer Science & Engineering",
    batch: "2022–2026",
    totalStudents: 120,
    avgAttendance: 83.4,
    avgSkillReadiness: 71.2,
    avgPlacementProb: 64.8,
    passRate: 91.5,
    subjects: [
        { name: "Data Structures", avgScore: 78.4, passRate: 94, riskCount: 8 },
        { name: "Python Programming", avgScore: 82.1, passRate: 97, riskCount: 4 },
        { name: "Machine Learning", avgScore: 69.3, passRate: 88, riskCount: 18 },
        { name: "Cloud Computing", avgScore: 65.7, passRate: 84, riskCount: 22 },
        { name: "Database Systems", avgScore: 74.9, passRate: 92, riskCount: 11 },
    ],
    riskBreakdown: { high: 14, medium: 32, low: 74 },
    topRoles: ["Full Stack Engineer", "Data Scientist", "DevOps Engineer", "AI Researcher"],
    burnoutFlags: 9,
};

const FacultyReports = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [entryForm, setEntryForm] = useState({ roll_number: '', name: '', department: 'CS', cgpa: '' });
    const [studentsList, setStudentsList] = useState([]);

    const initials = user?.name ? user.name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'subjects', label: 'Subject Analysis' },
        { id: 'risk', label: 'Risk & Burnout' },
        { id: 'placement', label: 'Placement Intel' },
        { id: 'entry', label: 'Student Entry' },
    ];

    const handleEntrySubmit = (e) => {
        e.preventDefault();
        setStudentsList([...studentsList, { ...entryForm, id: Date.now() }]);
        setEntryForm({ roll_number: '', name: '', department: 'CS', cgpa: '' });
    };

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
                    <SidebarLink icon={<Brain size={20} />} label="Collaboration Hub" href="/collaboration" />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" href="/predictions" />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" href="/burnout" />
                    <SidebarLink icon={<FileText size={20} />} label="Faculty Reports" href="/reports" active />
                    <SidebarLink icon={<BookOpen size={20} />} label="Curriculum" href="/curriculum" />
                </nav>
                <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all font-semibold border border-transparent hover:border-red-500/20">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Faculty Reports</h1>
                        <p className="text-slate-500 text-lg mt-1 font-medium">
                            {reportData.department} · Batch {reportData.batch}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-95">
                            <Download size={16} /> Export PDF
                        </button>
                        <div className="flex items-center gap-3 glass p-3 rounded-2xl shadow-sm pr-5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">{initials}</div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm leading-tight">{user?.name || 'Faculty'}</p>
                                <p className="text-xs text-slate-500">Faculty View</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-slate-200 pb-0">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-all ${activeTab === t.id
                                ? 'bg-white text-primary-600 border border-b-white border-slate-200 -mb-px shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Total Students', value: reportData.totalStudents, icon: <Users className="text-indigo-500" />, bg: 'bg-indigo-50' },
                                { label: 'Avg Attendance', value: `${reportData.avgAttendance}%`, icon: <Activity className="text-emerald-500" />, bg: 'bg-emerald-50' },
                                { label: 'Avg Skill Readiness', value: `${reportData.avgSkillReadiness}%`, icon: <Award className="text-amber-500" />, bg: 'bg-amber-50' },
                                { label: 'Avg Placement Prob.', value: `${reportData.avgPlacementProb}%`, icon: <TrendingUp className="text-primary-500" />, bg: 'bg-indigo-50' },
                            ].map((card, i) => (
                                <div key={i} className="glass p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className={`${card.bg} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>{card.icon}</div>
                                    <p className="text-2xl font-black text-slate-900">{card.value}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{card.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Top Industry Roles — Department Alignment</h2>
                            <div className="flex flex-wrap gap-3">
                                {reportData.topRoles.map((role, i) => (
                                    <span key={i} className="px-4 py-2 bg-primary-50 text-primary-700 font-bold text-sm rounded-xl border border-primary-100 flex items-center gap-2">
                                        <TrendingUp size={14} /> {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Subject Analysis Tab */}
                {activeTab === 'subjects' && (
                    <div className="space-y-4">
                        {reportData.subjects.map((s, i) => (
                            <div key={i} className="glass p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-slate-800">{s.name}</h3>
                                    <div className="flex gap-6 text-sm font-bold">
                                        <span className="text-emerald-600">Pass Rate: {s.passRate}%</span>
                                        <span className="text-red-500">At Risk: {s.riskCount} students</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${s.avgScore >= 75 ? 'bg-emerald-500' : s.avgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                            style={{ width: `${s.avgScore}%` }}
                                        />
                                    </div>
                                    <span className="text-slate-700 font-black w-12 text-right">{s.avgScore}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Risk & Burnout Tab */}
                {activeTab === 'risk' && (
                    <div>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'High Risk', count: reportData.riskBreakdown.high, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
                                { label: 'Medium Risk', count: reportData.riskBreakdown.medium, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
                                { label: 'Low Risk', count: reportData.riskBreakdown.low, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                            ].map((r, i) => (
                                <div key={i} className={`p-6 rounded-2xl border ${r.bg} text-center`}>
                                    <p className={`text-5xl font-black ${r.color}`}>{r.count}</p>
                                    <p className={`font-bold text-sm mt-2 ${r.color}`}>{r.label} Students</p>
                                </div>
                            ))}
                        </div>
                        <div className="glass p-6 rounded-2xl border border-amber-200 bg-amber-50">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                                <div>
                                    <p className="font-bold text-amber-800">{reportData.burnoutFlags} students have active burnout flags</p>
                                    <p className="text-sm text-amber-700 mt-1">Recommend early intervention: schedule advisor meetings and reduce assignment load.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Placement Intel Tab */}
                {activeTab === 'placement' && (
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Placement Probability Distribution</h2>
                            {[
                                { label: '80–100% (Highly Likely)', pct: 22, color: 'bg-emerald-500' },
                                { label: '60–79% (Likely)', pct: 41, color: 'bg-primary-500' },
                                { label: '40–59% (Moderate)', pct: 28, color: 'bg-amber-500' },
                                { label: 'Below 40% (At Risk)', pct: 9, color: 'bg-red-500' },
                            ].map((b, i) => (
                                <div key={i} className="mb-4">
                                    <div className="flex justify-between text-sm font-semibold text-slate-600 mb-1">
                                        <span>{b.label}</span><span>{b.pct}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div className={`${b.color} h-full rounded-full transition-all duration-700`} style={{ width: `${b.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="glass p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3">Overall Department Pass Rate</h3>
                            <p className="text-5xl font-black text-emerald-600">{reportData.passRate}%</p>
                            <p className="text-slate-500 text-sm mt-2">Based on current academic performance data</p>
                        </div>
                    </div>
                )}

                {/* Student Entry Tab */}
                {activeTab === 'entry' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Enter Student Details</h2>
                            <form onSubmit={handleEntrySubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Roll Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 21CS001"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={entryForm.roll_number}
                                        onChange={(e) => setEntryForm({ ...entryForm, roll_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Student Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                        value={entryForm.name}
                                        onChange={(e) => setEntryForm({ ...entryForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Department</label>
                                        <select
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={entryForm.department}
                                            onChange={(e) => setEntryForm({ ...entryForm, department: e.target.value })}
                                        >
                                            <option value="CS">Computer Science</option>
                                            <option value="ECE">Electronics (ECE)</option>
                                            <option value="EEE">EEE</option>
                                            <option value="MECH">Mechanical</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">CGPA / Score</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0–10"
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={entryForm.cgpa}
                                            onChange={(e) => setEntryForm({ ...entryForm, cgpa: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                                    Add Student to Batch
                                </button>
                            </form>
                        </div>

                        <div className="glass p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex justify-between items-center">
                                Batch Entries
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{studentsList.length} Students</span>
                            </h2>
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {studentsList.map(s => (
                                    <div key={s.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div>
                                            <p className="font-bold text-slate-800">{s.name}</p>
                                            <p className="text-xs text-slate-500">{s.roll_number} · {s.department}</p>
                                        </div>
                                        <span className="text-primary-600 font-black">{s.cgpa}</span>
                                    </div>
                                ))}
                                {studentsList.length === 0 && (
                                    <div className="text-center py-20 text-slate-400 italic">
                                        No student data entered yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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

export default FacultyReports;
