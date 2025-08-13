"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setShow(scrollY > 300); // show after scrolling down 300px
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-opacity duration-400 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        className="bg-[#343434] text-white p-3 rounded-full shadow-lg flex items-center justify-center border border-[#0000001e]"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
    </div>
  );
}
