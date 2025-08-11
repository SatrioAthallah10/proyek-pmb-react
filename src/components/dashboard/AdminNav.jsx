import React from 'react';
import { FaTachometerAlt, FaUsers } from 'react-icons/fa';

const AdminNav = ({ activeView, setActiveView }) => {
    const NavButton = ({ viewName, icon, children }) => {
        const isActive = activeView === viewName;
        return (
            <button
                onClick={() => setActiveView(viewName)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {icon}
                {children}
            </button>
        );
    };

    return (
        <nav className="bg-[#2c3e50] p-3 shadow-md">
            <div className="container mx-auto flex items-center space-x-4">
                <NavButton viewName="dashboard" icon={<FaTachometerAlt className="mr-2" />}>
                    Dashboard
                </NavButton>
                <NavButton viewName="manajemen-pendaftar" icon={<FaUsers className="mr-2" />}>
                    Manajemen Pendaftar
                </NavButton>
            </div>
        </nav>
    );
};

export default AdminNav;
