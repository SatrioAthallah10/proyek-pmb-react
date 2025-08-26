import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- [PERBAIKAN] Menggunakan SVG untuk ikon logout untuk menghindari error ---
const IconSignOut = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const DashboardHeader = ({ user }) => { 
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const displayName = user?.name || 'Nama Admin';
    const displayEmail = user?.email || 'email@admin.com';

    return (
        // --- [PERBAIKAN TAMPILAN HEADER SESUAI DESAIN ASLI] ---
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
            {/* Logo di sebelah kiri */}
            <img 
                src="/images/Logo-PMB-2.png" 
                alt="Logo PMB ITATS" 
                className="h-10"
            />
            
            {/* Informasi user dan tombol logout di sebelah kanan */}
            <div className="flex items-center">
                <div className="text-right mr-4">
                    <p className="font-semibold text-gray-800">{displayName}</p>
                    <p className="text-sm text-gray-500">{displayEmail}</p>
                </div>
                <img 
                    src={'/images/user-avatar.jpg'} 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <button 
                    onClick={handleLogout} 
                    className="ml-6 flex items-center text-gray-600 hover:text-red-500 transition-colors"
                    title="Logout"
                >
                    <IconSignOut />
                    <span className="ml-2">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
