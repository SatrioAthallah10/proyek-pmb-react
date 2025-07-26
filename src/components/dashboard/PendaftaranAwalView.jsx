import React, { useState } from 'react';

/**
 * Komponen untuk input form yang bisa digunakan kembali.
 */
const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, className = '', readOnly = false }) => (
    <div className={`mb-6 ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder || `Masukkan ${label.toLowerCase()}`}
            required
            readOnly={readOnly}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
    </div>
);

/**
 * Komponen untuk select/dropdown form yang bisa digunakan kembali.
 */
const FormSelect = ({ label, name, value, onChange, children, className = '' }) => (
    <div className={`mb-6 ${className}`}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
        >
            {children}
        </select>
    </div>
);


/**
 * Komponen untuk formulir pendaftaran awal yang bertingkat (multi-step).
 */
const PendaftaranAwalView = () => {
    // State untuk melacak langkah formulir yang sedang aktif
    const [step, setStep] = useState(1);
    
    // State untuk menyimpan semua data dari formulir
    const [formData, setFormData] = useState({
        // Step 1: Biodata
        namaLengkap: 'Satrio Athallah Kresno Pramudya',
        noKtp: '3173071310021002',
        noPonsel: '087753177808',
        alamat: 'Perumahan Banjarmukti Residence kavling amarilis Blok H nomor 3, Sidoarjo',
        tempatLahir: 'DKI JAKARTA',
        tanggalLahir: '2002-10-13',
        // Step 2: Asal Sekolah
        asalSekolah: 'Sekolah Menengah Atas',
        namaSekolah: 'SMA MUJAHIDIN',
        jurusan: 'IPA',
        statusSekolah: 'Swasta',
        alamatSekolah: 'Jl.perak Barat No.275 60165',
        kotaSekolah: 'SURABAYA',
        nilaiRataRata: '82',
        scanRapor: 'abaikan', // 'upload' atau 'abaikan'
        // Step 3: Pilihan Program Studi
        prodi: 'Teknik Informatika',
        jadwalKuliah: 'Malam',
        tahunAjaran: '2025 - 2026 Semester Ganjil',
        tanggalMulai: '1 September 2025',
    });
    
    // PERBAIKAN: State baru untuk menyimpan nama file yang di-upload
    const [raporFileName, setRaporFileName] = useState('No file chosen');

    // Fungsi untuk menangani perubahan pada input
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'radio' ? value : value 
        }));
    };
    
    // PERBAIKAN: Fungsi baru untuk menangani perubahan pada input file
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setRaporFileName(e.target.files[0].name);
        } else {
            setRaporFileName('No file chosen');
        }
    };

    // Fungsi untuk pindah ke langkah berikutnya
    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    // Fungsi untuk kembali ke langkah sebelumnya
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // Komponen untuk tombol navigasi langkah (Biodata, Asal Sekolah, dll.)
    const StepButton = ({ title, active }) => (
        <button className={`px-8 py-3 rounded-lg font-semibold transition-colors text-sm ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {title}
        </button>
    );

    // Fungsi untuk menampilkan konten formulir berdasarkan langkah saat ini
    const renderStepContent = () => {
        switch (step) {
            case 1: // Langkah Biodata
                return (
                    <div>
                        <FormInput label="Nama Lengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} />
                        <FormInput label="No KTP" name="noKtp" value={formData.noKtp} onChange={handleInputChange} />
                        <FormInput label="No Ponsel Aktif" name="noPonsel" value={formData.noPonsel} onChange={handleInputChange} />
                        <div className="mb-6">
                           <label htmlFor="alamat" className="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                           <textarea
                               id="alamat"
                               name="alamat"
                               value={formData.alamat}
                               onChange={handleInputChange}
                               rows="3"
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                           ></textarea>
                        </div>
                         <FormSelect label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleInputChange}>
                               <option>DKI JAKARTA</option>
                               <option>SURABAYA</option>
                               <option>SIDOARJO</option>
                               <option>GRESIK</option>
                         </FormSelect>
                        <FormInput label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleInputChange} />
                    </div>
                );
            case 2: // Langkah Asal Sekolah
                return (
                    <div>
                        <FormSelect label="Asal Sekolah" name="asalSekolah" value={formData.asalSekolah} onChange={handleInputChange}>
                            <option>Sekolah Menengah Atas</option>
                            <option>Sekolah Menengah Kejuruan</option>
                            <option>Madrasah Aliyah</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput label="Nama Sekolah" name="namaSekolah" value={formData.namaSekolah} onChange={handleInputChange} className="md:col-span-1" />
                            <FormInput label="Jurusan" name="jurusan" value={formData.jurusan} onChange={handleInputChange} className="md:col-span-1" />
                            <FormSelect label="Status Sekolah" name="statusSekolah" value={formData.statusSekolah} onChange={handleInputChange} className="md:col-span-1">
                                <option>Swasta</option>
                                <option>Negeri</option>
                            </FormSelect>
                        </div>
                        <div className="mb-6">
                           <label htmlFor="alamatSekolah" className="block text-sm font-medium text-gray-500 mb-1">Alamat Sekolah</label>
                           <textarea
                               id="alamatSekolah"
                               name="alamatSekolah"
                               value={formData.alamatSekolah}
                               onChange={handleInputChange}
                               rows="3"
                               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                           ></textarea>
                        </div>
                        <FormSelect label="Kota" name="kotaSekolah" value={formData.kotaSekolah} onChange={handleInputChange}>
                            <option>SURABAYA</option>
                            <option>SIDOARJO</option>
                            <option>GRESIK</option>
                            <option>JAKARTA</option>
                        </FormSelect>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Nilai Rata-Rata" name="nilaiRataRata" type="number" value={formData.nilaiRataRata} onChange={handleInputChange} />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Scan Rapor (Semester Terakhir)</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center">
                                    <input type="radio" name="scanRapor" value="upload" checked={formData.scanRapor === 'upload'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    <span className="ml-2 text-sm text-gray-700">Upload Scan Rapor</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="scanRapor" value="abaikan" checked={formData.scanRapor === 'abaikan'} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    <span className="ml-2 text-sm text-gray-700">Abaikan Upload Scan Rapor</span>
                                </label>
                            </div>
                             {/* PERBAIKAN: Input file yang muncul secara kondisional */}
                            {formData.scanRapor === 'upload' && (
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <label htmlFor="raporFile" className="cursor-pointer bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                                            Choose File
                                        </label>
                                        <input id="raporFile" type="file" className="hidden" onChange={handleFileChange} />
                                        <span className="ml-4 text-gray-500">{raporFileName}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 3: // Langkah Pilihan Program Studi
                return (
                    <div>
                        <FormSelect label="Prodi" name="prodi" value={formData.prodi} onChange={handleInputChange}>
                            <option>Teknik Informatika</option>
                            <option>Sistem Informasi</option>
                            <option>Teknik Industri</option>
                            <option>Teknik Mesin</option>
                            <option>Teknik Elektro</option>
                            <option>Teknik Sipil</option>
                            <option>Arsitektur</option>
                        </FormSelect>
                        <FormSelect label="Jadwal Perkuliahan" name="jadwalKuliah" value={formData.jadwalKuliah} onChange={handleInputChange}>
                            <option>Pagi</option>
                            <option>Malam</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormSelect label="Tahun Ajaran" name="tahunAjaran" value={formData.tahunAjaran} onChange={handleInputChange}>
                                <option>2025 - 2026 Semester Ganjil</option>
                                <option>2025 - 2026 Semester Genap</option>
                            </FormSelect>
                             <FormInput label="Tanggal Mulai Perkuliahan" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleInputChange} readOnly={true} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Indikator Langkah */}
            <div className="flex justify-center items-center gap-4 mb-8 pb-4 border-b">
                <StepButton title="Biodata" active={step === 1} />
                <StepButton title="Asal Sekolah" active={step === 2} />
                <StepButton title="Pilihan Program Studi" active={step === 3} />
            </div>

            {/* Konten Form */}
            <div className="mb-8">
                {renderStepContent()}
            </div>

            {/* Tombol Navigasi Form */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-8 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Sebelumnya
                </button>
                {step === 3 ? (
                     <button
                        // Fungsi untuk submit form bisa ditambahkan di sini
                        className="bg-green-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Simpan
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Selanjutnya
                    </button>
                )}
            </div>
        </div>
    );
};

export default PendaftaranAwalView;
