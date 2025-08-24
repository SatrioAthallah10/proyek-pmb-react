import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserGraduate, FaMoneyCheckAlt, FaUserPlus } from 'react-icons/fa';

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

    const renderNavButtons = () => {
        switch (role) {
            case 'owner':
                return (
                    <NavButton viewName="dashboard" icon={<FaTachometerAlt className="mr-2" />}>
                        Dashboard
                    </NavButton>
                );
            case 'staff':
                return (
                    <NavButton viewName="konfirmasi-pembayaran" icon={<FaMoneyCheckAlt className="mr-2" />}>
                        Konfirmasi Pembayaran
                    </NavButton>
                );
            case 'kepala_bagian':
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
                        {/* --- [PENAMBAHAN] Tombol baru untuk tambah staff --- */}
                        <NavButton viewName="tambah-staff" icon={<FaUserPlus className="mr-2" />}>
                            Tambah Staff
                        </NavButton>
                    </>
                );
            default:
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

export default AdminNav;
