import { ChatApiResponse, ChatApiResult, ChatChunk, OllamaChatRequestBody } from '@/types/chat';
import { ModelsApiResult } from '@/types/model';

export class ApiClient {
    /**
     * Fetch available Ollama models
     */
    static async getModels(): Promise<ModelsApiResult> {
        const response = await fetch('/api/ollama/models');

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        return response.json();
    }

    static async chat(data: OllamaChatRequestBody): Promise<ChatApiResult> {
        const response = await fetch('/api/ollama/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        return response.json();
    }

    static async chatStreaming(
        data: OllamaChatRequestBody,
        onChunk: (chunk: ChatChunk) => void
    ): Promise<void> {
        const response = await fetch('/api/ollama/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Get the stream reader
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // Convert Uint8Array to string
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Process complete lines (Ollama sends one JSON object per line)
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine) {
                        try {
                            const parsedChunk: ChatChunk = JSON.parse(trimmedLine);
                            onChunk(parsedChunk);
                        } catch (parseError) {
                            console.warn('Failed to parse chunk:', trimmedLine, parseError);
                        }
                    }
                }
            }

            // Process any remaining data in buffer
            if (buffer.trim()) {
                try {
                    const parsedChunk: ChatChunk = JSON.parse(buffer.trim());
                    onChunk(parsedChunk);
                } catch (parseError) {
                    console.warn('Failed to parse final chunk:', buffer, parseError);
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

}