import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Perbaikan: Menambahkan ekstensi .jsx pada semua impor lokal untuk memastikan path-nya dapat ditemukan oleh bundler.
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import RegisterRplPage from './pages/RegisterRplPage.jsx';
import RegisterMagisterPage from './pages/RegisterMagisterPage.jsx';
import RegisterMagisterRplPage from './pages/RegisterMagisterRplPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DashboardRplPage from './pages/DashboardRplPage.jsx';
import DashboardMagisterPage from './pages/DashboardMagisterPage.jsx';
// --- [PENAMBAHAN] ---
// Mengimpor komponen dashboard baru untuk Magister RPL.
import DashboardMagisterRpl from './pages/DashboardMagisterRpl.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import PublicLayout from './components/PublicLayout.jsx';

function App() {
  return (
    // Router harus membungkus seluruh aplikasi
    <Router>
      <Routes>
        {/* Rute Publik dengan Layout */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-rpl" element={<RegisterRplPage />} />
        <Route path="/register-magister" element={<RegisterMagisterPage />} />
        <Route path="/register-magister-rpl" element={<RegisterMagisterRplPage />} />

        {/* Grup Rute Terproteksi untuk User Biasa */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard-rpl" element={<DashboardRplPage />} />
          <Route path="/dashboard-magister" element={<DashboardMagisterPage />} />
          {/* --- [PENAMBAHAN] --- */}
          {/* Menambahkan rute baru untuk dasbor Magister RPL */}
          <Route path="/dashboard-magister-rpl" element={<DashboardMagisterRpl />} />
        </Route>

        {/* Grup Rute Terproteksi khusus untuk Admin */}
        {/* Mengubah prop menjadi isAdminRoute untuk kejelasan */}
        <Route element={<ProtectedRoute isAdminRoute={true} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
