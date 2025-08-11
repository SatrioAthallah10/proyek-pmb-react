import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

// Menerima 'user' sebagai prop, bukan lagi 'setActiveView'
const KonfirmasiDaftarUlangView = ({ user, refetchUserData, isRpl = false }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Choose file...');
    const [sppChoice, setSppChoice] = useState('');
    const [formData, setFormData] = useState({
        keterangan: '',
        namaPengirim: '',
        nominalTransfer: '',
        tanggalTransfer: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Mengisi keterangan dengan nama pengguna dari prop
    useEffect(() => {
        if (user && user.name) {
            setFormData(prev => ({ ...prev, keterangan: `Pembayaran daftar ulang ${user.name}`}));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        if (!file) {
            setError('Silakan unggah bukti pembayaran.');
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token'); // Menggunakan kunci 'token' yang benar
        const dataToSend = new FormData();
        dataToSend.append('buktiPembayaran', file);
        dataToSend.append('keterangan', formData.keterangan);
        dataToSend.append('namaPengirim', formData.namaPengirim);
        dataToSend.append('nominalTransfer', formData.nominalTransfer);
        dataToSend.append('tanggalTransfer', formData.tanggalTransfer);

        const apiUrl = isRpl 
            ? 'http://127.0.0.1:8000/api/rpl/submit-konfirmasi-daful' 
            : 'http://127.0.0.1:8000/api/submit-konfirmasi-daful';

        try {
            // Mengganti fetch dengan axios
            const response = await axios.post(apiUrl, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            
            setMessage(response.data.message || 'Konfirmasi berhasil!');
            setTimeout(() => {
                if (refetchUserData) refetchUserData();
            }, 1500);

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Gagal mengirim data.');
            } else {
                setError('Terjadi kesalahan koneksi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center p-8">Memuat data...</div>;
    }
    
    if (user.pembayaran_daful_status === 'Pembayaran Sudah Dikonfirmasi') {
        return (
             <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-md inline-block">File telah diverifikasi oleh admin</p>
                <div className="mt-6 text-gray-600 text-left space-y-2 max-w-lg mx-auto">
                    <p>Terima kasih sudah melakukan konfirmasi pembayaran Daftar Ulang. Selanjutnya kami akan melakukan verifikasi pembayaran yang telah anda lakukan. Silahkan tunggu notifikasi dari kami.</p>
                    <p>Jika ada kendala, jangan ragu hubungi admin</p>
                </div>
                <button type="button" className="mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto">
                    <FaWhatsapp /> WHATSAPP ADMIN PMB ITATS
                </button>
            </div>
        );
    }

    const biaya = {
        dpp: 0,
        daftarUlang: 300000,
        kegiatanPendahuluan: 1350000,
        spp: sppChoice === 'semester' ? 7020000 : (sppChoice === 'bulan' ? 1300000 : 0)
    };
    const totalPembayaran = biaya.dpp + biaya.daftarUlang + biaya.kegiatanPendahuluan + biaya.spp;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-4">Informasi Pembayaran Daftar Ulang</h1>
            
            <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex justify-between items-center">
                    <span>Dana Pengembangan Pendidikan (DPP) - Beasiswa 100%</span>
                    <span className="font-semibold">Rp. {biaya.dpp.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Daftar Ulang</span>
                    <span className="font-semibold">Rp. {biaya.daftarUlang.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span>Kegiatan Pendahuluan *</span>
                        <p className="text-xs text-gray-500">*Kegiatan Pendahuluan, Pengenalan Kampus, Tes TEFL, Tes TPA dan Atribut Almamater.</p>
                    </div>
                    <span className="font-semibold">Rp. {biaya.kegiatanPendahuluan.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>SPP / Biaya Penyelenggaraan Pendidikan (BPP) * <span className="font-bold text-blue-600">Opsional</span></span>
                    <select value={sppChoice} onChange={(e) => setSppChoice(e.target.value)} className="border rounded-md px-2 py-1">
                        <option value="">-- Pilih Pembayaran SPP --</option>
                        <option value="bulan">Per Bulan (Rp 1.300.000)</option>
                        <option value="semester">Per Semester (Rp 7.020.000)</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 mt-4">
                <span className="text-xl font-bold text-gray-800">Total Pembayaran</span>
                <span className="text-2xl font-bold text-red-600">Rp. {totalPembayaran.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="mt-8 text-center bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Pembayaran dapat dilakukan melalui :</p>
                <p className="text-gray-600">Loket Pendaftaran ITATS</p>
                <p className="font-bold">atau</p>
                <p className="text-gray-600">Transfer ke Bank Syariah Indonesia (BSI) Atas Nama ITATS</p>
                <p className="text-lg font-bold">Nomor rekening: 799-799-7934</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t">
                {message && <p className="text-center text-green-600 mb-4">{message}</p>}
                {error && <p className="text-center text-red-600 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1"><FaPaperclip className="inline-block mr-1" />Upload Scan Bukti Pembayaran</label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-daful" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg hover:bg-gray-300">Browse</label>
                        <input id="bukti-daful" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                    <p className="text-red-600 text-xs mt-1">* Anda bisa mengunggah 2 file</p>
                </div>

                <div className="mb-6">
                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea id="keterangan" name="keterangan" rows="3" value={formData.keterangan} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label htmlFor="namaPengirim" className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim</label>
                        <input type="text" id="namaPengirim" name="namaPengirim" value={formData.namaPengirim} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="nominalTransfer" className="block text-sm font-medium text-gray-700 mb-1">Nominal Transfer</label>
                        <input type="number" id="nominalTransfer" name="nominalTransfer" value={formData.nominalTransfer} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="tanggalTransfer" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transfer</label>
                        <div className="relative">
                            <input type="date" id="tanggalTransfer" name="tanggalTransfer" value={formData.tanggalTransfer} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Mengirim...' : 'Kirim Konfirmasi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KonfirmasiDaftarUlangView;
