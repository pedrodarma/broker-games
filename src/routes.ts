import { Router } from 'express';
import GameRoomController from './contollers/game_room';
import GamesController from './contollers/games';
import UsersController from './contollers/users';

const router: Router = Router();

router.get('/', async (req, res) => {
	res.send('Games Broker');
});

router.get('/healthcheck', (req, res) => res.sendStatus(200));

router.post('/game/create', GameRoomController.create);
router.get('/game/create', GameRoomController.create);
router.get('/game/create/:gameId', GameRoomController.create);

router.get('/games', GamesController.list);
router.get('/games/live', GamesController.listLive);
router.get('/users', UsersController.list);

export { router };
