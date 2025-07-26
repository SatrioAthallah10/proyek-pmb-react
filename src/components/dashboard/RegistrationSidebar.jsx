import React from 'react';
import { FaCheck } from 'react-icons/fa';
// Pastikan path ke mockData benar
import { timelineSteps } from '../../data/mockData.js';

/**
 * Komponen Sidebar yang menampilkan alur pendaftaran di Dashboard.
 */
const RegistrationSidebar = () => (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white p-6 rounded-lg shadow-md h-fit">
        <h4 className="text-lg font-bold mb-4">Alur Pendaftaran</h4>
        <div className="relative">
            {timelineSteps.map((step, index) => (
                <div key={index} className="flex items-start mb-6 pl-8 relative">
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
            ))}
        </div>
    </aside>
);

export default RegistrationSidebar;
