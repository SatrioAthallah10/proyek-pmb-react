import React from 'react';
import { FaWhatsapp, FaTiktok, FaInstagram, FaYoutube } from 'react-icons/fa';

/**
 * Komponen Footer untuk semua halaman.
 */
const Footer = () => (
    <footer className="bg-[#003366] text-gray-300 pt-10 pb-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h4 className="text-white font-bold text-lg border-b-2 border-yellow-400 pb-2 inline-block mb-4">Media Sosial</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white flex items-center"><FaTiktok className="mr-2" /> TikTok</a></li>
                    <li><a href="#" className="hover:text-white flex items-center"><FaInstagram className="mr-2" /> Instagram</a></li>
                    <li><a href="#" className="hover:text-white flex items-center"><FaYoutube className="mr-2" /> Youtube</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold text-lg border-b-2 border-yellow-400 pb-2 inline-block mb-4">Link Penting</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Pendaftaran Reguler</a></li>
                    <li><a href="#" className="hover:text-white">Pendaftaran RPL</a></li>
                    <li><a href="#" className="hover:text-white">Persyaratan</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold text-lg border-b-2 border-yellow-400 pb-2 inline-block mb-4">Alamat</h4>
                <p className="font-semibold">Institut Teknologi Adhi Tama Surabaya</p>
                <p>Jln Arief Rachman Hakim 100, Surabaya 60117</p>
                <p>Telepon : (031) 5991101</p>
            </div>
        </div>
        <a href="#" className="fixed bottom-8 right-8 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50">
            <FaWhatsapp className="w-8 h-8" />
        </a>
    </footer>
);

export default Footer;
