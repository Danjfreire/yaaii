export interface OllamaMessage {
    role: 'user' | 'assistant' | 'system';
    content: string
    id: string;
    createdAt: string;
}

export interface OllamaChatRequestBody {
    model: string;
    messages: OllamaMessage[];
    stream: boolean;
    chatId: string;
}

export interface ChatIntermediateChunk {
    model: string;
    created_at: string;
    message: {
        role: 'assistant';
        content: string;
    }
    done: boolean;
}

export interface ChatCompleteChunk {
    model: string;
    created_at: string;
    message: {
        role: 'assistant';
        content: string;
    }
    done: boolean;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    createdAt: Date;
}

export type ChatChunk = ChatIntermediateChunk | ChatCompleteChunk;

export interface ChatApiResponse {
    success: true;
    chatId: string;
    chunk: ChatChunk
}

export interface ChatApiError {
    success: false;
    error: string;
}

export type ChatApiResult = ChatApiResponse | ChatApiError;

// Type guard to check if response is successful
export function isChatsApiSuccess(
    response: ChatApiResult
): response is ChatApiResponse {
    return response.success === true;
}
