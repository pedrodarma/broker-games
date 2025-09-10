/**
 * ---
 * #### WebSocketMessage represents a message sent over a WebSocket connection.
 *
 * Each message has a `type`, a `from` field indicating the sender,
 * an optional `to` field indicating the recipient, and a `data` field
 * containing the message payload.
 *
 * The `type` field can be one of the following: 'log', 'chat', 'command', 'event', or 'action'.
 *
 * Example:
 * ```json
 * {
 *   "type": "chat",
 *   "from": "user123", \\ USER_ID or SYSTEM
 *   "to": "gameId", \\ USER_ID, GAME_ID or omitted for broadcast
 *   "data": {
 *     "message": "Hello, world!"
 *   }
 * }
 * ```
 * ---
 * <br/>&nbsp;<br/>
 */
export interface WebSocketMessage {
    type: WebSocketMessageType;
    from: string;
    to?: string;
    data: Record<string, DataValue>;
}
/**
 * ---
 * #### WebSocketMessageType can be one of the following:
 *
 * - 'log': A log message, typically used for debugging or informational purposes.
 * - 'chat': A chat message sent between users.
 * - 'command': A command message that may trigger specific actions or behaviors.
 * - 'event': An event message indicating that a specific event has occurred.
 * - 'action': An action message that represents a user-initiated action.
 *
 * ---
 * <br/>&nbsp;<br/>
 */
type WebSocketMessageType = 'log' | 'chat' | 'command' | 'event' | 'action';
type DataValue = string | number | boolean | null | undefined | object;
export {};
