"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._onError = _onError;
function _onError({ error, restart }) {
    // eslint-disable-next-line no-console
    console.log('====================================');
    // eslint-disable-next-line no-console
    console.log('EXCEPTION: ', error);
    // eslint-disable-next-line no-console
    console.log('====================================');
    if (error.name === 'ECONNREFUSED' || error.message === 'ECONNREFUSED') {
        restart();
    }
}
