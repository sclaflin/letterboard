import * as redis from 'redis';
import { Database } from './Database';
import { createServer } from 'restify';
import { LetterService } from './LetterService';
import { errConcat } from './Utils';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const SERVICE_PORT = Number(process.env.SERVICE_PORT || 3001);

(async() => {
	try {
		const letterService = new LetterService(
			new Database(redis.createClient(REDIS_PORT, REDIS_HOST)),
			createServer()
		);
		await letterService.init();
		await letterService.listen(SERVICE_PORT);
		console.log('listening at %s', letterService.url);
	}
	catch(e) {
		console.error(errConcat(e, new Error('Failed to start the letterService.')));
		process.exit(1);
	}
})();