import { Pool } from './pool';

import { randomBytes } from 'crypto';
import { EventEmitter } from 'events';
import { AbstractTransport, AbstractServer } from '../transport/transport';

export class P2PNode<T extends AbstractTransport> extends EventEmitter {

  pool: Pool<T>;
  id: string;

  constructor({ seed }, Transport: typeof AbstractTransport, Server: typeof AbstractServer) {
    super();
    this.id = randomBytes(8).toString('hex');
    this.pool = new Pool({ seed, nodeId: this.id }, Transport, Server);
    this.pool.on('listening', (data) => this.emit('listening', data));
    this.pool.on('data', (data) => this.emit('data', data));
    this.pool.on('peer', (peer) => this.emit('peer', peer));
    this.pool.on('error', (err) => this.emit('error', err));
  }

  listen(port?: number) {
    this.pool.listen(port);
  }

  send(data: Buffer) {
    this.pool.send(data);
  }

}
