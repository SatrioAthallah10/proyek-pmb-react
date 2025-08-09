import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';

/**
 * Komponen Header untuk halaman publik dengan dropdown menu bertingkat.
 */
const PublicHeader = () => { // Hapus prop setCurrentPage
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [menuTimer, setMenuTimer] = useState(null);

    const menuItems = {
        sarjana: {
            name: 'Program Sarjana',
            links: [
                { name: 'Jalur Reguler', page: '/register' },
                { name: 'Jalur RPL', page: '/register-rpl' },
            ],
        },
        pascasarjana: {
            name: 'Program Pascasarjana',
            links: [
                { name: 'Program Magister Reguler', page: '/register-magister' },
                { name: 'Program Magister RPL', page: '/register-magister-rpl' },
            ],
        },
    };

    const handleMouseEnter = () => {
        if (menuTimer) clearTimeout(menuTimer);
        setDropdownOpen(true);
    };
    
    const handleMouseLeave = () => {
        const timer = setTimeout(() => {
            setDropdownOpen(false);
            setActiveSubmenu(null);
        }, 300);
        setMenuTimer(timer);
    };

    // Komponen NavItem sekarang menggunakan Link
    const NavItem = ({ children, to, isExternal = false }) => (
        <Link 
            to={to}
            target={isExternal ? "_blank" : "_self"}
            className="relative py-2 group transition-colors duration-300"
        >
            {children}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
        </Link>
    );

    return (
        <header className="bg-[#003366] text-white sticky top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/">
                    <img src="/images/logo-white-itats-full.png" alt="Logo ITATS" className="h-10" />
                </Link>
                
                <nav className="hidden md:flex items-center space-x-8">
                    <NavItem to="/">Beranda</NavItem>
                    
                    <div className="relative py-2 group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        <button className="flex items-center">
                            Daftar <FaChevronDown className="ml-2 h-3 w-3" />
                        </button>
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>

                        {dropdownOpen && (
                            <ul className="absolute right-0 mt-2 w-56 bg-[#004a8f] rounded-md shadow-lg py-1">
                                <li className="relative" onMouseEnter={() => setActiveSubmenu('sarjana')}>
                                    <span className="w-full flex justify-between items-center px-4 py-2 text-sm">
                                        <FaChevronLeft className="h-3 w-3" /> {menuItems.sarjana.name}
                                    </span>
                                    {activeSubmenu === 'sarjana' && (
                                        <ul className="absolute right-full top-0 mt-[-1px] w-56 bg-[#005aab] rounded-md shadow-lg py-1">
                                            {menuItems.sarjana.links.map(link => (
                                                <li key={link.name}>
                                                    <Link to={link.page} className="block px-4 py-2 text-sm hover:bg-[#0065bc]">{link.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                <li className="relative" onMouseEnter={() => setActiveSubmenu('pascasarjana')}>
                                    <span className="w-full flex justify-between items-center px-4 py-2 text-sm">
                                        <FaChevronLeft className="h-3 w-3" /> {menuItems.pascasarjana.name}
                                    </span>
                                    {activeSubmenu === 'pascasarjana' && (
                                        <ul className="absolute right-full top-0 mt-[-1px] w-56 bg-[#005aab] rounded-md shadow-lg py-1">
                                            {menuItems.pascasarjana.links.map(link => (
                                                <li key={link.name}>
                                                    <Link to={link.page} className="block px-4 py-2 text-sm hover:bg-[#0065bc]">{link.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        )}
                    </div>

                    <NavItem to="/login">Login</NavItem>
                    <NavItem to="https://itats.ac.id/" isExternal={true}>ITATS</NavItem>
                </nav>
                 <button className="md:hidden text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
        </header>
    );
};

export default PublicHeader;
