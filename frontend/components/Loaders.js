// // components/Loader.jsx
// const Loader = () => {
//     return (
//         // <div className="w-full h-[60vh] flex items-center justify-center">
//         //     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//         // </div>
//         <div className=" top-0 flex w-full justify-center align-middle z-1 bg-[#4646466d] h-full">
//             <div className="flex items-center">
//                 <div className="loader"></div>
//             </div>
//         </div>
//     );
// };

// export default Loader;


import "@/styles/loader.scss";
import React from "react";

const Loaders = () => {
    return (
        <div className="this-root justify-items-center bg-[#000000a2] z-10">
            <div className="pl test text-[#fff] sm:text-lg md:text-xl text-sm">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="pl__dot"></div>
                ))}
                <div className="pl__text text-[13px]">Loading…</div>
            </div>
        </div>
    );
};

export default Loaders;

