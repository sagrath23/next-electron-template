
import { app, BrowserWindow, ipcMain } from 'electron';
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handler = nextApp.getRequestHandler();

let win: BrowserWindow | null;

function createWindow() {
	nextApp
	.prepare()
	.then(() => {
		const server = createServer((req, res) => {
			if (req.headers['user-agent']?.indexOf('Electron') === -1) {
				res.writeHead(404);
				res.end();
				return;
			}

			res.setHeader('Access-Control-Request-Method', 'GET');

			if (req.method !== 'GET') {
				res.writeHead(405);
				res.end('Method Not Allowed');
				return;
			}

			return handler(req, res);
		});

		server.listen(3000, () => {
			win = new BrowserWindow({
				height: 768,
				width: 1024,
			});

			win.loadURL('http://localhost:3000');

			if (dev) {
				win.webContents.openDevTools();
			}

			win.on('close', () => {
				win = null;
				server.close();
			});
		});
	});
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

ipcMain.on('message', (event, message) => {
	event.sender.send('message', message);
});

export default function dump() {};
