import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardNav from '../components/dashboard/DashboardNav';
import RegistrationSidebar from '../components/dashboard/RegistrationSidebar';
import { DataDiriView, TesSeleksiView, SoalTesView, HasilTesView, KtmView } from '../components/dashboard/Views';
import PendaftaranAwalView from '../components/dashboard/PendaftaranAwalView';
import KonfirmasiPembayaranView from '../components/dashboard/KonfirmasiPembayaranView';
import DaftarUlangView from '../components/dashboard/DaftarUlangView';
import KonfirmasiDaftarUlangView from '../components/dashboard/KonfirmasiDaftarUlangView';
import NPMView from '../components/dashboard/NPMView';

const DashboardRplPage = () => {
    const [activeView, setActiveView] = useState('data-diri');
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Sesi tidak valid. Silakan login kembali.");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/api/registration-status', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            const data = response.data;
            setDashboardData(data);

            // --- [LOGIKA KUNCI YANG DIPERBAIKI DAN DISELARASKAN] ---
            if (!data.user.formulir_pendaftaran_completed) {
                setActiveView('pendaftaran-awal');
            } else if (!data.user.pembayaran_form_completed) {
                setActiveView('konfirmasi-pembayaran');
            } else if (!data.user.tes_seleksi_completed) {
                setActiveView('tes-seleksi');
            } else if (!data.user.pembayaran_daful_completed) {
                setActiveView('konfirmasi-daftar-ulang');
            } else {
                setActiveView('data-diri');
            }

        } catch (err) {
            console.error("Error fetching registration status:", err);
            setError("Gagal memuat data dasbor. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Memuat data dasbor...</div>;
    }

    if (error || !dashboardData) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error || "Data tidak dapat dimuat."}</div>;
    }

    const { user, timeline: timelineData } = dashboardData;

    // --- [PERBAIKAN UTAMA DI SINI] ---
    // Pastikan `isTesLulus` dan `isPembayaranDafulCompleted` diekstrak langsung dari objek `user`.
    // Ini adalah cara yang sama seperti di DashboardPage.jsx.
    const isTesLulus = user?.tes_seleksi_completed;
    const isPembayaranDafulCompleted = user?.pembayaran_daful_completed;

    const renderView = () => {
        const commonProps = { userData: user, refetchUserData: fetchStatus };
        const rplProps = { ...commonProps, isRpl: true, setActiveView };

        switch (activeView) {
            case 'pendaftaran-awal':
                return <PendaftaranAwalView {...rplProps} />;
            case 'konfirmasi-pembayaran':
                return <KonfirmasiPembayaranView {...rplProps} />;
            case 'tes-seleksi':
                return <TesSeleksiView {...rplProps} />;
            case 'soal-tes':
                return <SoalTesView {...rplProps} />;
            case 'hasil-tes':
                return <HasilTesView user={user} />;
            case 'konfirmasi-daftar-ulang':
                return isTesLulus 
                    ? <KonfirmasiDaftarUlangView user={user} refetchUserData={fetchStatus} isRpl={true} />
                    : <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus dinyatakan lulus Tes Seleksi terlebih dahulu.</p></div>;
            case 'daftar-ulang':
                return isPembayaranDafulCompleted
                    ? <DaftarUlangView user={user} isRpl={true} />
                    : <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus menyelesaikan proses Pembayaran Daftar Ulang terlebih dahulu.</p></div>;
            case 'npm':
                return <NPMView />;
            case 'ktm':
                return <KtmView />;
            case 'data-diri':
            default:
                return <DataDiriView />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader user={user} />
            <DashboardNav 
                activeView={activeView} 
                setActiveView={setActiveView} 
                isFormulirCompleted={user?.formulir_pendaftaran_completed}
                isPembayaranFormCompleted={user?.pembayaran_form_completed}
                isPembayaranDafulCompleted={isPembayaranDafulCompleted}
                isTesLulus={isTesLulus}
            />
            <main className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <RegistrationSidebar timelineSteps={timelineData} setActiveView={setActiveView} />
                    <div className="w-full md:w-3/4">
                        {renderView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardRplPage;