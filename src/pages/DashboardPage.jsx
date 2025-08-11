import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardNav from '../components/dashboard/DashboardNav.jsx';
import RegistrationSidebar from '../components/dashboard/RegistrationSidebar.jsx';
import { DataDiriView, TesSeleksiView, SoalTesView, HasilTesView, KtmView } from '../components/dashboard/Views.jsx';
import PendaftaranAwalView from '../components/dashboard/PendaftaranAwalView.jsx';
import KonfirmasiPembayaranView from '../components/dashboard/KonfirmasiPembayaranView.jsx';
import DaftarUlangView from '../components/dashboard/DaftarUlangView.jsx';
import KonfirmasiDaftarUlangView from '../components/dashboard/KonfirmasiDaftarUlangView.jsx';
import NPMView from '../components/dashboard/NPMView.jsx';

const DashboardPage = () => {
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
            setDashboardData(response.data);
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
        switch (activeView) {
            case 'konfirmasi-pembayaran':
                return <KonfirmasiPembayaranView userData={user} refetchUserData={fetchStatus} />;
            case 'pendaftaran-awal':
                return <PendaftaranAwalView setActiveView={setActiveView} refetchUserData={fetchStatus} />;
            case 'konfirmasi-daftar-ulang':
                 if (isTesLulus) { return <KonfirmasiDaftarUlangView user={user} refetchUserData={fetchStatus} />; }
                 else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus dinyatakan lulus Tes Seleksi terlebih dahulu.</p></div>; }
            case 'tes-seleksi':
                return <TesSeleksiView setActiveView={setActiveView} />;
            case 'soal-tes':
                return <SoalTesView setActiveView={setActiveView} />;
            case 'hasil-tes':
                return <HasilTesView user={user} />;
            case 'ktm':
                return <KtmView />;
            // --- PERBAIKAN DI SINI ---
            // Mengirim data 'user' sebagai prop ke DaftarUlangView
            case 'daftar-ulang':
                if (isPembayaranDafulCompleted) { return <DaftarUlangView user={user} />; }
                else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus menyelesaikan proses Pembayaran Daftar Ulang terlebih dahulu.</p></div>; }
            case 'npm':
                return <NPMView />;
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

export default DashboardPage;
