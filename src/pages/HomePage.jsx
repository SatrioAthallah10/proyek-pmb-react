import React, { useState, useEffect } from 'react';
import { FaBookOpen, FaGraduationCap, FaUser, FaPlus, FaMinus } from 'react-icons/fa';
import { prodiData } from '../data/mockData.js';

// --- DATA BARU UNTUK FITUR TAMBAHAN ---
const fakultasData = [
  {
    nama: 'Fakultas Teknologi Industri',
    prodi: [
      { nama: 'Teknik Mesin', deskripsi: 'REKAYASA MESIN DAN OTOMASI', akreditasi: 'Akreditasi Baik Sekali', keahlian: 'Otomotif, Manufaktur, Material & Metalurgi, Desain, Konversi Energi, Energi Terbaharukan', bidangKerja: 'PNS/ ASN, BUMN (Manufaktur, Otomotif, Material, Kedirgantaran, Pertambangan, Eneergi Perminyakan), kontraktor, pengusaha permesinan, konstruksi, Akademisi.', alumni: 'PJB, PLN, Pelindo, Astra Group, BSN, National Taiwan University ofScience andy Technology, Chung Yuan Christian University' },
      { nama: 'Teknik Kimia', deskripsi: 'REKAYASA KIMIA DAN TEKNOLOGI MATERIAL', akreditasi: 'Akreditasi Baik Sekali', keahlian: 'Perancangan Pabrik & Proses Industri, Pengolahan Air & limbah cair, Pengelolaan Limbah, Analisa Resiko.', bidangKerja: 'ASN/PNS, BUMN, akademisi, industri minyak dan gas, industri barang konsumen (Nestle, Unil Unilever, P&G), analis laboratorium, manajer produksi farmasi, food & beverage, kosmetik, konsultan.', alumni: 'Aice, PT Eco Prima Energi (EPE), Schlumberger, PT Petrokimia Gresik, Tjiwi Kimia Paper Production.' },
      { nama: 'Teknik Perkapalan', deskripsi: 'TEKNOLOGI KAPAL DAN MARITIM', akreditasi: 'Akreditasi B', keahlian: 'Desain dan produksi kapal, Sistem permesinan kapal, Keselamatan kerja, Transportasi kapal, Pengelasan', bidangKerja: 'ASN/PNS, BUMN, dosen, galangan kapal, welding inspector, industri transportasi laut, penyedia kapal untuk industri oil & gas, industri perikanan, industri pertahanan, perbaikan kapal, industri sarana lepas pantai.', alumni: 'PELNI, Sloko, Andalan Hydraulic / Pneumatic Cylinder Solutions PBS, Wilmar, Jakarta International Container Terminal, Singatac.' },
      { nama: 'Teknik Industri', deskripsi: 'TEKNIK INDUSTRI 4.0 DAN MANUFAKTUR', akreditasi: 'Akreditasi Baik Sekali', keahlian: 'Manajemen Kualitas, Manajemen Produksi, Rantai Pasok, PPIC', bidangKerja: 'ASN/PNS (Dinas Perindustrian PUPR), BUMN, dosen, manajer pemeliharaan industri, perbankan, otomotif manufaktur, pengusaha manufaktur, logistic specialist, manajer produksi.', alumni: 'PT Freeport Indonesia, PT Semen Indonesia Logistik, PT Surya Pemenang, Astra Toyota Auto 2000, PT Kawan Lama Solusi.' },
      { nama: 'Teknik Pertambangan', deskripsi: 'EKSPLORASI DAN TEKNOLOGI PERTAMBANGAN', akreditasi: 'Akreditasi Baik Sekali', keahlian: 'Eksplorasi & Eksploitasi Pertambangan, Reklamasi pasca tambang.', bidangKerja: 'Pertambangan (Freeport, Antam, Amman Mineral, Vale, Bukit Asam), industri (Semen Indonesia, Holcim, SCG), migas (PGN, Pertamina, Chevron), ASN/PNS, BUMN, peneliti, akademisi, pengusaha tambang.', alumni: 'Antam, PT Freeport Indonesia, Vale, PT Adaro Energy, Bukit Asam, PT Kawan Lama Solusi.' },
    ]
  },
  {
    nama: 'Fakultas Teknik Sipil dan Perencanaan',
    prodi: [
      { nama: 'Teknik Sipil', deskripsi: 'TEKNIK INFRASTRUKTUR DAN KONTRUKSI', akreditasi: 'Akreditasi B', keahlian: 'Struktur, Manajemen dan Teknik Konstruksi Transportasi, Geoteknik.', bidangKerja: 'ASN/PNS, BUMN, Surveyor, Konsultan Konstruksi, Kontraktor, Insinyur Sipil, Manajer Konstruksi, Drafter, Manajer Proyek.', alumni: 'Wika, Pelindo, PUPR, Nindya,PAL Indonesia, Chung Yuan Christian University, Seoul Nativersity, Guilin University of Electronic Technology.' },
      { nama: 'Arsitektur', deskripsi: 'DESAIN ARSITEKTUR DAN PERENCANAAN KOTA', akreditasi: 'Akreditasi B', keahlian: 'Perancangan Arsitektur, Kota, Interior, Taman, Perumahan, Teknologi Bangunan, Desain Bangunan, Desain Produk, Desain Komunikasi Visual.', bidangKerja: 'ASN/PNS, BUMN, Interior & Eksterior Designer, Konsultan Perencana, Konsultan Pengawas, Kontraktor, Project Manager, Site Manager, Akademisi, Pengusaha Desain, Real Estate Developer.', alumni: 'Adhi, Waringin General Contractor,Wika, Pemerintah Kota Surabaya, Dinas Pekerjaan Umum, Design Studio, CV Agra Kriya Bintang Architects' },
      { nama: 'Teknik Lingkungan', deskripsi: 'TEKNOLOGI DAN REKAYASA LINGKUNGAN', akreditasi: 'Akreditasi Baik Sekali', keahlian: 'Penyediaan Air Minum, Pengelolaan Air Limbah, Sampah, Limbah B3, Kualitas Udara, K3, AMDAL.', bidangKerja: 'ASN (Kementerian PUPR, Lingkungan Hidup, Lingkungan Hidup, Kesehatan, ESDM), BUMN, PDAM, Konsultan Teknik Lingkungan, Tenaga Ahli Air Bersih & Limbah, Industri Tambang, Tekstil, Makanan & Minuman, Sanitarian, Akademisi.', alumni: 'Pertamina, Dinas Pekerjaan Umum, PT Freeport Indonesia, Surveyor Indonesia, Dinas Lingkungan Hidup, Chung Yuan Christian University.' },
    ]
  },
  {
    nama: 'Fakultas Teknik Elektro dan Teknologi Informasi',
    prodi: [
        { nama: 'Teknik Informatika', deskripsi: 'INFORMATIKA DAN PENGEMBANGAN APLIKASI', akreditasi: 'Akreditasi B', keahlian: 'Rekayasa Perangkat Lunak (RPL), Sistem Cerdas (AI), Komputasi Berbasis Jaringan (Jaringan Komputer).', bidangKerja: 'Programmer Web, Pengembang Game, Data Scientist, Data Analyst, Manajer IT, ASN/PNS, Guru dan Dosen, Manajer Jaringan Komputer, Teknisi Jaringan Komputer, IT Specialist, System Analyst, Pengusaha IT, Android Developer, IT Support, Automation.', alumni: 'Wevelope, Charoen Pokphand Indonesia, Next Marks, Sinergi Informatika Semen Indonesia, PT. Adhitama Mitra Nusantara.' },
        { nama: 'Sistem Informasi', deskripsi: 'SISTEM INFORMASI DIGITAL DAN DATA', akreditasi: 'Akreditasi B', keahlian: 'Sistem Informasi Perusahaan, Bisnis Digital, Data Sains, Manajemen Audit Sistem Informasi/TI.', bidangKerja: 'Programmer/Web Developer, Sistem Analis, Guru dan Dosen, PNS/ASN, BUMN, Manajer IT, Database Administrator, Keamanan Jaringan Komputer, Pengusaha IT, Auditor Sistem Informasi, UI/UX Desainer.', alumni: 'Telkom Indonesia, Semen Indonesia, Bank BTPN, BPKP, IHC (Rumah Sakit PHC Surabaya), Perkebunan Nusantara' },
        { nama: 'Teknik Elektro', deskripsi: 'TEKNOLOGI LISTRIK DAN ELEKTRONIKA CERDAS', akreditasi: 'Akreditasi B', keahlian: 'Image Processing, Robotika, Sistem Kendali, Mobile Programming, Embedded System,PLC, Mesin & Peralatan Listrik, Tegangan Tinggi, Energi Terbarukan, SCADA Kualitas & Keandalan Daya.', bidangKerja: 'PLN, Indonesia Power, PJB, ASN/PNS, Guru/Dosen, Supervisor Listrik, Perancang Sistem Kelistrikan, Pengusaha, AI Design, Maintenance Supervisor, IoT Software Developer, Technopreneur, System Engineer, Project Engineer, Control System Engineer, Power Plant Engineer, Renewable Energy Engineer.', alumni: 'PJB, PLN, PAL Indonesia, Pertamina, PT. Len Industri.' },
    ]
  }
];
const faqData = [
    { question: 'Apa saja Program Studi yang tersedia di Institut Teknologi Adhi Tama Surabaya ?', answer: 'Program Studi yang tersedia adalah Teknik Mesin, Teknik Industri, Teknik Kimia, Teknik Pertambangan, Teknik Perkapalan, Teknik Sipil, Arsitektur, Teknik Lingkungan, Teknik Elektro, Teknik Informatika, Sistem Informasi. Serta 2 Program Studi Magister yaitu Magister Teknik Industri dan Magister Teknik Lingkungan.' },
    { question: 'Apakah tersedia kelas malam di Institut Teknologi Adhi Tama Surabaya?', answer: 'Ya, di Institut Teknologi Adhi Tama Surabaya tersedia kelas Malam dengan pembelajaran Hybrid Learning.' },
    { question: 'Berapa biaya BPP/SPP di Institut Teknologi Adhi Tama Surabaya?', answer: 'Biaya BPP/SPP di Institut Teknologi Adhi Tama Surabaya adalah Rp 1.300.000 untuk kelas pagi dan Rp 1.400.000 untuk kelas malam.' },
    { question: 'Apakah ada beasiswa di Institut Teknologi Adhi Tama Surabaya ?', answer: 'Ya. Tersedia.' },
];
const contactData = [ 'Kurniawan', 'Hamdan', 'Anwar', 'Admin Helma', 'Admin Rahman' ];
const heroImages = [
    '/images/gambar-hero-section.jpeg',
    '/images/gambar-hero-section2.png',
];

