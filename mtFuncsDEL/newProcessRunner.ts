export type OutputProcessFunc = (outputLine: string) => any;

export class ProcessRunner {
	_command: string[];
	_path: string | undefined;
	_outputFunction: OutputProcessFunc;
	_process: Deno.ChildProcess | undefined;

	constructor(
		command: string[],
		path: string | undefined,
		outputFunction: OutputProcessFunc,
	) {
		this._command = command;
		this._path = path;
		this._outputFunction = outputFunction;
	}

	start(): void {
		if (this._process) {
			this._outputFunction('Process is already running.');
			return;
		}
		const command = new Deno.Command(this._command[0], {
			args: this._command.slice(1),
			cwd: this._path,
			stdout: 'piped',
			stderr: 'piped',
		});
		const proc = command.spawn();
		this._process = proc;

		this.handleStream(proc.stdout);
		this.handleStream(proc.stderr);
	}

	async stop(): Promise<void> {
		if (!this._process) {
			this._outputFunction('No process is currently running.');
			return;
		}

		if (Deno.build.os === 'windows') {
			const pid = this._process.pid;
			const killCmd = new Deno.Command('taskkill', {
				args: ['/PID', pid.toString(), '/T', '/F'],
				stdout: 'null',
				stderr: 'null',
			});
			const killProcess = killCmd.spawn();
			await killProcess.status;
		} else {
			this._process.kill('SIGTERM');
			await this._process.status;
		}

		this._outputFunction('Process stopped.');
		return;
	}

	//I want to console.log all output from the stream
	handleStream(stream: ReadableStream<Uint8Array>) {
		const textDecoder = new TextDecoder();
		const reader = stream.getReader();

		const read = async () => {
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					break;
				}
				const text = textDecoder.decode(value);
				this._outputFunction(text);
			}
		};

		read().catch((error) => {
			this._outputFunction('[Error] ' + error);
		});
	}
}
