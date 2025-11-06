import { NextResponse } from 'next/server';
import { ChatApiError, ChatApiResponse, ChatChunk, OllamaChatRequestBody, OllamaMessage } from '@/types/ollama-chat';
import { getRepository } from '@/lib/db/db-client';
import { ChatEntity } from '@/lib/entities/chat.entity';
import { MessageEntity } from '@/lib/entities/message.entity';

export async function POST(request: Request) {
    try {
        // TODO: validate request body properly
        const body: OllamaChatRequestBody = await request.json();
        console.log('Received chat request body:', body);

        // It's a new chat, create it in the database
        if (body.messages.length === 1) {
            const newChat = await createNewChat(body.chatId);
            console.log('Created new chat with ID:', newChat.id);
            body.chatId = newChat.id;
        }

        // TODO: schedule chat title generation for the chat

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
        const lastMessage = body.messages[body.messages.length - 1];

        await saveMessageToChat(body.chatId!, lastMessage);

        return NextResponse.json<ChatApiResponse>({
            success: true,
            chatId: body.chatId!,
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

        const lastMessage = body.messages[body.messages.length - 1];
        let accumulatedMessage = '';

        // Create a ReadableStream that forwards Ollama's streaming response
        const stream = new ReadableStream({
            start(controller) {
                const reader = response.body?.getReader();
                if (!reader) {
                    controller.close();
                    return;
                }

                const decoder = new TextDecoder();

                async function pump() {
                    try {
                        while (true) {
                            const { done, value } = await reader!.read();
                            if (done) {
                                // Stream is complete, save the accumulated message to database
                                if (accumulatedMessage && body.chatId) {
                                    await saveMessageToChat(body.chatId, lastMessage);
                                    // TODO: schedule chat title generation for the chat
                                    console.log('Message saved to database:', {
                                        chatId: body.chatId,
                                        messageLength: accumulatedMessage.length
                                    });
                                }
                                break;
                            }

                            // Forward the chunk to the client
                            controller.enqueue(value);

                            // Parse and accumulate the message content from chunks
                            const chunk = decoder.decode(value, { stream: true });
                            const lines = chunk.split('\n');

                            for (const line of lines) {
                                if (line.trim()) {
                                    try {
                                        const parsed = JSON.parse(line);
                                        if (parsed.message?.content) {
                                            accumulatedMessage += parsed.message.content;
                                        }
                                    } catch (e) {
                                        // Ignore parse errors for incomplete JSON
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error in stream pump:', error);
                        throw error;
                    } finally {
                        controller.close();
                    }
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

async function createNewChat(chatId: string) {
    const repo = await getRepository(ChatEntity);

    const newChat = repo.create();
    newChat.id = chatId;
    newChat.createdAt = new Date();
    newChat.title = "New Chat";

    return await repo.save(newChat);
}

async function saveMessageToChat(chatId: string, msg: OllamaMessage) {
    const messageRepo = await getRepository(MessageEntity);

    const newMessage = messageRepo.create();
    newMessage.id = msg.id;
    newMessage.content = msg.content;
    newMessage.sender = msg.role;
    newMessage.createdAt = new Date(msg.createdAt);
    newMessage.chat = { id: chatId } as ChatEntity;

    await messageRepo.save(newMessage);
}