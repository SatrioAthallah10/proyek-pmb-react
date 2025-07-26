import React from 'react';
import PublicHeader from './PublicHeader';
import Footer from './Footer';

/**
 * Komponen layout untuk halaman publik.
 * Membungkus konten halaman dengan header dan footer publik.
 */
const PublicLayout = ({ children, setCurrentPage }) => {
    return (
        <>
            <PublicHeader setCurrentPage={setCurrentPage} />
            {children}
            <Footer />
        </>
    );
};

export default PublicLayout;
