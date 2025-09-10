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
exports.UsersController = void 0;
class UsersController {
    static list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _users = Object.values(global.users);
            const users = _users.map((user) => {
                return {
                    id: user.id,
                    name: user.username,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            });
            return res.status(200).json(users);
        });
    }
}
exports.UsersController = UsersController;
