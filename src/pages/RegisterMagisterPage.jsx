import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

// Komponen-komponen form ini bisa diekstraksi ke file terpisah jika diperlukan
const FormInputWithIcon = ({ icon, label, name, type, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
        </div>
    </div>
);

const FormSelect = ({ label, name, value, onChange, children }) => (
     <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <select 
            name={name}
            value={value}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
        >
            {children}
        </select>
    </div>
);

const FormTextarea = ({ label, name, value, onChange, placeholder }) => (
    <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        ></textarea>
    </div>
);

/**
 * Komponen untuk halaman registrasi khusus jalur Magister Reguler.
 */
const RegisterMagisterPage = ({ setCurrentPage }) => {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        alamat: '',
        jenisKelamin: '',
        nomorTelepon: '',
        sumberPendaftaran: '',
        password: '',
        konfirmPassword: '',
        agreePolicy: false,
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showKonfirmPassword, setShowKonfirmPassword] = useState(false);
    const [ktpFileName, setKtpFileName] = useState('No file chosen');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setKtpFileName(e.target.files[0].name);
        } else {
            setKtpFileName('No file chosen');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (formData.password !== formData.konfirmPassword) {
            setError("Password dan konfirmasi password tidak cocok.");
            return;
        }
        if (!formData.agreePolicy) {
            setError("Anda harus menyetujui kebijakan kami.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register-magister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    nama: formData.nama,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.email) {
                     throw new Error(data.email[0]);
                }
                throw new Error(data.message || 'Registrasi gagal.');
            }

            setSuccessMessage('Registrasi Magister berhasil! Silakan login.');
            setFormData({
                nama: '', email: '', alamat: '', jenisKelamin: '', nomorTelepon: '',
                sumberPendaftaran: '', password: '', konfirmPassword: '', agreePolicy: false,
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
             <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="flex flex-col justify-end h-full p-12 bg-black bg-opacity-50 text-white">
                    <h2 className="text-4xl font-bold">Bergabunglah Bersama Kami</h2>
                    <p className="text-lg mt-2">Buat akun Anda untuk memulai perjalanan pendidikan di ITATS.</p>
                </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg overflow-y-auto" style={{ maxHeight: '95vh' }}>
                     <div className="text-center mb-6">
                        <img src="/images/logo_pmb_color.png" alt="Logo PMB" className="mx-auto mb-4 h-16" />
                        <h1 className="text-2xl font-bold text-gray-800">Daftar Akun Baru (Magister Reguler)</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                        {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
                        
                        <div className="mb-6 p-4 border rounded-lg">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Scan KTP untuk mempermudah pendaftaran</label>
                            <div className="flex items-center gap-4">
                                <label htmlFor="ktp-file" className="cursor-pointer bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                    Choose File
                                </label>
                                <input id="ktp-file" type="file" className="hidden" onChange={handleFileChange} />
                                <span className="text-gray-500 text-sm italic">{ktpFileName}</span>
                                <button type="button" className="ml-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Scan</button>
                            </div>
                        </div>

                        <FormInputWithIcon icon={<FaUser className="text-gray-400" />} label="Nama" name="nama" type="text" value={formData.nama} onChange={handleInputChange} placeholder="Nama Anda..." />
                        <FormInputWithIcon icon={<FaEnvelope className="text-gray-400" />} label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="example@example.com" />
                        <FormTextarea label="Alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Alamat Anda..." />
                        <FormSelect label="Jenis Kelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={handleInputChange}>
                            <option value="">-- Pilih jenis kelamin --</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </FormSelect>
                        <FormInputWithIcon icon={<FaPhone className="text-gray-400" />} label="Nomor Telepon" name="nomorTelepon" type="tel" value={formData.nomorTelepon} onChange={handleInputChange} placeholder="+62/0812345678" />
                        
                        <FormSelect label="Sumber Pendaftaran" name="sumberPendaftaran" value={formData.sumberPendaftaran} onChange={handleInputChange}>
                            <option value="">-- Mengenal ITATS dari ? --</option>
                            <option>Brosur</option>
                            <option>Pameran</option>
                            <option>Instagram</option>
                            <option>Teman</option>
                        </FormSelect>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <span className="text-sm mr-2">Show Password</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                         <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Konfirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input type={showKonfirmPassword ? 'text' : 'password'} name="konfirmPassword" value={formData.konfirmPassword} onChange={handleInputChange} placeholder="Confirm Password" required className="w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="flex items-center justify-end mt-2">
                                <span className="text-sm mr-2">Show Password</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={showKonfirmPassword} onChange={() => setShowKonfirmPassword(!showKonfirmPassword)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center">
                                <input type="checkbox" name="agreePolicy" checked={formData.agreePolicy} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <span className="ml-2 text-sm text-gray-600">I agree the policy. <a href="#" className="text-blue-600 hover:underline">baca disini</a></span>
                            </label>
                        </div>
                        
                        <div className="flex justify-center my-6">
                            <div className="w-72 h-20 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center text-gray-500">
                                reCAPTCHA Placeholder
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <a href="#" onClick={() => setCurrentPage('login')} className="text-sm text-blue-600 hover:underline">Sudah Punya Akun? Login disini</a>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400" disabled={isLoading}>
                                {isLoading ? 'Mendaftar...' : 'Daftar'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-6">
                        <a href="#" onClick={() => setCurrentPage('home')} className="text-sm text-blue-600 hover:underline">Back To Home</a>
                        <p className="text-xs text-gray-400 mt-4">Copyright © 2021 PSI Institut Teknologi Adhi Tama Surabaya 2023</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterMagisterPage;
