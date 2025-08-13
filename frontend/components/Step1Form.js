"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OTPVerification from "@/components/OTPVerification"; 


const countries = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AS", name: "American Samoa" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AI", name: "Anguilla" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AW", name: "Aruba" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "IO", name: "British Indian Ocean Territory" },
    { code: "BN", name: "Brunei Darussalam" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CV", name: "Cape Verde" },
    { code: "KY", name: "Cayman Islands" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CX", name: "Christmas Island" },
    { code: "CC", name: "Cocos (Keeling) Islands" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo (Congo-Brazzaville)" },
    { code: "CD", name: "Congo (Democratic Republic of the)" },
    { code: "CK", name: "Cook Islands" },
    { code: "CR", name: "Costa Rica" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "ET", name: "Ethiopia" },
    { code: "FK", name: "Falkland Islands" },
    { code: "FO", name: "Faroe Islands" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GF", name: "French Guiana" },
    { code: "PF", name: "French Polynesia" },
    { code: "TF", name: "French Southern Territories" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GR", name: "Greece" },
    { code: "GL", name: "Greenland" },
    { code: "GD", name: "Grenada" },
    { code: "GP", name: "Guadeloupe" },
    { code: "GU", name: "Guam" },
    { code: "GT", name: "Guatemala" },
    { code: "GG", name: "Guernsey" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
  
  
      
  ];

export default function Step1Form({ nextStep }) {
    const router = useRouter();
      const [selectedCountry, setSelectedCountry] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        email: "",
        mobile: "",
        specializedIn: "",
    });

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

   const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to OTP verification page
        router.push("/become-seller/otp-verification"); // Go to the next step
    };

     return (
        <div className="max-w-500 mx-auto mb-12">
            <form
                onSubmit={handleSubmit}
                >
                <div
                className=" space-y-5 grid sm:grid-cols-2"
                >

                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Name</p>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleTextChange}
                        placeholder="Full Name"
                        className="w-full max-w-150 step1input p-2 bg-[#fafbff] afocus:bg-[#f5f9ff]  focus:outline-none ring-[.5px] rounded"
                        required
                    />
                </div>
                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Username</p>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleTextChange}
                        placeholder="Username"
                        className="w-full max-w-150 p-2 step1input bg-[#fafbff] afocus:bg-[#f5f9ff]  focus:outline-0 ring-[.5px] rounded"
                        required
                    />
                </div>
                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Email</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleTextChange}
                        placeholder="Email Address"
                        className="w-full max-w-150 step1input p-2 bg-[#fafbff] afocus:bg-[#f5f9ff]  focus:outline-0 ring-[.5px] rounded"
                        required
                    />
                </div>
                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Mobile no.</p>
                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleTextChange}
                        placeholder="Mobile no."
                        className="w-full max-w-150 p-2 step1input bg-[#fafbff] afocus:bg-[#f5f9ff]  focus:outline-0 ring-[.5px] rounded"
                        required
                    />
                </div>
                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Specialized in</p>
                    <input
                        type="text"
                        name="specializedIn"
                        value={formData.specializedIn}
                        onChange={handleTextChange}
                        placeholder="Specialized work"
                        className="w-full max-w-150 p-2 step1input focus:outline-0 bg-[#fafbff] afocus:bg-[#f5f9ff] ring-[.5px] rounded"
                        required
                    />
                </div>
                <div className="w-full max-w-150 px-4">
                    <p className="pb-1">Country</p>
                    <select
                        id="country"
                        name="country"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="w-full max-w-150 p-2 step1input bg-[#fafbff] focus:outline-0 ring-[.5px] rounded"
                        required
                    >
                        <option value="">Select a Country</option>
                        {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                </div>
                <div className="max-w-210 mx-4 mt-10 flex justify-center">

                <button
                    type="submit"
                    className="cursor-pointer w-full max-w-50 py-2 bg-[#444] text-white rounded"
                    >
                    Send OTP
                </button>
                    </div>
            </form>
        </div>
    );
}
