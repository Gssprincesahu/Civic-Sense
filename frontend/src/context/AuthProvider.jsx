import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export default function AuthProvider ({ children }){
    const [authUser, setAuthUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try{
            const response = await axios.get('http://localhost:5001/api/user/verify', {withCredentials: true});
            setAuthUser(response.data.user);
            setIsAuthenticated(response.data.isAuthenticated);
        }catch(error) {
            setIsAuthenticated(false);
            setAuthUser(null);
        }finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setAuthUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await axios.post('http://localhost:5001/api/user/logout',{} , {withCredentials : true});
        setAuthUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};