import React, { useState } from 'react';
import { FaTachometerAlt, FaFileSignature, FaIdCard, FaWallet, FaChartBar, FaChevronDown } from 'react-icons/fa';

/**
 * Komponen Navigasi utama di dalam Dashboard dengan dropdown.
 */
const DashboardNav = ({ activeView, setActiveView }) => {
    // State untuk mengontrol visibilitas dropdown
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    // State untuk timer, agar bisa dibatalkan
    const [dropdownTimer, setDropdownTimer] = useState(null);

    // Data untuk item navigasi, termasuk submenu
    const navItems = [
        { id: 'data-diri', label: 'Dashboard', icon: FaTachometerAlt },
        { 
            id: 'pendaftaran', 
            label: 'Pendaftaran', 
            icon: FaFileSignature,
            // Submenu untuk Pendaftaran
            submenu: [
                { id: 'pendaftaran-awal', label: 'Pendaftaran Awal' },
                { id: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran' },
                { id: 'daftar-ulang', label: 'Daftar Ulang' },
                { id: 'konfirmasi-daftar-ulang', label: 'Konfirmasi Daftar Ulang' },
            ]
        },
        { id: 'ktm', label: 'KTM', icon: FaIdCard },
        { id: 'biaya', label: 'Biaya', icon: FaWallet },
        { id: 'hasil-tes', label: 'Hasil Tes', icon: FaChartBar },
    ];

    // Fungsi saat mouse masuk ke area item Pendaftaran
    const handleMouseEnter = () => {
        if (dropdownTimer) {
            clearTimeout(dropdownTimer);
        }
        setDropdownOpen(true);
    };

    // Fungsi saat mouse keluar dari area item Pendaftaran
    const handleMouseLeave = () => {
        const timer = setTimeout(() => {
            setDropdownOpen(false);
        }, 300); // Menu akan tertutup setelah 300ms
        setDropdownTimer(timer);
    };

    return (
        <nav className="bg-[#1a233a] rounded-lg mx-6 my-4">
            {/* PERBAIKAN: Menghapus kelas 'overflow-x-auto' */}
            <ul className="flex">
                {navItems.map(item => (
                    // Jika item memiliki submenu, bungkus dengan div untuk event hover
                    item.submenu ? (
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
                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <ul className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                                    {item.submenu.map(subItem => (
                                        <li key={subItem.id}>
                                            <a 
                                                href="#" 
                                                onClick={() => setActiveView(subItem.id)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {subItem.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ) : (
                        // Render item biasa jika tidak ada submenu
                        <li key={item.id}>
                            <button 
                                onClick={() => setActiveView(item.id)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeView === item.id ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
                            >
                                <item.icon />
                                {item.label}
                            </button>
                        </li>
                    )
                ))}
            </ul>
        </nav>
    );
};

export default DashboardNav;
