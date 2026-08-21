import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center backdrop-blur-md bg-white/30 border-b border-white/20 sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight">
        Quiz<span className="text-orange-500">App</span>
      </Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-6">
            <Link to="/guide" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">
              Hướng dẫn
            </Link>
            <Link to="/history" className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors hidden md:block">
              Lịch sử bài làm
            </Link>
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-slate-200"
                />
              )}
              <span className="text-sm font-medium text-slate-700 hidden md:block">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white/50 hover:bg-white/80 rounded-full transition-colors border border-slate-200/50"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/guide" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors hidden sm:block">
              Hướng dẫn
            </Link>
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-full transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Đăng nhập / Đăng ký
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
