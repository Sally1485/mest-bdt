import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, AnyKeys, QueryFilter, UpdateQuery } from 'mongoose';
import { Response } from './schemas/response.schema';
import { BmcAnalytics, computeBmcAnalytics } from './bmc-analytics';

// 24-char hex string — the canonical Mongo ObjectId wire format. A malformed
// id short-circuits to a 404 instead of triggering a Mongoose CastError 500.
const OBJECT_ID_HEX_REGEX = /^[0-9a-fA-F]{24}$/;

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<Response>,
  ) {}

  create(doc: AnyKeys<Response>) {
    return this.responseModel.insertOne(doc);
  }

  countDocuments(filter: QueryFilter<Response>) {
    return this.responseModel.countDocuments(filter);
  }

  findAll(filter: QueryFilter<Response>) {
    return this.responseModel.find(filter);
  }

  findOne(filter: QueryFilter<Response>) {
    return this.responseModel.findOne(filter);
  }

  updateOne(filter: QueryFilter<Response>, update: UpdateQuery<Response>) {
    return this.responseModel.updateOne(filter, update);
  }

  deleteOne(filter: QueryFilter<Response>) {
    return this.responseModel.deleteOne(filter);
  }

  /**
   * Compute BMC diagnostic analytics for a single Response.
   *
   * Loads the Response by id, parses its stringified `data` payload, and runs
   * the per-block score/percentage computation (see {@link computeBmcAnalytics}).
   * A malformed id, a missing Response, or unparseable `data` all surface as a
   * 404 so the route never leaks a 500 on bad input.
   */
  async getAnalytics(id: string): Promise<BmcAnalytics> {
    if (!OBJECT_ID_HEX_REGEX.test(id)) {
      throw new NotFoundException('Response not found.');
    }

    const response = await this.responseModel.findOne({ _id: id }).exec();
    if (!response) {
      throw new NotFoundException('Response not found.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(response.data);
    } catch {
      throw new NotFoundException('Response data is not valid JSON.');
    }

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new NotFoundException('Response data is not a valid object.');
    }

    return computeBmcAnalytics(parsed as Record<string, unknown>);
  }
}
