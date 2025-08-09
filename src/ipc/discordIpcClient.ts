import { EventEmitter } from 'events';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import { randomUUID } from 'crypto';

type DiscordOpCode = 0 | 1 | 2 | 3; // 0=Handshake,1=Frame,2=Close,3=Ping

export type DiscordActivity = Record<string, unknown>;

export type DiscordIpcClientOptions = {
  clientId: string;
  logger?: { info: (m: string) => void; warn: (m: string) => void; error: (m: string, e?: unknown) => void };
};

export class DiscordIpcClient extends EventEmitter {
  private socket: net.Socket | null = null;
  private readonly clientId: string;
  private readonly logger;
  private reconnecting = false;
  private reconnectDelayMs = 2000;

  constructor(options: DiscordIpcClientOptions) {
    super();
    this.clientId = options.clientId;
    this.logger = options.logger ?? { info: () => {}, warn: () => {}, error: () => {} };
  }

  connect(): void {
    const tryPaths = getCandidatePipes();
    const tryNext = (): void => {
      const next = tryPaths.shift();
      if (!next) {
        this.logger.warn('Discord IPC: no pipe found; scheduling reconnect');
        this.emit('disconnected');
        this.scheduleReconnect();
        return;
      }
      this.logger.info(`Discord IPC: trying ${next}`);
      const socket = net.createConnection(next, () => {
        this.socket = socket;
        this.logger.info('Discord IPC: connected, sending handshake');
        this.send(0, { v: 1, client_id: this.clientId });
        this.emit('connected');
        this.reconnectDelayMs = 2000; // reset backoff on success
      });

      socket.on('error', (err) => {
        this.logger.warn(`Discord IPC socket error: ${(err as Error).message}`);
        socket.destroy();
        this.socket = null;
        tryNext();
      });

      socket.on('close', () => {
        this.logger.warn('Discord IPC: socket closed');
        this.socket = null;
        this.emit('disconnected');
        this.scheduleReconnect();
      });

      socket.on('data', (buf) => {
        // We do not parse responses beyond basic framing at this stage.
        // Discord frames: 8-byte header (opcode:int32LE, len:int32LE) + json payload
        // For simplicity, we may receive multiple frames at once; parse sequentially.
        let offset = 0;
        while (offset + 8 <= buf.length) {
          const op = buf.readInt32LE(offset) as DiscordOpCode;
          const len = buf.readInt32LE(offset + 4);
          const start = offset + 8;
          const end = start + len;
          if (end > buf.length) break;
          const json = buf.slice(start, end).toString('utf8');
          this.logger.info(`Discord IPC: received op=${op} len=${len}`);
          // Optionally inspect READY/ERROR messages for debugging
          this.logger.info(json);
          offset = end;
        }
      });
    };

    tryNext();
  }

  disconnect(): void {
    this.socket?.destroy();
    this.socket = null;
  }

  setActivity(activity: DiscordActivity): void {
    if (!this.socket) return;
    const payload = {
      cmd: 'SET_ACTIVITY',
      args: { pid: process.pid, activity },
      nonce: randomUUID(),
    };
    this.send(1, payload);
  }

  clearActivity(): void {
    if (!this.socket) return;
    const payload = {
      cmd: 'SET_ACTIVITY',
      args: { pid: process.pid },
      nonce: randomUUID(),
    };
    this.send(1, payload);
  }

  private send(op: DiscordOpCode, data: unknown): void {
    if (!this.socket) return;
    const json = Buffer.from(JSON.stringify(data), 'utf8');
    const header = Buffer.alloc(8);
    header.writeInt32LE(op, 0);
    header.writeInt32LE(json.length, 4);
    this.socket.write(Buffer.concat([header, json]));
  }

  private scheduleReconnect(): void {
    if (this.reconnecting) return;
    this.reconnecting = true;
    const delay = Math.min(this.reconnectDelayMs, 30000);
    this.logger.info(`Discord IPC: reconnecting in ${delay}ms`);
    setTimeout(() => {
      this.reconnecting = false;
      this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, 30000);
      this.connect();
    }, delay).unref?.();
  }
}

const getCandidatePipes = (): string[] => {
  const indexes = Array.from({ length: 10 }, (_, i) => i);
  if (process.platform === 'win32') {
    return indexes.map((i) => `\\\\.\\pipe\\discord-ipc-${i}`);
  }
  const home = os.homedir();
  const tmp = process.env.XDG_RUNTIME_DIR ?? process.env.TMPDIR ?? '/tmp';
  const configDirs = [
    path.join(home, '.config'),
    path.join(home, 'snap', 'discord', 'common'),
    '/var/run',
    tmp,
  ];
  const sockets: string[] = [];
  for (const dir of configDirs) {
    for (const i of indexes) sockets.push(path.join(dir, `discord-ipc-${i}`));
  }
  return sockets;
};



