import React, { useState } from 'react';
import { FaLock, FaEnvelope } from 'react-icons/fa';

/**
 * Komponen untuk halaman login yang terhubung ke backend Laravel.
 */
// PERBAIKAN: Menerima prop setUserData
const LoginPage = ({ setCurrentPage, setIsLoggedIn, setUserData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat().join(' ');
                    throw new Error(errorMessages);
                }
                throw new Error(data.message || 'Login gagal.');
            }

            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userData', JSON.stringify(data.user));

            // PERBAIKAN: Memperbarui kedua state secara bersamaan.
            // React 18 akan menggabungkan ini menjadi satu re-render.
            setIsLoggedIn(true);
            setUserData(data.user);

        } catch (err) {
            setError(err.message);
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
                    <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg">
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
                            <p>Belum punya akun? <a href="#" onClick={() => setCurrentPage('register')} className="text-blue-600 hover:underline font-semibold">Daftar disini</a></p>
                            <a href="#" onClick={() => setCurrentPage('home')} className="inline-block mt-2 text-gray-600 hover:underline">← Kembali ke Beranda</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
