import React from 'react';

/**
 * Komponen placeholder untuk halaman dashboard khusus pendaftar jalur RPL.
 */
const DashboardRplPage = ({ setIsLoggedIn, setCurrentPage }) => {
    const handleLogout = () => {
        // Hapus data dari localStorage saat logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setCurrentPage('home');
    };

    const user = JSON.parse(localStorage.getItem('userData'));

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold text-blue-600">Selamat Datang di Dasbor RPL</h1>
                <p className="mt-4 text-lg">Halo, <span className="font-semibold">{user?.name || 'Pengguna'}</span>!</p>
                <p className="text-gray-600">Anda terdaftar melalui jalur: <span className="font-bold uppercase">{user?.jalur_pendaftaran}</span></p>
                <button 
                    onClick={handleLogout}
                    className="mt-6 bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardRplPage;
