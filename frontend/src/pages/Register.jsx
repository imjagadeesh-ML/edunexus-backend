import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', roll_number: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await register(form.name, form.roll_number, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            const detail = err?.response?.data?.detail;
            setError(detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Full Name', name: 'name', type: 'text', placeholder: 'e.g. Jagadeesh Kumar', icon: User },
        { label: 'Roll Number', name: 'roll_number', type: 'text', placeholder: 'e.g. ENX2026-042', icon: Hash },
        { label: 'Email Address', name: 'email', type: 'email', placeholder: 'name@university.edu', icon: Mail },
        { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', icon: Lock },
        { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••', icon: Lock },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-emerald-50">
            <div className="glass w-full max-w-md p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary-500 p-3 rounded-xl shadow-lg shadow-primary-200">
                        <UserPlus className="text-white w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">Create Account</h1>
                <p className="text-slate-500 text-center mb-8">Join EduNexus AI</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(({ label, name, type, placeholder, icon: Icon }) => (
                        <div key={name} className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">{label}</label>
                            <div className="relative">
                                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type={type}
                                    name={name}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder={placeholder}
                                    value={form[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
