"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Click on the signup button on the top right and fill in your details to get started.",
  },
  {
    question: "How can I reset my password?",
    answer: "Go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email.",
  },
  {
    question: "Is there a way to contact support?",
    answer: "Yes, scroll to the bottom of this page and click 'Contact Us'. You’ll find our email and support form.",
  },
  {
    question: "Can I sell my own 3D models?",
    answer: "Yes, you can. Make sure to register as a seller and upload your models from the seller dashboard.",
  },
  {
    question: "What file formats do you support?",
    answer: "We currently support STL, STEP, IGES, and native formats from SolidWorks and CATIA.",
  },
  {
    question: "Are there any fees for sellers?",
    answer: "We charge a small transaction fee of 10% on every sale made through the platform.",
  },
  {
    question: "How do I report an issue with a model?",
    answer: "Click on the model page and hit the 'Report' button. Provide the issue details for a quick resolution.",
  },
  {
    question: "Can I download models for free?",
    answer: "Yes! We have a free models section you can explore from the homepage or the 'Explore Free' tab.",
  },
  {
    question: "How secure is my payment?",
    answer: "We use industry-standard payment gateways like Stripe and Razorpay to ensure full transaction security.",
  },
  {
    question: "Is my personal data safe?",
    answer: "Absolutely. We comply with data protection regulations and do not share your data with third parties.",
  },
  {
    question: "Can I request custom models?",
    answer: "Yes. You can contact sellers directly through their profile and request custom work or modifications.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Refunds are available on a case-by-case basis, especially for corrupt or non-working files. Contact support for help.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission logic here (send data to backend)
    console.log("Form Submitted:", { email, message });
    setFormSuccess(true);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen custom-bg-blue  py-25 px-4 sm:px-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Support & FAQ</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="flex justify-between w-full items-center text-left"
            >
              <span className="text-lg font-medium text-gray-800">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-indigo-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-indigo-500" />
              )}
            </button>
            {openIndex === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
<div className="w-full flex justify-center items-center">

      <div className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-sm mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Need More Help?</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600">Your Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
 
            <div>
              <label htmlFor="message" className="block text-sm text-gray-600">Your Message</label>
              <textarea
                id="message"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 focus:outline-none"
              >
              Send Message
            </button>
          </div>
        </form>

        {formSuccess && (
          <p className="mt-4 text-green-600">Thank you! Your message has been sent.</p>
        )}
        </div>
      </div>
    </div>
  );
}
