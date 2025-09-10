"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesChannel = void 0;
const ws_1 = require("ws");
require("../../globals");
const _on_error_1 = require("./_on-error");
const _on_message_1 = require("./_on-message");
const _on_close_1 = require("./_on-close");
class GamesChannel {
    static initialize(hash) {
        if (global.games[hash] === undefined) {
            throw new Error(`Game with hash ${hash} does not exist`);
        }
        global.games[hash].socketChannel.removeAllListeners();
        global.games[hash].socketChannel = new ws_1.WebSocketServer({
            noServer: true,
            skipUTF8Validation: true,
        });
        global.games[hash].socketChannel.broadcast = _broadcast;
        global.games[hash].socketChannel.on('connection', (ws, req) => {
            // const user = _addNewUser({ ws, req });
            ws.on('error', (error) => (0, _on_error_1._onError)({ error, restart: () => GamesChannel.initialize(hash) }));
            // ws.on('message', (text) => _onMessage({ user, text: text }));
            ws.on('message', (text) => (0, _on_message_1._onMessage)({ text: text }));
            // ws.on('close', () => _onClientClose({ user }));
            ws.on('close', () => (0, _on_close_1._onClientClose)({}));
        });
        global.games[hash].socketChannel.on('close', () => (0, _on_close_1._onServerClose)({ restart: () => GamesChannel.initialize(hash) }));
        global.games[hash].socketChannel.on('error', (error) => (0, _on_error_1._onError)({ error, restart: () => GamesChannel.initialize(hash) }));
        return global.games[hash].socketChannel;
    }
}
exports.GamesChannel = GamesChannel;
function _broadcast(message) {
    // const users = Object.values(global.users);
    // users.forEach((user) => {
    // 	user.client.send(JSON.stringify(message));
    // });
}
