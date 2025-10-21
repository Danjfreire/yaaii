import { NextResponse } from 'next/server';
import { ModelsApiResponse, ModelsApiError, OllamaModel } from '@/types/model';

export async function GET(): Promise<NextResponse<ModelsApiResponse | ModelsApiError>> {
    try {
        // Call Ollama's API to get available models
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();

        // Type the response from Ollama
        const ollamaModels: OllamaModel[] = data.models || [];

        return NextResponse.json<ModelsApiResponse>({
            success: true,
            models: ollamaModels,
        });
    } catch (error) {
        console.error('Error fetching Ollama models:', error);

        return NextResponse.json<ModelsApiError>(
            {
                success: false,
                error: 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434'
            },
            { status: 500 }
        );
    }
}