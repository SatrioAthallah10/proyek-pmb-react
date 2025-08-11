import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaPlus, FaArrowRight, FaArrowLeft, FaClock,
    FaGlobe, FaSignInAlt, FaFileAlt, FaMoneyBillWave,
    FaPencilAlt, FaUniversity, FaIdCard, FaArrowDown
} from 'react-icons/fa';
import { bankSoalTes } from '../../data/mockData.js';

// Komponen FlowCard, DataDiriView, dan TesSeleksiView tetap sama
const FlowCard = ({ icon, title, description, arrow, action, onClick }) => {
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


export const DataDiriView = () => {
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


export const TesSeleksiView = ({ setActiveView }) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">Tes Seleksi PMB ITATS</h1>
            <p className="text-gray-600">Selamat datang, <span className="font-bold">{userData?.name || 'Calon Mahasiswa'}</span>!</p>
            <div className="mt-6 pt-6 border-t text-left max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4 text-center">Petunjuk Pengerjaan Tes</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Tes terdiri dari 20 soal pilihan ganda.</li>
                    <li>Waktu pengerjaan tes adalah 30 menit.</li>
                    <li>Pastikan koneksi internet Anda stabil.</li>
                    <li>Dilarang membuka tab baru atau aplikasi lain.</li>
                </ol>
            </div>
            <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">Klik tombol di bawah ini jika Anda sudah siap untuk memulai.</p>
                <button 
                    onClick={() => setActiveView('soal-tes')} 
                    className="bg-green-500 text-white font-bold py-3 px-10 rounded-lg hover:bg-green-600 text-lg"
                >
                    Mulai Tes
                </button>
            </div>
        </div>
    );
};


export const SoalTesView = ({ setActiveView, isRpl = false }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1800);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const shuffled = [...bankSoalTes].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 20));
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Sesi tidak valid. Silakan login kembali.");
            setIsSubmitting(false);
            return;
        }

        const apiUrl = isRpl 
            ? 'http://127.0.0.1:8000/api/rpl/submit-hasil-tes' 
            : 'http://127.0.0.1:8000/api/submit-hasil-tes';

        try {
            const response = await axios.post(apiUrl, { answers }, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
            });

            await new Promise(resolve => setTimeout(resolve, 1500));
            setActiveView('hasil-tes');
            window.location.reload();

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Gagal mengirim jawaban.');
            } else {
                setError('Terjadi kesalahan koneksi.');
            }
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, handleSubmit]);

    const handleOptionSelect = (questionId, option) => setAnswers(prev => ({ ...prev, [questionId]: option }));
    const handleNext = () => currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex(prev => prev + 1);
    const handlePrev = () => currentQuestionIndex > 0 && setCurrentQuestionIndex(prev => prev - 1);

    if (questions.length === 0) return <div className="text-center p-8">Mempersiapkan soal...</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-xl font-bold text-blue-600">Tes Seleksi Online</h1>
                <div className="flex items-center gap-2 font-semibold text-red-600"><FaClock /><span>Sisa Waktu: {formatTime(timeLeft)}</span></div>
            </div>
            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1"><span>Soal {currentQuestionIndex + 1} dari {questions.length}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg min-h-[120px]"><p className="text-lg text-gray-800">{currentQuestion.question}</p></div>
            <div className="mt-6 space-y-4">
                {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                        <input type="radio" name={`question-${currentQuestion.id}`} value={option} checked={answers[currentQuestion.id] === option} onChange={() => handleOptionSelect(currentQuestion.id, option)} className="h-5 w-5 text-blue-600"/>
                        <span className="ml-4 text-gray-700">{option}</span>
                    </label>
                ))}
            </div>
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
            <div className="flex justify-between mt-8 pt-6 border-t">
                <button onClick={handlePrev} disabled={currentQuestionIndex === 0 || isSubmitting} className="bg-gray-300 text-gray-800 font-bold py-2 px-8 rounded-lg hover:bg-gray-400 disabled:opacity-50"><FaArrowLeft className="inline mr-2"/> Sebelumnya</button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-600 disabled:bg-gray-400">{isSubmitting ? 'Mengirim...' : 'Selesai & Kirim'}</button>
                ) : (
                    <button onClick={handleNext} disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700">Selanjutnya <FaArrowRight className="inline ml-2"/></button>
                )}
            </div>
        </div>
    );
};


// --- PERBAIKAN DI SINI ---
// Menghapus useEffect dan state, lalu menerima 'user' sebagai prop
export const HasilTesView = ({ user }) => {
    if (!user) {
        return <div className="text-center p-8">Memuat hasil tes...</div>;
    }

    const isLulus = user.tes_seleksi_completed;
    const statusMessage = isLulus ? "Anda telah dinyatakan LULUS dengan grade B." : "Anda dinyatakan TIDAK LULUS.";
    const statusClass = isLulus ? "bg-blue-100 border-blue-200 text-blue-800" : "bg-red-100 border-red-200 text-red-800";

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className={`${statusClass} border px-4 py-3 rounded-lg relative mb-6`}>
                <strong className="font-bold">{isLulus ? 'SELAMAT!' : 'MOHON MAAF!'}</strong>
                <span className="block sm:inline ml-2">{statusMessage}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Hasil Test Mahasiswa</h2>
                {!isLulus && <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><FaPlus /> Tes Ulang</button>}
            </div>
            <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold uppercase">{user.name || 'Nama Mahasiswa'}</h3>
                <span className="text-gray-500">Jumlah Percobaan : 1</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead><tr className="text-left text-gray-500 uppercase text-sm"><th className="pb-3">No</th><th className="pb-3">Tanggal</th><th className="pb-3">Nilai</th></tr></thead>
                    <tbody>
                        <tr className="border-t">
                            <td className="py-4">Percobaan Ke - 1</td>
                            <td className="py-4"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">30-07-2025 08:15:00</span></td>
                            <td className="py-4"><span>85.00/100</span><div className="w-full bg-gray-200 rounded-full h-2 mt-1"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div></div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export const KtmView = () => (
     <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-[#1a233a] mb-2">Upload KTM</h1>
        <div className="bg-blue-100 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
            <p>Untuk syarat dan ketentuan pembuatan KTM bisa dilihat <a href="#" className="font-bold underline">disini</a>.</p>
        </div>
        <div className="mb-6">
            <label className="block font-bold mb-2">Upload Foto KTM</label>
            <div className="flex items-center border rounded-lg p-2">
                <span className="text-gray-500 px-3 flex-grow" id="file-chosen-text">Choose file...</span>
                <input type="file" id="ktm-file-input" className="hidden" onChange={(e) => { const fileChosen = document.getElementById('file-chosen-text'); fileChosen.textContent = e.target.files.length > 0 ? e.target.files[0].name : 'Choose file...'; }}/>
                <button onClick={() => document.getElementById('ktm-file-input').click()} className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300">Browse</button>
            </div>
        </div>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg min-h-[250px] flex items-center justify-center">
            <img src="https://placehold.co/150x150/F0F0F0/CCCCCC?text=Image+Placeholder" alt="Placeholder" className="opacity-50" />
        </div>
    </div>
);
