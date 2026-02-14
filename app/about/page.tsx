import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export default function AboutPage() {
    return (
        <main className="max-w-5xl mx-auto px-6 py-16">

            {/* HERO / ABOUT */}
            <section className="py-24 bg-gradient-to-b from-amber-50 to-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    About Handcrafted Haven
                    </h1>
                    <p className="text-gray-600 text-lg">
                    Handcrafted Haven is a digital marketplace dedicated to connecting
                    passionate artisans with customers who value creativity, authenticity,
                    and craftsmanship. Our platform celebrates handmade products by giving
                    creators a space to showcase and sell their work with ease.
                    </p>
                </div>
            </section>

            {/* MISSION */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    
                    <div>
                    <h2 className="text-3xl font-semibold mb-6">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Our mission is to empower independent creators by providing
                        a modern, reliable, and scalable marketplace built specifically
                        for handmade and unique goods.
                    </p>
                    <p className="text-gray-600">
                        We aim to make discovering and supporting small artisans simple,
                        secure, and enjoyable for customers everywhere.
                    </p>
                    </div>

                    <div className="bg-amber-100 rounded-xl p-8 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">What We Focus On</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>• Supporting independent artisans</li>
                        <li>• Showcasing authentic handmade products</li>
                        <li>• Creating a seamless buying experience</li>
                        <li>• Building a scalable full-stack platform</li>
                    </ul>
                    </div>

                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold mb-6">
                    Get in Touch
                    </h2>

                    <p className="text-gray-600 mb-10">
                    Whether you're an artisan interested in joining our marketplace
                    or a customer with questions, we’d love to hear from you.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 text-left">
                    
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-2">Email</h3>
                            <p className="text-gray-600 text-sm">
                            support@handcraftedhaven.com
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-2">Headquarters</h3>
                            <p className="text-gray-600 text-sm">
                            Rexburg, Idaho<br />
                            United States
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-semibold mb-4">Follow Us</h3>

                            <div className="flex items-center justify-start gap-6 text-gray-600">
                                
                                <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-600 transition transform hover:scale-110"
                                >
                                <FaInstagram size={20} />
                                </a>

                                <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-600 transition transform hover:scale-110"
                                >
                                <FaFacebookF size={20} />
                                </a>

                                <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-amber-600 transition transform hover:scale-110"
                                >
                                <FaXTwitter size={20} />
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <h2 className="text-2xl font-semibold text-center mb-12">
                    Meet the Founders
                </h2>

                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    
                    {/* Samuel */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 p-6 text-center">
                    <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4">
                        <img
                        src="/about/samuel.png"
                        alt="Samuel Bambico Dela Cruz"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <h3 className="font-semibold text-lg">Samuel Bambico Dela Cruz</h3>
                    <p className="text-sm text-gray-500">Web Developer</p>
                    </div>

                    {/* Eric */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 p-6 text-center">
                    <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4">
                        <img
                        src="/about/eric.jpeg"
                        alt="Eric Earl Arndt"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <h3 className="font-semibold text-lg">Eric Earl Arndt</h3>
                    <p className="text-sm text-gray-500">Web Developer</p>
                    </div>

                    {/* Nicolas */}
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 p-6 text-center">
                    <div className="overflow-hidden rounded-full w-32 h-32 mx-auto mb-4">
                        <img
                        src="/about/nicolas.jpeg"
                        alt="Nicolas Eiji Morise Silva"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                    </div>
                    <h3 className="font-semibold text-lg">Nicolas Eiji Morise Silva</h3>
                    <p className="text-sm text-gray-500">Web Developer</p>
                    </div>

                </div>
            </section>

            <section className="py-16">
                <h2 className="text-2xl font-semibold text-center mb-6">
                Our Headquarters
                </h2>

                <p className="text-center text-gray-600 mb-6">
                Brigham Young University–Idaho<br />
                Rexburg, Idaho, USA
                </p>

                <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
                <iframe
                    src="https://www.google.com/maps?q=Brigham+Young+University-Idaho&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                </div>
            </section>

        </main>
    );
}
