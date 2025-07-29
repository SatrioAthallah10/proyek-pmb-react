import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

/**
 * Komponen Header untuk halaman Dashboard.
 */
const DashboardHeader = ({ setIsLoggedIn, setCurrentPage }) => {
    const handleLogout = () => {
        // Membersihkan data pengguna dari localStorage saat logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setCurrentPage('home');
    };
    
    // Mengambil data pengguna dari localStorage untuk ditampilkan
    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo PMB Online */}
                <img 
                    src="/images/Logo-PMB-2.png" 
                    alt="Logo PMB ITATS" 
                    className="h-10" 
                />
                
                {/* Informasi Pengguna dan Tombol Logout */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-semibold">{userData?.name || 'Nama Pengguna'}</p>
                        <p className="text-sm text-gray-500">{userData?.email || 'email@pengguna.com'}</p>
                    </div>
                    {/* Avatar Pengguna */}
                    <img 
                        src="/images/user-avatar.jpg" 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full object-cover" 
                    />
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;