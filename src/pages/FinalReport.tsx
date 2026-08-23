import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function FinalReport() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        // The direct /report route is deprecated in favor of Profile Version reports.
        // Redirect user to their profiles dashboard to view official career reports.
        navigate('/profiles', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Đang chuyển hướng đến Quản lý Hồ sơ...</p>
    </div>
  );
}
