import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import AdminNav from '../components/dashboard/AdminNav';

// Komponen untuk menampilkan status boolean sebagai ikon
const StatusIcon = ({ isConfirmed }) => (
  isConfirmed 
    ? <span className="text-green-500">✔️</span> 
    : <span className="text-red-500">❌</span>
);

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [activeView, setActiveView] = useState('manajemen-pendaftar');

  const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err) {
        setError('Gagal memuat data pengguna. Pastikan Anda login sebagai admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setAdminUser(loggedInUser);
    fetchUsers();
  }, []);

  const handleConfirm = async (userId, confirmationType) => {
    if (!window.confirm('Apakah Anda yakin ingin mengonfirmasi tahap ini?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const url = `http://localhost:8000/api/admin/users/${userId}/${confirmationType}`;
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Konfirmasi berhasil!');
      fetchUsers(); // Memuat ulang data setelah konfirmasi
    } catch (err) {
      alert('Konfirmasi gagal. Silakan coba lagi.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader user={adminUser} />
      <AdminNav activeView={activeView} setActiveView={setActiveView} />
      
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'manajemen-pendaftar' && (
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
                    {/* --- KOLOM BARU DITAMBAHKAN --- */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti Bayar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pendaftaran_awal} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm"><StatusIcon isConfirmed={user.pembayaran} /></td>
                      {/* --- KONTEN KOLOM BARU --- */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.bukti_pembayaran_path ? (
                          <a 
                            href={`http://localhost:8000/storage/${user.bukti_pembayaran_path}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Lihat Bukti
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row gap-2">
                          {!user.pendaftaran_awal && <button onClick={() => handleConfirm(user.id, 'confirm-initial-registration')} className="text-indigo-600 hover:text-indigo-900">Konfirmasi Awal</button>}
                          
                          {/* --- LOGIKA TOMBOL DIPERBAIKI --- */}
                          {/* Muncul jika pendaftaran awal selesai, bukti sudah ada, dan pembayaran belum dikonfirmasi */}
                          {user.pendaftaran_awal && user.bukti_pembayaran_path && !user.pembayaran && (
                            <button onClick={() => handleConfirm(user.id, 'confirm-payment')} className="text-green-600 hover:text-green-900">
                              Konfirmasi Bayar
                            </button>
                          )}

                          {user.pembayaran && !user.daftar_ulang && (
                            <button onClick={() => handleConfirm(user.id, 'confirm-reregistration')} className="text-blue-600 hover:text-blue-900">
                              Konfirmasi Daful
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
