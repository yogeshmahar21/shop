import { useState } from "react";

export default function Step3Form({ prevStep }) {
  const [finalData, setFinalData] = useState({
    taxId: "",
    businessRegNumber: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFinalData({
      ...finalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the final data to your API or database
    console.log(finalData);
    // Redirect to a confirmation or thank you page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="taxId"
        value={finalData.taxId}
        onChange={handleChange}
        placeholder="Tax ID"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="businessRegNumber"
        value={finalData.businessRegNumber}
        onChange={handleChange}
        placeholder="Business Registration Number"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <label className="flex items-center">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={finalData.agreeTerms}
          onChange={handleChange}
          className="mr-2"
        />
        I agree to the terms and conditions
      </label>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="py-2 px-4 bg-gray-300 text-gray-700 rounded"
        >
          Previous
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
