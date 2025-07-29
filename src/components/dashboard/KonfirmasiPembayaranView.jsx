import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

const KonfirmasiPembayaranView = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Choose file...');
    const [formData, setFormData] = useState({
        keterangan: 'Bukti pembayaran pendaftaran awal',
        namaPengirim: '',
        nominalTransfer: '',
        tanggalTransfer: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // State untuk menyimpan data progres user
    const [userProgress, setUserProgress] = useState(null);

    // Ambil data progres dari API saat komponen dimuat
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                const data = await response.json();
                setUserProgress(data);
            } catch (e) {
                setError('Gagal memuat data pengguna.');
            }
        };

        fetchUserData();
    }, []);

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

        const token = localStorage.getItem('authToken');
        const dataToSend = new FormData();
        dataToSend.append('buktiPembayaran', file);
        dataToSend.append('keterangan', formData.keterangan);
        dataToSend.append('namaPengirim', formData.namaPengirim);
        dataToSend.append('nominalTransfer', formData.nominalTransfer);
        dataToSend.append('tanggalTransfer', formData.tanggalTransfer);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/submit-konfirmasi-pembayaran', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: dataToSend,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengirim data.');
            }

            setMessage('Konfirmasi berhasil! Halaman akan dimuat ulang.');
            setTimeout(() => window.location.reload(), 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Tampilan loading
    if (!userProgress) {
        return <div className="text-center p-8">Memuat data...</div>;
    }
    
    // Tampilan jika sudah lunas
    if (userProgress.pembayaran_form_status === 'Pembayaran Sudah Dikonfirmasi') {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Pembayaran Formulir Pendaftaran</h1>
                <p className="text-xl font-bold text-green-500 mb-2">LUNAS</p>
                <p className="text-gray-500 text-sm">Terima kasih, konfirmasi pembayaran <strong>Formulir Pendaftaran</strong> sebesar :</p>
                <p className="text-4xl font-bold text-gray-800 my-4">Rp. 300.778</p>
                <p className="text-gray-500 text-sm">telah berhasil diverifikasi oleh tim kami</p>
                 <div className="mt-6 pt-6 border-t">
                    <p>File yang telah Anda upload :</p>
                    <a href={`http://127.0.0.1:8000/storage/${userProgress.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {userProgress.bukti_pembayaran_path.split('/').pop()}
                    </a>
                 </div>
            </div>
        );
    }

    // Tampilan default (form konfirmasi)
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Pembayaran Formulir Pendaftaran</h1>
                <p className="text-gray-500 text-sm">Silakan lakukan konfirmasi pembayaran <strong>Formulir Pendaftaran</strong> sebesar:</p>
                <p className="text-4xl font-bold text-gray-800 my-4">Rp. 300.778</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t">
                 {message && <p className="text-center text-green-600 mb-4">{message}</p>}
                 {error && <p className="text-center text-red-600 mb-4">{error}</p>}
                
                {/* ... sisa formulir tetap sama ... */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Scan Bukti Pembayaran <FaPaperclip className="inline-block ml-1" />
                    </label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-pembayaran" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg hover:bg-gray-300">
                            Browse
                        </label>
                        <input id="bukti-pembayaran" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
                <p className="text-red-600 text-xs mb-1">* Anda bisa mengunggah 2 file</p>
                <p className="text-gray-600 text-xs mb-6">Bagi Calon Mahasiswa yang mengambil jalur Undangan, tambahkan upload kartu UTBK Anda</p>

                <div className="mb-6">
                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea id="keterangan" name="keterangan" rows="3" value={formData.keterangan} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label htmlFor="namaPengirim" className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim Transfer</label>
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
                 <div className="text-center text-gray-600">
                    <p>Selanjutnya kami akan melakukan verifikasi pembayaran yang telah anda lakukan. Silahkan tunggu notifikasi dari kami.</p>
                    <button type="button" className="mt-4 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto">
                        <FaWhatsapp /> WHATSAPP ADMIN PMB ITATS
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KonfirmasiPembayaranView;