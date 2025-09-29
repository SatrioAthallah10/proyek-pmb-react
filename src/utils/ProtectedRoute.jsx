import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdminRoute }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute) {
    // --- [PERBAIKAN DI SINI] ---
    // Mengubah 'kepala' menjadi 'kepala_bagian' agar sesuai dengan data dari backend.
    const adminRoles = ['admin', 'kepala_bagian', 'staff', 'owner'];
    
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