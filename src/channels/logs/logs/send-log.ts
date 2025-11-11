import { GameIDs } from '@constants';
import { sendQuickTacToeLog } from './send-log-qtt';
// import {sendCarnavalWorldLog} from './send-log-cnw';
// import {sendNavalBattleLog} from './send-log-nbt';
// import {sendRockPaperScissorsLog} from './send-log-rps';

export function sendLog(gameKey: GameIDs, hash: string, type: string) {
	try {
		const logByGameSenders: Record<GameIDs, (_hash: string) => void> = {
			QTT: (_hash: string) => {
				// const { sendQuickTacToeLog } = require('./send-log-qtt');
				sendQuickTacToeLog(_hash, type);
			},
			CNW: (_hash: string) => {
				const { sendCarnavalWorldLog } = require('./send-log-cnw');
				sendCarnavalWorldLog(_hash);
			},
			NBT: (_hash: string) => {
				const { sendNavalBattleLog } = require('./send-log-nbt');
				sendNavalBattleLog(_hash);
			},
			RPS: (_hash: string) => {
				const { sendRockPaperScissorsLog } = require('./send-log-rps');
				sendRockPaperScissorsLog(_hash);
			},
		};

		const sendLogFunction = logByGameSenders[gameKey];
		if (sendLogFunction) {
			sendLogFunction(hash);
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log('====================================');
		// eslint-disable-next-line no-console
		console.log('EXCEPTION: ', error);
		// eslint-disable-next-line no-console
		console.log('HASH: ', hash);
		// eslint-disable-next-line no-console
		console.log('====================================');
	}
}
