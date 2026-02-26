import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { token, id, name, email, roll_number }
    const [loading, setLoading] = useState(true);

    // Fetch full profile using token stored in localStorage
    const fetchProfile = async (token) => {
        try {
            const res = await client.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ token, ...res.data });
        } catch {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile(token).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await client.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        await fetchProfile(access_token);
        return true;
    };

    const register = async (name, roll_number, email, password) => {
        await client.post('/auth/register', { name, roll_number, email, password });
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
