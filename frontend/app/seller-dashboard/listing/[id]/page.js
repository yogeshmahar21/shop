'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dummy backend
const DUMMY_MODELS = [/* paste the array from above here */];

export default function EditModelPage() {
  const { slug } = useParams(); // e.g. "cool-car--12345"
  const id = slug.split('--').pop(); // Extract "12345"
  const [model, setModel] = useState(null);

  useEffect(() => {
    // Simulate backend fetch delay
    const timer = setTimeout(() => {
      const found = DUMMY_MODELS.find((m) => m.id === id);
      setModel(found || null);
    }, 300); // 300ms fake delay

    return () => clearTimeout(timer);
  }, [id]);

  if (!model) return <div className="pt-24 px-6">Loading model for editing...</div>;

  return (
    <div className="pt-24 max-w-4xl mx-auto px-6">
      <h1 className="text-2xl font-bold mb-4">Edit: {model.title}</h1>

      <form className="space-y-6">
        <div>
          <label className="block font-medium">Title</label>
          <input
            defaultValue={model.title}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <input
            defaultValue={model.category}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Price (INR)</label>
          <input
            type="number"
            defaultValue={model.price}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Add other fields as needed */}

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
