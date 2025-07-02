import { set } from 'mongoose';
import React from 'react'
import { useState } from 'react';
import { Children } from 'react';
import { createContext } from 'react'


const AuthContext = createContext();
export const AuthProvider = ({Children}) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))

    const login = (userData) => {
        localStorage.setItem('user'. JSON.stringify(userData));
        setUser(userData);
    }
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }
    redirectDocument(
        <AuthContext.Provider value={{user, login, logout}} >
            {Children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);