"use client";
import { useState } from "react";

export default function AccountBilling() {
    // const [cards, setCards] = useState([]);
    // const [cardNumber, setCardNumber] = useState("");
    // const [expiry, setExpiry] = useState("");
    // const [name, setName] = useState("");
  
    // const formatCardNumber = (value) => {
    //   return value
    //     .replace(/\D/g, "")
    //     .slice(0, 16)
    //     .replace(/(.{4})/g, "$1 ")
    //     .trim();
    // };
  
    // const formatExpiry = (value) => {
    //   const clean = value.replace(/\D/g, "").slice(0, 4);
    //   return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
    // };
  
    // const handleAddCard = () => {
    //   if (cardNumber.replace(/\s/g, "").length < 16 || expiry.length < 5 || name.trim() === "") {
    //     alert("Please fill all fields with valid data.");
    //     return;
    //   }
  
    //   const newCard = {
    //     id: Date.now(),
    //     cardNumber,
    //     expiry,
    //     name,
    //     isDefault: cards.length === 0, // First card is default
    //   };
  
    //   setCards([...cards, newCard]);
    //   setCardNumber("");
    //   setExpiry("");
    //   setName("");
    // };
  
    // const handleDeleteCard = (id) => {
    //   const filtered = cards.filter((c) => c.id !== id);
    //   setCards(filtered);
    // };
  
    // const handleSetDefault = (id) => {
    //   const updated = cards.map((c) => ({
    //     ...c,
    //     isDefault: c.id === id,
    //   }));
    //   setCards(updated);
    // };

    const [cards, setCards] = useState([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [showAddCard, setShowAddCard] = useState(false);
  
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cardHolderName, setCardHolderName] = useState("");
  
    const formatCardNumber = (value) =>
      value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
  
    const formatExpiry = (value) => {
      const clean = value.replace(/\D/g, "").slice(0, 4);
      return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
    };
  
    const handleAddCard = (e) => {
      e.preventDefault();
  
      const cleanCardNum = cardNumber.replace(/\s/g, "");
      if (
        cleanCardNum.length !== 16 ||
        expiry.length !== 5 ||
        !/^\d{2}\/\d{2}$/.test(expiry) ||
        !cardHolderName.trim()
      ) {
        alert("Please enter valid card details.");
        return;
      }
  
      const newCard = {
        last4: cleanCardNum.slice(-4),
        expiry,
        name: cardHolderName.trim(),
      };
  
      setCards([...cards, newCard]);
      setShowAddCard(false);
      setCardNumber("");
      setExpiry("");
      setCardHolderName("");
      setSelectedCardIndex(cards.length); // select the newly added card
    };
  
    const removeCard = (index) => {
      const updated = [...cards];
      updated.splice(index, 1);
      setCards(updated);
      if (selectedCardIndex === index) setSelectedCardIndex(null);
    };

    const billingHistory = [
        {
            id: 1,
            date: "2025-04-12",
            item: "Premium 3D Model - Gear Assembly",
            amount: 499,
            status: "Paid",
        },
        {
            id: 2,
            date: "2025-03-25",
            item: "SolidWorks Piston Design",
            amount: 299,
            status: "Paid",
        },
        {
            id: 3,
            date: "2025-02-14",
            item: "Fusion360 Model Pack",
            amount: 899,
            status: "Failed",
        },
        {
            id: 4,
            date: "2025-02-14",
            item: "Fusion360 Model Pack",
            amount: 899,
            status: "Failed",
        },
        {
            id: 5,
            date: "2025-02-14",
            item: "Fusion360 Model Pack",
            amount: 899,
            status: "Failed",
        },
        {
            id: 6,
            date: "2025-02-14",
            item: "Fusion360 Model Pack",
            amount: 899,
            status: "Failed",
        },
        {
            id: 7,
            date: "2025-02-14",
            item: "Fusion360 Model Pack",
            amount: 899,
            status: "Failed",
        },
    ];

    const [paymentMethod, setPaymentMethod] = useState("Visa **** 1234");

    return (
        <div className="bg-gray-100 min-h-screen pt-20 pb-10 px-2 md:px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Account & Billing</h2>

                {/* Account Details */}
                <div className="mb-10">
                    <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <p><strong>Name:</strong> Yogesh Bhai</p>
                        <p><strong>Email:</strong> yogesh@example.com</p>
                        <p><strong>Mobile:</strong> +91 9876543210</p>
                        <p><strong>Country:</strong> India</p>
                    </div>
                </div>

                {/* Payment Method */}
         
                <div className="mb-10">
      <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>

      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex items-center justify-between p-3 border rounded mb-2 ${
            selectedCardIndex === index ? "border-blue-500" : "border-gray-300"
          }`}
        >
          <div>
            <p className="text-gray-800 font-medium">
              **** **** **** {card.last4}
            </p>
            <p className="text-sm text-gray-500">Expires: {card.expiry}</p>
            <p className="text-sm text-gray-600">Name: {card.name}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setSelectedCardIndex(index)}
            >
              {selectedCardIndex === index ? "Selected" : "Use this"}
            </button>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={() => removeCard(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {cards.length < 2 && !showAddCard && (
        <button
          onClick={() => setShowAddCard(true)}
          className="text-sm text-green-600 hover:underline mt-2"
        >
          + Add New Card
        </button>
      )}

      {showAddCard && (
        <form onSubmit={handleAddCard} className="mt-4 space-y-3">
          <input
            type="text"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            placeholder="Cardholder Name"
            className="border p-2 rounded w-full max-w-60 mx-2"
            required
          />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="Card Number (e.g. 4242 4242 4242 4242)"
            className="border p-2 rounded w-full max-w-60 mx-2"
            maxLength={19}
            required
          />
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="Expiry (MM/YY)"
            className="border p-2 rounded w-full max-w-35 mx-2"
            maxLength={5}
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Card
            </button>
            <button
              type="button"
              onClick={() => setShowAddCard(false)}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
               {/* Billing History */}
<div className="mb-6">
    <h3 className="text-lg font-semibold mb-4">Billing History</h3>
    <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
            <table className="w-full text-sm text-left border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 border-b">Date</th>
                        <th className="py-3 px-4 border-b">Item</th>
                        <th className="py-3 px-4 border-b">Amount (₹)</th>
                        <th className="py-3 px-4 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {billingHistory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                            <td className="py-3 px-4">{item.date}</td>
                            <td className="py-3 px-4">{item.item}</td>
                            <td className="py-3 px-4">{item.amount}</td>
                            <td className={`py-3 px-4 font-medium ${item.status === "Failed" ? "text-red-600" : "text-green-600"}`}>
                                {item.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</div>

            </div>
        </div>
    );
}
