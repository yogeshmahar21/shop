// "use client";

import Link from "next/link";

export default function FeedbackPage() {
    return (
        <div className="feedback-page-container min-h-screen custom-bg-blue flex justify-center pt-25 pb-15 items-center">
            <div className="feedback-page-container-second w-full sm:w-11/12 md:w-8/12 lg:w-7/12 xl:w-6/12 px-8 pt-15 pb-7 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    We Value Your Feedback
                </h1>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    Your opinion matters to us! Please share your thoughts, suggestions, or concerns to help us improve our platform.
                </p>

                <form
                    action="/submit-feedback"
                    method="POST"
                    className="space-y-6"
                >
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-lg font-medium text-gray-700 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="bg-white p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-lg font-medium text-gray-700 mb-2">
                            Your Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="bg-white p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="feedback" className="text-lg font-medium text-gray-700 mb-2">
                            Your Feedback
                        </label>
                        <textarea
                            id="feedback"
                            name="feedback"
                            rows="5"
                            required
                            className="bg-white p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            placeholder="Tell us what you think..."
                        ></textarea>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700 focus:outline-none"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-lg text-gray-600">
                        We appreciate your time and effort in helping us improve our service!
                    </p>
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="text-indigo-500 hover:underline font-semibold">
                        Go back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
