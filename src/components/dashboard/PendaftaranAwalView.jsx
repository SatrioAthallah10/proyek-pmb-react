import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen FormInput dan FormSelect Anda tetap sama
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


const PendaftaranAwalView = ({ setActiveView, refetchUserData, isRpl = false }) => {
    // Semua state Anda dipertahankan
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        namaLengkap: '',
        noKtp: '',
        noPonsel: '',
        alamat: '',
        tempatLahir: '',
        tanggalLahir: '',
        asalSekolah: 'Sekolah Menengah Atas',
        namaSekolah: '',
        jurusan: '',
        statusSekolah: 'Swasta',
        alamatSekolah: '',
        kotaSekolah: '',
        nilaiRataRata: '',
        scanRapor: 'abaikan',
        prodi: 'Teknik Informatika',
        jadwalKuliah: 'Malam',
        tahunAjaran: '2025 - 2026 Semester Ganjil',
        tanggalMulai: '1 September 2025',
    });
    const [raporFileName, setRaporFileName] = useState('No file chosen');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setFormData(prev => ({ ...prev, namaLengkap: user.name || user.nama_lengkap }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? value : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setRaporFileName(e.target.files[0].name);
        } else {
            setRaporFileName('No file chosen');
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setMessage('');
        setError('');
        const token = localStorage.getItem('token');

        // --- [PENYESUAIAN] ---
        const dataToSend = {
            nama_lengkap: formData.namaLengkap,
            no_ktp: formData.noKtp,
            no_ponsel: formData.noPonsel,
            alamat: formData.alamat,
            tempat_lahir: formData.tempatLahir,
            tanggal_lahir: formData.tanggalLahir,
            asal_sekolah: formData.asalSekolah,
            nama_sekolah: formData.namaSekolah,
            jurusan: formData.jurusan,
            status_sekolah: formData.statusSekolah,
            alamat_sekolah: formData.alamatSekolah,
            kota_sekolah: formData.kotaSekolah,
            nilai_rata_rata: formData.nilaiRataRata,
            prodi_pilihan: formData.prodi,
            kelas: formData.jadwalKuliah, 
            jadwal_kuliah: formData.jadwalKuliah,
            tahun_ajaran: formData.tahunAjaran,
        };
        // --- [AKHIR PENYESUAIAN] ---

        const apiUrl = isRpl 
            ? 'http://127.0.0.1:8000/api/rpl/submit-pendaftaran-awal' 
            : 'http://127.0.0.1:8000/api/submit-pendaftaran-awal';

        try {
            const response = await axios.post(apiUrl, dataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            setMessage(response.data.message || 'Data berhasil disimpan!');
            
            setTimeout(() => {
                refetchUserData();
                setActiveView('konfirmasi-pembayaran');
            }, 1500);

        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                setError(errorMessages);
            } else if (err.response && err.response.data) {
                setError(err.response.data.message || 'Gagal menyimpan data.');
            } else {
                setError('Terjadi kesalahan koneksi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const StepButton = ({ title, active }) => (
        <button type="button" onClick={() => setStep(title === 'Biodata' ? 1 : title === 'Asal Sekolah' ? 2 : 3)} className={`px-8 py-3 rounded-lg font-semibold transition-colors text-sm ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
            {title}
        </button>
    );
    
    const renderStepContent = () => {
        switch (step) {
            case 1: // Biodata
                return (
                    <div>
                        <FormInput label="Nama Lengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} />
                        <FormInput label="No KTP" name="noKtp" value={formData.noKtp} onChange={handleInputChange} />
                        <FormInput label="No Ponsel Aktif" name="noPonsel" value={formData.noPonsel} onChange={handleInputChange} />
                        <div className="mb-6">
                           <label htmlFor="alamat" className="block text-sm font-medium text-gray-500 mb-1">Alamat</label>
                           <textarea id="alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        <FormInput label="Tempat Lahir" name="tempatLahir" value={formData.tempatLahir} onChange={handleInputChange} />
                        <FormInput label="Tanggal Lahir" name="tanggalLahir" type="date" value={formData.tanggalLahir} onChange={handleInputChange} />
                    </div>
                );
            case 2: // Asal Sekolah
                return (
                    <div>
                        <FormSelect label="Asal Sekolah" name="asalSekolah" value={formData.asalSekolah} onChange={handleInputChange}>
                            <option>Sekolah Menengah Atas</option><option>Sekolah Menengah Kejuruan</option><option>Madrasah Aliyah</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput label="Nama Sekolah" name="namaSekolah" value={formData.namaSekolah} onChange={handleInputChange} className="md:col-span-1" />
                            <FormInput label="Jurusan" name="jurusan" value={formData.jurusan} onChange={handleInputChange} className="md:col-span-1" />
                            <FormSelect label="Status Sekolah" name="statusSekolah" value={formData.statusSekolah} onChange={handleInputChange} className="md:col-span-1">
                                <option>Swasta</option><option>Negeri</option>
                            </FormSelect>
                        </div>
                        <div className="mb-6">
                           <label htmlFor="alamatSekolah" className="block text-sm font-medium text-gray-500 mb-1">Alamat Sekolah</label>
                           <textarea id="alamatSekolah" name="alamatSekolah" value={formData.alamatSekolah} onChange={handleInputChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        {/* --- PERUBAHAN DI SINI --- */}
                        <FormInput label="Kota" name="kotaSekolah" value={formData.kotaSekolah} onChange={handleInputChange} />
                        <FormInput label="Nilai Rata-Rata" name="nilaiRataRata" type="number" value={formData.nilaiRataRata} onChange={handleInputChange} />
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Scan Rapor (Semester Terakhir)</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center"><input type="radio" name="scanRapor" value="upload" checked={formData.scanRapor === 'upload'} onChange={handleInputChange} /> <span className="ml-2 text-sm">Upload Scan Rapor</span></label>
                                <label className="flex items-center"><input type="radio" name="scanRapor" value="abaikan" checked={formData.scanRapor === 'abaikan'} onChange={handleInputChange} /> <span className="ml-2 text-sm">Abaikan Upload</span></label>
                            </div>
                            {formData.scanRapor === 'upload' && (
                                <div className="mt-4"><label htmlFor="raporFile" className="cursor-pointer bg-indigo-600 text-white py-2 px-4 rounded-lg">Choose File</label><input id="raporFile" type="file" className="hidden" onChange={handleFileChange} /> <span className="ml-4">{raporFileName}</span></div>
                            )}
                        </div>
                    </div>
                );
            case 3: // Pilihan Program Studi
                return (
                    <div>
                        <FormSelect label="Prodi" name="prodi" value={formData.prodi} onChange={handleInputChange}>
                            <option>Teknik Informatika</option><option>Sistem Informasi</option><option>Teknik Industri</option>
                        </FormSelect>
                        <FormSelect label="Jadwal Perkuliahan" name="jadwalKuliah" value={formData.jadwalKuliah} onChange={handleInputChange}>
                            <option>Pagi</option><option>Malam</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormSelect label="Tahun Ajaran" name="tahunAjaran" value={formData.tahunAjaran} onChange={handleInputChange}>
                                <option>2025 - 2026 Semester Ganjil</option><option>2025 - 2026 Semester Genap</option>
                            </FormSelect>
                            <FormInput label="Tanggal Mulai Perkuliahan" name="tanggalMulai" value={formData.tanggalMulai} readOnly={true} />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex justify-center items-center gap-4 mb-8 pb-4 border-b">
                <StepButton title="Biodata" active={step === 1} />
                <StepButton title="Asal Sekolah" active={step === 2} />
                <StepButton title="Pilihan Program Studi" active={step === 3} />
            </div>
            <div className="mb-8">
                {renderStepContent()}
            </div>
            {message && <p className="text-center text-green-600 mb-4">{message}</p>}
            {error && <p className="text-center text-red-600 mb-4">{error}</p>}
            <div className="flex justify-between">
                <button type="button" onClick={prevStep} disabled={step === 1} className="bg-gray-300 text-gray-800 font-bold py-2 px-8 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed">
                    Sebelumnya
                </button>
                {step === 3 ? (
                     <button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-green-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-600 disabled:bg-gray-400">
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                ) : (
                    <button type="button" onClick={nextStep} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700">
                        Selanjutnya
                    </button>
                )}
            </div>
        </div>
    );
};

export default PendaftaranAwalView;