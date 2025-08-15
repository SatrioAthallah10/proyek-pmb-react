import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import AdminNav from '../components/dashboard/AdminNav';
import ProgressModal from '../components/dashboard/ProgressModal';
import MahasiswaAktifView from '../components/dashboard/MahasiswaAktifView';
import { FaUserPlus, FaUserCheck, FaCreditCard, FaUserGraduate, FaSearch } from 'react-icons/fa';

// --- [PERUBAHAN DIMULAI DI SINI] ---

// Komponen untuk Halaman Statistik (Dilihat oleh Owner & Kepala Bagian)
const StatistikView = ({ stats, loading, error }) => {
    if (loading) return <div className="text-center p-8">Memuat data statistik...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!stats) return <div className="text-center p-8">Data statistik tidak tersedia.</div>;

    const StatCard = ({ icon, title, value, color }) => (
        <div className={`bg-white p-6 rounded-lg shadow-md flex items-center ${color}`}>
            <div className="mr-4 text-3xl">{icon}</div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
    
    // Chart component remains the same as before
    const StatChart = ({ data }) => {
        if (!data) return null;
        const maxValue = data.total_pendaftar || 1; // Avoid division by zero
        const barData = [
            { label: 'Pendaftaran Awal', value: data.pendaftaran_awal_selesai, color: 'bg-blue-500' },
            { label: 'Pembayaran', value: data.pembayaran_selesai, color: 'bg-green-500' },
            { label: 'Daftar Ulang', value: data.daftar_ulang_selesai, color: 'bg-indigo-500' },
        ];
    
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg mb-4">Progres Pendaftaran</h3>
                <div className="space-y-4">
                    {barData.map(item => (
                        <div key={item.label}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="font-medium text-gray-600">{item.label}</span>
                                <span className="text-gray-500">{item.value} / {maxValue}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div 
                                    className={`${item.color} h-4 rounded-full`} 
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Dashboard Statistik</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={<FaUserPlus />} title="Total Pendaftar" value={stats?.total_pendaftar} color="text-blue-500" />
                <StatCard icon={<FaUserCheck />} title="Pendaftaran Awal Selesai" value={stats?.pendaftaran_awal_selesai} color="text-green-500" />
                <StatCard icon={<FaCreditCard />} title="Pembayaran Selesai" value={stats?.pembayaran_selesai} color="text-yellow-500" />
                <StatCard icon={<FaUserGraduate />} title="Daftar Ulang Selesai" value={stats?.daftar_ulang_selesai} color="text-indigo-500" />
            </div>
            <StatChart data={stats} />
        </div>
    );
};

// Komponen untuk Halaman Konfirmasi Pembayaran (Dilihat oleh Staff & Kepala Bagian)
const KonfirmasiPembayaranView = ({ users, loading, error, onConfirm, onUserClick, searchTerm, setSearchTerm }) => {
    if (loading) return <div className="text-center p-8">Memuat data pendaftar...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Konfirmasi Pembayaran</h1>
                {/* Search functionality can be added here if needed */}
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Bayar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.filter(u => u.bukti_pembayaran_path && !u.pembayaran).map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{user.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                    <span className="text-yellow-600">Menunggu Konfirmasi</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <a href={`http://localhost:8000/storage/${user.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Lihat Bukti
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => onConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">
                                        Konfirmasi Bayar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

// Komponen untuk Manajemen Pendaftar (Hanya Dilihat oleh Kepala Bagian)
const ManajemenPendaftarView = ({ users, loading, error, onConfirm, onUserClick, searchTerm, setSearchInput, handleSearch }) => {
    const StatusIcon = ({ isConfirmed }) => (
        isConfirmed ? <span className="text-green-500">✔️ Lunas</span> : <span className="text-red-500">❌ Belum</span>
    );

    if (loading) return <div className="text-center p-8">Memuat data pendaftar...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pendaftar</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari nama atau email..."
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    <button onClick={handleSearch} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">
                        Cari
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pendaftaran Awal</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => onUserClick(user)}>
                                    {user.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pendaftaran_awal} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pembayaran} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {!user.pendaftaran_awal && <button onClick={() => onConfirm(user.id, 'confirm-initial-registration')} className="text-indigo-600 hover:text-indigo-900">Konfirmasi Awal</button>}
                                        {user.pendaftaran_awal && user.bukti_pembayaran_path && !user.pembayaran && (
                                            <button onClick={() => onConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">Konfirmasi Bayar</button>
                                        )}
                                        {user.pembayaran && !user.daftar_ulang && (
                                            <button onClick={() => onConfirm(user.id, 'confirm-reregistration')} className="text-blue-600 hover:text-blue-900">Konfirmasi Daful</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};


const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [activeView, setActiveView] = useState(''); // Dikosongkan dulu, akan diisi di useEffect

    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async (role) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            let endpoint = '';
            
            // Tentukan endpoint berdasarkan peran
            if (role === 'kepala_bagian') {
                endpoint = 'http://localhost:8000/api/admin/users';
            } else if (role === 'staff') {
                endpoint = 'http://localhost:8000/api/admin/users-for-confirmation';
            }

            if (endpoint) {
                const usersResponse = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { search: searchTerm }
                });
                setUsers(usersResponse.data);
            }
        } catch (err) {
            setError('Gagal memuat data pendaftar.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const statsResponse = await axios.get('http://localhost:8000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
            setStats(statsResponse.data);
        } catch (err) {
            setError('Gagal memuat data statistik.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        setAdminUser(loggedInUser);

        // Tentukan view default berdasarkan peran
        if (loggedInUser?.role) {
            let defaultView = '';
            if (loggedInUser.role === 'owner') defaultView = 'dashboard';
            else if (loggedInUser.role === 'staff') defaultView = 'konfirmasi-pembayaran';
            else if (loggedInUser.role === 'kepala_bagian') defaultView = 'dashboard';
            setActiveView(defaultView);
        }
    }, []);

    // useEffect terpisah untuk fetch data ketika activeView berubah
    useEffect(() => {
        if (!adminUser?.role) return;

        if (activeView === 'dashboard') {
            fetchStats();
        } else if (activeView === 'manajemen-pendaftar' || activeView === 'konfirmasi-pembayaran') {
            fetchData(adminUser.role);
        }
    }, [activeView, adminUser, fetchData, fetchStats]);

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    const handleUserClick = async (user) => {
        // Hanya Kepala Bagian yang bisa melihat detail lengkap
        if (adminUser?.role !== 'kepala_bagian') return;

        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/admin/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(response.data);
        } catch (err) {
            console.error("Gagal mengambil detail user:", err);
            setIsModalOpen(false);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleConfirm = async (userId, confirmationType) => {
        if (!window.confirm('Apakah Anda yakin ingin mengonfirmasi?')) return;
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8000/api/admin/users/${userId}/${confirmationType}`;
            await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
            alert('Konfirmasi berhasil!');
            fetchData(adminUser.role); // Refresh data
        } catch (err) {
            alert('Konfirmasi gagal. Pastikan Anda memiliki hak akses.');
            console.error(err);
        }
    };

    const renderView = () => {
        const role = adminUser?.role;
        if (!role) return <div className="text-center p-8">Memuat data admin...</div>;

        switch (activeView) {
            case 'dashboard':
                if (role === 'owner' || role === 'kepala_bagian') {
                    return <StatistikView stats={stats} loading={loading} error={error} />;
                }
                return null;
            
            case 'konfirmasi-pembayaran':
                if (role === 'staff' || role === 'kepala_bagian') {
                    return <KonfirmasiPembayaranView users={users} loading={loading} error={error} onConfirm={handleConfirm} />;
                }
                return null;

            case 'manajemen-pendaftar':
                if (role === 'kepala_bagian') {
                    return <ManajemenPendaftarView users={users} loading={loading} error={error} onConfirm={handleConfirm} onUserClick={handleUserClick} searchTerm={searchTerm} setSearchInput={setSearchInput} handleSearch={handleSearch} />;
                }
                return null;

            case 'mahasiswa-aktif':
                if (role === 'kepala_bagian') {
                    return <MahasiswaAktifView />;
                }
                return null;

            default:
                return <div className="text-center p-8">Selamat datang, {adminUser.name}. Silakan pilih menu.</div>;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader user={adminUser} />
            {/* Mengirimkan peran ke AdminNav agar bisa menampilkan menu yang sesuai */}
            <AdminNav activeView={activeView} setActiveView={setActiveView} role={adminUser?.role} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderView()}
            </div>
            
            {isModalOpen && (
                <ProgressModal 
                    user={selectedUser} 
                    onClose={() => setIsModalOpen(false)}
                    isLoading={isModalLoading}
                />
            )}
        </div>
    );
};

export default AdminPage;

// --- [PERUBAHAN SELESAI DI SINI] ---