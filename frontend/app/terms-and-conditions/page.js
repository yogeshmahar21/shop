"use client";

import Link from "next/link";

export default function TermsAndConditionsPage() {
    return (
        <div className="text-justify min-h-screen custom-bg-blue  flex justify-center items-center">
            <div className="terms-conditons-page-second w-full  px-14 pb-10">
                <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
                    Terms and Conditions
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Welcome to our website. These Terms and Conditions (&quot;Terms&quot;) govern your use of this website, 
                    including any services or products provided. By accessing or using our website, you agree to 
                    comply with and be bound by these Terms. If you do not agree to these Terms, please do not 
                    use our services.
                </p>
                
                <section className="mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        We reserve the right to update, change, or modify these Terms at any time without prior notice. 
                        You should review these Terms periodically to stay informed of any changes. Continued use of the 
                        website after any updates constitute acceptance of those changes.
                    </p>
                </section>
                
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Use of Website
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        By using our website, you agree to comply with all applicable laws, rules, and regulations. 
                        You agree not to engage in any activity that may harm the website, its functionality, or other 
                        users. This includes, but is not limited to, actions that interfere with the website&apos;s performance, 
                        damage the content, or violate any intellectual property rights.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        You are solely responsible for your actions on the website, including any content you upload or 
                        share. You must ensure that any content shared or submitted is in accordance with applicable laws 
                        and does not infringe upon any third-party rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Account Creation and Security
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        In order to access certain features of the website, you may be required to create an account. 
                        You agree to provide accurate, complete, and up-to-date information during the account creation 
                        process. You are responsible for maintaining the confidentiality of your account credentials and 
                        for all activities that occur under your account.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        If you believe that your account has been compromised, you must notify us immediately and take 
                        steps to secure your account.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Privacy Policy
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Your privacy is very important to us. Please refer to our <Link
                            href="/privacy-policy"
                            className="text-indigo-500 hover:underline"
                        >
                            Privacy Policy
                        </Link> for information on how we collect, use, and protect your personal data.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        By using our website, you consent to the collection and use of your information as described 
                        in the Privacy Policy.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Intellectual Property
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        All content available on the website, including but not limited to text, graphics, logos, 
                        images, and software, is the property of the website or its licensors and is protected by 
                        intellectual property laws.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        You may not reproduce, distribute, or modify any content from the website without the express 
                        written permission of the website owner, except as permitted by applicable law.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Limitations of Liability
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        We make no warranties or representations regarding the accuracy, reliability, or completeness 
                        of the website&apos;s content. We are not liable for any errors or omissions in the content or for 
                        any damages resulting from the use or inability to use the website.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        In no event shall we be liable for any direct, indirect, incidental, or consequential damages 
                        arising from the use of the website, even if we have been advised of the possibility of such 
                        damages.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Modifications to the Terms
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        We reserve the right to modify or update these Terms at any time without prior notice. Any 
                        changes will be reflected on this page, and it is your responsibility to review these Terms 
                        periodically.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Continued use of the website after changes have been posted constitutes your acceptance of 
                        the updated Terms.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Governing Law
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                        where the website operator is located, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-indigo-600 mb-2">
                        Contact Us
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        If you have any questions regarding these Terms and Conditions, please contact us at &nbsp;
                        <Link href="mailto:info@example.com" className="text-indigo-500 hover:underline">
                            info@example.com
                        </Link>.
                    </p>
                </section>

                <div className="text-center mt-8">
                    <p className="text-lg text-gray-600">
                        By using our website, you acknowledge that you have read, understood, and agree to these Terms 
                        and Conditions.
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
