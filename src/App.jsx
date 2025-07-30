import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DashboardRplPage from './pages/DashboardRplPage.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import RegisterRplPage from './pages/RegisterRplPage.jsx';
import RegisterMagisterPage from './pages/RegisterMagisterPage.jsx';
import RegisterMagisterRplPage from './pages/RegisterMagisterRplPage.jsx';
import DashboardMagisterPage from './pages/DashboardMagisterPage.jsx'; // Impor dasbor baru

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('authToken'));
    const [userData, setUserData] = useState(() => {
        const user = localStorage.getItem('userData');
        return user ? JSON.parse(user) : null;
    });

    const renderPage = () => {
        if (isLoggedIn && userData) {
            // Logika routing diperbarui untuk semua jalur
            if (userData.jalur_pendaftaran?.includes('rpl')) {
                return <DashboardRplPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            } else if (userData.jalur_pendaftaran === 'magister') {
                return <DashboardMagisterPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            } else {
                return <DashboardPage setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />;
            }
        }

        switch (currentPage) {
            case 'login': return <LoginPage setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />;
            case 'register': return <RegisterPage setCurrentPage={setCurrentPage} />;
            case 'register-rpl': return <RegisterRplPage setCurrentPage={setCurrentPage} />;
            case 'register-magister': return <RegisterMagisterPage setCurrentPage={setCurrentPage} />;
            case 'register-magister-rpl': return <RegisterMagisterRplPage setCurrentPage={setCurrentPage} />;
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
