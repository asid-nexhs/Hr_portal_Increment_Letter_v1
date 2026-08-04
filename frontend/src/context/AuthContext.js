import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getProfile, refreshToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem('access_token');
            const refreshTokenValue = localStorage.getItem('refresh_token');
            
            if (accessToken) {
                try {
                    const response = await getProfile();
                    setUser(response.data);
                } catch (error) {
                    // Try to refresh token
                    if (refreshTokenValue) {
                        try {
                            const refreshResponse = await refreshToken(refreshTokenValue);
                            localStorage.setItem('access_token', refreshResponse.data.access);
                            const profileResponse = await getProfile();
                            setUser(profileResponse.data);
                        } catch (refreshError) {
                            logout();
                        }
                    } else {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            // Send username and password
            const response = await apiLogin(credentials);
            const { access, refresh } = response.data;
            
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            const profileResponse = await getProfile();
            setUser(profileResponse.data);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Invalid username or password';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        const refreshTokenValue = localStorage.getItem('refresh_token');
        if (refreshTokenValue) {
            try {
                await apiLogout(refreshTokenValue);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        setError,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin || false
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};