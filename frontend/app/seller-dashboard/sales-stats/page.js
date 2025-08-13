'use client';
import { useEffect, useState } from 'react';

export default function SalesStatsPage() {
  const [stats, setStats] = useState({});
  const [topModels, setTopModels] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]); 

  useEffect(() => {
    // Dummy Data
    setStats({
      totalSales: 42,
      totalRevenue: 25796,
      monthlyGrowth: '18%',
    });

    setTopModels([
      { title: 'Sci-Fi Spaceship', sales: 14, revenue: 6993 },
      { title: 'Cartoon House', sales: 11, revenue: 3289 },
      { title: 'Medieval Sword', sales: 9, revenue: 4491 },
    ]);

    setRecentOrders([
      { buyer: 'Ankit Sharma', model: 'Sci-Fi Spaceship', date: '2025-06-12', amount: 499 },
      { buyer: 'Riya Mehta', model: 'Cartoon House', date: '2025-06-11', amount: 299 },
      { buyer: 'Rohan Verma', model: 'Medieval Sword', date: '2025-06-10', amount: 499 },
    ]);
  }, []);

  return (
    <div className="p-6 md:pt-23 pt-20 pb-20 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Sales & Booking Stats</h1>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-600 text-sm">Total Sales</h2>
          <p className="text-2xl font-bold text-blue-600">{stats.totalSales}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-600 text-sm">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-600 text-sm">Monthly Growth</h2>
          <p className="text-2xl font-bold text-purple-600">{stats.monthlyGrowth}</p>
        </div>
      </div>

      {/* Top Selling Models */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">🏆 Top Selling Models</h2>
        <div className="bg-white rounded-xl shadow overflow-x-auto border-[#00000036] border-1 ">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr className='bg-[#dadada]'>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Sales</th>
                <th className="p-3 text-left">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {topModels.map((model, idx) => (
                <tr key={idx} className="odd:bg-[#ffffff] even:bg-[#f5f5f5] border-t ">
                  <td className="p-3 whitespace-nowrap">{model.title}</td>
                  <td className="p-3">{model.sales}</td>
                  <td className="p-3">{model.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders */}
      {/* <div>
        <h2 className="text-lg font-semibold mb-3">🧾 Recent Orders</h2>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Model</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3">{order.buyer}</td>
                  <td className="p-3">{order.model}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3 text-green-600 font-semibold">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
