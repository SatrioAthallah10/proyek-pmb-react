import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Komponen Switch untuk UI yang lebih baik
const ToggleSwitch = ({ menuKey, role, isChecked, onChange }) => (
    <label htmlFor={`${role}-${menuKey}`} className="flex items-center cursor-pointer">
        <div className="relative">
            <input
                type="checkbox"
                id={`${role}-${menuKey}`}
                className="sr-only"
                checked={isChecked}
                onChange={onChange}
            />
            <div className={`block w-14 h-8 rounded-full ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isChecked ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);

const PengaturanMenu = () => {
    const [permissions, setPermissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    // Daftar semua menu yang bisa dikonfigurasi
    const configurableMenus = {
        owner: [
            { key: 'dashboard', label: 'Dashboard Statistik' },
        ],
        staff: [
            { key: 'konfirmasi-pembayaran', label: 'Konfirmasi Pembayaran' },
        ],
    };

    const fetchPermissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/admin/menu-permissions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Inisialisasi state dengan data dari server atau default false
            const initialPermissions = {};
            ['owner', 'staff'].forEach(role => {
                initialPermissions[role] = {};
                configurableMenus[role].forEach(menu => {
                    initialPermissions[role][menu.key] = response.data[role]?.[menu.key]?.is_visible ?? false;
                });
            });
            setPermissions(initialPermissions);

        } catch (err) {
            setError('Gagal memuat pengaturan menu.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handlePermissionChange = (role, menuKey) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [menuKey]: !prev[role][menuKey]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:8000/api/admin/menu-permissions', { permissions }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess('Pengaturan menu berhasil disimpan!');
        } catch (err) {
            setError('Gagal menyimpan pengaturan.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && Object.keys(permissions).length === 0) return <div className="text-center p-8">Memuat pengaturan...</div>;
    if (error) return <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">{error}</div>;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Pengaturan Akses Menu Admin</h1>
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{success}</p></div>}
            
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    {/* Pengaturan untuk Role Owner */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Akses Menu Owner</h2>
                        <div className="space-y-4">
                            {configurableMenus.owner.map(menu => (
                                <div key={menu.key} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                    <span className="font-medium text-gray-600">{menu.label}</span>
                                    <ToggleSwitch 
                                        menuKey={menu.key} 
                                        role="owner" 
                                        isChecked={permissions.owner?.[menu.key] || false}
                                        onChange={() => handlePermissionChange('owner', menu.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pengaturan untuk Role Staff */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">Akses Menu Staff</h2>
                        <div className="space-y-4">
                             {configurableMenus.staff.map(menu => (
                                <div key={menu.key} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                    <span className="font-medium text-gray-600">{menu.label}</span>
                                     <ToggleSwitch 
                                        menuKey={menu.key} 
                                        role="staff" 
                                        isChecked={permissions.staff?.[menu.key] || false}
                                        onChange={() => handlePermissionChange('staff', menu.key)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                        {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PengaturanMenu;
