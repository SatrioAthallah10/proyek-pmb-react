import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterRplPage from './pages/RegisterRplPage';
import RegisterMagisterPage from './pages/RegisterMagisterPage';
import RegisterMagisterRplPage from './pages/RegisterMagisterRplPage';
import DashboardPage from './pages/DashboardPage';
import DashboardRplPage from './pages/DashboardRplPage';
import DashboardMagisterPage from './pages/DashboardMagisterPage';

// --- Komponen yang kita tambahkan ---
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './utils/ProtectedRoute'; 

// Layout publik untuk halaman yang tidak memerlukan login
import PublicLayout from './components/PublicLayout';

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
          {/* Tambahkan rute dashboard lainnya di sini jika ada */}
        </Route>
        
        {/* Grup Rute Terproteksi khusus untuk Kepala Bagian */}
        <Route element={<ProtectedRoute isKepalaBagianRoute={true} />}> {/* <-- [PERUBAHAN] */}
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
