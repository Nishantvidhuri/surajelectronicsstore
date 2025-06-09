import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setIsLoggedIn(true);
                        const updatedUser = { ...data.user, isAdmin: !!data.user.isAdmin };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        console.log("AuthContext: User initialized from /me", updatedUser);
                    } else {
                        console.error('AuthContext: Token invalid or expired, logging out.');
                        logout();
                    }
                } catch (error) {
                    console.error('AuthContext: Error fetching user details on init:', error);
                    logout();
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
                console.log("AuthContext: No token found, user not logged in.");
            }
            setLoadingAuth(false);
        };

        initializeAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('isLoggedIn', 'true');
        const updatedUser = { ...userData, isAdmin: !!userData.isAdmin };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setUser(updatedUser);
        setLoadingAuth(false);
        console.log("AuthContext: User logged in", updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        setLoadingAuth(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loadingAuth }}>
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