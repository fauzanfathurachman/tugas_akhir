import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  CheckCircle, 
  FileText, 
  Search, 
  Clock, 
  Users, 
  Award,
  BookOpen,
  Globe,
  Shield,
  ArrowRight,
  Play
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Pendaftaran Online',
      description: 'Proses pendaftaran yang mudah dan cepat melalui sistem online yang terintegrasi.'
    },
    {
      icon: Search,
      title: 'Tracking Real-time',
      description: 'Pantau status pendaftaran Anda secara real-time dengan nomor pendaftaran.'
    },
    {
      icon: Clock,
      title: '24/7 Akses',
      description: 'Akses sistem pendaftaran kapan saja dan di mana saja tanpa batasan waktu.'
    },
    {
      icon: Shield,
      title: 'Keamanan Data',
      description: 'Data pribadi Anda terlindungi dengan sistem keamanan yang terjamin.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Siswa Terdaftar' },
    { number: '95%', label: 'Tingkat Kelulusan' },
    { number: '50+', label: 'Guru Berpengalaman' },
    { number: '10+', label: 'Program Unggulan' }
  ];

  const programs = [
    {
      title: 'Program Tahfidz',
      description: 'Program menghafal Al-Quran dengan metode yang efektif dan terstruktur.',
      icon: BookOpen
    },
    {
      title: 'Program Bahasa',
      description: 'Pembelajaran bahasa Arab dan Inggris dengan native speaker.',
      icon: Globe
    },
    {
      title: 'Program Sains',
      description: 'Pengembangan kemampuan sains dan teknologi melalui praktikum.',
      icon: Award
    }
  ];

  return (
    <>
      <Helmet>
        <title>Beranda - Pendaftaran Online MTs Ulul Albab</title>
        <meta name="description" content="Selamat datang di sistem pendaftaran online MTs Ulul Albab. Pendaftaran siswa baru dengan proses yang mudah, cepat, dan terintegrasi." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-primary overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Pendaftaran Online
                <span className="block text-yellow-300">MTs Ulul Albab</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-100">
                Bergabunglah dengan kami dalam mengembangkan potensi akademik dan karakter Islami 
                melalui pendidikan berkualitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/registration"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/tracking"
                  className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
                >
                  Lacak Status
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Tahun Ajaran 2024/2025</h3>
                  <p className="text-lg mb-6">Pendaftaran Siswa Baru</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-300">150</div>
                      <div className="text-sm">Kuota Tersedia</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-300">75</div>
                      <div className="text-sm">Sudah Terdaftar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Sistem Pendaftaran Online Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan pengalaman pendaftaran yang modern, efisien, dan user-friendly 
              untuk memudahkan proses pendaftaran siswa baru.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Program Unggulan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menawarkan berbagai program unggulan yang dirancang untuk mengembangkan 
              potensi siswa secara holistik.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="card-body text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {program.title}
                    </h3>
                    <p className="text-gray-600">
                      {program.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Siap Bergabung dengan MTs Ulul Albab?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Jangan lewatkan kesempatan untuk menjadi bagian dari keluarga besar MTs Ulul Albab. 
            Daftar sekarang dan mulai perjalanan pendidikan yang berkualitas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registration"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Mulai Pendaftaran
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/tracking"
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg font-semibold"
            >
              Cek Status Pendaftaran
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Persyaratan Pendaftaran
            </h2>
            <p className="text-xl text-gray-600">
              Pastikan Anda telah menyiapkan dokumen-dokumen berikut sebelum mendaftar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Dokumen Wajib</h3>
              </div>
              <div className="card-body">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Akta Kelahiran (fotokopi)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Kartu Keluarga (fotokopi)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Ijazah/SKL SD/MI (fotokopi)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Foto 3x4 (2 lembar)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Dokumen Tambahan</h3>
              </div>
              <div className="card-body">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Surat Keterangan Sehat</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Sertifikat Prestasi (jika ada)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Surat Rekomendasi (opsional)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Kartu BPJS (jika ada)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 