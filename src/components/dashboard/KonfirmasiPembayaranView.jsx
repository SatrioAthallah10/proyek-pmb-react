import React, { useState } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

const KonfirmasiPembayaranView = ({ userData, refetchUserData, isRpl = false }) => {
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
        
        const apiUrl = isRpl
            ? 'http://127.0.0.1:8000/api/rpl/submit-konfirmasi-pembayaran'
            : 'http://127.0.0.1:8000/api/submit-konfirmasi-pembayaran';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                body: dataToSend,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal mengirim data.');

            setMessage('Konfirmasi berhasil! Memuat status terbaru...');
            
            setTimeout(() => {
                refetchUserData();
            }, 1500);

        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (!userData) {
        return <div className="text-center p-8">Memuat data...</div>;
    }
    
    if (userData.pembayaran_form_status === 'Menunggu Konfirmasi') {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-orange-500 mb-4">Menunggu Konfirmasi</h1>
                <p className="text-gray-600">Terima kasih, bukti pembayaran Anda telah kami terima dan sedang menunggu verifikasi oleh admin.</p>
                <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-500">File yang Anda unggah:</p>
                    <a href={`http://127.0.0.1:8000/storage/${userData.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {userData.bukti_pembayaran_path ? userData.bukti_pembayaran_path.split('/').pop() : 'Tidak ada file'}
                    </a>
                </div>
            </div>
        );
    }

    if (userData.pembayaran_form_status === 'Pembayaran Sudah Dikonfirmasi') {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Pembayaran Formulir Pendaftaran</h1>
                <p className="text-xl font-bold text-green-500 mb-2">LUNAS</p>
                <p className="text-gray-500 text-sm">Terima kasih, pembayaran Anda telah berhasil diverifikasi.</p>
                 <div className="mt-6 pt-6 border-t">
                    <p>File yang telah Anda unggah:</p>
                    <a href={`http://127.0.0.1:8000/storage/${userData.bukti_pembayaran_path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {userData.bukti_pembayaran_path ? userData.bukti_pembayaran_path.split('/').pop() : 'Tidak ada file'}
                    </a>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-4">Konfirmasi Pembayaran Formulir</h1>
            
            {/* --- BLOK BARU YANG DITAMBAHKAN --- */}
            <div className="mb-6 border-b pb-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total Biaya Pendaftaran:</span>
                    <span className="text-2xl font-bold text-red-600">Rp 300.778</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    *Harap transfer sesuai dengan nominal yang tertera untuk mempermudah proses verifikasi.
                </p>
            </div>
            {/* --- AKHIR BLOK BARU --- */}

            <div className="text-center bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-semibold">Pembayaran dapat dilakukan melalui transfer ke:</p>
                <p className="text-lg font-bold">Bank Syariah Indonesia (BSI)</p>
                <p className="text-gray-600">Atas Nama: ITATS</p>
                <p className="text-xl font-bold tracking-wider">Nomor Rekening: 799-799-7934</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                {message && <p className="text-center text-green-600 mb-4">{message}</p>}
                {error && <p className="text-center text-red-600 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1"><FaPaperclip className="inline-block mr-1" />Upload Scan Bukti Pembayaran</label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-pembayaran" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg hover:bg-gray-300">Browse</label>
                        <input id="bukti-pembayaran" type="file" className="hidden" onChange={handleFileChange} required />
                    </div>
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
                
                <div className="text-center">
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Mengirim...' : 'Kirim Konfirmasi'}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t text-center">
                <p className="text-gray-600">Jika ada kendala, jangan ragu hubungi admin.</p>
                <button type="button" className="mt-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 flex items-center gap-2 mx-auto">
                    <FaWhatsapp /> WHATSAPP ADMIN PMB ITATS
                </button>
            </div>
        </div>
    );
};

export default KonfirmasiPembayaranView;
