import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';

// Helper function to format dates WITH time
const formatDateWithTime = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Helper function to format dates WITHOUT time
const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Helper function to get descriptive registration path names
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

// Component for the detailed student information modal
const MahasiswaDetailModal = ({ mahasiswa, onClose, loading }) => {
  if (!mahasiswa) return null;

  // Component for each detail item
  const DetailItem = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-200">
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
              {/* Section: Data Diri */}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Data Diri</h3>
              <DetailItem label="Nama Lengkap" value={mahasiswa.name} />
              <DetailItem label="Email" value={mahasiswa.email} />
              <DetailItem label="No. KTP" value={mahasiswa.no_ktp} />
              <DetailItem label="No. Ponsel" value={mahasiswa.no_ponsel} />
              <DetailItem label="Jenis Kelamin" value={mahasiswa.jenis_kelamin} />
              <DetailItem label="Tempat, Tanggal Lahir" value={`${mahasiswa.tempat_lahir}, ${formatDateOnly(mahasiswa.tanggal_lahir)}`} />
              <DetailItem label="Alamat" value={mahasiswa.alamat} />

              {/* Section: Informasi Akademik */}
              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Informasi Akademik</h3>
              <DetailItem label="NPM" value={mahasiswa.npm || 'Belum Diterbitkan'} />
              <DetailItem label="Jalur Pendaftaran" value={getJalurPendaftaranName(mahasiswa.jalur_pendaftaran)} />
              {/* --- PERUBAHAN DI SINI --- */}
              <DetailItem label="Pilihan Kelas" value={mahasiswa.jadwal_kuliah} />
              {/* --- AKHIR PERUBAHAN --- */}
              <DetailItem label="Program Studi Pilihan" value={mahasiswa.prodi_pilihan} />
              <DetailItem label="Asal Sekolah" value={mahasiswa.nama_sekolah} />
              <DetailItem label="Jurusan" value={mahasiswa.jurusan} />
              <DetailItem label="Nilai Rata-rata" value={mahasiswa.nilai_rata_rata} />

              {/* Section: Informasi Verifikasi */}
              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Informasi Verifikasi</h3>
              <DetailItem label="Diverifikasi Pembayaran Oleh" value={mahasiswa.payment_confirmed_by_admin?.name} />
              <DetailItem label="Tanggal Verifikasi Pembayaran" value={formatDateWithTime(mahasiswa.payment_confirmed_at)} />
              <DetailItem label="Diverifikasi Daftar Ulang Oleh" value={mahasiswa.daful_confirmed_by_admin?.name} />
              <DetailItem label="Tanggal Resmi Menjadi Mahasiswa" value={formatDateWithTime(mahasiswa.daful_confirmed_at)} />
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

// Component for each student row in the table
const MahasiswaRow = ({ mahasiswa, onClick }) => (
  <tr className="hover:bg-gray-100 cursor-pointer" onClick={onClick}>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mahasiswa.npm || 'Belum Ada'}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{mahasiswa.name}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mahasiswa.email}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        {getJalurPendaftaranName(mahasiswa.jalur_pendaftaran)}
      </span>
    </td>
  </tr>
);

const MahasiswaAktifView = () => {
  const [mahasiswaAktif, setMahasiswaAktif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Fungsi untuk mengambil data mahasiswa. Sekarang menerima parameter pencarian.
  const fetchMahasiswaAktif = async (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/kepala-bagian/active-students', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: currentSearchTerm } // Menggunakan parameter untuk pencarian
      });
      setMahasiswaAktif(response.data);
    } catch (err) {
      setError('Gagal memuat data mahasiswa aktif.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect ini hanya berjalan sekali saat komponen pertama kali dimuat.
  useEffect(() => {
    fetchMahasiswaAktif(''); // Memuat data awal tanpa filter pencarian
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali

  const handleRowClick = async (mahasiswaId) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://127.0.0.1:8000/api/kepala-bagian/users/${mahasiswaId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedMahasiswa(response.data);
    } catch (err) {
        console.error("Gagal mengambil detail mahasiswa:", err);
        // It's better to use a toast notification than an alert
        alert('Tidak dapat mengambil detail mahasiswa. Silakan coba lagi.');
        setIsModalOpen(false);
    } finally {
        setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMahasiswa(null);
  };

  // This function is called on form submission (clicking 'Cari' or pressing Enter)
  const handleSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    fetchMahasiswaAktif(searchTerm); // Calls fetch with the current search term
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
                <MahasiswaRow key={mahasiswa.id} mahasiswa={mahasiswa} onClick={() => handleRowClick(mahasiswa.id)} />
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

      {isModalOpen && (
        <MahasiswaDetailModal 
            mahasiswa={selectedMahasiswa} 
            onClose={closeModal}
            loading={isModalLoading}
        />
      )}
    </div>
  );
};

export default MahasiswaAktifView;
