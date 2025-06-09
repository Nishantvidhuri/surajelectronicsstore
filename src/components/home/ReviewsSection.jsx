function ReviewsSection() {
    const reviews = [
        {
            name: "Rahul Kumar",
            location: "Shalimar",
            initials: "RK",
            review: "Called for a repair and they came on time. The technician fixed the display issue without overcharging. Decent experience overall.",
        },
        {
            name: "Pooja Sharma",
            location: "Rajender Nagar",
            initials: "PS",
            review: "Bought a new remote and some wires from the shop. Prices were reasonable, and the person at the counter was helpful.",
        },
        {
            name: "Deepak Verma",
            location: "Ganeshpuri",
            initials: "DV",
            review: "My TV wasn't turning on. They picked it up, repaired it, and returned it the next day. Smooth process, no issues so far.",
        },
        {
            name: "Nisha Yadav",
            location: "Janakpuri",
            initials: "NY",
            review: "Got a wall mount installation done. The technician was polite and did the job neatly. Booking could be a bit faster though.",
        },
        {
            name: "Mohit Jain",
            location: "Pannu Chowk",
            initials: "MJ",
            review: "Replaced a broken panel on my LED TV. It works fine now. Not the cheapest, but they used original parts and gave a receipt.",
        },
        {
            name: "Sakshi Mehra",
            location: "Shalimar",
            initials: "SM",
            review: "Used their doorstep service for a power issue. Took a bit longer than expected but it was fixed properly. Satisfied.",
        },
    ];

    return (
        <section className="relative w-full py-20 px-6 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container relative z-10 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Honest feedback from people we've served across Delhi NCR.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
                        >
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-6 h-6 mr-1 transform group-hover:scale-110 transition-transform duration-200"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4 group-hover:text-gray-900 transition-colors duration-200">"{review.review}"</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                    {review.initials}
                                </div>
                                <div className="ml-3">
                                    <h4 className="text-gray-900 font-semibold group-hover:text-blue-600 transition-colors duration-200">{review.name}</h4>
                                    <p className="text-gray-500 text-sm">{review.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ReviewsSection; 