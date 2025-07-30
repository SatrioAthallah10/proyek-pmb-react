import React, { useState } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

const KonfirmasiPembayaranView = ({ userData, refetchUserData }) => {
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

        try {
            const response = await fetch('http://127.0.0.1:8000/api/submit-konfirmasi-pembayaran', {
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
            {/* ... sisa kode form tidak berubah ... */}
        </div>
    );
};

export default KonfirmasiPembayaranView;