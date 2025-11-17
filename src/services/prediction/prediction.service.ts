import { GameIDs } from '@constants';
import axios from 'axios';

const API_URL = process.env.PREDICTION_API_URL || 'http://predicion-api';

export const PredictionService = {
	fetch: _fetch,
};

interface Props {
	game: GameIDs;
	board: number[];
	player: number;
}

interface APIResponse {
	logits: number[];
	move: number;
	probs: number[];
}

async function _fetch({ game, board, player }: Props): Promise<number> {
	try {
		const url = `${API_URL}/predict/${game.toLowerCase()}/`;
		const response = await axios.post<APIResponse>(url, {
			board: board,
			player: player,
		});
		const data = response.data;
		return data.move;
	} catch (err) {
		throw new Error(`Error fetching prediction data: ${err}`);
	}
}
