'use client'
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Corrected import for query params
import Dummy from '@/components/Dummy';

const ModelsPage = () => {
    const searchParams = useSearchParams();  // Use this hook to access query parameters
    const [searchQuery, setSearchQuery] = useState('');

    // Update searchQuery from URL
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Example dummy data for models
    const models = [
        { id: 1, title: 'Model 1', description: 'A 3D model of a car' },
        { id: 2, title: 'Model 2', description: 'A 3D model of a plane' },
        { id: 3, title: 'Model 3', description: 'A 3D model of a building' },
        // Add more models as needed
    ];

    // Filter models based on the search query
    const filteredModels = useMemo(() => {
        if (searchQuery) {
            return models.filter(
                (model) =>
                    model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    model.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return models; // Return all models if no search query
    }, [searchQuery, models]);

    return (
        <div className="models-page">
            <h1>Models</h1>
            <Dummy />  {/* Include the SearchBar component */}
            <div className="models-list">
                {filteredModels.length > 0 ? (
                    filteredModels.map((model) => (
                        <div key={model.id} className="model-item">
                            <h2>{model.title}</h2>
                            <p>{model.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No models found for &quot;{searchQuery}&quot;</p>
                )}
            </div>
        </div>
    );
};

export default ModelsPage;
