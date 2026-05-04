"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          {/* Left side links */}
          <div className="flex items-center space-x-6">
            <a
              href="#about"
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs"
            >
              Contact
            </a>
            <a
              href="#terms"
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs"
            >
              Terms
            </a>
            <a
              href="#privacy"
              className="text-slate-400 hover:text-slate-300 transition-colors text-xs"
            >
              Privacy Policy
            </a>
          </div>

          {/* Right side copyright */}
          <div className="text-slate-400 text-xs">
            © 2024 VaultPay. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
