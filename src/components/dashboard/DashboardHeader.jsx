import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';

// Menerima prop 'user' yang berisi data pengguna lengkap
const DashboardHeader = ({ user }) => { 
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Logika ini sekarang akan bekerja karena backend mengirim data lengkap
    const displayName = user?.nama_lengkap || user?.name || 'Nama Pengguna';
    const displayEmail = user?.email || 'email@pengguna.com';

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
            {/* --- PERBAIKAN LOGO DI SINI --- */}
            {/* Mengganti tulisan dengan tag <img> untuk logo */}
            <img 
                src="/images/Logo-PMB-2.png" 
                alt="Logo PMB ITATS" 
                className="h-10"
            />
            <div className="flex items-center">
                <div className="text-right mr-4">
                    <p className="font-semibold text-gray-700">{displayName}</p>
                    <p className="text-sm text-gray-500">{displayEmail}</p>
                </div>
                <img 
                    src={user?.avatar || '/images/user-avatar.jpg'} 
                    alt="User Avatar" 
                    className="w-10 h-10 rounded-full object-cover" 
                />
                <button 
                    onClick={handleLogout} 
                    className="ml-6 flex items-center text-gray-600 hover:text-red-500 transition-colors"
                    title="Logout"
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
