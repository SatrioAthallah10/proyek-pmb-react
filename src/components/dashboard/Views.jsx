import React from 'react';
import { FaPlus } from 'react-icons/fa';

/**
 * Komponen View untuk "Data Diri" di Dashboard.
 */
export const DataDiriView = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-8">
            <img src="https://placehold.co/80x80/FFFFFF/000000?text=ITATS" alt="Logo ITATS" className="mx-auto mb-4" />
            <p className="text-gray-600">Selamat Datang di Institut Teknologi Adhi Tama Surabaya</p>
            <h2 className="text-2xl font-bold text-[#1a233a] mt-1">ALUR PENDAFTARAN MAHASISWA BARU</h2>
        </div>
        <p>Konten utama untuk alur pendaftaran dan informasi mahasiswa baru akan ditampilkan di sini.</p>
    </div>
);

/**
 * Komponen View untuk "Hasil Tes" di Dashboard.
 */
export const HasilTesView = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">SELAMAT!</strong>
            <span className="block sm:inline ml-2">Anda telah dinyatakan LULUS dengan grade B.</span>
        </div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Hasil Test Mahasiswa</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <FaPlus /> Tes Baru
            </button>
        </div>
        <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold">SATRIO ATHALLAH KRESNO PRAMUDYA</h3>
            <span className="text-gray-500">Jumlah Percobaan : 1</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-500 uppercase text-sm">
                        <th className="pb-3">No</th>
                        <th className="pb-3">Tanggal</th>
                        <th className="pb-3">Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t">
                        <td className="py-4">Percobaan Ke - 1</td>
                        <td className="py-4"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">13-02-2024 02:50:03</span></td>
                        <td className="py-4">
                            <span>86.67/100</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '86.67%' }}></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

/**
 * Komponen View untuk "Upload KTM" di Dashboard.
 */
export const KtmView = () => (
     <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-[#1a233a] mb-2">Upload KTM</h1>
        <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg relative mb-6">
            <p>Untuk syarat dan ketentuan pembuatan KTM bisa dilihat <a href="#" className="font-bold underline">disini</a>.</p>
        </div>
        <div className="mb-6">
            <label className="block font-bold mb-2">Upload Foto KTM</label>
            <div className="flex items-center border rounded-lg p-2">
                <span className="text-gray-500 px-3 flex-grow" id="file-chosen-text">Choose file...</span>
                <input 
                    type="file" 
                    id="ktm-file-input" 
                    className="hidden" 
                    onChange={(e) => {
                        const fileChosen = document.getElementById('file-chosen-text');
                        if (e.target.files.length > 0) {
                            fileChosen.textContent = e.target.files[0].name;
                        } else {
                            fileChosen.textContent = 'Choose file...';
                        }
                    }}
                />
                <button onClick={() => document.getElementById('ktm-file-input').click()} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">Browse</button>
            </div>
        </div>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg min-h-[250px] flex items-center justify-center">
            <img src="https://placehold.co/150x150/F0F0F0/CCCCCC?text=Image+Placeholder" alt="Placeholder" className="opacity-50" />
        </div>
    </div>
);
