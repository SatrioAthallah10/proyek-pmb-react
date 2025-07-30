import React, { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardNav from '../components/dashboard/DashboardNav.jsx';
import RegistrationSidebar from '../components/dashboard/RegistrationSidebar.jsx';
import { DataDiriView, TesSeleksiView, SoalTesView, HasilTesView, KtmView } from '../components/dashboard/Views.jsx';
import PendaftaranAwalView from '../components/dashboard/PendaftaranAwalView.jsx';
import KonfirmasiPembayaranView from '../components/dashboard/KonfirmasiPembayaranView.jsx';
import DaftarUlangView from '../components/dashboard/DaftarUlangView.jsx';
import KonfirmasiDaftarUlangView from '../components/dashboard/KonfirmasiDaftarUlangView.jsx';
import NPMView from '../components/dashboard/NPMView.jsx';

const DashboardMagisterPage = ({ setIsLoggedIn, setCurrentPage }) => {
    const [activeView, setActiveView] = useState('data-diri');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/magister/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });
            if (!response.ok) throw new Error('Gagal mengambil data pengguna Magister');
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    if (loading || !userData) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p>Memuat data dasbor Magister...</p></div>;
    }

    const isNpmCompleted = !!userData.npm_status && userData.npm_status !== 'Belum Diproses';
    const timelineData = [
        { title: 'Formulir Pendaftaran', status: userData.formulir_pendaftaran_status, completed: userData.formulir_pendaftaran_completed },
        { title: 'Pembayaran Form Daftar', status: userData.pembayaran_form_status, completed: userData.pembayaran_form_completed },
        { title: 'Status Administrasi', status: userData.administrasi_status, completed: userData.administrasi_completed },
        { title: 'Tes Seleksi PMB ITATS', status: userData.tes_seleksi_status, completed: userData.tes_seleksi_completed },
        { title: 'Pembayaran Daftar Ulang', status: userData.pembayaran_daful_status, completed: userData.pembayaran_daful_completed },
        { title: 'Pengisian Data Diri', status: userData.pengisian_data_diri_status, completed: userData.pengisian_data_diri_completed },
        { title: 'Penerbitan NPM', status: userData.npm_status, completed: isNpmCompleted },
    ];
    
    const isFormulirCompleted = userData.formulir_pendaftaran_completed;
    const isPembayaranFormCompleted = userData.pembayaran_form_completed;
    const isTesLulus = userData.tes_seleksi_completed;
    const isPembayaranDafulCompleted = userData.pembayaran_daful_completed;

    const renderView = () => {
        const props = {
            userData,
            refetchUserData: fetchUserData,
            setActiveView,
            isMagister: true // Prop baru untuk jalur Magister
        };

        switch (activeView) {
            case 'konfirmasi-pembayaran': return <KonfirmasiPembayaranView {...props} />;
            case 'pendaftaran-awal': return <PendaftaranAwalView {...props} />;
            case 'konfirmasi-daftar-ulang':
                 if (isTesLulus) { return <KonfirmasiDaftarUlangView {...props} />; }
                 else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus dinyatakan lulus Tes Seleksi terlebih dahulu.</p></div>; }
            case 'tes-seleksi': return <TesSeleksiView {...props} />;
            case 'soal-tes': return <SoalTesView {...props} />;
            case 'hasil-tes': return <HasilTesView {...props} />;
            case 'ktm': return <KtmView />;
            case 'daftar-ulang':
                if (isPembayaranDafulCompleted) { return <DaftarUlangView {...props} />; }
                else { return <div className="bg-white p-8 rounded-lg shadow-md text-center"><h2 className="text-2xl font-bold text-red-600">Akses Ditolak</h2><p>Anda harus menyelesaikan proses Pembayaran Daftar Ulang terlebih dahulu.</p></div>; }
            case 'npm': return <NPMView />;
            case 'data-diri':
            default: return <DataDiriView />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />
            <DashboardNav activeView={activeView} setActiveView={setActiveView} isFormulirCompleted={isFormulirCompleted} isPembayaranFormCompleted={isPembayaranFormCompleted} isPembayaranDafulCompleted={isPembayaranDafulCompleted} isTesLulus={isTesLulus} />
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

export default DashboardMagisterPage;
