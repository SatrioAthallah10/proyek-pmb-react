import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

// Komponen-komponen utilitas untuk form
const FormInput = ({ label, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
    </div>
);

const FormSelect = ({ label, children, className = '', ...props }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <select {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500">
            {children}
        </select>
    </div>
);

const FormTextarea = ({ label, className = '', ...props }) => (
     <div className={className}>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <textarea {...props} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
    </div>
);

// Komponen formulir utama
const DaftarUlangView = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [userProgress, setUserProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Sesi tidak valid, silakan login kembali.');
                const data = await response.json();
                setUserProgress(data);
                setFormData(data || {});
            } catch (e) {
                setError(e.message);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');
        setError('');
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/submit-daftar-ulang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Gagal menyimpan data.');
            setMessage('Data berhasil disimpan! Halaman akan dimuat ulang.');
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const steps = ['Prodi', 'Data Diri', 'Asal Sekolah', 'Data Wali'];

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                     <div className="space-y-6">
                        {showAlert && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center">
                                <span>Pilihan Prodi Perkuliahan !</span>
                                <button onClick={() => setShowAlert(false)}><FaTimes /></button>
                            </div>
                        )}
                        <FormSelect label="Prodi" name="prodi_pilihan" value={formData.prodi_pilihan || ''} onChange={handleInputChange}>
                            <option>Teknik Informatika</option><option>Sistem Informasi</option><option>Teknik Industri</option>
                        </FormSelect>
                        <FormSelect label="Jadwal Perkuliahan" name="jadwal_kuliah" value={formData.jadwal_kuliah || ''} onChange={handleInputChange}>
                            <option>Pagi</option><option>Malam</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect label="Tahun Ajaran" name="tahun_ajaran" value={formData.tahun_ajaran || ''} onChange={handleInputChange}>
                                <option value="">-- Pilih Tahun Ajaran --</option>
                                <option>2025 - 2026 Semester Ganjil</option><option>2025 - 2026 Semester Genap</option>
                            </FormSelect>
                            <FormInput label="Tanggal Mulai Perkuliahan" name="tanggalMulai" value="1 September 2025" readOnly />
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div className="space-y-6">
                         {showAlert && ( <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center"><span>Data Calon Mahasiswa !</span><button onClick={() => setShowAlert(false)}><FaTimes /></button></div>)}
                        <div className="flex items-end gap-4"><FormInput label="NISN" name="nisn" value={formData.nisn || ''} onChange={handleInputChange} className="flex-grow" /><button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 h-10">Cek NISN</button></div>
                        <FormSelect label="Kewarganegaraan" name="kewarganegaraan" value={formData.kewarganegaraan || ''} onChange={handleInputChange}><option>WNI</option><option>WNA</option></FormSelect>
                        <FormInput label="No Telp Rumah" name="no_telp_rumah" value={formData.no_telp_rumah || ''} onChange={handleInputChange} />
                        <FormTextarea label="Alamat" name="alamat" value={formData.alamat || ''} onChange={handleInputChange} rows="3" />
                        <div className="grid grid-cols-3 gap-4"><FormInput label="Dusun" name="dusun" value={formData.dusun || ''} onChange={handleInputChange} /><FormInput label="RT" name="rt" value={formData.rt || ''} onChange={handleInputChange} /><FormInput label="RW" name="rw" value={formData.rw || ''} onChange={handleInputChange} /></div>
                        <div className="grid grid-cols-2 gap-4"><FormInput label="Kelurahan" name="kelurahan" value={formData.kelurahan || ''} onChange={handleInputChange} /><FormInput label="Kode Pos" name="kode_pos" value={formData.kode_pos || ''} onChange={handleInputChange} /></div>
                        <div className="grid grid-cols-3 gap-4"><FormSelect label="Kecamatan" name="kecamatan" value={formData.kecamatan || ''} onChange={handleInputChange}><option>Pabean Cantikan</option></FormSelect><FormSelect label="Kota" name="kota" value={formData.kota || ''} onChange={handleInputChange}><option value="">-- Select Kota --</option><option>Surabaya</option></FormSelect><FormInput label="Provinsi" name="provinsi" value={formData.provinsi || ''} onChange={handleInputChange} disabled /></div>
                        <FormSelect label="Agama" name="agama" value={formData.agama || ''} onChange={handleInputChange}><option>Islam</option><option>Kristen</option></FormSelect>
                        <FormSelect label="Jenis Tinggal" name="jenis_tinggal" value={formData.jenis_tinggal || ''} onChange={handleInputChange}><option>Bersama Orang Tua</option></FormSelect>
                        <FormSelect label="Alat Transportasi" name="alat_transportasi" value={formData.alat_transportasi || ''} onChange={handleInputChange}><option>Sepeda Motor</option></FormSelect>
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-6">
                        {showAlert && ( <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center"><span>Sekolah Asal !</span><button onClick={() => setShowAlert(false)}><FaTimes /></button></div>)}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><FormInput label="Nama SMU / SMK" name="nama_sekolah" value={formData.nama_sekolah || ''} onChange={handleInputChange} /><FormInput label="Jurusan" name="jurusan" value={formData.jurusan || ''} onChange={handleInputChange} /><FormSelect label="Status" name="status_sekolah" value={formData.status_sekolah || ''} onChange={handleInputChange}><option>Swasta</option><option>Negeri</option></FormSelect></div>
                        <FormTextarea label="Alamat Sekolah" name="alamat_sekolah" value={formData.alamat_sekolah || ''} onChange={handleInputChange} rows="3" />
                        <FormSelect label="Kota" name="kota_sekolah" value={formData.kota_sekolah || ''} onChange={handleInputChange}><option value="">-- Pilih Kota --</option><option>Surabaya</option></FormSelect>
                        <FormInput label="Nilai Rata-Rata" name="nilai_rata_rata" value={formData.nilai_rata_rata || ''} onChange={handleInputChange} type="number" />
                    </div>
                );
            case 4:
                return (
                     <div className="space-y-6">
                        {showAlert && (<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center"><span>Data Orang Tua/Wali !</span><button onClick={() => setShowAlert(false)}><FaTimes /></button></div>)}
                        <div className="pt-4"><FormInput label="Nama Ayah" name="nama_ayah" value={formData.nama_ayah || ''} onChange={handleInputChange} /><FormInput label="NIK Ayah" name="nik_ayah" value={formData.nik_ayah || ''} onChange={handleInputChange} /><FormInput label="Tanggal Lahir Ayah" name="tanggal_lahir_ayah" value={formData.tanggal_lahir_ayah || ''} onChange={handleInputChange} type="date" /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><FormSelect label="Pendidikan Ayah" name="pendidikan_ayah" value={formData.pendidikan_ayah || ''} onChange={handleInputChange}><option>S1</option></FormSelect><FormSelect label="Pekerjaan Ayah" name="pekerjaan_ayah" value={formData.pekerjaan_ayah || ''} onChange={handleInputChange}><option>Karyawan Swasta</option></FormSelect><FormSelect label="Penghasilan Ayah" name="penghasilan_ayah" value={formData.penghasilan_ayah || ''} onChange={handleInputChange}><option>Rp. 2.000.000 - Rp. 4.999.999</option></FormSelect></div></div>
                        <div className="pt-6 border-t mt-6"><FormInput label="Nama Ibu" name="nama_ibu" value={formData.nama_ibu || ''} onChange={handleInputChange} /><FormInput label="NIK Ibu" name="nik_ibu" value={formData.nik_ibu || ''} onChange={handleInputChange} /><FormInput label="Tanggal Lahir Ibu" name="tanggal_lahir_ibu" value={formData.tanggal_lahir_ibu || ''} onChange={handleInputChange} type="date" /><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><FormSelect label="Pendidikan Ibu" name="pendidikan_ibu" value={formData.pendidikan_ibu || ''} onChange={handleInputChange}><option>SMA / sederajat</option></FormSelect><FormSelect label="Pekerjaan Ibu" name="pekerjaan_ibu" value={formData.pekerjaan_ibu || ''} onChange={handleInputChange}><option>Karyawan Swasta</option></FormSelect><FormSelect label="Penghasilan Ibu" name="penghasilan_ibu" value={formData.penghasilan_ibu || ''} onChange={handleInputChange}><option>Rp. 2.000.000 - Rp. 4.999.999</option></FormSelect></div></div>
                        <div className="pt-6 border-t mt-6"><FormInput label="Nomor Orang Tua / Wali" name="nomor_orang_tua" value={formData.nomor_orang_tua || ''} onChange={handleInputChange} /></div>
                    </div>
                );
            default: return null;
        }
    };

    if (!userProgress) {
        return <div className="text-center p-8">Memuat data...</div>;
    }
    
    if (userProgress.pengisian_data_diri_completed) {
        return (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-green-600 mb-4">Proses Daftar Ulang Selesai</h1>
                <p className="text-gray-600">Terima kasih, Anda telah melengkapi semua data yang diperlukan untuk proses daftar ulang.</p>
                <p className="text-gray-600 mt-2">Silakan tunggu informasi selanjutnya dari kami mengenai penerbitan NPM.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 pb-4 border-b">
                {steps.map((title, index) => (
                    <button key={index} onClick={() => setStep(index + 1)} className={`px-4 md:px-8 py-3 rounded-lg font-semibold transition-colors text-xs md:text-sm ${step === index + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                        {title}
                    </button>
                ))}
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{steps[step - 1]}</h2>
                {renderStepContent()}
            </div>
            
            {message && <p className="text-center text-green-600 mb-4">{message}</p>}
            {error && <p className="text-center text-red-600 mb-4">{error}</p>}

            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-8 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {step === 4 ? (
                    <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Menyimpan...' : 'Finish'}
                    </button>
                ) : (
                    <button onClick={nextStep} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default DaftarUlangView;