import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from './store/authStore';

export default function App() {
  const navigate = useNavigate();
  const { user, logout } = authStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f7f8f3]">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-[#18212f]/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-[#18212f]">CareerPilot</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#18212f]">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-soft p-8 border border-[#18212f]/10 text-center">
          <h2 className="text-3xl font-black text-[#18212f] mb-4">Welcome, {user.name}! 🎉</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Phase 1 is complete! Authentication and profile infrastructure are ready.
          </p>
          <p className="text-gray-500 text-sm">
            Next phase: Internship discovery, matching, and skill-gap analysis.
          </p>
        </div>
      </main>
    </div>
  );
}
