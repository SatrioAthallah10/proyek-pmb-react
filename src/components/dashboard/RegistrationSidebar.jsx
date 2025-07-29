import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

/**
 * Komponen Sidebar yang menampilkan alur pendaftaran di Dashboard.
 */
const RegistrationSidebar = ({ timelineSteps = [], setActiveView }) => {
    // State untuk melacak item mana yang sedang di-hover
    const [hoveredStep, setHoveredStep] = useState(null);

    // Fungsi untuk menangani klik pada item sidebar
    const handleClick = (step) => {
        if (step.title === 'Formulir Pendaftaran') {
            setActiveView('pendaftaran-awal');
        }
        
        if (step.title === 'Pembayaran Form Daftar') {
            setActiveView('konfirmasi-pembayaran');
        }
        
        if (step.title === 'Tes Seleksi PMB ITATS') {
            setActiveView('hasil-tes');
        }

        if (step.title === 'Pembayaran Daftar Ulang') {
            setActiveView('konfirmasi-daftar-ulang');
        }
        
        if (step.title === 'Pengisian Data Diri') {
            setActiveView('daftar-ulang');
        }

        if (step.title === 'Penerbitan NPM' && step.completed) {
            setActiveView('npm');
        }
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
            <h4 className="text-lg font-bold mb-4">Alur Pendaftaran</h4>
            <div className="relative">
                {timelineSteps.map((step, index) => {
                    // Tentukan item mana yang BISA DIKLIK
                    const isClickable = 
                        step.title === 'Formulir Pendaftaran' ||
                        step.title === 'Pembayaran Form Daftar' ||
                        step.title === 'Tes Seleksi PMB ITATS' ||
                        step.title === 'Pembayaran Daftar Ulang' ||
                        step.title === 'Pengisian Data Diri' ||
                        (step.title === 'Penerbitan NPM' && step.completed);
                    
                    // Tentukan item mana yang punya EFEK HOVER
                    const hasHoverEffect = isClickable || step.title === 'Status Administrasi';

                    // Tentukan style dinamis (padding & margin penyebab masalah sudah dihapus)
                    const itemClass = `flex items-start mb-6 pl-8 relative transition-colors duration-200 ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                    } ${
                        hoveredStep === index && hasHoverEffect ? 'bg-gray-100 rounded-md' : ''
                    }`;

                    return (
                        <div
                            key={index}
                            className={itemClass}
                            onMouseEnter={() => {
                                if (hasHoverEffect) {
                                    setHoveredStep(index);
                                }
                            }}
                            onMouseLeave={() => {
                                setHoveredStep(null);
                            }}
                            onClick={() => {
                                if(isClickable) {
                                    handleClick(step)
                                }
                            }}
                        >
                            {/* Garis vertikal timeline */}
                            {index < timelineSteps.length - 1 && <div className="absolute left-3 top-5 h-full w-0.5 bg-gray-200"></div>}
                            
                            {/* Ikon centang */}
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <FaCheck className="text-white h-3 w-3" />
                            </div>
                            
                            {/* Konten timeline */}
                            <div>
                                <h5 className="font-semibold">{step.title}</h5>
                                <p className="text-sm text-gray-500">{step.status}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default RegistrationSidebar;