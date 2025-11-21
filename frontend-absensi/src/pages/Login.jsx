import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State Form (Role dihapus karena otomatis 'karyawan')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Password (Minimal 8 Karakter)
    if (isRegister && password.length < 8) {
      alert("⚠️ Keamanan: Password wajib minimal 8 karakter!");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        // 2. Register: Role otomatis di-hardcode jadi 'karyawan'
        await axios.post('http://localhost:5001/auth/register', {
          username, 
          password, 
          full_name: fullName, 
          role: 'karyawan' 
        });
        alert("Registrasi Berhasil! Silakan Login.");
        setIsRegister(false);
        setPassword(''); // Reset password untuk keamanan
      } else {
        // 3. Login
        const response = await axios.post('http://localhost:5001/auth/login', {
          username, 
          password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Gagal: " + (error.response?.data?.message || "Terjadi Kesalahan"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 font-sans">
      <div className="p-10 bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        
        <h2 className="mb-2 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {isRegister ? 'Buat Akun Baru' : 'Selamat Datang'}
        </h2>
        <p className="text-center text-gray-400 text-sm mb-8 font-medium">
          {isRegister ? 'Daftar sebagai karyawan' : 'Silakan login untuk melanjutkan'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Nama Lengkap (Hanya Register) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Nama Lengkap</label>
              <input type="text" required 
                placeholder="Nama sesuai KTP"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-semibold text-gray-700"
                value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          )}

          {/* Input Username */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Username</label>
            <input type="text" required 
              placeholder="Username unik"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-semibold text-gray-700"
              value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Password</label>
            <input type="password" required 
              placeholder={isRegister ? "Minimal 8 karakter" : "Masukkan password"}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-semibold text-gray-700"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/* Peringatan Password Kurang dari 8 Karakter */}
            {isRegister && password.length > 0 && password.length < 8 && (
              <p className="text-xs text-red-500 font-bold mt-1 ml-1 animate-pulse">
                ⚠️ Kurang {8 - password.length} karakter lagi
              </p>
            )}
          </div>

          {/* Bagian Pilihan Role DIHAPUS sesuai permintaan */}

          {/* Tombol Submit */}
          <button type="submit" disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-1 mt-4
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'}`}>
            {isLoading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Aplikasi')}
          </button>
        </form>

        {/* Ganti Mode */}
        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <button onClick={() => { setIsRegister(!isRegister); setPassword(''); }} 
            className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">
            {isRegister ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;