import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import TrackingPage from './pages/TrackingPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminRegistrationDetailPage from './pages/admin/AdminRegistrationDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Helmet>
          <title>Pendaftaran Online MTs Ulul Albab</title>
          <meta name="description" content="Sistem Pendaftaran Online MTs Ulul Albab - Pendaftaran siswa baru dengan proses yang mudah dan terintegrasi" />
        </Helmet>
        
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/registration/:registrationNumber" element={<RegistrationPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/tracking/:registrationNumber" element={<TrackingPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminDashboardPage />
              </PrivateRoute>
            } />
            <Route path="/admin/registrations" element={
              <PrivateRoute>
                <AdminRegistrationsPage />
              </PrivateRoute>
            } />
            <Route path="/admin/registrations/:id" element={
              <PrivateRoute>
                <AdminRegistrationDetailPage />
              </PrivateRoute>
            } />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 