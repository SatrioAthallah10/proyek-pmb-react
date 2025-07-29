import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

const KonfirmasiDaftarUlangView = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('Choose file...');
    const [formData, setFormData] = useState({
        keterangan: 'Pembayaran daftar ulang',
        namaPengirim: '',
        nominalTransfer: '',
        tanggalTransfer: '',
    });
    const [userProgress, setUserProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setUserProgress(data);
                // Set nama user di keterangan
                if (data.name) {
                    setFormData(prev => ({ ...prev, keterangan: `Pembayaran daftar ulang ${data.name}`}));
                }
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
            const response = await fetch('http://127.0.0.1:8000/api/submit-konfirmasi-daful', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: dataToSend,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            setMessage('Konfirmasi berhasil! Halaman akan dimuat ulang.');
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!userProgress) {
        return <div className="text-center p-8">Memuat data...</div>;
    }
    
    // Tampilan jika sudah lunas
    if (userProgress.pembayaran_daful_status === 'Pembayaran Sudah Dikonfirmasi') {
        return (
             <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Informasi Pembayaran Daftar Ulang</h1>
                <p className="text-xl font-bold text-green-500 mb-2">LUNAS</p>
                <p className="text-gray-500 text-sm">Terima kasih, pembayaran Daftar Ulang Anda telah kami verifikasi.</p>
                <div className="mt-6 pt-6 border-t">
                    <p>File yang telah Anda upload :</p>
                    <a href={`http://127.0.0.1:8000/storage/${userProgress.bukti_daful_path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {userProgress.bukti_daful_path.split('/').pop()}
                    </a>
                 </div>
            </div>
        );
    }

    // Tampilan form konfirmasi
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Informasi Pembayaran Daftar Ulang</h1>
                {/* ... (Rincian biaya tetap sama) ... */}
            </div>
            
            <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t">
                {message && <p className="text-center text-green-600 mb-4">{message}</p>}
                {error && <p className="text-center text-red-600 mb-4">{error}</p>}

                {/* ... (Input form tetap sama) ... */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Scan Bukti Pembayaran</label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-daful" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg">Browse</label>
                        <input id="bukti-daful" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea id="keterangan" name="keterangan" rows="3" value={formData.keterangan} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <input type="text" name="namaPengirim" placeholder="Nama Pengirim" value={formData.namaPengirim} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                    <input type="number" name="nominalTransfer" placeholder="Nominal Transfer" value={formData.nominalTransfer} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                    <input type="date" name="tanggalTransfer" value={formData.tanggalTransfer} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                
                <div className="text-center mb-8">
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Mengirim...' : 'Kirim Konfirmasi'}
                    </button>
                </div>

                {/* ... (Kontak admin tetap sama) ... */}
            </form>
        </div>
    );
};

export default KonfirmasiDaftarUlangView;