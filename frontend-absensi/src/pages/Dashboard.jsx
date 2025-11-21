import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabTugas from '../components/TabTugas';
import TabPresensi from '../components/TabPresensi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tugas');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) navigate('/');
    else setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!user) return <div className="flex items-center justify-center h-screen text-blue-600">Memuat Data...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Navbar Modern */}
      <nav className="px-8 py-5 bg-gradient-to-r from-indigo-700 to-blue-600 text-white shadow-xl flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Absensi App</h1>
          <p className="text-xs font-medium text-blue-100 opacity-90 mt-1 uppercase tracking-wide">
            {user.name} • {user.role}
          </p>
        </div>
        <button onClick={handleLogout} 
          className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition font-bold text-sm">
          Keluar
        </button>
      </nav>

      <div className="container mx-auto p-6 max-w-5xl">
        {/* Tab Navigasi Style Pill */}
        <div className="flex space-x-2 bg-white p-1.5 rounded-2xl shadow-sm mb-8 w-fit mx-auto">
          <button 
            onClick={() => setActiveTab('tugas')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'tugas' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            Daftar Tugas
          </button>
          <button 
            onClick={() => setActiveTab('presensi')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'presensi' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            Presensi
          </button>
        </div>

        {/* Konten */}
        <div className="animate-fade-in-up">
          {activeTab === 'tugas' ? <TabTugas /> : <TabPresensi />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;