import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VaultPay - Secure Digital Payment Solutions',
  description: 'Secure, transparent, and fast digital payments for your business with AI-powered fraud detection.',
  keywords: 'digital payments, secure transactions, fraud detection, fintech, VaultPay',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Landing Content */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="max-w-7xl mx-auto text-center px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Welcome to VaultPay
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8">
              Secure, transparent, and fast digital payments for your business.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}