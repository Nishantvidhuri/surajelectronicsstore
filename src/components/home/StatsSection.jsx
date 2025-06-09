import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function StatsSection() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true
    });

    return (
        <section ref={ref} className="relative z-10 py-24 bg-gradient-to-b from-white to-gray-50">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Trusted by Thousands
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Our unwavering dedication is reflected in the numbers below.
                    </p>
                </div>

                {/* Split Cards in Two Groups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* Group 1: 3 Stats */}
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <div className="grid sm:grid-cols-3 gap-6 text-center">
                            {/* Remotes */}
                            <div>
                                <h3 className="text-5xl font-extrabold text-blue-600 mb-2">
                                    {inView ? <CountUp end={200} duration={2.5} /> : "0"}
                                    <span className="text-2xl ml-1">+</span>
                                </h3>
                                <p className="text-gray-700 text-base font-semibold">Types of Remotes</p>
                            </div>
                            {/* Customers */}
                            <div>
                                <h3 className="text-5xl font-extrabold text-indigo-600 mb-2">
                                    {inView ? <CountUp end={5000} duration={2.5} separator="," /> : "0"}
                                    <span className="text-2xl ml-1">+</span>
                                </h3>
                                <p className="text-gray-700 text-base font-semibold">Satisfied Customers</p>
                            </div>
                            {/* TVs */}
                            <div>
                                <h3 className="text-5xl font-extrabold text-blue-600 mb-2">
                                    {inView ? <CountUp end={10000} duration={2.5} separator="," /> : "0"}
                                    <span className="text-2xl ml-1">+</span>
                                </h3>
                                <p className="text-gray-700 text-base font-semibold">TVs Repaired</p>
                            </div>
                        </div>
                    </div>

                    {/* Group 2: 2 Stats */}
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-100 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                        <div className="grid sm:grid-cols-2 gap-6 text-center">
                            {/* TV Stands */}
                            <div>
                                <h3 className="text-5xl font-extrabold text-indigo-600 mb-2">
                                    {inView ? <CountUp end={120} duration={2.5} /> : "0"}
                                    <span className="text-2xl ml-1">+</span>
                                </h3>
                                <p className="text-gray-700 text-base font-semibold">TV Stand Models</p>
                            </div>
                            {/* Wires */}
                            <div>
                                <h3 className="text-5xl font-extrabold text-blue-600 mb-2">
                                    {inView ? <CountUp end={80} duration={2.5} /> : "0"}
                                    <span className="text-2xl ml-1">+</span>
                                </h3>
                                <p className="text-gray-700 text-base font-semibold">Wires & Adaptors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default StatsSection; 