import React from 'react';
import {
    FaPlus, FaGlobe, FaSignInAlt, FaFileAlt, FaMoneyBillWave, 
    FaPencilAlt, FaUniversity, FaIdCard, FaArrowRight, FaArrowLeft, FaArrowDown
} from 'react-icons/fa';

/**
 * Komponen baru untuk kartu alur pendaftaran.
 */
const FlowCard = ({ icon, title, description, arrow, action, onClick }) => {
    // Menentukan ikon panah berdasarkan prop
    const ArrowIcon = () => {
        switch (arrow) {
            case 'right': return <FaArrowRight className="text-gray-400 absolute top-1/2 -right-6 transform -translate-y-1/2" />;
            case 'left': return <FaArrowLeft className="text-gray-400 absolute top-1/2 -left-6 transform -translate-y-1/2" />;
            case 'down': return <FaArrowDown className="text-gray-400 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full" />;
            default: return null;
        }
    };

    if (action) {
        return (
            <button
                onClick={onClick}
                className="w-full bg-blue-600 text-white font-bold p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
            >
                {title}
            </button>
        );
    }
    
    if (title === "HTTPS://PMB.ITATS.AC.ID/") {
        return (
             <div className="relative bg-white p-4 rounded-lg shadow-md text-center flex flex-col justify-center items-center h-full">
                <img src="/images/lepi.png" alt="PMB ITATS Website" className="mb-2 max-w-full h-auto" />
                <ArrowIcon />
            </div>
        )
    }

    return (
        <div className="relative bg-gray-50 p-6 rounded-lg shadow-md text-center h-full">
            <div className="text-4xl text-blue-500 mb-3 mx-auto w-fit">{icon}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <ArrowIcon />
        </div>
    );
};


/**
 * Komponen View untuk "Data Diri" di Dashboard. (Sudah direnovasi)
 */
export const DataDiriView = () => {
    // Data untuk setiap kartu dalam alur pendaftaran
    const flowData = [
        { title: 'HTTPS://PMB.ITATS.AC.ID/', arrow: 'right' },
        { icon: <FaSignInAlt />, title: 'Daftar & Login', description: 'Buka http://pmb.itats.ac.id, buat akun, lalu login ke sistem pendaftaran.', arrow: 'right' },
        { icon: <FaFileAlt />, title: 'ISI FORMULIR PENDAFTARAN', description: 'Lengkapi data pada formulir pendaftaran yang tersedia di akunmu.', arrow: 'down' },
        { icon: <FaMoneyBillWave />, title: 'PEMBAYARAN DAFTAR ULANG', description: 'Setelah lulus seleksi, lakukan pembayaran daftar ulang sesuai tagihan yang muncul di akunmu.', arrow: 'down' },
        { icon: <FaPencilAlt />, title: 'TES SELEKSI PMB ITATS', description: 'Setelah lulus seleksi, lakukan pembayaran daftar ulang sesuai tagihan yang muncul di akunmu.', arrow: 'left' },
        { icon: <FaMoneyBillWave />, title: 'BAYAR FORM PENDAFTARAN', description: 'Lakukan pembayaran sesuai nominal yang tertera. Informasi pembayaran bisa dilihat setelah isi formulir.', arrow: 'left' },
        { icon: <FaIdCard />, title: 'LENGKAPI DATA DIRI', description: 'Isi seluruh data pribadi dan dokumen yang dibutuhkan pada menu "Pengisian Data Diri".', arrow: 'right' },
        { icon: <FaUniversity />, title: 'PENERBITAN NPM', description: 'Setelah semua proses selesai, kamu akan mendapatkan NPM (Nomor Pokok Mahasiswa) dan resmi menjadi mahasiswa ITATS!', arrow: 'right' },
        { title: 'ISI FORMULIR PENDAFTARAN', action: true },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-8">
                <p className="text-gray-600">Selamat Datang di Institut Teknologi Adhi Tama Surabaya</p>
                <h2 className="text-2xl font-bold text-[#1a233a] mt-1">ALUR PENDAFTARAN MAHASISWA BARU</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {flowData.map((item, index) => (
                    <FlowCard key={index} {...item} />
                ))}
            </div>
        </div>
    );
};


// Komponen HasilTesView dan KtmView tetap sama
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