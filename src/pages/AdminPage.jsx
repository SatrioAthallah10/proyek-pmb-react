import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import AdminNav from '../components/dashboard/AdminNav';
import ProgressModal from '../components/dashboard/ProgressModal';
import MahasiswaAktifView from '../components/dashboard/MahasiswaAktifView';
import { FaUserPlus, FaUserCheck, FaCreditCard, FaUserGraduate, FaSearch, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

// --- [PERBAIKAN FINAL] Komponen-komponen kecil dipindahkan ke luar dari komponen induknya ---

// Komponen InputField untuk form
const InputField = ({ name, type, placeholder, icon, value, onChange, error }) => (
    <div className="mb-4">
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`}
                required
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
);

// Komponen StatCard untuk statistik
const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center ${color}`}>
        <div className="mr-4 text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

// Komponen StatChart untuk statistik
const StatChart = ({ data }) => {
    if (!data) return null;
    const maxValue = data.total_pendaftar || 1;
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

// Komponen StatusIcon untuk tabel
const StatusIcon = ({ isConfirmed }) => (
    isConfirmed ? <span className="text-green-500">✔️ Lunas</span> : <span className="text-red-500">❌ Belum</span>
);


// Komponen untuk form tambah staff
const TambahStaffView = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess('');

        if (formData.password !== formData.password_confirmation) {
            setError({ password_confirmation: ['Konfirmasi password tidak cocok.'] });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/admin/register-staff', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Akun staff berhasil dibuat!');
            setFormData({ name: '', email: '', password: '', password_confirmation: '' }); // Reset form
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setError(err.response.data.errors);
            } else {
                setError({ general: ['Terjadi kesalahan. Silakan coba lagi.'] });
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">Daftarkan Akun Staff Baru</h1>
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{success}</p></div>}
            {error?.general && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error.general[0]}</p></div>}
            <form onSubmit={handleSubmit}>
                <InputField name="name" type="text" placeholder="Nama Lengkap" icon={<FaUser />} value={formData.name} onChange={handleChange} error={error?.name} />
                <InputField name="email" type="email" placeholder="Alamat Email" icon={<FaEnvelope />} value={formData.email} onChange={handleChange} error={error?.email} />
                <InputField name="password" type="password" placeholder="Password" icon={<FaLock />} value={formData.password} onChange={handleChange} error={error?.password} />
                <InputField name="password_confirmation" type="password" placeholder="Konfirmasi Password" icon={<FaLock />} value={formData.password_confirmation} onChange={handleChange} error={error?.password_confirmation} />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                    {loading ? 'Mendaftarkan...' : 'Daftarkan Staff'}
                </button>
            </form>
        </div>
    );
};

// Komponen untuk Halaman Statistik
const StatistikView = ({ stats, loading, error }) => {
    if (loading) return <div className="text-center p-8">Memuat data statistik...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!stats) return <div className="text-center p-8">Data statistik tidak tersedia.</div>;

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

// Komponen untuk Halaman Konfirmasi Pembayaran
const KonfirmasiPembayaranView = ({ users, loading, error, onConfirm }) => {
    if (loading) return <div className="text-center p-8">Memuat data pendaftar...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Konfirmasi Pembayaran</h1>
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

// Komponen untuk Manajemen Pendaftar
const ManajemenPendaftarView = ({ users, loading, error, onConfirm, onUserClick, setSearchInput, handleSearch }) => {

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
    const [activeView, setActiveView] = useState('');

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
            const endpoint = role === 'kepala_bagian' || role === 'staff' 
                ? 'http://localhost:8000/api/admin/users' 
                : '';

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

        if (loggedInUser?.role) {
            let defaultView = '';
            if (loggedInUser.role === 'owner') defaultView = 'dashboard';
            else if (loggedInUser.role === 'staff') defaultView = 'konfirmasi-pembayaran';
            else if (loggedInUser.role === 'kepala_bagian') defaultView = 'dashboard';
            setActiveView(defaultView);
        }
    }, []);

    useEffect(() => {
        if (!adminUser?.role) return;

        setLoading(true);
        setError(null);
        setUsers([]);
        setStats(null);

        if (activeView === 'dashboard') {
            fetchStats();
        } else if (activeView === 'manajemen-pendaftar' || activeView === 'konfirmasi-pembayaran') {
            fetchData(adminUser.role);
        } else {
            setLoading(false);
        }
    }, [activeView, adminUser, fetchData, fetchStats]);

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    const handleUserClick = async (user) => {
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
            fetchData(adminUser.role);
        } catch (err) {
            alert('Konfirmasi gagal. Pastikan Anda memiliki hak akses.');
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader user={adminUser} />
            <AdminNav activeView={activeView} setActiveView={setActiveView} role={adminUser?.role} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {activeView === 'dashboard' && (adminUser?.role === 'owner' || adminUser?.role === 'kepala_bagian') &&
                    <StatistikView stats={stats} loading={loading} error={error} />
                }
                {activeView === 'konfirmasi-pembayaran' && (adminUser?.role === 'staff' || adminUser?.role === 'kepala_bagian') &&
                    <KonfirmasiPembayaranView users={users} loading={loading} error={error} onConfirm={handleConfirm} />
                }
                {activeView === 'manajemen-pendaftar' && adminUser?.role === 'kepala_bagian' &&
                    <ManajemenPendaftarView users={users} loading={loading} error={error} onConfirm={handleConfirm} onUserClick={handleUserClick} setSearchInput={setSearchInput} handleSearch={handleSearch} />
                }
                {activeView === 'mahasiswa-aktif' && adminUser?.role === 'kepala_bagian' &&
                    <MahasiswaAktifView />
                }
                {activeView === 'tambah-staff' && adminUser?.role === 'kepala_bagian' &&
                    <TambahStaffView />
                }
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
