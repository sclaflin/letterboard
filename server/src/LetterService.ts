import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import { Style } from './Style';
import { Letter } from './Letter';
import { Database } from './Database';

export class LetterService {
	private _database: Database;
	private _server: restify.Server;
	constructor(database: Database, server: restify.Server) {
		this._database = database;
		this._server = server;
	}
	async init(): Promise<void> {
		await this.initDatabase();
		this.initServer();
	}
	async listen(port: number): Promise<void> {
		return new Promise((resolve, reject) =>
			this._server.listen(port, () => resolve())
		);
	}
	get url(): string {
		return this._server.url;
	}
	private async initDatabase(): Promise<void> {
		if(!await this._database.getBoard()) {
			const data = Database.generateData();
			await this._database.setBoard(new Style(data.board));
			await this._database.setLetters(data.letters.map(v => new Letter(v)));
		}
	}
	private initServer(): void {
		const cors = corsMiddleware({
			origins: ['*'],
			allowHeaders: [],
			exposeHeaders: []
		});
		this._server.pre(cors.preflight);
		this._server.use(cors.actual);
		this._server.use(restify.plugins.acceptParser(this._server.acceptable));
		this._server.use(restify.plugins.queryParser());
		this._server.use(restify.plugins.bodyParser());
		this._server.get('/', async (req, res, next) => {
			res.send('Hi!');
			return next();
		});
		this._server.get('/board', async (req, res, next) => {
			try {
				res.send(await this._database.getBoard());
				return next();
			}
			catch(e) { return next(e); }
		});
		this._server.get('/letters', async (req, res, next) => {
			try {
				res.send(await this._database.getLetters());
				return next();
			}
			catch(e) { return next(e); }
		});
		this._server.get('/letters/:index', async (req, res, next) => {
			try {
				const index: number = Number(req.params.index);
				res.send(await this._database.getLetter(index));
				return next();
			}
			catch(e) { return next(e); }
		});
		this._server.put('/letters/:index', async (req, res, next) => {
			try {
				const index: number = Number(req.params.index);
				const letter = new Letter(req.body);

				await this._database.updateLetterPosition(index, letter);
				await this._database.updateLetterTransform(index, letter);
				res.send(await this._database.getLetter(index));
				return next();
			}
			catch(e) { return next(e); }
		});
	}
}