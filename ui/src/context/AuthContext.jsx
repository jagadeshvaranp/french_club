import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user session on boot
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Load offline guest wishlist if no token
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      setUser({ role: 'guest', wishlist: guestWishlist });
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/api/auth/profile');
      setUser(data);
    } catch (error) {
      console.error('Failed to load user profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data);
      await loadUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password, phone });
      localStorage.setItem('token', data.token);
      setUser(data);
      await loadUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Keep guest user
    const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    setUser({ role: 'guest', wishlist: guestWishlist });
  };

  const toggleWishlist = async (productId) => {
    if (!user || user.role === 'guest') {
      let guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const index = guestWishlist.indexOf(productId);
      if (index > -1) {
        guestWishlist.splice(index, 1);
      } else {
        guestWishlist.push(productId);
      }
      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
      setUser({ role: 'guest', wishlist: guestWishlist });
      return;
    }

    try {
      const { data } = await api.post(`/api/auth/wishlist/${productId}`);
      setUser(prev => ({
        ...prev,
        wishlist: data.wishlist
      }));
    } catch (error) {
      console.error('Error toggling wishlist', error);
    }
  };

  const isInWishlist = (productId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some(item => {
      const itemId = typeof item === 'object' ? item._id : item;
      return itemId === productId;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      toggleWishlist,
      isInWishlist,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
