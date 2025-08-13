"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
    return (
        <div className="text-justify min-h-screen custom-bg-blue flex justify-center items-center">
            <div className="refund-policy-page-second w-full px-14 pb-10">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Refund Policy
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Thank you for purchasing from our platform. We want to ensure that you are satisfied with your 
                    purchase. This Refund Policy outlines the conditions under which we provide refunds and the process for 
                    requesting a refund.
                </p>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Eligibility for Refunds
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Refunds will only be provided for purchases that meet the following criteria:
                    </p>
                    <ul className="list-disc pl-6 text-lg text-gray-700 mb-4">
                        <li>The purchased item is defective or broken.</li>
                        <li>The product does not match its description or is significantly different from the 
                            displayed image.</li>
                        <li>The product has not been downloaded or used in any way.</li>
                    </ul>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Please note that refunds are not available for digital products that have been downloaded or 
                        used in any way. We reserve the right to deny any refund request that does not meet these conditions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        How to Request a Refund
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        To request a refund, please contact us within 14 days of your purchase. You can do this by 
                        sending us an email at &nbsp;
                        <Link href="mailto:info@example.com" className="text-indigo-500 hover:underline">
                            info@example.com
                        </Link>.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        In your email, please include the following information:
                    </p>
                    <ul className="list-disc pl-6 text-lg text-gray-700 mb-4">
                        <li>Your order number.</li>
                        <li>The reason for your refund request.</li>
                        <li>Any relevant images or details that will help us process your request.</li>
                    </ul>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Once we receive your refund request, we will review it and process the refund if it meets the 
                        criteria outlined in this policy. Refunds will be issued to the original payment method used.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Refund Processing Time
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Refund requests are typically processed within 5-7 business days. Please allow additional time for 
                        your financial institution to process the refund.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Non-Refundable Items
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        The following items are non-refundable:
                    </p>
                    <ul className="list-disc pl-6 text-lg text-gray-700 mb-4">
                        <li>Digital downloads that have been accessed or downloaded.</li>
                        <li>Products that have been used or altered.</li>
                    </ul>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Please review your purchase carefully before submitting a refund request.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Modifications to This Refund Policy
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        We reserve the right to update or change this Refund Policy at any time. Any updates will be 
                        reflected on this page, and the revised date will be updated at the bottom of the page. Please 
                        review this page periodically for any changes.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Governing Law
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        This Refund Policy shall be governed by and construed in accordance with the laws of the jurisdiction 
                        where the website operator is located, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Contact Us
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        If you have any questions regarding this Refund Policy or need assistance with a refund request, 
                        please contact us at &nbsp;
                        <Link href="mailto:info@example.com" className="text-indigo-500 hover:underline">
                            info@example.com
                        </Link>.
                    </p>
                </section>

                <div className="text-center mt-8">
                    <p className="text-lg text-gray-600">
                        By using our website, you acknowledge that you have read, understood, and agree to this Refund Policy.
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-block text-indigo-500 hover:underline font-semibold"
                    >
                        Go back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
