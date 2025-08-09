import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isAdminRoute }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // Ambil data user dari local storage

  // Jika tidak ada token, arahkan ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika ini adalah route admin, cek apakah user adalah admin
  if (isAdminRoute) {
    if (user && user.is_admin) {
      return <Outlet />; // Jika admin, tampilkan konten (AdminPage)
    } else {
      // Jika bukan admin, arahkan ke dashboard biasa
      return <Navigate to="/dashboard" />;
    }
  }

  // Untuk route non-admin yang terproteksi (seperti dashboard biasa)
  return <Outlet />;
};

export default ProtectedRoute;
