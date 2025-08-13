"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import e from "express";
export const Footer = () => {
    const router = useRouter();
    const user = {
        isSeller : true, // Example user object, replace with actual user state
    };
    const handleSellModel = () => {
        if (user.isSeller === true) {
            router.push("/seller-dashboard/add-new-model");
        }else {
            alert("You need to be a seller to sell models. Please become a seller first.");
            router.push("/become-seller");
        }
    };
    const handleBecomePartner = () => {
        if (user.isSeller === true) {
            alert("You are already a seller. You can manage your models in the seller dashboard.");
            router.push("/seller-dashboard");
        }else {
            router.push("/become-seller");
        }
    };
    return (
        <footer  className="bg-[#fff3f3] footer border-t border-[#e3e3e3]">
            <div className="footer-container bg-[#fff3f3]"> 
                {/* Logo & Description */}

                {/* Quick Links */}
                <div className="footer-section bg-[#fff3f3]">
                    <h3>Buy & Sell Models</h3>
                    <ul>
                        <li>
                            <Link href={`/models?price=Free`} passHref>Free Models</Link>
                        </li>
                        <li>
                            <Link href="/models">Explore Models</Link>
                        </li>
                        <li> 
                            <button className="cursor-pointer"  onClick={handleSellModel}>Sell a Model</button>
                        </li>
                        <li>
                            <Link href="/seller">Our Partners</Link>
                        </li>
                        <li>
                            <button className="cursor-pointer" onClick={handleBecomePartner}>Become a Partner</button>
                        </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h3>Contacts & Support</h3>
                    <ul>
                        <li>
                            <Link href="/support">Support</Link>
                        </li>
                        <li>
                            <Link href="/privacy-policy">Privacy policy</Link>
                        </li>
                        <li>
                            <Link href="/terms&conditions">Terms & Conditions</Link>
                        </li>
                        <li>
                            <Link href="/refunds-policy">Refunds Policy</Link>
                        </li>
                        <li>
                            <Link href="/feedback">Feedback</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h2>3D Store</h2>
                    <p>Your one-stop shop for premium 3D models.</p>
                </div>
            </div>
            <div className="footer-social">
                <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        width="30"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path
                            d="M13 17v-4h2l0.5-2H13V9.5c0-0.6 0.2-0.9 1-0.9h1.5V6.2c-0.3 0-1.4-0.2-2.5-0.2-1.8 0-3 1-3 3V11H8v2h2v4h3z"
                            fill="white"
                        />
                    </svg>
                </Link>
                <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775a4.92 4.92 0 0 0 2.163-2.723 9.77 9.77 0 0 1-3.1 1.184 4.89 4.89 0 0 0-8.325 4.455 13.865 13.865 0 0 1-10.062-5.1 4.824 4.824 0 0 0-.659 2.459c0 1.698.869 3.198 2.188 4.078a4.904 4.904 0 0 1-2.212-.616v.061a4.894 4.894 0 0 0 3.918 4.808c-.366.099-.75.15-1.144.15-.281 0-.555-.027-.822-.078.555 1.734 2.169 2.995 4.076 3.031a9.85 9.85 0 0 1-6.102 2.104c-.398 0-.79-.023-1.174-.069a13.901 13.901 0 0 0 7.548 2.212c9.051 0 13.999-7.5 13.999-13.998 0-.213 0-.426-.015-.637A10.04 10.04 0 0 0 24 4.59a9.875 9.875 0 0 1-2.865.786 4.92 4.92 0 0 0 2.158-2.717z" />
                    </svg>
                </Link>
                <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.849.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849s-.012 3.584-.07 4.849c-.148 3.225-1.664 4.771-4.919 4.919-1.265.058-1.645.069-4.849.069s-3.584-.012-4.849-.07c-3.254-.148-4.771-1.691-4.919-4.919C2.012 15.584 2 15.204 2 12s.012-3.584.07-4.849c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.332.012 7.053.07 2.77.26.26 2.77.07 7.053.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.947.19 4.283 2.7 6.793 6.983 6.983C8.332 23.988 8.741 24 12 24c3.259 0 3.668-.012 4.947-.07 4.283-.19 6.793-2.7 6.983-6.983C23.988 15.668 24 15.259 24 12c0-3.259-.012-3.668-.07-4.947-.19-4.283-2.7-6.793-6.983-6.983C15.668.012 15.259 0 12 0zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                    </svg>
                </Link>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>
                    &copy; {new Date().getFullYear()} 3D Models. All rights
                    reserved.
                </p>
            </div>
        </footer>
    );
};
