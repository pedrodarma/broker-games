"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _channels_1 = require("@channels");
_channels_1.ChatChannel.initialize();
// Databases.initialize();
// IPService.getBrokerIP()
// 	.then((ip) => {
// 		global.ip = ip;
// 		// console.log(`Broker IP: ${global.ip}`);
// 	})
// 	.catch((error) => {
// 		console.error(`Error fetching broker IP: ${error}`);
// 		// throw new Error(`Failed to fetch broker IP: ${error}`);
// 	});
// /**
//  * Initialize WebSocketServers
//  */
// global.usersChannel = new WebSocketServer({
// 	noServer: true,
// 	skipUTF8Validation: true,
// 	verifyClient: (info, cb) => {
// 		const params = info.req.url?.split('?')[1];
// 		const ip = params?.split('ip=')[1]?.split('&')[0];
// 		if (!ip) {
// 			cb(false, 4000, 'Invalid access');
// 			return;
// 		}
// 		// if (global.users[ip]) {
// 		// 	cb(false, 4001, 'User already registered');
// 		// 	return;
// 		// }
// 		cb(true);
// 	},
// });
// global.robotsChannel = new WebSocketServer({
// 	noServer: true,
// 	skipUTF8Validation: true,
// 	verifyClient: (info, cb) => {
// 		const params = info.req.url?.split('?')[1];
// 		// const espCode = params?.split('code=')[1]?.split('&')[0];
// 		const name = params?.split('name=')[1]?.split('&')[0];
// 		const type = params?.split('type=')[1]?.split('&')[0];
// 		const espCode = params?.split('code=')[1]?.split('&')[0];
// 		const version = params?.split('version=')[1]?.split('&')[0];
// 		if (!name || !type || !espCode || !version) {
// 			cb(false, 4000, 'Invalid access');
// 			return;
// 		}
// 		// if (global.robots[espCode]) {
// 		// 	cb(false, 4001, 'Robot already registered');
// 		// 	return;
// 		// }
// 		cb(true);
// 	},
// });
// global.applicationsChannel = new WebSocketServer({
// 	noServer: true,
// 	skipUTF8Validation: true,
// });
// global.robots = {};
global.games = {};
global.users = {};
// global.applications = {};
// global.ips = {};
// global.cities = {};
// // global.redis = Redis.initialize();
// global.cron = Cron.initialize();
