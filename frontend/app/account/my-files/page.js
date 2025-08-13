'use client'
import { useState } from "react";

export default function Settings() {
    const [orderUpdates, setOrderUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleToggle = (setting) => {
    if (setting === 'orderUpdates') {
      setOrderUpdates((prev) => !prev);
    } else if (setting === 'newsletter') {
      setNewsletter((prev) => !prev);
    } else if (setting === 'securityAlerts') {
      setSecurityAlerts((prev) => !prev);
    }
  };
    // const handleDeleteAccount = () => {
    //   if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
    //     alert("Account deleted!");
    //   }
    // };
  
    const handleDeleteAccount = () => {
        // You can add your logic here for account deletion.
        alert("Account Deleted!");
      };
    
      const handleConfirmationToggle = () => {
        setShowConfirmation(!showConfirmation);
      };
  
    return (
      <div className="md:px-8 px-4 pb-15 pt-20">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
  
        {/* Profile Information Section */}
        <div className="border-b pb-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <p><strong>Full Name:</strong> John Doe</p>
          <p><strong>Mobile No.:</strong>+91 98989 68989</p>
          <p><strong>Email Address:</strong> johndoe@example.com</p>
          <p><strong>Country:</strong> India</p>
        </div>
  
        {/* Password Section */}
        {/* Payment Methods Section */}
        <div className="border-b pb-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
          <p><strong>Card Number:</strong> **** **** **** 1234</p>
          <p><strong>Expiry Date:</strong> 12/23</p>
        </div>
  
        {/* Preferences Section */}
      
  

      

      {/* Email Notifications Section */}
      <div className="border-b pb-8 mb-8">
        <h3 className="text-xl font-semibold mb-4">Email Notifications</h3>

        <div className="flex max-w-65 justify-between items-center pb-1">
          <p><strong>Order Updates:</strong></p>
          <button
            onClick={() => handleToggle('orderUpdates')}
            className={`px-4 py-1 cursor-pointer rounded ${orderUpdates ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {orderUpdates ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <div className="flex max-w-65 justify-between items-center pb-1">
          <p><strong>Newsletter:</strong></p>
          <button
            onClick={() => handleToggle('newsletter')}
            className={`px-4 py-1 cursor-pointer rounded ${newsletter ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {newsletter ? 'Enabled' : 'Disabled'}
          </button>
        </div>
        <div className="flex max-w-65 justify-between items-center ">
          <p><strong>Security Alerts:</strong></p>
          <button
            onClick={() => handleToggle('securityAlerts')}
            className={`px-4 cursor-pointer py-1 rounded ${securityAlerts ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {securityAlerts ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
  
        {/* Danger Zone Section */}
        <div className="p-6  rounded-lg border border-gray-300 shadow-md mt-8 bg-white">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Account Deletion</h3>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone. Please
          ensure that you wish to proceed with this action.
        </p>
        
        {showConfirmation ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={handleConfirmationToggle}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConfirmationToggle}
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
          >
            Delete Account
          </button>
        )}
      </div>
      </div>
    );
  }
  
