import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { MessageEntity } from "./message.entity";

@Entity()
export class ChatEntity {

    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "text" })
    title!: string

    @CreateDateColumn()
    createdAt!: Date

    @OneToMany(() => require("./message.entity").MessageEntity, (message: MessageEntity) => message.chat)
    messages!: MessageEntity[]
}