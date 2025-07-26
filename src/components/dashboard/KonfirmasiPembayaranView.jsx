import React, { useState } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

/**
 * Komponen untuk halaman Konfirmasi Pembayaran di dalam dasbor.
 */
const KonfirmasiPembayaranView = () => {
    // State untuk menyimpan nama file yang akan di-upload
    const [fileName, setFileName] = useState('Choose file...');

    // Fungsi untuk menangani perubahan pada input file
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('Choose file...');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Pembayaran Formulir Pendaftaran</h1>
                <p className="text-xl font-bold text-green-500 mb-2">LUNAS</p>
                <p className="text-gray-500 text-sm">Terima kasih, konfirmasi pembayaran <strong>Formulir Pendaftaran</strong> sebesar :</p>
                <p className="text-4xl font-bold text-gray-800 my-4">Rp. 300.778</p>
                <p className="text-gray-500 text-sm">telah berhasil diverifikasi oleh tim kami</p>
            </div>

            <div className="mt-8 pt-6 border-t">
                {/* Bagian Upload File */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Scan Bukti Pembayaran <FaPaperclip className="inline-block ml-1" />
                    </label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-pembayaran" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg hover:bg-gray-300 transition-colors">
                            Browse
                        </label>
                        <input id="bukti-pembayaran" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
                <p className="text-red-600 text-xs mb-1">* Anda bisa mengunggah 2 file</p>
                <p className="text-gray-600 text-xs mb-6">Bagi Calon Mahasiswa yang mengambil jalur Undangan, tambahkan upload kartu UTBK Anda</p>

                {/* Keterangan */}
                <div className="mb-6">
                    <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea
                        id="keterangan"
                        rows="3"
                        defaultValue="Bukti pembayaran pendaftaran awal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                {/* Detail Transfer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label htmlFor="namaPengirim" className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim Transfer</label>
                        <input type="text" id="namaPengirim" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="nominalTransfer" className="block text-sm font-medium text-gray-700 mb-1">Nominal Transfer</label>
                        <input type="number" id="nominalTransfer" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="tanggalTransfer" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transfer</label>
                        <div className="relative">
                            <input type="text" id="tanggalTransfer" placeholder="dd/mm/yyyy" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* File yang Sudah Di-upload */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-gray-700">File yang telah Anda upload :</p>
                    <a href="#" className="text-sm text-blue-600 hover:underline">Rab07Februari20242056.png</a>
                </div>

                {/* Status Verifikasi */}
                <div className="text-center mb-8">
                    <button disabled className="bg-green-100 text-green-700 font-semibold py-2 px-6 rounded-lg cursor-not-allowed">
                        File telah diverifikasi oleh admin
                    </button>
                </div>

                {/* Langkah Selanjutnya */}
                <div className="text-center text-gray-600">
                    <p>Selanjutnya, Anda dapat melanjutkan ke tahap berikutnya,</p>
                    <p className="font-semibold my-1">yaitu mengikuti tes seleksi masuk ITATS.</p>
                    <p>Jika ada kendala, jangan ragu hubungi admin</p>
                    <button className="mt-4 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto">
                        <FaWhatsapp /> WHATSAPP ADMIN PMB ITATS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KonfirmasiPembayaranView;
