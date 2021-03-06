import * as redis from 'redis';
import * as Utils from './Utils';
import { Style, StyleProps } from './Style';
import { Letter, LetterProps } from './Letter';


export class Database {
	private _client: redis.RedisClient;
	constructor(client: redis.RedisClient) {
		this._client = client;
	}
	static generateData() {
		const BOARD_STYLE: StyleProps = {
			backgroundColor: '#ccc',
			border: '1px solid #000',
			fontSize: '2em',
			width: '20em',
			height: '20em',
			position: 'relative',
			margin: '0 auto',
			boxShadow: '0px 0px 32px -10px #000'
		};
		const getRandomEm = () => {
			return Math.random() * 9 +'em';
		}
		const colors = [
			'red',
			'blue',
			'yellow',
			'green',
			'purple',
			'orange'
		]
		const getRandomColor = () => {
			return colors[Math.floor(Math.random() * colors.length)];
		}
		//letters and quantities using scrabble tile set quantities. ;)
		const letters: { [key: string]: number } = {
			A:	9,
			B:	2,
			C:	2,
			D:	4,
			E:	12,
			F:	2,
			G:	3,
			H:	2,
			I:	9,
			J:	1,
			K:	1,
			L:	4,
			M:	2,
			N:	6,
			O:	8,
			P:	2,
			Q:	1,
			R:	6,
			S:	4,
			T:	6,
			U:	4,
			V:	2,
			W:	2,
			X:	1,
			Y:	2,
			Z:	1
		};
		return {
			board: BOARD_STYLE,
			letters: Object.keys(letters).map((value: string) => value.repeat(letters[value])).join('').split('').map((v, index) => {
				const letterProps = {
					id: index,
					value: v,
					style: {
						left: getRandomEm(),
						top: getRandomEm(),
						color: getRandomColor(),
						fontSize: '2em'
					}
				} as LetterProps;
		
				return letterProps;
			})
		};
	}
	async getLetters(): Promise<Letter[] | null> {
		const obj: LetterProps[] = JSON.parse(await this.sendCommand('JSON.GET', ['letters', '.']));

		return obj ? obj.map(v => new Letter(v)) : null;
	}
	async setLetters(letters: Letter[]): Promise<void> {
		Utils.validateParam(letters, 'letters', null, [Array]);
		letters.forEach(v => Utils.validateParam(v, 'letter', null, [Letter]));

		await this.sendCommand('JSON.SET', ['letters', '.', JSON.stringify(letters)]);
	}
	async getBoard(): Promise<Style | null> {
		const obj = JSON.parse(await this.sendCommand('JSON.GET', ['board', '.']));
		
		return obj ? new Style(obj) : null;
	}
	async setBoard(style: Style): Promise<void> {
		Utils.validateParam(style, 'style', null, [Style]);

		await this.sendCommand('JSON.SET', ['board', '.', JSON.stringify(style)]);
	}
	async getLetter(index: number): Promise<Letter> {
		Utils.validateParam(index, 'index', ['number']);

		if(!Number.isInteger(index)) throw new TypeError('index must be an integer.');

		return new Letter(JSON.parse(await this.sendCommand('JSON.GET', ['letters', '['+ index +']'])));
	}
	async setLetter(index: number, letter: Letter): Promise<void> {
		Utils.validateParam(index, 'index', ['number']);
		Utils.validateParam(letter, 'letter', null, [Letter]);

		if(!Number.isInteger(index)) throw new TypeError('index must be an integer.');

		await this.sendCommand('JSON.SET', ['letters', '['+ index +']', JSON.stringify(letter)]);
	}
	async updateLetterPosition(index: number, letter: Letter): Promise<void> {
		Utils.validateParam(index, 'index', ['number']);
		Utils.validateParam(letter, 'letter', null, [Letter]);

		if(!Number.isInteger(index)) throw new TypeError('index must be an integer.');

		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.left', JSON.stringify(letter.style.left)]);
		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.top', JSON.stringify(letter.style.top)]);
	}
	async updateLetterTransform(index: number, letter: Letter): Promise<void> {
		Utils.validateParam(index, 'index', ['number']);
		Utils.validateParam(letter, 'letter', null, [Letter]);

		if(!Number.isInteger(index)) throw new TypeError('index must be an integer.');

		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.transform', JSON.stringify(letter.style.transform)]);
		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.transformOrigin', JSON.stringify(letter.style.transformOrigin)]);
	}
	private sendCommand(command: string, args?: string[]): Promise<string> {
		return new Promise((resolve, reject) => {
			this._client.sendCommand(command, args, (err: Error | null, reply: string) => {
				if(err) return reject(err);
				return resolve(reply);
			});
		});
	}
}