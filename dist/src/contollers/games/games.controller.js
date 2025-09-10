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
exports.GamesController = void 0;
class GamesController {
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const _users = Object.values(global.users);
            // const _brokerIP = global.ip;
            // const users = _users.map((user) => {
            // 	const ip = global.ips[user.ip];
            // 	return {
            // 		id: user.id,
            // 		name: user.name,
            // 		ip: user.ip,
            // 		local: _brokerIP === user.ip,
            // 		location: ip?.location?.data,
            // 		createdAt: user.createdAt,
            // 		updatedAt: user.updatedAt,
            // 	};
            // });
            return res.status(200).json([]);
        });
    }
}
exports.GamesController = GamesController;
