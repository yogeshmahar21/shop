import { useState } from "react";

export default function Step2Form({ nextStep, prevStep }) {
  const [bankData, setBankData] = useState({
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    paymentMethod: "directDeposit",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankData({
      ...bankData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep(); // Go to the next step
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="accountName"
        value={bankData.accountName}
        onChange={handleChange}
        placeholder="Account Name"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="accountNumber"
        value={bankData.accountNumber}
        onChange={handleChange}
        placeholder="Account Number"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="routingNumber"
        value={bankData.routingNumber}
        onChange={handleChange}
        placeholder="Routing Number"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
      <select
        name="paymentMethod"
        value={bankData.paymentMethod}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="directDeposit">Direct Deposit</option>
        <option value="paypal">PayPal</option>
      </select>
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
          Next
        </button>
      </div>
    </form>
  );
}
