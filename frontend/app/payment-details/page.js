'use client'
import { useState } from 'react';

export default function Step2Form() {
  const [bankData, setBankData] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    paymentMethod: 'directDeposit',
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
    // Handle submission logic (e.g., send data to backend)
    console.log(bankData);
    // Redirect to step 3 on success
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="accountName"
        value={bankData.accountName}
        onChange={handleChange}
        placeholder="Account Name"
      />
      <input
        type="text"
        name="accountNumber"
        value={bankData.accountNumber}
        onChange={handleChange}
        placeholder="Account Number"
      />
      <input
        type="text"
        name="routingNumber"
        value={bankData.routingNumber}
        onChange={handleChange}
        placeholder="Routing Number"
      />
      <select
        name="paymentMethod"
        value={bankData.paymentMethod}
        onChange={handleChange}
      >
        <option value="directDeposit">Direct Deposit</option>
        <option value="paypal">PayPal</option>
      </select>
      <button type="submit">Next</button>
    </form>
  );
}
