import { Database } from './Database';
import { createServer } from 'restify';
import { LetterService } from './LetterService';
import { errConcat } from './Utils';

const DATABASE_HOST = 'redis';
const DATABASE_PORT = 6379;
const SERVICE_PORT = 3001;

(async() => {
	try {
		const letterService = new LetterService(
			new Database(DATABASE_HOST, DATABASE_PORT),
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