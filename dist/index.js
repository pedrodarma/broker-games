"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const _channels_1 = require("@channels");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.set('trust proxy', true);
const _chatChannel = _channels_1.ChatChannel.initialize();
server.on('upgrade', (request, socket, head) => {
    var _a;
    const { pathname } = new URL((_a = request.url) !== null && _a !== void 0 ? _a : '');
    console.log({ pathname });
    if (pathname === undefined) {
        socket.destroy();
        return;
    }
    if (pathname === '/chat') {
        _chatChannel.handleUpgrade(request, socket, head, (ws) => {
            _chatChannel.emit('connection', ws, request);
        });
        return;
    }
    if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith('/game/')) {
        const hash = pathname.split('/game/')[1];
        if (global.games[hash] === undefined) {
            socket.destroy();
            return;
        }
        global.games[hash].socketChannel.handleUpgrade(request, socket, head, (ws) => {
            global.games[hash].socketChannel.emit('connection', ws, request);
        });
        return;
    }
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.warn(`Server listening on port ${port}`);
});
