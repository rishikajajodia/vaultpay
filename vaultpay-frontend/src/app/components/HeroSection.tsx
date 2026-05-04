import React from 'react';
import Link from 'next/link';
interface HeroSectionProps {
  onGetStarted?: () => void;
  onTryDemo?: () => void;
}

export default function HeroSection({ onGetStarted, onTryDemo }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero text */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Smart. Secure. Transparent
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Payments.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Simplify your financial transactions with VaultPay's cutting-edge platform. 
            Experience seamless, secure payments with real-time insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transform transition-all duration-300 ease-out"
            >
              Get Started
            </button>
            <Link href="/DemoPage">
  <button
    className="w-full sm:w-auto px-8 py-4 bg-slate-700/50 backdrop-blur-sm text-white font-semibold rounded-lg border border-slate-600 hover:bg-slate-600/50 hover:border-cyan-500/50 hover:scale-105 transform transition-all duration-300 ease-out"
  >
    Try Demo
  </button>
</Link>

          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none"></div>
          
          {/* Laptop mockup */}
          <div className="relative rounded-t-xl overflow-hidden shadow-2xl">
            {/* Screen */}
            <div className="bg-slate-800 rounded-t-xl p-6 border-4 border-slate-700">
              {/* Dashboard header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Dashboard Preview</h3>
                  <p className="text-slate-400 text-sm">Real-time analytics and insights</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              {/* Chart area */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-6 h-64 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-cyan-400 font-semibold">Revenue</div>
                  <div className="text-emerald-400 text-sm">↑ 24%</div>
                </div>
                
                {/* Simplified chart visualization */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-2 h-32">
                  {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500/50 to-blue-500/50 rounded-t" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                
                <div className="absolute bottom-2 left-6 right-6 flex justify-between text-xs text-slate-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>
            </div>

            {/* Laptop base */}
            <div className="h-6 bg-gradient-to-b from-slate-700 to-slate-600 rounded-b-xl"></div>
            <div className="h-3 bg-slate-600 mx-auto w-3/4 rounded-b-lg"></div>
          </div>

          {/* Side decorative cards */}
          <div className="hidden lg:block absolute -left-8 top-1/4 w-48 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-white text-sm font-semibold">Secure</span>
            </div>
            <p className="text-slate-400 text-xs">Bank-level encryption</p>
          </div>

          <div className="hidden lg:block absolute -right-8 top-1/3 w-48 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-white text-sm font-semibold">Fast</span>
            </div>
            <p className="text-slate-400 text-xs">Instant transactions</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">A simple four-step process to secure your payments.</p>
          </div>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500">
                <span className="text-cyan-400 font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Login</h3>
                <p className="text-slate-400">Securely access your account.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500">
                <span className="text-cyan-400 font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Analyze</h3>
                <p className="text-slate-400">Our AI analyzes transaction risk in real-time.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500">
                <span className="text-cyan-400 font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Pay Securely</h3>
                <p className="text-slate-400">Make payments with confidence.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500">
                <span className="text-cyan-400 font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-xl mb-2">Track Results</h3>
                <p className="text-slate-400">Monitor transaction outcomes and security metrics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust & Security Section */}
        <div className="mt-32 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trust & Security</h2>
            <p className="text-slate-400">Your security is our top priority. We use industry-leading standards to protect your data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Encryption */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3 text-center">Encryption</h3>
              <p className="text-slate-400 text-sm text-center">End-to-end encryption for all transactions.</p>
            </div>

            {/* AI Risk Scoring */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3 text-center">AI Risk Scoring</h3>
              <p className="text-slate-400 text-sm text-center">Advanced fraud detection and risk assessment.</p>
            </div>

            {/* Compliance */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3 text-center">Compliance</h3>
              <p className="text-slate-400 text-sm text-center">Complies with PCI-DSS, SOC 2, and other industry standards.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}