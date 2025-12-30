import { _attack, _attackBot } from './attack.action';
import { _setIsReady } from './set-is-ready.action';
import { _setupBoard } from './setup-board.action';
import { _updateColor } from './update-color.action';
import { _updateTeam } from './update-team.action';

export const Actions = {
	attack: _attack,
	attackBot: _attackBot,
	updateColor: _updateColor,
	updateTeam: _updateTeam,
	setupBoard: _setupBoard,
	setIsReady: _setIsReady,
};
