import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { ChatEntity } from "./chat.entity";

export enum MessageSender {
    USER = "user",
    AI = "ai",
}

@Entity()
export class MessageEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "text" })
    content!: string

    @Column({ type: "text" })
    sender!: string

    @CreateDateColumn()
    createdAt!: Date

    @ManyToOne(() => require("./chat.entity").ChatEntity, (chat: ChatEntity) => chat.messages, { onDelete: "CASCADE" })
    chat!: ChatEntity
}