import { useEffect, useState } from 'react';
import api from '../api/axios';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('http://localhost:8000/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(res.data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  return userInfo;
};
