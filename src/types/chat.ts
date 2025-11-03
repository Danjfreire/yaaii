export interface Chat {
    id: string;
    title: string;
    createdAt: Date;
}

export interface ModelsApiResponse {
    success: true;
    chats: Chat[];
}

export interface ChatApiError {
    success: false;
    error: string;
}