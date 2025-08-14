import React from 'react';
import { FaTimes, FaCheckCircle, FaHourglassHalf, FaCircle, FaFileImage, FaClock, FaUserShield } from 'react-icons/fa';

// Helper function untuk memformat tanggal
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Komponen untuk setiap item progres dasar
const ProgressItem = ({ title, status }) => {
    const getStatusIcon = () => {
        if (status && status.toLowerCase().includes('sudah')) {
            return <FaCheckCircle className="text-green-500" />;
        }
        if (status && status.toLowerCase().includes('menunggu')) {
            return <FaHourglassHalf className="text-yellow-500 animate-spin" />;
        }
        return <FaCircle className="text-gray-300" />;
    };

    return (
        <li className="flex items-center justify-between py-3">
            <span className="text-gray-700">{title}</span>
            <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-sm text-gray-500">{status || 'Belum Dimulai'}</span>
            </div>
        </li>
    );
};

// Komponen untuk menampilkan detail pembayaran
const PaymentDetails = ({ proofPath, uploadedAt, confirmedBy, confirmedAt }) => {
    if (!proofPath) return null;

    const baseUrl = 'http://localhost:8000/storage/';

    return (
        <div className="pl-8 mt-2 mb-3 text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
                <FaFileImage className="text-blue-500" />
                <a href={`${baseUrl}${proofPath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat Bukti Pembayaran
                </a>
            </div>
            <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <span>Diunggah pada: {formatDate(uploadedAt)}</span>
            </div>
            {confirmedBy && (
                <div className="flex items-center gap-2">
                    <FaUserShield className="text-green-500" />
                    <span>Dikonfirmasi oleh: <strong>{confirmedBy.name}</strong> pada {formatDate(confirmedAt)}</span>
                </div>
            )}
        </div>
    );
};


const ProgressModal = ({ user, onClose, isLoading }) => {
    if (!user) return null;

    const progressSteps = [
        { title: 'Formulir Pendaftaran', statusKey: 'formulir_pendaftaran_status' },
        { 
            title: 'Pembayaran Formulir', 
            statusKey: 'pembayaran_form_status',
            details: {
                proofPath: user.bukti_pembayaran_path,
                uploadedAt: user.payment_uploaded_at,
                confirmedBy: user.payment_confirmed_by_admin,
                confirmedAt: user.payment_confirmed_at,
            }
        },
        { title: 'Administrasi', statusKey: 'administrasi_status' },
        { title: 'Tes Seleksi', statusKey: 'tes_seleksi_status' },
        { 
            title: 'Pembayaran Daftar Ulang', 
            statusKey: 'pembayaran_daful_status',
            details: {
                proofPath: user.bukti_daful_path,
                uploadedAt: user.daful_uploaded_at,
                confirmedBy: user.daful_confirmed_by_admin,
                confirmedAt: user.daful_confirmed_at,
            }
        },
        { title: 'Pengisian Data Diri', statusKey: 'pengisian_data_diri_status' },
        { title: 'Penerbitan NPM', statusKey: 'npm_status' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FaTimes size={20} />
                </button>
                
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Detail Progres Pendaftar</h2>
                    <p className="text-gray-600 font-medium">{user.name} ({user.email})</p>
                    {/* --- PERUBAHAN HANYA DI SINI --- */}
                    <p className="text-sm text-gray-500 mt-1">
                        {user.jalur_pendaftaran} - Kelas <span className="font-semibold">{user.kelas}</span>
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat data progres...</p>
                    </div>
                ) : (
                    <ul>
                        {progressSteps.map(step => (
                            <div key={step.title} className="border-b last:border-b-0">
                                <ProgressItem 
                                    title={step.title}
                                    status={user[step.statusKey]}
                                />
                                {step.details && <PaymentDetails {...step.details} />}
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProgressModal;
