import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Brain, Target, LayoutDashboard, AlertTriangle,
    FileText, BookOpen, LogOut, Search,
    Code, Database, Cpu, Globe, ArrowRight, Cloud,
    X, Map, ChevronRight, ExternalLink, Settings
} from 'lucide-react';

// Career path data for the Exploration Map modal
const EXPLORATION_DATA = {
    // --- COMPUTER SCIENCE ---
    CS101: {
        careerPaths: [
            { role: 'Backend Developer', steps: ['Arrays & Trees', 'Graph Algorithms', 'System Design', 'API Development'], salary: '6–12 LPA' },
            { role: 'Software Engineer', steps: ['DSA Fluency', 'LeetCode Practice', 'System Design', 'Behavioural Prep'], salary: '7–14 LPA' },
        ],
        resources: [
            { name: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/books/introduction-algorithms' },
            { name: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap' },
        ],
    },
    // --- ECE ---
    EC101: {
        careerPaths: [
            { role: 'VLSI Engineer', steps: ['Digital Logic', 'Verilog/VHDL', 'Synthesis', 'Physical Design'], salary: '10–22 LPA' },
            { role: 'Verification Engineer', steps: ['System Verilog', 'UVM', 'Scripting (Perl/Tcl)', 'Logic Equivalence'], salary: '8–18 LPA' },
        ],
        resources: [
            { name: 'NPTEL VLSI Course', url: 'https://nptel.ac.in/courses/117101058' },
            { name: 'EDA Playground', url: 'https://edaplayground.com' },
        ],
    },
    EC302: {
        careerPaths: [
            { role: 'Embedded Systems Dev', steps: ['C/C++ Programming', 'RTOS', 'Device Drivers', 'Kernel Internals'], salary: '6–15 LPA' },
            { role: 'Firmware Engineer', steps: ['Microcontrollers', 'Bare-metal C', 'Bootloaders', 'Communication Protocols'], salary: '7–16 LPA' },
        ],
        resources: [
            { name: 'Embedded Systems by Jack Ganssle', url: 'http://www.ganssle.com/' },
            { name: 'Microchip University', url: 'https://mu.microchip.com' },
        ],
    },
    // --- AIML ---
    AI302: {
        careerPaths: [
            { role: 'ML Engineer', steps: ['Calculus & Linear Algebra', 'Deep Learning', 'PyTorch/TensorFlow', 'MLOps'], salary: '12–25 LPA' },
            { role: 'Computer Vision Engineer', steps: ['OpenCV', 'CNNs', 'Object Detection', 'Image Segmentation'], salary: '10–22 LPA' },
        ],
        resources: [
            { name: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/' },
            { name: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' },
        ],
    },
    // --- MECH ---
    ME201: {
        careerPaths: [
            { role: 'Design Engineer', steps: ['Solid Mechanics', 'CAD Mastery', 'FEA Basics', 'Design for Mfg'], salary: '5–12 LPA' },
            { role: 'Product Development Engineer', steps: ['Thermodynamics', 'Prototyping', 'Material Testing', 'Innovation'], salary: '6–14 LPA' },
        ],
        resources: [
            { name: 'ASME Learning', url: 'https://www.asme.org/' },
            { name: 'AutoDesk University', url: 'https://www.autodesk.com/university/' },
        ],
    },
    // --- CIVIL ---
    CE201: {
        careerPaths: [
            { role: 'Structural Engineer', steps: ['Statics & Dynamics', 'RCC Design', 'Steel Structures', 'Staad.Pro'], salary: '5–13 LPA' },
            { role: 'Bridge Engineer', steps: ['Bridge Architecture', 'Soil Mechanics', 'Seismic Analysis', 'Load Testing'], salary: '7–18 LPA' },
        ],
        resources: [
            { name: 'ICE (Institution of Civil Engineers)', url: 'https://www.ice.org.uk/' },
            { name: 'Autodesk Civil 3D Docs', url: 'https://help.autodesk.com/' },
        ],
    },
    // --- EEE ---
    EE301: {
        careerPaths: [
            { role: 'Power Systems Engineer', steps: ['AC/DC Machinery', 'Transmission', 'Smart Grids', 'Stability'], salary: '6–15 LPA' },
            { role: 'EV Systems Engineer', steps: ['Battery Management', 'Motor Control', 'Power Electronics', 'Charging Infra'], salary: '8–20 LPA' },
        ],
        resources: [
            { name: 'IEEE Power & Energy Society', url: 'https://www.ieee-pes.org/' },
            { name: 'MATLAB for Electrical Eng', url: 'https://www.mathworks.com/learn/tutorials/' },
        ],
    },
};

// Full curriculum data with all skills
const ALL_MAPPINGS = [
    // --- COMPUTER SCIENCE ---
    { subject: "Data Structures & Algorithms", code: "CS101", year: 1, branch: "CS", roles: ["Software Engineer", "Backend Developer"], skills: ["Arrays", "Heaps", "Graphs", "DP", "Complexity Analysis"], importance: 95, icon: <Code className="text-indigo-500" />, color: "indigo" },
    { subject: "Database Systems", code: "CS201", year: 2, branch: "CS", roles: ["DBA", "Data Engineer"], skills: ["SQL", "NoSQL", "Indexing", "Normalization", "ACID"], importance: 88, icon: <Database className="text-sky-500" />, color: "sky" },
    { subject: "Operating Systems", code: "CS302", year: 3, branch: "CS", roles: ["Systems Programmer", "SRE"], skills: ["Process Management", "Memory", "File Systems", "Concurrency"], importance: 85, icon: <Settings className="text-rose-500" />, color: "rose" },

    // --- AI & ML ---
    { subject: "Applied Statistics for AI", code: "AI201", year: 2, branch: "AIML", roles: ["Data Scientist", "Research Analyst"], skills: ["Probability", "Distribution", "Hypothesis Testing", "Regression"], importance: 90, icon: <Target className="text-emerald-500" />, color: "emerald" },
    { subject: "Neural Networks & Deep Learning", code: "AI302", year: 3, branch: "AIML", roles: ["AI Engineer", "CV Engineer"], skills: ["CNNs", "RNNs", "Backpropagation", "TensorFlow"], importance: 94, icon: <Brain className="text-indigo-500" />, color: "indigo" },
    { subject: "Natural Language Processing", code: "AI401", year: 4, branch: "AIML", roles: ["NLP Engineer", "LLM Specialized"], skills: ["Tokenization", "Transformers", "BERT/GPT", "Sentiment Analysis"], importance: 88, icon: <Globe className="text-blue-500" />, color: "blue" },

    // --- ECE ---
    { subject: "Digital System Design", code: "EC101", year: 1, branch: "ECE", roles: ["VLSI Designer", "Logic Engineer"], skills: ["K-Maps", "VHDL/Verilog", "FSMs", "FPGA"], importance: 88, icon: <Cpu className="text-amber-500" />, color: "amber" },
    { subject: "Embedded Systems & RTOS", code: "EC302", year: 3, branch: "ECE", roles: ["Embedded Developer", "Firmware Engineer"], skills: ["C/C++", "RTOS", "Interrupts", "Device Drivers"], importance: 92, icon: <Settings className="text-emerald-500" />, color: "emerald" },

    // --- EEE ---
    { subject: "Power Electronics", code: "EE301", year: 3, branch: "EEE", roles: ["Power Systems Engineer", "EV Engineer"], skills: ["Converters", "Inverters", "PWM", "Semiconductors"], importance: 85, icon: <Cpu className="text-rose-500" />, color: "rose" },
    { subject: "Electric Vehicles (EV)", code: "EE401", year: 4, branch: "EEE", roles: ["EV Architect", "Control Systems Lead"], skills: ["BMS", "Motor Control", "Regenerative Braking", "Li-ion Tech"], importance: 90, icon: <Target className="text-sky-500" />, color: "sky" },

    // --- MECHANICAL ---
    { subject: "Design of Machine Elements", code: "ME201", year: 2, branch: "MECH", roles: ["Design Engineer", "Structural Designer"], skills: ["CAD", "Stress Analysis", "Solid Mechanics", "Material Selection"], importance: 87, icon: <Settings className="text-indigo-500" />, color: "indigo" },
    { subject: "Robotics & Automation", code: "ME301", year: 3, branch: "MECH", roles: ["Robotics Engineer", "Automation Lead"], skills: ["ROS", "Kinematics", "Sensors", "Path Planning"], importance: 89, icon: <Cpu className="text-amber-500" />, color: "amber" },

    // --- CIVIL ---
    { subject: "Structural Analysis", code: "CE201", year: 2, branch: "CIVIL", roles: ["Structural Engineer", "Site Manager"], skills: ["Statics", "Matrix Methods", "Force Method", "RCC"], importance: 92, icon: <Map className="text-rose-500" />, color: "rose" },
    { subject: "Building Information Modeling (BIM)", code: "CE401", year: 4, branch: "CIVIL", roles: ["BIM Architect", "Const. Manager"], skills: ["Revit", "Autodesk Civil 3D", "4D Scheduling", "LOD"], importance: 88, icon: <Globe className="text-sky-500" />, color: "sky" },
];

const skillColorMap = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
};

// ── Exploration Map Modal ─────────────────────────────────────────────────────
const ExplorationModal = ({ item, onClose }) => {
    const expData = EXPLORATION_DATA[item.code];
    if (!expData) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white rounded-t-3xl flex justify-between items-start p-8 border-b border-slate-100">
                    <div>
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase tracking-widest mb-2 inline-block">{item.code}</span>
                        <h2 className="text-2xl font-extrabold text-slate-900">{item.subject}</h2>
                        <p className="text-slate-400 text-sm mt-1 flex items-center gap-1"><Map size={14} /> Exploration Map</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Career Paths */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Career Pathways</h3>
                        <div className="space-y-4">
                            {expData.careerPaths.map((path, i) => (
                                <div key={i} className="glass p-5 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <p className="font-bold text-slate-800">{path.role}</p>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">{path.salary}</span>
                                    </div>
                                    {/* Step-by-step path */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        {path.steps.map((step, sIdx) => (
                                            <React.Fragment key={sIdx}>
                                                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">{step}</span>
                                                {sIdx < path.steps.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                                            </React.Fragment>
                                        ))}
                                        <span className="ml-1 text-xs font-bold text-primary-600">→ {path.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Learning Resources */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Recommended Learning Resources</h3>
                        <div className="space-y-2">
                            {expData.resources.map((res, i) => (
                                <a
                                    key={i}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-primary-50 border border-slate-100 hover:border-primary-200 rounded-xl transition-all group"
                                >
                                    <span className="font-semibold text-slate-700 group-hover:text-primary-700 text-sm">{res.name}</span>
                                    <ExternalLink size={15} className="text-slate-300 group-hover:text-primary-500 transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* All Skills */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-4">All {item.skills.length} Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {item.skills.map((skill, i) => (
                                <span key={i} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${skillColorMap[item.color]}`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Main Curriculum Page ──────────────────────────────────────────────────────
const Curriculum = () => {
    const { logout } = useAuth();
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState({});
    const [explorationItem, setExplorationItem] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState('All');

    const toggleExpand = (code) => setExpanded(prev => ({ ...prev, [code]: !prev[code] }));

    const filtered = ALL_MAPPINGS.filter(m => {
        const matchesBranch = selectedBranch === 'All' || m.branch === selectedBranch;
        const matchesSearch = m.subject.toLowerCase().includes(search.toLowerCase()) ||
            m.roles.some(r => r.toLowerCase().includes(search.toLowerCase())) ||
            m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
        return matchesBranch && matchesSearch;
    });

    const groupedByYear = [1, 2, 3, 4].map(year => ({
        year,
        items: filtered.filter(m => m.year === year)
    }));

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <div className="w-68 glass-dark text-white p-6 hidden lg:flex flex-col shadow-2xl">
                <div className="mb-12 flex items-center gap-3 px-2">
                    <div className="bg-emerald-500 p-2 rounded-lg"><Brain className="text-white w-6 h-6" /></div>
                    <h2 className="text-xl font-bold tracking-tight">StratAcade</h2>
                </div>
                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" href="/dashboard" />
                    <SidebarLink icon={<Brain size={20} />} label="Collaboration Hub" href="/collaboration" />
                    <SidebarLink icon={<Target size={20} />} label="Predictions" href="/predictions" />
                    <SidebarLink icon={<AlertTriangle size={20} />} label="Burnout Alerts" href="/burnout" />
                    <SidebarLink icon={<FileText size={20} />} label="Faculty Reports" href="/reports" />
                    <SidebarLink icon={<BookOpen size={20} />} label="Curriculum" href="/curriculum" active />
                </nav>
                <button onClick={logout} className="mt-auto flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all font-semibold border border-transparent hover:border-red-500/20">
                    <LogOut size={20} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Curriculum & Industry Alignment</h1>
                    <p className="text-slate-500 text-lg mt-1 font-medium italic">Every skill you'll need, mapped to the jobs that demand them.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search subjects, roles, or specific skills..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all text-slate-700 font-medium"
                        />
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                        {['All', 'CS', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL'].map(branch => (
                            <button
                                key={branch}
                                onClick={() => setSelectedBranch(branch)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedBranch === branch
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {branch === 'AIML' ? 'AI & ML' : branch}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    {groupedByYear.map(({ year, items }) => items.length > 0 && (
                        <div key={year}>
                            <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm">Y{year}</span>
                                {year === 1 ? '1st Year: Foundations' : year === 2 ? '2nd Year: Core Systems' : year === 3 ? '3rd Year: Specialization' : 'Final Year: Mastery'}
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {items.map((item) => {
                                    const isExpanded = expanded[item.code];
                                    const visibleSkills = isExpanded ? item.skills : item.skills.slice(0, 6);
                                    const hasMore = item.skills.length > 6;
                                    const tagClass = skillColorMap[item.color] || skillColorMap.indigo;

                                    return (
                                        <div key={item.code} className="glass p-8 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                                            <div className="flex flex-col lg:flex-row gap-8">
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                                                        {item.icon}
                                                    </div>
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase mb-2 inline-block tracking-widest">{item.code} | {item.branch}</span>
                                                            <h3 className="text-2xl font-bold text-slate-800">{item.subject}</h3>
                                                            <p className="text-sm text-slate-400 mt-0.5">Comprehensive Industry Module</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Industry Impact</p>
                                                            <p className="text-xl font-black text-emerald-600">{item.importance}%</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Key Industry Roles</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.roles.map((role, rIdx) => (
                                                                    <span key={rIdx} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg flex items-center gap-1.5">
                                                                        {role} <ArrowRight size={12} className="text-slate-400" />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">All Required Skills</p>
                                                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{item.skills.length} skills</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {visibleSkills.map((skill, sIdx) => (
                                                                    <span key={sIdx} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${tagClass}`}>
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                                {hasMore && (
                                                                    <button
                                                                        onClick={() => toggleExpand(item.code)}
                                                                        className="px-3 py-1.5 text-xs font-bold rounded-lg border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 transition-all"
                                                                    >
                                                                        {isExpanded ? '▲ Show less' : `+${item.skills.length - 6} more`}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-center lg:pl-8 lg:border-l border-slate-100">
                                                    <button
                                                        onClick={() => setExplorationItem(item)}
                                                        className="flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-all whitespace-nowrap hover:gap-3 group/btn"
                                                    >
                                                        <Map size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                        Exploration Map
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <Search size={48} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-semibold text-lg">No results for "{search}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Exploration Map Modal */}
            {explorationItem && (
                <ExplorationModal item={explorationItem} onClose={() => setExplorationItem(null)} />
            )}
        </div>
    );
};

const SidebarLink = ({ icon, label, active = false, href = '#' }) => (
    <a href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group font-semibold ${active ? 'bg-primary-500/15 text-primary-400 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
        <span className={`${active ? 'text-primary-400' : 'text-slate-500 group-hover:text-primary-400 transition-colors'}`}>{icon}</span>
        {label}
    </a>
);

export default Curriculum;
