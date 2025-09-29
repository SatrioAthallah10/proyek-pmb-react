import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaEnvelope } from 'react-icons/fa6';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const { user, access_token } = response.data;

      if (user && access_token) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        let dashboardPath = '/'; // Path default
        const adminRoles = ['admin', 'kepala_bagian', 'staff', 'owner'];
        
        if (user.role && adminRoles.includes(user.role)) {
          dashboardPath = '/admin';
        } else {
          // --- [PERBAIKAN LOGIKA PENGALIHAN DI SINI] ---
          // Menyesuaikan case dengan nilai string yang dikirim dari backend
          switch (user.jalur_pendaftaran) {
            case 'rpl':
            case 'Sarjana RPL': // Menambahkan case untuk format dari backend lama
              dashboardPath = '/dashboard-rpl';
              break;
            case 'magister-reguler':
            case 'Magister Reguler': // Menambahkan case untuk format dari backend
              dashboardPath = '/dashboard-magister';
              break;
            case 'magister-rpl':
            case 'Magister RPL': // Menambahkan case untuk format dari backend
              dashboardPath = '/dashboard-magister-rpl';
              break;
            case 'reguler':
            case 'Sarjana Reguler': // Menambahkan case untuk format dari backend lama
            default:
              dashboardPath = '/dashboard';
              break;
          }
        }

        // --- [FUNGSI DEBUG DITAMBAHKAN DI SINI] ---
        // Tampilkan tujuan di console untuk debugging
        console.log('Login successful. User role:', user.role, 'Jalur:', user.jalur_pendaftaran);
        console.log('Redirecting to:', dashboardPath);
        // --- [FUNGSI DEBUG SELESAI DI SINI] ---

        navigate(dashboardPath);

      } else {
        throw new Error('Respons login tidak valid dari server.');
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login gagal.');
      } else {
        setError(err.message || 'Terjadi kesalahan pada server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/images/gambar-hero-section.jpeg')" }}>
        <div className="flex flex-col justify-end h-full p-12 bg-black bg-opacity-50 text-white">
          <h2 className="text-4xl font-bold">Selamat Datang Kembali!</h2>
          <p className="text-lg mt-2">Masuk untuk melanjutkan proses pendaftaran Anda di ITATS.</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/images/logo_pmb_color.png" alt="Logo PMB" className="mx-auto mb-4 h-20" />
            <h1 className="text-3xl font-bold text-gray-800">Login Akun</h1>
          </div>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="email" 
                  id="email" 
                  placeholder="Masukkan email Anda" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  type="password" 
                  id="password" 
                  placeholder="Masukkan password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#003366] text-white font-bold py-3 rounded-lg hover:bg-[#004a8f] transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
            <div className="text-center mt-6">
              <p>Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Daftar disini</Link></p>
              <Link to="/" className="inline-block mt-2 text-gray-600 hover:underline">← Kembali ke Beranda</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

