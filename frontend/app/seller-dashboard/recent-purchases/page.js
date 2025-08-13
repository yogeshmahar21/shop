'use client';
import { useEffect, useState } from 'react';

export default function RecentOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Dummy recent orders data
    setOrders([
      {
        id: 'OD123456',
        buyerName: 'Riya Mehta',
        modelName: 'Cartoon House.glb',
        price: 499,
        date: '2025-06-11',
        status: 'Completed',
      },
      {
        id: 'OD123457',
        buyerName: 'Aman Sharma',
        modelName: 'Low Poly Car.obj',
        price: 699,
        date: '2025-06-10',
        status: 'Completed',
      },
      {
        id: 'OD123458',
        buyerName: 'Nisha Verma',
        modelName: 'Sci-Fi Drone.fbx',
        price: 899,
        date: '2025-06-08',
        status: 'Pending',
      },
    ]);
  }, []);

  return (
    <div className="p-6 md:pt-23 pt-20 pb-20 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🛒 Recent Orders</h1>

        <div className="overflow-x-auto border-[#00000036] border-1 rounded-xl">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#dadada] text-left text-sm font-semibold text-gray-600">
                <th className="px-4 py-3">Purchase ID</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Price (₹)</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
              {orders.length === 0 ? (
                <thead>
                  <tr>
                    <td colSpan={6} className='text-center w-full py-4'>
                      <span className="text-gray-600 w-full">No recent orders yet.</span>
                    </td>
                  </tr>
                </thead>
              ) : (
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-t odd:bg-[#ffffff] even:bg-[#f5f5f5] text-sm">
                  <td className="px-4 whitespace-nowrap py-3">{order.id}</td>
                  <td className="px-4 whitespace-nowrap py-3">{order.buyerName}</td>
                  <td className="px-4 whitespace-nowrap py-3">{order.modelName}</td>
                  <td className="px-4 whitespace-nowrap py-3">₹{order.price}</td>
                  <td className="px-4 whitespace-nowrap py-3">{order.date}</td>
                  <td className="px-4 whitespace-nowrap py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

            </tbody>
      )}
          </table>
        </div>
    </div>
  );
}
