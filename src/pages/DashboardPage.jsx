import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader.jsx';
import DashboardNav from '../components/dashboard/DashboardNav.jsx';
import RegistrationSidebar from '../components/dashboard/RegistrationSidebar.jsx';
import { DataDiriView, HasilTesView, KtmView } from '../components/dashboard/Views.jsx';
import PendaftaranAwalView from '../components/dashboard/PendaftaranAwalView.jsx';
import KonfirmasiPembayaranView from '../components/dashboard/KonfirmasiPembayaranView.jsx';
import DaftarUlangView from '../components/dashboard/DaftarUlangView.jsx';
import KonfirmasiDaftarUlangView from '../components/dashboard/KonfirmasiDaftarUlangView.jsx';
import NPMView from '../components/dashboard/NPMView.jsx'; // <-- Impor komponen baru

const DashboardPage = ({ setIsLoggedIn, setCurrentPage }) => {
    const [activeView, setActiveView] = useState('data-diri');
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        const fetchRegistrationStatus = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/registration-status', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Gagal mengambil data status pendaftaran');
                const data = await response.json();
                setTimelineData(data);
            } catch (error) {
                console.error("Error fetching registration status:", error);
            }
        };
        fetchRegistrationStatus();
    }, []);

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
            case 'konfirmasi-daftar-ulang':
                return <KonfirmasiDaftarUlangView />;
            case 'npm': // <-- Tambahkan case untuk NPM View
                return <NPMView />;
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
                    {/* Kirim 'setActiveView' sebagai props ke sidebar */}
                    <RegistrationSidebar timelineSteps={timelineData} setActiveView={setActiveView} />
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        {renderView()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;