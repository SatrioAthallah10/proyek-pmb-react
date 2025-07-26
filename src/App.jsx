import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DashboardRplPage from './pages/DashboardRplPage.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import RegisterRplPage from './pages/RegisterRplPage.jsx';
import RegisterMagisterPage from './pages/RegisterMagisterPage.jsx';
// PERBAIKAN: Impor halaman baru
import RegisterMagisterRplPage from './pages/RegisterMagisterRplPage.jsx';

/**
 * Komponen utama aplikasi.
 */
export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));
    const [userData, setUserData] = useState(() => {
        const user = localStorage.getItem('userData');
        return user ? JSON.parse(user) : null;
    });

    const renderPage = () => {
        if (isLoggedIn && userData) {
            console.log('Routing based on user data:', userData);

            // Kita bisa menambahkan logika routing untuk magister di sini jika perlu
            if (userData.jalur_pendaftaran === 'rpl' || userData.jalur_pendaftaran === 'magister-rpl') {
                return <DashboardRplPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            } else {
                return <DashboardPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            }
        }

        switch (currentPage) {
            case 'login':
                return <LoginPage 
                    setCurrentPage={setCurrentPage} 
                    setIsLoggedIn={setIsLoggedIn} 
                    setUserData={setUserData}
                />;
            case 'register':
                return <RegisterPage setCurrentPage={setCurrentPage} />;
            case 'register-rpl':
                return <RegisterRplPage setCurrentPage={setCurrentPage} />;
            case 'register-magister':
                return <RegisterMagisterPage setCurrentPage={setCurrentPage} />;
            // PERBAIKAN: Tambahkan case untuk halaman baru
            case 'register-magister-rpl':
                return <RegisterMagisterRplPage setCurrentPage={setCurrentPage} />;
            case 'home':
            default:
                return (
                    <PublicLayout setCurrentPage={setCurrentPage}>
                        <HomePage setCurrentPage={setCurrentPage} />
                    </PublicLayout>
                );
        }
    };

    return (
        <div className="font-sans bg-gray-50">
            {renderPage()}
        </div>
    );
}
