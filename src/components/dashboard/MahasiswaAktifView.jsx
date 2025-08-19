import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaSpinner, FaEdit, FaSave } from 'react-icons/fa';
import { programStudi } from '../../data/mockData'; // Import data prodi

// Helper functions (Tidak ada perubahan)
const formatDateWithTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const getJalurPendaftaranName = (jalur) => {
  const map = {
    'reguler': 'Sarjana Reguler',
    'rpl': 'Sarjana RPL',
    'magister-reguler': 'Magister Reguler',
    'magister-rpl': 'Magister RPL'
  };
  const formattedJalur = jalur ? jalur.toLowerCase().replace(/_/g, '-') : '';
  return map[formattedJalur] || (jalur ? jalur.replace(/_/g, ' ').toUpperCase() : 'Tidak Diketahui');
};

// Modal untuk mengedit data mahasiswa (Tidak ada perubahan)
const EditMahasiswaModal = ({ mahasiswa, onClose, onSave, loading }) => {
    const [formData, setFormData] = useState({
        jadwal_kuliah: mahasiswa.jadwal_kuliah || 'Pagi',
        prodi_pilihan: mahasiswa.prodi_pilihan || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(mahasiswa.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Edit Data: {mahasiswa.name}</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800">
                            <FaTimes size={20} />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="jadwal_kuliah" className="block text-sm font-medium text-gray-700 mb-1">Pilihan Kelas</label>
                            <select
                                id="jadwal_kuliah"
                                name="jadwal_kuliah"
                                value={formData.jadwal_kuliah}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Pagi">Pagi</option>
                                <option value="Malam">Malam</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="prodi_pilihan" className="block text-sm font-medium text-gray-700 mb-1">Program Studi Pilihan</label>
                            <select
                                id="prodi_pilihan"
                                name="prodi_pilihan"
                                value={formData.prodi_pilihan}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>Pilih Program Studi</option>
                                {programStudi.map((prodi) => (
                                    <option key={prodi.id} value={prodi.nama}>{prodi.nama}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end items-center gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-300"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- [PERBAIKAN] Melengkapi modal detail mahasiswa ---
const MahasiswaDetailModal = ({ mahasiswa, onClose, loading }) => {
  if (!mahasiswa) return null;

  const DetailItem = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200 last:border-b-0">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 col-span-2">{value || 'Tidak ada data'}</dd>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Detail Mahasiswa: {mahasiswa.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <dl>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Data Diri</h3>
              <DetailItem label="Nama Lengkap" value={mahasiswa.name} />
              <DetailItem label="Email" value={mahasiswa.email} />
              <DetailItem label="No. KTP" value={mahasiswa.no_ktp} />
              <DetailItem label="No. Ponsel" value={mahasiswa.no_ponsel} />

              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Informasi Akademik</h3>
              <DetailItem label="NPM" value={mahasiswa.npm || 'Belum Diterbitkan'} />
              <DetailItem label="Jalur Pendaftaran" value={getJalurPendaftaranName(mahasiswa.jalur_pendaftaran)} />
              <DetailItem label="Pilihan Kelas" value={mahasiswa.jadwal_kuliah} />
              <DetailItem label="Program Studi Pilihan" value={mahasiswa.prodi_pilihan} />
              <DetailItem label="Asal Sekolah" value={mahasiswa.asal_sekolah} />
              <DetailItem label="Jurusan Sekolah" value={mahasiswa.jurusan_sekolah} />
              <DetailItem label="Rata-rata Nilai" value={mahasiswa.rata_rata_nilai} />

              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Informasi Verifikasi</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-600 mb-2">Tahap 1: Pembayaran Formulir</h4>
                <DetailItem label="Diverifikasi Oleh" value={mahasiswa.payment_confirmed_by_admin?.name} />
                <DetailItem label="Waktu Pengiriman Bukti" value={formatDateWithTime(mahasiswa.bukti_pembayaran_submitted_at)} />
                <DetailItem label="Waktu Verifikasi" value={formatDateWithTime(mahasiswa.payment_confirmed_at)} />
              </div>
              <div className="border border-gray-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-gray-600 mb-2">Tahap 2: Pembayaran Daftar Ulang</h4>
                <DetailItem label="Diverifikasi Oleh" value={mahasiswa.daful_confirmed_by_admin?.name} />
                <DetailItem label="Waktu Pengiriman Bukti" value={formatDateWithTime(mahasiswa.bukti_daful_submitted_at)} />
                <DetailItem label="Waktu Verifikasi (Resmi)" value={formatDateWithTime(mahasiswa.daful_confirmed_at)} />
              </div>
            </dl>
          )}
        </div>
        <div className="p-4 bg-gray-50 border-t text-right">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Tutup
            </button>
        </div>
      </div>
    </div>
  );
};

// Komponen MahasiswaRow (Tidak ada perubahan)
const MahasiswaRow = ({ mahasiswa, onRowClick, onEditClick, adminRole }) => (
  <tr className="hover:bg-gray-100 group">
    <td onClick={onRowClick} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer">{mahasiswa.npm || 'Belum Ada'}</td>
    <td onClick={onRowClick} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 cursor-pointer">{mahasiswa.name}</td>
    <td onClick={onRowClick} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer">{mahasiswa.email}</td>
    <td onClick={onRowClick} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        {getJalurPendaftaranName(mahasiswa.jalur_pendaftaran)}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      {adminRole === 'kepala_bagian' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(mahasiswa);
          }}
          className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Edit Data Mahasiswa"
        >
          <FaEdit size={18} />
        </button>
      )}
    </td>
  </tr>
);

// Komponen Utama MahasiswaAktifView (Tidak ada perubahan logika)
const MahasiswaAktifView = () => {
  const [mahasiswaAktif, setMahasiswaAktif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAdminUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdminUser(response.data);
        } catch (err) {
            console.error("Gagal mengambil data admin:", err);
        }
    };
    fetchAdminUser();
    fetchMahasiswaAktif('');
  }, []);

  const fetchMahasiswaAktif = async (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/active-students', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: currentSearchTerm }
      });
      setMahasiswaAktif(response.data);
    } catch (err) {
      setError('Gagal memuat data mahasiswa aktif.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (mahasiswaId) => {
    setIsDetailModalOpen(true);
    setIsModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/users/${mahasiswaId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedMahasiswa(response.data);
    } catch (err) {
        console.error("Gagal mengambil detail mahasiswa:", err);
        alert('Tidak dapat mengambil detail mahasiswa. Silakan coba lagi.');
        setIsDetailModalOpen(false);
    } finally {
        setIsModalLoading(false);
    }
  };

  const handleEditClick = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async (mahasiswaId, updatedData) => {
    setIsSaving(true);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://127.0.0.1:8000/api/admin/active-students/${mahasiswaId}/update-details`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setMahasiswaAktif(mahasiswaAktif.map(m => m.id === mahasiswaId ? response.data.user : m));
        
        alert(response.data.message);
        closeEditModal();
    } catch (err) {
        console.error("Gagal menyimpan perubahan:", err);
        const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.';
        alert(`Error: ${errorMessage}`);
    } finally {
        setIsSaving(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMahasiswa(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMahasiswa(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMahasiswaAktif(searchTerm);
  };

  if (loading) return <div className="text-center p-8">Memuat data mahasiswa aktif...</div>;
  if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Data Mahasiswa Aktif</h1>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cari
          </button>
        </form>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jalur Pendaftaran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mahasiswaAktif.length > 0 ? (
              mahasiswaAktif.map((mahasiswa) => (
                <MahasiswaRow 
                    key={mahasiswa.id} 
                    mahasiswa={mahasiswa} 
                    onRowClick={() => handleRowClick(mahasiswa.id)}
                    onEditClick={handleEditClick}
                    adminRole={adminUser?.role}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  Tidak ada data mahasiswa aktif yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && (
        <MahasiswaDetailModal 
            mahasiswa={selectedMahasiswa} 
            onClose={closeDetailModal}
            loading={isModalLoading}
        />
      )}

      {isEditModalOpen && (
        <EditMahasiswaModal
            mahasiswa={selectedMahasiswa}
            onClose={closeEditModal}
            onSave={handleSaveChanges}
            loading={isSaving}
        />
      )}
    </div>
  );
};

export default MahasiswaAktifView;
