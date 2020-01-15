import * as restify from 'restify';
import * as corsMiddleware from 'restify-cors-middleware';
import * as restifySwaggerJsDoc from 'restify-swagger-jsdoc';
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
		restifySwaggerJsDoc.createSwaggerPage({
			title: 'LetterService API',
			description: 'LetterService API information',
			version: '0.0.0',
			server: this._server,
			path: '/api-docs',
			apis: ['**/*.ts'],
			definitions: {
				Style: {
					type: 'object',
					properties: {
						backgroundColor: {
							type: 'string'
						},
						border: {
							type: 'string'
						},
						color: {
							type: 'string'
						},
						fontSize: {
							type: 'string'
						},
						width: {
							type: 'string'
						},
						height: {
							type: 'string'
						},
						position: {
							type: 'string'
						},
						left: {
							type: 'string'
						},
						top: {
							type: 'string'
						},
						transform: {
							type: 'string'
						},
						transformOrigin: {
							type: 'string'
						},
						margin: {
							type: 'string'
						},
						boxShadow: {
							type: 'string'
						}
					}
				},
				Letter: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
							format: 'int64'
						},
						value: {
							type: 'string',
							minLength: 1,
							maxLength: 1
						},
						style: {
							$ref: '#/definitions/Style'
						}
					},
					required: ['id']
				},
				ArrayOfLetter: {
					type: 'array',
					items: {
						$ref: '#/definitions/Letter'
					}
				}
			}
		});
		/**
		 * @swagger
		 *
		 * /:
		 *   get:
		 *     summary: Says hi!
		 *     produces:
		 *       - application/json
		 *     responses:
		 *       200:
		 *         description: Friendly greeting.
		 */
		this._server.get('/', async (req, res, next) => {
			res.send('Hi!');
			return next();
		});

		/**
		 * @swagger
		 *
		 * /board:
		 *   get:
		 *     tags:
		 *       - Board
		 *     summary: Returns the board CSS style properties
		 *     produces:
		 *       - application/json
		 *     responses:
		 *       200:
		 *         description: OK
		 *         schema:
		 *           $ref: '#/definitions/Style'
		 */
		this._server.get('/board', async (req, res, next) => {
			try {
				res.send(await this._database.getBoard());
				return next();
			}
			catch(e) { return next(e); }
		});

		/**
		 * @swagger
		 *
		 * /letters:
		 *   get:
		 *     tags:
		 *       - Letter
		 *     summary: Returns all Letter properties
		 *     produces:
		 *       - application/json
		 *     responses:
		 *       200:
		 *         description: OK
		 *         schema:
		 *           $ref: '#/definitions/ArrayOfLetter'
		 */
		this._server.get('/letters', async (req, res, next) => {
			try {
				res.send(await this._database.getLetters());
				return next();
			}
			catch(e) { return next(e); }
		});

		/**
		 * @swagger
		 *
		 * /letters/{index}:
		 *   get:
		 *     tags:
		 *       - Letter
		 *     summary: Returns proprties for letter by index
		 *     parameters:
		 *       - name: index
		 *         in: path
		 *         required: true
		 *         description: The index number of the letter
		 *         schema:
		 *           type: integer
		 *           format: int32
		 *           minimum: 0
		 *     produces:
		 *       - application/json
		 *     responses:
		 *       200:
		 *         description: OK
		 *         schema:
		 *           $ref: '#/definitions/Letter'
		 */
		this._server.get('/letters/:index', async (req, res, next) => {
			try {
				const index: number = Number(req.params.index);
				res.send(await this._database.getLetter(index));
				return next();
			}
			catch(e) { return next(e); }
		});

		/**
		 * @swagger
		 *
		 * /letters/{index}:
		 *   put:
		 *     tags:
		 *       - Letter
		 *     summary: Updates Letter properties
		 *     description: Only Style.left, Style.top, Style.transform, and Style.transformOrigin properties will be updated.
		 *     parameters:
		 *       - in: path
		 *         name: index
		 *         required: true
		 *         description: The index number of the letter
		 *         schema:
		 *           type: integer
		 *           format: int32
		 *           minimum: 0
		 *       - in: body
		 *         name: letter
		 *         required: true
		 *         description: The letter to update.
		 *         schema:
		 *           $ref: '#/definitions/Letter'
		 *     produces:
		 *       - application/json
		 *     responses:
		 *       200:
		 *         description: OK
		 *         schema:
		 *           $ref: '#/definitions/Letter'
		 */
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