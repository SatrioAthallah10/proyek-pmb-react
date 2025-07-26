import React, { useState } from 'react';
import { FaWhatsapp, FaCalendarAlt, FaPaperclip } from 'react-icons/fa';

/**
 * Komponen untuk halaman Konfirmasi Pembayaran Daftar Ulang.
 */
const KonfirmasiDaftarUlangView = () => {
    const [fileName, setFileName] = useState('Choose file...');

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
                <h1 className="text-2xl font-bold text-blue-600 mb-2">Informasi Pembayaran Daftar Ulang</h1>
                <p className="text-gray-500 text-sm">Silakan menyelesaikan pembayaran <strong>Daftar Ulang</strong></p>
                <p className="text-xl font-bold text-green-500 my-4">LUNAS</p>
                <p className="text-gray-500 text-sm">dengan rincian sebagai berikut</p>
            </div>

            <div className="mt-8 pt-6 border-t max-w-2xl mx-auto">
                <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                        <span>Dana Pengembangan Pendidikan (DPP) - Beasiswa 100%</span>
                        <span className="font-semibold">Rp. 0,00</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Daftar Ulang</span>
                        <span className="font-semibold">Rp. 300.000,00</span>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <span>Kegiatan Pendahuluan *</span>
                            <p className="text-xs text-gray-500">*Kegiatan Pendahuluan: Pengenalan Kampus, Tes TEFL, Tes TPA dan Atribut Almamater</p>
                        </div>
                        <span className="font-semibold">Rp. 1.350.000,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <div className="w-2/3">
                            <label htmlFor="pembayaranSpp" className="block text-sm font-medium text-gray-700">SPP / Biaya Penyelenggaraan Pendidikan (BPP) * <span className="text-red-500">Opsional</span></label>
                            <select id="pembayaranSpp" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                                <option>-- Pilih Pembayaran SPP --</option>
                                <option>1 Bulan</option>
                                <option>Per Semester (Diskon 10%)</option>
                            </select>
                        </div>
                        <span className="font-semibold">Rp. 0</span>
                    </div>
                </div>
                <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
                    <span>Total Pembayaran</span>
                    <span>Rp 1.650.778</span>
                </div>
                 <div className="text-center text-sm text-gray-600 mt-8">
                    <p>Pembayaran dapat dilakukan melalui :</p>
                    <p className="font-semibold">Loket Pendaftaran ITATS</p>
                    <p>atau</p>
                    <p>Transfer ke <strong>Bank Syariah Indonesia (BSI)</strong> Atas Nama <strong>ITATS</strong></p>
                    <p>Nomor rekening: <strong>799-799-7934</strong></p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Scan Bukti Pembayaran <FaPaperclip className="inline-block ml-1" />
                    </label>
                    <div className="flex items-center border rounded-lg">
                        <span className="text-gray-500 px-3 py-2 flex-grow">{fileName}</span>
                        <label htmlFor="bukti-pembayaran-ulang" className="cursor-pointer bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-r-lg hover:bg-gray-300 transition-colors">
                            Browse
                        </label>
                        <input id="bukti-pembayaran-ulang" type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
                <p className="text-red-600 text-xs mb-6">* Anda bisa mengunggah 2 file</p>

                <div className="mb-6">
                    <label htmlFor="keterangan-ulang" className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                    <textarea
                        id="keterangan-ulang"
                        rows="3"
                        defaultValue="Pembayaran daftar ulang Satrio Athallah Kresno Pramudya"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                        <label htmlFor="namaPengirimUlang" className="block text-sm font-medium text-gray-700 mb-1">Nama Pengirim Transfer</label>
                        <input type="text" id="namaPengirimUlang" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="nominalTransferUlang" className="block text-sm font-medium text-gray-700 mb-1">Nominal Transfer</label>
                        <input type="number" id="nominalTransferUlang" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="tanggalTransferUlang" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transfer</label>
                        <div className="relative">
                            <input type="text" id="tanggalTransferUlang" placeholder="dd/mm/yyyy" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                            <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <button disabled className="bg-green-100 text-green-700 font-semibold py-2 px-6 rounded-lg cursor-not-allowed">
                        File telah diverifikasi oleh admin
                    </button>
                </div>

                <div className="text-center text-gray-600">
                    <p>Terima kasih sudah melakukan konfirmasi pembayaran <strong>Daftar Ulang</strong>. Selanjutnya kami akan melakukan verifikasi pembayaran yang telah anda lakukan. Silahkan tunggu notifikasi dari kami.</p>
                    <p className="mt-2">Jika ada kendala, jangan ragu hubungi admin</p>
                    <button className="mt-4 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 mx-auto">
                        <FaWhatsapp /> WHATSAPP ADMIN PMB ITATS
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KonfirmasiDaftarUlangView;
