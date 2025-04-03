import { Message } from "../types/types";

function generateSimpleId(index: number): string {
    return `msg-${Date.now()}-${index}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}
export function generateMockMessages(
    count: number,
    userId: string,
    userName: string
): Message[] {
    const messages: Message[] = [];
    for (let i = 0; i < count; i++) {
        messages.push({
            id: generateSimpleId(i),
            userId,
            userName,
            content: `Mock message ${i + 1}`,
            createdAt: new Date(Date.now() - i * 60000).toISOString(),
            edited: false,
            deleted: false,
        });
    }
    return messages;
}
