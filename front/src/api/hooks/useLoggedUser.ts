import { useState, useEffect } from 'react';
import User from '../../logic/entities/User';

const getLoggedUser = (): User | null => {
    const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem('User');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = sessionStorage.getItem('User');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return user;
};

export const setLoggedUser = (user: User | null) => {
    sessionStorage.setItem('User', JSON.stringify(user));
};

export const useLoggedUser = () => {
    return { loggedUser: getLoggedUser(), setLoggedUser };
};