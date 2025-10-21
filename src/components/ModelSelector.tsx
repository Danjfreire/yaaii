'use client';

import { useState, useEffect } from 'react';

interface Model {
    name: string;
    size: number;
    modified_at: string;
    details: {
        parameter_size: string;
        quantization_level: string;
    }
}

interface ModelSelectorProps {
    selectedModel: string;
    onModelSelect: (modelName: string) => void;
}

export default function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
    const [models, setModels] = useState<Model[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/ollama/models');
            const data = await response.json();

            if (data.success) {
                setModels(data.models);
                // Auto-select first model if none selected
                if (data.models.length > 0 && !selectedModel) {
                    onModelSelect(data.models[0].name);
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to fetch models');
            console.error('Error fetching models:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                </h3>
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                </h3>
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                </div>
                <button
                    onClick={fetchModels}
                    className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Model
            </h3>
            <select
                value={selectedModel}
                onChange={(e) => onModelSelect(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
                {models.map((model) => (
                    <option key={model.name} value={model.name}>
                        {model.name} - {model.details.parameter_size}
                    </option>
                ))}
            </select>
            {models.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    No models found. Install models with: ollama pull llama3.2
                </p>
            )}
        </div>
    );
}