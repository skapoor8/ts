import { ICat } from '@app/interfaces';
import { CatModel } from '@app/models';
import { Container, PatchRequestBody } from '@azure/cosmos';
import { CosmosPartitionKey, InjectModel } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid4 } from 'uuid';

export class NullArgumentError extends Error {
  constructor(message?) {
    super(message);
    this.name = 'NullArgumentError';
  }
}

export class CosmosError extends Error {
  constructor(message?) {
    super(message);
    this.name = 'CosmosError';
  }
}

export class CosmosNotFoundError extends Error {
  constructor(message?) {
    super(message);
    this.name = 'CosmosNotFoundError';
  }
}

@Injectable()
export class CatsRepository {
  constructor(
    @InjectModel(CatModel)
    private readonly _catContainer: Container,
    private _configService: ConfigService,
  ) {}

  async index() {
    const querySpec = {
      query: 'SELECT * FROM root r',
    };
    const { resources } = await this._catContainer.items
      .query<ICat>(querySpec)
      .fetchAll();
    return resources;
  }

  async addOne(aCat: ICat) {
    if (!aCat) {
      throw new NullArgumentError(
        'CatsRepository.addOne requires a non-null argument',
      );
    }
    try {
      aCat.id = uuid4();
      console.log('Adding a new cat:', aCat);
      const { resource } = await this._catContainer.items.create(aCat);
      console.log('Success:', resource);
      return resource;
    } catch (e) {
      throw new CosmosError(e);
    }
  }

  async findOne(id: string, breed?: string) {
    if (!id) {
      throw new NullArgumentError(
        'CatsRepository.findOne expects a non-null id',
      );
    }
    try {
      console.log(`Finding cat with id: ${id}, breed: ${breed}`);
      const { resource } = await this._catContainer.item(id, id).read();
      console.log('Success:', resource);
      return resource;
    } catch (e) {
      throw new CosmosError(e);
    }
  }

  // todo: this should be partial update, and called in @Patch instead of @Put
  async updateOne(id: string, aCat: ICat) {
    if (!aCat) {
      throw new NullArgumentError(
        `CatsRepository.updareOne requires non-null argument. Given: ${JSON.stringify(
          aCat,
        )}`,
      );
    }
    try {
      console.log('Updating cat with id:', id, 'updates:', aCat);
      const patchBody: PatchRequestBody = [];
      for (const key in aCat) {
        patchBody.push({
          op: 'set',
          path: `/${key}`,
          value: aCat[key],
        });
      }
      const { resource } = await this._catContainer
        .item(id, id)
        .patch(patchBody);
      return resource;
    } catch (e) {
      throw new CosmosError(e);
    }
  }

  async deleteOne(id: string) {
    if (!id) {
      throw new NullArgumentError(
        'CatsRepository.deleteOne: expected id but none provided',
      );
    }

    try {
      const response = await this._catContainer.item(id, id).delete();
      console.log('Delete response:', response);
    } catch (e) {
      // console.log('e:\n', e.code, e);
      switch (e.code) {
        case 404:
          throw new CosmosNotFoundError();
        default:
          console.error(e);
          throw new CosmosError();
      }
    }
  }
}
