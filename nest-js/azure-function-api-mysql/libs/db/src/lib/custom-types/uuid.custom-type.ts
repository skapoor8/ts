import { parse, stringify, v4 } from 'uuid';
import {
  Type,
  Platform,
  EntityProperty,
  ValidationError,
} from '@mikro-orm/core';
import { DbUuidParseError } from '../errors';

export class UuidType extends Type<string, Buffer> {
  public override convertToDatabaseValue(
    value: string,
    platform: Platform
  ): Buffer {
    try {
      const bin = Buffer.from(parse(value) as Uint8Array);
      return bin;
    } catch (e) {
      throw ValidationError.invalidType(UuidType, value, 'JS');
    }
  }

  public override convertToJSValue(
    value: Buffer | string,
    platform: Platform
  ): string {
    try {
      let st;
      if (value instanceof Buffer) {
        st = stringify(value);
      } else {
        st = stringify(Buffer.from(value));
      }
      return st;
    } catch (e) {
      throw ValidationError.invalidType(UuidType, value, 'database');
    }
  }

  public override getColumnType(prop: EntityProperty, platform: Platform) {
    return `BINARY(16)`;
  }
}

// local utils -----------------------------------------------------------------
function toMySQLBinary(uuidString: string) {
  if (!uuidString)
    throw new DbUuidParseError('toMySQLBinary: empty string is invalid uuid');
  try {
    return Buffer.from(parse(uuidString) as Uint8Array);
  } catch (e) {
    throw new DbUuidParseError('toMySQLBinary: failed to parse');
  }
}
