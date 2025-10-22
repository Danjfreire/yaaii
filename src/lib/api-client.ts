import { ChatApiResponse, ChatApiResult, OllamaChatRequestBody } from '@/types/chat';
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

}