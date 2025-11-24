import { useState, useEffect } from 'react';
import axios from 'axios';

const TabTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Ambil URL Backend dari Environment Variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // GANTI URL DI SINI
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) { console.error(error); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // GANTI URL DI SINI
      await axios.post(`${API_URL}/tasks`, { 
        title, 
        description, 
        created_by: user.id 
      });
      setTitle(''); setDescription(''); fetchTasks();
    } catch (error) { alert("Gagal menambah tugas."); }
  };

  const handleComplete = async (taskId) => {
    if (!confirm("Tandai tugas ini selesai?")) return;
    try {
      // GANTI URL DI SINI
      await axios.put(`${API_URL}/tasks/${taskId}/complete`, { 
        user_id: user.id 
      });
      fetchTasks();
    } catch (error) { alert("Gagal update status."); }
  };

  return (
    <div className="space-y-8">
      {/* Form Admin */}
      {user?.role === 'admin' && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Buat Tugas Baru</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <input type="text" placeholder="Judul Tugas" required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-semibold"
              value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Deskripsi tugas..." required rows="3"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-semibold"
              value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition font-bold">
              Publikasikan Tugas
            </button>
          </form>
        </div>
      )}

      {/* List Tugas */}
      <div className="grid gap-5">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 font-bold">Tidak ada tugas pending</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="text-xl font-extrabold text-gray-800">{task.title}</h4>
                <p className="text-gray-600 mt-1 leading-relaxed">{task.description}</p>
                <div className="mt-3 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-bold">
                  {new Date(task.created_at).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => handleComplete(task.id)}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition">
                Tandai Selesai
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TabTugas;