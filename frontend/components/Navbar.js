"use client";
import React from "react";
import {
    Search,
    ShoppingCart,
    CircleUser,
    X,
    LayoutDashboard,
    Upload,
    List,
    MessageCircleMore,
    Heart,
    CreditCard,
    CircleHelp,
    Wrench,
    CircleDollarSign,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import useAuth from "@/hooks/useAuth";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import Env from "@/config/frontendEnv";

export const Navbar = () => {
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    // const [user, setUser] = useState(null);
    // const { isLoggedIn,setIsLoggedIn, loading } = useAuth();
    const { isLoggedIn, setIsLoggedIn, user, setUser, loading } = useAuth();
    // if (loading) return null;
    // console.log("this is user that is ok : ",user)
    const imageUrl = user?.profilePic || "/random/user.png";
    const [isOpen, setIsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const softNames = [
        "SolidWorks",
        "CATIA",
        "Fusion 360",
        "Blender",
        "AutoCAD",
    ];
    const toggleSidebar = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            const menuBtn = document.querySelector(".menu-btn");
            if (menuBtn) {
                if (newState) {
                    menuBtn.classList.add("open");
                } else {
                    menuBtn.classList.remove("open");
                }
            }
            return newState;
        });
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false); // ✅ close on outside click
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        // Hide the element by setting isVisible to false
        setIsVisible(false);
        // Set a timeout to show the element again after 1 second
        setTimeout(() => {
            setIsVisible(true);
        }, 100); // 1000 ms = 1 second
    };
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };
    useEffect(() => {
        // if (checking) return; // Show loading state while checking auth

        const dropHover = document.getElementById("cad-models-id");
        const drop = document.getElementById("dropdown-content-id");

        dropHover.addEventListener("mouseover", () => {
            drop.classList.add("add");
        });
        drop.addEventListener("mouseover", () => {
            drop.classList.add("add");
        });

        dropHover.addEventListener("mouseout", () => {
            drop.classList.remove("add");
        });
        drop.addEventListener("mouseout", () => {
            drop.classList.remove("add");
        });

        const menuBtn = document.querySelector(".menu-btn");
        if (menuBtn) {
            const handleClick = () => {
                setMenuOpen((prev) => {
                    const newState = !prev;
                    if (newState) {
                        menuBtn.classList.add("open");
                    } else {
                        menuBtn.classList.remove("open");
                    }
                    return newState;
                });
            };

            menuBtn.addEventListener("click", handleClick);

            // Cleanup function
            return () => {
                menuBtn.removeEventListener("click", handleClick);
            };
        }
    }, []);
    //       useEffect(() => {
    //           const checkLoginStatus = async () => {
    //         // alert('dsfhjkasfdj')
    //       try {
    //         const res = await axios.get("http://localhost:5000/api/auth/check-auth", {
    //           withCredentials: true,
    //         });
    //             setVisibleSignup(false)
    //             // 🟢 User is already logged in
    //             // alert('oh good ')
    //             console.log("User is succesfull login ");
    //         } catch (err) {
    //             // 🔴 Not logged in — stay on Signup page
    //             setVisibleSignup(true)
    //         console.log("User not logged in");
    //       }
    //     };

    //     checkLoginStatus();
    //   }, []);
    const handleSignupClick = () => {
        const currentPath = window.location.pathname; // fallback
        console.log("currentPath ", currentPath);
        router.push(`/auth/signup?redirect=${encodeURIComponent(currentPath)}`);
    };

    const handleLinkClick = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            const menuBtn = document.querySelector(".menu-btn");
            if (menuBtn) {
                if (newState) {
                    menuBtn.classList.add("open");
                } else {
                    menuBtn.classList.remove("open");
                }
            }
            return newState;
        });
        setIsOpen(false); // Close sidebar
    };
    const handleAccountClick = (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            setShowDropdown((prev) => !prev); // ✅ toggle
            // setShowDropdown(true)
            // router.push("/account");
            // router.push("/auth/login");
            // setShowDropdown((prev) => !prev);
        } else {
            const currentPath = window.location.pathname; // fallback
            console.log("currentPath ", currentPath);
            router.push(
                `/auth/login?redirect=${encodeURIComponent(currentPath)}`
            );
        }
    };

    const handleSignOUT = async (e) => {
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000"; // 👈 your actual IP
            await axios.post(
                `${apiUrl}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            setIsLoggedIn(false);
            setUser(null);
            localStorage.setItem("auth-change", "logout");
            localStorage.removeItem("auth-change");
            router.replace("/");

            // localStorage.removeItem();
            // router.push("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };
    return (
        <>
            <nav className="navbar">
                <div className="menu-btn" onClick={toggleSidebar}>
                    <div
                        className={`menu-btn__burger ${isOpen ? "open" : ""}`}
                    />
                </div>

                <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                    <nav>
                        <ul className="nav-list">
                            <Link
                                href="/"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <LayoutDashboard /> Dashboard
                                </li>
                            </Link>
                            <Link
                                href="/models"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <Search />
                                    Browse Models
                                </li>
                            </Link>

                            <Link
                                href="/become-seller"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <CircleDollarSign />
                                    Become a Seller
                                </li>
                            </Link>
                            <Link
                                href="/sell-models"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <Upload />
                                    Sell a Model
                                </li>
                            </Link>
                            <Link
                                href="/my-listing"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <List />
                                    My Listings
                                </li>
                            </Link>
                            <Link
                                href="/services"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <Wrench />
                                    Services
                                </li>
                            </Link>
                            <Link
                                href="/messages"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <MessageCircleMore />
                                    Messages
                                </li>
                            </Link>
                            <Link
                                href="/wishlist"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <Heart />
                                    Wishlist
                                </li>
                            </Link>
                            <Link
                                href="/account/downloads"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <CreditCard />
                                    Orders & Transactions
                                </li>
                            </Link>
                            <Link
                                href="/support"
                                className="nav-item"
                                onClick={handleLinkClick}
                            >
                                <li className="flex gap-2 ">
                                    <CircleHelp />
                                    Help & Support
                                </li>
                            </Link>
                        </ul>
                    </nav>
                </div>

                <div className="home-links-logo">
                    <Link href="/" className="logo">
                        CAD Store
                    </Link>

                    <div className="nav-links">
                        <Link href="/models">CAD MODELS</Link>
                        <div className="dropdown">
                            <Link id="cad-models-id" href="#">
                                TOOLKITS
                            </Link>
                            {/* {isOpen && ( */}
                            <div
                                id="dropdown-content-id"
                                className={`dropdown-content ${
                                    isVisible ? "" : "hidden"
                                }`}
                                // className="dropdown-content"
                            >
                                {softNames.map((name, index) => (
                                    <Link
                                        key={index}
                                        className="dark:hover:bg-gray-600"
                                        href={`/models?software=${name}`}
                                        passHref
                                        onClick={handleClick}
                                    >
                                        {name}
                                    </Link>
                                ))}
                            </div>
                            {/* //  )}  */}
                        </div>
                        <Link href="/services">SERVICES</Link>
                    </div>
                </div>

                <div className="action-buttons">
                    <Link className="shopping-cart-link" href="./">
                        <ShoppingCart size={28} />
                    </Link>
                    <div className="flex" ref={dropdownRef}>
                        <button
                            onClick={handleAccountClick}
                            className="account-btn-navbar border-2 border-[#00ff59] rounded-full"
                        >
                            <img
                                src={imageUrl}
                                alt="profile-pic"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        </button>
                        {isLoggedIn && showDropdown && (
                            <ul
                                role="menu"
                                data-popover="profile-menu"
                                data-popover-placement="bottom"
                                className="account-drop-class md:top-[60px] top-[51px] right-[10px] absolute z-10 min-w-[200px] overflow-auto rounded-lg border border-slate-200 bg-white py-2 shadow-lg shadosw-sm focus:outline-none"
                            >
                                <Link href={`/account`}>
                                    <li
                                        onClick={() => setShowDropdown(false)} // ✅ close dropdown only
                                        role="menuitem"
                                        className="cursor-pointer text-slate-800  flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#d5e9fc]"
                                    >
                                        <p className="text-slate-800 font-medium ml-2">
                                            Account
                                        </p>
                                    </li>
                                </Link>
                                <Link href={`/account/downloads`}>
                                    <li
                                        role="menuitem"
                                        onClick={() => setShowDropdown(false)} // ✅ close dropdown only
                                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#d5e9fc]"
                                    >
                                        <p className="text-slate-800 font-medium ml-2">
                                            My Downloads
                                        </p>
                                    </li>
                                </Link>
                                <Link href={`/account/edit`}>
                                    <li
                                        onClick={() => setShowDropdown(false)} // ✅ close dropdown only
                                        role="menuitem"
                                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#d5e9fc]"
                                    >
                                        <p className="text-slate-800 font-medium ml-2">
                                            Edit Profile
                                        </p>
                                    </li>
                                </Link>
                                <Link href={`/account/`}>
                                    <li
                                        role="menuitem"
                                        onClick={() => setShowDropdown(false)} // ✅ close dropdown only
                                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#d5e9fc]"
                                    >
                                        <p className="text-slate-800 font-medium ml-2">
                                            Inbox
                                        </p>
                                    </li>
                                </Link>
                                <Link href={`/account/settings`}>
                                    <li
                                        role="menuitem"
                                        onClick={() => setShowDropdown(false)} // ✅ close dropdown only
                                        className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#d5e9fc]"
                                    >
                                        <p className="text-slate-800 font-medium ml-2">
                                            Settings
                                        </p>
                                    </li>
                                </Link>
                                <hr
                                    className="my-2 border-slate-200"
                                    role="menuitem"
                                />
                                {/* <button onClick={handleSignOUT}> */}
                                {user?.isSeller && (
                                    <Link href={`/seller-dashboard`}>
                                        <li
                                            // ✅ close dropdown only
                                            onClick={() =>
                                                setShowDropdown(false)
                                            } // ✅ close dropdown only
                                            role="menuitem"
                                            className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#9dc9f3]"
                                        >
                                            <p className="text-slate-800 font-medium ml-2">
                                                Seller Dashboard
                                            </p>
                                        </li>
                                    </Link>
                                )}
                                <li
                                    onClick={handleSignOUT} // ✅ close dropdown only
                                    role="menuitem"
                                    className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-[#9dc9f3]"
                                >
                                    <p className="text-slate-800 font-medium ml-2">
                                        Sign Out
                                    </p>
                                </li>
                                {/* </button> */}
                            </ul>
                        )}
                    </div>

                    {!isLoggedIn && (
                        <>
                            <div className="vertical-line"></div>

                            <button
                                onClick={handleSignupClick}
                                className="signup-btn-link signup-button"
                            >
                                Sign up
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
};
