import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedIsAdmin = localStorage.getItem('isAdmin');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAdmin(savedIsAdmin === 'true');
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setIsAdmin(false);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAdmin', 'false');
  };

  const loginAdmin = (adminData, authToken) => {
    setUser(adminData);
    setToken(authToken);
    setIsAdmin(true);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(adminData));
    localStorage.setItem('isAdmin', 'true');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, token, loading, loginUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
