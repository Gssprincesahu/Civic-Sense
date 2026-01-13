import React from 'react';
import email from "../assets/email.jpg"
import call from "../assets/call.jpg"
import location from "../assets/location.jpg"

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <div>
            {/* Decorative wave */}
            <div className="w-full overflow-hidden -mt-1" aria-hidden="true">
                <svg viewBox="0 0 1200 120" className="w-full h-12 md:h-20" preserveAspectRatio="none">
                    <path d="M0,0 C150,100 350,100 600,40 C850,-20 1050,20 1200,60 L1200,0 L0,0 Z" fill="url(#g1)"></path>
                    <defs>
                        <linearGradient id="g1" x1="0" x2="1">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="50%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="pt-8 px-6 md:px-20 lg:px-32 bg-gradient-to-r from-indigo-900 via-purple-700 to-pink-600 text-slate-100 w-full overflow-hidden" id="Footer">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="w-full md:w-1/3 mb-0">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 shadow-lg">
                                {/* compact SVG mark: CV monogram */}
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="2" width="20" height="20" rx="4" fill="rgba(255,255,255,0.12)"/>
                                    <path d="M7 16V8h2.5l2.5 4 2.5-4H17v8h-2.5v-4.2L12.5 14 10 11.8V16H7z" fill="white"/>
                                </svg>
                            </span>
                            <div>
                                <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
                                    CodeVision
                                </div>
                                <p className="text-indigo-100 mt-1 text-sm">
                                    Empowering communities through civic engagement
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 mb-0">
                        <h3 className="text-white text-lg font-bold mb-4">Helpline</h3>
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                            <ul className="flex flex-col text-indigo-100 gap-3">
                                <li className="flex items-center gap-3">
                                    <img src={email} alt="Email Logo" className="w-6 h-6 rounded-sm" />
                                    <a href="mailto:Support@codeVision.com" className="text-indigo-50 hover:text-white transition-colors">
                                        Support@codeVision.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <img src={call} alt="Call Logo" className="w-6 h-6 rounded-sm" />
                                    <a href="tel:+15551234567" className="text-indigo-50 hover:text-white transition-colors">
                                        +1 (555) 123-4567
                                    </a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <img src={location} alt="Location Logo" className="w-6 h-6 rounded-sm" />
                                    <a href="#" className="text-indigo-50 hover:text-white transition-colors">
                                        Raman Hostel, MMMUT
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 mb-0">
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="flex flex-col gap-2">
                            <li><a href="/" className="text-indigo-50 hover:text-white transition-colors">Home</a></li>
                            <li><a href="/about" className="text-indigo-50 hover:text-white transition-colors">About</a></li>
                            <li><a href="/services" className="text-indigo-50 hover:text-white transition-colors">Services</a></li>
                            <li><a href="/contact" className="text-indigo-50 hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 py-6 mt-10 text-center text-indigo-100">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="text-sm">© {year} CodeVision. All rights reserved.</span>
                        <nav className="flex items-center gap-4">
                            <a href="/privacy" className="text-pink-200 hover:text-white underline-offset-4 hover:underline transition-colors">Privacy</a>
                            <a href="/terms" className="text-pink-200 hover:text-white underline-offset-4 hover:underline transition-colors">Terms</a>
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Footer