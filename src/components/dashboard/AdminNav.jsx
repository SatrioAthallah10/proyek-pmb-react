import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserGraduate, FaMoneyCheckAlt, FaUserPlus, FaCog } from 'react-icons/fa';

// --- [PERUBAHAN TOTAL] Komponen sekarang menerima 'permissions' bukan 'role' ---
const AdminNav = ({ activeView, setActiveView, permissions }) => {
    
    // Definisikan semua kemungkinan menu yang ada di sistem
    const allMenus = [
        { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="mr-2" /> },
        { key: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran', icon: <FaMoneyCheckAlt className="mr-2" /> },
        { key: 'manajemen-pendaftar', label: 'Manajemen Pendaftar', icon: <FaUsers className="mr-2" /> },
        { key: 'mahasiswa-aktif', label: 'Mahasiswa Aktif', icon: <FaUserGraduate className="mr-2" /> },
        { key: 'tambah-staff', label: 'Tambah Staff', icon: <FaUserPlus className="mr-2" /> },
        { key: 'pengaturan-menu', label: 'Pengaturan Menu', icon: <FaCog className="mr-2" /> },
    ];

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

    // --- [PERUBAHAN TOTAL] Logika render tidak lagi menggunakan switch-case berdasarkan role,
    // melainkan memfilter dari daftar menu berdasarkan objek permissions yang diterima.
    const renderNavButtons = () => {
        if (!permissions) {
            return <p className="text-gray-400">Memuat menu...</p>;
        }

        // Filter `allMenus` untuk hanya menyertakan menu yang `key`-nya ada di `permissions`
        const allowedMenus = allMenus.filter(menu => permissions[menu.key]);

        if (allowedMenus.length === 0) {
            return <p className="text-gray-400">Tidak ada menu yang bisa diakses.</p>;
        }

        return allowedMenus.map(menu => (
            <NavButton key={menu.key} viewName={menu.key} icon={menu.icon}>
                {menu.label}
            </NavButton>
        ));
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
