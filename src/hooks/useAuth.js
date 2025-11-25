import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import {
  setCredentials,
  logout as logoutAction,
  setLoading,
  setError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAccessToken,
  selectAuthLoading,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const accessToken = useSelector(selectAccessToken);
  const isLoading = useSelector(selectAuthLoading);

  // Validate token on mount and when token changes
  useEffect(() => {
    const validateToken = async () => {
      if (accessToken) {
        try {
          const response = await axios.post('/api/Auth/validate-token', {
            token: accessToken,
          });
          
          if (!response.data.isValid) {
            dispatch(logoutAction());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          dispatch(logoutAction());
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    };

    validateToken();
  }, [accessToken, dispatch]);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(setCredentials({
          user,
          accessToken: storedToken,
          refreshToken: storedRefreshToken,
        }));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  const login = async (email, password) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post('/api/Auth/login', {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Store in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update Redux state
      dispatch(setCredentials({ user, accessToken, refreshToken }));
      dispatch(setLoading(false));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return {
    user,
    isAuthenticated,
    accessToken,
    isLoading,
    login,
    logout,
  };
};
