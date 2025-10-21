import { NextResponse } from 'next/server';

export async function GET() {
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

        // console.log('Fetched Ollama models:', data);
        // for (const model of data.models) {
        //     console.log(`Model: ${model.name}, Details: ${JSON.stringify(model.details)}`);
        // }

        return NextResponse.json({
            success: true,
            models: data.models || [],
        });
    } catch (error) {
        console.error('Error fetching Ollama models:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434'
            },
            { status: 500 }
        );
    }
}