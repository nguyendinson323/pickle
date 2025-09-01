import { useAppDispatch } from '@/store';
import { logout as logoutAction } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return {
    logout
  };
};