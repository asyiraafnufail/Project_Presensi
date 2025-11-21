import { useState, useEffect } from 'react';
import axios from 'axios';

const TabPresensi = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData) fetchHistory(userData);
  }, []);

  const fetchHistory = async (currentUser) => {
    try {
      const url = currentUser.role === 'admin' ? 'http://localhost:5001/attendance/all' : `http://localhost:5001/attendance/${currentUser.id}`;
      const response = await axios.get(url);
      setHistory(response.data);
    } catch (error) { console.error(error); }
  };

  const handleCheckIn = async () => {
    setLoading(true); setMessage('');
    try {
      await axios.post('http://localhost:5001/attendance/in', { user_id: user.id });
      setMessage("Check In Berhasil"); fetchHistory(user);
    } catch (error) { setMessage("Gagal Check In"); } 
    finally { setLoading(false); }
  };

  const handleCheckOut = async () => {
    setLoading(true); setMessage('');
    try {
      await axios.post('http://localhost:5001/attendance/out', { user_id: user.id });
      setMessage("Check Out Berhasil"); fetchHistory(user);
    } catch (error) { setMessage("Gagal Check Out"); } 
    finally { setLoading(false); }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleString('id-ID', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-10">
      {/* Area Tombol Absen */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-2xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-8">Panel Presensi</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={handleCheckIn} disabled={loading}
            className="py-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition transform">
            Masuk Kerja
          </button>
          <button onClick={handleCheckOut} disabled={loading}
            className="py-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:scale-[1.02] transition transform">
            Pulang Kerja
          </button>
        </div>
        {message && <div className="mt-6 py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-bold inline-block">{message}</div>}
      </div>

      {/* Tabel History */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-extrabold text-gray-800">
            {user?.role === 'admin' ? "Aktivitas Semua Karyawan" : "Riwayat Aktivitas Saya"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                {user?.role === 'admin' && <th className="p-4 font-bold">Nama</th>}
                <th className="p-4 font-bold">Waktu Masuk</th>
                <th className="p-4 font-bold">Waktu Pulang</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada data</td></tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {user?.role === 'admin' && <td className="p-4 font-bold text-gray-800">{item.full_name}</td>}
                    <td className="p-4 text-blue-600 font-bold">{formatTime(item.check_in_time)}</td>
                    <td className="p-4 text-rose-600 font-bold">{formatTime(item.check_out_time)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${item.check_out_time ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
                        {item.check_out_time ? 'Selesai' : 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabPresensi;