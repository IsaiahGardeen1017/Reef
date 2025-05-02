export type OutputProcessFunc = (outputLine: string) => any;

export class ProcessRunner {
	_command: string[];
	_path: string | undefined;
	_outputFunction: OutputProcessFunc;
	private process: Deno.ChildProcess | null = null;
	private stopRequested = false;

	constructor(
		command: string[],
		path: string | undefined,
		outputFunction: OutputProcessFunc,
	) {
		this._command = command;
		this._path = path;
		this._outputFunction = outputFunction;
	}

	async start(): Promise<void> {
		if (this.process !== null) {
			// Process is already running
			this._outputFunction('Process is already running.');
			return;
		}

		this.stopRequested = false;

		try {
			const command = new Deno.Command(this._command[0], {
				args: this._command.slice(1),
				cwd: this._path,
				stdout: 'piped',
				stderr: 'piped',
			});

			this.process = command.spawn();
			this._outputFunction(`Starting process: ${this._command.join(' ')}`);

			// Handle stdout and stderr concurrently, but don't await them here
			this.handleStream(this.process.stdout, 'stdout');
			this.handleStream(this.process.stderr, 'stderr');

			// Wait for the process to finish
			const status = await this.process.status;
			this._outputFunction(`Process finished with status: ${status.code}`);
		} catch (error) {
			this._outputFunction(
				`Error starting or running process: ${(error as any).message}`,
			);
		} finally {
			// Only clear the process reference here after the process has exited
			this.process = null;
		}
	}

	async stop(): Promise<void> {
		if (this.process === null) {
			this._outputFunction('No process is currently running.');
			return;
		}

		this.stopRequested = true;
		this._outputFunction('Attempting to stop process...');

		try {
			if (Deno.build.os === 'windows') {
				// Use taskkill to kill the process tree on Windows
				const pid = this.process.pid;
				const killCmd = new Deno.Command('taskkill', {
					args: ['/PID', pid.toString(), '/T', '/F'],
					stdout: 'null',
					stderr: 'null',
				});
				const killProcess = killCmd.spawn();
				await killProcess.status;
			} else {
				// On Unix-like systems, kill with SIGKILL
				this.process.kill('SIGKILL');
				await this.process.status;
			}
			this._outputFunction('Process stopped successfully.');
		} catch (error) {
			this._outputFunction(`Error stopping process: ${(error as any).message}`);
		} finally {
			this.process = null;
		}
	}

	private async handleStream(
		stream: ReadableStream<Uint8Array>,
		streamType: 'stdout' | 'stderr',
	): Promise<void> {
		const textDecoder = new TextDecoderStream();
		let leftover = '';

		const lineBreakTransformer = new TransformStream<string, string>({
			transform(chunk, controller) {
				leftover += chunk;
				const lines = leftover.split('\n');
				leftover = lines.pop() || '';

				for (const line of lines) {
					controller.enqueue(line);
				}
			},
			flush(controller) {
				if (leftover) {
					controller.enqueue(leftover);
				}
			},
		});

		try {
			await stream
				.pipeThrough(textDecoder)
				.pipeThrough(lineBreakTransformer)
				.pipeTo(
					new WritableStream({
						write: (line: string) => {
							this._outputFunction(`[${streamType}] ${line}`);
						},
						abort: (reason) => {
							this._outputFunction(
								`[${streamType}] Stream aborted: ${(reason as any)?.message || reason}`,
							);
						},
					}),
				);
		} catch (error) {
			this._outputFunction(
				`Error processing ${streamType} stream: ${(error as any).message}`,
			);
		}
	}
}
