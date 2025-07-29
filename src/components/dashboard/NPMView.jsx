import React from 'react';

const NPMView = () => {
    // Mengambil data pengguna dari localStorage untuk menampilkan NPM
    const userData = JSON.parse(localStorage.getItem('userData'));

    return (
        <div className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800">
                Selamat telah menjadi bagian dari Kampus
            </h1>
            <h2 className="text-4xl font-bold text-indigo-600 mt-2 mb-8">
                ITATS
            </h2>
            
            <p className="text-gray-600">Berikut Nomor Pokok Mahasiswa Anda</p>
            <p className="text-5xl font-mono font-bold text-gray-900 my-4 tracking-wider">
                {userData?.npm_status || 'Belum Tersedia'}
            </p>

            <p className="text-gray-600 mt-8 max-w-md">
                Ajak teman/saudara/orang lain untuk bergabung menjadi mahasiswa baru ITATS.
                Anda akan mendapat <span className="font-bold text-red-500">REWARD</span> senilai 
                <span className="font-bold"> Rp 400.000/mahasiswa baru.</span>
            </p>
            
            <p className="text-gray-600 mt-4">
                Tata cara mendapatkan reward silakan klik link berikut.
            </p>

            <button className="mt-6 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors">
                Klik Link
            </button>
        </div>
    );
};

export default NPMView;