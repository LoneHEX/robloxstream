import { WebSocket, WebSocketServer } from 'ws';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import { createWriteStream, readFile, writeFileSync } from 'fs';
import robotjs from 'robotjs';
import { exit } from 'process';
import Jimp from 'jimp';
import path from 'path';

function screenshot() {
    return new Promise<Buffer>((resolve, reject) => {
        const process = spawn(path.resolve('screenshot.exe'));
        process.on('exit', () => {
            readFile(path.resolve('screenshot.png'), (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        });
    })
}

function getScreenPixels() {
	console.time();
	const bitmap = robotjs.screen.capture(0, 0, 1920, 1080);
	console.timeEnd();

	const perPixel = bitmap.bytesPerPixel;
	const buff: Buffer = bitmap.image;
	for (let i = 0; i < buff.length; i += bitmap.bytesPerPixel) {
		const r = buff[i];
		const g = buff[i + 1];
		const b = buff[i + 2];
		console.log([r, g, b]);
	}
}

/*
const process = spawn(
	ffmpeg,
	[
		'-f',
		'gdigrab',
		'-framerate',
		'1',
		'-i',
		'desktop',
		'-f',
		'rawvideo',
		'-pixel_format',
		'rgb24',

		'-'
	],
	{ stdio: 'pipe' }
);*/

/**
 * 	[
		'-probesize',
		'10M',
		'-f',
		'gdigrab',
		'-framerate',
		'60',
		'-i',
		'desktop',
		'-f',
		'flv',
		'-'
	],
 */


let connections: WebSocket[] = [];

setInterval(async () => {

	const ss = await screenshot();

	connections.forEach(conn => {
		conn.send(ss, err => {
			if (err) {
				console.log('Error: ' + err);
			}
		});
	});
}, 1000/20);
/*
stream.on('data', (chunk: Buffer) => {
	connections.forEach(connection => {
		connection.send(
			JSON.stringify({
				id: 'video',
				data: chunk
			})
		);
	});
});*/

const wss = new WebSocketServer({
	port: 90
});

wss.on('connection', ws => {
	console.log('Got connection!');
	connections.push(ws);
});

wss.on('listening', () => {
	console.log('WebSocket server listening!');
});
