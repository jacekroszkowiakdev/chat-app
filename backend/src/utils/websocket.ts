import WebSocket, { WebSocketServer } from "ws";
import { WebSocketMessage, PublicUser } from "../types";

export function broadcast(message: WebSocketMessage, wss: WebSocketServer) {
    const messageString = JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
}

export function broadcastParticipants(
    participants: PublicUser[],
    wss: WebSocketServer
): void {
    broadcast(
        {
            type: "PARTICIPANT_LIST",
            payload: participants,
        },
        wss
    );
}