// --- SUB-KOMPONEN BARU ---

const BiayaPersyaratanSarjana = () => {
    const [activeSubTab, setActiveSubTab] = useState('biaya');

    const CostTable = ({ title, headers, data, footnote }) => (
        <div className="mb-6">
            <h4 className="text-lg font-semibold text-center text-gray-700 mb-2">{title}</h4>
            <table className="w-full text-center border">
                <thead className="bg-[#003366] text-white">
                    <tr>
                        {headers.map((header, i) => <th key={i} className="py-2 px-3 font-semibold">{header}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-gray-50">
                    {data.map((row, i) => (
                        <tr key={i}>
                            {row.map((cell, j) => <td key={j} className="py-2 px-3 border-t">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
            {footnote && <p className="text-xs text-gray-500 mt-2 text-left">{footnote}</p>}
        </div>
    );

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Biaya Dan Persyaratan</h3>
            <div className="border-b border-gray-300">
                <button 
                    onClick={() => setActiveSubTab('biaya')}
                    className={`py-2 px-4 font-semibold transition-colors ${activeSubTab === 'biaya' ? 'border-b-2 border-[#003366] text-[#003366]' : 'text-gray-500 hover:text-[#003366]'}`}
                >
                    BIAYA
                </button>
                <button 
                    onClick={() => setActiveSubTab('persyaratan')}
                    className={`py-2 px-4 font-semibold transition-colors ${activeSubTab === 'persyaratan' ? 'border-b-2 border-[#003366] text-[#003366]' : 'text-gray-500 hover:text-[#003366]'}`}
                >
                    PERSYARATAN
                </button>
            </div>
            <div className="mt-4 text-gray-700">
                {activeSubTab === 'biaya' && (
                    <div>
                        <CostTable 
                            title="Biaya Pendaftaran"
                            headers={['Jalur Reguler', 'Jalur Event/Undangan']}
                            data={[['Rp 300.000', 'Rp 150.000']]}
                        />
                        <CostTable 
                            title="Total Biaya Daftar Ulang"
                            headers={['Pendahuluan*', 'Daftar Ulang', 'Total Biaya']}
                            data={[['Rp 1.350.000', 'Rp 300.000', <b key="total">Rp 1.650.000</b>]]}
                            footnote="*Kegiatan Pendahuluan (Pengenalan Kehidupan Kampus, test TEFL, TPA dan Atribut Almamater)"
                        />
                         <CostTable 
                            title="Biaya Penyelenggaraan Pendidikan (BPP)"
                            headers={['Kelas', 'Per Bulan', '*Per Semester (potongan 10%)']}
                            data={[
                                ['Pagi', 'Rp 1.300.000', 'Rp 7.020.000'],
                                ['Malam (Kelas Hybrid)', 'Rp 1.400.000', 'Rp 7.560.000']
                            ]}
                            footnote="*Syarat dan Ketentuan : BPP Per Semester dibayar diawal semester."
                        />
                    </div>
                )}
                {activeSubTab === 'persyaratan' && (
                    <div>
                        <p className="mb-3">Penerimaan Mahasiswa Baru Reguler bagi siswa-siswi SMA/SMK/MA kelas XII dan yang telah lulus:</p>
                        <h4 className="font-bold mb-2">Persyaratan</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Mengisi formulir online bagi Calon Mahasiswa ITATS</li>
                            <li>Upload scan dikumen ijazah bagi yang sudah lulus atau scan rapor (untuk sementara) bagi yang belum lulus</li>
                            <li>Upload foto terbaru, scan dokumen Kartu Keluarga (KK) dan Kartu Tanda Penduduk (KTP)</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
}

const PascasarjanaTabContent = ({ setCurrentPage }) => {
    const ActionButton = ({ onClick, children }) => (
        <button onClick={onClick} className="bg-[#0065bc] text-white font-bold py-2 px-6 rounded hover:bg-[#005aab] transition-colors">
            {children}
        </button>
    );

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-2xl font-bold text-[#003366] mb-2">Program Magister Reguler</h3>
                <p className="text-gray-700 mb-3">
                    Tingkatkan karier Anda dengan program Magister Teknik Industri dan Magister Teknik Lingkungan di ITATS, yang dirancang untuk mengasah kemampuan analitis dan manajerial serta mengatasi tantangan lingkungan secara inovatif.
                </p>
                <p className="text-gray-700 mb-4">
                    Dengan dukungan dosen berpengalaman dan fasilitas modern, program ini menyiapkan Anda menjadi pemimpin yang efektif di industri dan pelestarian lingkungan. Jadilah bagian dari solusi untuk masa depan yang lebih berkelanjutan.
                </p>
                <ActionButton onClick={() => setCurrentPage('register')}>Daftar Sekarang</ActionButton>
            </div>
            <div className="pt-6 border-t">
                <h3 className="text-2xl font-bold text-[#003366] mb-2">Program Magister RPL</h3>
                <p className="text-gray-700 mb-3">
                    Program ini dirancang khusus bagi profesional berpengalaman yang ingin melanjutkan studi magister dengan memanfaatkan pengalaman kerja dan pembelajaran sebelumnya.
                </p>
                 <p className="text-gray-700 mb-4">
                    Melalui pendekatan RPL, Anda dapat menghemat waktu studi dan fokus mengembangkan kompetensi analitis, manajerial, serta kemampuan menyelesaikan tantangan industri dan lingkungan secara inovatif. Didukung oleh dosen berpengalaman dan fasilitas pembelajaran modern, program ini akan mempersiapkan Anda menjadi pemimpin perubahan menuju masa depan yang berkelanjutan.
                </p>
                <ActionButton onClick={() => setCurrentPage('register')}>Daftar Sekarang</ActionButton>
            </div>
            <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Biaya</h3>
                <table className="w-full text-left border shadow-sm rounded-lg">
                    <thead className="bg-[#003366] text-white">
                        <tr>
                            <th className="p-3 font-semibold">Keterangan</th>
                            <th className="p-3 font-semibold">Besaran Biaya</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="border-b">
                            <td className="p-3">Biaya Pendaftaran</td>
                            <td className="p-3">Rp 300.000</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-3">Biaya Daftar Ulang</td>
                            <td className="p-3">Rp 1.650.000</td>
                        </tr>
                        <tr>
                            <td className="p-3">Biaya Penyelenggaraan Pendidikan (BPP)</td>
                            <td className="p-3">Rp 1.400.000 per bulan atau Rp 7.560.000 per semester, dibayarkan diawal semester</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className="border-b border-gray-200 py-4">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left text-gray-800 focus:outline-none">
            <span className="font-semibold">{faq.question}</span>
            <span>{isOpen ? <FaMinus /> : <FaPlus />}</span>
        </button>
        {isOpen && (
            <div className="mt-4 text-gray-600">
                <p>{faq.answer}</p>
            </div>
        )}
    </div>
);

const ProdiTable = ({ title, prodiList }) => (
    <div className="mb-12">
        <h3 className="text-2xl font-bold text-center text-[#333] mb-4">{title}</h3>
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-[#003366] text-white uppercase">
                    <tr>
                        <th className="px-6 py-3 w-1/5">Program Studi</th>
                        <th className="px-6 py-3 w-1/4">Keahlian</th>
                        <th className="px-6 py-3 w-1/4">Bidang Kerja</th>
                        <th className="px-6 py-3 w-1/4">Alumni Bekerja</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {prodiList.map((prodi, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 align-top">
                                <a href="#" className="font-bold text-red-600 hover:underline">{prodi.nama}</a>
                                <p className="text-xs text-gray-500 mt-1">{prodi.deskripsi}</p>
                                <p className="text-xs font-semibold text-gray-700 mt-1">{prodi.akreditasi}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600 align-top">{prodi.keahlian}</td>
                            <td className="px-6 py-4 text-gray-600 align-top">{prodi.bidangKerja}</td>
                            <td className="px-6 py-4 text-gray-600 align-top">{prodi.alumni}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


/**
 * Komponen utama untuk halaman depan (landing page).
 */
const HomePage = ({ setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('sarjana');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [isUnderlineVisible, setIsUnderlineVisible] = useState(true);

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % heroImages.length);
        }, 5000); 
        
        const underlineInterval = setInterval(() => {
            setIsUnderlineVisible(prev => !prev);
        }, 1500); // PERBAIKAN: Mengubah durasi menjadi 3000ms (3 detik)

        return () => {
            clearInterval(imageInterval);
            clearInterval(underlineInterval);
        };
    }, []);

    const handleFaqClick = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    const ActionButton = ({ onClick, children }) => (
        <button onClick={onClick} className="bg-[#0065bc] text-white font-bold py-2 px-6 rounded hover:bg-[#005aab] transition-colors">
            {children}
        </button>
    );

    return (
        <main>
            {/* Hero Section */}
            <section 
                className="relative h-96 bg-cover bg-center transition-all duration-1000 ease-in-out" 
                style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </section>
            
            {/* Info Bar */}
            <section className="bg-white text-center py-8 shadow-md">
                <div className="relative inline-block">
                    <h3 className="text-3xl font-bold text-[#003366]">
                        Penerimaan <span className="relative inline-block px-2">Mahasiswa Baru
                            {isUnderlineVisible && (
                                <svg className="absolute -bottom-2 left-0 w-full transition-opacity duration-500" height="12" viewBox="0 0 100 12" preserveAspectRatio="none">
                                    <path d="M0 8 Q 50 0, 100 8" stroke="red" strokeWidth="3" fill="transparent" />
                                </svg>
                            )}
                        </span> Tahun Akademik 2025/2026
                    </h3>
                </div>
            </section>
            
            {/* Tombol Aksi */}
            <section className="text-center py-8 bg-white">
                <button className="bg-yellow-500 text-[#003366] font-bold py-4 px-16 rounded-md hover:bg-yellow-600 transition-colors text-lg">
                    DOWNLOAD BROSUR
                </button>
            </section>
            
            {/* Tabel Daya Tampung */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <div className="bg-[#003366] text-white text-center py-3 mb-6 border-t-4 border-yellow-400">
                        <h2 className="text-3xl font-bold tracking-wider">PEMINAT DAN DAYA TAMPUNG PRODI</h2>
                    </div>
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-white uppercase bg-[#003366]">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No</th>
                                    <th scope="col" className="px-6 py-3">Program Studi</th>
                                    <th scope="col" className="px-6 py-3">Jumlah Peminat</th>
                                    <th scope="col" className="px-6 py-3">Daya Tampung (2024)</th>
                                    <th scope="col" className="px-6 py-3">Sisa Kuota</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prodiData.map(item => (
                                    <tr key={item.no} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{item.no}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4">{item.peminat}</td>
                                        <td className="px-6 py-4">{item.tampung}</td>
                                        <td className="px-6 py-4">{item.sisa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            {/* Bagian Tab Pendaftaran */}
            <section className="py-12 px-4 bg-white">
                <div className="container mx-auto">
                     <div className="bg-[#003366] text-white text-center py-3 mb-6 border-t-4 border-yellow-400">
                        <h2 className="text-3xl font-bold tracking-wider">PENDAFTARAN DAN BIAYA</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/4">
                            <div className="flex flex-col space-y-2">
                                <button onClick={() => setActiveTab('sarjana')} className={`flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${activeTab === 'sarjana' ? 'bg-[#003366] text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    <FaBookOpen /> Program Sarjana
                                </button>
                                <button onClick={() => setActiveTab('pascasarjana')} className={`flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${activeTab === 'pascasarjana' ? 'bg-[#003366] text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    <FaGraduationCap /> Program Pascasarjana
                                </button>
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 p-6">
                            {activeTab === 'sarjana' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#003366] mb-2">Program Sarjana Jalur Reguler</h3>
                                        <p className="text-gray-700 mb-3">Penerimaan Mahasiswa Baru Regular menggunakan nilai rapor tanpa test. Kamu yang merupakan lulusan SMA/SMK/MA bisa mendaftar di ITATS menggunakan jalur reguler.</p>
                                        <p className="font-semibold text-gray-800 mb-4">Tersedia kelas Malam (Hybrid)</p>
                                        <ActionButton onClick={() => setCurrentPage('register')}>Daftar Sekarang</ActionButton>
                                    </div>
                                    <div className="pt-6 border-t">
                                        <h3 className="text-2xl font-bold text-[#003366] mb-2">Program Sarjana Jalur RPL</h3>
                                        <p className="text-gray-700 mb-3">ITATS menerima pendaftaran dari jalur <b>RPL (Rekognisi Pembelajaran Lampau)</b>, yaitu penyetaraan akademik atas pengalaman kerja dan/atau pelatihan bersertifikasi untuk memperoleh kualifikasi pendidikan tinggi.</p>
                                        <p className="text-gray-700 mb-4">Yang bisa masuk jalur Penerimaan RPL:</p>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                                            <li>Lulusan SMA + Pengalaman Kerja 2 Tahun</li>
                                            <li>Lulusan Diploma (Berbagai Jenjang) + Pengalaman Kerja 1 Tahun</li>
                                            <li>Transfer D3 ke S1</li>
                                            <li>Pernah mengikuti pendidikan D3 dan melanjutkan ke S1</li>
                                            <li>Pernah mengikuti pendidikan S1</li>
                                        </ul>
                                        <ActionButton onClick={() => setCurrentPage('register')}>Daftar Sekarang</ActionButton>
                                    </div>
                                    <BiayaPersyaratanSarjana />
                                </div>
                            )}
                            {activeTab === 'pascasarjana' && (
                                 <PascasarjanaTabContent setCurrentPage={setCurrentPage} />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bagian Program Studi */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <div className="bg-[#003366] text-white text-center py-3 mb-6 border-t-4 border-yellow-400">
                        <h2 className="text-3xl font-bold tracking-wider">PROGRAM STUDI</h2>
                    </div>
                    {fakultasData.map((fakultas, index) => (
                        <ProdiTable key={index} title={fakultas.nama} prodiList={fakultas.prodi} />
                    ))}
                </div>
            </section>

            {/* Bagian Beasiswa */}
            <section className="py-12 px-4 bg-white">
                <div className="container mx-auto max-w-4xl bg-gray-50 p-8 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-center text-[#333] mb-2">Biaya Penyelenggaraan Pendidikan (BPP)</h3>
                    <div className="bg-[#003366] text-white text-center py-3 font-bold mb-6">
                        TERSEDIA PROGRAM BEASISWA (Kuota Terbatas)
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                            <img src="/images/ITATS-Indonesia-Emas-2045.png" alt="Logo Beasiswa" className="w-40 h-auto" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-[#333]">Program Beasiswa 100%</h4>
                            <p className="text-xl font-bold text-red-600 my-2">Dana Pengembangan Pendidikan (DPP) : Rp 0,-</p>
                            <p className="font-semibold">Syarat dan Ketentuan :</p>
                            <ul className="list-disc list-inside text-gray-700">
                                <li>Telah Membayar Biaya Pendahuluan dan Daftar Ulang.</li>
                                <li>Program akan ditutup, jika kuota terpenuhi.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bagian FAQ */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center text-[#333] mb-8">Pertanyaan</h2>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-2/3">
                            {faqData.map((faq, index) => (
                                <FaqItem 
                                    key={index}
                                    faq={faq}
                                    isOpen={openFaqIndex === index}
                                    onClick={() => handleFaqClick(index)}
                                />
                            ))}
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="flex flex-col gap-3">
                                {contactData.map((name, index) => (
                                    <a key={index} href="#" className="flex items-center gap-3 p-3 bg-[#003366] text-white rounded-md hover:bg-[#004a8f] transition-colors">
                                        <FaUser />
                                        {name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
