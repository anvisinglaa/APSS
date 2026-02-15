import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { Dashboard } from './components/Dashboard';
import { Toaster } from 'sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Navbar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      
      {currentPage === 'home' ? (
        <HomePage onNavigateToDashboard={() => setCurrentPage('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
