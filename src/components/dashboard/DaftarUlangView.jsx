import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Komponen-komponen form yang bisa digunakan kembali
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


/**
 * Komponen untuk formulir Daftar Ulang yang bertingkat.
 */
const DaftarUlangView = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Prodi
        prodi: 'Teknik Informatika',
        jadwalKuliah: 'Malam',
        tahunAjaran: '',
        tanggalMulai: '1 September 2025',
        // Step 2: Data Diri
        nisn: '0023323478',
        kewarganegaraan: 'WNI',
        noTelpRumah: '08176785407',
        alamat: 'Jl. Teluk Betung I/8',
        dusun: 'Perak Utara',
        rt: '005',
        rw: '006',
        kelurahan: 'Perak Utara',
        kodePos: '61252',
        kecamatan: 'Pabean Cantikan',
        kota: '',
        provinsi: 'Jawa Timur',
        agama: 'Islam',
        jenisTinggal: 'Bersama Orang Tua',
        alatTransportasi: 'Sepeda Motor',
        // Step 3: Asal Sekolah
        namaSmu: 'SMA MUJAHIDIN SURABAYA',
        jurusanSmu: 'IPA',
        statusSmu: 'Swasta',
        alamatSmu: 'Jl. Perak Barat 275, Perak Utara, Pabean Cantikan, Surabaya, Jawa Timur, Indonesia',
        kotaSmu: '',
        nilaiRata1: '82',
        nilaiRata2: '82',
        // Step 4: Data Wali
        namaAyah: 'Awarul Slamet Rahadi',
        nikAyah: '3173070508670002',
        tanggalLahirAyah: '1967-08-05',
        pendidikanAyah: 'S1',
        pekerjaanAyah: 'Karyawan Swasta',
        penghasilanAyah: 'Rp. 2.000.000 - Rp. 4.999.999',
        namaIbu: 'Devi Dewajani',
        nikIbu: '3173074210700005',
        tanggalLahirIbu: '1970-10-02',
        pendidikanIbu: 'SMA / sederajat',
        pekerjaanIbu: 'Karyawan Swasta',
        penghasilanIbu: 'Rp. 2.000.000 - Rp. 4.999.999',
        nomorOrangTua: '08176785407',
        nomorEmergency: '',
        hubunganEmergency: '',
    });
    const [showAlert, setShowAlert] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const steps = ['Prodi', 'Data Diri', 'Asal Sekolah', 'Data Wali'];

    const renderStepContent = () => {
        switch (step) {
            case 1: // Prodi
                return (
                    <div className="space-y-6">
                        {showAlert && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center">
                                <span>Pilihan Prodi Perkuliahan !</span>
                                <button onClick={() => setShowAlert(false)}><FaTimes /></button>
                            </div>
                        )}
                        <FormSelect label="Prodi" name="prodi" value={formData.prodi} onChange={handleInputChange}>
                            <option>Teknik Informatika</option>
                            <option>Sistem Informasi</option>
                            <option>Teknik Industri</option>
                        </FormSelect>
                        <FormSelect label="Jadwal Perkuliahan" name="jadwalKuliah" value={formData.jadwalKuliah} onChange={handleInputChange}>
                            <option>Pagi</option>
                            <option>Malam</option>
                        </FormSelect>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormSelect label="Tahun Ajaran" name="tahunAjaran" value={formData.tahunAjaran} onChange={handleInputChange}>
                                <option value="">-- Pilih Tahun Ajaran --</option>
                                <option>2025 - 2026 Semester Ganjil</option>
                                <option>2025 - 2026 Semester Genap</option>
                            </FormSelect>
                            <FormInput label="Tanggal Mulai Perkuliahan" name="tanggalMulai" value={formData.tanggalMulai} readOnly />
                        </div>
                    </div>
                );
            case 2: // Data Diri
                return (
                    <div className="space-y-6">
                         {showAlert && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center">
                                <span>Data Calon Mahasiswa !</span>
                                <button onClick={() => setShowAlert(false)}><FaTimes /></button>
                            </div>
                        )}
                        <div className="flex items-end gap-4">
                            <FormInput label="NISN" name="nisn" value={formData.nisn} onChange={handleInputChange} className="flex-grow" />
                            <button className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 h-10">Cek NISN</button>
                        </div>
                        <FormSelect label="Kewarganegaraan" name="kewarganegaraan" value={formData.kewarganegaraan} onChange={handleInputChange}>
                            <option>WNI</option>
                            <option>WNA</option>
                            <option>WNI KETURUNAN</option>
                        </FormSelect>
                        <FormInput label="No Telp Rumah" name="noTelpRumah" value={formData.noTelpRumah} onChange={handleInputChange} />
                        <FormTextarea label="Alamat" name="alamat" value={formData.alamat} onChange={handleInputChange} rows="3" />
                        <div className="grid grid-cols-3 gap-4">
                            <FormInput label="Dusun" name="dusun" value={formData.dusun} onChange={handleInputChange} />
                            <FormInput label="RT" name="rt" value={formData.rt} onChange={handleInputChange} />
                            <FormInput label="RW" name="rw" value={formData.rw} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput label="Kelurahan" name="kelurahan" value={formData.kelurahan} onChange={handleInputChange} />
                            <FormInput label="Kode Pos" name="kodePos" value={formData.kodePos} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormSelect label="Kecamatan" name="kecamatan" value={formData.kecamatan} onChange={handleInputChange}>
                                <option>Pabean Cantikan</option>
                                <option>Semampir</option>
                                <option>Krembangan</option>
                            </FormSelect>
                             <FormSelect label="Kota" name="kota" value={formData.kota} onChange={handleInputChange}>
                                <option value="">-- Select Kota --</option>
                                <option>Surabaya</option>
                                <option>Sidoarjo</option>
                            </FormSelect>
                            <FormInput label="Provinsi" name="provinsi" value={formData.provinsi} onChange={handleInputChange} disabled />
                        </div>
                        <FormSelect label="Agama" name="agama" value={formData.agama} onChange={handleInputChange}>
                            <option>Islam</option>
                            <option>Kristen</option>
                            <option>Katolik</option>
                            <option>Hindu</option>
                            <option>Buddha</option>
                            <option>Konghucu</option>
                        </FormSelect>
                        <FormSelect label="Jenis Tinggal" name="jenisTinggal" value={formData.jenisTinggal} onChange={handleInputChange}>
                            <option>Bersama Orang Tua</option>
                            <option>Kost</option>
                            <option>Wali</option>
                        </FormSelect>
                        <FormSelect label="Alat Transportasi" name="alatTransportasi" value={formData.alatTransportasi} onChange={handleInputChange}>
                            <option>Sepeda Motor</option>
                            <option>Mobil</option>
                            <option>Transportasi Umum</option>
                        </FormSelect>
                    </div>
                );
            case 3: // Asal Sekolah
                return (
                     <div className="space-y-6">
                         {showAlert && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center">
                                <span>Sekolah Asal !</span>
                                <button onClick={() => setShowAlert(false)}><FaTimes /></button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormInput label="Nama SMU / SMK" name="namaSmu" value={formData.namaSmu} onChange={handleInputChange} />
                             <FormInput label="Jurusan" name="jurusanSmu" value={formData.jurusanSmu} onChange={handleInputChange} />
                             <FormSelect label="Status" name="statusSmu" value={formData.statusSmu} onChange={handleInputChange}>
                                 <option>Swasta</option>
                                 <option>Negeri</option>
                             </FormSelect>
                        </div>
                        <FormTextarea label="Alamat Sekolah" name="alamatSmu" value={formData.alamatSmu} onChange={handleInputChange} rows="3" />
                        <FormSelect label="Kota" name="kotaSmu" value={formData.kotaSmu} onChange={handleInputChange}>
                            <option value="">-- Pilih Kota --</option>
                            <option>Surabaya</option>
                            <option>Sidoarjo</option>
                            <option>Gresik</option>
                        </FormSelect>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <FormInput label="Nilai Rata-Rata" name="nilaiRata1" value={formData.nilaiRata1} onChange={handleInputChange} type="number" />
                             <FormInput label=" " name="nilaiRata2" value={formData.nilaiRata2} onChange={handleInputChange} type="number" />
                        </div>
                    </div>
                );
            case 4: // Data Wali
                return (
                    <div className="space-y-6">
                        {showAlert && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg flex justify-between items-center">
                                <span>Data Orang Tua/Wali !</span>
                                <button onClick={() => setShowAlert(false)}><FaTimes /></button>
                            </div>
                        )}
                        {/* Data Ayah */}
                        <div className="pt-4">
                            <FormInput label="Nama Ayah" name="namaAyah" value={formData.namaAyah} onChange={handleInputChange} />
                            <FormInput label="NIK Ayah" name="nikAyah" value={formData.nikAyah} onChange={handleInputChange} />
                            <FormInput label="Tanggal Lahir Ayah" name="tanggalLahirAyah" value={formData.tanggalLahirAyah} onChange={handleInputChange} type="date" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormSelect label="Pendidikan Ayah" name="pendidikanAyah" value={formData.pendidikanAyah} onChange={handleInputChange}>
                                    <option>S1</option><option>D3</option><option>SMA / sederajat</option>
                                </FormSelect>
                                <FormSelect label="Pekerjaan Ayah" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleInputChange}>
                                    <option>Karyawan Swasta</option><option>Wiraswasta</option><option>PNS</option>
                                </FormSelect>
                                <FormSelect label="Penghasilan Ayah" name="penghasilanAyah" value={formData.penghasilanAyah} onChange={handleInputChange}>
                                    <option>Rp. 2.000.000 - Rp. 4.999.999</option><option>&lt; Rp. 2.000.000</option><option>&gt; Rp. 5.000.000</option>
                                </FormSelect>
                            </div>
                        </div>
                         {/* Data Ibu */}
                        <div className="pt-6 border-t mt-6">
                            <FormInput label="Nama Ibu" name="namaIbu" value={formData.namaIbu} onChange={handleInputChange} />
                            <FormInput label="NIK Ibu" name="nikIbu" value={formData.nikIbu} onChange={handleInputChange} />
                            <FormInput label="Tanggal Lahir Ibu" name="tanggalLahirIbu" value={formData.tanggalLahirIbu} onChange={handleInputChange} type="date" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormSelect label="Pendidikan Ibu" name="pendidikanIbu" value={formData.pendidikanIbu} onChange={handleInputChange}>
                                    <option>SMA / sederajat</option><option>S1</option><option>D3</option>
                                </FormSelect>
                                <FormSelect label="Pekerjaan Ibu" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleInputChange}>
                                    <option>Karyawan Swasta</option><option>Ibu Rumah Tangga</option><option>Wiraswasta</option><option>PNS</option>
                                </FormSelect>
                                <FormSelect label="Penghasilan Ibu" name="penghasilanIbu" value={formData.penghasilanIbu} onChange={handleInputChange}>
                                    <option>Rp. 2.000.000 - Rp. 4.999.999</option><option>&lt; Rp. 2.000.000</option><option>&gt; Rp. 5.000.000</option>
                                </FormSelect>
                            </div>
                        </div>
                        {/* Kontak Darurat */}
                        <div className="pt-6 border-t mt-6">
                             <FormInput label="Nomor Orang Tua / Wali" name="nomorOrangTua" value={formData.nomorOrangTua} onChange={handleInputChange} />
                             <FormInput label="Nomor Emergency" name="nomorEmergency" value={formData.nomorEmergency} onChange={handleInputChange} />
                             <FormInput label="Hubungan Dengan Pemilik Nomor" name="hubunganEmergency" value={formData.hubunganEmergency} onChange={handleInputChange} />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Navigasi Langkah */}
            <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 pb-4 border-b">
                {steps.map((title, index) => (
                    <button key={index} onClick={() => setStep(index + 1)} className={`px-4 md:px-8 py-3 rounded-lg font-semibold transition-colors text-xs md:text-sm ${step === index + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                        {title}
                    </button>
                ))}
            </div>

            {/* Konten Form */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{steps[step - 1]}</h2>
                {renderStepContent()}
            </div>

            {/* Tombol Navigasi Form */}
            <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={step === 1}
                    className="bg-gray-300 text-gray-800 font-bold py-2 px-8 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                {step === 4 ? (
                    <button
                        // Fungsi untuk submit form bisa ditambahkan di sini
                        className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Finish
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default DaftarUlangView;
