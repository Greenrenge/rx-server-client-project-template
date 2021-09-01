import {decode, encode, EncodeOptions} from '@msgpack/msgpack';
import {deflateSync, inflateSync} from 'zlib';

export class MsgpackJsonEncoder<T> {
   private static readonly msgpackOptions: EncodeOptions = {
      ignoreUndefined: true,
   };

   decode(input: Buffer): T {
      const buffer = Buffer.from(input, input.byteOffset, input.byteLength);
      const encoded = inflateSync(buffer);
      return decode(encoded) as T;
   }

   encode(input: unknown): Buffer {
      const encoded = encode(input, MsgpackJsonEncoder.msgpackOptions);
      const buffer = Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
      return deflateSync(buffer);
   }
}
