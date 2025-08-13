"use client";
import { useState } from "react";

export default function SellerSettings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
  });

  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : prev[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Settings updated successfully!");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (confirmDelete) {
      alert("🗑️ Your account has been scheduled for deletion.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">⚙️ Seller Settings</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-white p-6 rounded-xl shadow"
      >
        {/* Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4">🛠️ Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              Enable Dark Mode
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Receive Email Notifications
            </label>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">🔐 Security</h2>
          <p className="text-sm text-gray-600 mb-4">You can request deletion of your account below. This will remove all your data and listed models.</p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete My Seller Account
          </button>
        </section>

        {/* Submit Settings */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
