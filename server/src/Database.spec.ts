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

		expect(board).deep.eq(data.board);
	});

	it('should store letters', async () => {
		const data = Database.generateData();
		await db.setLetters(data.letters.map(v => new Letter(v)));

		const letters = await db.getLetters();

		expect(letters).deep.eq(data.letters);
	});

	it('should retrieve a single letter', async () => {
		await db.setLetters(letters.map(v => new Letter(v)));
		const id = 0;
		const letter = await db.getLetter(id);

		expect(letter.id).equals(id);
	});

	it('should update a letter position', async () => {
		await db.setLetters(letters.map(v => new Letter(v)));
		const id = 0;
		const letter = await db.getLetter(id);

		letter.style.top = '10em';
		letter.style.left = '10em';

		await db.updateLetterPosition(id, letter);

		const letter2 = await db.getLetter(id);

		expect(letter.style.top).equals(letter2.style.top);
		expect(letter.style.left).equals(letter2.style.left);
	});

	it('should update a letter transform', async () => {
		await db.setLetters(letters.map(v => new Letter(v)));
		const id = 0;
		const letter = await db.getLetter(0);

		letter.style.transform = 'matrix(0.99942, 0.0340418, -0.0340418, 0.99942, 0, 0)';
		letter.style.transformOrigin = '19.5469px 16px';

		await db.updateLetterTransform(id, letter);

		const letter2 = await db.getLetter(id);

		expect(letter.style.transform).equals(letter2.style.transform);
		expect(letter.style.transformOrigin).equals(letter2.style.transformOrigin);
	});
});