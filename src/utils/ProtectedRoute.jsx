import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isKepalaBagianRoute }) => { // <-- [PERUBAHAN] isAdminRoute -> isKepalaBagianRoute
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika ini adalah rute Kepala Bagian, cek apakah user adalah admin
  if (isKepalaBagianRoute) { // <-- [PERUBAHAN]
    if (user && user.is_admin) {
      return <Outlet />; // Jika admin, tampilkan konten (AdminPage)
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  // Untuk route non-admin yang terproteksi (seperti dashboard biasa)
  return <Outlet />;
};

export default ProtectedRoute;
