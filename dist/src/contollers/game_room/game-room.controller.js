"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoomController = void 0;
const _utils_1 = require("@utils");
const _constants_1 = require("@constants");
const ws_1 = require("ws");
const _channels_1 = require("@channels");
class GameRoomController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = _utils_1.IDUtils.generate();
            const id = Number(req.params.gameId);
            const game = _constants_1.games[id];
            global.games[hash] = Object.assign(Object.assign({}, game), { id, hash: hash, players: {}, watchers: [], status: 'waiting', socketChannel: new ws_1.WebSocketServer({
                    noServer: true,
                    skipUTF8Validation: true,
                }), createdAt: new Date(), updatedAt: new Date() });
            global.games[hash].socketChannel = _channels_1.GamesChannel.initialize(hash);
            return res.status(200).json({ id: hash });
        });
    }
}
exports.GameRoomController = GameRoomController;
