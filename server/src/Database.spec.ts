import { Database } from './Database';
import { Style, StyleProps } from './Style';
import { LetterProps, Letter } from './Letter';
import 'mocha';
import { expect }  from 'chai';
import * as redis from 'redis';

const redisClient = redis.createClient(6379);
const db = new Database(redisClient);

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

beforeEach(async () => {
	await db.setLetters([]);
	await db.setBoard(new Style(board));
});

after(async () => {
	redisClient.end(false);
})

describe('Database', () => {
	it('should have no letters', async () => {
		await db.setLetters([]);
		const letters = await db.getLetters();
		expect(letters).to.eql([]);
	});

	it('should store a board', async () => {
		const data = Database.generateData();
		await db.setBoard(new Style(data.board));

		const board = await db.getBoard();

		expect(board).deep.eq(new Style(data.board));
	});

	it('should store letters', async () => {
		const data = Database.generateData();
		const inLetters = data.letters.map(v => new Letter(v));
		await db.setLetters(inLetters);

		const outLetters = await db.getLetters();

		expect(outLetters).deep.eq(inLetters);
	});

	it('should retrieve a single letter', async () => {
		const data = Database.generateData();
		const inLetters = data.letters.map(v => new Letter(v));
		await db.setLetters(inLetters);
		
		const index = 0;
		const outLetter = await db.getLetter(index);

		expect(outLetter).deep.eq(inLetters[index]);
	});

	it('should update a letter position', async () => {
		const data = Database.generateData();
		const inLetters = data.letters.map(v => new Letter(v));
		await db.setLetters(inLetters);

		const index = 0;
		const inLetter = inLetters[index];

		inLetter.style.top = '10em';
		inLetter.style.left = '10em';

		await db.updateLetterPosition(index, inLetter);

		const outLetter = await db.getLetter(index);
		
		expect(inLetter).deep.eq(outLetter);
	});

	it('should update a letter transform', async () => {
		const data = Database.generateData();
		const inLetters = data.letters.map(v => new Letter(v));
		await db.setLetters(inLetters);

		const index = 0;
		const inLetter = inLetters[index];

		inLetter.style.transform = 'matrix(0.99942, 0.0340418, -0.0340418, 0.99942, 0, 0)';
		inLetter.style.transformOrigin = '19.5469px 16px';

		await db.updateLetterTransform(index, inLetter);

		const outLetter = await db.getLetter(index);

		expect(inLetter).deep.eq(outLetter);
	});
});