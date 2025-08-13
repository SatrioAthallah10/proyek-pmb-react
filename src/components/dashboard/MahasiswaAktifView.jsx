import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

// --- [PERUBAHAN DIMULAI DI SINI] ---

// Fungsi helper untuk memetakan jalur pendaftaran ke nama yang lebih deskriptif
const getJalurPendaftaranName = (jalur) => {
  const map = {
    'reguler': 'Sarjana Reguler',
    'rpl': 'Sarjana RPL',
    'magister-reguler': 'Magister Reguler',
    'magister-rpl': 'Magister RPL'
  };
  // Mengganti underscore, mengubah ke huruf kecil, lalu mencari di map.
  // Jika tidak ditemukan, kembalikan teks aslinya dengan format yang lebih baik.
  const formattedJalur = jalur.toLowerCase().replace(/_/g, '-');
  return map[formattedJalur] || jalur.replace(/_/g, ' ').toUpperCase();
};

// Komponen untuk menampilkan baris tabel data mahasiswa
const MahasiswaRow = ({ mahasiswa }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mahasiswa.npm || 'Belum Ada'}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{mahasiswa.name}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mahasiswa.email}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        {/* Menggunakan fungsi helper yang baru dibuat */}
        {getJalurPendaftaranName(mahasiswa.jalur_pendaftaran)}
      </span>
    </td>
  </tr>
);

// --- [PERUBAHAN SELESAI DI SINI] ---


const MahasiswaAktifView = () => {
  const [mahasiswaAktif, setMahasiswaAktif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fungsi untuk mengambil data mahasiswa aktif dari backend
  const fetchMahasiswaAktif = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // Kita akan membuat endpoint ini di backend nanti
      const response = await axios.get('http://localhost:8000/api/kepala-bagian/active-students', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm }
      });
      setMahasiswaAktif(response.data);
    } catch (err) {
      setError('Gagal memuat data mahasiswa aktif. Pastikan endpoint API sudah benar.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMahasiswaAktif();
  }, [fetchMahasiswaAktif]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMahasiswaAktif();
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
              placeholder="Cari NPM atau Nama..."
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mahasiswaAktif.length > 0 ? (
              mahasiswaAktif.map((mahasiswa) => (
                <MahasiswaRow key={mahasiswa.id} mahasiswa={mahasiswa} />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  Tidak ada data mahasiswa aktif yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MahasiswaAktifView;