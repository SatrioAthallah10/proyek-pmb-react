import React from 'react';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

/**
 * Komponen layout untuk halaman-halaman publik.
 */
// Hapus prop setCurrentPage dari sini
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hapus prop setCurrentPage dari PublicHeader */}
      <PublicHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
