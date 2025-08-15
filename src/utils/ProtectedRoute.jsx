import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Nama prop diubah menjadi lebih umum untuk menangani semua rute admin
const ProtectedRoute = ({ isAdminRoute }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika ini adalah rute yang dilindungi untuk admin
  if (isAdminRoute) {
    // --- [BARIS KODE YANG DIPERBAIKI] ---
    // Pengecekan sekarang dilakukan terhadap array peran admin.
    // Ini memastikan semua pengguna dengan peran 'kepala', 'staff', atau 'owner' diizinkan mengakses.
    const adminRoles = ['admin', 'kepala', 'staff', 'owner'];
    if (user && adminRoles.includes(user.role)) {
      return <Outlet />; // Izinkan akses ke halaman admin
    } else {
      // Jika bukan admin, alihkan ke dasbor mahasiswa
      return <Navigate to="/dashboard" />;
    }
  }

  // Untuk rute non-admin yang terproteksi (misalnya, dasbor mahasiswa)
  return <Outlet />;
};

export default ProtectedRoute;
