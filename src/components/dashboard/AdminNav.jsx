import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserGraduate, FaMoneyCheckAlt } from 'react-icons/fa';

// --- [PERUBAHAN DIMULAI DI SINI] ---
// Komponen sekarang menerima 'role' sebagai prop
const AdminNav = ({ activeView, setActiveView, role }) => {
    const NavButton = ({ viewName, icon, children }) => {
        const isActive = activeView === viewName;
        return (
            <button
                onClick={() => setActiveView(viewName)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                {children}
            </button>
        );
    };

    // Fungsi untuk merender tombol navigasi berdasarkan peran
    const renderNavButtons = () => {
        switch (role) {
            case 'owner':
                // Owner hanya bisa melihat Dashboard Statistik
                return (
                    <NavButton viewName="dashboard" icon={<FaTachometerAlt className="mr-2" />}>
                        Dashboard
                    </NavButton>
                );
            case 'staff':
                // Staff hanya bisa melihat Konfirmasi Pembayaran
                return (
                    <NavButton viewName="konfirmasi-pembayaran" icon={<FaMoneyCheckAlt className="mr-2" />}>
                        Konfirmasi Pembayaran
                    </NavButton>
                );
            case 'kepala_bagian':
                // Kepala Bagian bisa melihat semua menu
                return (
                    <>
                        <NavButton viewName="dashboard" icon={<FaTachometerAlt className="mr-2" />}>
                            Dashboard
                        </NavButton>
                        <NavButton viewName="konfirmasi-pembayaran" icon={<FaMoneyCheckAlt className="mr-2" />}>
                            Konfirmasi Pembayaran
                        </NavButton>
                        <NavButton viewName="manajemen-pendaftar" icon={<FaUsers className="mr-2" />}>
                            Manajemen Pendaftar
                        </NavButton>
                        <NavButton viewName="mahasiswa-aktif" icon={<FaUserGraduate className="mr-2" />}>
                            Mahasiswa Aktif
                        </NavButton>
                    </>
                );
            default:
                // Tampilan default jika peran belum terdefinisi
                return <p className="text-gray-400">Memuat menu...</p>;
        }
    };

    return (
        <nav className="bg-[#2c3e50] p-3 shadow-md">
            <div className="container mx-auto flex items-center space-x-4 overflow-x-auto">
                {renderNavButtons()}
            </div>
        </nav>
    );
};
// --- [PERUBAHAN SELESAI DI SINI] ---

export default AdminNav;