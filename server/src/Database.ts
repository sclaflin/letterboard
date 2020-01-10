import * as redis from 'redis';
import { EventEmitter } from 'events';

const REDIS_DEFAULT_PORT = 6379;

export interface Letter {
	id: number,
	value: string,
	style: Style
}

export interface Style {
	backgroundColor?: string,
	border?: string,
	color?: string,
	fontSize?: string,
	width?: string,
	height?: string,
	position?: string,
	left?: string,
	top?: string,
	transform?: string,
	transformOrigin?: string,
	margin?: string,
	boxShadow?: string
}

export class Database extends EventEmitter {
	private _client: redis.RedisClient;
	constructor(client: redis.RedisClient) {
		super();
		this._client = client;
	}
	static generateData() {
		const BOARD_STYLE: Style = {
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
				};
		
				return letterProps;
			})
		};
	}
	async getLetters(): Promise<Letter[]> {
		return JSON.parse(await this.sendCommand('JSON.GET', ['letters', '.']));
	}
	async setLetters(letters: Letter[]): Promise<void> {
		await this.sendCommand('JSON.SET', ['letters', '.', JSON.stringify(letters)]);
	}
	async getBoard(): Promise<Style> {
		return JSON.parse(await this.sendCommand('JSON.GET', ['board', '.']));
	}
	async setBoard(style: Style): Promise<void> {
		await this.sendCommand('JSON.SET', ['board', '.', JSON.stringify(style)]);
	}
	async getLetter(index: number): Promise<Letter> {
		return JSON.parse(await this.sendCommand('JSON.GET', ['letters', '['+ index +']']));
	}
	async setLetter(index: number, letter: Letter): Promise<void> {
		await this.sendCommand('JSON.SET', ['letters', '['+ index +']', JSON.stringify(letter)]);
	}
	async updateLetterPosition(index: number, letter: Letter): Promise<void> {
		//only update specific properties of the letter
		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.left', JSON.stringify(letter.style.left)]);
		await this.sendCommand('JSON.SET', ['letters', '['+ index +'].style.top', JSON.stringify(letter.style.top)]);
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