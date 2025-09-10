"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._onServerClose = _onServerClose;
exports._onClientClose = _onClientClose;
require("../../globals");
function _onServerClose({ restart }) {
    // global.usersChannel.close();
    setTimeout(() => {
        restart();
    }, 3000);
}
function _onClientClose({ user }) {
    // user.client.close();
    // // eslint-disable-next-line no-console
    // console.log(`User ${user.id} disconnected`);
    // // eslint-disable-next-line no-console
    // console.log(`User ${user.id} closed`);
    // // eslint-disable-next-line no-console
    // console.log('====================================');
    // delete global.users[user.id];
    // setTimeout(() => {
    // 	global.usersChannel.broadcast
    // 		? global.usersChannel.broadcast({
    // 				type: 'event',
    // 				from: user.id,
    // 				data: {
    // 					event: 'user_disconnected',
    // 				},
    // 			})
    // 		: undefined;
    // }, 1000);
}
