import { getRepository } from '@/lib/db/db-client';
import { ChatEntity } from '@/lib/entities/chat.entity';
import { Chat } from '@/types/chat';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<Chat[]>> {
    const chatRepo = await getRepository<ChatEntity>(ChatEntity)

    const chats = await chatRepo.find()

    return NextResponse.json<Chat[]>(chats);
}