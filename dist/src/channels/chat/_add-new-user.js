"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._addNewUser = _addNewUser;
const _utils_1 = require("@utils");
function _addNewUser({ ws, req }) {
    const id = _utils_1.IDUtils.generate();
    const user = {
        id,
        username: `user-${id.slice(0, 5)}`,
        client: ws,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    global.users[user.id] = user;
    ws.send(JSON.stringify({ type: 'registered', data: { id: user.id } }));
    return user;
}
