import express from 'express';
import { Router } from 'express';
import GameRoomController from './contollers/game_room';
import GamesController from './contollers/games';
import UsersController from './contollers/users';

/**
 * ### ROUTES
 *
 * - __GET__ => Read
 * - __POST__ => Create
 * - __PUT__ => Update / Create
 * - __DELETE__ => Delete
 * - __PATCH__ => Partial Update
 *
 * #### GET
 *
 * - __Purpose__: Retrieve information(no change in server state)
 * - __Indepotent__: ✅ Yes (calling multiple times won't change the anything)
 *
 * #### POST
 *
 * - __Purpose__: Create a resource or trigger a process that changes the server state
 * - __Indepotent__: ❌ No (calling multiple times will create multiple resources or trigger the process multiple times)
 *
 * #### PUT
 *
 * - __Purpose__: Update a resource or create it if it doesn't exist
 * - __Indepotent__: ✅ Yes (calling multiple times with the same data will result in the same state)
 *
 * #### DELETE
 *
 * - __Purpose__: Remove a resource
 * - __Indepotent__: ✅ Yes (calling multiple times will result in the same state, the resource being absent)
 *
 * #### PATCH
 *
 * - __Purpose__: Partially update a resource
 * - __Indepotent__: ⚠ Deepends on implementation (calling multiple times with the same data may or may not result in the same state)
 *
 * ---
 * <br/>&nbsp;<br/>
 */
const router: Router = Router();

router.get('/', async (req, res) => {
	res.send('Games Broker');
});

router.get('/healthcheck', (req, res) => res.sendStatus(200));

router.post('/game/create', express.json(), GameRoomController.create);

router.get('/games', GamesController.list);
router.get('/games/live', GamesController.listLive);

router.get('/users/:userId', UsersController.get);
router.get('/users', UsersController.list);

export { router };
