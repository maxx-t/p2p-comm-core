import { IBasePacket, OBasePacket, BasePacket, MetaInterface, util} from '@p2p-comm/base';
import { PacketTypesI, types } from './types';

export interface IHandshakePacket extends IBasePacket {
  port: number;
  host?: string;
  peerId: string;
}
export interface OHandshakePacket extends OBasePacket {
  type: PacketTypesI['HANDSHAKE'];
  port: number;
  host: string;
  peerId: string;
}
export class HandshakePacket extends BasePacket<IHandshakePacket, OHandshakePacket> implements OHandshakePacket {

  static type = types.HANDSHAKE;
  public type = types.HANDSHAKE;
  public port: number;
  public host: string;
  public peerId: string;

  static fromObject(obj: IHandshakePacket) {
    return (new this()).fromOptions(obj);
  }

  static fromRaw(buf: Buffer): HandshakePacket {
    return (new this()).fromRaw(buf);
  }

  protected fromRaw(buf: Buffer) {
    super.fromRaw(buf);
    const [peer] = util.decodePeer(buf, util.metaLength);
    this.port = peer.port;
    this.host = peer.host;
    this.peerId = peer.peerId;
    return this;
  }

  protected fromOptions(opts: IHandshakePacket) {
    super.fromOptions(opts);
    this.port = opts.port;
    this.host = opts.host || 'localhost';
    this.peerId = opts.peerId;
    return this;
  }

  toJSON(): OHandshakePacket & MetaInterface {
    return Object.assign(this.getMeta(), {
      peerId: this.peerId,
      port: this.port,
      host: this.host,
      type: this.type
    });
  }

  toRaw(): Buffer {
    const info = util.encodePeer(this);
    const meta = this.encodeRawMeta();
    return Buffer.concat([meta, info]);
  }

  getSize() {
    return 4 + (4 + this.host.length) + (4 + this.peerId.length / 2);
  }

}
