'use client';
import { useEffect, useState } from 'react';

export default function PaymentDetailsPage() {
  const [paymentSummary, setPaymentSummary] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Dummy payment summary
    setPaymentSummary({
      totalEarnings: 12500,
      withdrawn: 9500,
      pending: 3000,
      nextPayoutDate: '2025-06-18',
    });

    // Dummy transaction history
    setTransactions([
      {
        id: 'TXN1001',
        date: '2025-06-10',
        amount: 2500,
        status: 'Paid',
        method: 'Bank Transfer',
      },
      {
        id: 'TXN1000',
        date: '2025-06-03',
        amount: 3500,
        status: 'Paid',
        method: 'UPI',
      },
      {
        id: 'TXN0999',
        date: '2025-05-28',
        amount: 1500,
        status: 'Pending',
        method: 'Bank Transfer',
      },
    ]);
  }, []);

  return (
    <div className="p-6 md:pt-23 pb-20 pt-20 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">💰 Payment Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-green-800">Total Earnings</h2>
          <p className="text-2xl font-bold text-green-900 mt-2">₹{paymentSummary.totalEarnings}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-800">Withdrawn</h2>
          <p className="text-2xl font-bold text-blue-900 mt-2">₹{paymentSummary.withdrawn}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-yellow-800">Pending Payout</h2>
          <p className="text-2xl font-bold text-yellow-900 mt-2">₹{paymentSummary.pending}</p>
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-xl shadow border mb-6">
        <p className="text-sm text-gray-600">
          <strong>Next Payout Date:</strong> {paymentSummary.nextPayoutDate}
        </p>
      </div> */}

      <h2 className="text-xl font-semibold mb-4">🧾 Transaction History</h2>

      <div className="overflow-x-auto border-[#00000036] border-1 rounded-xl">
        <table className="min-w-full bg-white shadow-sm rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-[#dadada] text-left text-sm font-semibold text-gray-600">
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount (₹)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Method</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx} className="border-t odd:bg-[#ffffff] even:bg-[#f5f5f5] text-sm">
                <td className="px-4 py-3">{txn.id}</td>
                <td className="px-4 whitespace-nowrap py-3">{txn.date}</td>
                <td className="px-4 whitespace-nowrap py-3">₹{txn.amount}</td>
                <td className="px-4 whitespace-nowrap py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-4 whitespace-nowrap py-3">{txn.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
