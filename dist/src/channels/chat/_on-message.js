"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._onMessage = _onMessage;
require("../../globals");
function _formatMessage(message) {
    try {
        const data = message.replace(/(['"])?([a-zA-Z_]+)(['"])?:/g, '"$2": ');
        return JSON.parse(data);
    }
    catch (_a) {
        if (message === 'connected') {
            return { action: 'register' };
        }
        return message;
    }
}
function _onMessage({ user, text }) {
    try {
        if (text) {
            const formated = Buffer.from(text.toString()).toString('ascii');
            const message = _formatMessage(formated);
            if (message && message.type) {
                switch (message.type.toLowerCase()) {
                    case 'log':
                        // eslint-disable-next-line no-console
                        // console.log(message);
                        break;
                    case 'action':
                        // eslint-disable-next-line no-console
                        // console.log(message);
                        break;
                    case 'event':
                        // eslint-disable-next-line no-console
                        // console.log(message);
                        if (!message.from || !message.to) {
                            return;
                        }
                        const event = message.data.event;
                        if (!event) {
                            return;
                        }
                        break;
                    case 'command':
                        // eslint-disable-next-line no-console
                        // console.log(message);
                        if (!message.from || !message.to) {
                            return;
                        }
                        const command = message.data.command;
                        if (!command) {
                            return;
                        }
                        break;
                    case 'print_settings':
                        // eslint-disable-next-line no-console
                        console.log(message);
                        break;
                    case 'ping':
                        user.client.send('pong');
                        break;
                    default:
                        // eslint-disable-next-line no-console
                        console.log('UNHANDLED TYPE ', message);
                        break;
                }
            }
            else {
                if (text.toString() === 'ping') {
                    user.client.send('pong');
                    return;
                }
                // eslint-disable-next-line no-console
                console.log('MESSAGE WITHOUT TYPE ', message);
            }
        }
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.log('====================================');
        // eslint-disable-next-line no-console
        console.log('EXCEPTION: ', error);
        // eslint-disable-next-line no-console
        console.log('TEXT: ', text);
        // eslint-disable-next-line no-console
        console.log('====================================');
    }
}
