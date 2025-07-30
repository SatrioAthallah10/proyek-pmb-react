import React, { useState } from 'react';
import { FaTachometerAlt, FaFileSignature, FaIdCard, FaWallet, FaChartBar, FaChevronDown } from 'react-icons/fa';

// Terima semua prop status
const DashboardNav = ({ activeView, setActiveView, isFormulirCompleted, isPembayaranFormCompleted, isPembayaranDafulCompleted, isTesLulus }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownTimer, setDropdownTimer] = useState(null);

    const navItems = [
        { id: 'data-diri', label: 'Dashboard', icon: FaTachometerAlt },
        { 
            id: 'pendaftaran', 
            label: 'Pendaftaran', 
            icon: FaFileSignature,
            submenu: [
                { id: 'pendaftaran-awal', label: 'Pendaftaran Awal' },
                { id: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran', requires: 'formulir' },
                { id: 'konfirmasi-daftar-ulang', label: 'Konfirmasi Daftar Ulang', requires: 'tesLulus' },
                { id: 'daftar-ulang', label: 'Daftar Ulang', requires: 'pembayaranDaful' },
            ]
        },
        { id: 'ktm', label: 'KTM', icon: FaIdCard },
        { id: 'biaya', label: 'Biaya', icon: FaWallet },
        { id: 'hasil-tes', label: 'Hasil Tes', icon: FaChartBar, requires: 'pembayaranForm' }, // Tambahkan syarat
    ];

    const handleMouseEnter = () => {
        if (dropdownTimer) clearTimeout(dropdownTimer);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        const timer = setTimeout(() => setDropdownOpen(false), 300);
        setDropdownTimer(timer);
    };

    const handleNavClick = (viewId, requires) => {
        if (requires === 'pembayaranForm' && !isPembayaranFormCompleted) {
            alert("Harap selesaikan Pembayaran Formulir Pendaftaran terlebih dahulu.");
            return;
        }
        setActiveView(viewId);
    };

    const handleSubmenuClick = (viewId, requires) => {
        if (requires === 'formulir' && !isFormulirCompleted) {
            alert("Harap selesaikan Formulir Pendaftaran terlebih dahulu.");
            return;
        }
        if (requires === 'tesLulus' && !isTesLulus) {
            alert("Anda harus lulus Tes Seleksi PMB ITATS terlebih dahulu.");
            return;
        }
        if (requires === 'pembayaranDaful' && !isPembayaranDafulCompleted) {
            alert("Harap selesaikan Pembayaran Daftar Ulang terlebih dahulu.");
            return;
        }
        setActiveView(viewId);
    };

    return (
        <nav className="bg-[#1a233a] rounded-lg mx-6 my-4">
            <ul className="flex">
                {navItems.map(item => {
                    const isLockedByPaymentForm = item.requires === 'pembayaranForm' && !isPembayaranFormCompleted;

                    return item.submenu ? (
                        <li 
                            key={item.id} 
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeView.startsWith('pendaftaran') ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                            >
                                <item.icon />
                                {item.label}
                                <FaChevronDown className="h-3 w-3" />
                            </button>
                            {isDropdownOpen && (
                                <ul className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                                    {item.submenu.map(subItem => {
                                        const isLockedByForm = subItem.requires === 'formulir' && !isFormulirCompleted;
                                        const isLockedByTes = subItem.requires === 'tesLulus' && !isTesLulus;
                                        const isLockedByPayment = subItem.requires === 'pembayaranDaful' && !isPembayaranDafulCompleted;
                                        const isLocked = isLockedByForm || isLockedByTes || isLockedByPayment;

                                        return (
                                            <li key={subItem.id}>
                                                <a 
                                                    href="#" 
                                                    onClick={() => handleSubmenuClick(subItem.id, subItem.requires)}
                                                    className={`block px-4 py-2 text-sm ${
                                                        isLocked 
                                                        ? 'text-gray-400 cursor-not-allowed' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {subItem.label}
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    ) : (
                        <li key={item.id}>
                            <button 
                                onClick={() => handleNavClick(item.id, item.requires)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                                    isLockedByPaymentForm ? 'text-gray-500 cursor-not-allowed' : 
                                    (activeView === item.id ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white')
                                }`}
                            >
                                <item.icon />
                                {item.label}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
};

export default DashboardNav;