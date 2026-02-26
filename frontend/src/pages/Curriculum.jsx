import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import {
    Brain, Target, LayoutDashboard, AlertTriangle,
    FileText, BookOpen, LogOut, Search,
    Code, Database, Cpu, Globe, ArrowRight, ExternalLink
} from 'lucide-react';

const Curriculum = () => {
    const { logout } = useAuth();

    // Mock mapping data for the curriculum page
    const mappings = [
        {
            subject: "Data Structures",
            code: "CS101",
            roles: ["Full Stack Engineer", "Backend Developer"],
            skills: ["Optimization", "Algorithm Design", "Memory Management"],
            importance: 95,
            icon: <Code className="text-indigo-500" />
        },
        {
            subject: "Python Programming",
            code: "CS102",
            roles: ["Data Scientist", "Software Engineer"],
            skills: ["Automation", "Data Processing", "Scripting"],
            importance: 88,
            icon: <Globe className="text-emerald-500" />
        },
        {
            subject: "Machine Learning",
            code: "CS301",
            roles: ["AI Researcher", "Data Scientist"],
            skills: ["Model Training", "Neural Networks", "Pandas/NumPy"],
            importance: 92,
            icon: <Cpu className="text-amber-500" />
        },
        {
            subject: "Database Systems",
            code: "CS201",
            roles: ["Database Admin", "Backend Engineer"],
            skills: ["SQL", "Query Optimization", "Schema Design"],
            importance: 85,
            icon: <Database className="text-sky-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar (Reused from Dashboard) */}
            <div className="w-68 glass-dark text-white p-6 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                        <Brain className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">EduNexus AI</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" />
                    <SidebarLink icon={<FileText size={20} />} label="Faculty Reports" />
                    <SidebarLink icon={<BookOpen size={20} />} label="Curriculum" active />
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
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Curriculum & Industry Alignment</h1>
                    <p className="text-slate-500 text-lg mt-1 font-medium italic">Discover how your academics fuel your future career.</p>
                </header>

                <div className="mb-10 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search subjects or industry roles..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {mappings.map((item, idx) => (
                        <div key={idx} className="glass p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase mb-2 inline-block tracking-widest">{item.code}</span>
                                            <h3 className="text-2xl font-bold text-slate-800">{item.subject}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Impact Level</p>
                                            <p className="text-xl font-black text-emerald-600">{item.importance}%</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Key Industry Roles</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.roles.map((role, rIdx) => (
                                                    <span key={rIdx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-2">
                                                        {role} <ArrowRight size={14} className="text-slate-400" />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Target Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.skills.map((skill, sIdx) => (
                                                    <span key={sIdx} className="px-3 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center lg:pl-8 lg:border-l border-slate-100">
                                    <button className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
                                        Exploration Map <ExternalLink size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SidebarLink = ({ icon, label, active = false, href = "#" }) => (
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

export default Curriculum;
