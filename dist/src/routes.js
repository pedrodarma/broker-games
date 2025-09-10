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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const game_room_1 = __importDefault(require("./contollers/game_room"));
const games_1 = __importDefault(require("./contollers/games"));
const users_1 = __importDefault(require("./contollers/users"));
const router = (0, express_1.Router)();
exports.router = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Games Broker');
}));
router.get('/healthcheck', (req, res) => res.sendStatus(200));
router.post('/game/create', game_room_1.default.create);
router.get('/game/create', game_room_1.default.create);
router.get('/games', games_1.default.list);
router.get('/users', users_1.default.list);
