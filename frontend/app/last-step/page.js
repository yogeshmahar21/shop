'use client'
import { useState } from 'react';

export default function Step3Form() {
  const [finalData, setFinalData] = useState({
    taxId: '',
    businessRegNumber: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFinalData({
      ...finalData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic (e.g., send data to backend)
    console.log(finalData);
    // Redirect to a thank-you page or confirmation screen
  };

  return (
    <form className='pt-25' onSubmit={handleSubmit}>
      <input
        type="text"
        name="taxId"
        value={finalData.taxId}
        onChange={handleChange}
        placeholder="Tax ID"
      />
      <input
        type="text"
        name="businessRegNumber"
        value={finalData.businessRegNumber}
        onChange={handleChange}
        placeholder="Business Registration Number"
      />
      <label>
        <input
          type="checkbox"
          name="agreeTerms"
          checked={finalData.agreeTerms}
          onChange={handleChange}
        />
        I agree to the terms and conditions
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
