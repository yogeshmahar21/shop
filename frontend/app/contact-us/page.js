"use client";
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16 md:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">Get in Touch</h1>
        
        {/* Contact Info Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-lg mb-2"><strong>Email:</strong> support@example.com</p>
            <p className="text-lg mb-2"><strong>Phone:</strong> +1 234 567 890</p>
            <p className="text-lg mb-2"><strong>Address:</strong> 123 Street, City, Country</p>
          </div>

          {/* Contact Form Section */}
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
            {isSubmitted ? (
              <div className="text-green-500 text-lg">Thank you for reaching out! We will get back to you shortly.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
