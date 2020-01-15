# Letterboard application stack

## About This App

This is a full-stack application leveraging Typescript, React, NodeJS and Redis.  This is a pet project to better familiarize myself with React, Typescript, containerization, and microservices.

A letterboard is simply a space that allows letters to be individually arranged.  Each instance of the client application draws from the same source of letters and their positioning.  Moving letters on any instance of the letterboard will be reflected in all other instances of the letterboard.

## Requirements

 - Docker
 - NodeJS & NPM

## Unit Tests

### Server

Change to the server directory: `$ cd ./server`
- Start a docker image of redisjson to test against: `$ npm run start-redisjson`
- Run the unit tests: `$ npm test`
- Stop the docker image of redisjson: `$ npm stop-redisjson`

### Client

- Change to the client directory: `cd ./client`

## Running This App

From the home folder, run the following commands:

`$ docker-compose up --build -d`

LetterService API documentation can be found at:

http://localhost:3001/api-docs

Letterboard application can be found at:

http://localhost:3000

To shutdown cleanly with no docker artifacts (other than the images generated):

`$ docker-compose down -v`

## Modifying This App

The `docker-compose.yml` file runs the client and server projects in development mode.  Source files are watched for changes on disk and will restart each service when a source file has been modified.

If you would like to run a debug session, it's easiest to open the server and client projects in their own VS Code instance.  From there, VS Code should be configured to debug interactively.