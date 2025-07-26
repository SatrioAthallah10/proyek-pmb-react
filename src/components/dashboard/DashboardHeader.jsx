import React from 'react';
// LANGKAH DIAGNOSIS: Mengimpor ikon dari Font Awesome ('fa') sebagai tes
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

/**
 * Komponen Header untuk halaman Dashboard.
 */
const DashboardHeader = ({ setIsLoggedIn, setCurrentPage }) => {
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentPage('home');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <img src="https://placehold.co/150x40/FFFFFF/000000?text=PMB+Online" alt="Logo PMB" className="h-10" />
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-semibold">Satrio Athallah</p>
                        <p className="text-sm text-gray-500">satrioathallah38@gmail.com</p>
                    </div>
                    {/* Menggunakan ikon baru dari Font Awesome */}
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                        {/* Menggunakan ikon baru dari Font Awesome */}
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
