import React, { useState, useEffect } from 'react';
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
    // State 'activeView' akan ditentukan setelah data berhasil dimuat
    const [activeView, setActiveView] = useState(null); 
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- [PERBAIKAN UTAMA: Pola Pengambilan Data yang Aman] ---
    useEffect(() => {
        // Definisikan fungsi async di dalam useEffect
        const fetchStatus = async () => {
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

                // Tentukan tampilan awal berdasarkan status pengguna setelah data diterima
                const status = response.data.user.status_pendaftaran;
                if (status === 'mengisi_formulir_awal') {
                    setActiveView('pendaftaran-awal');
                } else {
                    // Tampilan default jika pengguna sudah melewati tahap awal
                    setActiveView('data-diri'); 
                }

            } catch (err) {
                console.error("Error fetching registration status:", err);
                setError("Gagal memuat data dasbor. Silakan coba lagi.");
            } finally {
                setLoading(false);
            }
        };

        // Panggil fungsi tersebut
        fetchStatus();
    }, []); // <-- Dependency array kosong, memastikan ini hanya berjalan SATU KALI

    // Kondisi loading yang lebih sederhana dan aman
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p>Memuat data dasbor...</p></div>;
    }
    
    if (error || !dashboardData) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-600"><p>{error || "Data tidak dapat dimuat."}</p></div>;
    }

    const { user, timeline: timelineData } = dashboardData;

    const isTesLulus = user?.tes_seleksi_completed;
    const isPembayaranDafulCompleted = user?.pembayaran_daful_completed;

    const renderView = () => {
        const refetchUserData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                 const response = await axios.get('http://localhost:8000/api/registration-status', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setDashboardData(response.data);
            } catch (e) {
                setError("Gagal memuat ulang data.");
            } finally {
                setLoading(false);
            }
        };
        
        const commonProps = { user, refetchUserData, setActiveView };
        const rplProps = { ...commonProps, isRpl: true };

        // Jika activeView belum ditentukan, jangan render apa-apa untuk menghindari error
        if (!activeView) return null;

        switch (activeView) {
            case 'pendaftaran-awal': return <PendaftaranAwalView {...rplProps} />;
            case 'konfirmasi-pembayaran': return <KonfirmasiPembayaranView {...rplProps} />;
            case 'tes-seleksi': return <TesSeleksiView {...rplProps} />;
            case 'soal-tes': return <SoalTesView {...rplProps} />;
            case 'hasil-tes': return <HasilTesView {...commonProps} />;
            case 'konfirmasi-daftar-ulang':
                 return isTesLulus 
                    ? <KonfirmasiDaftarUlangView {...rplProps} />
                    : <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus dinyatakan lulus Tes Seleksi terlebih dahulu.</p></div>;
            case 'daftar-ulang':
                return isPembayaranDafulCompleted
                    ? <DaftarUlangView {...rplProps} />
                    : <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus menyelesaikan proses Pembayaran Daftar Ulang terlebih dahulu.</p></div>;
            case 'npm': return <NPMView />;
            case 'ktm': return <KtmView />;
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