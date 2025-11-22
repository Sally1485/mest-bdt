import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, AnyKeys, RootFilterQuery, UpdateQuery } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(doc: AnyKeys<User>) {
    return this.userModel.insertOne(doc);
  }

  countDocuments(filter: RootFilterQuery<User>) {
    return this.userModel.countDocuments(filter);
  }

  findAll(filter: RootFilterQuery<User>) {
    return this.userModel.find(filter);
  }

  findOne(filter: RootFilterQuery<User>) {
    return this.userModel.findOne(filter);
  }

  updateOne(filter: RootFilterQuery<User>, update: UpdateQuery<User>) {
    return this.userModel.updateOne(filter, update);
  }

  deleteOne(filter: RootFilterQuery<User>) {
    return this.userModel.deleteOne(filter);
  }
}
