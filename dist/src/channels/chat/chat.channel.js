"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatChannel = void 0;
const ws_1 = require("ws");
require("../../globals");
const _on_error_1 = require("./_on-error");
const _on_message_1 = require("./_on-message");
const _on_close_1 = require("./_on-close");
const _add_new_user_1 = require("./_add-new-user");
class ChatChannel {
    static initialize() {
        global.globalChatChannel.removeAllListeners();
        global.globalChatChannel = new ws_1.WebSocketServer({
            noServer: true,
            skipUTF8Validation: true,
        });
        global.globalChatChannel.broadcast = _broadcast;
        global.globalChatChannel.on('connection', (ws, req) => {
            const user = (0, _add_new_user_1._addNewUser)({ ws, req });
            setTimeout(() => {
                global.globalChatChannel.broadcast
                    ? global.globalChatChannel.broadcast({
                        type: 'event',
                        from: user.id,
                        data: {
                            event: 'new_user',
                        },
                    })
                    : undefined;
            }, 1000);
            ws.on('error', (error) => (0, _on_error_1._onError)({ error, restart: ChatChannel.initialize }));
            ws.on('message', (text) => (0, _on_message_1._onMessage)({ user, text: text }));
            ws.on('close', () => (0, _on_close_1._onClientClose)({ user }));
        });
        global.globalChatChannel.on('close', () => (0, _on_close_1._onServerClose)({ restart: ChatChannel.initialize }));
        global.globalChatChannel.on('error', (error) => (0, _on_error_1._onError)({ error, restart: ChatChannel.initialize }));
        return global.globalChatChannel;
    }
}
exports.ChatChannel = ChatChannel;
function _broadcast(message) {
    const users = Object.values(global.users);
    users.forEach((user) => {
        user.client.send(JSON.stringify(message));
    });
}
