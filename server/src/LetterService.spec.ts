import * as redis from 'redis';
import { Database } from './Database';
import { Style, StyleProps } from './Style';
import { Letter, LetterProps } from './Letter';
import * as restify from 'restify';
import { LetterService } from './LetterService';
import 'mocha';
import { expect } from 'chai';
import * as supertest from 'supertest';

const board: StyleProps = {
	backgroundColor: '#ccc',
	border: '1px solid #000',
	fontSize: '2em',
	width: '20em',
	height: '20em',
	position: 'relative',
	margin: '0 auto',
	boxShadow: '0px 0px 32px -10px #000',
	transform: '',
	transformOrigin: ''
};
const letters: LetterProps[] = [
	{
		"id": 0,
		"value": "A",
		"style": {
			"left": "2.5832553069857456em",
			"top": "2.1461631702754715em",
			"color": "blue",
			"fontSize": "2em"

		}
	},
	{
		"id": 1,
		"value": "B",
		"style": {
			"left": "1.2603961005315016em",
			"top": "4.984990593571006em",
			"color": "purple",
			"fontSize": "2em"
		}
	},
	{
		"id": 2,
		"value": "C",
		"style": {
			"left": "8.162745940899018em",
			"top": "7.113235340583489em",
			"color": "yellow",
			"fontSize": "2em"
		}
	}
];


const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;
const SERVICE_PORT = 3001;

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
const db = new Database(redisClient);

let letterService: LetterService;
let restifyServer: restify.Server;

beforeEach(async () => {
	await db.setLetters([]);
	await db.setBoard(new Style(board));
	restifyServer = restify.createServer();
	letterService = new LetterService(
		new Database(redisClient),
		restifyServer
	);
	letterService.init();
});

after(async () => {
	redisClient.end(false);
});

describe('Letter Service', () => {
	it('GET / responds with a string', (done) => {
		(async () => {
			supertest(restifyServer)
				.get('/')
				.end((err: Error | null, res: supertest.Response) => {
					expect(res.status).to.equal(200);
					expect(res.body).to.be.a('string');
					expect(res.body).to.equal('Hi!');
					done();
				});
		})();
	});
	it('GET /letters responds with JSON array', (done) => {
		(async () => {
			await db.setLetters(letters.map(v => new Letter(v)));
			supertest(restifyServer)
				.get('/letters')
				.end((err: Error | null, res: supertest.Response) => {
					expect(res.status).to.equal(200);
					expect(res.body).to.be.an('array');
					expect(res.body).to.deep.equal(letters);
					done();
				});
		})();
	});
	it('GET /board responds with JSON object', (done) => {
		(async () => {
			await db.setBoard(new Style(board));
			supertest(restifyServer)
				.get('/board')
				.end((err: Error | null, res: supertest.Response) => {
					expect(err).to.equal(null);
					expect(res.status).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(board).to.deep.eq(res.body);
					done();
				});
		})();
		
	});
	it('GET /letters/:index responds with a JSON object', (done) => {
		(async () => {
			await db.setLetters(letters.map(v => new Letter(v)));
			const letter = letters[0];
			supertest(restifyServer)
				.get('/letters/0')
				.end((err: Error | null, res: supertest.Response) => {
					expect(err).to.equal(null);
					expect(res.status).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(letter).to.deep.equal(res.body);
					done();
				});
		})();
	});
	it('PUT /letters/:index updates letter transform and position, responds with a JSON object', (done) => {
		(async () => {
			await db.setLetters(letters.map(v => new Letter(v)));
			const letter = letters[0];
			letter.style.left = '15em';
			letter.style.top = '15em';
			letter.style.transform = 'matrix(0.99942, 0.0340418, -0.0340418, 0.99942, 0, 0)';
			letter.style.transformOrigin = '19.5469px 16px';
			supertest(restifyServer)
				.put('/letters/0')
				.send(letter)
				.end((err: Error | null, res: supertest.Response) => {
					expect(err).to.equal(null);
					expect(res.status).to.equal(200);
					expect(res.body).to.be.an('object');
					expect(letter).to.deep.equal(res.body);
					done();
				});
		})();
	});
});