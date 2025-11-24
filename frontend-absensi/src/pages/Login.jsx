import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Ambil URL Backend dari Environment Variable
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isRegister && password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Lemah',
        text: 'Password wajib minimal 8 karakter!',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        // GANTI URL DI SINI
        await axios.post(`${API_URL}/auth/register`, {
          username, 
          password, 
          full_name: fullName, 
          role: 'karyawan' 
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Registrasi Berhasil!',
          text: 'Akun Anda telah dibuat. Silakan login.',
          confirmButtonColor: '#3085d6',
        });
        
        setIsRegister(false);
        setPassword('');
      } else {
        // GANTI URL DI SINI
        const response = await axios.post(`${API_URL}/auth/login`, {
          username, 
          password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        await Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: `Selamat datang, ${response.data.user.name}`,
          timer: 1500,
          showConfirmButton: false
        });

        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || "Terjadi Kesalahan Koneksi",
        confirmButtonColor: '#d33',
      });
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
          
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Nama Lengkap</label>
              <input type="text" required 
                placeholder="Nama sesuai KTP"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold"
                value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Username</label>
            <input type="text" required 
              placeholder="Username unik"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold"
              value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1 ml-1">Password</label>
            <input type="password" required 
              placeholder={isRegister ? "Minimal 8 karakter" : "Masukkan password"}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-semibold"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {isRegister && password.length > 0 && password.length < 8 && (
              <p className="text-xs text-red-500 font-bold mt-1 ml-1 animate-pulse">
                ⚠️ Kurang {8 - password.length} karakter lagi
              </p>
            )}
          </div>

          <button type="submit" disabled={isLoading}
            className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-all transform hover:-translate-y-1 mt-4
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'}`}>
            {isLoading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Aplikasi')}
          </button>
        </form>

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