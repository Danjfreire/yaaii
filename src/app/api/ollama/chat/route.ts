import { NextResponse } from 'next/server';
import { ChatApiError, ChatApiResponse, ChatChunk, OllamaChatRequestBody } from '@/types/chat';

export async function POST(request: Request): Promise<NextResponse<ChatApiResponse | ChatApiError>> {
    try {
        // TODO: validate request body properly
        const body: OllamaChatRequestBody = await request.json();
        console.log('Received chat request body:', body);
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();

        const chatChunk: ChatChunk = data;

        return NextResponse.json<ChatApiResponse>({
            success: true,
            chunk: chatChunk,
        });
    } catch (error) {
        console.error('Error fetching Ollama models:', error);

        return NextResponse.json<ChatApiError>(
            {
                success: false,
                error: 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434'
            },
            { status: 500 }
        );
    }
}