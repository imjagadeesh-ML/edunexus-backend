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
    CS401: {
        careerPaths: [
            { role: 'DevOps Engineer', steps: ['Linux Basics', 'Docker & K8s', 'CI/CD', 'Cloud Infra'], salary: '8–15 LPA' },
            { role: 'Cloud Architect', steps: ['AWS Certifications', 'Multi-cloud Strategy', 'Cost Optimisation', 'FinOps'], salary: '12–25 LPA' },
            { role: 'Site Reliability Engineer', steps: ['Monitoring', 'Incident Response', 'Automation', 'SLA Management'], salary: '10–18 LPA' },
        ],
        resources: [
            { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
            { name: 'Docker Documentation', url: 'https://docs.docker.com' },
            { name: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/home/' },
        ],
    },
    ECE101: {
        careerPaths: [
            { role: 'VLSI Engineer', steps: ['Digital Logic', 'Verilog/VHDL', 'Synthesis', 'Physical Design'], salary: '10–22 LPA' },
            { role: 'Embedded Systems Dev', steps: ['8051/ARM', 'RTOS', 'Device Drivers', 'C Programming'], salary: '6–14 LPA' },
        ],
        resources: [
            { name: 'NPTEL VLSI Course', url: '#' },
            { name: 'ARM Education', url: '#' },
        ],
    },
    MECH101: {
        careerPaths: [
            { role: 'Design Engineer', steps: ['Engineering Drawing', 'AutoCAD', 'SolidWorks', 'FEA'], salary: '5–12 LPA' },
            { role: 'Robotics Engineer', steps: ['Control Systems', 'ROS', 'Actuators', 'Path Planning'], salary: '8–18 LPA' },
        ],
        resources: [
            { name: 'AutoDesk Learning', url: '#' },
            { name: 'SolidWorks Tutorials', url: '#' },
        ],
    },
    CS201: {
        careerPaths: [
            { role: 'Database Administrator', steps: ['SQL Mastery', 'Performance Tuning', 'Backup & Recovery', 'High Availability'], salary: '10–20 LPA' },
            { role: 'Data Engineer', steps: ['SQL + Python', 'ETL Pipelines', 'Data Warehousing', 'Cloud Databases'], salary: '14–28 LPA' },
            { role: 'Backend Engineer', steps: ['ORM & Schema Design', 'Query Optimisation', 'Caching (Redis)', 'Microservices'], salary: '12–25 LPA' },
        ],
        resources: [
            { name: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com' },
            { name: 'SQLZoo', url: 'https://sqlzoo.net' },
            { name: 'MongoDB University', url: 'https://university.mongodb.com' },
        ],
    },
};

// Full curriculum data with all skills
const ALL_MAPPINGS = [
    {
        subject: "Data Structures & Algorithms",
        code: "CS101",
        credits: 4,
        roles: ["Full Stack Engineer", "Backend Developer", "Software Engineer", "Competitive Programmer"],
        skills: [
            "Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & Graphs",
            "Dynamic Programming", "Recursion", "Sorting & Searching", "Hashing",
            "Heaps & Priority Queues", "Algorithm Design", "Time Complexity Analysis",
            "Space Complexity", "Greedy Algorithms", "Backtracking", "Memory Management"
        ],
        importance: 95,
        icon: <Code className="text-indigo-500" />,
        color: "indigo"
    },
    {
        subject: "Python Programming",
        code: "CS102",
        credits: 3,
        roles: ["Data Scientist", "Software Engineer", "Automation Engineer", "Backend Developer"],
        skills: [
            "Core Python Syntax", "OOP in Python", "File I/O", "Exception Handling",
            "List Comprehensions", "Generators & Iterators", "Decorators", "Context Managers",
            "Multithreading", "Multiprocessing", "Regex", "Virtual Environments",
            "Data Processing with Pandas", "Scripting & Automation", "Unit Testing (pytest)",
            "REST API Integration", "pip & Package Management"
        ],
        importance: 88,
        icon: <Globe className="text-emerald-500" />,
        color: "emerald"
    },
    {
        subject: "Machine Learning",
        code: "CS301",
        credits: 4,
        roles: ["AI Researcher", "Data Scientist", "ML Engineer", "NLP Engineer"],
        skills: [
            "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests",
            "SVM", "K-Means Clustering", "KNN", "Gradient Boosting (XGBoost)",
            "Neural Networks (Basics)", "Model Evaluation (Precision, Recall, F1)",
            "Cross-Validation", "Feature Engineering", "Overfitting & Regularization",
            "Scikit-learn", "Matplotlib & Seaborn", "Pandas & NumPy",
            "PCA", "Bias-Variance Tradeoff"
        ],
        importance: 92,
        icon: <Cpu className="text-amber-500" />,
        color: "amber"
    },
    {
        subject: "Cloud Computing",
        code: "CS401",
        credits: 3,
        roles: ["DevOps Engineer", "Cloud Architect", "Backend Developer", "SRE"],
        skills: [
            "Cloud Fundamentals (IaaS, PaaS, SaaS)", "AWS Core Services (EC2, S3, RDS)",
            "Google Cloud Platform Basics", "Azure Overview", "Containerization with Docker",
            "Kubernetes Basics", "CI/CD Pipelines", "Infrastructure as Code (Terraform)",
            "Serverless Computing (Lambda)", "Load Balancing", "Auto Scaling",
            "Cloud Networking (VPC, Subnets)", "IAM & Security Policies",
            "Monitoring & Logging (CloudWatch)", "Cost Optimization"
        ],
        importance: 78,
        icon: <Cloud className="text-sky-500" />,
        color: "sky"
    },
    {
        subject: "Database Systems",
        code: "CS201",
        credits: 4,
        roles: ["Database Administrator", "Backend Engineer", "Data Engineer", "Full Stack Engineer"],
        skills: [
            "Relational Model & ERD", "SQL (SELECT, JOIN, GROUP BY, Subqueries)", "Normalization (1NF–3NF, BCNF)",
            "Indexing & Query Optimization", "Transactions & ACID Properties",
            "Concurrency Control", "Locks & Deadlocks", "Stored Procedures & Triggers",
            "Views & Materialized Views", "PostgreSQL", "MySQL", "NoSQL Concepts (MongoDB)",
            "Schema Design", "Backup & Recovery", "ORMs (SQLAlchemy, Prisma)"
        ],
        importance: 85,
        icon: <Database className="text-sky-500" />,
        color: "sky"
    },
    {
        subject: "VLSI Design",
        code: "ECE101",
        credits: 4,
        roles: ["Design Engineer", "Physical Design Engineer", "Verification Engineer"],
        skills: ["MOS Transistor", "CMOS Circuits", "Verilog/VHDL", "Logical Synthesis", "ASIC Design", "FPGA Architecture"],
        importance: 91,
        icon: <Cpu className="text-rose-500" />,
        color: "rose"
    },
    {
        subject: "Engineering Design (CAD)",
        code: "MECH101",
        credits: 3,
        roles: ["Design Engineer", "Automotive Engineer", "Production Engineer"],
        skills: ["2D/3D Modeling", "AutoCAD", "SolidWorks", "Geometric Dimensioning", "Finite Element Analysis"],
        importance: 87,
        icon: <Settings className="text-amber-600" />,
        color: "amber"
    }
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

    const toggleExpand = (code) => setExpanded(prev => ({ ...prev, [code]: !prev[code] }));

    const filtered = ALL_MAPPINGS.filter(m =>
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.roles.some(r => r.toLowerCase().includes(search.toLowerCase())) ||
        m.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

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

                <div className="mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search subjects, roles, or specific skills..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition-all"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filtered.map((item) => {
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
                                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded uppercase mb-2 inline-block tracking-widest">{item.code}</span>
                                                <h3 className="text-2xl font-bold text-slate-800">{item.subject}</h3>
                                                <p className="text-sm text-slate-400 mt-0.5">{item.credits} Credits</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Industry Impact</p>
                                                <p className="text-xl font-black text-emerald-600">{item.importance}%</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                                            {/* Roles */}
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

                                            {/* Skills */}
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

                                    {/* Exploration Map Button */}
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
