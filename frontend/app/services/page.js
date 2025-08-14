"use client";
import { PencilRuler, Plug } from "lucide-react";
import Link from "next/link";
import { FaCog } from 'react-icons/fa';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 pb-16 pt-30 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-indigo-800 mb-10">
                    Our Services
                </h1>
                <section className="text-center mb-16">
                    <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        At [Your Company Name], we provide specialized 3D modeling services tailored to meet the needs of professionals across various industries.
                        From ready-to-use models to custom designs, we ensure that your project is executed with precision and creativity.
                    </p>
                </section>

                {/* Service Cards Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Service 1 */}
                    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center sm:hover:transform sm:hover:scale-105 sm:hover:shadow-2xl transition-all ease-in-out duration-300">
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mb-6">
                            {/* <i className="fas fa-cogs text-white text-3xl"></i> Example Icon */}
                            <FaCog className="text-white text-3xl" />
                        </div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">3D Model Marketplace</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            Access a wide range of premium, high-quality 3D models suitable for engineers, designers, and manufacturers.
                        </p>
                        <ul className="text-gray-600 mb-4 list-disc pl-5">
                            <li>Extensive catalog of models</li>
                            <li>High-resolution files for easy integration</li>
                            <li>Fast download and seamless usability</li>
                        </ul>
                        <Link
                            href="/models"
                            className="text-indigo-500 font-semibold hover:underline"
                        >
                            Explore Marketplace
                        </Link>
                    </div>

                    {/* Service 2 */}
                    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center sm:hover:transform sm:hover:scale-105 sm:hover:shadow-2xl transition-all ease-in-out duration-300">
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mb-6">
                            {/* <i className="fas fa-pencil-ruler text-white text-3xl"></i> Example Icon */}
                            <PencilRuler className="text-white text-3xl" />
                        </div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Custom 3D Modeling</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            We provide tailored 3D models designed according to your specifications. Perfect for prototypes, final designs, or unique concepts.
                        </p>
                        <ul className="text-gray-600 mb-4 list-disc pl-5">
                            <li>Fully customized to your needs</li>
                            <li>Multiple revisions to ensure satisfaction</li>
                            <li>Fast, reliable service</li>
                        </ul>
                        <Link
                            href="/contact"
                            className="text-indigo-500 font-semibold hover:underline"
                        >
                            Request Custom Model
                        </Link>
                    </div>

                    {/* Service 3 */}
                    <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center sm:hover:transform sm:hover:scale-105 sm:hover:shadow-2xl transition-all ease-in-out duration-300">
                        <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mb-6">
                            <Plug className="text-white text-3xl" />
                            {/* <i className="fas fa-plug text-white text-3xl"></i> Example Icon */}
                        </div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">CAD Integration</h2>
                        <p className="text-lg text-gray-700 mb-4">
                            Our models are optimized for all major CAD software, ensuring flawless integration and high functionality.
                        </p>
                        <ul className="text-gray-600 mb-4 list-disc pl-5">
                            <li>Supports multiple file formats</li>
                            <li>Perfect for SolidWorks, AutoCAD, CATIA</li>
                            <li>Customizable for unique design requirements</li>
                        </ul>
                        <Link
                            href="/services"
                            className="text-indigo-500 font-semibold hover:underline"
                        >
                            Learn More
                        </Link>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="custom-bg-services text-white py-16 px-6 rounded-xl mt-16 text-center">
                    <h2 className="text-3xl font-semibold mb-6">Let&apos;s Bring Your Vision to Life</h2>
                    <p className="text-lg mb-6">
                        Whether you are working on a small project or a large-scale endeavor, our team is here to help you turn ideas into reality.
                    </p>
                    <Link
                        href="/support"
                        className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-md shadow-md hover:shadow-lg transition-all ease-in-out"
                    >
                        Get in Touch
                    </Link>
                </section>
            </div>
        </div>
    );
}
