import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardNav from '../components/dashboard/DashboardNav.jsx';
import RegistrationSidebar from '../components/dashboard/RegistrationSidebar.jsx';
import { DataDiriView, HasilTesView, KtmView } from '../components/dashboard/Views.jsx';
import PendaftaranAwalView from '../components/dashboard/PendaftaranAwalView.jsx';
import KonfirmasiPembayaranView from '../components/dashboard/KonfirmasiPembayaranView.jsx';
import DaftarUlangView from '../components/dashboard/DaftarUlangView.jsx';
// PERBAIKAN: Impor komponen baru
import KonfirmasiDaftarUlangView from '../components/dashboard/KonfirmasiDaftarUlangView.jsx';

/**
 * Komponen utama untuk halaman dashboard.
 * Mengelola tampilan aktif (view) di dalam dashboard.
 */
const DashboardPage = ({ setIsLoggedIn, setCurrentPage }) => {
    const [activeView, setActiveView] = useState('data-diri');

    const renderView = () => {
        switch (activeView) {
            case 'hasil-tes':
                return <HasilTesView />;
            case 'ktm':
                return <KtmView />;
            case 'pendaftaran-awal':
                return <PendaftaranAwalView />;
            case 'konfirmasi-pembayaran':
                return <KonfirmasiPembayaranView />;
            case 'daftar-ulang':
                return <DaftarUlangView />;
            // PERBAIKAN: Tambahkan case untuk halaman baru
            case 'konfirmasi-daftar-ulang':
                return <KonfirmasiDaftarUlangView />;
            case 'data-diri':
            default:
                return <DataDiriView />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <DashboardHeader setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />
            <DashboardNav activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row gap-8">
                    <RegistrationSidebar />
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        {renderView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
