
import {parse} from 'uuid';

export function toMySQLBinary(uuidString: string) {
  // @ts-ignore
  return Buffer.from(parse(uuidString));
}