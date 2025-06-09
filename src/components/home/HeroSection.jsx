import TVModelViewer from '../TVModelViewer';

function HeroSection() {
    return (
        <section className="relative overflow-hidden py-28 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 sm:mt-10">
                {/* LEFT TEXT BLOCK */}
                <div className="md:w-1/2 text-center md:text-left">
                    <div className="transition-all duration-500 ease-in-out bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Expert TV Repair Services
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Your trusted partner for all TV repair needs. From smart TVs to OLEDs and Plasmas — we provide doorstep service across Delhi/NCR with genuine parts & skilled technicians.
                                </p>
                            </div>
                            
                            {/* Features List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Same Day Service</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Quick Response</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Genuine Parts</span>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">Expert Technicians</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
                                <a
                                    href="/complaints"
                                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-center"
                                >
                                    Book a Repair
                                </a>
                                <a
                                    href="/products"
                                    className="px-8 py-4 rounded-xl bg-white text-gray-700 font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-[1.02] transition-all duration-300 text-center shadow-sm hover:shadow-md"
                                >
                                    View Products
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT 3D TV MODEL */}
                <div className="md:w-1/2 w-full max-w-md md:max-w-lg">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                        <TVModelViewer autoRotate={true} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection; 