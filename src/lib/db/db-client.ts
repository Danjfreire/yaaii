import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
import { ChatEntity } from "../entities/chat.entity";
import { MessageEntity } from "../entities/message.entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [ChatEntity, MessageEntity],
    synchronize: true,
});

export async function initializeDatabase() {
    if (!AppDataSource.isInitialized) {
        console.log("Initializing database...");
        await AppDataSource.initialize();
    }
}

export async function getDataSource(): Promise<DataSource> {
    await initializeDatabase();
    return AppDataSource;
}

export async function getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    await initializeDatabase();
    return AppDataSource.getRepository(entity);
}