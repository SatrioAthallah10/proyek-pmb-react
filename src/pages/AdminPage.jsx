import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
    FaUserPlus, FaUserCheck, FaCreditCard, FaUserGraduate, FaSearch, 
    FaEnvelope, FaLock, FaUser, FaCog, FaTachometerAlt, FaUsers, 
    FaMoneyCheckAlt 
} from 'react-icons/fa';

// --- [PERBAIKAN 1: IMPOR KOMPONEN YANG BENAR] ---
// Memastikan semua komponen eksternal yang benar diimpor.
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MahasiswaAktifView from '../components/dashboard/MahasiswaAktifView';
import ProgressModal from '../components/dashboard/ProgressModal'; // <- Ini adalah modal yang fungsional


// ===================================================================================
// KOMPONEN-KOMPONEN LOKAL (SEMUA DARI FILE ASLI ANDA DIPERTAHANKAN)
// ===================================================================================
const AdminNav = ({ activeView, setActiveView, permissions }) => {
    const allMenus = [
        { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="mr-2" /> },
        { key: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran', icon: <FaMoneyCheckAlt className="mr-2" /> },
        { key: 'manajemen-pendaftar', label: 'Manajemen Pendaftar', icon: <FaUsers className="mr-2" /> },
        { key: 'mahasiswa-aktif', label: 'Mahasiswa Aktif', icon: <FaUserGraduate className="mr-2" /> },
        { key: 'tambah-staff', label: 'Tambah Staff', icon: <FaUserPlus className="mr-2" /> },
        { key: 'pengaturan-menu', label: 'Pengaturan Menu', icon: <FaCog className="mr-2" /> },
    ];

    const NavButton = ({ viewName, icon, children }) => {
        const isActive = activeView === viewName;
        return (
            <button
                onClick={() => setActiveView(viewName)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                {children}
            </button>
        );
    };

    const renderNavButtons = () => {
        if (!permissions) {
            return <p className="text-gray-400">Memuat menu...</p>;
        }
        const allowedMenus = allMenus.filter(menu => permissions[menu.key]);
        if (allowedMenus.length === 0) {
            return <p className="text-gray-400">Tidak ada menu yang bisa diakses.</p>;
        }
        return allowedMenus.map(menu => (
            <NavButton key={menu.key} viewName={menu.key} icon={menu.icon}>
                {menu.label}
            </NavButton>
        ));
    };

    return (
        <nav className="bg-[#2c3e50] p-3 shadow-md">
            <div className="container mx-auto flex items-center space-x-4 overflow-x-auto">
                {renderNavButtons()}
            </div>
        </nav>
    );
};

const PengaturanMenu = () => {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    const configurableMenus = {
        owner: [{ key: 'dashboard', label: 'Dashboard Statistik' }],
        staff: [{ key: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran' }],
    };

    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/admin/menu-permissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const initialPermissions = {};
            ['owner', 'staff'].forEach(role => {
                initialPermissions[role] = {};
                configurableMenus[role].forEach(menu => {
                    initialPermissions[role][menu.key] = response.data[role]?.[menu.key]?.is_visible ?? false;
                });
            });
            setPermissions(initialPermissions);

        } catch (err) {
            setError('Gagal memuat pengaturan menu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handlePermissionChange = (role, menuKey) => {
        setPermissions(prev => ({
            ...prev,
            [role]: { ...prev[role], [menuKey]: !prev[role][menuKey] }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/api/admin/menu-permissions', { permissions }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Pengaturan menu berhasil disimpan!');
        } catch (err) {
            setError('Gagal menyimpan pengaturan.');
        } finally {
            setLoading(false);
        }
    };

    const ToggleSwitch = ({ menuKey, role, isChecked, onChange }) => (
        <label htmlFor={`${role}-${menuKey}`} className="flex items-center cursor-pointer">
            <div className="relative">
                <input type="checkbox" id={`${role}-${menuKey}`} className="sr-only" checked={isChecked} onChange={onChange}/>
                <div className={`block w-14 h-8 rounded-full ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isChecked ? 'transform translate-x-6' : ''}`}></div>
            </div>
        </label>
    );

    if (loading && Object.keys(permissions).length === 0) return <div className="text-center p-8">Memuat pengaturan...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Pengaturan Akses Menu Admin</h1>
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{success}</p></div>}
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Akses Menu Owner</h2>
                        {configurableMenus.owner.map(menu => (
                            <div key={menu.key} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <span className="font-medium text-gray-600">{menu.label}</span>
                                <ToggleSwitch menuKey={menu.key} role="owner" isChecked={permissions.owner?.[menu.key] || false} onChange={() => handlePermissionChange('owner', menu.key)} />
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Akses Menu Staff</h2>
                        {configurableMenus.staff.map(menu => (
                            <div key={menu.key} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                <span className="font-medium text-gray-600">{menu.label}</span>
                                <ToggleSwitch menuKey={menu.key} role="staff" isChecked={permissions.staff?.[menu.key] || false} onChange={() => handlePermissionChange('staff', menu.key)} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-8">
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                        {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// --- [PERBAIKAN 2: HAPUS KOMPONEN LOKAL YANG SALAH] ---
// Definisi ProgressModal yang sederhana dan salah di bawah ini telah dihapus.
// const ProgressModal = ({ user, onClose, isLoading }) => { ... };
// Kita akan menggunakan versi yang diimpor di atas.


const InputField = ({ name, type, placeholder, icon, value, onChange, error }) => (
    <div className="mb-4">
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span>
            <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'}`} required />
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
);

const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center ${color}`}>
        <div className="mr-4 text-3xl">{icon}</div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

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
                        <div className="w-full bg-gray-200 rounded-full h-4"><div className={`${item.color} h-4 rounded-full`} style={{ width: `${(item.value / maxValue) * 100}%` }}></div></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatusIcon = ({ isConfirmed }) => (isConfirmed ? <span className="text-green-500">✔️ Lunas</span> : <span className="text-red-500">❌ Belum</span>);

const TambahStaffView = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null); setSuccess('');
        if (formData.password !== formData.password_confirmation) {
            setError({ password_confirmation: ['Konfirmasi password tidak cocok.'] });
            setLoading(false); return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/admin/register-staff', formData, { headers: { Authorization: `Bearer ${token}` } });
            setSuccess('Akun staff berhasil dibuat!');
            setFormData({ name: '', email: '', password: '', password_confirmation: '' });
        } catch (err) {
            if (err.response?.data?.errors) setError(err.response.data.errors);
            else setError({ general: ['Terjadi kesalahan. Silakan coba lagi.'] });
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
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors">{loading ? 'Mendaftarkan...' : 'Daftarkan Staff'}</button>
            </form>
        </div>
    );
};

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

const KonfirmasiPembayaranView = ({ users, loading, error, onConfirm }) => {
    if (loading) return <div className="text-center p-8">Memuat data pendaftar...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    return (
        <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Konfirmasi Pembayaran</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.filter(u => u.bukti_pembayaran_path && !u.pembayaran).map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{user.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><span className="text-yellow-600">Menunggu Konfirmasi</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><a href={`http://localhost:8000/storage/${user.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Bukti</a></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button onClick={() => onConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">Konfirmasi Bayar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const ManajemenPendaftarView = ({ users, loading, error, onConfirm, onUserClick, setSearchInput, handleSearch }) => {
    if (loading) return <div className="text-center p-8">Memuat data pendaftar...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Pendaftar</h1>
                <div className="relative"><input type="text" placeholder="Cari nama atau email..." onChange={(e) => setSearchInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pendaftaran Awal</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => onUserClick(user)}>{user.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pendaftaran_awal} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pembayaran} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        {!user.pendaftaran_awal && <button onClick={() => onConfirm(user.id, 'confirm-initial-registration')} className="text-indigo-600 hover:text-indigo-900">Konfirmasi Awal</button>}
                                        {user.pendaftaran_awal && user.bukti_pembayaran_path && !user.pembayaran && <button onClick={() => onConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">Konfirmasi Bayar</button>}
                                        {user.pembayaran && !user.daftar_ulang && <button onClick={() => onConfirm(user.id, 'confirm-reregistration')} className="text-blue-600 hover:text-blue-900">Konfirmasi Daful</button>}
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

// ===================================================================================
// KOMPONEN UTAMA: AdminPage
// ===================================================================================
const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminUser, setAdminUser] = useState(null);
    const [activeView, setActiveView] = useState('');
    const [menuPermissions, setMenuPermissions] = useState(null);
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
            const endpoint = 'http://localhost:8000/api/admin/users';
            const usersResponse = await axios.get(endpoint, { headers: { Authorization: `Bearer ${token}` }, params: { search: searchTerm } });
            setUsers(usersResponse.data);
        } catch (err) {
            setError('Gagal memuat data pendaftar.');
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
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMenuPermissions = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/admin/my-menu', { headers: { Authorization: `Bearer ${token}` } });
            setMenuPermissions(response.data);
            const firstAvailableMenu = Object.keys(response.data)[0];
            if (firstAvailableMenu) setActiveView(firstAvailableMenu);
            else setError("Anda tidak memiliki akses ke menu manapun.");
        } catch (err) {
            setError('Gagal memuat hak akses menu.');
        }
    }, []);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        setAdminUser(loggedInUser);
        if (loggedInUser?.role) fetchMenuPermissions();
    }, [fetchMenuPermissions]);

    useEffect(() => {
        if (!menuPermissions || !activeView) return;
        setLoading(true); setError(null); setUsers([]); setStats(null);
        if (!menuPermissions[activeView]) { setLoading(false); return; }
        if (activeView === 'dashboard') fetchStats();
        else if (['manajemen-pendaftar', 'konfirmasi-pembayaran'].includes(activeView)) fetchData(adminUser.role);
        else setLoading(false);
    }, [activeView, adminUser, menuPermissions, fetchData, fetchStats]);

    const handleSearch = () => setSearchTerm(searchInput);

    const handleUserClick = async (user) => {
        if (adminUser?.role !== 'kepala_bagian') return;
        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/admin/users/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedUser(response.data);
        } catch (err) {
            setIsModalOpen(false);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleConfirm = async (userId, confirmationType) => {
        if (!window.confirm('Apakah Anda yakin ingin mengonfirmasi?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8000/api/admin/users/${userId}/${confirmationType}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            alert('Konfirmasi berhasil!');
            fetchData(adminUser.role);
        } catch (err) {
            alert('Konfirmasi gagal.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader user={adminUser} />
            <AdminNav activeView={activeView} setActiveView={setActiveView} permissions={menuPermissions} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {menuPermissions?.[activeView] && (
                    <>
                        {activeView === 'dashboard' && <StatistikView stats={stats} loading={loading} error={error} />}
                        {activeView === 'konfirmasi-pembayaran' && <KonfirmasiPembayaranView users={users} loading={loading} error={error} onConfirm={handleConfirm} />}
                        {activeView === 'manajemen-pendaftar' && <ManajemenPendaftarView users={users} loading={loading} error={error} onConfirm={handleConfirm} onUserClick={handleUserClick} setSearchInput={setSearchInput} handleSearch={handleSearch} />}
                        {activeView === 'mahasiswa-aktif' && <MahasiswaAktifView />}
                        {activeView === 'tambah-staff' && <TambahStaffView />}
                        {activeView === 'pengaturan-menu' && <PengaturanMenu />}
                    </>
                )}
                 {error && <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>}
            </div>
            
            {/* --- [PERBAIKAN 3: GUNAKAN KOMPONEN YANG BENAR] --- */}
            {/* Pemanggilan ini sekarang akan merujuk ke ProgressModal yang diimpor dari file eksternal */}
            {isModalOpen && <ProgressModal user={selectedUser} onClose={() => setIsModalOpen(false)} isLoading={isModalLoading} />}
        </div>
    );
};

export default AdminPage;