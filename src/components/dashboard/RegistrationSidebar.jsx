import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const RegistrationSidebar = ({ timelineSteps = [], setActiveView }) => {
    const [hoveredStep, setHoveredStep] = useState(null);

    const handleClick = (step) => {
        if (step.title === 'Formulir Pendaftaran') {
            setActiveView('pendaftaran-awal');
        } else if (step.title === 'Pembayaran Form Daftar') {
            setActiveView('konfirmasi-pembayaran');
        } else if (step.title === 'Tes Seleksi PMB ITATS') {
            setActiveView(step.completed ? 'hasil-tes' : 'tes-seleksi');
        } else if (step.title === 'Pembayaran Daftar Ulang') {
            setActiveView('konfirmasi-daftar-ulang');
        } else if (step.title === 'Pengisian Data Diri') {
            setActiveView('daftar-ulang');
        } else if (step.title === 'Penerbitan NPM' && step.completed) {
            setActiveView('npm');
        }
    };

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
            <h4 className="text-lg font-bold mb-4">Alur Pendaftaran</h4>
            <div className="relative">
                {timelineSteps.map((step, index) => {
                    const isClickable = [
                        'Formulir Pendaftaran',
                        'Pembayaran Form Daftar',
                        'Tes Seleksi PMB ITATS',
                        'Pembayaran Daftar Ulang',
                        'Pengisian Data Diri',
                    ].includes(step.title) || (step.title === 'Penerbitan NPM' && step.completed);

                    const hasHoverEffect = isClickable || step.title === 'Status Administrasi';
                    
                    const itemClass = `flex items-start mb-6 pl-8 relative transition-colors duration-200 ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                    } ${
                        hoveredStep === index && hasHoverEffect ? 'bg-gray-100 rounded-md' : ''
                    }`;

                    return (
                        <div
                            key={index}
                            className={itemClass}
                            onMouseEnter={() => hasHoverEffect && setHoveredStep(index)}
                            onMouseLeave={() => setHoveredStep(null)}
                            onClick={() => isClickable && handleClick(step)}
                        >
                            {index < timelineSteps.length - 1 && <div className="absolute left-3 top-5 h-full w-0.5 bg-gray-200"></div>}
                            
                            {/* --- PERBAIKAN FINAL --- */}
                            <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <FaCheck className={`h-3 w-3 ${step.completed ? 'text-white' : 'text-gray-500'}`} />
                            </div>
                            
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
