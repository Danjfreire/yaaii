import { NextResponse } from 'next/server';
import { ChatApiError, ChatApiResponse, ChatChunk, OllamaChatRequestBody } from '@/types/chat';

export async function POST(request: Request) {
    try {
        // TODO: validate request body properly
        const body: OllamaChatRequestBody = await request.json();
        console.log('Received chat request body:', body);

        if (body.stream) {
            return handleStreamingResponse(body);
        } else {
            return handleNonStreamingResponse(body);
        }
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        return NextResponse.json<ChatApiError>(
            {
                success: false,
                error: 'Failed to process chat request'
            },
            { status: 500 }
        );
    }
}

async function handleNonStreamingResponse(body: OllamaChatRequestBody): Promise<NextResponse<ChatApiResponse | ChatApiError>> {
    try {
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
        console.error('Error in non-streaming response:', error);
        return NextResponse.json<ChatApiError>(
            {
                success: false,
                error: 'Failed to connect to Ollama. Make sure Ollama is running on localhost:11434'
            },
            { status: 500 }
        );
    }
}

async function handleStreamingResponse(body: OllamaChatRequestBody): Promise<Response> {
    try {
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

        // Create a ReadableStream that forwards Ollama's streaming response
        const stream = new ReadableStream({
            start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                // function pump(): Promise<void> {
                //     return reader!.read().then(({ done, value }) => {
                //         if (done) {
                //             controller.close();
                //             return;
                //         }

                //         // Forward the chunk to the client
                //         controller.enqueue(value);
                //         return pump();
                //     });
                // }

                async function pump() {
                    while (true) {
                        const { done, value } = await reader!.read();
                        if (done) break;
                        controller.enqueue(value)
                    }
                    controller.close();
                }

                return pump();
            }
        });


        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });
    } catch (error) {
        console.error('Error in streaming response:', error);
        return NextResponse.json<ChatApiError>(
            {
                success: false,
                error: 'Failed to connect to Ollama for streaming'
            },
            { status: 500 }
        );
    }
}