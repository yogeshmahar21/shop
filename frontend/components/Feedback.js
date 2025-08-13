
import React, { useState } from 'react';

const Feedback = () => {
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
    
        if (res.ok) {
          setSubmitted(true);
          setMessage('');
        } else {
          alert('Error submitting feedback');
        }
      };
  return (
<>
<div className="feedback-page-header">

<section className="custom-color-bg-feedback py-12 px-4 md:px-12 rounded-xl shadow-md max-w-2xl mx-7 mt-16 mb-16">
      <h2   data-aos="fade-up"
    data-aos-duration="700" className="text-2xl font-semibold text-center text-gray-800 mb-4">We’d love your feedback ✨</h2>
      <p data-aos="fade-up" className="text-center text-gray-600 mb-6">Tell us what you think about the platform, any suggestions or your experience.</p>
      {submitted ? (
          <p className="text-green-600 text-center font-medium">Thank you for your feedback!</p>
        ) : (
            <form   onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea data-aos="fade-up"
            data-aos-delay="100"
            className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Share your experience here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            />
          <button
            data-aos="fade-up"
      data-aos-delay="140"
            type="submit"
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-all"
            >
            Submit Feedback
          </button>
        </form>
      )}
    </section>



      </div>

    </>
  )
}

export default Feedback
















