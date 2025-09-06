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
    // State activeView sekarang akan ditentukan setelah data dimuat
    const [activeView, setActiveView] = useState(null); 
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        // Jangan set loading di sini untuk menghindari re-render yang tidak perlu
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
            setDashboardData(response.data);

            // --- [LOGIKA PERBAIKAN UTAMA] ---
            // Tentukan activeView pertama kali di sini setelah data berhasil didapat
            const status = response.data.user.status_pendaftaran;
            if (status === 'mengisi_formulir_awal') {
                setActiveView('pendaftaran-awal');
            } else {
                setActiveView('data-diri'); // Atau tampilan default lainnya
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

    // Kondisi loading sekarang lebih sederhana
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p>Memuat data dasbor...</p></div>;
    }
    
    if (error || !dashboardData) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-600"><p>{error || "Data tidak dapat dimuat."}</p></div>;
    }

    const user = dashboardData.user;
    const timelineData = dashboardData.timeline;

    const isTesLulus = user?.tes_seleksi_completed;
    const isPembayaranDafulCompleted = user?.pembayaran_daful_completed;

    const renderView = () => {
        const commonProps = { user, refetchUserData: fetchStatus, setActiveView };
        const rplProps = { ...commonProps, isRpl: true };

        // Jika activeView belum ditentukan (misal saat render pertama), jangan render apa-apa
        if (!activeView) return null;

        switch (activeView) {
            case 'konfirmasi-pembayaran': return <KonfirmasiPembayaranView {...rplProps} />;
            case 'pendaftaran-awal': return <PendaftaranAwalView {...rplProps} />;
            case 'konfirmasi-daftar-ulang':
                 if (isTesLulus) { return <KonfirmasiDaftarUlangView {...rplProps} />; }
                 else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus dinyatakan lulus Tes Seleksi terlebih dahulu.</p></div>; }
            case 'tes-seleksi': return <TesSeleksiView {...rplProps} />;
            case 'soal-tes': return <SoalTesView {...rplProps} />;
            case 'hasil-tes': return <HasilTesView {...commonProps} />;
            case 'ktm': return <KtmView />;
            case 'daftar-ulang':
                if (isPembayaranDafulCompleted) { return <DaftarUlangView {...rplProps} />; }
                else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus menyelesaikan proses Pembayaran Daftar Ulang terlebih dahulu.</p></div>; }
            case 'npm': return <NPMView />;
            case 'data-diri':
            default: return <DataDiriView />;
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