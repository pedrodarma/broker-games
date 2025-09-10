interface Props {
	error: Error;
	restart: () => void;
}

export function _onError({ error, restart }: Props) {
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
