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

}