import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import AdminNav from '../components/dashboard/AdminNav';
import ProgressModal from '../components/dashboard/ProgressModal';
import { FaUserPlus, FaUserCheck, FaCreditCard, FaUserGraduate } from 'react-icons/fa';

// Komponen StatCard dan StatChart tidak berubah
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
    const maxValue = data.total_pendaftar;
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

const StatusIcon = ({ isConfirmed }) => (
  isConfirmed ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>
);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!users.length) {
        setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const [usersResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/kepala-bagian/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:8000/api/kepala-bagian/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersResponse.data);
      setStats(statsResponse.data);

      // --- [PERBAIKAN] Tambahkan validasi sebelum fetch detail ---
      if (selectedUser && selectedUser.id) {
        const detailResponse = await axios.get(`http://localhost:8000/api/kepala-bagian/users/${selectedUser.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSelectedUser(detailResponse.data);
      }

    } catch (err) {
      // Jangan set error jika errornya 404 karena user belum dipilih
      if (err.response?.status !== 404) {
        setError('Gagal memuat data Kepala Bagian.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, users.length]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setAdminUser(loggedInUser);

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [fetchData]);


  const handleUserClick = async (user) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/kepala-bagian/users/${user.id}`, {
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
    if (!window.confirm('Apakah Anda yakin?')) return;
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8000/api/kepala-bagian/users/${userId}/${confirmationType}`;
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Konfirmasi berhasil!');
      fetchData();
    } catch (err) {
      alert('Konfirmasi gagal.');
      console.error(err);
    }
  };

  const renderView = () => {
    if (loading) return <div className="text-center p-8">Memuat data...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    switch (activeView) {
      case 'dashboard':
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
      case 'manajemen-pendaftar':
        return (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Manajemen Pendaftar</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pendaftaran Awal</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Bayar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td 
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        {user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pendaftaran_awal} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pembayaran} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.bukti_pembayaran_path ? (
                          <a href={`http://localhost:8000/storage/${user.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Lihat Bukti
                          </a>
                        ) : (<span className="text-gray-400">-</span>)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {!user.pendaftaran_awal && <button onClick={() => handleConfirm(user.id, 'confirm-initial-registration')} className="text-indigo-600 hover:text-indigo-900">Konfirmasi Awal</button>}
                          {user.pendaftaran_awal && user.bukti_pembayaran_path && !user.pembayaran && (
                            <button onClick={() => handleConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">Konfirmasi Bayar</button>
                          )}
                          {user.pembayaran && !user.daftar_ulang && (
                            <button onClick={() => handleConfirm(user.id, 'confirm-reregistration')} className="text-blue-600 hover:text-blue-900">Konfirmasi Daful</button>
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
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader user={adminUser} />
      <AdminNav activeView={activeView} setActiveView={setActiveView} />
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
